import type { Id } from "../expressions/id";

export type Environment<T> = {
  increment(): void;
  restore(): void;
  map(idArg: Id, typeId: T | null): void;
  get(idArg: Id): T;
};
