/**
 * Workspace model - contains multiple notebooks
 */

import type { Cell } from "../Cell/Cell";
import type { Notebook } from "../Notebook/Notebook";
import { createID, type ID } from "../types/id";

export class Workspace {
  readonly id: ID;
  readonly name: string;
  readonly notebooks: Notebook[];
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(name: string, notebooks?: Notebook[], id?: ID, createdAt?: Date, updatedAt?: Date) {
    this.id = id || createID();
    this.name = name;
    this.notebooks = notebooks || [];
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  /**
   * Add a new notebook
   */
  addNotebook(notebook: Notebook): Workspace {
    return new Workspace(this.name, [...this.notebooks, notebook], this.id, this.createdAt, new Date());
  }

  /**
   * Remove a notebook by ID
   */
  removeNotebook(notebookId: ID): Workspace {
    const newNotebooks = this.notebooks.filter((nb) => nb.id !== notebookId);
    return new Workspace(this.name, newNotebooks, this.id, this.createdAt, new Date());
  }

  /**
   * Update a specific notebook
   */
  updateNotebook(notebookId: ID, updatedNotebook: Notebook): Workspace {
    const newNotebooks = this.notebooks.map((nb) => (nb.id === notebookId ? updatedNotebook : nb));
    return new Workspace(this.name, newNotebooks, this.id, this.createdAt, new Date());
  }

  /**
   * Get a notebook by ID
   */
  getNotebook(notebookId: ID): Notebook | undefined {
    return this.notebooks.find((nb) => nb.id === notebookId);
  }

  /**
   * Get all cells across all notebooks
   */
  getAllCells(): Array<{ notebookId: ID; cell: Cell }> {
    return this.notebooks.flatMap((notebook) => notebook.cells.map((cell) => ({ notebookId: notebook.id, cell })));
  }

  /**
   * Get the index of a notebook by ID
   */
  getNotebookIndex(notebookId: ID): number {
    return this.notebooks.findIndex((nb) => nb.id === notebookId);
  }

  /**
   * Rename the workspace
   */
  rename(name: string): Workspace {
    return new Workspace(name, this.notebooks, this.id, this.createdAt, new Date());
  }
}
