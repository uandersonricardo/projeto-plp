import type { Value } from "../../exp1/expressions/value";
import type { Environment } from "./environment";

export interface ExecutionEnvironment extends Environment<Value> {}
