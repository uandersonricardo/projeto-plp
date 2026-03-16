import type { CompilationEnvironment } from "../../exp2/memory/compilation-environment";
import type { ExecutionEnvironment } from "../../exp2/memory/execution-environment";
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

  public getType(_env: ExecutionEnvironment): Type {
    return PrimitiveType.INTEGER;
  }

  protected checkTypeTerminalElement(env: CompilationEnvironment): boolean {
    const leftType = this.getLeft().getType(env);
    const rightType = this.getRight().getType(env);

    return leftType.isInteger() && rightType.isInteger();
  }
}
