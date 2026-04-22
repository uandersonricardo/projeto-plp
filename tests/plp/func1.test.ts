import { describe, expect, it } from "vitest";

import type { IntegerValue } from "../../src/lib/plp/func1/expressions/integer-value";
import { Func1 } from "../../src/lib/plp/func1";

const input = `
let fun fat n =
		    let fun mult x y = if (x == 0) then (0) else (y + (mult((x - 1),y)))
		    in if (n == 0) then (1) else (mult(n,(fat (n - 1))))
		in fat(5)
`.trim();

const input2 = `
let var a = 1, var b = (2+3), var c = 1, var d = 2, fun doido a b = a+b, fun boa a b = a+b+b 
	in doido(boa(a,b),doido(c,d))
`.trim();

describe("Func1", () => {
  it("evaluates input", () => {
    const exp1 = new Func1();
    const result = exp1.run(input) as IntegerValue;

    expect(result.getValue()).toBe(120);
  });

  it("evaluates input2", () => {
    const exp1 = new Func1();
    const result = exp1.run(input2) as IntegerValue;

    expect(result.getValue()).toBe(14);
  });
});
