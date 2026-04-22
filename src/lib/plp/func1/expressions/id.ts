import type { CompilationEnvironment } from "../memory/compilation-environment";
import type { ExecutionEnvironment } from "../memory/execution-environment";
import { calculateHashCode } from "../utils/hashcode";
import type { Type } from "../utils/type";
import type { Expression } from "./expression";
import { IrreducibleValue } from "./irreducible-value";
import type { Value } from "./value";

export class Id implements Expression {
  private idName: string;

  constructor(strName: string) {
    this.idName = strName;
  }

  public toString(): string {
    return this.idName;
  }

  public evaluate(env: ExecutionEnvironment): Value | null {
    return env.get(this);
  }

  public checkType(env: CompilationEnvironment): boolean {
    const result = true;
    env.get(this);
    return result;
  }

  public getType(env: CompilationEnvironment): Type | null {
    return env.get(this);
  }

  public getIdName(): string {
    return this.idName;
  }

  public setIdName(idName: string): void {
    this.idName = idName;
  }

  public isEquals(obj: any): boolean {
    if (!(obj instanceof Id)) {
      return false;
    }

    let r: boolean;

    const other = obj as Id;

    if (this.idName == null) {
      r = other.idName == null;
    } else {
      r = this.idName === other.idName;
    }

    return r;
  }

  public reduce(env: ExecutionEnvironment): Expression | null {
    try {
      const value = env.get(this);

      if (value instanceof IrreducibleValue) {
        return this;
      }

      return value?.clone() ?? null;
    } catch (e) {
      return this;
    }
  }

  public clone(): Id {
    return this;
  }

  public hashCode(): number {
    const prime = 31;
    let result = 1;
    result = prime * result + (this.idName == null ? 0 : calculateHashCode(this.idName));
    return result;
  }
}
