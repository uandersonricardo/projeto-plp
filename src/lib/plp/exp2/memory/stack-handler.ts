import { IdentifierAlreadyDeclaredException } from "../exceptions/identifier-already-declared-exception";
import { IdentifierNotDeclaredException } from "../exceptions/identifier-not-declared-exception";
import type { Id } from "../expressions/id";
import type { Value } from "../expressions/value";
import type { HashMap } from "../utils/hashmap";

export class StackHandler {
  public static getFromId(stack: HashMap<Id, Value>[], id: Id): Value {
    let result: Value | null = null;
    const auxStack: HashMap<Id, Value>[] = [];

    while (result === null && stack.length > 0) {
      const aux = stack.pop()!;
      auxStack.push(aux);
      result = aux.get(id) ?? null;
    }

    while (auxStack.length > 0) {
      stack.push(auxStack.pop()!);
    }

    if (result === null) {
      throw new IdentifierNotDeclaredException();
    }

    return result;
  }

  public static mapIdObject(stack: HashMap<Id, Value>[], id: Id, object: any): void {
    const aux = stack[stack.length - 1];

    if (aux.has(id)) {
      throw new IdentifierAlreadyDeclaredException();
    }

    aux.set(id, object);
  }
}
