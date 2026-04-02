import type { Id } from "../expressions/id";

export class VariableNotDeclaredException extends Error {
  constructor(id: Id) {
    super(`Variável ${id.toString()} não declarada.`);
  }
}
