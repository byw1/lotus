"use client";

import dynamic from "next/dynamic";

import { CanvasHost } from "@/components/three/CanvasHost";

import { BoatDiagram } from "./BoatDiagram";

/**
 * The public entry point for the 3D dragon boat.
 *
 * Same arrangement as the lotus: `CanvasHost` owns capability detection,
 * deferred loading, the motion preference and the error boundary, and this
 * file only says which chunk to load and what to draw in the meantime. The
 * flat seating diagram is the fallback, which is a happy accident of the two
 * being drawings of the same thing — a phone with no WebGL gets a schematic of
 * the boat rather than a blank rectangle.
 */

const DragonBoatScene = dynamic(() => import("./DragonBoatScene"), {
  ssr: false,
  loading: () => null,
});

export function DragonBoat({ className }: { className?: string }) {
  return (
    <CanvasHost
      className={className}
      fallback={() => (
        <div className="flex h-full w-full items-center justify-center px-4">
          <BoatDiagram className="h-auto w-full max-w-3xl" />
        </div>
      )}
      scene={(props) => <DragonBoatScene {...props} />}
    />
  );
}

export default DragonBoat;
