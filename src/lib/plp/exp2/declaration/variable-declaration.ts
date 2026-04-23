import type { Expression } from "../expressions/expression";
import type { Id } from "../expressions/id";
import type { CompilationEnvironment } from "../memory/compilation-environment";
import type { ExecutionEnvironment } from "../memory/execution-environment";
import type { Declaration } from "./declaration";

export class VariableDeclaration implements Declaration {
  private id: Id;
  private expression: Expression;

  constructor(id: Id, expression: Expression) {
    this.id = id;
    this.expression = expression;
  }

  public getId(): Id {
    return this.id;
  }

  public getExpression(): Expression {
    return this.expression;
  }

  public elaborateExecution(env: ExecutionEnvironment, aux: ExecutionEnvironment): void {
    aux.map(this.getId(), this.getExpression().evaluate(env));
  }

  public elaborateCompilation(env: CompilationEnvironment, aux: CompilationEnvironment): void {
    aux.map(this.getId(), this.getExpression().getType(env));
  }

  public checkType(env: CompilationEnvironment): boolean {
    return this.getExpression().checkType(env);
  }

  public reduce(env: ExecutionEnvironment): void {
    env.map(this.getId(), null);
  }

  public includeExecution(env: ExecutionEnvironment, aux: ExecutionEnvironment): void {
    env.map(this.getId(), aux.get(this.getId()));
  }

  public includeCompilation(env: CompilationEnvironment, aux: CompilationEnvironment): void {
    env.map(this.getId(), aux.get(this.getId()));
  }
}
