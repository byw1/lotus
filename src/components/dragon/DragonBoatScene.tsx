"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import {
  buildHullGeometry,
  buildStemGeometry,
  buildWaterGeometry,
  CREW,
  HULL,
  seatPosition,
  sheerLine,
} from "./boat-geometry";

/**
 * Red Dragon against Black Dragon, mid-stroke, on Echo Park Lake.
 *
 * The scene is built around one idea: a dragon boat does not move at a
 * constant speed. It surges. Eight paddles catch the water together, the hull
 * jumps forward and pitches down at the bow, and then it glides while the crew
 * recovers. Everything here — the boat's position, its pitch, the ripples off
 * the blades — is driven by a single stroke phase, so the whole picture moves
 * on one beat, which is exactly what the drum at the bow is for.
 *
 * There are two boats because there are always two boats: the races are run
 * head to head, Red Dragon against Black Dragon, and one boat alone on the
 * water would be a picture of a different sport.
 *
 * `still` is not "slower". Under `prefers-reduced-motion` the boat is drawn at
 * the top of the stroke and nothing moves at all.
 */

/** Strokes per second. A racing crew is faster; this is a crew enjoying it. */
const STROKE_RATE = 0.72;

/**
 * A paddler, a paddle and one stroke.
 *
 * The blade pivots about the paddler's outside shoulder rather than about the
 * seat, which is the difference between a stroke and a windscreen wiper. The
 * cycle is deliberately asymmetric — a fast, committed pull through the water
 * and a slower recovery over it — because an even sine wave reads as machinery.
 */
function Paddler({
  position,
  side,
  still,
  blade,
  shirt,
}: {
  position: [number, number, number];
  side: -1 | 1;
  still: boolean;
  /** Blade colour — the crew's livery, so the two boats read apart at a glance. */
  blade: string;
  shirt: string;
}) {
  const arm = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!arm.current) return;
    const phase = still ? 0 : state.clock.elapsedTime * STROKE_RATE * Math.PI * 2;
    // 0 → catch, π → exit. Squaring the recovery half stretches it out.
    const cycle = (Math.sin(phase) + 1) / 2;
    const eased = cycle < 0.5 ? cycle : 0.5 + Math.pow((cycle - 0.5) * 2, 1.6) * 0.5;
    arm.current.rotation.z = side * (-0.62 + eased * 1.24);
    // And the blade lifts clear of the water on the recovery. Without this the
    // paddles sweep back and forth underwater, which is a rowing machine.
    arm.current.position.y = 0.34 + Math.max(0, -Math.sin(phase)) * 0.17;
  });

  return (
    <group position={position}>
      {/* The paddler. A capsule, and nothing more: at this scale a figure with
          a face becomes a doll, and eight of them become a toy. */}
      <mesh position={[0, 0.16, 0]} castShadow>
        <capsuleGeometry args={[0.085, 0.2, 4, 10]} />
        <meshStandardMaterial color={shirt} roughness={0.85} />
      </mesh>

      {/* The paddle, hung off the outboard shoulder. */}
      <group ref={arm} position={[0, 0.34, side * 0.08]}>
        <mesh position={[0, -0.24, side * 0.16]} rotation={[side * 0.55, 0, 0]}>
          <cylinderGeometry args={[0.019, 0.019, 0.62, 6]} />
          <meshStandardMaterial color="#c9a86a" roughness={0.7} />
        </mesh>
        {/*
          The blade tip finishes just under the surface at the catch. Any lower
          and the whole blade swims below the water, where it is both wrong and
          — because the surface is only part-opaque — visible.
        */}
        <mesh position={[0, -0.42, side * 0.3]} rotation={[side * 0.55, 0, 0]}>
          <boxGeometry args={[0.17, 0.28, 0.018]} />
          <meshStandardMaterial color={blade} roughness={0.55} />
        </mesh>
      </group>
    </group>
  );
}

