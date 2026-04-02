import type { Type } from "./type";

export class PrimitiveType implements Type {
  static INTEGER = new PrimitiveType("INTEGER");
  static BOOLEAN = new PrimitiveType("BOOLEAN");
  static STRING = new PrimitiveType("STRING");

  protected name: string;

  private constructor(name: string) {
    this.name = name;
  }

  public getName(): string {
    return this.name;
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

    if (this.isValid()) {
      if (type.isValid()) {
        result = this.name === type.getName();
      } else {
        result = type.isEquals(this);
      }
    }

    return result;
  }

  public isValid(): boolean {
    return this.name != null && this.name.length > 0;
  }

  public intersection(otherType: Type): PrimitiveType | null {
    if (otherType.isEquals(this)) {
      return this;
    } else {
      return null;
    }
  }

  public toString(): string {
    return this.name;
  }
}
