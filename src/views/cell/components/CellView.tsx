import { FiPlay } from "react-icons/fi";
import { CodeCell } from "../../../models/Cell/CodeCell";
import { MarkdownCell } from "../../../models/Cell/MarkdownCell";
import type { ID } from "../../../models/types/id";
import { CodeCellView } from "./CodeCellView";
import { CommandButtonsView } from "./CommandButtonsView";
import { MarkdownCellView } from "./MarkdownCellView";

interface CellViewProps {
  cell: CodeCell | MarkdownCell;
  isSelected: boolean;
  notebookLocked: boolean;
  runtimeReady: boolean;
  isRunning: boolean;
  onSelect: (cellId: ID) => void;
  onChange: (cellId: ID, value: string) => void;
  onSetEditing: (cellId: ID, isEditing: boolean) => void;
  onRun: (cellId: ID) => void;
  onClearOutput: (cellId: ID) => void;
  onMoveUp: (cellId: ID) => void;
  onMoveDown: (cellId: ID) => void;
  onDelete: (cellId: ID) => void;
}

export function CellView({
  cell,
  isSelected,
  notebookLocked,
  runtimeReady,
  isRunning,
  onSelect,
  onChange,
  onSetEditing,
  onRun,
  onClearOutput,
  onMoveUp,
  onMoveDown,
  onDelete,
}: CellViewProps) {
  const handleEditAction = () => {
    if (cell instanceof MarkdownCell) {
      onSetEditing(cell.id, !cell.isEditing);
    }
  };

  return (
    <section className="cell-shell">
      <div className="cell-gutter">[{cell.type}]</div>
      <div
        className={isSelected ? "cell-main cell-main-selected" : "cell-main"}
        onClick={() => onSelect(cell.id)}
        onDoubleClick={() => {
          onSelect(cell.id);
          if (cell instanceof MarkdownCell && !cell.isEditing && !notebookLocked) {
            onSetEditing(cell.id, true);
          }
        }}
      >
        {isSelected ? (
          <div className="cell-command-overlay">
            <CommandButtonsView
              visible
              disabled={notebookLocked}
              showEdit={cell instanceof MarkdownCell}
              isEditing={cell instanceof MarkdownCell ? cell.isEditing : false}
              onEdit={handleEditAction}
              onMoveUp={() => onMoveUp(cell.id)}
              onMoveDown={() => onMoveDown(cell.id)}
              onDelete={() => onDelete(cell.id)}
            />
          </div>
        ) : null}

        <div className={cell instanceof CodeCell ? "cell-body cell-body-runnable" : "cell-body"}>
          {cell instanceof CodeCell ? (
            <div className="cell-run-slot">
              {isSelected ? (
                <button
                  type="button"
                  className="cmd-btn cmd-icon-btn cmd-run"
                  onClick={(event) => {
                    event.stopPropagation();
                    onRun(cell.id);
                  }}
                  disabled={notebookLocked || isRunning || !runtimeReady}
                  aria-label="Run cell"
                  title={
                    notebookLocked ? "Locked" : !runtimeReady ? "Runtime unavailable" : isRunning ? "Running..." : "Run"
                  }
                >
                  <FiPlay aria-hidden="true" />
                </button>
              ) : null}
            </div>
          ) : null}

          <div className="cell-content">
            {cell instanceof CodeCell ? (
              <CodeCellView
                cell={cell}
                disabled={notebookLocked}
                isRunning={isRunning}
                onChange={(value: string) => onChange(cell.id, value)}
                onClearOutput={() => onClearOutput(cell.id)}
                onRun={() => onRun(cell.id)}
              />
            ) : (
              <MarkdownCellView
                cell={cell}
                disabled={notebookLocked}
                onChange={(value: string) => onChange(cell.id, value)}
                onFinishEditing={() => onSetEditing(cell.id, false)}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
