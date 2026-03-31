/**
 * CodeCell model - executable cell with output
 */

import type { CellOutput } from '../types/execution';
import type { ID } from '../types/id';
import { Cell } from './Cell';

export class CodeCell extends Cell {
  readonly type = 'code' as const;
  private readonly _output?: CellOutput;

  constructor(
    content: string,
    output?: CellOutput,
    id?: ID,
    createdAt?: Date,
    updatedAt?: Date,
    isEditing?: boolean,
  ) {
    super(content, id, createdAt, updatedAt, isEditing ?? true);
    this._output = output;
  }

  get output(): CellOutput | undefined {
    return this._output;
  }

  updateContent(content: string): CodeCell {
    return new CodeCell(
      content,
      this._output,
      this.id,
      this.createdAt,
      new Date(),
      this.isEditing,
    );
  }

  setEditing(isEditing: boolean): CodeCell {
    return new CodeCell(
      this.content,
      this._output,
      this.id,
      this.createdAt,
      new Date(),
      isEditing,
    );
  }

  withOutput(output: CellOutput): CodeCell {
    return new CodeCell(
      this.content,
      output,
      this.id,
      this.createdAt,
      new Date(),
      this.isEditing,
    );
  }

  clearOutput(): CodeCell {
    return new CodeCell(
      this.content,
      undefined,
      this.id,
      this.createdAt,
      new Date(),
      this.isEditing,
    );
  }
}
