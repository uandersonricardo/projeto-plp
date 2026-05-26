import { CodeCell } from "../models/cell/CodeCell";
import { MarkdownCell } from "../models/cell/MarkdownCell";
import { Notebook } from "../models/notebook/Notebook";
import { Workspace } from "../models/workspace/Workspace";
import { AVAILABLE_LANGUAGES } from "./languages";
import WORKSPACE_EXAMPLES from "./workspace-examples";

export const INITIAL_WORKSPACE = new Workspace(
  "Untitled Workspace",
  AVAILABLE_LANGUAGES.map((language) => {
    const example = WORKSPACE_EXAMPLES[language.name];
    return new Notebook(language.name, language, [
      new MarkdownCell(example?.markdown ?? `# ${language.name}\n\nExample notebook.`),
      new CodeCell(example?.code ?? ""),
    ]);
  })
);
