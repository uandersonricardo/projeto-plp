import type { CompilationEnvironment } from "../memory/compilation-environment";
import type { ExecutionEnvironment } from "../memory/execution-environment";
import type { Type } from "../utils/type";
import type { Value } from "./value";

export interface Expression {
  evaluate(env: ExecutionEnvironment): Value | null;
  checkType(env: CompilationEnvironment): boolean;
  getType(env: CompilationEnvironment): Type | null;
  reduce(env: ExecutionEnvironment): Expression | null;
  clone(): Expression;
}
