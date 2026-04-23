import type { CompilationEnvironment } from "../memory/compilation-environment";
import { PrimitiveType } from "../utils/primitive-type";
import type { Type } from "../utils/type";
import { ConcreteValue } from "./concrete-value";

export class IntegerValue extends ConcreteValue<number> {
  constructor(value: number) {
    super(value);
  }

  public getType(_env: CompilationEnvironment): Type {
    return PrimitiveType.INTEGER;
  }

  public clone(): IntegerValue {
    return new IntegerValue(this.getValue());
  }
}
