import type { CellOutput } from "../types/execution";
import type { ID } from "../types/id";
import { Cell } from "./Cell";

export class CodeCell extends Cell {
  readonly type = "code" as const;
  private _output?: CellOutput;

  constructor(content: string, output?: CellOutput, id?: ID, createdAt?: Date, updatedAt?: Date, isEditing?: boolean) {
    super(content, id, createdAt, updatedAt, isEditing ?? true);
    this._output = output;
  }

  get output() {
    return this._output;
  }

  updateContent(content: string) {
    this.content = content;
    this.updatedAt = new Date();
  }

  setEditing(isEditing: boolean) {
    this.isEditing = isEditing;
    this.updatedAt = new Date();
  }

  withOutput(output: CellOutput) {
    this._output = output;
    this.updatedAt = new Date();
  }

  clearOutput() {
    this._output = undefined;
    this.updatedAt = new Date();
  }
}
