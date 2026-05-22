import { type ChangeEvent, type KeyboardEvent, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { FiPlay } from "react-icons/fi";
import hljs from "highlight.js/lib/core";

import { useWorkspaceStore } from "../../contexts/workspace-store-context";
import type { CodeCell } from "../../models/cell/CodeCell";
import { escapeHtml } from "../../lib/utils";

interface CodeCellViewProps {
  cell: CodeCell;
  language: string;
  disabled: boolean;
  isRunning: boolean;
  runtimeReady: boolean;
  isSelected: boolean;
  onChange: (value: string) => void;
  onClearOutput: () => void;
  onRun: () => void;
}

export function CodeCellView({
  cell,
  language,
  disabled,
  isRunning,
  runtimeReady,
  isSelected,
  onChange,
  onClearOutput,
  onRun,
}: CodeCellViewProps) {
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isOutputMenuOpen, setIsOutputMenuOpen] = useState(false);
  const store = useWorkspaceStore();
  const activeSourceRange = store((state) => state.activeSourceRange);

  const outputText = cell.output?.success
    ? String(cell.output.result ?? cell.output.stdout ?? "")
    : (cell.output?.stderr ?? "");

  const highlighted = useMemo(() => {
    const content = cell.content + "\n";
    try {
      return hljs.highlight(content, { language: language.toLowerCase() }).value;
    } catch {
      return escapeHtml(content);
    }
  }, [cell.content, language]);

  useLayoutEffect(() => {
    const textarea = editorRef.current;
    if (!textarea) return;
    textarea.style.height = "0px";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [cell.content]);

  useEffect(() => {
    const textarea = editorRef.current;
    if (!textarea || !isSelected || !activeSourceRange) return;

    const toOffset = (line: number, column: number) => {
      const lines = cell.content.split("\n");
      const safeLine = Math.max(1, Math.min(line, lines.length || 1));
      let offset = 0;
      for (let i = 1; i < safeLine; i++) {
        offset += (lines[i - 1]?.length ?? 0) + 1;
      }
      offset += Math.max(0, column - 1);
      return offset;
    };

    const start = Math.min(toOffset(activeSourceRange.startLine, activeSourceRange.startColumn), cell.content.length);
    const end = Math.min(toOffset(activeSourceRange.endLine, activeSourceRange.endColumn + 1), cell.content.length);
    textarea.focus();
    textarea.setSelectionRange(start, Math.max(start, end));
  }, [activeSourceRange, cell.content, isSelected]);

  useEffect(() => {
    if (!isOutputMenuOpen) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOutputMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, [isOutputMenuOpen]);

  const handleCopyOutput = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
    } catch {
      // Ignore copy failures in restricted environments
    } finally {
      setIsOutputMenuOpen(false);
    }
  };

  const handleClearOutput = () => {
    onClearOutput();
    setIsOutputMenuOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      if (!disabled && !isRunning) onRun();
    }
  };

  const runDisabled = disabled || isRunning || !runtimeReady;
  const runTitle = disabled ? "Locked" : !runtimeReady ? "Runtime unavailable" : isRunning ? "Running..." : "Run";

  return (
    <div className="grid gap-2 min-w-0 w-full">
      <div className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-[0.625rem] items-start">
        <div className="relative flex justify-center items-start pt-2">
          <span className="font-mono text-[0.8rem] text-gray-500 select-none group-hover:invisible">
            [{cell.executionOrder ?? " "}]
          </span>
          <button
            type="button"
            className="absolute top-2 left-1/2 -translate-x-1/2 border border-gray-200 bg-white text-gray-900 w-7 h-7 p-0 inline-flex items-center justify-center text-[0.95rem] leading-none rounded-md cursor-pointer hover:bg-[#f5f5f5] disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:w-[14px] [&_svg]:h-[14px] invisible group-hover:visible"
            onClick={(e) => {
              e.stopPropagation();
              onRun();
            }}
            disabled={runDisabled}
            aria-label="Run cell"
            title={runTitle}
          >
            <FiPlay aria-hidden="true" />
          </button>
        </div>

        <div className={`relative${disabled ? " opacity-55" : ""}`}>
          <pre
            aria-hidden="true"
            className="w-full min-h-[calc(1.4em+20px)] rounded-[10px] p-[10px] leading-[1.4] font-mono text-[0.9rem] absolute inset-0 m-0 overflow-hidden pointer-events-none whitespace-pre-wrap break-words border-0 bg-transparent"
          >
            <code dangerouslySetInnerHTML={{ __html: highlighted }} />
          </pre>

          <textarea
            ref={editorRef}
            className="w-full min-h-[calc(1.4em+20px)] rounded-[10px] p-[10px] leading-[1.4] font-mono text-[0.9rem] relative border-0 outline-none resize-none overflow-hidden bg-transparent text-transparent caret-gray-900 focus:outline-none focus:shadow-none disabled:cursor-not-allowed"
            value={cell.content}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            disabled={disabled}
          />
        </div>
      </div>

      {cell.output ? (
        <>
          <div className="h-px bg-gray-200" />
          <div className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-[0.625rem] items-start min-w-0">
            <div className="relative flex justify-center pt-2" ref={menuRef}>
              <button
                type="button"
                className="border-0 bg-transparent text-gray-500 rounded-md px-[6px] py-[2px] cursor-pointer font-bold leading-none hover:bg-gray-100 hover:text-gray-900"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOutputMenuOpen((prev) => !prev);
                }}
                aria-label="Output actions"
                title="Output actions"
              >
                ...
              </button>
              {isOutputMenuOpen && (
                <div className="absolute top-[calc(100%+0.25rem)] left-0 min-w-[140px] p-[6px] border border-gray-200 rounded-md bg-white z-10 grid gap-1">
                  <button
                    type="button"
                    className="border-0 bg-transparent text-left px-2 py-[6px] rounded-md text-gray-900 cursor-pointer text-[0.86rem] hover:bg-gray-100 w-full"
                    onClick={handleCopyOutput}
                  >
                    Copy output
                  </button>
                  <button
                    type="button"
                    className="border-0 bg-transparent text-left px-2 py-[6px] rounded-md text-gray-900 cursor-pointer text-[0.86rem] hover:bg-gray-100 w-full"
                    onClick={handleClearOutput}
                  >
                    Clear output
                  </button>
                </div>
              )}
            </div>
            <div className="w-full min-w-0">
              <pre
                className={`m-0 p-2 rounded-md font-mono text-[0.85rem] whitespace-pre-wrap${cell.output.success ? " bg-[#effaf5] text-[#027a48]" : " bg-[#fff4f3] text-[#b42318]"}`}
              >
                {outputText}
              </pre>
            </div>
          </div>
        </>
      ) : isRunning ? (
        <div className="text-gray-500">Executing...</div>
      ) : null}
    </div>
  );
}
