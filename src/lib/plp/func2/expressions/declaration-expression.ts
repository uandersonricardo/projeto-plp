import type { FunctionalDeclaration } from "../declaration/functional-declaration";
import { CompilationContext } from "../memory/compilation-context";
import type { CompilationEnvironment } from "../memory/compilation-environment";
import type { ExecutionEnvironment } from "../memory/execution-environment";
import { FunctionalExecutionContext } from "../memory/functional-execution-context";
import type { FunctionalExecutionEnvironment } from "../memory/functional-execution-environment";
import type { Type } from "../utils/type";
import type { Expression } from "./expression";
import { FunctionValue } from "./function-value";
import type { Value } from "./value";

export class DeclarationExpression implements Expression {
  private declaration: FunctionalDeclaration;
  private expression: Expression;

  constructor(declaration: FunctionalDeclaration, expression: Expression) {
    this.declaration = declaration;
    this.expression = expression;
  }

  public getExpression(): Expression {
    return this.expression;
  }

  public evaluate(env: ExecutionEnvironment): Value | null {
    const functionalEnv = env as FunctionalExecutionEnvironment;

    functionalEnv.increment();

    const aux = new FunctionalExecutionContext();
    aux.increment();

    this.declaration.elaborateExecution(functionalEnv, aux);
    this.declaration.includeExecution(functionalEnv, aux);

    aux.restore();

    const result = this.expression.evaluate(functionalEnv);

    if (result instanceof FunctionValue) {
      result.reduce(functionalEnv);
    }

    functionalEnv.restore();

    return result;
  }

  public checkType(env: CompilationEnvironment): boolean {
    env.increment();

    let result = false;

    try {
      result = this.declaration.checkType(env);

      if (result) {
        const aux = new CompilationContext();
        aux.increment();

        this.declaration.elaborateCompilation(env, aux);
        this.declaration.includeCompilation(env, aux);

        aux.restore();

        result = this.expression.checkType(env);
      }
    } finally {
      env.restore();
    }

    return result;
  }

  public getType(env: CompilationEnvironment): Type | null {
    env.increment();

    const aux = new CompilationContext();
    aux.increment();

    this.declaration.elaborateCompilation(env, aux);
    this.declaration.includeCompilation(env, aux);

    aux.restore();

    const result = this.expression.getType(env);

    env.restore();

    return result;
  }

  public reduce(_env: ExecutionEnvironment): Expression | null {
    return null;
  }

  public clone(): DeclarationExpression {
    return new DeclarationExpression(this.declaration.clone(), this.expression.clone());
  }
}
