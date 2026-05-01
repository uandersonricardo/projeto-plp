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
        const result = window.__runCode("exp1", sourceCode, "");
        return {
          stdout: result.output ?? "",
          stderr: result.message ?? "",
          result: result.output,
          executionTime: performance.now() - start,
          success: result.success,
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
        const result = window.__runCode("exp2", sourceCode, "");
        return {
          stdout: result.output ?? "",
          stderr: result.message ?? "",
          result: result.output,
          executionTime: performance.now() - start,
          success: result.success,
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
        const result = window.__runCode("func1", sourceCode, "");
        return {
          stdout: result.output ?? "",
          stderr: result.message ?? "",
          result: result.output,
          executionTime: performance.now() - start,
          success: result.success,
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
    runtimeReady: true,
    preparationMessage: "Importing and compiling Func2 runtime...",
    async prepare() {
      await Promise.resolve();
    },
    run(sourceCode: string): CellOutput {
      const start = performance.now();
      try {
        const result = window.__runCode("func2", sourceCode, "");
        return {
          stdout: result.output ?? "",
          stderr: result.message ?? "",
          result: result.output,
          executionTime: performance.now() - start,
          success: result.success,
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
];
