import { CodeCell } from '../../models/Cell/CodeCell';
import { MarkdownCell } from '../../models/Cell/MarkdownCell';
import type { ID } from '../../models/types/id';
import { CodeCellView } from './CodeCellView';
import { MarkdownCellView } from './MarkdownCellView';
import { CommandButtonsView } from './CommandButtonsView';

interface CellViewProps {
  cell: CodeCell | MarkdownCell;
  isRunning: boolean;
  onChange: (cellId: ID, value: string) => void;
  onRun: (cellId: ID) => void;
  onMoveUp: (cellId: ID) => void;
  onMoveDown: (cellId: ID) => void;
  onDelete: (cellId: ID) => void;
}

export function CellView({
  cell,
  isRunning,
  onChange,
  onRun,
  onMoveUp,
  onMoveDown,
  onDelete,
}: CellViewProps) {
  return (
    <section className="cell-shell">
      <div className="cell-gutter">[{cell.type}]</div>
      <div className="cell-main">
        {cell instanceof CodeCell ? (
          <CodeCellView cell={cell} isRunning={isRunning} onChange={(value: string) => onChange(cell.id, value)} />
        ) : (
          <MarkdownCellView cell={cell} onChange={(value: string) => onChange(cell.id, value)} />
        )}
        <CommandButtonsView
          canRun={cell instanceof CodeCell}
          isRunning={isRunning}
          onRun={() => onRun(cell.id)}
          onMoveUp={() => onMoveUp(cell.id)}
          onMoveDown={() => onMoveDown(cell.id)}
          onDelete={() => onDelete(cell.id)}
        />
      </div>
    </section>
  );
}
