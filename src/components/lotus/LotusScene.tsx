"use client";

import {
  AdaptiveDpr,
  ContactShadows,
  Environment,
  Lightformer,
  PerformanceMonitor,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { useState } from "react";

import { LilyPads } from "./LilyPads";
import { LotusFlower } from "./LotusFlower";

/**
 * The lotus, on the water, in daylight.
 *
 * This scene used to be a flower glowing in the dark. It is now a flower in
 * the middle of a July morning, because that is when the festival happens and
 * who it is for — families, on the grass, at eleven in the morning.
 *
 * Lighting it on a white page is a different problem from lighting it on
 * black. On black you make the subject emit; on white you have to keep it from
 * dissolving into the background. Three things do that here: a warm key that
 * models the petals, a cool bounce from below standing in for light off the
 * water, and a real contact shadow that pins the flower to a surface. Without
 * the shadow it floats, and a floating flower on white reads as a sticker.
 */

type LotusSceneProps = {
  /** Skips the bloom animation and all idle motion. */
  reducedMotion?: boolean;
  className?: string;
  /** Called if the browser takes the WebGL context away mid-session. */
  onContextLost?: () => void;
  /** Draw the pads floating around the flower. Off for tight crops. */
  pads?: boolean;
};

export default function LotusScene({
  reducedMotion = false,
  className,
  onContextLost,
  pads = true,
}: LotusSceneProps) {
  const [quality, setQuality] = useState<"high" | "low">("high");

  return (
    <Canvas
      className={className}
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        // Transparent: the page's own white shows through, so the flower sits
        // on the page rather than in a box of its own colour.
        alpha: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: false,
      }}
      camera={{ position: [0, 2.7, 7.2], fov: 28, near: 0.1, far: 40 }}
      onCreated={({ gl }) => {
        /*
         * No tone mapping is set here on purpose. @react-three/postprocessing
         * unconditionally forces gl.toneMapping = NoToneMapping while a
         * composer is mounted, so setting it on the renderer is dead code that
         * reads as if it works. The tone map is the last effect in the chain
         * below instead, which is also the correct order: bloom should run on
         * linear HDR, not on values that have already been compressed.
         *
         * There is no fog either. Fog fades a subject toward a background
         * colour, and on a transparent canvas there is no background to fade
         * into — it would just grey the far petals for no reason.
         */
        if (onContextLost) {
          gl.domElement.addEventListener("webglcontextlost", () => onContextLost(), {
            once: true,
          });
        }
      }}
      // The canvas is pure decoration; the page states everything in text.
      aria-hidden="true"
      /*
       * Always, never "demand". In demand mode R3F renders only on
       * invalidate(), and a single demand render can fire before
       * <Environment frames={1}> has baked its cubemap — leaving
       * scene.environment null and the petals unlit. `still` already removes
       * every trace of motion.
       */
      frameloop="always"
    >
      {/*
        Two systems must never both own the pixel ratio. AdaptiveDpr writes it
        into the R3F store directly; a controlled `dpr` prop driven by React
        state would clobber whatever it chose on the next render. So the clamp
        above is static, AdaptiveDpr owns dpr, and PerformanceMonitor is
        restricted to the material quality tier.
      */}
      <PerformanceMonitor onDecline={() => setQuality("low")} />
      <AdaptiveDpr pixelated={false} />

      {/*
        Daylight. The key models the petals from above and in front; the cool
        fill from below is light coming back off the water, which is what gives
        the undersides of the petals their colour on a real lake.

        These are deliberately modest. AgX bypasses gl.toneMappingExposure, so
        the temptation is to compensate by driving every light hard — which
        blows the petals to white, kills the pink the whole palette is built
        around, and pushes the lily pads over the bloom threshold so each one
        picks up a halo. Under-light it and let AgX's shoulder do the work.
      */}
      <ambientLight intensity={0.5} color="#eef6ff" />
      <hemisphereLight args={["#eaf4ff", "#cfe4d2", 0.55]} />
      <directionalLight position={[3.2, 5.4, 3.4]} intensity={1.45} color="#fff6e8" />
      <directionalLight position={[-3.6, 1.2, 1.8]} intensity={0.5} color="#cfe3ff" />
      <directionalLight position={[0, -2.2, 1.4]} intensity={0.28} color="#bcd8ef" />
      <directionalLight position={[-1.4, 2.6, -4.2]} intensity={0.75} color="#ffd9e4" />

      <group position={[0, -0.62, 0]}>
        {pads ? <LilyPads still={reducedMotion} /> : null}

        {/* The flower is the subject; the pond is scenery. Scale says so. */}
        <group scale={1.2}>
          <LotusFlower still={reducedMotion} quality={quality} />
        </group>

        {/*
          What stops the flower looking like a cut-out. Rendered once and
          reused (`frames={1}`) rather than every frame, because nothing under
          the flower moves enough to notice and the shadow pass is the most
          expensive thing in this scene.
        */}
        <ContactShadows
          position={[0, 0.005, 0]}
          opacity={0.3}
          scale={11}
          blur={2.6}
          far={2.2}
          resolution={quality === "high" ? 512 : 256}
          color="#20415c"
          frames={1}
        />
      </group>

      {/*
        Lighting environment built from emissive rectangles rather than a
        downloaded HDRI, so there is no binary asset in the repo and no
        additional network request on a page whose whole job is to load fast.
        A bright sky overhead, blue at the sides, and green bounce from below —
        the reflected environment of a lake with planting around it.
      */}
      <Environment resolution={quality === "high" ? 256 : 128} frames={1}>
        <Lightformer
          form="rect"
          intensity={2.2}
          color="#ffffff"
          position={[0, 5, 1]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[10, 8, 1]}
        />
        <Lightformer
          form="circle"
          intensity={1.3}
          color="#bcdcff"
          position={[-4.5, 1.5, 2]}
          scale={[5, 5, 1]}
        />
        <Lightformer
          form="circle"
          intensity={1.0}
          color="#ffd3e0"
          position={[4, 1.2, -2.5]}
          scale={[4, 4, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0.7}
          color="#a9cbb0"
          position={[0, -3, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[10, 10, 1]}
        />
      </Environment>

      <EffectComposer enableNormalPass={false} multisampling={quality === "high" ? 4 : 0}>
        {/*
          Bloom is held right back. On a dark page it was the whole effect; on
          a white one there is nothing for a glow to read against, and any more
          than this just puts haze over the petal edges. The threshold is set
          high enough that only the gold stamens reach it — at 0.92 the lit rim
          of a lily pad crossed it too, and every pad picked up a halo.
        */}
        <Bloom
          intensity={quality === "high" ? 0.22 : 0.12}
          luminanceThreshold={0.99}
          luminanceSmoothing={0.2}
          mipmapBlur
          radius={0.5}
        />
        {/*
          AgX rather than ACES. ACES skews saturated reds and pinks toward
          orange as they brighten — which is exactly this flower. AgX has a
          longer, hue-neutral shoulder, so a lit petal edge desaturates toward
          white while staying pink. Must be last in the chain.
        */}
        <ToneMapping mode={ToneMappingMode.AGX} />
      </EffectComposer>
    </Canvas>
  );
}
