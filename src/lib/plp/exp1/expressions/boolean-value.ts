import type { ExecutionEnvironment } from "../memory/execution-environment";
import { PrimitiveType } from "../utils/primitive-type";
import type { Type } from "../utils/type";
import { ConcreteValue } from "./concrete-value";

export class BooleanValue extends ConcreteValue<boolean> {
  constructor(value: boolean) {
    super(value);
  }

  public getType(_env: ExecutionEnvironment): Type {
    return PrimitiveType.BOOLEAN;
  }
}
