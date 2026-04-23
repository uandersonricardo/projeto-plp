import { describe, expect, it } from "vitest";

import type { IntegerValue } from "../../src/lib/plp/exp1/expressions/integer-value";
import { Exp1 } from "../../src/lib/plp/exp1";

const input = 'length "abcd" + 6';

describe("Exp1", () => {
  it("evaluates input", () => {
    const exp1 = new Exp1();
    const result = exp1.run(input) as IntegerValue;

    expect(result.getValue()).toBe(10);
  });
});
