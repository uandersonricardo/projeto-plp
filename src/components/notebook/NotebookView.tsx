import { useNotebook } from "../../hooks/useNotebook";
import { useWorkspace } from "../../hooks/useWorkspace";
import type { ID } from "../../models/types/id";
import { CellView } from "../cell/CellView";

interface NotebookViewProps {
  notebookId: ID;
}

export function NotebookView({ notebookId }: NotebookViewProps) {
  const { availableLanguages } = useWorkspace();
  const {
    notebook,
    isPreparingLanguage,
    preparationMessage,
    runtimeReady,
    runtimeStatusMessage,
    rename,
    changeLanguage,
    insertCodeCell,
    insertMarkdownCell,
  } = useNotebook(notebookId);

  const locked = isPreparingLanguage;

  return (
    <main className="bg-white rounded-2xl h-full flex flex-col overflow-hidden">
      <header className="p-[14px] border-b border-gray-200 flex items-center justify-between gap-3 shrink-0">
        <input
          className="border-0 text-[1.1rem] font-bold w-full text-gray-900 focus:outline-none disabled:opacity-55 disabled:cursor-not-allowed bg-transparent"
          value={notebook.name}
          onChange={(e) => rename(e.target.value)}
          aria-label="Notebook name"
          disabled={locked}
        />
        <div className="flex gap-2">
          <select
            className="border border-gray-200 bg-transparent text-gray-900 rounded-md py-2 px-[10px] focus:outline-0 focus:bg-gray-100 disabled:opacity-55 disabled:cursor-not-allowed"
            value={notebook.language.name}
            onChange={(e) => changeLanguage(e.target.value)}
            aria-label="Notebook language"
            disabled={locked}
          >
            {availableLanguages.map((lang) => (
              <option key={lang.name} value={lang.name}>
                {lang.version ? `${lang.name} (${lang.version})` : lang.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {locked ? (
        <div className="mx-4 mt-[10px] border border-gray-900 bg-[#f8f8f8] text-gray-900 rounded-lg px-[10px] py-2 text-[0.9rem]">
          {preparationMessage ?? "Language is loading. Cells are temporarily disabled."}
        </div>
      ) : !runtimeReady ? (
        <div className="mx-4 mt-[10px] border border-gray-200 bg-[#fafafa] text-gray-500 rounded-lg px-[10px] py-2 text-[0.9rem]">
          {runtimeStatusMessage ?? "Selected language runtime is unavailable."}
        </div>
      ) : null}

      <div className="overflow-auto p-4 grid gap-2 content-start flex-1">
        <InsertBoundary index={0} locked={locked} onInsertCode={insertCodeCell} onInsertMarkdown={insertMarkdownCell} />

        {notebook.cells.map((cell) => {
          const index = notebook.getCellIndex(cell.id);
          return (
            <div key={cell.id} className="flex flex-col gap-2">
              <CellView notebookId={notebookId} cellId={cell.id} />
              <InsertBoundary
                index={index + 1}
                locked={locked}
                onInsertCode={insertCodeCell}
                onInsertMarkdown={insertMarkdownCell}
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
    <div className="group relative h-2 flex items-center justify-center z-10">
      <div className="absolute inset-x-0 border-t border-transparent transition-colors group-hover:border-gray-200 group-focus-within:border-gray-200" />
      <div className="relative flex gap-[10px] justify-center opacity-0 pointer-events-none translate-y-[2px] transition-[opacity,transform] duration-[120ms] ease-[ease] group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0">
        <button
          type="button"
          className="text-sm border border-gray-200 bg-white text-gray-900 rounded-full px-4 py-1.5 cursor-pointer font-medium hover:bg-gray-100 disabled:opacity-55 disabled:cursor-not-allowed"
          disabled={locked}
          onClick={() => onInsertCode(index)}
        >
          + Code
        </button>
        <button
          type="button"
          className="text-sm border border-gray-200 bg-white text-gray-900 rounded-full px-4 py-1.5 cursor-pointer font-medium hover:bg-gray-100 disabled:opacity-55 disabled:cursor-not-allowed"
          disabled={locked}
          onClick={() => onInsertMarkdown(index)}
        >
          + Text
        </button>
      </div>
    </div>
  );
}
