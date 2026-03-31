import type { CompilationEnvironment } from "../memory/compilation-environment";
import type { ExecutionEnvironment } from "../memory/execution-environment";
import type { Type } from "../utils/type";
import type { Value } from "./value";

export interface Expression {
  evaluate(env: ExecutionEnvironment): Value;
  checkType(env: CompilationEnvironment): boolean;
  getType(env: CompilationEnvironment): Type;
}
