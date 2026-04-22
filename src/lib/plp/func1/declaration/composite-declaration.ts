import type { CompilationEnvironment } from "../memory/compilation-environment";
import type { FunctionalExecutionEnvironment } from "../memory/functional-execution-environment";
import type { FunctionalDeclaration } from "./functional-declaration";

export class CompositeDeclaration implements FunctionalDeclaration {
  private d1: FunctionalDeclaration;
  private d2: FunctionalDeclaration;

  constructor(d1: FunctionalDeclaration, d2: FunctionalDeclaration) {
    this.d1 = d1;
    this.d2 = d2;
  }

  public checkType(env: CompilationEnvironment): boolean {
    return this.d1.checkType(env) && this.d2.checkType(env);
  }

  public elaborateExecution(env: FunctionalExecutionEnvironment, aux: FunctionalExecutionEnvironment): void {
    this.d1.elaborateExecution(env, aux);
    this.d2.elaborateExecution(env, aux);
  }

  public elaborateCompilation(env: CompilationEnvironment, aux: CompilationEnvironment): void {
    this.d1.elaborateCompilation(env, aux);
    this.d2.elaborateCompilation(env, aux);
  }

  public includeExecution(env: FunctionalExecutionEnvironment, aux: FunctionalExecutionEnvironment): void {
    this.d1.includeExecution(env, aux);
    this.d2.includeExecution(env, aux);
  }

  public includeCompilation(env: CompilationEnvironment, aux: CompilationEnvironment): void {
    this.d1.includeCompilation(env, aux);
    this.d2.includeCompilation(env, aux);
  }

  public clone(): FunctionalDeclaration {
    return new CompositeDeclaration(this.d1.clone(), this.d2.clone());
  }
}
