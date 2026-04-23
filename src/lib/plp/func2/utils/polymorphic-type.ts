import { PrimitiveType } from "./primitive-type";
import type { Type } from "./type";

export class PolymorphicType implements Type {
  public static WILDCARD: Type = new PolymorphicType();

  private inferredType: Type | null = null;
  private instantiatedType: Type | null = null;

  constructor() {}

  public getName(): string {
    let name = "?";

    if (this.isWildcard()) {
      if (this.hasInstantiated()) {
        name = this.instantiatedType!.getName();
      }
    } else {
      if (this.hasInferred()) {
        name = this.inferredType!.getName();
      }
    }

    return name;
  }

  public getInstantiatedType(): Type | null {
    return this.instantiatedType;
  }

  public isInteger(): boolean {
    return this.isEquals(PrimitiveType.INTEGER);
  }

  public isBoolean(): boolean {
    return this.isEquals(PrimitiveType.BOOLEAN);
  }

  public isString(): boolean {
    return this.isEquals(PrimitiveType.STRING);
  }

  public isEquals(type: Type): boolean {
    let result = false;

    if (type === this) return true;

    if (this.hasInferred()) {
      if (this.isWildcard()) {
        if (this.hasInstantiated()) {
          return this.instantiatedType!.isEquals(type);
        } else {
          this.instantiatedType = type;
          return true;
        }
      } else {
        return this.inferredType!.isEquals(type);
      }
    }

    if (type instanceof PolymorphicType) {
      if (type.inferredType != null) {
        return type.isEquals(this);
      } else {
        type.inferredType = this;
        type.instantiatedType = this;
        result = true;
      }
    } else {
      this.inferredType = type;
      this.instantiatedType = type;
      result = true;
    }

    return result;
  }

  private hasInstantiated(): boolean {
    return this.instantiatedType != null;
  }

  private isWildcard(): boolean {
    return this.inferredType === PolymorphicType.WILDCARD;
  }

  private hasInferred(): boolean {
    return this.inferredType != null;
  }

  public isValid(): boolean {
    let result = false;

    if (this.hasInferred()) {
      if (this.isWildcard()) {
        result = this.hasInstantiated() && this.instantiatedType!.isValid();
      } else {
        result = this.inferredType!.isValid();
      }
    }

    return result;
  }

  public infer(): Type {
    if (this.isValid()) {
      return this.inferredType!;
    }

    if (!(this.inferredType instanceof PolymorphicType)) {
      this.inferredType = PolymorphicType.WILDCARD;
    }

    return this;
  }

  public clear(): void {
    this.instantiatedType = null;
  }

  public intersection(otherType: Type): Type | null {
    if (otherType.isEquals(this)) {
      return otherType;
    }

    return null;
  }

  public toString(): string {
    return this.getName();
  }
}
