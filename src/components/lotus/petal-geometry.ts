import * as THREE from "three";

/**
 * Procedural lotus petal geometry.
 *
 * There is no downloaded 3D model anywhere in this repository. The flower is
 * generated from these equations at runtime, which keeps the repo small, keeps
 * it fully open source with no third-party asset licensing, and lets us morph
 * the petals open instead of playing a baked animation.
 *
 * A petal is a swept surface. We walk a spine from the base of the petal to its
 * tip, and at each step lay a cross-section across it:
 *
 *      u ∈ [0,1]   along the spine, base → tip
 *      v ∈ [-1,1]  across the petal, left edge → right edge
 *
 * The spine is built by integration rather than by a closed-form curve: at each
 * step we advance a fixed arc length `ds` along a direction whose angle from
 * vertical grows as the petal arches outward. Integrating gives us exact
 * arc-length parameterisation for free, so the petal keeps its true length no
 * matter how far it opens — which is what makes the bloom read as unfurling
 * rather than stretching.
 *
 * The petal is generated in a canonical frame: it grows along +Y and arches
 * toward +Z. Placement around the flower is done with transforms, not geometry,
 * so every petal in a whorl shares one geometry and one set of buffers.
 */
export type PetalParams = {
  /** Arc length of the petal, in world units. */
  length: number;
  /** Widest width of the petal, in world units. */
  width: number;
  /** Angle from vertical at the base, in radians. */
  baseAngle: number;
  /** Additional outward arch accumulated between base and tip, in radians. */
  curl: number;
  /** Extra downward hook applied over the last third, in radians. */
  tipCurl: number;
  /** How strongly the cross-section cups. 0 is flat, 1 is a deep boat. */
  cup: number;
  /** Roll accumulated toward the tip, in radians. Breaks up the symmetry. */
  twist: number;
  /** Amplitude of the wavy petal edge, as a fraction of half-width. */
  ripple: number;
  /** Steps along the spine. */
  lengthSegments?: number;
  /** Steps across the width. */
  widthSegments?: number;
};

/**
 * Half-width profile across the petal's length: a normalised beta curve
 * `u^a · (1-u)^b`, scaled so its maximum is exactly `width / 2`.
 *
 * With a = 0.72 and b = 0.60 the widest point sits at u = a/(a+b) ≈ 0.55, and
 * both ends taper to a point — a narrow attachment at the base and a sharp tip.
 * That asymmetry is the difference between a lotus petal and a daisy petal.
 */
const WIDTH_A = 0.72;
const WIDTH_B = 0.6;
const WIDTH_MODE = WIDTH_A / (WIDTH_A + WIDTH_B);
const WIDTH_PEAK = Math.pow(WIDTH_MODE, WIDTH_A) * Math.pow(1 - WIDTH_MODE, WIDTH_B);

