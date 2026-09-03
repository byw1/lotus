"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { buildLilyPadGeometry, LILY_PADS } from "./petal-geometry";

/**
 * The lotus pads floating around the flower.
 *
 * They do two jobs. Visually they turn a flower hanging in space into a
 * flower on a pond, which is what the festival is actually about — Echo Park
 * Lake in July. Structurally they give the eye something at a different depth
 * from the flower, so the scene reads as three-dimensional at a glance rather
 * than only once it starts turning.
 *
 * One geometry, six meshes. Each pad drifts on its own phase so the water
 * never looks like it is moving on a single beat.
 */
export function LilyPads({ still = false }: { still?: boolean }) {
  const geometry = useMemo(() => buildLilyPadGeometry(1, 0.42, 56, 9), []);
  useLayoutEffect(() => () => geometry.dispose(), [geometry]);

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        side: THREE.DoubleSide,
        roughness: 0.58,
        metalness: 0,
        /*
         * A lotus pad is famously water-repellent — the "lotus effect" is
         * named for it — so it always carries a faint waxy sheen even in flat
         * daylight. Without the clearcoat the pads read as felt.
         */
        clearcoat: 0.45,
        clearcoatRoughness: 0.35,
        sheen: 0.4,
        sheenColor: new THREE.Color("#c9e6a8"),
      }),
    [],
  );
  useLayoutEffect(() => () => material.dispose(), [material]);

  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (still || !group.current) return;
    const time = state.clock.elapsedTime;

    group.current.children.forEach((pad, index) => {
      const { phase } = LILY_PADS[index];
      // Riding on water: a slow rise and fall, and a lazy roll with it.
      pad.position.y = Math.sin(time * 0.5 + phase) * 0.035;
      pad.rotation.x = Math.sin(time * 0.42 + phase) * 0.05;
      pad.rotation.z = Math.cos(time * 0.36 + phase * 1.3) * 0.05;
    });
  });

  return (
    <group ref={group}>
      {LILY_PADS.map((pad, index) => (
        <mesh
          key={index}
          geometry={geometry}
          material={material}
          position={[pad.x, 0, pad.z]}
          rotation={[0, pad.spin, 0]}
          scale={pad.scale}
        />
      ))}
    </group>
  );
}
