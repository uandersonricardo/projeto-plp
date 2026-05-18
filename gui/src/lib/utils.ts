import type { Cell } from "../models/cell/Cell";
import { CodeCell } from "../models/cell/CodeCell";
import type { ID } from "../models/types/id";

export const buildNotebookScopeCode = (cells: Cell[], targetCellId: ID) => {
  const currentCell = cells.find((c) => c.id === targetCellId);
  if (!(currentCell instanceof CodeCell)) return "";

  const previouslyRun = cells
    .filter((c): c is CodeCell => c instanceof CodeCell && c.id !== targetCellId && c.executionOrder !== undefined)
    .sort((a, b) => a.executionOrder! - b.executionOrder!);

  const combined = [...previouslyRun, currentCell].map((c) => c.content).join("\n");
  return `{\n${combined}\n}`;
};
