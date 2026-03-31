import type { ExecutionEnvironment } from "../memory/execution-environment";
import { PrimitiveType } from "../utils/primitive-type";
import type { Type } from "../utils/type";
import { ConcreteValue } from "./concrete-value";

export class StringValue extends ConcreteValue<string> {
  constructor(value: string) {
    super(value);
  }

  public getType(_env: ExecutionEnvironment): Type {
    return PrimitiveType.STRING;
  }

  public toString(): string {
    return `"${super.toString()}"`;
  }
}
