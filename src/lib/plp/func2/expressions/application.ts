import { VariableAlreadyDeclaredException } from "../exceptions/variable-already-declared-exception";
import type { CompilationEnvironment } from "../memory/compilation-environment";
import type { ExecutionEnvironment } from "../memory/execution-environment";
import { PolymorphicType } from "../utils/polymorphic-type";
import { FunctionType } from "../utils/function-type";
import { ToStringProvider } from "../utils/to-string-provider";
import type { Type } from "../utils/type";
import type { Expression } from "./expression";
import { Id } from "./id";
import { FunctionValue } from "./function-value";
import type { Value } from "./value";

export class Application implements Expression {
  private func: Expression;
  private argsExpressions: Expression[];

  constructor(func: Expression, ...expressions: Expression[]);
  constructor(func: Expression, expressions: Expression[]);
  constructor(func: Expression, ...args: any[]) {
    this.func = func;
    this.argsExpressions = Array.isArray(args[0]) ? args[0] : args;
  }

  public evaluate(environment: ExecutionEnvironment): Value | null {
    const evaluated = this.func.evaluate(environment);

    if (!(evaluated instanceof FunctionValue)) {
      if (this.func instanceof Id) {
        throw new VariableAlreadyDeclaredException(this.func);
      }

      throw new Error("Expected a function in application.");
    }

    const bindings = this.resolveParameterBindings(environment, evaluated);

    environment.increment();

    this.includeValueBindings(environment, bindings);

    const functionId = evaluated.getId();
    if (functionId != null) {
      environment.map(functionId, evaluated.clone());
    }

    const expression = evaluated.getExpression().clone();
    expression.reduce(environment);

    const result = expression.evaluate(environment);

    environment.restore();

    return result;
  }

  public checkType(environment: CompilationEnvironment): boolean {
    const functionType = this.getFunctionType(environment);
    return functionType instanceof FunctionType && functionType.checkType(environment, this.argsExpressions);
  }

  public getArgsExpressions(): Expression[] {
    return this.argsExpressions;
  }

  public getFunc(): Expression {
    return this.func;
  }

  public getType(environment: CompilationEnvironment): Type {
    const functionType = this.getFunctionType(environment);

    if (!(functionType instanceof FunctionType)) {
      return new PolymorphicType();
    }

    return functionType.getType(environment, this.argsExpressions);
  }

  public toString(): string {
    return `${this.func}(${ToStringProvider.listToString(this.argsExpressions, ",", "", "")})`;
  }

  public reduce(env: ExecutionEnvironment): Expression | null {
    this.func = this.func.reduce(env) ?? this.func;

    const reducedArgs: Expression[] = [];
    for (const arg of this.argsExpressions) {
      reducedArgs.push(arg.reduce(env) ?? arg);
    }

    this.argsExpressions = reducedArgs;
    return this;
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

  private resolveParameterBindings(environment: ExecutionEnvironment, funcDef: FunctionValue): Map<Id, Value> {
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

  private getFunctionType(environment: CompilationEnvironment): Type | null {
    let functionType: Type | null = null;

    if (this.func instanceof Id) {
      functionType = environment.get(this.func);
    } else if (this.func instanceof FunctionValue) {
      functionType = this.func.getType(environment);
    }

    if (functionType == null || functionType instanceof PolymorphicType) {
      const params: Type[] = [];

      for (const argument of this.argsExpressions) {
        const argType = argument.getType(environment);
        params.push(argType ?? new PolymorphicType());
      }

      functionType = new FunctionType(params, new PolymorphicType());
    }

    return functionType;
  }
}
