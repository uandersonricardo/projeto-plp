import type { CompilationEnvironment } from "../memory/compilation-environment";
import type { ExecutionEnvironment } from "../memory/execution-environment";
import type { Declaration } from "./declaration";

export class CompositeDeclaration implements Declaration {
  private d1: Declaration;
  private d2: Declaration;

  constructor(d1: Declaration, d2: Declaration) {
    this.d1 = d1;
    this.d2 = d2;
  }

  public elaborateExecution(env: ExecutionEnvironment, aux: ExecutionEnvironment): void {
    this.d1.elaborateExecution(env, aux);
    this.d2.elaborateExecution(env, aux);
  }

  public elaborateCompilation(env: CompilationEnvironment, aux: CompilationEnvironment): void {
    this.d1.elaborateCompilation(env, aux);
    this.d2.elaborateCompilation(env, aux);
  }

  public checkType(env: CompilationEnvironment): boolean {
    return this.d1.checkType(env) && this.d2.checkType(env);
  }

  public reduce(env: ExecutionEnvironment): void {
    this.d1.reduce(env);
    this.d2.reduce(env);
  }

  public includeExecution(env: ExecutionEnvironment, aux: ExecutionEnvironment): void {
    this.d1.includeExecution(env, aux);
    this.d2.includeExecution(env, aux);
  }

  public includeCompilation(env: CompilationEnvironment, aux: CompilationEnvironment): void {
    this.d1.includeCompilation(env, aux);
    this.d2.includeCompilation(env, aux);
  }
}
