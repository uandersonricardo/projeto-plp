import type { Id } from "./id";
import type { Expression } from "./expression";
import type { Value } from "./value";
import { FunctionDefinition } from "../utils/function-definition";
import type { ExecutionEnvironment } from "../memory/execution-environment";
import { IrreducibleValue } from "./irreducible-value";

export class FunctionValue extends FunctionDefinition implements Value {
  private id: Id | null;

  constructor(argsId: Id[], expression: Expression) {
    super(argsId, expression);
    this.id = null;
  }

  public evaluate(environment: ExecutionEnvironment): Value {
    this.reduce(environment);
    return this;
  }

  public getId(): Id | null {
    return this.id;
  }

  public setId(id: Id): void {
    this.id = id;
  }

  public reduce(environment: ExecutionEnvironment): Expression {
    environment.increment();

    if (this.id != null) {
      environment.map(this.id, new IrreducibleValue());
    }

    for (const id of this.argsId) {
      environment.map(id, new IrreducibleValue());
    }

    this.expression = this.expression.reduce(environment) ?? this.expression;

    environment.restore();

    return this;
  }

  public clone(): FunctionValue {
    const newIds: Id[] = [];

    for (const id of this.argsId) {
      newIds.push(id.clone());
    }

    const result = new FunctionValue(newIds, this.expression.clone());

    if (this.id != null) {
      result.setId(this.id.clone());
    }

    return result;
  }

  public toString(): string {
    return `fn ${this.argsId.join(" ")} . ${this.expression}`;
  }
}
