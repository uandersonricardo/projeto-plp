import type { CompilationEnvironment } from "../memory/compilation-environment";
import type { ExecutionEnvironment } from "../memory/execution-environment";
import type { Type } from "../utils/type";
import type { Expression } from "./expression";
import type { Value } from "./value";

export class IrreducibleValue implements Value {
  public evaluate(_env: ExecutionEnvironment): Value | null {
    return null;
  }

  public checkType(_env: CompilationEnvironment): boolean {
    return true;
  }

  public getType(_env: CompilationEnvironment): Type | null {
    return null;
  }

  public reduce(_env: ExecutionEnvironment): Expression {
    return this;
  }

  public clone(): IrreducibleValue {
    return this;
  }
}
