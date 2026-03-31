import { CodeCell } from '../../models/Cell/CodeCell';
import { MarkdownCell } from '../../models/Cell/MarkdownCell';
import type { Notebook } from '../../models/Notebook/Notebook';
import type { ID } from '../../models/types/id';
import { CellView } from '../cell/CellView';

interface NotebookViewProps {
  notebook: Notebook;
  executingCells: Set<ID>;
  onAddCodeCell: () => void;
  onAddMarkdownCell: () => void;
  onRenameNotebook: (name: string) => void;
  onChangeCellContent: (cellId: ID, value: string) => void;
  onRunCell: (cellId: ID) => void;
  onMoveCellUp: (cellId: ID) => void;
  onMoveCellDown: (cellId: ID) => void;
  onDeleteCell: (cellId: ID) => void;
}

export function NotebookView({
  notebook,
  executingCells,
  onAddCodeCell,
  onAddMarkdownCell,
  onRenameNotebook,
  onChangeCellContent,
  onRunCell,
  onMoveCellUp,
  onMoveCellDown,
  onDeleteCell,
}: NotebookViewProps) {
  return (
    <main className="notebook-view">
      <header className="notebook-toolbar">
        <input
          className="notebook-title-input"
          value={notebook.name}
          onChange={(event) => onRenameNotebook(event.target.value)}
          aria-label="Notebook name"
        />
        <div className="toolbar-actions">
          <button type="button" className="toolbar-btn" onClick={onAddCodeCell}>
            + Code
          </button>
          <button type="button" className="toolbar-btn" onClick={onAddMarkdownCell}>
            + Text
          </button>
        </div>
      </header>

      <div className="notebook-cells">
        {notebook.cells.map((cell) => {
          const typedCell = cell instanceof CodeCell || cell instanceof MarkdownCell ? cell : null;
          if (!typedCell) return null;

          return (
            <CellView
              key={typedCell.id}
              cell={typedCell}
              isRunning={executingCells.has(typedCell.id)}
              onChange={onChangeCellContent}
              onRun={onRunCell}
              onMoveUp={onMoveCellUp}
              onMoveDown={onMoveCellDown}
              onDelete={onDeleteCell}
            />
          );
        })}
      </div>
    </main>
  );
}
