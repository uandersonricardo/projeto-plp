import type { CompilationEnvironment } from "../memory/compilation-environment";
import type { ExecutionEnvironment } from "../memory/execution-environment";
import { calculateHashCode } from "../utils/hashcode";
import type { Type } from "../utils/type";
import type { Expression } from "./expression";
import type { Value } from "./value";

export abstract class ConcreteValue<T> implements Value {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  public getValue(): T {
    return this.value;
  }

  public toString(): string {
    return String(this.value);
  }

  public isEquals(other: ConcreteValue<T>): boolean {
    return this.getValue() === other.getValue();
  }

  public evaluate(_env: ExecutionEnvironment): Value {
    return this;
  }

  public checkType(_env: CompilationEnvironment): boolean {
    return true;
  }

  public reduce(_env: ExecutionEnvironment): Expression {
    return this;
  }

  public hashCode(): number {
    const prime = 31;
    let result = 1;
    result = prime * result + (this.value == null ? 0 : calculateHashCode(this.value));
    return result;
  }

  public abstract getType(env: CompilationEnvironment): Type;

  public abstract clone(): ConcreteValue<T>;
}