function halfWidth(u: number, width: number): number {
  if (u <= 0 || u >= 1) return 0;
  return (width / 2) * ((Math.pow(u, WIDTH_A) * Math.pow(1 - u, WIDTH_B)) / WIDTH_PEAK);
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Lotus petals are deepest rose where they meet the receptacle, palest through
 * the middle, and pick the colour back up at the tip.
 *
 * These run deeper than they did when the page was black. A petal that read as
 * luminous against ink washes out to near-white against a white page, and a
 * white flower on a white ground is a smudge — the colour is what holds the
 * silhouette now that there is no darkness behind it.
 */
const COLOR_BASE = new THREE.Color("#d95c81");
const COLOR_MID = new THREE.Color("#f7cbd8");
const COLOR_TIP = new THREE.Color("#e87ba1");

export function buildPetalGeometry(params: PetalParams): THREE.BufferGeometry {
  const {
    length,
    width,
    baseAngle,
    curl,
    tipCurl,
    cup,
    twist,
    ripple,
    lengthSegments = 30,
    widthSegments = 16,
  } = params;

  const N = lengthSegments;
  const M = widthSegments;
  const vertexCount = (N + 1) * (M + 1);

  const positions = new Float32Array(vertexCount * 3);
  const uvs = new Float32Array(vertexCount * 2);
  const colors = new Float32Array(vertexCount * 3);
  const indices = new Uint16Array(N * M * 6);

  const ds = length / N;
  const color = new THREE.Color();

  // Spine state, integrated step by step.
  let spineY = 0;
  let spineZ = 0;

  let vi = 0;
  for (let i = 0; i <= N; i++) {
    const u = i / N;

    // How far from vertical the spine points at this station. The u² term makes
    // the petal arch gently at first and hard near the tip, which is how a real
    // petal behaves under its own weight.
    const angle = baseAngle + curl * u * u + tipCurl * smoothstep(0.62, 1, u);

    // The cross-section frame, perpendicular to the spine tangent.
    //   tangent  T = (0,  cos θ, sin θ)
    //   binormal B = (1,  0,     0)      — runs across the petal
    //   normal   Nrm = B × T = (0, -sin θ, cos θ)
    const sinA = Math.sin(angle);
    const cosA = Math.cos(angle);

    // Roll the cross-section around the tangent as we climb.
    const roll = twist * Math.pow(u, 1.5);
    const cosR = Math.cos(roll);
    const sinR = Math.sin(roll);

    // B' and N' after the roll.
    const bx = cosR;
    const by = -sinR * sinA;
    const bz = sinR * cosA;
    const nx = -sinR;
    const ny = cosR * -sinA;
    const nz = cosR * cosA;

    const hw = halfWidth(u, width);

    // Cupping is strongest through the middle of the petal and relaxes at the
    // tip, so the petal reads as a shallow boat rather than a tube.
    const cupProfile = Math.pow(Math.sin(Math.PI * u), 0.7);

    // Colour runs deep rose at the base, through near-white, to a pink tip.
    color.copy(COLOR_BASE).lerp(COLOR_MID, smoothstep(0.0, 0.55, u));
    color.lerp(COLOR_TIP, smoothstep(0.62, 1.0, u));

    for (let j = 0; j <= M; j++) {
      const t = j / M;
      const v = t * 2 - 1;

      const across = hw * v;

      // Concavity across the width, plus a shallow wave along the edge.
      const lift =
        cup * hw * v * v * cupProfile + ripple * hw * Math.sin(v * Math.PI * 2.5) * u * u;

      positions[vi * 3 + 0] = bx * across + nx * lift;
      positions[vi * 3 + 1] = spineY + by * across + ny * lift;
      positions[vi * 3 + 2] = spineZ + bz * across + nz * lift;

      uvs[vi * 2 + 0] = t;
      uvs[vi * 2 + 1] = u;

      colors[vi * 3 + 0] = color.r;
      colors[vi * 3 + 1] = color.g;
      colors[vi * 3 + 2] = color.b;

      vi++;
    }

    // Advance the spine by one arc-length step.
    spineY += cosA * ds;
    spineZ += sinA * ds;
  }

  let ii = 0;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      const a = i * (M + 1) + j;
      const b = a + M + 1;
      indices[ii++] = a;
      indices[ii++] = b;
      indices[ii++] = a + 1;
      indices[ii++] = b;
      indices[ii++] = b + 1;
      indices[ii++] = a + 1;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();

  return geometry;
}

/**
 * Build one petal geometry that can morph between a closed bud and an open
 * bloom.
 *
 * Both poses are generated from the same equations with different arch and cup
 * values, so their vertices correspond one-to-one. The open pose becomes the
 * base geometry and the closed pose is attached as morph target 0, which means
 * a single influence value between 0 and 1 unfurls the petal on the GPU. That
 * is far cheaper than rebuilding buffers every frame, and it bends the petal
 * properly rather than just tilting a rigid shape.
 */
export function buildMorphingPetal(open: PetalParams): THREE.BufferGeometry {
  const closed: PetalParams = {
    ...open,
    // A bud: petals stand almost upright, wrap tightly inward, and barely arch.
    baseAngle: open.baseAngle * 0.16,
    curl: open.curl * 0.2,
    tipCurl: open.tipCurl * 0.35,
    cup: Math.min(1.05, open.cup * 1.55),
    twist: open.twist * 0.45,
    ripple: open.ripple * 0.4,
  };

  const openGeometry = buildPetalGeometry(open);
  const closedGeometry = buildPetalGeometry(closed);

  openGeometry.morphAttributes.position = [
    closedGeometry.getAttribute("position") as THREE.BufferAttribute,
  ];
  openGeometry.morphAttributes.normal = [
    closedGeometry.getAttribute("normal") as THREE.BufferAttribute,
  ];
  openGeometry.morphTargetsRelative = false;

  // The closed pose's own index/uv/colour buffers are redundant once its
  // position and normal attributes have been handed over.
  closedGeometry.dispose();

  return openGeometry;
}

/**
 * The seed pod at the centre of the flower — the part that becomes the dried
 * lotus head. A lathe profile flaring from a narrow stalk to a flat, faintly
 * domed top.
 */
export function buildReceptacleGeometry(radius = 0.34, height = 0.3): THREE.BufferGeometry {
  const profile: [number, number][] = [
    [0.02, 0.0],
    [0.1, 0.03],
    [0.18, 0.09],
    [0.25, 0.16],
    [0.3, 0.22],
    [0.33, 0.27],
    [0.335, 0.29],
    [0.3, 0.3],
    [0.2, 0.305],
    [0.1, 0.307],
    [0.0, 0.308],
  ];

  const points = profile.map(
    ([r, y]) => new THREE.Vector2((r / 0.335) * radius, (y / 0.308) * height),
  );

  const geometry = new THREE.LatheGeometry(points, 48);
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Positions for the seed cavities on the face of the pod, laid out on the same
 * golden-angle spiral that the real plant uses.
 */
export function seedPositions(count: number, radius: number): [number, number][] {
  const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
  const out: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    const r = radius * Math.sqrt((i + 0.5) / count) * 0.82;
    const theta = i * GOLDEN_ANGLE;
    out.push([Math.cos(theta) * r, Math.sin(theta) * r]);
  }
  return out;
}

/**
 * A single stamen: a hair-fine filament with a heavier anther at the tip.
 * Vertex-coloured so one instanced draw call renders the whole ring of them
 * with a pale base and a gold head.
 */
export function buildStamenGeometry(height = 0.26): THREE.BufferGeometry {
  const geometry = new THREE.CylinderGeometry(0.009, 0.0035, height, 5, 6, false);
  geometry.translate(0, height / 2, 0);

  const position = geometry.getAttribute("position");
  const colors = new Float32Array(position.count * 3);
  const filament = new THREE.Color("#f6ead2");
  const anther = new THREE.Color("#f2b52e");
  const color = new THREE.Color();

  for (let i = 0; i < position.count; i++) {
    const t = smoothstep(0.55, 0.95, position.getY(i) / height);
    color.copy(filament).lerp(anther, t);
    colors[i * 3 + 0] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geometry;
}

/** The angle nature uses to pack petals, seeds and leaves without overlap. */
export const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)); // ≈ 137.507°

