import { useEffect, useState } from "react";
import { CodeCell } from "../../../models/Cell/CodeCell";
import { MarkdownCell } from "../../../models/Cell/MarkdownCell";
import type { Notebook } from "../../../models/Notebook/Notebook";
import type { Language } from "../../../models/types/execution";
import type { ID } from "../../../models/types/id";
import { CellView } from "../../cell/components/CellView";

interface NotebookViewProps {
  notebook: Notebook;
  executingCells: Set<ID>;
  runtimeReady: boolean;
  runtimeStatusMessage?: string;
  notebookLocked: boolean;
  notebookLockMessage?: string;
  onInsertCodeCell: (index: number) => void;
  onInsertMarkdownCell: (index: number) => void;
  onRenameNotebook: (name: string) => void;
  availableLanguages: Language[];
  selectedLanguageName: string;
  onChangeLanguage: (languageName: string) => void;
  onChangeCellContent: (cellId: ID, value: string) => void;
  onSetCellEditing: (cellId: ID, isEditing: boolean) => void;
  onRunCell: (cellId: ID) => void;
  onClearCellOutput: (cellId: ID) => void;
  onMoveCellUp: (cellId: ID) => void;
  onMoveCellDown: (cellId: ID) => void;
  onDeleteCell: (cellId: ID) => void;
}

export function NotebookView({
  notebook,
  executingCells,
  runtimeReady,
  runtimeStatusMessage,
  notebookLocked,
  notebookLockMessage,
  onInsertCodeCell,
  onInsertMarkdownCell,
  onRenameNotebook,
  availableLanguages,
  selectedLanguageName,
  onChangeLanguage,
  onChangeCellContent,
  onSetCellEditing,
  onRunCell,
  onClearCellOutput,
  onMoveCellUp,
  onMoveCellDown,
  onDeleteCell,
}: NotebookViewProps) {
  const [selectedCellId, setSelectedCellId] = useState<ID | undefined>(notebook.cells[0]?.id);

  const handleSelectCell = (nextCellId: ID) => {
    if (selectedCellId && selectedCellId !== nextCellId) {
      const previousCell = notebook.getCell(selectedCellId);
      if (previousCell instanceof MarkdownCell && previousCell.isEditing) {
        onSetCellEditing(previousCell.id, false);
      }
    }

    setSelectedCellId(nextCellId);
  };

  useEffect(() => {
    const hasSelectedCell = selectedCellId ? notebook.cells.some((cell) => cell.id === selectedCellId) : false;
    if (!hasSelectedCell) {
      setSelectedCellId(notebook.cells[0]?.id);
    }
  }, [notebook, selectedCellId]);

  return (
    <main className="notebook-view">
      <header className="notebook-toolbar">
        <input
          className="notebook-title-input"
          value={notebook.name}
          onChange={(event) => onRenameNotebook(event.target.value)}
          aria-label="Notebook name"
          disabled={notebookLocked}
        />
        <div className="toolbar-actions">
          <select
            className="language-select"
            value={selectedLanguageName}
            onChange={(event) => onChangeLanguage(event.target.value)}
            aria-label="Notebook language"
            disabled={notebookLocked}
          >
            {availableLanguages.map((language) => (
              <option key={language.name} value={language.name}>
                {language.version ? `${language.name} (${language.version})` : language.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {notebookLocked ? (
        <div className="runtime-warning runtime-warning-active">
          {notebookLockMessage ?? "Language is loading. Cells are temporarily disabled."}
        </div>
      ) : runtimeReady ? null : (
        <div className="runtime-warning">{runtimeStatusMessage ?? "Selected language runtime is unavailable."}</div>
      )}

      <div className="notebook-cells">
        <div className="insert-boundary" aria-label="Insert at start">
          <div className="insert-boundary-line" />
          <div className="insert-row">
            <button type="button" className="insert-btn" disabled={notebookLocked} onClick={() => onInsertCodeCell(0)}>
              + Code
            </button>
            <button
              type="button"
              className="insert-btn"
              disabled={notebookLocked}
              onClick={() => onInsertMarkdownCell(0)}
            >
              + Text
            </button>
          </div>
        </div>

        {notebook.cells.map((cell) => {
          const typedCell = cell instanceof CodeCell || cell instanceof MarkdownCell ? cell : null;
          if (!typedCell) return null;
          const cellIndex = notebook.getCellIndex(typedCell.id);

          return (
            <div key={typedCell.id} className="cell-stack-item">
              <CellView
                cell={typedCell}
                isSelected={typedCell.id === selectedCellId}
                notebookLocked={notebookLocked}
                runtimeReady={runtimeReady}
                isRunning={executingCells.has(typedCell.id)}
                onSelect={handleSelectCell}
                onChange={onChangeCellContent}
                onSetEditing={onSetCellEditing}
                onRun={onRunCell}
                onClearOutput={onClearCellOutput}
                onMoveUp={onMoveCellUp}
                onMoveDown={onMoveCellDown}
                onDelete={onDeleteCell}
              />
              <div className="insert-boundary" aria-label="Insert between cells">
                <div className="insert-boundary-line" />
                <div className="insert-row">
                  <button
                    type="button"
                    className="insert-btn"
                    disabled={notebookLocked}
                    onClick={() => onInsertCodeCell(cellIndex + 1)}
                  >
                    + Code
                  </button>
                  <button
                    type="button"
                    className="insert-btn"
                    disabled={notebookLocked}
                    onClick={() => onInsertMarkdownCell(cellIndex + 1)}
                  >
                    + Text
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
