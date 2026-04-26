import type { FunctionDefinition } from "../utils/function-definition";
import type { ExecutionEnvironment } from "./execution-environment";
import type { FunctionalEnvironment } from "./functional-environment";

export interface FunctionalExecutionEnvironment
  extends ExecutionEnvironment,
    FunctionalEnvironment<FunctionDefinition> {}
