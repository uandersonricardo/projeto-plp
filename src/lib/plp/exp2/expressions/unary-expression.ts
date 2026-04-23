import type { CompilationEnvironment } from "../memory/compilation-environment";
import type { ExecutionEnvironment } from "../memory/execution-environment";
import type { Type } from "../utils/type";
import type { Expression } from "./expression";
import type { Value } from "./value";

export abstract class UnaryExpression implements Expression {
  private expression: Expression;
  private operator: string;

  constructor(expression: Expression, operator: string) {
    this.expression = expression;
    this.operator = operator;
  }

  public getExpression(): Expression {
    return this.expression;
  }

  public getOperator(): string {
    return this.operator;
  }

  public toString(): string {
    return `${this.operator} ${this.expression}`;
  }

  public checkType(env: CompilationEnvironment): boolean {
    return this.getExpression().checkType(env) && this.checkTypeTerminalElement(env);
  }

  public reduce(env: ExecutionEnvironment): Expression {
    this.expression = this.expression.reduce(env)!;

    return this;
  }

  public abstract evaluate(env: ExecutionEnvironment): Value;

  public abstract getType(env: CompilationEnvironment): Type;

  public abstract clone(): UnaryExpression;

  protected abstract checkTypeTerminalElement(env: CompilationEnvironment): boolean;
}
