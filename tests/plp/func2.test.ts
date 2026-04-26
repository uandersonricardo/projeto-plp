import { describe, expect, it } from "vitest";

import type { IntegerValue } from "../../src/lib/plp/func2/expressions/integer-value";
import { Func2 } from "../../src/lib/plp/func2";

const input = `(let fun dec n = if (n==0) then 0 else n + dec(n-1) in dec)(5)`;

const input2 = `
let fun add x = fn y . x + y in
   let var id = add(0), var x = 4 in
      id(1) + x
`.trim();

describe("Func2", () => {
  it("evaluates recursive function returned from let", () => {
    const func2 = new Func2();
    const result = func2.run(input) as IntegerValue;

    expect(result.getValue()).toBe(15);
  });

  it("evaluates closures and higher-order functions", () => {
    const func2 = new Func2();
    const result = func2.run(input2) as IntegerValue;

    expect(result.getValue()).toBe(5);
  });
});
