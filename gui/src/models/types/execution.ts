export interface CellOutput {
  stdout: string;
  stderr: string;
  result?: unknown;
  executionTime: number;
  success: boolean;
}

export interface SourceCode {
  code: string;
  language: string;
}

export interface Language {
  name: string;
  version?: string;
  run(sourceCode: string): CellOutput | Promise<CellOutput>;
}
