import type { Id } from "../expressions/id";

export type FunctionalEnvironment<T> = {
  mapFunction(id: Id, func: T | null): void;
  getFunction(id: Id): T;
};
