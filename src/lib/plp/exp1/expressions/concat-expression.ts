import type { CompilationEnvironment } from "../memory/compilation-environment";
import type { ExecutionEnvironment } from "../memory/execution-environment";
import { PrimitiveType } from "../utils/primitive-type";
import type { Type } from "../utils/type";
import { BinaryExpression } from "./binary-expression";
import type { Expression } from "./expression";
import { StringValue } from "./string-value";
import type { Value } from "./value";

export class ConcatExpression extends BinaryExpression {
  constructor(left: Expression, right: Expression) {
    super(left, right, "++");
  }

  public evaluate(env: ExecutionEnvironment): Value {
    const leftValue = this.getLeft().evaluate(env) as StringValue;
    const rightValue = this.getRight().evaluate(env) as StringValue;

    return new StringValue(leftValue.getValue() + rightValue.getValue());
  }

  public getType(_env: CompilationEnvironment): Type {
    return PrimitiveType.STRING;
  }

  protected checkTypeTerminalElement(env: CompilationEnvironment): boolean {
    const leftType = this.getLeft().getType(env);
    const rightType = this.getRight().getType(env);

    return leftType.isString() && rightType.isString();
  }
}