export type Whorl = {
  /** Number of petals in this ring. */
  count: number;
  /** Petal shape for the ring. */
  petal: PetalParams;
  /** Radial offset of the petal base from the flower axis. */
  baseRadius: number;
  /** Height of the petal base above the flower's origin. */
  baseHeight: number;
  /** Extra azimuth applied to the whole ring, to break up alignment. */
  phase: number;
  /** Order in which this ring opens during the bloom, 0 = first. */
  bloomOrder: number;
};

/**
 * The flower itself: five whorls, outermost first. Outer petals are longer,
 * fall further open and arch harder; inner petals stay short and upright,
 * cradling the seed pod.
 *
 * Counts follow the Fibonacci-ish progression real lotus flowers tend toward,
 * and each ring is rotated by a multiple of the golden angle so no petal sits
 * directly above the one below it.
 */
export const WHORLS: Whorl[] = [
  {
    count: 6,
    baseRadius: 0.46,
    baseHeight: 0.0,
    phase: 0,
    bloomOrder: 0,
    petal: {
      length: 1.42,
      width: 0.78,
      baseAngle: 0.5,
      curl: 0.95,
      tipCurl: 0.34,
      cup: 0.34,
      twist: 0.16,
      ripple: 0.035,
    },
  },
  {
    count: 8,
    baseRadius: 0.45,
    baseHeight: 0.032,
    phase: GOLDEN_ANGLE,
    bloomOrder: 1,
    petal: {
      length: 1.3,
      width: 0.7,
      baseAngle: 0.4,
      curl: 0.82,
      tipCurl: 0.3,
      cup: 0.4,
      twist: -0.13,
      ripple: 0.03,
    },
  },
  {
    count: 9,
    baseRadius: 0.435,
    baseHeight: 0.064,
    phase: GOLDEN_ANGLE * 2,
    bloomOrder: 2,
    petal: {
      length: 1.12,
      width: 0.6,
      baseAngle: 0.36,
      curl: 0.72,
      tipCurl: 0.24,
      cup: 0.47,
      twist: 0.11,
      ripple: 0.026,
    },
  },
  {
    count: 9,
    baseRadius: 0.415,
    baseHeight: 0.095,
    phase: GOLDEN_ANGLE * 3,
    bloomOrder: 3,
    petal: {
      length: 0.92,
      width: 0.48,
      baseAngle: 0.36,
      curl: 0.64,
      tipCurl: 0.2,
      cup: 0.55,
      twist: -0.1,
      ripple: 0.02,
    },
  },
  {
    count: 8,
    baseRadius: 0.395,
    baseHeight: 0.125,
    phase: GOLDEN_ANGLE * 4,
    bloomOrder: 4,
    petal: {
      length: 0.7,
      width: 0.36,
      baseAngle: 0.3,
      curl: 0.54,
      tipCurl: 0.16,
      cup: 0.62,
      twist: 0.08,
      ripple: 0.014,
    },
  },
];

export const PETAL_COUNT = WHORLS.reduce((n, w) => n + w.count, 0);

