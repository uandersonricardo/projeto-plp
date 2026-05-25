import { useEffect, useRef, useState } from "react";
import { useWorkspaceStore } from "../../contexts/workspace-store-context";
import { CodeCell } from "../../models/cell/CodeCell";
import type { ScopeSnapshot } from "../../models/types/execution";

export function RightPanel() {
  const store = useWorkspaceStore();
  const workspace = store((state) => state.workspace);
  const selectedNotebookId = store((state) => state.selectedNotebookId);
  const selectedCellIds = store((state) => state.selectedCellIds);
  const setActiveSourceRange = store((state) => state.setActiveSourceRange);
  const activeSourceRange = store((state) => state.activeSourceRange);

  const notebook = selectedNotebookId ? workspace.getNotebook(selectedNotebookId) : undefined;
  const selectedCellId = selectedNotebookId ? selectedCellIds[selectedNotebookId] : undefined;
  const selectedCell = notebook && selectedCellId ? notebook.getCell(selectedCellId) : undefined;
  const debuggerCell = !(selectedCell instanceof CodeCell)
    ? undefined
    : selectedCell.output?.compilationEnv
      ? selectedCell
      : notebook?.cells
          .slice()
          .reverse()
          .find((cell): cell is CodeCell => cell instanceof CodeCell && Boolean(cell.output?.compilationEnv));
  const rawCompilationEnv = debuggerCell?.output?.compilationEnv;
  let compilationEnv: ScopeSnapshot[] | undefined = undefined;
  if (rawCompilationEnv) {
    try {
      const parsed = typeof rawCompilationEnv === "string" ? JSON.parse(rawCompilationEnv) : rawCompilationEnv;
      compilationEnv = Array.isArray(parsed) ? (parsed as ScopeSnapshot[]) : undefined;
    } catch (e) {
      compilationEnv = undefined;
    }
  }

  const debuggerCellCode = debuggerCell?.content;
  const debuggerCellRef = useRef(debuggerCell);
  debuggerCellRef.current = debuggerCell;

  const [compiledSnapshot, setCompiledSnapshot] = useState<{ cellId: string; content: string } | undefined>(undefined);

  useEffect(() => {
    if (rawCompilationEnv && debuggerCellRef.current) {
      setCompiledSnapshot({ cellId: debuggerCellRef.current.id, content: debuggerCellRef.current.content });
    } else {
      setCompiledSnapshot(undefined);
    }
  }, [rawCompilationEnv]);

  const isStale = Boolean(
    compilationEnv &&
      debuggerCell &&
      compiledSnapshot?.cellId === debuggerCell.id &&
      compiledSnapshot.content !== debuggerCell.content,
  );

  const renderCompilationEnv = () => {
    if (!compilationEnv) return null;

    if (isStale) {
      return (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
          Code has changed. Run the cell again to update the debugger.
        </div>
      );
    }

    const scopesInDisplayOrder = [...compilationEnv].reverse();

    return (
      <div className="space-y-3">
        {scopesInDisplayOrder.map((frame, index) => {
          const originalIndex = compilationEnv.length - index - 1;
          const entries = Object.entries(frame.bindings);
          const range = frame.sourceRange;
          return (
            <button
              key={`${originalIndex}-${range ? `${range.startLine}:${range.startColumn}` : "no-range"}`}
              type="button"
              className={`w-full rounded-md border p-3 text-left transition-colors hover:border-slate-400 hover:bg-slate-100 ${
                range &&
                activeSourceRange &&
                range.startLine === activeSourceRange.startLine &&
                range.startColumn === activeSourceRange.startColumn &&
                range.endLine === activeSourceRange.endLine &&
                range.endColumn === activeSourceRange.endColumn
                  ? "border-cyan-600 bg-cyan-50 ring-1 ring-cyan-600"
                  : "border-slate-200 bg-slate-50"
              }`}
              onClick={() => setActiveSourceRange(range, debuggerCell?.id)}
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Scope {originalIndex + 1}
                </div>
                {range && (
                  <div className="font-mono text-[0.72rem] text-slate-400">
                    {range.startLine}:{range.startColumn} - {range.endLine}:{range.endColumn}
                  </div>
                )}
              </div>
              {entries.length > 0 ? (
                <div className="space-y-2">
                  {entries.map(([name, value]) => (
                    <div
                      key={name}
                      className="flex items-start justify-between gap-3 rounded-sm bg-white px-3 py-2 text-sm"
                    >
                      <span className="font-mono text-slate-700">{name}</span>
                      <span className="font-mono text-slate-500">{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="font-mono text-sm text-slate-400">{`{}`}</div>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div data-debugger-panel="true" className="bg-white rounded-2xl h-full flex flex-col overflow-hidden min-h-0">
      <div className="flex items-center justify-between p-[14px] border-b border-gray-200">
        <h2>Debugger</h2>
      </div>
      <div className="p-[14px] flex-1 min-h-0 overflow-auto space-y-4">
        {debuggerCellCode ? (
          <section className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Cell [{debuggerCell?.executionOrder ?? " "}]
              </div>
              {isStale && <div className="text-[0.72rem] text-amber-600">run to refresh</div>}
            </div>
            <pre className="m-0 overflow-auto whitespace-pre-wrap break-words font-mono text-[0.82rem] leading-[1.5] text-slate-800">
              {debuggerCellCode}
            </pre>
          </section>
        ) : (
          <section className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <div className="text-sm text-slate-500">Select a code cell to inspect its source here.</div>
          </section>
        )}

        {compilationEnv ? (
          renderCompilationEnv()
        ) : (
          <span className="block text-center text-sm text-gray-400 p-4">
            Run a code cell to view compilation env output.
          </span>
        )}
      </div>
    </div>
  );
}
