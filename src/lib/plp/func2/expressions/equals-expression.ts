import type { CompilationEnvironment } from "../memory/compilation-environment";
import type { ExecutionEnvironment } from "../memory/execution-environment";
import { PrimitiveType } from "../utils/primitive-type";
import type { Type } from "../utils/type";
import { BinaryExpression } from "./binary-expression";
import { BooleanValue } from "./boolean-value";
import type { ConcreteValue } from "./concrete-value";
import type { Expression } from "./expression";
import type { Value } from "./value";

export class EqualsExpression extends BinaryExpression {
  constructor(left: Expression, right: Expression) {
    super(left, right, "==");
  }

  public evaluate(env: ExecutionEnvironment): Value {
    const leftValue = this.getLeft().evaluate(env) as ConcreteValue<any>;
    const rightValue = this.getRight().evaluate(env) as ConcreteValue<any>;

    return new BooleanValue(leftValue.getValue() === rightValue.getValue());
  }

  public getType(_env: CompilationEnvironment): Type {
    return PrimitiveType.BOOLEAN;
  }

  public clone(): BinaryExpression {
    return new EqualsExpression(this.getLeft().clone(), this.getRight().clone());
  }

  protected checkTypeTerminalElement(env: CompilationEnvironment): boolean {
    const leftType = this.getLeft().getType(env)!;
    const rightType = this.getRight().getType(env)!;

    return leftType.isEquals(rightType);
  }
}
