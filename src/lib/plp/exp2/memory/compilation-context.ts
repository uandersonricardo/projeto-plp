import type { Type } from "../../exp1/utils/type";
import type { CompilationEnvironment } from "./compilation-environment";
import { Context } from "./context";

export class CompilationContext extends Context<Type> implements CompilationEnvironment {}
