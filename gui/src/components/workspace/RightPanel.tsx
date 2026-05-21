import { useWorkspaceStore } from "../../contexts/workspace-store-context";
import { CodeCell } from "../../models/cell/CodeCell";

export function RightPanel() {
  const store = useWorkspaceStore();
  const workspace = store((state) => state.workspace);
  const selectedNotebookId = store((state) => state.selectedNotebookId);
  const selectedCellIds = store((state) => state.selectedCellIds);

  const notebook = selectedNotebookId ? workspace.getNotebook(selectedNotebookId) : undefined;
  const selectedCellId = selectedNotebookId ? selectedCellIds[selectedNotebookId] : undefined;
  const selectedCell = notebook && selectedCellId ? notebook.getCell(selectedCellId) : undefined;
  const rawCompilationEnv = selectedCell instanceof CodeCell ? selectedCell.output?.compilationEnv : undefined;
  let compilationEnv: unknown = undefined;
  if (rawCompilationEnv) {
    try {
      compilationEnv = typeof rawCompilationEnv === "string" ? JSON.parse(rawCompilationEnv) : rawCompilationEnv;
    } catch (e) {
      compilationEnv = rawCompilationEnv;
    }
  }

  const renderCompilationEnv = () => {
    if (compilationEnv == null) return null;

    if (Array.isArray(compilationEnv)) {
      return (
        <div className="space-y-3">
          {compilationEnv.map((frame, index) => {
            const entries = Object.entries(frame as Record<string, unknown>);
            return (
              <div key={index} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <div className="mb-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Scope {index + 1}
                </div>
                {entries.length > 0 ? (
                  <div className="space-y-2">
                    {entries.map(([name, value]) => (
                      <div key={name} className="flex items-start justify-between gap-3 rounded-sm bg-white px-3 py-2 text-sm">
                        <span className="font-mono text-slate-700">{name}</span>
                        <span className="font-mono text-slate-500">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="font-mono text-sm text-slate-400">{`{}`}</div>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    if (typeof compilationEnv === "object") {
      return (
        <pre className="m-0 p-2 rounded-md font-mono text-[0.8rem] whitespace-pre-wrap bg-[#f8fafc] text-gray-800">
          {JSON.stringify(compilationEnv, null, 2)}
        </pre>
      );
    }

    return <pre className="m-0 p-2 rounded-md font-mono text-[0.8rem] whitespace-pre-wrap bg-[#f8fafc] text-gray-800">{String(compilationEnv)}</pre>;
  };

  return (
    <div className="bg-white rounded-2xl h-full flex flex-col overflow-hidden min-h-0">
      <div className="flex items-center justify-between p-[14px] border-b border-gray-200">
        <h2>Debugger</h2>
      </div>
      <div className="p-[14px] flex-1 min-h-0 overflow-auto">
        {compilationEnv ? renderCompilationEnv() : (
          <span className="block text-center text-sm text-gray-400 p-4">
            Run a code cell to view compilation env output.
          </span>
        )}
      </div>
    </div>
  );
}