/** The drummer at the bow, facing back down the boat, and the drum. */
function Drummer({
  position,
  still,
  shirt,
}: {
  position: [number, number, number];
  still: boolean;
  shirt: string;
}) {
  const arms = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!arms.current) return;
    const phase = still ? 0 : state.clock.elapsedTime * STROKE_RATE * Math.PI * 2;
    // The stick is up on the recovery and down on the catch — the beat the
    // paddlers are taking their timing from.
    arms.current.rotation.z = -0.35 + Math.max(0, Math.sin(phase)) * 0.5;
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <capsuleGeometry args={[0.085, 0.22, 4, 10]} />
        <meshStandardMaterial color={shirt} roughness={0.85} />
      </mesh>
      <group ref={arms} position={[-0.02, 0.3, 0]}>
        <mesh position={[-0.14, -0.04, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.26, 5]} />
          <meshStandardMaterial color="#c9a86a" roughness={0.7} />
        </mesh>
      </group>

      {/* The drum, on the deck in front of the drummer. */}
      <group position={[-0.34, 0.06, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.19, 0.19, 0.22, 20]} />
          <meshStandardMaterial color={shirt} roughness={0.55} />
        </mesh>
        <mesh position={[0.115, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.185, 0.185, 0.01, 20]} />
          <meshStandardMaterial color="#efe2cc" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

/** The steersman, standing at the stern on the sweep oar. */
function Steersman({
  position,
  still,
  shirt,
}: {
  position: [number, number, number];
  still: boolean;
  shirt: string;
}) {
  const sweep = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!sweep.current) return;
    const time = still ? 0 : state.clock.elapsedTime;
    // Holding a line, not steering hard: a slow correction either way.
    sweep.current.rotation.y = Math.sin(time * 0.34) * 0.12;
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <capsuleGeometry args={[0.085, 0.34, 4, 10]} />
        <meshStandardMaterial color={shirt} roughness={0.85} />
      </mesh>
      <group ref={sweep} position={[0, 0.32, 0]}>
        <mesh position={[-0.5, -0.16, 0.12]} rotation={[0.18, 0, 1.25]}>
          <cylinderGeometry args={[0.018, 0.018, 1.25, 6]} />
          <meshStandardMaterial color="#c9a86a" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * The water the blades leave behind.
 *
 * Six rings, each expanding and fading on its own offset, dropped where the
 * paddles go in. Cheap — six flat rings and no shader — and it is the detail
 * that stops the boat looking like it is parked on a blue floor.
 */
