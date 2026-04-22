import { VariableAlreadyDeclaredException } from "../exceptions/variable-already-declared-exception";
import type { CompilationEnvironment } from "../memory/compilation-environment";
import type { ExecutionEnvironment } from "../memory/execution-environment";
import type { FunctionalExecutionEnvironment } from "../memory/functional-execution-environment";
import type { FunctionDefinition } from "../utils/function-definition";
import { FunctionType } from "../utils/function-type";
import { ToStringProvider } from "../utils/to-string-provider";
import type { Type } from "../utils/type";
import type { Expression } from "./expression";
import type { Id } from "./id";
import type { Value } from "./value";

export class Application implements Expression {
  private func: Id;
  private argsExpressions: Expression[];

  constructor(func: Id, ...expressions: Expression[]);
  constructor(func: Id, expressions: Expression[]);
  constructor(func: Id, ...args: any[]) {
    this.func = func;
    this.argsExpressions = Array.isArray(args[0]) ? args[0] : args;
  }

  public evaluate(environment: ExecutionEnvironment): Value | null {
    const functionalEnv = environment as FunctionalExecutionEnvironment;

    let funcDef: FunctionDefinition;
    try {
      funcDef = functionalEnv.getFunction(this.func);
    } catch (e) {
      throw new VariableAlreadyDeclaredException(this.func);
    }

    const bindings = this.resolveParameterBindings(environment, funcDef);

    environment.increment();

    this.includeValueBindings(environment, bindings);

    const result = funcDef.getExpression().evaluate(environment);

    environment.restore();

    return result;
  }

  public checkType(environment: CompilationEnvironment): boolean {
    let result: boolean;
    const aux = environment.get(this.func);

    if (aux instanceof FunctionType) {
      result = aux.checkType(environment, this.argsExpressions);
    } else {
      result = false;
    }

    return result;
  }

  public getArgsExpressions(): Expression[] {
    return this.argsExpressions;
  }

  public getFunc(): Id {
    return this.func;
  }

  public getType(environment: CompilationEnvironment): Type {
    const functionType = environment.get(this.func) as FunctionType;
    return functionType.getType(environment, this.argsExpressions);
  }

  public toString(): string {
    return `${this.func}(${ToStringProvider.listToString(this.argsExpressions, ",", "", "")})`;
  }

  public reduce(_env: ExecutionEnvironment): Expression | null {
    return null;
  }

  public clone(): Application {
    const newList: Expression[] = [];

    for (const exp of this.argsExpressions) {
      newList.push(exp.clone());
    }

    return new Application(this.func.clone(), newList);
  }

  private includeValueBindings(environment: ExecutionEnvironment, bindings: Map<Id, Value>): void {
    for (const [id, value] of bindings.entries()) {
      environment.map(id, value);
    }
  }

  private resolveParameterBindings(environment: ExecutionEnvironment, funcDef: FunctionDefinition): Map<Id, Value> {
    const paramIds = funcDef.getIdList();
    const valueExpressions = this.argsExpressions;

    const map = new Map<Id, Value>();

    for (let i = 0; i < paramIds.length; i++) {
      const id = paramIds[i];
      const exp = valueExpressions[i];
      const value = exp.evaluate(environment);

      if (!value) {
        continue;
      }

      map.set(id, value);
    }

    return map;
  }
}
