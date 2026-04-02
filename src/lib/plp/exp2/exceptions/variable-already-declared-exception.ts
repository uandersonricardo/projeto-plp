import type { Id } from "../expressions/id";

export class VariableAlreadyDeclaredException extends Error {
  constructor(id: Id) {
    super(`Variável ${id.toString()} já declarada.`);
  }
}