/**
 * A lotus pad: the flat leaf that floats on the water beside the flower.
 *
 * A disc with a wedge cut out of one side — the notch every lotus and water
 * lily leaf has, where the stem meets the blade — domed very slightly so light
 * catches across it, and with a gently rippling rim so it does not read as a
 * plate. The radial veins that run from the notch to the edge are baked into
 * the vertex colours rather than a texture, which keeps the whole flower free
 * of image files.
 */
export function buildLilyPadGeometry(
  radius = 1,
  notch = 0.42,
  radialSegments = 64,
  rings = 10,
): THREE.BufferGeometry {
  const sweep = Math.PI * 2 - notch;
  const start = notch / 2;

  const vertexCount = (radialSegments + 1) * (rings + 1);
  const positions = new Float32Array(vertexCount * 3);
  const colors = new Float32Array(vertexCount * 3);
  const uvs = new Float32Array(vertexCount * 2);
  const indices = new Uint16Array(radialSegments * rings * 6);

  const deep = new THREE.Color("#2f6b46");
  const mid = new THREE.Color("#4f9a63");
  const rim = new THREE.Color("#89bd72");
  const vein = new THREE.Color("#8fc98a");
  const color = new THREE.Color();

  let v = 0;
  for (let i = 0; i <= radialSegments; i++) {
    const t = i / radialSegments;
    const angle = start + t * sweep;

    // Eleven veins radiate from the notch. `fract` peaks at each one.
    const veinPhase = Math.abs(((t * 11) % 1) - 0.5) * 2;
    const veinStrength = Math.pow(1 - veinPhase, 6);

    // A shallow scallop around the rim, so the edge is a leaf and not a circle.
    const rimWave = 1 + Math.sin(angle * 9) * 0.022 + Math.sin(angle * 4 + 1.1) * 0.03;

    for (let j = 0; j <= rings; j++) {
      const r = (j / rings) * radius * rimWave;
      const normalized = j / rings;

      positions[v * 3 + 0] = Math.cos(angle) * r;
      // Domed in the middle and turned up at the very edge, which is how a pad
      // sits on water: the centre rides low, the rim curls out of it.
      positions[v * 3 + 1] =
        radius * (0.055 * (1 - normalized * normalized) + 0.045 * Math.pow(normalized, 7));
      positions[v * 3 + 2] = Math.sin(angle) * r;

      color.copy(deep).lerp(mid, smoothstep(0.05, 0.62, normalized));
      color.lerp(rim, smoothstep(0.72, 1, normalized));
      color.lerp(vein, veinStrength * 0.35 * smoothstep(0.12, 0.95, normalized));

      colors[v * 3 + 0] = color.r;
      colors[v * 3 + 1] = color.g;
      colors[v * 3 + 2] = color.b;

      uvs[v * 2 + 0] = t;
      uvs[v * 2 + 1] = normalized;
      v++;
    }
  }

  let n = 0;
  for (let i = 0; i < radialSegments; i++) {
    for (let j = 0; j < rings; j++) {
      const a = i * (rings + 1) + j;
      const b = a + rings + 1;
      indices[n++] = a;
      indices[n++] = a + 1;
      indices[n++] = b;
      indices[n++] = b;
      indices[n++] = a + 1;
      indices[n++] = b + 1;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

/**
 * Where the pads float, relative to the flower.
 *
 * Placed by hand rather than by a formula: a ring of evenly spaced pads reads
 * as a decoration around the flower, and a scatter reads as a pond. `spin` is
 * the pad's own rotation, so the notches do not all point the same way.
 *
 * Small, and mostly behind. A real lotus stands well clear of its pads, and a
 * pad near the camera is enormous however small you scale it — the first
 * version filled the corners of the page with giant leaves. Keeping them
 * upstream of the flower lets perspective do the shrinking, and the two in
 * front are small enough to read as foreground rather than as subject.
 */
export const LILY_PADS: { x: number; z: number; scale: number; spin: number; phase: number }[] = [
  { x: -1.55, z: -1.4, scale: 0.3, spin: 0.4, phase: 0 },
  { x: 1.75, z: -1.05, scale: 0.26, spin: 2.1, phase: 1.6 },
  { x: -2.5, z: -2.4, scale: 0.22, spin: 3.4, phase: 3.1 },
  { x: 2.7, z: -2.6, scale: 0.19, spin: 5.0, phase: 4.4 },
  { x: 0.15, z: -2.9, scale: 0.17, spin: 1.2, phase: 2.2 },
  { x: -0.95, z: 0.85, scale: 0.2, spin: 4.1, phase: 5.5 },
  { x: 1.25, z: 0.95, scale: 0.17, spin: 2.7, phase: 0.8 },
];
