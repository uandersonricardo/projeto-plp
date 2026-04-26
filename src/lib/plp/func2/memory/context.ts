import { IdentifierAlreadyDeclaredException } from "../exceptions/identifier-already-declared-exception";
import { IdentifierNotDeclaredException } from "../exceptions/identifier-not-declared-exception";
import { VariableAlreadyDeclaredException } from "../exceptions/variable-already-declared-exception";
import { VariableNotDeclaredException } from "../exceptions/variable-not-declared-exception";
import type { Id } from "../expressions/id";
import { HashMap } from "../utils/hashmap";

export class Context<T> {
  protected stack: HashMap<Id, T>[];

  constructor() {
    this.stack = [];
  }

  public increment(): void {
    this.stack.push(new HashMap<Id, T>());
  }

  public restore(): void {
    this.stack.pop();
  }

  public map(idArg: Id, valueArg: T | null): void {
    if (!valueArg) {
      return;
    }

    try {
      const aux = this.stack[this.stack.length - 1];

      if (aux.has(idArg)) {
        throw new IdentifierAlreadyDeclaredException();
      }

      aux.set(idArg, valueArg);
    } catch (e) {
      throw new VariableAlreadyDeclaredException(idArg);
    }
  }

  public get(idArg: Id): T {
    try {
      let result: T | null = null;
      const auxStack: HashMap<Id, T>[] = [];

      while (result === null && this.stack.length > 0) {
        const aux = this.stack.pop()!;
        auxStack.push(aux);
        result = aux.get(idArg) ?? null;
      }

      while (auxStack.length > 0) {
        this.stack.push(auxStack.pop()!);
      }

      if (result === null) {
        throw new IdentifierNotDeclaredException();
      }

      return result;
    } catch (e) {
      throw new VariableNotDeclaredException(idArg);
    }
  }

  protected getStack(): HashMap<Id, T>[] {
    return this.stack;
  }

  protected setStack(stack: HashMap<Id, T>[]): void {
    this.stack = stack;
  }
}