function Ripples({ still, offset = 0 }: { still: boolean; offset?: number }) {
  const group = useRef<THREE.Group>(null);

  const seeds = useMemo(
    () =>
      CREW.filter((member) => member.role === "paddler").map((member, index) => {
        const [x, , z] = seatPosition(member);
        return { x, z: z * 2.1, offset: index * 0.17 };
      }),
    [],
  );

  useFrame((state) => {
    if (!group.current) return;
    const time = still ? 0.55 : state.clock.elapsedTime;

    group.current.children.forEach((ring, index) => {
      const life = (((time * STROKE_RATE + seeds[index].offset + offset) % 1) + 1) % 1;
      const scale = 0.18 + life * 1.5;
      ring.scale.set(scale, scale, scale);
      const material = (ring as THREE.Mesh).material as THREE.MeshBasicMaterial;
      material.opacity = 0.55 * (1 - life) * (1 - life);
    });
  });

  return (
    <group ref={group}>
      {seeds.map((seed, index) => (
        <mesh
          key={index}
          position={[seed.x, 0.012, seed.z]}
          rotation={[-Math.PI / 2, 0, 0]}
          renderOrder={1}
        >
          <ringGeometry args={[0.3, 0.36, 32]} />
          <meshBasicMaterial color="#f4fbff" transparent opacity={0.5} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * The two liveries. Red Dragon and Black Dragon are the boats' actual names on
 * the festival's own race sheet, and the crews wear the boat.
 */
const LIVERY = {
  red: { hull: "red" as const, stem: "#8d2740", shirt: "#2f5f7d", blade: "#8e1f33" },
  black: { hull: "black" as const, stem: "#2b3040", shirt: "#7d5a13", blade: "#232733" },
};

type Livery = (typeof LIVERY)[keyof typeof LIVERY];

function Boat({
  still,
  livery,
  lead = 0,
}: {
  still: boolean;
  livery: Livery;
  /**
   * How far ahead this boat is at rest, in world units. Two boats dead level
   * looks staged; half a length of daylight looks like a race.
   */
  lead?: number;
}) {
  const hull = useMemo(() => buildHullGeometry(livery.hull), [livery.hull]);
  const stem = useMemo(() => buildStemGeometry(), []);
  useLayoutEffect(() => {
    return () => {
      hull.dispose();
      stem.dispose();
    };
  }, [hull, stem]);

  const boat = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!boat.current) return;

    if (still) {
      boat.current.position.set(lead, 0, 0);
      boat.current.rotation.set(0, 0, 0);
      return;
    }

    const time = state.clock.elapsedTime;
    const phase = time * STROKE_RATE * Math.PI * 2;

    // The surge. The hull leaps on the catch and settles through the recovery,
    // pitching bow-down as it goes. Small numbers: at this camera distance a
    // couple of centimetres of travel is already very visible.
    const catchPulse = Math.max(0, Math.sin(phase));
    boat.current.position.x = lead + catchPulse * 0.11 - 0.055;
    boat.current.rotation.z = -catchPulse * 0.022;

    // And the lake underneath it, on a slower and unrelated rhythm.
    boat.current.position.y = Math.sin(time * 0.62) * 0.022;
    boat.current.rotation.x = Math.sin(time * 0.47) * 0.026;
  });

  return (
    <group ref={boat}>
      <mesh geometry={hull} castShadow>
        <meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.4} />
      </mesh>

      {/*
        The stem post at the bow, and its shorter twin at the stern. Both are
        stepped on the gunwale, not on the waterline: the ends of this hull
        sweep up more than half a unit, so a post rooted at y = 0 hangs below
        the bow like a rudder. `sheerLine` is where the timber actually is.
      */}
      <mesh geometry={stem} position={[HULL.length / 2 - 0.2, sheerLine(1) - 0.07, 0]}>
        <meshStandardMaterial color={livery.stem} roughness={0.45} />
      </mesh>
      <mesh
        geometry={stem}
        position={[-HULL.length / 2 + 0.2, sheerLine(0) - 0.06, 0]}
        scale={0.52}
      >
        <meshStandardMaterial color={livery.stem} roughness={0.45} />
      </mesh>

      {CREW.map((member, index) => {
        const position = seatPosition(member);
        if (member.role === "drummer") {
          return <Drummer key={index} position={position} still={still} shirt={livery.stem} />;
        }
        if (member.role === "steersman") {
          return <Steersman key={index} position={position} still={still} shirt={livery.shirt} />;
        }
        return (
          <Paddler
            key={index}
            position={position}
            side={member.side === -1 ? -1 : 1}
            still={still}
            blade={livery.blade}
            shirt={livery.shirt}
          />
        );
      })}
    </group>
  );
}

/** The lake. See `buildWaterGeometry` for why it is a fading disc. */
function Water() {
  const geometry = useMemo(() => buildWaterGeometry(), []);
  useLayoutEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry} position={[0, -0.02, 0]} renderOrder={-1} receiveShadow>
      <meshStandardMaterial
        vertexColors
        transparent
        roughness={0.52}
        metalness={0}
        depthWrite={false}
      />
    </mesh>
  );
}

