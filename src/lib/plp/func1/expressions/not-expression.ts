import type { CompilationEnvironment } from "../memory/compilation-environment";
import type { ExecutionEnvironment } from "../memory/execution-environment";
import { PrimitiveType } from "../utils/primitive-type";
import type { Type } from "../utils/type";
import { BooleanValue } from "./boolean-value";
import type { Expression } from "./expression";
import { UnaryExpression } from "./unary-expression";
import type { Value } from "./value";

export class NotExpression extends UnaryExpression {
  constructor(expression: Expression) {
    super(expression, "~");
  }

  public evaluate(env: ExecutionEnvironment): Value {
    const expressionValue = this.getExpression().evaluate(env) as BooleanValue;

    return new BooleanValue(!expressionValue.getValue());
  }

  public getType(_env: CompilationEnvironment): Type {
    return PrimitiveType.BOOLEAN;
  }

  public clone(): UnaryExpression {
    return new NotExpression(this.getExpression().clone());
  }

  protected checkTypeTerminalElement(env: CompilationEnvironment): boolean {
    const expressionType = this.getExpression().getType(env)!;

    return expressionType.isBoolean();
  }
}
