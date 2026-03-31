/**
 * Code execution related types
 */

/**
 * Represents the output from executing code
 */
export interface CellOutput {
  stdout: string;
  stderr: string;
  result?: unknown;
  executionTime: number;
  success: boolean;
}

/**
 * Represents source code to be executed
 */
export interface SourceCode {
  code: string;
  language: string;
}

/**
 * Language execution handler
 */
export interface Language {
  name: string;
  version?: string;
  run(sourceCode: string): CellOutput | Promise<CellOutput>;
}
