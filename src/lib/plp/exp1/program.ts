import { CompilationContext } from "../exp2/memory/compilation-context";
import type { CompilationEnvironment } from "../exp2/memory/compilation-environment";
import { ExecutionContext } from "../exp2/memory/execution-context";
import type { ExecutionEnvironment } from "../exp2/memory/execution-environment";
import type { Expression } from "./expressions/expression";
import type { Value } from "./expressions/value";

export class Program {
  private expression: Expression;

  constructor(expression: Expression) {
    this.expression = expression;
  }

  public evaluate(): Value {
    const executionEnvironment: ExecutionEnvironment = new ExecutionContext();
    const result = this.expression.evaluate(executionEnvironment);

    return result;
  }

  public checkType(): boolean {
    const compilationEnvironment: CompilationEnvironment = new CompilationContext();
    return this.expression.checkType(compilationEnvironment);
  }

  public getExpression(): Expression {
    return this.expression;
  }
}
