import type { ExecutionEnvironment } from "../../exp2/memory/execution-environment";
import type { Type } from "../utils/type";
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

  public isEqual(other: ConcreteValue<T>): boolean {
    return this.getValue() === other.getValue();
  }

  public evaluate(_env: ExecutionEnvironment): Value {
    return this;
  }

  public checkType(_env: ExecutionEnvironment): boolean {
    return true;
  }

  public abstract getType(env: ExecutionEnvironment): Type;
}
