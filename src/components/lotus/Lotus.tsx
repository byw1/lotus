"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";

import { cn } from "@/lib/utils";

import { LotusFallback } from "./LotusFallback";

/**
 * The public entry point for the 3D lotus.
 *
 * Everything WebGL is behind this boundary. three.js, @react-three/fiber, drei
 * and the postprocessing stack together are the single largest thing this site
 * could ship, so they are loaded in a separate chunk, after the page is
 * interactive, and only when the device can actually use them.
 *
 * The flat SVG lotus renders first and stays visible until the real one is
 * ready, so there is never an empty box on screen.
 */

const LotusScene = dynamic(() => import("./LotusScene"), {
  ssr: false,
  loading: () => null,
});

/**
 * Whether this browser can and should run the scene. Cached at module scope: it
 * cannot change during a session, and creating a probe canvas on every render
 * would be both wasteful and impure.
 */
let capabilityCache: boolean | null = null;

function canRunScene(): boolean {
  if (capabilityCache !== null) return capabilityCache;
  if (typeof window === "undefined") return false;

  // Respect an explicit request to use less data — the flat lotus is enough.
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
  ).connection;
  if (connection?.saveData || connection?.effectiveType === "slow-2g") {
    capabilityCache = false;
    return false;
  }

  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) {
      capabilityCache = false;
      return false;
    }
    // Release it immediately; browsers cap the number of live contexts.
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    capabilityCache = true;
    return true;
  } catch {
    capabilityCache = false;
    return false;
  }
}

/** A subscription that never fires — for values that are fixed per session. */
const neverChanges = () => () => {};

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * If the scene throws — a lost context, a driver bug, an out-of-memory on an
 * old phone — the page must not go blank. It falls back to the flat lotus and
 * carries on.
 */
class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[lotus] WebGL scene failed, using the flat fallback.", error);
    }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export type LotusProps = {
  className?: string;
  /** Hold back the WebGL chunk until the browser has gone idle. */
  defer?: boolean;
};

export function Lotus({ className, defer = true }: LotusProps) {
  // Both of these are external-system reads: they must return false during
  // server rendering and on the first client render, so hydration matches.
  const capable = useSyncExternalStore(neverChanges, canRunScene, () => false);
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotion,
    () => false,
  );

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!capable) return;

    if (!defer) {
      // Still asynchronous, so the first paint is never blocked on it.
      const immediate = window.setTimeout(() => setReady(true), 0);
      return () => window.clearTimeout(immediate);
    }

    // Wait for the browser to go idle before pulling the WebGL chunk down, so
    // the text and the newsletter form are interactive first. Safari only
    // shipped requestIdleCallback recently, so a timeout stands in for it.
    const idle = window.requestIdleCallback as typeof window.requestIdleCallback | undefined;

    if (idle) {
      const handle = idle(() => setReady(true), { timeout: 2200 });
      return () => window.cancelIdleCallback(handle);
    }

    const handle = window.setTimeout(() => setReady(true), 900);
    return () => window.clearTimeout(handle);
  }, [capable, defer]);

  const showScene = capable && ready;

  return (
    <div className={cn("relative", className)}>
      {/* The flat lotus underneath, always. The canvas cross-fades over it. */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          showScene ? "opacity-0" : "opacity-100",
        )}
      >
        <LotusFallback className={reducedMotion ? undefined : "animate-breathe"} />
      </div>

      {showScene && (
        <SceneBoundary fallback={null}>
          <LotusScene reducedMotion={reducedMotion} className="!absolute inset-0" />
        </SceneBoundary>
      )}
    </div>
  );
}

export default Lotus;
