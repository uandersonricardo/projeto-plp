import type { Id } from "../expressions/id";
import type { FunctionDefinition } from "../utils/function-definition";
import { HashMap } from "../utils/hashmap";
import { Context } from "./context";
import type { Environment } from "./environment";

export class FunctionalContext extends Context<FunctionDefinition> implements Environment<FunctionDefinition> {
  public clone(): FunctionalContext {
    const result = new FunctionalContext();

    const newStack: HashMap<Id, FunctionDefinition>[] = [];
    const newMap = new HashMap<Id, FunctionDefinition>();
    newStack.push(newMap);

    for (const map of this.stack) {
      for (const [key, value] of map.entries()) {
        newMap.set(key, value);
      }
    }

    result.setStack(newStack);

    return result;
  }
}
