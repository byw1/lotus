"use client";

import dynamic from "next/dynamic";

import { CanvasHost } from "@/components/three/CanvasHost";

import { LotusFallback } from "./LotusFallback";

/**
 * The public entry point for the 3D lotus.
 *
 * Everything WebGL is behind `CanvasHost`, which owns capability detection,
 * deferred loading, the motion preference and the error boundary for every
 * scene on the site. This file is only the lotus's half of that arrangement:
 * which chunk to load, and what to draw while it is on its way.
 */

const LotusScene = dynamic(() => import("./LotusScene"), {
  ssr: false,
  loading: () => null,
});

export type LotusProps = {
  className?: string;
  /** Hold back the WebGL chunk until the browser has gone idle. */
  defer?: boolean;
  /** Draw the lily pads floating around the flower. Off for tight crops. */
  pads?: boolean;
};

export function Lotus({ className, defer = true, pads = true }: LotusProps) {
  return (
    <CanvasHost
      className={className}
      defer={defer}
      fallback={(reducedMotion) => (
        <LotusFallback className={reducedMotion ? undefined : "animate-breathe"} />
      )}
      scene={(props) => <LotusScene {...props} pads={pads} />}
    />
  );
}

export default Lotus;
