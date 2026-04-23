import { CompilationContext } from "./memory/compilation-context";
import type { CompilationEnvironment } from "./memory/compilation-environment";
import { ExecutionContext } from "./memory/execution-context";
import type { ExecutionEnvironment } from "./memory/execution-environment";
import type { Expression } from "./expressions/expression";
import type { Value } from "./expressions/value";

export class Program {
  private expression: Expression;

  constructor(expression: Expression) {
    this.expression = expression;
  }

  public evaluate(): Value | null {
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
