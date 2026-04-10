import { FiPlay } from "react-icons/fi";
import type { Cell } from "../../models/cell/Cell";
import { CodeCell } from "../../models/cell/CodeCell";
import { MarkdownCell } from "../../models/cell/MarkdownCell";
import type { ID } from "../../models/types/id";
import { CellActionsView } from "./CellActionsView";
import { CodeCellView } from "./CodeCellView";
import { MarkdownCellView } from "./MarkdownCellView";

interface CellViewProps {
  cell: Cell;
  isSelected: boolean;
  isRunning: boolean;
  notebookLocked: boolean;
  runtimeReady: boolean;
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
  isRunning,
  notebookLocked,
  runtimeReady,
  onSelect,
  onChange,
  onSetEditing,
  onRun,
  onClearOutput,
  onMoveUp,
  onMoveDown,
  onDelete,
}: CellViewProps) {
  const isCode = cell instanceof CodeCell;
  const isMarkdown = cell instanceof MarkdownCell;

  return (
    <section className="grid grid-cols-[72px_minmax(0,1fr)] gap-[10px]">
      <div className="font-mono text-[0.8rem] text-gray-500 pt-3">[{cell.type}]</div>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: cell container handles click-to-select and double-click-to-edit */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: keyboard interactions are handled inside editors and action buttons */}
      <div
        className={`border rounded-lg bg-white p-[10px] grid gap-[10px] cursor-pointer relative${
          isSelected ? " border-gray-900" : " border-gray-200"
        }`}
        onClick={() => onSelect(cell.id)}
        onDoubleClick={() => {
          onSelect(cell.id);
          if (isMarkdown && !cell.isEditing && !notebookLocked) {
            onSetEditing(cell.id, true);
          }
        }}
      >
        {isSelected && (
          <div className="absolute top-0 right-[0.625rem] -translate-y-1/2 z-[8] pointer-events-none">
            <CellActionsView
              disabled={notebookLocked}
              showEdit={isMarkdown}
              isEditing={isMarkdown ? cell.isEditing : false}
              onEdit={() => isMarkdown && onSetEditing(cell.id, !cell.isEditing)}
              onMoveUp={() => onMoveUp(cell.id)}
              onMoveDown={() => onMoveDown(cell.id)}
              onDelete={() => onDelete(cell.id)}
            />
          </div>
        )}

        <div className={isCode ? "grid grid-cols-[2rem_minmax(0,1fr)] gap-x-[0.625rem] items-start" : "flex min-w-0 w-full"}>
          {isCode && isSelected && (
            <div className="flex justify-center items-start pt-2">
              <button
                type="button"
                className="border border-gray-200 bg-white text-gray-900 w-7 h-7 p-0 inline-flex items-center justify-center text-[0.95rem] leading-none rounded-md cursor-pointer hover:bg-[#f5f5f5] disabled:opacity-50 disabled:cursor-default [&_svg]:w-[14px] [&_svg]:h-[14px]"
                onClick={(e) => {
                  e.stopPropagation();
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
            </div>
          )}
          {isCode && !isSelected && <div className="flex justify-center items-start pt-2" />}

          <div className="min-w-0 w-full flex-1">
            {isCode ? (
              <CodeCellView
                cell={cell}
                disabled={notebookLocked}
                isRunning={isRunning}
                onChange={(value) => onChange(cell.id, value)}
                onClearOutput={() => onClearOutput(cell.id)}
                onRun={() => onRun(cell.id)}
              />
            ) : (
              <MarkdownCellView
                cell={cell as MarkdownCell}
                disabled={notebookLocked}
                onChange={(value) => onChange(cell.id, value)}
                onFinishEditing={() => onSetEditing(cell.id, false)}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
