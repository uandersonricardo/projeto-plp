import type { CompilationEnvironment } from "../memory/compilation-environment";
import { PrimitiveType } from "../utils/primitive-type";
import type { Type } from "../utils/type";
import { ConcreteValue } from "./concrete-value";

export class BooleanValue extends ConcreteValue<boolean> {
  constructor(value: boolean) {
    super(value);
  }

  public getType(_env: CompilationEnvironment): Type {
    return PrimitiveType.BOOLEAN;
  }
}
