/**
 * Notebook model - contains multiple cells using a specific language
 */

import type { Cell } from "../Cell/Cell";
import type { Language } from "../types/execution";
import { createID, type ID } from "../types/id";

export class Notebook {
  readonly id: ID;
  readonly name: string;
  readonly language: Language;
  readonly cells: Cell[];
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(name: string, language: Language, cells?: Cell[], id?: ID, createdAt?: Date, updatedAt?: Date) {
    this.id = id || createID();
    this.name = name;
    this.language = language;
    this.cells = cells || [];
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  /**
   * Add a new cell at the end of the notebook
   */
  addCell(cell: Cell): Notebook {
    return new Notebook(this.name, this.language, [...this.cells, cell], this.id, this.createdAt, new Date());
  }

  /**
   * Insert a cell at a specific index
   */
  insertCell(cell: Cell, index: number): Notebook {
    const newCells = [...this.cells];
    newCells.splice(index, 0, cell);
    return new Notebook(this.name, this.language, newCells, this.id, this.createdAt, new Date());
  }

  /**
   * Remove a cell by ID
   */
  removeCell(cellId: ID): Notebook {
    const newCells = this.cells.filter((cell) => cell.id !== cellId);
    return new Notebook(this.name, this.language, newCells, this.id, this.createdAt, new Date());
  }

  /**
   * Update a specific cell
   */
  updateCell(cellId: ID, updatedCell: Cell): Notebook {
    const newCells = this.cells.map((cell) => (cell.id === cellId ? updatedCell : cell));
    return new Notebook(this.name, this.language, newCells, this.id, this.createdAt, new Date());
  }

  /**
   * Move a cell up (towards the beginning)
   */
  moveCellUp(cellId: ID): Notebook {
    const index = this.cells.findIndex((cell) => cell.id === cellId);
    if (index <= 0) return this;

    const newCells = [...this.cells];
    [newCells[index], newCells[index - 1]] = [newCells[index - 1], newCells[index]];
    return new Notebook(this.name, this.language, newCells, this.id, this.createdAt, new Date());
  }

  /**
   * Move a cell down (towards the end)
   */
  moveCellDown(cellId: ID): Notebook {
    const index = this.cells.findIndex((cell) => cell.id === cellId);
    if (index === -1 || index === this.cells.length - 1) return this;

    const newCells = [...this.cells];
    [newCells[index], newCells[index + 1]] = [newCells[index + 1], newCells[index]];
    return new Notebook(this.name, this.language, newCells, this.id, this.createdAt, new Date());
  }

  /**
   * Get a cell by ID
   */
  getCell(cellId: ID): Cell | undefined {
    return this.cells.find((cell) => cell.id === cellId);
  }

  /**
   * Get the index of a cell by ID
   */
  getCellIndex(cellId: ID): number {
    return this.cells.findIndex((cell) => cell.id === cellId);
  }

  /**
   * Rename the notebook
   */
  rename(name: string): Notebook {
    return new Notebook(name, this.language, this.cells, this.id, this.createdAt, new Date());
  }

  /**
   * Change the execution language for this notebook
   */
  setLanguage(language: Language): Notebook {
    return new Notebook(this.name, language, this.cells, this.id, this.createdAt, new Date());
  }
}
