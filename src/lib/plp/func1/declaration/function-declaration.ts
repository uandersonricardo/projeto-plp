import type { Expression } from "../expressions/expression";
import type { Id } from "../expressions/id";
import type { CompilationEnvironment } from "../memory/compilation-environment";
import type { FunctionalExecutionEnvironment } from "../memory/functional-execution-environment";
import { FunctionDefinition } from "../utils/function-definition";
import { FunctionType } from "../utils/function-type";
import { PolymorphicType } from "../utils/polymorphic-type";
import { ToStringProvider } from "../utils/to-string-provider";
import type { Type } from "../utils/type";
import type { FunctionalDeclaration } from "./functional-declaration";

export class FunctionDeclaration implements FunctionalDeclaration {
  private id: Id;
  private func: FunctionDefinition;

  constructor(id: Id, argIds: Id[], expression: Expression) {
    this.id = id;
    this.func = new FunctionDefinition(argIds, expression);
  }

  public getId(): Id {
    return this.id;
  }

  public getIdList(): Id[] {
    return this.func.getIdList();
  }

  public getExpression(): Expression {
    return this.func.getExpression();
  }

  public getArity(): number {
    return this.func.getArity();
  }

  public getFunction(): FunctionDefinition {
    return this.func;
  }

  public toString(): string {
    return `fun ${this.id} (${ToStringProvider.listToString(this.func.getIdList(), ",", "", "")}) = ${this.func.getExpression()}`;
  }

  public checkType(env: CompilationEnvironment): boolean {
    env.increment();

    const params: Type[] = [];
    for (let i = 0; i < this.getArity(); i++) {
      params.push(new PolymorphicType());
    }

    const type = new FunctionType(params, new PolymorphicType());

    env.map(this.id, type);

    const result = this.func.checkType(env);

    env.restore();

    return result;
  }

  public getType(env: CompilationEnvironment): Type {
    env.increment();

    const params: Type[] = [];
    for (let i = 0; i < this.getArity(); i++) {
      params.push(new PolymorphicType());
    }

    const type = new FunctionType(params, new PolymorphicType());

    env.map(this.id, type);

    const result = this.func.getType(env);

    env.restore();

    return result;
  }

  public clone(): FunctionDeclaration {
    const aux = this.func.clone();
    return new FunctionDeclaration(this.id.clone(), aux.getIdList(), aux.getExpression());
  }

  public elaborateCompilation(env: CompilationEnvironment, aux: CompilationEnvironment): void {
    aux.map(this.getId(), this.getType(env));
  }

  public includeCompilation(env: CompilationEnvironment, aux: CompilationEnvironment): void {
    env.map(this.getId(), aux.get(this.getId()));
  }

  public elaborateExecution(_env: FunctionalExecutionEnvironment, aux: FunctionalExecutionEnvironment): void {
    aux.mapFunction(this.getId(), this.getFunction());
  }

  public includeExecution(env: FunctionalExecutionEnvironment, aux: FunctionalExecutionEnvironment): void {
    env.mapFunction(this.getId(), aux.getFunction(this.getId()));
  }
}
