import type { Value } from "../expressions/value";
import { Context } from "./context";
import type { ExecutionEnvironment } from "./execution-environment";

export class ExecutionContext extends Context<Value> implements ExecutionEnvironment {}
