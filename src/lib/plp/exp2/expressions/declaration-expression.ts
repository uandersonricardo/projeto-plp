import type { Declaration } from "../declaration/declaration";
import { CompilationContext } from "../memory/compilation-context";
import type { CompilationEnvironment } from "../memory/compilation-environment";
import { ExecutionContext } from "../memory/execution-context";
import type { ExecutionEnvironment } from "../memory/execution-environment";
import type { Type } from "../utils/type";
import type { Expression } from "./expression";
import type { Value } from "./value";

export class DeclarationExpression implements Expression {
  private declaration: Declaration;
  private expression: Expression;

  constructor(declaration: Declaration, expression: Expression) {
    this.declaration = declaration;
    this.expression = expression;
  }

  public evaluate(env: ExecutionEnvironment): Value {
    env.increment();

    const aux: ExecutionEnvironment = new ExecutionContext();
    aux.increment();

    this.declaration.elaborateExecution(env, aux);
    this.declaration.includeExecution(env, aux);

    aux.restore();

    const result = this.expression.evaluate(env)!;

    env.restore();

    return result;
  }

  public checkType(env: CompilationEnvironment): boolean {
    env.increment();
    let result = false;

    try {
      if (this.declaration.checkType(env)) {
        const aux: CompilationEnvironment = new CompilationContext();
        aux.increment();

        this.declaration.elaborateCompilation(env, aux);
        this.declaration.includeCompilation(env, aux);

        aux.restore();

        result = this.expression.checkType(env);
      } else {
        result = false;
      }
    } finally {
      env.restore();
    }

    return result;
  }

  public getType(env: CompilationEnvironment): Type {
    env.increment();

    const aux: CompilationEnvironment = new CompilationContext();
    aux.increment();

    this.declaration.elaborateCompilation(env, aux);
    this.declaration.includeCompilation(env, aux);

    aux.restore();

    const type = this.expression.getType(env)!;

    env.restore();

    return type;
  }

  public reduce(env: ExecutionEnvironment): Expression {
    env.increment();

    this.declaration.reduce(env);
    this.expression = this.expression.reduce(env)!;

    env.restore();

    return this;
  }

  public clone(): DeclarationExpression {
    return new DeclarationExpression(this.declaration, this.expression.clone());
  }
}
