export interface CellOutput {
  stdout: string;
  stderr: string;
  result?: unknown;
  compilationEnv?: unknown;
  executionTime: number;
  success: boolean;
}

export interface SourceCode {
  code: string;
  language: string;
}

export interface SourceRange {
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
}

export interface ScopeSnapshot {
  bindings: Record<string, string>;
  sourceRange?: SourceRange;
}

export interface BNFLanguageDefinition {
  keywords?: string[];
  literals?: string[];
  types?: string[];
  builtins?: string[];
}

export interface Language {
  name: string;
  version?: string;
  bnf: BNFLanguageDefinition;
  run(sourceCode: string): CellOutput | Promise<CellOutput>;
}
