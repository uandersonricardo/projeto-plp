/**
 * MarkdownCell model - documentation cell
 */

import type { ID } from '../types/id';
import { Cell } from './Cell';

export class MarkdownCell extends Cell {
  readonly type = 'markdown' as const;

  constructor(content: string, id?: ID, createdAt?: Date, updatedAt?: Date) {
    super(content, id, createdAt, updatedAt);
  }

  updateContent(content: string): MarkdownCell {
    return new MarkdownCell(content, this.id, this.createdAt, new Date());
  }
}
