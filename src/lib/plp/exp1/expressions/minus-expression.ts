import type { CompilationEnvironment } from "../../exp2/memory/compilation-environment";
import type { ExecutionEnvironment } from "../../exp2/memory/execution-environment";
import { PrimitiveType } from "../utils/primitive-type";
import type { Type } from "../utils/type";
import type { Expression } from "./expression";
import { IntegerValue } from "./integer-value";
import { UnaryExpression } from "./unary-expression";
import type { Value } from "./value";

export class MinusExpression extends UnaryExpression {
  constructor(expression: Expression) {
    super(expression, "-");
  }

  public evaluate(env: ExecutionEnvironment): Value {
    const expressionValue = this.getExpression().evaluate(env) as IntegerValue;

    return new IntegerValue(-expressionValue.getValue());
  }

  public getType(_env: ExecutionEnvironment): Type {
    return PrimitiveType.INTEGER;
  }

  protected checkTypeTerminalElement(env: CompilationEnvironment): boolean {
    const expressionType = this.getExpression().getType(env);

    return expressionType.isInteger();
  }
}
