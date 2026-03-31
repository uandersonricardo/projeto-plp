/**
 * React hook for managing notebook state
 * Use case: Notebook editing and execution
 */

import { useState, useCallback, useMemo } from 'react';
import { Cell } from '../../models/Cell/Cell';
import { Notebook } from '../../models/Notebook/Notebook';
import { CellCommandInvoker } from '../../models/commands/CellCommandInvoker';
import {
  AddCellCommand,
  InsertCellCommand,
  EditCellCommand,
  DeleteCellCommand,
  MoveCellUpCommand,
  MoveCellDownCommand,
  RunCellCommand,
} from '../../models/commands/CellCommands';
import type { ID } from '../../models/types/id';

export interface UseNotebookReturnType {
  notebook: Notebook;
  executingCells: Set<ID>;
  actions: {
    addCell: (cell: Cell) => void;
    insertCell: (cell: Cell, index: number) => void;
    removeCell: (cellId: ID) => void;
    updateCell: (cellId: ID, content: string) => void;
    moveUp: (cellId: ID) => void;
    moveDown: (cellId: ID) => void;
    runCell: (cellId: ID) => Promise<void>;
    stopCell: (cellId: ID) => void;
    rename: (name: string) => void;
  };
}

/**
 * Hook for managing notebook state
 */
export function useNotebook(initialNotebook: Notebook): UseNotebookReturnType {
  const [notebook, setNotebook] = useState(initialNotebook);
  const [executingCells, setExecutingCells] = useState<Set<ID>>(new Set());
  const invoker = useMemo(() => new CellCommandInvoker(), []);

  const addCell = useCallback((cell: Cell) => {
    setNotebook((prev: Notebook) => {
      const command = new AddCellCommand(prev, cell);
      return command.execute();
    });
  }, []);

  const insertCell = useCallback((cell: Cell, index: number) => {
    setNotebook((prev: Notebook) => {
      const command = new InsertCellCommand(prev, cell, index);
      return command.execute();
    });
  }, []);

  const removeCell = useCallback((cellId: ID) => {
    setNotebook((prev: Notebook) => {
      const command = new DeleteCellCommand(prev, cellId);
      return command.execute();
    });
  }, []);

  const updateCell = useCallback((cellId: ID, content: string) => {
    setNotebook((prev: Notebook) => {
      const command = new EditCellCommand(prev, cellId, content);
      return command.execute();
    });
  }, []);

  const moveUp = useCallback((cellId: ID) => {
    setNotebook((prev: Notebook) => {
      const command = new MoveCellUpCommand(prev, cellId);
      return command.execute();
    });
  }, []);

  const moveDown = useCallback((cellId: ID) => {
    setNotebook((prev: Notebook) => {
      const command = new MoveCellDownCommand(prev, cellId);
      return command.execute();
    });
  }, []);

  const runCell = useCallback(
    async (cellId: ID) => {
      setExecutingCells((prev: Set<ID>) => new Set(prev).add(cellId));

      try {
        const command = new RunCellCommand(notebook, cellId);
        const updatedNotebook = await invoker.execute(command);
        setNotebook(updatedNotebook);
      } finally {
        setExecutingCells((prev: Set<ID>) => {
          const newSet = new Set(prev);
          newSet.delete(cellId);
          return newSet;
        });
      }
    },
    [invoker, notebook],
  );

  const stopCell = useCallback((cellId: ID) => {
    setExecutingCells((prev: Set<ID>) => {
      const newSet = new Set(prev);
      newSet.delete(cellId);
      return newSet;
    });
  }, []);

  const rename = useCallback((name: string) => {
    setNotebook((prev: Notebook) => prev.rename(name));
  }, []);

  return {
    notebook,
    executingCells,
    actions: {
      addCell,
      insertCell,
      removeCell,
      updateCell,
      moveUp,
      moveDown,
      runCell,
      stopCell,
      rename,
    },
  };
}
