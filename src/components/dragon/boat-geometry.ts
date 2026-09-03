import * as THREE from "three";

/**
 * Procedural dragon boat geometry.
 *
 * Like the lotus, there is no downloaded model here. The hull is a swept
 * surface generated from a handful of equations, so the repository carries no
 * binary asset, nothing has to be licensed, and the boat can be re-proportioned
 * by changing a number rather than by opening Blender.
 *
 * There is deliberately no dragon head. A carved Chinese dragon rendered at
 * this size and by this hand becomes a cartoon, and that is precisely the thing
 * a festival site honoring China should not put on its own page. What the boat
 * carries instead is the upswept stem post the head would be mounted on — which
 * is what you actually see from the bank at Echo Park Lake anyway, at the
 * distance the crowd stands.
 *
 * The hull is parameterised as:
 *
 *      t ∈ [0,1]   along the keel, bow → stern
 *      v ∈ [0,1]   around the cross-section, port gunwale → keel → starboard
 *
 * The boat is generated in a canonical frame: length along +X with the bow at
 * +X, beam along Z, up along +Y, waterline at y = 0.
 */

/** Overall length, beam and depth of the hull, in world units. */
export const HULL = {
  length: 7.4,
  beam: 0.62,
  depth: 0.46,
  /** How far the gunwale rises above the waterline amidships. */
  freeboard: 0.16,
  /** Extra rise of the gunwale at bow and stern — the sheer. */
  sheer: 0.44,
} as const;

/** Half-beam at a point along the keel. Tapers to nothing at both ends. */
function halfBeam(t: number): number {
  // sin(πt) is a fair hull; the exponent under 1 pushes the widest point out
  // toward the ends, which is what makes a racing hull look fast rather than
  // like a rowing boat.
  return (HULL.beam / 2) * Math.pow(Math.sin(Math.PI * t), 0.62);
}

/** Depth of the keel below the gunwale at a point along the length. */
function draft(t: number): number {
  return HULL.depth * (0.42 + 0.58 * Math.pow(Math.sin(Math.PI * t), 0.45));
}

/**
 * Height of the gunwale above the waterline. Lowest amidships, sweeping up
 * toward both ends — steeper at the bow, which is where the stem post goes.
 */
function sheerLine(t: number): number {
  const fromMiddle = Math.abs(t - 0.5) * 2;
  const bowBias = t > 0.5 ? 1.18 : 1;
  return HULL.freeboard + HULL.sheer * Math.pow(fromMiddle, 2.6) * bowBias;
}

/**
 * The hull, as a single open surface.
 *
 * Open on purpose: there is no deck and no transom. The camera never looks
 * into the boat from above at an angle that would show the missing faces, and
 * leaving them out halves the triangle count. The material is rendered
 * double-sided so the inside of the hull still shades correctly where it is
 * visible over the gunwale.
 */
