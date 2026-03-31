import { Exp1Parser, exp1Lexer } from "./parser/exp1-parser";
import type { Program } from "./program";

export class Exp1 {
  public run(input: string) {
    const parser = new Exp1Parser();
    const lexResult = exp1Lexer.tokenize(input);

    parser.input = lexResult.tokens;

    const program = parser.parse() as Program;

    if (!program.checkType()) {
      throw new Error('Type error');
    }

    return program.evaluate();
  }
}
