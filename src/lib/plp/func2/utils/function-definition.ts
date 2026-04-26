import type { Expression } from "../expressions/expression";
import type { Id } from "../expressions/id";
import type { CompilationEnvironment } from "../memory/compilation-environment";
import { FunctionType } from "./function-type";
import { PolymorphicType } from "./polymorphic-type";
import type { Type } from "./type";

export class FunctionDefinition {
  protected argsId: Id[];
  protected expression: Expression;

  constructor(argsId: Id[], expression: Expression) {
    this.argsId = argsId;
    this.expression = expression;
  }

  public getIdList(): Id[] {
    return this.argsId;
  }

  public getExpression(): Expression {
    return this.expression;
  }

  public getArity(): number {
    return this.argsId.length;
  }

  public checkType(env: CompilationEnvironment): boolean {
    env.increment();

    for (const id of this.argsId) {
      env.map(id, new PolymorphicType());
    }

    const result = this.expression.checkType(env);

    env.restore();

    return result;
  }

  public getType(env: CompilationEnvironment): Type {
    env.increment();

    for (const id of this.argsId) {
      env.map(id, new PolymorphicType());
    }

    this.expression.checkType(env);

    let result: Type = this.expression.getType(env)!;

    const params: Type[] = [];
    for (let i = 0; i < this.getArity(); i++) {
      const argType = (env.get(this.argsId[i]) as PolymorphicType).infer();
      params.push(argType);
    }

    result = new FunctionType(params, result);

    env.restore();

    return result;
  }

  public clone(): FunctionDefinition {
    const newList: Id[] = [];

    for (const id of this.argsId) {
      newList.push(id.clone());
    }

    return new FunctionDefinition(newList, this.expression.clone());
  }
}
