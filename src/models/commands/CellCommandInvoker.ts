/**
 * Invoker for notebook cell commands.
 */

import type { Notebook } from "../notebook/Notebook";
import type { CellCommand } from "./CellCommands";

export class CellCommandInvoker {
  async execute(command: CellCommand): Promise<Notebook> {
    return await command.execute();
  }
}
