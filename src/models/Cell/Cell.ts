/**
 * Base Cell model - shared structure for all cell types
 */

import { createID, type ID } from '../types/id';

export type CellType = 'code' | 'markdown';

export abstract class Cell {
  readonly id: ID;
  readonly content: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  abstract readonly type: CellType;

  constructor(
    content: string,
    id?: ID,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id || createID();
    this.content = content;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  /**
   * Create a new Cell with updated content (immutable pattern)
   */
  abstract updateContent(content: string): Cell;
}
