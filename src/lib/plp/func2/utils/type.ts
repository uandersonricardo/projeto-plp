export interface Type {
  getName(): string;
  isInteger(): boolean;
  isBoolean(): boolean;
  isString(): boolean;
  isEquals(type: Type): boolean;
  isValid(): boolean;
  intersection(otherType: Type): Type | null;
}
