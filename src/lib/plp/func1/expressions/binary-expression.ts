import type { CompilationEnvironment } from "../memory/compilation-environment";
import type { ExecutionEnvironment } from "../memory/execution-environment";
import type { Type } from "../utils/type";
import type { Expression } from "./expression";
import type { Value } from "./value";

export abstract class BinaryExpression implements Expression {
  private left: Expression;
  private right: Expression;
  private operator: string;

  constructor(left: Expression, right: Expression, operator: string) {
    this.left = left;
    this.right = right;
    this.operator = operator;
  }

  public getLeft(): Expression {
    return this.left;
  }

  public getRight(): Expression {
    return this.right;
  }

  public getOperator(): string {
    return this.operator;
  }

  public toString(): string {
    return `${this.left} ${this.operator} ${this.right}`;
  }

  public checkType(env: CompilationEnvironment): boolean {
    if (!this.getLeft().checkType(env) || !this.getRight().checkType(env)) {
      return false;
    }

    return this.checkTypeTerminalElement(env);
  }

  public reduce(env: ExecutionEnvironment): Expression {
    this.left = this.left.reduce(env)!;
    this.right = this.right.reduce(env)!;

    return this;
  }

  public abstract evaluate(env: ExecutionEnvironment): Value;

  public abstract getType(env: CompilationEnvironment): Type;

  public abstract clone(): BinaryExpression;

  protected abstract checkTypeTerminalElement(env: CompilationEnvironment): boolean;
}
