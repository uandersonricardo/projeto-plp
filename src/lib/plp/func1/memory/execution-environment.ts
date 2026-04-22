import type { Value } from "../expressions/value";
import type { Environment } from "./environment";

export interface ExecutionEnvironment extends Environment<Value> {
  clone(): ExecutionEnvironment;
}
