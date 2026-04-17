import { CodeCell } from "../../models/cell/CodeCell";
import { MarkdownCell } from "../../models/cell/MarkdownCell";
import { CellActionsView } from "./CellActionsView";
import { CodeCellView } from "./CodeCellView";
import { MarkdownCellView } from "./MarkdownCellView";
import type { ID } from "../../models/types/id";
import { useCell } from "../../hooks/useCell";
import { useNotebook } from "../../hooks/useNotebook";

interface CellViewProps {
  notebookId: ID;
  cellId: ID;
}

export function CellView({ notebookId, cellId }: CellViewProps) {
  const { runtimeReady, isPreparingLanguage } = useNotebook(notebookId);
  const {
    cell,
    isSelected,
    isRunning,
    selectCell,
    setEditing,
    moveUp,
    moveDown,
    delete: deleteCell,
    runCell,
    clearOutput,
    updateContent,
  } = useCell(notebookId, cellId);

  const notebookLocked = isPreparingLanguage;
  const isCode = cell instanceof CodeCell;
  const isMarkdown = cell instanceof MarkdownCell;

  const borderClass = isSelected
    ? "border-cyan-600 ring-cyan-600 ring-1"
    : isMarkdown && !cell.isEditing
      ? "border-transparent"
      : "border-gray-200";

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: cell container handles click-to-select and double-click-to-edit
    // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard interactions are handled inside editors and action buttons
    <div
      className={`group border rounded-lg bg-white p-4 grid gap-[10px] cursor-pointer relative ${borderClass}`}
      onClick={selectCell}
      onDoubleClick={() => {
        selectCell();

        if (isMarkdown && !cell.isEditing && !notebookLocked) {
          setEditing(true);
        }
      }}
    >
      {isSelected && (
        <div className="absolute top-0 right-[0.625rem] -translate-y-1/2 z-[8] pointer-events-none">
          <CellActionsView
            disabled={notebookLocked}
            showEdit={isMarkdown}
            isEditing={isMarkdown ? cell.isEditing : false}
            onEdit={() => isMarkdown && setEditing(!cell.isEditing)}
            onMoveUp={moveUp}
            onMoveDown={moveDown}
            onDelete={deleteCell}
          />
        </div>
      )}

      <div className="min-w-0 w-full">
        {isCode ? (
          <CodeCellView
            cell={cell}
            disabled={notebookLocked}
            isRunning={isRunning}
            runtimeReady={runtimeReady}
            onChange={updateContent}
            onClearOutput={clearOutput}
            onRun={runCell}
          />
        ) : (
          <MarkdownCellView
            cell={cell as MarkdownCell}
            disabled={notebookLocked}
            onChange={updateContent}
            onFinishEditing={() => setEditing(false)}
          />
        )}
      </div>
    </div>
  );
}
