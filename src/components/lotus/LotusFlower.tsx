"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import {
  buildMorphingPetal,
  buildReceptacleGeometry,
  buildStamenGeometry,
  seedPositions,
  WHORLS,
  type Whorl,
} from "./petal-geometry";

const RECEPTACLE_RADIUS = 0.29;
const RECEPTACLE_HEIGHT = 0.2;
const STAMEN_COUNT = 190;
const SEED_COUNT = 21;

/** Cubic ease-out. Fast to open, then a long settle — the house curve. */
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

type PetalPlacement = {
  whorl: number;
  /** Azimuth around the flower axis, radians. */
  azimuth: number;
  /** When this petal starts opening, as a fraction of the bloom. */
  delay: number;
  /** Small per-petal variation so the flower is never mechanically regular. */
  jitterPitch: number;
  jitterRoll: number;
  jitterScale: number;
};

/**
 * Deterministic pseudo-random in [-1, 1]. Seeded so the flower is identical on
 * the server, on the client, and between reloads — no hydration surprises and
 * no "it looked different in the screenshot" bugs.
 */
function noise(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

function buildPlacements(): PetalPlacement[] {
  const out: PetalPlacement[] = [];
  const ringCount = WHORLS.length;
  let seed = 1;

  WHORLS.forEach((whorl, w) => {
    for (let i = 0; i < whorl.count; i++) {
      // Even spacing within the ring, with the whole ring rotated by a multiple
      // of the golden angle so no petal sits directly above the one below it.
      const azimuth = whorl.phase + (i / whorl.count) * Math.PI * 2;

      // Outer whorls open first. Within a ring, petals open in a slight
      // sequence rather than all at once, which is what makes it read as a
      // living thing rather than an umbrella.
      const ringDelay = (whorl.bloomOrder / ringCount) * 0.55;
      const withinRing = (i / whorl.count) * 0.14;

      out.push({
        whorl: w,
        azimuth,
        delay: ringDelay + withinRing,
        jitterPitch: noise(seed++) * 0.07,
        jitterRoll: noise(seed++) * 0.09,
        jitterScale: 1 + noise(seed++) * 0.05,
      });
    }
  });

  return out;
}

/** Seconds the flower takes to open from bud to full bloom. */
const BLOOM_DURATION = 5.2;
/** A beat of stillness first, so the page can settle before anything moves. */
const BLOOM_DELAY = 0.35;

export type LotusFlowerProps = {
  /**
   * Pin the flower at a fixed openness — 0 is a closed bud, 1 fully open.
   * Leave it unset and the flower blooms once from the render clock.
   */
  bloom?: number;
  /** Disables the bloom animation and the idle sway, for reduced motion. */
  still?: boolean;
  /** Drops transmission and lowers subdivision on weaker hardware. */
  quality?: "high" | "low";
};

export function LotusFlower({ bloom, still = false, quality = "high" }: LotusFlowerProps) {
  const placements = useMemo(() => buildPlacements(), []);

  // One geometry per whorl, shared by every petal in that ring.
  const petalGeometries = useMemo(
    () =>
      WHORLS.map((w: Whorl) =>
        buildMorphingPetal({
          ...w.petal,
          lengthSegments: quality === "high" ? 30 : 18,
          widthSegments: quality === "high" ? 16 : 10,
        }),
      ),
    [quality],
  );

  const receptacleGeometry = useMemo(
    () => buildReceptacleGeometry(RECEPTACLE_RADIUS, RECEPTACLE_HEIGHT),
    [],
  );
  const stamenGeometry = useMemo(() => buildStamenGeometry(0.26), []);
  const seedGeometry = useMemo(() => new THREE.SphereGeometry(0.028, 10, 8), []);

  /*
   * Dispose each group on its own schedule.
   *
   * The petal geometries and the petal material are rebuilt when the quality
   * tier changes; the pod, seeds and stamens are not. Cleaning them all up in
   * one effect keyed on the petals meant a single quality downgrade disposed
   * the pod and stamens too — still attached to live meshes, and never
   * rebuilt, so the middle of the flower vanished on exactly the low-powered
   * devices the downgrade exists to help.
   */
  useLayoutEffect(() => () => petalGeometries.forEach((g) => g.dispose()), [petalGeometries]);

  useLayoutEffect(
    () => () => {
      receptacleGeometry.dispose();
      stamenGeometry.dispose();
      seedGeometry.dispose();
    },
    [receptacleGeometry, stamenGeometry, seedGeometry],
  );

  const petalMaterial = useMemo(() => {
    const material = new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      roughness: 0.38,
      metalness: 0,
      /*
       * Lotus is the archetypal superhydrophobic waxy surface — the "lotus
       * effect" is named after it. A tight, low-roughness clearcoat is what
       * catches the rim light as a wet highlight. Iridescence is deliberately
       * absent: it is a thin-film model made for beetle shells and oil slicks,
       * and on a pink petal it desaturates the midtones and leaves a cyan
       * fringe at grazing angles that reads as plastic.
       */
      clearcoat: 0.55,
      clearcoatRoughness: 0.22,
      sheen: 1,
      sheenRoughness: 0.6,
      sheenColor: new THREE.Color("#ffc9d8"),
      ior: 1.42,
      /*
       * Transmission is what sells a petal: light passing through the far side
       * of the flower and glowing out the near side. It costs one extra scene
       * render per frame, so weaker hardware falls back to sheen alone, which
       * still reads as soft and waxy — just not backlit.
       */
      transmission: quality === "high" ? 0.45 : 0,
      /*
       * Attenuation is Beer-Lambert: exp(-thickness / attenuationDistance).
       * A ratio near 0.4 transmits about two thirds of the light with a faint
       * tint, which is what a petal does. Ratios above ~1.5 give stained glass.
       * attenuationColor is what light *becomes* after passing through, so it
       * is more saturated than the surface, not less.
       *
       * Requires three >= r184: transmission + DoubleSide + antialias:false
       * caused a framebuffer feedback loop in r182-r183 (three.js #33060).
       */
      thickness: 0.5,
      /*
       * Nothing in this scene casts a shadow, so a petal turned away from every
       * light renders as a black hole punched in the flower. A very dim rose
       * emissive puts a floor under those faces — they read as petal in
       * shadow, which is also what a lotus lit from within should look like.
       */
      emissive: new THREE.Color("#3d1524"),
      emissiveIntensity: 1,
      attenuationColor: new THREE.Color("#e0708f"),
      attenuationDistance: 1.2,
    });
    return material;
  }, [quality]);

  const receptacleMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#dcd48a",
        roughness: 0.55,
        metalness: 0.04,
        emissive: new THREE.Color("#6d6a2a"),
        emissiveIntensity: 0.85,
      }),
    [],
  );

  const seedMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#59642c",
        roughness: 0.85,
        emissive: new THREE.Color("#20250d"),
        emissiveIntensity: 1,
      }),
    [],
  );

  const stamenMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.45,
        emissive: new THREE.Color("#e8a83a"),
        emissiveIntensity: 0.8,
      }),
    [],
  );

  useLayoutEffect(() => () => petalMaterial.dispose(), [petalMaterial]);

  useLayoutEffect(
    () => () => {
      receptacleMaterial.dispose();
      seedMaterial.dispose();
      stamenMaterial.dispose();
    },
    [receptacleMaterial, seedMaterial, stamenMaterial],
  );

  const flowerRef = useRef<THREE.Group>(null);
  const petalRefs = useRef<(THREE.Group | null)[]>([]);
  const petalMeshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const stamensRef = useRef<THREE.InstancedMesh>(null);
  const seedsRef = useRef<THREE.InstancedMesh>(null);

  /*
   * three.js builds a mesh's `morphTargetInfluences` array inside the Mesh
   * constructor, from whatever geometry it was constructed with. React Three
   * Fiber constructs the mesh empty and assigns `geometry` afterwards, so the
   * influences array is never created and the renderer throws the first time it
   * tries to read it. Re-running updateMorphTargets() once the geometry is
   * attached is the documented fix.
   */
  useLayoutEffect(() => {
    petalMeshRefs.current.forEach((mesh) => {
      if (!mesh) return;
      mesh.updateMorphTargets();
      if (mesh.morphTargetInfluences) {
        // Start every petal closed; the bloom driver opens them.
        mesh.morphTargetInfluences[0] = 1;
      }
    });
  }, [petalGeometries]);

  // Lay out the stamen ring and the seed cavities once.
  useLayoutEffect(() => {
    const stamens = stamensRef.current;
    if (stamens) {
      const matrix = new THREE.Matrix4();
      const euler = new THREE.Euler();
      const quaternion = new THREE.Quaternion();
      const position = new THREE.Vector3();
      const scale = new THREE.Vector3();

      for (let i = 0; i < STAMEN_COUNT; i++) {
        const t = i / STAMEN_COUNT;
        const azimuth = t * Math.PI * 2 * 8.5 + noise(i * 3.1) * 0.05;
        // Two loose bands of stamens around the pod, not one hard ring.
        const band = i % 2 === 0 ? 0.0 : 0.05;
        const radius = RECEPTACLE_RADIUS * 0.86 + band + noise(i * 7.7) * 0.018;
        const lean = 0.34 + band * 2.2 + noise(i * 5.3) * 0.14;

        position.set(
          Math.cos(azimuth) * radius,
          RECEPTACLE_HEIGHT * 0.3 + noise(i * 2.9) * 0.015,
          Math.sin(azimuth) * radius,
        );

        /*
         * Tip each stamen away from the flower's axis. To swing the geometry's
         * +Y axis toward the outward direction (cos α, 0, sin α) we need the
         * X rotation to supply the +Z component and the Z rotation to supply
         * the +X component — hence sin on X and −cos on Z, not the reverse.
         */
        euler.set(Math.sin(azimuth) * lean, 0, -Math.cos(azimuth) * lean, "XYZ");
        quaternion.setFromEuler(euler);
        scale.setScalar(0.85 + noise(i * 11.3) * 0.18);

        matrix.compose(position, quaternion, scale);
        stamens.setMatrixAt(i, matrix);
      }
      stamens.instanceMatrix.needsUpdate = true;
      stamens.computeBoundingSphere();
    }

    const seeds = seedsRef.current;
    if (seeds) {
      const matrix = new THREE.Matrix4();
      const positions = seedPositions(SEED_COUNT, RECEPTACLE_RADIUS);
      positions.forEach(([x, z], i) => {
        matrix.makeTranslation(x, RECEPTACLE_HEIGHT - 0.012, z);
        seeds.setMatrixAt(i, matrix);
      });
      seeds.instanceMatrix.needsUpdate = true;
      seeds.computeBoundingSphere();
    }
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    /*
     * The bloom is read from the render clock rather than held in React state.
     * Storing it in state would re-render this whole subtree on every frame of
     * the opening animation, for a value only the GPU consumes.
     */
    const openness = bloom ?? (still ? 1 : clamp01((time - BLOOM_DELAY) / BLOOM_DURATION));

    placements.forEach((placement, index) => {
      const group = petalRefs.current[index];
      const mesh = petalMeshRefs.current[index];
      if (!group || !mesh) return;

      // Remap the global bloom into this petal's own window, so the flower
      // opens outside-in over the course of the animation.
      const span = 1 - placement.delay;
      const local = easeOutCubic(clamp01((openness - placement.delay) / Math.max(span, 0.0001)));

      // The morph target does the unfurling; influence 1 is the closed bud.
      if (mesh.morphTargetInfluences) {
        mesh.morphTargetInfluences[0] = 1 - local;
      }

      // A slow, uneven breath, as if the flower is sitting on moving water.
      const sway = still
        ? 0
        : Math.sin(time * 0.42 + placement.azimuth * 1.7) * 0.022 * local +
          Math.sin(time * 0.27 + index) * 0.012 * local;

      group.rotation.x = placement.jitterPitch * local + sway;
      group.rotation.z = placement.jitterRoll * local + sway * 0.5;
      group.scale.setScalar(placement.jitterScale * (0.86 + 0.14 * local));
    });

    const flower = flowerRef.current;
    if (flower && !still) {
      flower.rotation.y = time * 0.055;
      flower.position.y = Math.sin(time * 0.5) * 0.022;
      flower.rotation.z = Math.sin(time * 0.33) * 0.018;
    } else if (flower && still) {
      // A fixed three-quarter view reads better than dead-on when frozen.
      flower.rotation.y = 0.5;
      flower.position.y = 0;
      flower.rotation.z = 0;
    }
  });

  let petalIndex = 0;

  return (
    <group ref={flowerRef} dispose={null}>
      {placements.map((placement, index) => {
        const whorl = WHORLS[placement.whorl];
        const i = petalIndex++;
        return (
          <group key={index} rotation={[0, placement.azimuth, 0]}>
            <group
              ref={(node) => {
                petalRefs.current[i] = node;
              }}
              position={[0, whorl.baseHeight, whorl.baseRadius]}
            >
              <mesh
                ref={(node) => {
                  petalMeshRefs.current[i] = node;
                }}
                geometry={petalGeometries[placement.whorl]}
                material={petalMaterial}
                castShadow={false}
                receiveShadow={false}
              />
            </group>
          </group>
        );
      })}

      <mesh geometry={receptacleGeometry} material={receptacleMaterial} />

      <instancedMesh
        ref={seedsRef}
        args={[seedGeometry, seedMaterial, SEED_COUNT]}
        frustumCulled={false}
      />

      <instancedMesh
        ref={stamensRef}
        args={[stamenGeometry, stamenMaterial, STAMEN_COUNT]}
        frustumCulled={false}
      />
    </group>
  );
}