export function buildHullGeometry(
  /** The hull's colour above the waterline. The two boats race in two liveries. */
  livery: "red" | "black" = "red",
  lengthSegments = 72,
  girthSegments = 16,
): THREE.BufferGeometry {
  const above = new THREE.Color(livery === "red" ? "#8e1f33" : "#232733");
  const below = new THREE.Color(livery === "red" ? "#3d0a12" : "#0d0f16");
  const positions: number[] = [];
  const normals: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];

  const rim = new THREE.Color("#e8d9c4");

  for (let i = 0; i <= lengthSegments; i++) {
    const t = i / lengthSegments;
    const x = (t - 0.5) * HULL.length;
    const hb = halfBeam(t);
    const top = sheerLine(t);
    const keel = top - draft(t);

    for (let j = 0; j <= girthSegments; j++) {
      const v = j / girthSegments;
      const angle = Math.PI * v;

      const z = -hb * Math.cos(angle);
      const y = top - (top - keel) * Math.sin(angle);

      positions.push(x, y, z);

      // The gunwale strip is painted a bleached rattan; below it the hull is
      // the festival's Red Dragon, darkening toward the keel where no light
      // reaches it on the water.
      const gunwale = Math.min(v, 1 - v) < 0.055;
      const wetness = Math.sin(angle);
      const color = gunwale ? rim : above.clone().lerp(below, wetness * 0.85);
      colors.push(color.r, color.g, color.b);

      // The surface is close enough to a generalised cylinder that the analytic
      // normal of its cross-section is right everywhere the eye can check.
      const n = new THREE.Vector3(0, -Math.cos(angle) * hb, Math.sin(angle) * (top - keel));
      if (n.lengthSq() === 0) n.set(0, 1, 0);
      n.normalize();
      normals.push(n.x, n.y, n.z);
    }
  }

  const stride = girthSegments + 1;
  for (let i = 0; i < lengthSegments; i++) {
    for (let j = 0; j < girthSegments; j++) {
      const a = i * stride + j;
      const b = a + stride;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeBoundingSphere();
  return geometry;
}

/**
 * The stem post: the upswept blade at the bow that a carved head would be
 * pegged onto, and its smaller twin at the stern.
 *
 * A flat blade swept along a quarter-circle, so it curls up and back over the
 * bow the way a real one does.
 */
export function buildStemGeometry(height = 0.8, sweep = 0.56, thickness = 0.028) {
  const steps = 24;
  const positions: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= steps; i++) {
    const u = i / steps;
    // Rises and curls back over itself.
    const x = -sweep * u * u;
    const y = height * Math.sin((u * Math.PI) / 2);
    // The blade is deepest at the root and comes to a point at the tip.
    const halfDepth = 0.055 * (1 - u) + 0.016;

    positions.push(x - halfDepth * 0.4, y, -thickness, x + halfDepth, y, -thickness);
    positions.push(x - halfDepth * 0.4, y, thickness, x + halfDepth, y, thickness);
  }

  const stride = 4;
  for (let i = 0; i < steps; i++) {
    const a = i * stride;
    const b = a + stride;
    // Port face, starboard face, and the two edges that join them.
    indices.push(a, b, a + 1, b, b + 1, a + 1);
    indices.push(a + 2, a + 3, b + 2, a + 3, b + 3, b + 2);
    indices.push(a + 1, b + 1, a + 3, b + 1, b + 3, a + 3);
    indices.push(a, a + 2, b, a + 2, b + 2, b);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

/**
 * Where the eight of them sit, along the boat's length.
 *
 * This is the crew the festival's own race sheet describes and the seating
 * diagram on `/dragon-boats` draws: a drummer at the bow facing back, six
 * paddlers in three pairs, and a steersman standing at the stern. If this ever
 * disagrees with `config/program.ts`, the program file is right and this is
 * wrong — a team captain reads that one.
 */
export type CrewMember = {
  /** Position along the keel, bow → stern, in the same [0,1] as the hull. */
  t: number;
  /** Which side of the boat: -1 port, +1 starboard, 0 on the centreline. */
  side: -1 | 0 | 1;
  role: "drummer" | "paddler" | "steersman";
  /**
   * Offset into the stroke cycle, in radians.
   *
   * Every paddler is zero. Both sides of a dragon boat catch the water on the
   * same beat — that is the entire point of the drum, and it is what the page
   * beside this scene says in words: crews that stay together beat crews that
   * pull harder. Staggering them here would look busier and be wrong.
   */
  phase: number;
};

export const CREW: readonly CrewMember[] = [
  { t: 0.86, side: 0, role: "drummer", phase: 0 },
  { t: 0.63, side: -1, role: "paddler", phase: 0 },
  { t: 0.63, side: 1, role: "paddler", phase: 0 },
  { t: 0.5, side: -1, role: "paddler", phase: 0 },
  { t: 0.5, side: 1, role: "paddler", phase: 0 },
  { t: 0.37, side: -1, role: "paddler", phase: 0 },
  { t: 0.37, side: 1, role: "paddler", phase: 0 },
  { t: 0.12, side: 0, role: "steersman", phase: 0 },
];

/** Where a crew member sits, in the hull's own frame. */
export function seatPosition(member: CrewMember): [number, number, number] {
  const x = (member.t - 0.5) * HULL.length;
  const y = sheerLine(member.t) - draft(member.t) * 0.42;
  const z = member.side * halfBeam(member.t) * 0.5;
  return [x, y, z];
}

/**
 * The lake under the boats: a disc that fades out at its rim.
 *
 * A plane would work if the camera never saw its edge, but this camera is low
 * and the far edge lands in frame as a hard horizon line — which reads as a
 * wall, not as water. Fading the rim to transparent lets the page's own pale
 * blue take over, so the water has no visible end.
 *
 * The fade is carried in a four-component colour attribute. three reads the
 * alpha channel of a `vec4` colour attribute when `vertexColors` is on and the
 * material is transparent, so this needs no shader and no texture.
 */
export function buildWaterGeometry(radius = 16, segments = 96, rings = 24): THREE.BufferGeometry {
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];

  // Dark on purpose. This surface faces straight up into a bright sky and
  // takes every light in the scene at full strength; picked at the colour it
  // should end up, it renders as white sheet metal.
  const near = new THREE.Color("#1d5c8c");
  const far = new THREE.Color("#9cc8e6");

  // Centre vertex.
  positions.push(0, 0, 0);
  colors.push(near.r, near.g, near.b, 1);

  for (let ring = 1; ring <= rings; ring++) {
    // Squared so the tessellation is dense near the boats and sparse out at
    // the rim, where nothing but the fade is happening.
    const r = radius * Math.pow(ring / rings, 2);
    const t = ring / rings;
    const color = near.clone().lerp(far, Math.min(1, t * 1.8));
    // Fully opaque under the boats — a part-transparent surface shows the
    // submerged half of every paddle — and gone by the rim.
    const alpha = 1 - Math.pow(t, 3.4);

    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      positions.push(Math.cos(angle) * r, 0, Math.sin(angle) * r);
      colors.push(color.r, color.g, color.b, alpha);
    }
  }

  // Fan from the centre to the first ring.
  for (let i = 0; i < segments; i++) {
    indices.push(0, 1 + ((i + 1) % segments), 1 + i);
  }

  for (let ring = 0; ring < rings - 1; ring++) {
    const inner = 1 + ring * segments;
    const outer = inner + segments;
    for (let i = 0; i < segments; i++) {
      const j = (i + 1) % segments;
      indices.push(inner + i, outer + j, outer + i);
      indices.push(inner + i, inner + j, outer + j);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 4));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

/** Exposed for the scene and for the tests: the gunwale height at any point. */
export { halfBeam, sheerLine, draft };
