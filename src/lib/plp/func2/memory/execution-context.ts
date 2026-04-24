import type { Id } from "../expressions/id";
import type { Value } from "../expressions/value";
import { HashMap } from "../utils/hashmap";
import { Context } from "./context";
import type { ExecutionEnvironment } from "./execution-environment";

export class ExecutionContext extends Context<Value> implements ExecutionEnvironment {
  public clone(): ExecutionContext {
    const result = new ExecutionContext();

    const newStack: HashMap<Id, Value>[] = [];
    const newMap = new HashMap<Id, Value>();
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
