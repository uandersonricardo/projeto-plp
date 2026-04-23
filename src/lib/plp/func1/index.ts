import { Func1Parser, func1Lexer } from "./parser/func1-parser";
import type { Program } from "./program";

export class Func1 {
  public run(input: string) {
    const parser = new Func1Parser();
    const lexResult = func1Lexer.tokenize(input);

    parser.input = lexResult.tokens;

    const program = parser.parse() as Program;

    if (!program.checkType()) {
      throw new Error("Type error");
    }

    return program.evaluate();
  }
}
