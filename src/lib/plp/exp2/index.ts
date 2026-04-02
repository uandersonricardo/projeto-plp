import { Exp2Parser, exp2Lexer } from "./parser/exp2-parser";
import type { Program } from "./program";

export class Exp2 {
  public run(input: string) {
    const parser = new Exp2Parser();
    const lexResult = exp2Lexer.tokenize(input);

    parser.input = lexResult.tokens;

    const program = parser.parse() as Program;

    if (!program.checkType()) {
      throw new Error("Type error");
    }

    return program.evaluate();
  }
}
