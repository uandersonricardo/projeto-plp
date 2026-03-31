/**
 * Notebook view model hook
 * Use case: UI integration for notebook display
 */

import { useState, useCallback, useMemo } from 'react';
import { Cell } from '../../models/Cell/Cell';
import { Notebook } from '../../models/Notebook/Notebook';
import { CellCommandInvoker } from '../../models/commands/CellCommandInvoker';
import {
  AddCellCommand,
  EditCellCommand,
  DeleteCellCommand,
  MoveCellUpCommand,
  MoveCellDownCommand,
  RunCellCommand,
} from '../../models/commands/CellCommands';
import type { ID } from '../../models/types/id';

/**
 * Cell view model for UI rendering
 */
export interface CellViewModel {
  id: ID;
  cell: Cell;
  isExecuting?: boolean;
  commands: {
    run?: () => Promise<void>;
    edit?: (content: string) => void;
    delete?: () => void;
    moveUp?: () => void;
    moveDown?: () => void;
  };
}

/**
 * Notebook view model for UI rendering
 */
export interface NotebookViewModel {
  id: ID;
  notebook: Notebook;
  cells: CellViewModel[];
  commands: {
    addCell?: (cell: Cell) => void;
    removeCell?: (cellId: ID) => void;
    updateCell?: (cellId: ID, content: string) => void;
    rename?: (name: string) => void;
  };
}

/**
 * Hook to convert Notebook to NotebookViewModel
 */
export function useNotebookViewModel(
  notebook: Notebook,
  onNotebookChange: (notebook: Notebook) => void,
): NotebookViewModel {
  const [executingCells, setExecutingCells] = useState<Set<ID>>(new Set());
  const invoker = useMemo(() => new CellCommandInvoker(), []);

  const handleEdit = useCallback(
    (cellId: ID, content: string) => {
      const command = new EditCellCommand(notebook, cellId, content);
      const updatedNotebook = command.execute();
      onNotebookChange(updatedNotebook);
    },
    [notebook, onNotebookChange],
  );

  const handleDelete = useCallback(
    (cellId: ID) => {
      const command = new DeleteCellCommand(notebook, cellId);
      const updatedNotebook = command.execute();
      onNotebookChange(updatedNotebook);
    },
    [notebook, onNotebookChange],
  );

  const handleMoveUp = useCallback(
    (cellId: ID) => {
      const command = new MoveCellUpCommand(notebook, cellId);
      const updatedNotebook = command.execute();
      onNotebookChange(updatedNotebook);
    },
    [notebook, onNotebookChange],
  );

  const handleMoveDown = useCallback(
    (cellId: ID) => {
      const command = new MoveCellDownCommand(notebook, cellId);
      const updatedNotebook = command.execute();
      onNotebookChange(updatedNotebook);
    },
    [notebook, onNotebookChange],
  );

  const handleRun = useCallback(
    async (cellId: ID) => {
      setExecutingCells((prev: Set<ID>) => new Set(prev).add(cellId));

      try {
        const command = new RunCellCommand(notebook, cellId);
        const updatedNotebook = await invoker.execute(command);
        onNotebookChange(updatedNotebook);
      } finally {
        setExecutingCells((prev: Set<ID>) => {
          const newSet = new Set(prev);
          newSet.delete(cellId);
          return newSet;
        });
      }
    },
    [invoker, notebook, onNotebookChange],
  );

  const cells: CellViewModel[] = notebook.cells.map((cell) => ({
    id: cell.id,
    cell,
    isExecuting: executingCells.has(cell.id),
    commands: {
      run: cell.type === 'code' ? () => handleRun(cell.id) : undefined,
      edit: (content: string) => handleEdit(cell.id, content),
      delete: () => handleDelete(cell.id),
      moveUp: () => handleMoveUp(cell.id),
      moveDown: () => handleMoveDown(cell.id),
    },
  }));

  return {
    id: notebook.id,
    notebook,
    cells,
    commands: {
      addCell: (cell: Cell) => {
        const command = new AddCellCommand(notebook, cell);
        const updatedNotebook = command.execute();
        onNotebookChange(updatedNotebook);
      },
      removeCell: handleDelete,
      updateCell: handleEdit,
      rename: (name: string) => {
        const updatedNotebook = notebook.rename(name);
        onNotebookChange(updatedNotebook);
      },
    },
  };
}
