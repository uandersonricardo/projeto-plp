import type { CompilationEnvironment } from "../memory/compilation-environment";
import type { FunctionalExecutionEnvironment } from "../memory/functional-execution-environment";

export interface FunctionalDeclaration {
  checkType(env: CompilationEnvironment): boolean;
  elaborateExecution(env: FunctionalExecutionEnvironment, aux: FunctionalExecutionEnvironment): void;
  elaborateCompilation(env: CompilationEnvironment, aux: CompilationEnvironment): void;
  includeExecution(env: FunctionalExecutionEnvironment, aux: FunctionalExecutionEnvironment): void;
  includeCompilation(env: CompilationEnvironment, aux: CompilationEnvironment): void;
  clone(): FunctionalDeclaration;
}
