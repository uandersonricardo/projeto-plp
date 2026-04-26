import type { Expression } from "../expressions/expression";
import type { CompilationEnvironment } from "../memory/compilation-environment";
import { PolymorphicType } from "./polymorphic-type";
import { ToStringProvider } from "./to-string-provider";
import type { Type } from "./type";

export class FunctionType implements Type {
  private domain: Type[];
  private image: Type;

  constructor(domain: Type[], image: Type) {
    this.domain = domain;
    this.image = image;
  }

  public getName(): string {
    return `(${ToStringProvider.listToString(this.domain, " x", "", "")}) -> ${this.image}`;
  }

  public getDomain(): Type[] {
    return this.domain;
  }

  public getImage(): Type {
    return this.image;
  }

  public isBoolean(): boolean {
    return this.image.isBoolean();
  }

  public isInteger(): boolean {
    return this.image.isInteger();
  }

  public isString(): boolean {
    return this.image.isString();
  }

  public isValid(): boolean {
    let result = this.domain != null;
    for (const t of this.domain) {
      result = result && t.isValid();
    }
    result = result && this.image != null && this.image.isValid();
    return result;
  }

  public isEquals(type: Type): boolean {
    let result = true;

    if (type instanceof PolymorphicType) {
      return type.isEquals(this);
    }

    if (type instanceof FunctionType) {
      if (this.domain.length !== type.domain.length) {
        return false;
      }

      const iterator = this.domain[Symbol.iterator]();
      for (const t of type.domain) {
        result = result && t.isEquals(iterator.next().value!);
      }

      return result && this.image.isEquals(type.image);
    }

    return result;
  }

  public intersection(otherType: Type): Type | null {
    if (otherType.isEquals(this)) {
      return this;
    }
    return null;
  }

  public toString(): string {
    return this.getName();
  }

  private clearWildcardTypes(): void {
    for (const t of this.getDomain()) {
      if (t instanceof PolymorphicType) {
        t.clear();
      }
    }

    if (this.getImage() instanceof PolymorphicType) {
      (this.getImage() as PolymorphicType).clear();
    }
  }

  public checkType(environment: CompilationEnvironment, formalParameters: Expression[]): boolean {
    const result =
      this.checkArgumentListSize(formalParameters) && this.checkArgumentTypes(environment, formalParameters);

    this.clearWildcardTypes();

    return result;
  }

  public getType(environment: CompilationEnvironment, formalParameters: Expression[]): Type {
    const iterator = this.getDomain()[Symbol.iterator]();

    for (const actualValue of formalParameters) {
      const argType = actualValue.getType(environment)!;
      argType.isEquals(iterator.next().value!);
    }

    let result: Type = this.getImage();

    while (result instanceof PolymorphicType) {
      const instantiated = result.getInstantiatedType();
      if (instantiated == null) {
        break;
      }
      result = instantiated;
    }

    this.clearWildcardTypes();

    return result;
  }

  private checkArgumentListSize(formalParameters: Expression[]): boolean {
    return this.getDomain().length === formalParameters.length;
  }

  private checkArgumentTypes(environment: CompilationEnvironment, formalParameters: Expression[]): boolean {
    let result = true;

    const iterator = this.getDomain()[Symbol.iterator]();

    for (const actualValue of formalParameters) {
      result = result && actualValue.checkType(environment);

      const argType = actualValue.getType(environment)!;
      const domainType = iterator.next().value!;

      result = result && argType.isEquals(domainType);
    }

    return result;
  }
}
