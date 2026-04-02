import type { CompilationEnvironment } from "../memory/compilation-environment";
import type { ExecutionEnvironment } from "../memory/execution-environment";

export interface Declaration {
  elaborateExecution(env: ExecutionEnvironment, aux: ExecutionEnvironment): void;
  elaborateCompilation(env: CompilationEnvironment, aux: CompilationEnvironment): void;
  includeExecution(env: ExecutionEnvironment, aux: ExecutionEnvironment): void;
  includeCompilation(env: CompilationEnvironment, aux: CompilationEnvironment): void;
  checkType(env: CompilationEnvironment): boolean;
  reduce(env: ExecutionEnvironment): void;
}
