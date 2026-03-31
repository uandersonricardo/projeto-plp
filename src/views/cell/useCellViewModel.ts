/**
 * Cell view model hook
 * Use case: Individual cell display, editing, and execution
 */

import { useCallback } from 'react';
import { Cell } from '../../models/Cell/Cell';
import { CodeCell } from '../../models/Cell/CodeCell';
import type { ID } from '../../models/types/id';

/**
 * Cell view model for UI rendering
 */
export interface CellViewProps {
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
 * Hook to create a cell view model
 */
export function useCellViewModel(
  cell: Cell,
  isExecuting: boolean,
  callbacks: {
    onRun?: (cellId: ID) => Promise<void>;
    onEdit?: (cellId: ID, content: string) => void;
    onDelete?: (cellId: ID) => void;
    onMoveUp?: (cellId: ID) => void;
    onMoveDown?: (cellId: ID) => void;
  },
): CellViewProps {
  const handleRun = useCallback(async () => {
    if (callbacks.onRun) {
      await callbacks.onRun(cell.id);
    }
  }, [cell.id, callbacks]);

  const handleEdit = useCallback(
    (content: string) => {
      if (callbacks.onEdit) {
        callbacks.onEdit(cell.id, content);
      }
    },
    [cell.id, callbacks],
  );

  const handleDelete = useCallback(() => {
    if (callbacks.onDelete) {
      callbacks.onDelete(cell.id);
    }
  }, [cell.id, callbacks]);

  const handleMoveUp = useCallback(() => {
    if (callbacks.onMoveUp) {
      callbacks.onMoveUp(cell.id);
    }
  }, [cell.id, callbacks]);

  const handleMoveDown = useCallback(() => {
    if (callbacks.onMoveDown) {
      callbacks.onMoveDown(cell.id);
    }
  }, [cell.id, callbacks]);

  return {
    id: cell.id,
    cell,
    isExecuting,
    commands: {
      run: cell instanceof CodeCell ? handleRun : undefined,
      edit: handleEdit,
      delete: handleDelete,
      moveUp: handleMoveUp,
      moveDown: handleMoveDown,
    },
  };
}
