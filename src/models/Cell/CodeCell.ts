import type { CellOutput } from "../types/execution";
import type { ID } from "../types/id";
import { Cell } from "./Cell";

export class CodeCell extends Cell {
  readonly type = "code" as const;
  private _output?: CellOutput;
  private _executionOrder?: number;

  constructor(content: string, output?: CellOutput, id?: ID, createdAt?: Date, updatedAt?: Date, isEditing?: boolean) {
    super(content, id, createdAt, updatedAt, isEditing ?? true);
    this._output = output;
  }

  get output() {
    return this._output;
  }

  get executionOrder() {
    return this._executionOrder;
  }

  updateContent(content: string) {
    this.content = content;
    this.updatedAt = new Date();
  }

  setEditing(isEditing: boolean) {
    this.isEditing = isEditing;
    this.updatedAt = new Date();
  }

  withOutput(output: CellOutput, executionOrder?: number) {
    this._output = output;
    this._executionOrder = executionOrder;
    this.updatedAt = new Date();
  }

  clearOutput() {
    this._output = undefined;
    this._executionOrder = undefined;
    this.updatedAt = new Date();
  }
}
