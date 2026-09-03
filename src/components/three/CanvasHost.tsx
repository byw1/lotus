"use client";

import { Component, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The gate every WebGL scene on this site goes through.
 *
 * three.js, @react-three/fiber, drei and the postprocessing stack together are
 * the single largest thing this site could ship, so a scene is loaded in a
 * separate chunk, after the page is interactive, and only when the device can
 * actually use it. A flat SVG renders first and stays visible until the real
 * one is ready, so there is never an empty box on screen — and it is what
 * remains on a phone with no WebGL, on a metered connection, or if the canvas
 * throws.
 *
 * Every scene gets the same treatment because the failure modes are the same
 * for all of them; only the drawing differs.
 */

/**
 * Whether this browser can and should run a scene. Cached at module scope: it
 * cannot change during a session, and creating a probe canvas on every render
 * would be both wasteful and impure.
 */
let capabilityCache: boolean | null = null;

export function canRunScene(): boolean {
  if (capabilityCache !== null) return capabilityCache;
  if (typeof window === "undefined") return false;

  // Respect an explicit request to use less data — the flat drawing is enough.
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
  ).connection;
  if (connection?.saveData || connection?.effectiveType === "slow-2g") {
    capabilityCache = false;
    return false;
  }

  try {
    const canvas = document.createElement("canvas");
    // WebGL1 is still worth accepting: three r185 falls back to it on older
    // Android, and these scenes render perfectly well on those devices.
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) {
      capabilityCache = false;
      return false;
    }
    // Release it immediately; browsers cap the number of live contexts.
    (gl.getExtension("WEBGL_lose_context") as WEBGL_lose_context | null)?.loseContext();
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

/** Reads the OS motion preference, SSR-safe. Exported for the scenes' own use. */
export function useReducedMotionPreference() {
  return useSyncExternalStore(subscribeToReducedMotion, getReducedMotion, () => false);
}

/**
 * If a scene throws — a lost context, a driver bug, an out-of-memory on an old
 * phone — the page must not go blank. It falls back to the flat drawing and
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
      console.warn("[three] WebGL scene failed, using the flat fallback.", error);
    }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export type SceneRenderProps = {
  reducedMotion: boolean;
  onContextLost: () => void;
  className: string;
};

export function CanvasHost({
  className,
  fallback,
  scene,
  defer = true,
}: {
  className?: string;
  /**
   * The flat drawing shown underneath. It is rendered on the server, so it must
   * be plain markup — it is what a great many visitors will actually see.
   * Receives the resolved motion preference so it can drop its own animation.
   */
  fallback: (reducedMotion: boolean) => ReactNode;
  /** The WebGL scene, once the browser has proved it can run one. */
  scene: (props: SceneRenderProps) => ReactNode;
  /** Hold the WebGL chunk back until the browser has gone idle. */
  defer?: boolean;
}) {
  // Both of these are external-system reads: they must return false during
  // server rendering and on the first client render, so hydration matches.
  const capable = useSyncExternalStore(neverChanges, canRunScene, () => false);
  const reducedMotion = useReducedMotionPreference();

  const [ready, setReady] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    if (!capable) return;

    if (!defer) {
      // Still asynchronous, so the first paint is never blocked on it.
      const immediate = window.setTimeout(() => setReady(true), 0);
      return () => window.clearTimeout(immediate);
    }

    // Wait for the browser to go idle before pulling the WebGL chunk down, so
    // the text and the forms are interactive first. Safari only shipped
    // requestIdleCallback recently, so a timeout stands in for it.
    const idle = window.requestIdleCallback as typeof window.requestIdleCallback | undefined;

    if (idle) {
      const handle = idle(() => setReady(true), { timeout: 2200 });
      return () => window.cancelIdleCallback(handle);
    }

    const handle = window.setTimeout(() => setReady(true), 900);
    return () => window.clearTimeout(handle);
  }, [capable, defer]);

  const showScene = capable && ready && !contextLost;

  return (
    <div className={cn("relative", className)}>
      {/* The flat drawing underneath, always. The canvas cross-fades over it. */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          showScene ? "opacity-0" : "opacity-100",
        )}
      >
        {fallback(reducedMotion)}
      </div>

      {showScene && (
        <SceneBoundary fallback={null}>
          {scene({
            reducedMotion,
            onContextLost: () => setContextLost(true),
            className: "!absolute inset-0",
          })}
        </SceneBoundary>
      )}
    </div>
  );
}
