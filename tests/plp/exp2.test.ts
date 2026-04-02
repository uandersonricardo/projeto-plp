import { describe, expect, it } from "vitest";

import type { IntegerValue } from "../../src/lib/plp/exp2/expressions/integer-value";
import { Exp2 } from "../../src/lib/plp/exp2";

const input = `
let var a = 3 in 
	let var a = 2, var b = a
		in a+b
`.trim();

describe("Exp2", () => {
  it("evaluates input", () => {
    const exp1 = new Exp2();
    const result = exp1.run(input) as IntegerValue;

    expect(result.getValue()).toBe(5);
  });
});
