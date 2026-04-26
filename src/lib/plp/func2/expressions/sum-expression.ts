import type { CompilationEnvironment } from "../memory/compilation-environment";
import type { ExecutionEnvironment } from "../memory/execution-environment";
import { PrimitiveType } from "../utils/primitive-type";
import type { Type } from "../utils/type";
import { BinaryExpression } from "./binary-expression";
import type { Expression } from "./expression";
import { IntegerValue } from "./integer-value";
import type { Value } from "./value";

export class SumExpression extends BinaryExpression {
  constructor(left: Expression, right: Expression) {
    super(left, right, "+");
  }

  public evaluate(env: ExecutionEnvironment): Value {
    const leftValue = this.getLeft().evaluate(env) as IntegerValue;
    const rightValue = this.getRight().evaluate(env) as IntegerValue;

    return new IntegerValue(leftValue.getValue() + rightValue.getValue());
  }

  public getType(_env: CompilationEnvironment): Type {
    return PrimitiveType.INTEGER;
  }

  public clone(): BinaryExpression {
    return new SumExpression(this.getLeft().clone(), this.getRight().clone());
  }

  protected checkTypeTerminalElement(env: CompilationEnvironment): boolean {
    const leftType = this.getLeft().getType(env)!;
    const rightType = this.getRight().getType(env)!;

    return leftType.isInteger() && rightType.isInteger();
  }
}
