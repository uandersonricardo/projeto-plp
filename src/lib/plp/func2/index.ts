import { Func2Parser, func2Lexer } from "./parser/func2-parser";
import type { Program } from "./program";

export class Func2 {
  public run(input: string) {
    const parser = new Func2Parser();
    const lexResult = func2Lexer.tokenize(input);

    parser.input = lexResult.tokens;

    const program = parser.parse() as Program;

    if (!program.checkType()) {
      throw new Error("Type error");
    }

    return program.evaluate();
  }
}
