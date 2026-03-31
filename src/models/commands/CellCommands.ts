/**
 * Command pattern for cell-level notebook actions.
 * Each command encapsulates one request and returns the next immutable Notebook state.
 */

import { CodeCell } from '../Cell/CodeCell';
import type { Cell } from '../Cell/Cell';
import { Notebook } from '../Notebook/Notebook';
import type { ID } from '../types/id';

export type CellCommandType =
  | 'add'
  | 'insert'
  | 'edit'
  | 'delete'
  | 'moveUp'
  | 'moveDown'
  | 'run';

export interface CellCommand {
  readonly type: CellCommandType;
  execute(): Notebook | Promise<Notebook>;
}

export class AddCellCommand implements CellCommand {
  readonly type = 'add' as const;
  private readonly notebook: Notebook;
  private readonly cell: Cell;

  constructor(notebook: Notebook, cell: Cell) {
    this.notebook = notebook;
    this.cell = cell;
  }

  execute(): Notebook {
    return this.notebook.addCell(this.cell);
  }
}

export class InsertCellCommand implements CellCommand {
  readonly type = 'insert' as const;
  private readonly notebook: Notebook;
  private readonly cell: Cell;
  private readonly index: number;

  constructor(notebook: Notebook, cell: Cell, index: number) {
    this.notebook = notebook;
    this.cell = cell;
    this.index = index;
  }

  execute(): Notebook {
    return this.notebook.insertCell(this.cell, this.index);
  }
}

export class EditCellCommand implements CellCommand {
  readonly type = 'edit' as const;
  private readonly notebook: Notebook;
  private readonly cellId: ID;
  private readonly content: string;

  constructor(notebook: Notebook, cellId: ID, content: string) {
    this.notebook = notebook;
    this.cellId = cellId;
    this.content = content;
  }

  execute(): Notebook {
    const cell = this.notebook.getCell(this.cellId);
    if (!cell) return this.notebook;

    const updatedCell = cell.updateContent(this.content);
    return this.notebook.updateCell(this.cellId, updatedCell);
  }
}

export class DeleteCellCommand implements CellCommand {
  readonly type = 'delete' as const;
  private readonly notebook: Notebook;
  private readonly cellId: ID;

  constructor(notebook: Notebook, cellId: ID) {
    this.notebook = notebook;
    this.cellId = cellId;
  }

  execute(): Notebook {
    return this.notebook.removeCell(this.cellId);
  }
}

export class MoveCellUpCommand implements CellCommand {
  readonly type = 'moveUp' as const;
  private readonly notebook: Notebook;
  private readonly cellId: ID;

  constructor(notebook: Notebook, cellId: ID) {
    this.notebook = notebook;
    this.cellId = cellId;
  }

  execute(): Notebook {
    return this.notebook.moveCellUp(this.cellId);
  }
}

export class MoveCellDownCommand implements CellCommand {
  readonly type = 'moveDown' as const;
  private readonly notebook: Notebook;
  private readonly cellId: ID;

  constructor(notebook: Notebook, cellId: ID) {
    this.notebook = notebook;
    this.cellId = cellId;
  }

  execute(): Notebook {
    return this.notebook.moveCellDown(this.cellId);
  }
}

export class RunCellCommand implements CellCommand {
  readonly type = 'run' as const;
  private readonly notebook: Notebook;
  private readonly cellId: ID;

  constructor(notebook: Notebook, cellId: ID) {
    this.notebook = notebook;
    this.cellId = cellId;
  }

  async execute(): Promise<Notebook> {
    const cell = this.notebook.getCell(this.cellId);
    if (!cell || !(cell instanceof CodeCell)) return this.notebook;

    const output = await this.notebook.language.run(cell.content);
    const updatedCell = cell.withOutput(output);
    return this.notebook.updateCell(this.cellId, updatedCell);
  }
}
