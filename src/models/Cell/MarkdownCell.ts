/**
 * MarkdownCell model - documentation cell
 */

import type { ID } from "../types/id";
import { Cell } from "./Cell";

export class MarkdownCell extends Cell {
  readonly type = "markdown" as const;

  constructor(content: string, id?: ID, createdAt?: Date, updatedAt?: Date, isEditing?: boolean) {
    super(content, id, createdAt, updatedAt, isEditing);
  }

  updateContent(content: string): MarkdownCell {
    return new MarkdownCell(content, this.id, this.createdAt, new Date(), this.isEditing);
  }

  setEditing(isEditing: boolean): MarkdownCell {
    return new MarkdownCell(this.content, this.id, this.createdAt, new Date(), isEditing);
  }
}
