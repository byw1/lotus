import assert from "node:assert/strict";
import { describe, it } from "node:test";

import * as THREE from "three";

import {
  buildMorphingPetal,
  buildPetalGeometry,
  buildReceptacleGeometry,
  buildStamenGeometry,
  seedPositions,
  WHORLS,
} from "../src/components/lotus/petal-geometry";

/**
 * The flower is generated from equations rather than loaded from a model, so
 * these are the only thing standing between a bad edit and a lotus that looks
 * like a cabbage. They check the properties that matter and would otherwise
 * only be caught by eye.
 */

const SEGMENTS = { lengthSegments: 30, widthSegments: 16 };

/** Walk the centre column of the mesh and sum the segment lengths. */
function centreLineLength(geometry: THREE.BufferGeometry, n: number, m: number) {
  const position = geometry.getAttribute("position");
  const middle = Math.floor(m / 2);
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  let total = 0;
  for (let i = 0; i < n; i++) {
    a.fromBufferAttribute(position, i * (m + 1) + middle);
    b.fromBufferAttribute(position, (i + 1) * (m + 1) + middle);
    total += a.distanceTo(b);
  }
  return total;
}

describe("petal geometry", () => {
  for (const [index, whorl] of WHORLS.entries()) {
    describe(`whorl ${index}`, () => {
      const geometry = buildPetalGeometry({ ...whorl.petal, ...SEGMENTS });

      it("produces no NaN in positions or normals", () => {
        for (const name of ["position", "normal"] as const) {
          const array = geometry.getAttribute(name).array as Float32Array;
          assert.ok(!array.some(Number.isNaN), `${name} contains NaN`);
        }
      });

      it("preserves the petal's arc length", () => {
        // The spine is integrated at a fixed step rather than sampled from a
        // curve, which is what lets a petal bend without stretching. If this
        // drifts, the bloom animation will visibly grow the petals.
        const measured = centreLineLength(
          geometry,
          SEGMENTS.lengthSegments,
          SEGMENTS.widthSegments,
        );
        const error = Math.abs(measured - whorl.petal.length) / whorl.petal.length;
        assert.ok(error < 0.02, `arc length off by ${(error * 100).toFixed(2)}%`);
      });

      it("is as wide as it was asked to be", () => {
        geometry.computeBoundingBox();
        const width = geometry.boundingBox!.max.x - geometry.boundingBox!.min.x;
        const error = Math.abs(width - whorl.petal.width) / whorl.petal.width;
        assert.ok(error < 0.06, `width off by ${(error * 100).toFixed(2)}%`);
      });

      it("grows upward and arches outward", () => {
        geometry.computeBoundingBox();
        assert.ok(geometry.boundingBox!.max.y > 0, "petal does not grow up +Y");
        assert.ok(geometry.boundingBox!.max.z > 0, "petal does not arch toward +Z");
      });

      it("carries a closed pose as morph target 0", () => {
        const morphing = buildMorphingPetal({ ...whorl.petal, ...SEGMENTS });
        const positions = morphing.morphAttributes.position?.[0];
        const normals = morphing.morphAttributes.normal?.[0];
        assert.ok(positions, "no morph positions");
        assert.ok(normals, "no morph normals");
        assert.equal(positions!.count, morphing.getAttribute("position").count);
        assert.equal(normals!.count, morphing.getAttribute("normal").count);
        assert.equal(morphing.morphTargetsRelative, false);
      });

      it("closes to a more upright bud than it opens to", () => {
        const morphing = buildMorphingPetal({ ...whorl.petal, ...SEGMENTS });
        const tip =
          SEGMENTS.lengthSegments * (SEGMENTS.widthSegments + 1) +
          Math.floor(SEGMENTS.widthSegments / 2);

        const open = new THREE.Vector3().fromBufferAttribute(
          morphing.getAttribute("position"),
          tip,
        );
        const closed = new THREE.Vector3().fromBufferAttribute(
          morphing.morphAttributes.position![0] as THREE.BufferAttribute,
          tip,
        );

        // Angle of the petal tip away from the flower's vertical axis. Compare
        // the tip, not the bounding box: the closed pose cups harder, so its
        // box can bulge outward even while the petal itself stands upright.
        const splay = (v: THREE.Vector3) => Math.atan2(v.z, v.y) * (180 / Math.PI);
        assert.ok(
          splay(closed) < splay(open) - 5,
          `closed tip at ${splay(closed).toFixed(1)}° vs open at ${splay(open).toFixed(1)}°`,
        );
        assert.ok(closed.y > open.y, "closed petal should stand taller than the open one");
      });
    });
  }

  it("opens outermost-first", () => {
    const orders = WHORLS.map((w) => w.bloomOrder);
    assert.deepEqual(
      orders,
      [...orders].sort((a, b) => a - b),
      "whorls are not ordered outside-in",
    );
  });
});

describe("flower parts", () => {
  it("builds a receptacle at the requested size", () => {
    const geometry = buildReceptacleGeometry(0.29, 0.2);
    geometry.computeBoundingBox();
    assert.ok(Math.abs(geometry.boundingBox!.max.x - 0.29) < 0.01);
    assert.ok(Math.abs(geometry.boundingBox!.max.y - 0.2) < 0.01);
  });

  it("builds a stamen standing on the origin, with vertex colours", () => {
    const geometry = buildStamenGeometry(0.26);
    geometry.computeBoundingBox();
    assert.ok(Math.abs(geometry.boundingBox!.min.y) < 1e-6, "stamen should start at y=0");
    assert.ok(geometry.getAttribute("color"), "stamen needs vertex colours for the gold tip");
  });

  it("spaces seeds on a spiral inside the pod", () => {
    const radius = 0.29;
    const seeds = seedPositions(21, radius);
    assert.equal(seeds.length, 21);
    for (const [x, z] of seeds) {
      assert.ok(Math.hypot(x, z) < radius, "a seed fell outside the pod");
    }
    // Golden-angle placement means no two seeds share a position.
    const unique = new Set(seeds.map(([x, z]) => `${x.toFixed(4)},${z.toFixed(4)}`));
    assert.equal(unique.size, seeds.length, "seeds overlap");
  });
});
