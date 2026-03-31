import type { ExecutionEnvironment } from "../memory/execution-environment";
import { PrimitiveType } from "../utils/primitive-type";
import type { Type } from "../utils/type";
import { ConcreteValue } from "./concrete-value";

export class IntegerValue extends ConcreteValue<number> {
  constructor(value: number) {
    super(value);
  }

  public getType(_env: ExecutionEnvironment): Type {
    return PrimitiveType.INTEGER;
  }
}
