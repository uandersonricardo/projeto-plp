import type { CompilationEnvironment } from "../memory/compilation-environment";
import type { ExecutionEnvironment } from "../memory/execution-environment";
import type { Type } from "../utils/type";
import type { BooleanValue } from "./boolean-value";
import type { Expression } from "./expression";
import type { Value } from "./value";

export class IfThenElse implements Expression {
  private condition: Expression;
  private thenBranch: Expression;
  private elseExpression: Expression;

  constructor(condition: Expression, thenBranch: Expression, elseExpression: Expression) {
    this.condition = condition;
    this.thenBranch = thenBranch;
    this.elseExpression = elseExpression;
  }

  public getCondition(): Expression {
    return this.condition;
  }

  public getThen(): Expression {
    return this.thenBranch;
  }

  public getElseExpression(): Expression {
    return this.elseExpression;
  }

  public evaluate(environment: ExecutionEnvironment): Value | null {
    if ((this.condition.evaluate(environment) as BooleanValue).getValue()) {
      return this.thenBranch.evaluate(environment);
    } else {
      return this.elseExpression.evaluate(environment);
    }
  }

  public checkType(environment: CompilationEnvironment): boolean {
    let result = this.condition.checkType(environment);
    result = result && this.thenBranch.checkType(environment);
    result = result && this.elseExpression.checkType(environment);

    const conditionType = this.condition.getType(environment);
    const thenType = this.thenBranch.getType(environment);
    const elseType = this.elseExpression.getType(environment);

    return result && (conditionType?.isBoolean() ?? false) && (thenType?.isEquals(elseType!) ?? false);
  }

  public getType(environment: CompilationEnvironment): Type | null {
    return this.thenBranch.getType(environment)?.intersection(this.elseExpression.getType(environment)!) ?? null;
  }

  public toString(): string {
    return `if (${this.condition}) then (${this.thenBranch}) else (${this.elseExpression})`;
  }

  public reduce(environment: ExecutionEnvironment): Expression {
    this.condition = this.condition.reduce(environment)!;
    this.thenBranch = this.thenBranch.reduce(environment)!;
    this.elseExpression = this.elseExpression.reduce(environment)!;
    return this;
  }

  public clone(): IfThenElse {
    return new IfThenElse(this.condition.clone(), this.thenBranch.clone(), this.elseExpression.clone());
  }
}
