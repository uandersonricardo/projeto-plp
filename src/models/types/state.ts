/**
 * State persistence types
 */

import type { CellOutput, Language } from './execution';
import type { ID } from './id';
import type { CellType } from '../Cell/Cell';

/**
 * Cell state for persistence
 */
export interface CellState {
  id: ID;
  type: CellType;
  content: string;
  isEditing: boolean;
  output?: CellOutput;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Notebook state for persistence
 */
export interface NotebookState {
  id: ID;
  name: string;
  language: Language;
  cells: CellState[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Workspace state for persistence
 */
export interface WorkspaceState {
  id: ID;
  name: string;
  notebooks: NotebookState[];
  createdAt: Date;
  updatedAt: Date;
}
