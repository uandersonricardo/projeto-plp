import type { LanguageCode } from "../../teavm";
import type { BNFLanguageDefinition, CellOutput, Language } from "../models/types/execution";

export interface NotebookLanguage extends Language {
  runtimeReady: boolean;
  runtimeStatusMessage?: string;
  preparationMessage?: string;
  prepare?: () => Promise<void>;
}

function defineLanguage(name: string, bnf: BNFLanguageDefinition): NotebookLanguage {
  return {
    name,
    bnf,
    runtimeReady: true,
    preparationMessage: `Importing and compiling ${name} runtime...`,
    async prepare() {
      await Promise.resolve();
    },
    run(sourceCode: string): CellOutput {
      const start = performance.now();
      try {
        const result = window.__runCode(name.toLowerCase() as LanguageCode, sourceCode, "");
        // DEBUG: print compilation environment string returned by the runtime
        // This helps inspect the ambCompilacao JSON/string emitted by TeaVM
        // Visible in browser console when running a cell.
        // eslint-disable-next-line no-console
        console.debug("[RunCodeResult] compilationEnv:", result.compilationEnv);
        return {
          stdout: result.output ?? "",
          stderr: result.message ?? "",
          result: result.output,
          compilationEnv: (() => {
            try {
              if (result.compilationEnv == null) return undefined;
              return typeof result.compilationEnv === "string"
                ? JSON.parse(result.compilationEnv)
                : result.compilationEnv;
            } catch (e) {
              return result.compilationEnv;
            }
          })(),
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
  };
}

export const AVAILABLE_LANGUAGES: NotebookLanguage[] = [
  defineLanguage("Exp1", { keywords: ["not", "length", "and", "or"], literals: ["true", "false"] }),
  defineLanguage("Exp2", { keywords: ["not", "length", "and", "or", "let", "var", "in"], literals: ["true", "false"] }),
  defineLanguage("Func1", {
    keywords: ["not", "length", "and", "or", "let", "var", "in", "fun", "if", "then", "else"],
    literals: ["true", "false"],
  }),
  defineLanguage("Func2", {
    keywords: ["not", "length", "and", "or", "let", "var", "in", "fun", "fn", "if", "then", "else"],
    literals: ["true", "false"],
  }),
  defineLanguage("Func3", {
    keywords: ["not", "length", "and", "or", "let", "var", "in", "fun", "fn", "if", "then", "else", "for"],
    literals: ["true", "false"],
    builtins: ["head", "tail"],
  }),
  defineLanguage("Imp1", {
    keywords: ["not", "length", "and", "or", "var", "while", "do", "if", "then", "else", "write", "read"],
    literals: ["true", "false"],
  }),
  defineLanguage("Imp2", {
    keywords: [
      "not",
      "length",
      "and",
      "or",
      "var",
      "while",
      "do",
      "if",
      "then",
      "else",
      "write",
      "read",
      "proc",
      "call",
    ],
    literals: ["true", "false"],
    types: ["string", "int", "boolean"],
  }),
  defineLanguage("OO1", {
    keywords: [
      "not",
      "length",
      "and",
      "or",
      "var",
      "while",
      "do",
      "if",
      "then",
      "else",
      "write",
      "read",
      "proc",
      "new",
      "classe",
      "this",
    ],
    literals: ["true", "false", "null"],
    types: ["string", "int", "boolean"],
  }),
  defineLanguage("OO2", {
    keywords: [
      "not",
      "length",
      "and",
      "or",
      "var",
      "while",
      "do",
      "if",
      "then",
      "else",
      "write",
      "read",
      "proc",
      "new",
      "classe",
      "this",
      "extends",
    ],
    literals: ["true", "false", "null"],
    types: ["string", "int", "boolean"],
  }),
];
