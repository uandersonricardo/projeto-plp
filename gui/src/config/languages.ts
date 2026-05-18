import type { CellOutput, Language } from "../models/types/execution";

export interface NotebookLanguage extends Language {
  runtimeReady: boolean;
  runtimeStatusMessage?: string;
  preparationMessage?: string;
  prepare?: () => Promise<void>;
  scopeMode: "notebook" | "cell";
}

export const AVAILABLE_LANGUAGES: NotebookLanguage[] = [
  {
    name: "Exp1",
    scopeMode: "cell",
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
    scopeMode: "cell",
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
    scopeMode: "cell",
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
    scopeMode: "cell",
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
  {
    name: "Func3",
    scopeMode: "cell",
    runtimeReady: true,
    preparationMessage: "Importing and compiling Func3 runtime...",
    async prepare() {
      await Promise.resolve();
    },
    run(sourceCode: string): CellOutput {
      const start = performance.now();
      try {
        const result = window.__runCode("func3", sourceCode, "");
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
    name: "Imp1",
    scopeMode: "notebook",
    runtimeReady: true,
    preparationMessage: "Importing and compiling Imp1 runtime...",
    async prepare() {
      await Promise.resolve();
    },
    run(sourceCode: string, input = ""): CellOutput {
      const start = performance.now();
      try {
        const result = window.__runCode("imp1", sourceCode, input);
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
    name: "Imp2",
    scopeMode: "notebook",
    runtimeReady: true,
    preparationMessage: "Importing and compiling Imp2 runtime...",
    async prepare() {
      await Promise.resolve();
    },
    run(sourceCode: string, input = ""): CellOutput {
      const start = performance.now();
      try {
        const result = window.__runCode("imp2", sourceCode, input);
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
    name: "OO1",
    scopeMode: "notebook",
    runtimeReady: true,
    preparationMessage: "Importing and compiling OO1 runtime...",
    async prepare() {
      await Promise.resolve();
    },
    run(sourceCode: string, input = ""): CellOutput {
      const start = performance.now();
      try {
        const result = window.__runCode("oo1", sourceCode, input);
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
    name: "OO2",
    scopeMode: "notebook",
    runtimeReady: true,
    preparationMessage: "Importing and compiling OO2 runtime...",
    async prepare() {
      await Promise.resolve();
    },
    run(sourceCode: string, input = ""): CellOutput {
      const start = performance.now();
      try {
        const result = window.__runCode("oo2", sourceCode, input);
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
