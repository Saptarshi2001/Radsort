import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { rxsort } from "../dist/rad.js";

describe("rxsort", () => {
  it("returns an empty array for an empty input", () => {
    assert.deepEqual(rxsort([]), []);
  });

  it("sorts single-digit positive numbers in ascending order", () => {
    assert.deepEqual(rxsort([3, 1, 2]), [1, 2, 3]);
  });

  it("sorts multi-digit positive numbers in ascending order", () => {
    assert.deepEqual(rxsort([170, 45, 75, 90, 802, 24, 2, 66]), [
      2,
      24,
      45,
      66,
      75,
      90,
      170,
      802,
    ]);
  });

  it("preserves duplicate values while sorting", () => {
    assert.deepEqual(rxsort([5, 3, 5, 1, 3]), [1, 3, 3, 5, 5]);
  });

  it("does not mutate the input array", () => {
    const input = [4, 1, 3, 2];

    rxsort(input);

    assert.deepEqual(input, [4, 1, 3, 2]);
  });
});
