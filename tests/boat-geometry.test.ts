import assert from "node:assert/strict";
import { describe, it } from "node:test";

import * as THREE from "three";

import {
  buildHullGeometry,
  buildStemGeometry,
  buildWaterGeometry,
  CREW,
  HULL,
  seatPosition,
  sheerLine,
} from "../src/components/dragon/boat-geometry";

/**
 * The dragon boat, like the lotus, is generated from equations rather than
 * loaded from a model. These check the properties that a bad edit would break
 * silently — a hull that floats above the water, a crew that does not match
 * what the program page tells a team captain, a water disc that does not
 * actually fade out.
 */

function bounds(geometry: THREE.BufferGeometry) {
  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  assert.ok(box, "geometry has a bounding box");
  return box;
}

describe("hull geometry", () => {
  const hull = buildHullGeometry();

  it("is exactly as long as HULL.length, centred on the origin", () => {
    const box = bounds(hull);
    assert.ok(Math.abs(box.min.x + HULL.length / 2) < 1e-5);
    assert.ok(Math.abs(box.max.x - HULL.length / 2) < 1e-5);
  });

  it("sits in the water rather than on it", () => {
    // Amidships the keel has to be below y = 0 or the boat is a hovercraft,
    // and the gunwale has to be above it or the boat is a submarine.
    const box = bounds(hull);
    assert.ok(box.min.y < -0.2, `keel at ${box.min.y}`);
    assert.ok(box.max.y > 0.1, `gunwale at ${box.max.y}`);
  });

  it("sweeps its ends up higher than its middle", () => {
    assert.ok(sheerLine(0) > sheerLine(0.5));
    assert.ok(sheerLine(1) > sheerLine(0.5));
    // And the bow higher than the stern, which is where the post goes.
    assert.ok(sheerLine(1) > sheerLine(0));
  });

  it("has a finite position for every vertex", () => {
    const position = hull.getAttribute("position");
    for (let i = 0; i < position.count * 3; i++) {
      assert.ok(Number.isFinite(position.array[i]), `vertex component ${i} is finite`);
    }
  });

  it("gives the two liveries different colours", () => {
    const red = buildHullGeometry("red").getAttribute("color");
    const black = buildHullGeometry("black").getAttribute("color");
    // Compare a vertex from the middle of the hull, well away from the shared
    // cream gunwale strip at either edge of the cross-section.
    const i = Math.floor(red.count / 2) * 3;
    assert.notEqual(red.array[i], black.array[i]);
  });
});

describe("stem post", () => {
  it("only ever rises", () => {
    // A post whose geometry dips below its own origin hangs under the bow
    // like a rudder once it is stepped on the gunwale.
    const box = bounds(buildStemGeometry());
    assert.ok(box.min.y >= 0, `stem dips to ${box.min.y}`);
  });

  it("sweeps backwards from its root, never forwards", () => {
    const box = bounds(buildStemGeometry());
    assert.ok(box.min.x < 0);
    assert.ok(box.max.x < 0.2);
  });
});

describe("the crew", () => {
  it("is the eight the program page describes", () => {
    assert.equal(CREW.length, 8);
    assert.equal(CREW.filter((m) => m.role === "drummer").length, 1);
    assert.equal(CREW.filter((m) => m.role === "paddler").length, 6);
    assert.equal(CREW.filter((m) => m.role === "steersman").length, 1);
  });

  it("paddles in unison", () => {
    // Both sides catch the water on the same beat. If this ever needs to be
    // false, the copy on /dragon-boats needs changing at the same time.
    const phases = new Set(CREW.filter((m) => m.role === "paddler").map((m) => m.phase));
    assert.equal(phases.size, 1);
  });

  it("puts three paddlers on each side", () => {
    const paddlers = CREW.filter((m) => m.role === "paddler");
    assert.equal(paddlers.filter((m) => m.side === -1).length, 3);
    assert.equal(paddlers.filter((m) => m.side === 1).length, 3);
  });

  it("seats everyone inside the hull", () => {
    for (const member of CREW) {
      const [x, y, z] = seatPosition(member);
      assert.ok(Math.abs(x) < HULL.length / 2, `${member.role} is inside the ends`);
      assert.ok(Math.abs(z) <= HULL.beam / 2, `${member.role} is inboard`);
      // Sitting on the thwarts, not on the keel and not in mid-air.
      assert.ok(y > -HULL.depth && y < HULL.freeboard + HULL.sheer, `${member.role} at ${y}`);
    }
  });

  it("puts the drummer forward of the steersman", () => {
    const drummer = CREW.find((m) => m.role === "drummer");
    const steersman = CREW.find((m) => m.role === "steersman");
    assert.ok(drummer && steersman);
    assert.ok(seatPosition(drummer)[0] > seatPosition(steersman)[0]);
  });
});

describe("water", () => {
  const water = buildWaterGeometry(16, 24, 8);

  it("carries an alpha channel, or the rim cannot fade", () => {
    assert.equal(water.getAttribute("color").itemSize, 4);
  });

  it("is opaque at the centre and transparent at the rim", () => {
    const color = water.getAttribute("color");
    assert.ok(color.getW(0) > 0.99, "centre is opaque");
    assert.ok(color.getW(color.count - 1) < 0.01, "rim is clear");
  });

  it("is flat", () => {
    const box = bounds(water);
    assert.equal(box.min.y, 0);
    assert.equal(box.max.y, 0);
  });
});