/**
 * Keeps both boats in frame at any shape of canvas.
 *
 * A perspective camera's `fov` is vertical, so a short wide band gets *more*
 * horizontal coverage and a tall narrow one gets less — but this band is much
 * wider than it is tall on a phone and still cropped the bows, because the
 * camera was placed for a desktop-sized canvas. Rather than guess a fov per
 * breakpoint, this solves for the distance at which the pair actually fits and
 * slides the camera out along the axis it is already on.
 */
const HALF_SPAN = 4.8;
const TARGET: [number, number, number] = [0, 0.02, -0.55];

function FitCamera() {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const vertical = (cam.fov * Math.PI) / 180;
    const horizontal = Math.atan(Math.tan(vertical / 2) * (size.width / size.height));
    const needed = HALF_SPAN / Math.tan(horizontal);
    cam.position.setLength(Math.max(7, needed));
    cam.lookAt(...TARGET);
    cam.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}

type DragonBoatSceneProps = {
  reducedMotion?: boolean;
  className?: string;
  onContextLost?: () => void;
};

export default function DragonBoatScene({
  reducedMotion = false,
  className,
  onContextLost,
}: DragonBoatSceneProps) {
  return (
    <Canvas
      className={className}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [2.9, 1.2, 5.5], fov: 38, near: 0.1, far: 80 }}
      shadows
      onCreated={({ gl, camera }) => {
        // Aim between the two boats rather than at the origin, so the pair is
        // centred in frame instead of the water between them. FitCamera does
        // this again after every resize; this is for the first frame.
        camera.lookAt(...TARGET);
        // No composer on this scene, so the renderer's own tone map is live —
        // unlike the lotus, where postprocessing forces it off. AgX for the
        // same reason: it holds the hulls' red as it brightens instead of
        // pushing it toward orange.
        gl.toneMapping = THREE.AgXToneMapping;
        gl.toneMappingExposure = 1.05;
        if (onContextLost) {
          gl.domElement.addEventListener("webglcontextlost", () => onContextLost(), { once: true });
        }
      }}
      aria-hidden="true"
      frameloop="always"
    >
      <FitCamera />

      <ambientLight intensity={0.5} color="#eef6ff" />
      <hemisphereLight args={["#eaf4ff", "#a7c9e0", 0.62]} />
      <directionalLight
        position={[4.5, 6.5, 4]}
        intensity={1.7}
        color="#fff6e8"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <directionalLight position={[-4, 1.4, 2]} intensity={0.45} color="#cfe3ff" />

      {/*
        Yawed toward the camera rather than square to it. Two boats side-on are
        a diagram; two boats coming at you at an angle are a race, and the yaw
        is also what stops the near hull hiding the far one.
      */}
      <group position={[0, -0.05, 0]} rotation={[0, -0.3, 0]}>
        {/* Red nearest the bank, half a length up. Black behind and outside it,
            which is also the order they come past the crowd. */}
        <group position={[0, 0, 1.6]}>
          <Boat still={reducedMotion} livery={LIVERY.red} lead={0.55} />
          <Ripples still={reducedMotion} />
        </group>
        <group position={[0, 0, -1.6]}>
          <Boat still={reducedMotion} livery={LIVERY.black} />
          <Ripples still={reducedMotion} offset={0.5} />
        </group>

        <Water />

        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.28}
          scale={20}
          blur={2.6}
          far={2.6}
          resolution={512}
          color="#1b4262"
          frames={1}
        />
      </group>

      {/* Sky and bank, built from emissive rectangles — no HDRI in the repo. */}
      <Environment resolution={256} frames={1}>
        <Lightformer
          form="rect"
          intensity={2.4}
          color="#ffffff"
          position={[0, 6, 2]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[14, 10, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0.9}
          color="#9fc6a6"
          position={[0, 0.4, -9]}
          scale={[20, 3, 1]}
        />
        <Lightformer
          form="circle"
          intensity={1.1}
          color="#bcdcff"
          position={[-6, 2, 3]}
          scale={[6, 6, 1]}
        />
      </Environment>
    </Canvas>
  );
}
