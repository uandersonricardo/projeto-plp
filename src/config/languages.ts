import { Exp1 } from "../lib/plp/exp1";
import { Exp2 } from "../lib/plp/exp2";
import { Func1 } from "../lib/plp/func1";
import type { CellOutput, Language } from "../models/types/execution";

export interface NotebookLanguage extends Language {
  runtimeReady: boolean;
  runtimeStatusMessage?: string;
  preparationMessage?: string;
  prepare?: () => Promise<void>;
}

export const AVAILABLE_LANGUAGES: NotebookLanguage[] = [
  {
    name: "Exp1",
    runtimeReady: true,
    preparationMessage: "Importing and compiling Exp1 runtime...",
    async prepare() {
      await Promise.resolve();
    },
    run(sourceCode: string): CellOutput {
      const start = performance.now();
      try {
        const result = new Exp1().run(sourceCode);
        return {
          stdout: result == null ? "" : String(result),
          stderr: "",
          result,
          executionTime: performance.now() - start,
          success: true,
        };
      } catch (error) {
        return {
          stdout: "",
          stderr: error instanceof Error ? error.message : "Unknown execution error",
          executionTime: performance.now() - start,
          success: false,
        };
      }
    },
  },
  {
    name: "Exp2",
    runtimeReady: true,
    preparationMessage: "Importing and compiling Exp2 runtime...",
    async prepare() {
      await Promise.resolve();
    },
    run(sourceCode: string): CellOutput {
      const start = performance.now();
      try {
        const result = new Exp2().run(sourceCode);
        return {
          stdout: result == null ? "" : String(result),
          stderr: "",
          result,
          executionTime: performance.now() - start,
          success: true,
        };
      } catch (error) {
        return {
          stdout: "",
          stderr: error instanceof Error ? error.message : "Unknown execution error",
          executionTime: performance.now() - start,
          success: false,
        };
      }
    },
  },
  {
    name: "Func1",
    runtimeReady: true,
    preparationMessage: "Importing and compiling Func1 runtime...",
    async prepare() {
      await Promise.resolve();
    },
    run(sourceCode: string): CellOutput {
      const start = performance.now();
      try {
        const result = new Func1().run(sourceCode);
        return {
          stdout: result == null ? "" : String(result),
          stderr: "",
          result,
          executionTime: performance.now() - start,
          success: true,
        };
      } catch (error) {
        return {
          stdout: "",
          stderr: error instanceof Error ? error.message : "Unknown execution error",
          executionTime: performance.now() - start,
          success: false,
        };
      }
    },
  },
  {
    name: "Func2",
    runtimeReady: false,
    preparationMessage: "Importing and compiling Func2 runtime...",
    runtimeStatusMessage: "Func2 parser/interpreter entry point is not implemented in src/lib/plp/func2 yet.",
    async prepare() {
      await Promise.resolve();
    },
    run(): CellOutput {
      return {
        stdout: "",
        stderr: "Func2 parser/interpreter entry point is not implemented in src/lib/plp/func2 yet.",
        executionTime: 0,
        success: false,
      };
    },
  },
];
