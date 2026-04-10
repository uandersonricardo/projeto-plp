import { useEffect, useState } from "react";
import { MarkdownCell } from "../../models/cell/MarkdownCell";
import type { ID } from "../../models/types/id";
import type { WorkspaceViewModel } from "../../view-models/useWorkspaceViewModel";
import { CellView } from "../cell/CellView";

interface NotebookViewProps {
  viewModel: WorkspaceViewModel;
}

export function NotebookView({ viewModel }: NotebookViewProps) {
  const { selectedNotebook: notebook } = viewModel;
  const [selectedCellId, setSelectedCellId] = useState<ID | undefined>(notebook.cells[0]?.id);

  // Keep selected cell valid when cells change (e.g. after delete)
  useEffect(() => {
    const isValid = selectedCellId ? notebook.cells.some((c) => c.id === selectedCellId) : false;
    if (!isValid) setSelectedCellId(notebook.cells[0]?.id);
  }, [notebook, selectedCellId]);

  const handleSelectCell = (cellId: ID) => {
    if (selectedCellId && selectedCellId !== cellId) {
      const prev = notebook.getCell(selectedCellId);
      if (prev instanceof MarkdownCell && prev.isEditing) {
        viewModel.setCellEditing(prev.id, false);
      }
    }
    setSelectedCellId(cellId);
  };

  const locked = viewModel.isPreparingLanguage;

  return (
    <main className="bg-white border border-gray-200 rounded-[10px] h-full flex flex-col overflow-hidden">
      <header className="p-[14px] border-b border-gray-200 flex items-center justify-between gap-3 shrink-0">
        <input
          className="border-0 text-[1.1rem] font-bold w-full text-gray-900 focus:outline-none disabled:opacity-55 disabled:cursor-not-allowed bg-transparent"
          value={notebook.name}
          onChange={(e) => viewModel.renameNotebook(e.target.value)}
          aria-label="Notebook name"
          disabled={locked}
        />
        <div className="flex gap-2">
          <select
            className="border border-gray-200 bg-transparent text-gray-900 rounded-md py-2 px-[10px] focus:outline focus:outline-1 focus:outline-gray-900 disabled:opacity-55 disabled:cursor-not-allowed"
            value={notebook.language.name}
            onChange={(e) => viewModel.changeLanguage(e.target.value)}
            aria-label="Notebook language"
            disabled={locked}
          >
            {viewModel.availableLanguages.map((lang) => (
              <option key={lang.name} value={lang.name}>
                {lang.version ? `${lang.name} (${lang.version})` : lang.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {locked ? (
        <div className="mx-4 mt-[10px] border border-gray-900 bg-[#f8f8f8] text-gray-900 rounded-lg px-[10px] py-2 text-[0.9rem]">
          {viewModel.preparationMessage ?? "Language is loading. Cells are temporarily disabled."}
        </div>
      ) : !viewModel.runtimeReady ? (
        <div className="mx-4 mt-[10px] border border-gray-200 bg-[#fafafa] text-gray-500 rounded-lg px-[10px] py-2 text-[0.9rem]">
          {viewModel.runtimeStatusMessage ?? "Selected language runtime is unavailable."}
        </div>
      ) : null}

      <div className="overflow-auto p-4 grid gap-[14px] content-start">
        <InsertBoundary
          index={0}
          locked={locked}
          onInsertCode={viewModel.insertCodeCell}
          onInsertMarkdown={viewModel.insertMarkdownCell}
        />

        {notebook.cells.map((cell) => {
          const index = notebook.getCellIndex(cell.id);
          return (
            <div key={cell.id} className="grid gap-[6px]">
              <CellView
                cell={cell}
                isSelected={cell.id === selectedCellId}
                isRunning={viewModel.executingCells.has(cell.id)}
                notebookLocked={locked}
                runtimeReady={viewModel.runtimeReady}
                onSelect={handleSelectCell}
                onChange={viewModel.updateCellContent}
                onSetEditing={viewModel.setCellEditing}
                onRun={viewModel.runCell}
                onClearOutput={viewModel.clearCellOutput}
                onMoveUp={viewModel.moveCellUp}
                onMoveDown={viewModel.moveCellDown}
                onDelete={viewModel.deleteCell}
              />
              <InsertBoundary
                index={index + 1}
                locked={locked}
                onInsertCode={viewModel.insertCodeCell}
                onInsertMarkdown={viewModel.insertMarkdownCell}
              />
            </div>
          );
        })}
      </div>
    </main>
  );
}

interface InsertBoundaryProps {
  index: number;
  locked: boolean;
  onInsertCode: (index: number) => void;
  onInsertMarkdown: (index: number) => void;
}

function InsertBoundary({ index, locked, onInsertCode, onInsertMarkdown }: InsertBoundaryProps) {
  return (
    <div className="group relative h-6 flex items-center justify-center">
      <div className="absolute inset-x-0 border-t border-transparent transition-colors group-hover:border-[#c8d7ef] group-focus-within:border-[#c8d7ef]" />
      <div className="relative flex gap-[10px] justify-center opacity-0 pointer-events-none translate-y-[2px] transition-[opacity,transform] duration-[120ms] ease-[ease] group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0">
        <button
          type="button"
          className="border border-gray-200 bg-white text-gray-900 rounded-full py-[6px] px-[14px] cursor-pointer font-medium hover:border-gray-900 disabled:opacity-55 disabled:cursor-not-allowed"
          disabled={locked}
          onClick={() => onInsertCode(index)}
        >
          + Code
        </button>
        <button
          type="button"
          className="border border-gray-200 bg-white text-gray-900 rounded-full py-[6px] px-[14px] cursor-pointer font-medium hover:border-gray-900 disabled:opacity-55 disabled:cursor-not-allowed"
          disabled={locked}
          onClick={() => onInsertMarkdown(index)}
        >
          + Text
        </button>
      </div>
    </div>
  );
}
