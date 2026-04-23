import { useState } from "react";

import type { CellOutput } from "../models/types/execution";
import type { ID } from "../models/types/id";
import { useWorkspaceStore } from "../contexts/workspace-store-context";
import { useNotebook } from "./useNotebook";
import { CodeCell } from "../models/cell/CodeCell";

export function useCell(notebookId: ID, cellId: ID) {
  const { isPreparingLanguage, runtimeReady, selectedCellId, selectCell } = useNotebook(notebookId);

  const store = useWorkspaceStore();

  const notebook = store((state) => state.workspace.getNotebook(notebookId));
  const cell = notebook?.getCell(cellId);

  if (!notebook) throw new Error(`Notebook ${notebookId} not found`);
  if (!cell) throw new Error(`Cell ${cellId} not found in notebook ${notebookId}`);

  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const updateCellContent = store((state) => state.updateCellContent);
  const setCellEditing = store((state) => state.setCellEditing);
  const setCellOutput = store((state) => state.setCellOutput);
  const clearCellOutput = store((state) => state.clearCellOutput);
  const moveCellUp = store((state) => state.moveCellUp);
  const moveCellDown = store((state) => state.moveCellDown);
  const deleteCell = store((state) => state.deleteCell);

  const runCell = async () => {
    if (isPreparingLanguage || !runtimeReady) return;

    setIsExecuting(true);

    try {
      if (!(cell instanceof CodeCell)) return;

      const output: CellOutput = await notebook.language.run(cell.content);
      setCellOutput(notebookId, cellId, output);
    } finally {
      setIsExecuting(false);
    }
  };

  return {
    cell,
    isRunning: isExecuting,
    isSelected: selectedCellId === cellId,
    updateContent: (content: string) => updateCellContent(notebookId, cellId, content),
    setEditing: (isEditing: boolean) => setCellEditing(notebookId, cellId, isEditing),
    clearOutput: () => clearCellOutput(notebookId, cellId),
    moveUp: () => moveCellUp(notebookId, cellId),
    moveDown: () => moveCellDown(notebookId, cellId),
    delete: () => deleteCell(notebookId, cellId),
    runCell: () => runCell(),
    selectCell: () => selectCell(cellId),
  };
}
