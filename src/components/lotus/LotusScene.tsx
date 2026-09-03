"use client";

import { Environment, Lightformer, PerformanceMonitor, AdaptiveDpr } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { useState } from "react";
import * as THREE from "three";

import { LotusFlower } from "./LotusFlower";

/**
 * The WebGL scene behind the coming-soon page.
 *
 * Design intent: the flower is the only light source in the frame. Everything
 * else — the water, the air, the vignette — exists to make it glow. It opens
 * once on load, over about five seconds, then breathes.
 */

type LotusSceneProps = {
  /** Skips the bloom animation and all idle motion. */
  reducedMotion?: boolean;
  className?: string;
  /** Called if the browser takes the WebGL context away mid-session. */
  onContextLost?: () => void;
};

export default function LotusScene({
  reducedMotion = false,
  className,
  onContextLost,
}: LotusSceneProps) {
  const [quality, setQuality] = useState<"high" | "low">("high");

  return (
    <Canvas
      className={className}
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        // Keep the transmission pass cheap; it renders the scene a second time.
        preserveDrawingBuffer: false,
      }}
      camera={{ position: [0, 2.25, 3.05], fov: 36, near: 0.1, far: 40 }}
      onCreated={({ scene, gl }) => {
        /*
         * A render-phase error boundary cannot see an asynchronous context
         * loss — a backgrounded tab reclaimed by the GPU, a driver reset. When
         * that happens the canvas silently goes black, so we tell the page to
         * drop back to the flat lotus instead.
         */
        if (onContextLost) {
          gl.domElement.addEventListener("webglcontextlost", () => onContextLost(), {
            once: true,
          });
        }

        /*
         * No tone mapping is set here on purpose. @react-three/postprocessing
         * unconditionally forces gl.toneMapping = NoToneMapping while a
         * composer is mounted, so setting it on the renderer is dead code that
         * reads as if it works. The tone map is the last effect in the chain
         * below instead, which is also the correct order: bloom should run on
         * linear HDR, not on values that have already been compressed.
         */
        scene.fog = new THREE.FogExp2("#07060b", 0.11);
      }}
      // The canvas is pure decoration; the page states everything in text.
      aria-hidden="true"
      /*
        Always, never "demand". In demand mode R3F renders only on invalidate(),
        and a single demand render can fire before <Environment frames={1}>
        has baked its cubemap — leaving scene.environment null and the petals
        unlit. `still` already removes every trace of motion.
      */
      frameloop="always"
    >
      {/*
        Drop to the cheap material and a lower pixel ratio the moment the
        device stops keeping up, rather than shipping a slideshow to phones.
      */}
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
        Four lights, each with a job. Intensities run about 15% hot on purpose:
        AgX bypasses gl.toneMappingExposure, so exposure has to be recovered
        here rather than on the renderer. The key models the petals from above; the
        rim behind picks out their translucent edges; the fill keeps the petals
        nearest the camera from going to black, because nothing here casts
        shadows and an unlit back face reads as a hole.
      */}
      <ambientLight intensity={0.4} color="#c3cdff" />
      <directionalLight position={[2.4, 4.2, 2.2]} intensity={1.35} color="#fff4e2" />
      <directionalLight position={[-3, 1.6, -2.8]} intensity={3.0} color="#ff9ab8" />
      <directionalLight position={[0.6, 1.8, 4.5]} intensity={1.2} color="#e6e2ff" />

      <group position={[0, -0.18, 0]}>
        {/*
          The heart of the flower is its own light source. Keeping these inside
          the flower's group means they stay at the seed pod as it drifts,
          instead of sliding out of the bowl.
        */}
        <pointLight
          position={[0, 0.34, 0]}
          intensity={1.15}
          distance={2.1}
          decay={2}
          color="#ffcf8a"
        />
        <pointLight
          position={[0, 1.05, 0]}
          intensity={0.72}
          distance={3.2}
          decay={2}
          color="#ffe9cf"
        />
        <LotusFlower still={reducedMotion} quality={quality} />
      </group>

      {/*
        Lighting environment built from emissive rectangles rather than a
        downloaded HDRI, so there is no binary asset in the repo and no
        additional network request on a page whose whole job is to load fast.
      */}
      <Environment resolution={quality === "high" ? 256 : 128} frames={1}>
        <Lightformer
          form="rect"
          intensity={2.6}
          color="#fff0e0"
          position={[0, 4, 1.5]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[8, 6, 1]}
        />
        <Lightformer
          form="circle"
          intensity={3.4}
          color="#ffb0c8"
          position={[-3.5, 1.5, -3]}
          scale={[4, 4, 1]}
        />
        <Lightformer
          form="circle"
          intensity={2.2}
          color="#7fd8c4"
          position={[3.8, 0.8, -2.4]}
          scale={[3, 3, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.1}
          color="#3b2a55"
          position={[0, -3, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[10, 10, 1]}
        />
      </Environment>

      <EffectComposer enableNormalPass={false} multisampling={quality === "high" ? 4 : 0}>
        <Bloom
          intensity={quality === "high" ? 0.55 : 0.38}
          luminanceThreshold={0.8}
          luminanceSmoothing={0.28}
          mipmapBlur
          radius={0.66}
        />
        <Vignette offset={0.3} darkness={0.72} eskil={false} />
        {/*
          AgX rather than ACES. ACES skews saturated reds and pinks toward
          orange as they brighten — which is exactly this flower, exactly in
          the bloom-lit highlights. AgX has a longer, hue-neutral shoulder, so
          a hot petal edge desaturates toward white while staying pink.
          Must be last in the chain.
        */}
        <ToneMapping mode={ToneMappingMode.AGX} />
      </EffectComposer>
    </Canvas>
  );
}
