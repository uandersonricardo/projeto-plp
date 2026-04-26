import type { Expression } from "../expressions/expression";
import type { Id } from "../expressions/id";
import type { CompilationEnvironment } from "../memory/compilation-environment";
import type { FunctionalExecutionEnvironment } from "../memory/functional-execution-environment";
import type { FunctionalDeclaration } from "./functional-declaration";

export class VariableDeclaration implements FunctionalDeclaration {
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

  public checkType(env: CompilationEnvironment): boolean {
    return this.getExpression().checkType(env);
  }

  public clone(): VariableDeclaration {
    return new VariableDeclaration(this.id.clone(), this.expression.clone());
  }

  public elaborateExecution(env: FunctionalExecutionEnvironment, aux: FunctionalExecutionEnvironment): void {
    aux.map(this.getId(), this.getExpression().evaluate(env));
  }

  public elaborateCompilation(env: CompilationEnvironment, aux: CompilationEnvironment): void {
    aux.map(this.getId(), this.getExpression().getType(env));
  }

  public reduce(env: FunctionalExecutionEnvironment): void {
    env.map(this.getId(), null);
  }

  public includeExecution(env: FunctionalExecutionEnvironment, aux: FunctionalExecutionEnvironment): void {
    env.map(this.getId(), aux.get(this.getId()));
  }

  public includeCompilation(env: CompilationEnvironment, aux: CompilationEnvironment): void {
    env.map(this.getId(), aux.get(this.getId()));
  }

  public toString(): String {
    return `var ${this.id} = ${this.expression}`;
  }
}
