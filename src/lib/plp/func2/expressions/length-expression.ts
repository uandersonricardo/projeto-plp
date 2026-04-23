import type { CompilationEnvironment } from "../memory/compilation-environment";
import type { ExecutionEnvironment } from "../memory/execution-environment";
import { PrimitiveType } from "../utils/primitive-type";
import type { Type } from "../utils/type";
import type { Expression } from "./expression";
import { IntegerValue } from "./integer-value";
import type { StringValue } from "./string-value";
import { UnaryExpression } from "./unary-expression";
import type { Value } from "./value";

export class LengthExpression extends UnaryExpression {
  constructor(expression: Expression) {
    super(expression, "length");
  }

  public evaluate(env: ExecutionEnvironment): Value {
    const expressionValue = this.getExpression().evaluate(env) as StringValue;

    return new IntegerValue(expressionValue.getValue().length);
  }

  public getType(_env: CompilationEnvironment): Type {
    return PrimitiveType.INTEGER;
  }

  public clone(): UnaryExpression {
    return new LengthExpression(this.getExpression().clone());
  }

  protected checkTypeTerminalElement(env: CompilationEnvironment): boolean {
    const expressionType = this.getExpression().getType(env)!;

    return expressionType.isString();
  }
}
