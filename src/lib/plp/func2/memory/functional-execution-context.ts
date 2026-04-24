import type { Id } from "../expressions/id";
import type { Value } from "../expressions/value";
import type { FunctionDefinition } from "../utils/function-definition";
import { ExecutionContext } from "./execution-context";
import { FunctionalContext } from "./functional-context";
import type { FunctionalExecutionEnvironment } from "./functional-execution-environment";

export class FunctionalExecutionContext implements FunctionalExecutionEnvironment {
  private executionContext: ExecutionContext;
  private functionalContext: FunctionalContext;

  constructor() {
    this.executionContext = new ExecutionContext();
    this.functionalContext = new FunctionalContext();
  }

  public increment(): void {
    this.executionContext.increment();
    this.functionalContext.increment();
  }

  public restore(): void {
    this.executionContext.restore();
    this.functionalContext.restore();
  }

  public map(idArg: Id, value: Value): void {
    this.executionContext.map(idArg, value);
  }

  public get(idArg: Id): Value {
    return this.executionContext.get(idArg);
  }

  public mapFunction(idArg: Id, func: FunctionDefinition): void {
    this.functionalContext.map(idArg, func);
  }

  public getFunction(idArg: Id): FunctionDefinition {
    return this.functionalContext.get(idArg);
  }

  public clone(): FunctionalExecutionContext {
    return this;
  }
}
