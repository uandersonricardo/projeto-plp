import type { MouseEventHandler } from 'react';

interface CommandButtonsViewProps {
  canRun: boolean;
  isRunning: boolean;
  onRun?: MouseEventHandler<HTMLButtonElement>;
  onMoveUp: MouseEventHandler<HTMLButtonElement>;
  onMoveDown: MouseEventHandler<HTMLButtonElement>;
  onDelete: MouseEventHandler<HTMLButtonElement>;
}

export function CommandButtonsView({
  canRun,
  isRunning,
  onRun,
  onMoveUp,
  onMoveDown,
  onDelete,
}: CommandButtonsViewProps) {
  return (
    <div className="cell-commands">
      {canRun ? (
        <button type="button" className="cmd-btn cmd-run" onClick={onRun} disabled={isRunning}>
          {isRunning ? 'Running...' : 'Run'}
        </button>
      ) : null}
      <button type="button" className="cmd-btn" onClick={onMoveUp}>
        Up
      </button>
      <button type="button" className="cmd-btn" onClick={onMoveDown}>
        Down
      </button>
      <button type="button" className="cmd-btn cmd-danger" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
}
