import { type ChangeEvent, type KeyboardEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CodeCell } from "../../../models/Cell/CodeCell";

interface CodeCellViewProps {
  cell: CodeCell;
  disabled: boolean;
  isRunning: boolean;
  onChange: (value: string) => void;
  onClearOutput: () => void;
  onRun: () => void;
}

export function CodeCellView({ cell, disabled, isRunning, onChange, onClearOutput, onRun }: CodeCellViewProps) {
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isOutputMenuOpen, setIsOutputMenuOpen] = useState(false);

  const outputText = cell.output?.success
    ? String(cell.output.result ?? cell.output.stdout ?? "")
    : (cell.output?.stderr ?? "");

  useLayoutEffect(() => {
    const textarea = editorRef.current;
    if (!textarea) return;
    textarea.style.height = "0px";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [cell.content]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  const handleEditorKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      if (!disabled && !isRunning) {
        onRun();
      }
    }
  };

  useEffect(() => {
    if (!isOutputMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setIsOutputMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isOutputMenuOpen]);

  const handleCopyOutput = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
    } catch {
      // Ignore copy failures (e.g., unavailable permissions in some environments).
    } finally {
      setIsOutputMenuOpen(false);
    }
  };

  const handleClearOutput = () => {
    onClearOutput();
    setIsOutputMenuOpen(false);
  };

  return (
    <div className="code-cell">
      <textarea
        ref={editorRef}
        className="code-editor"
        value={cell.content}
        onChange={handleChange}
        onKeyDown={handleEditorKeyDown}
        spellCheck={false}
        disabled={disabled}
      />
      {cell.output ? (
        <>
          <div className="cell-output-separator" />
          <div className="cell-output-shell">
            <div className="cell-output-menu-wrap" ref={menuRef}>
              <button
                type="button"
                className="output-menu-trigger"
                onClick={(event) => {
                  event.stopPropagation();
                  setIsOutputMenuOpen((prev) => !prev);
                }}
                aria-label="Output actions"
                title="Output actions"
              >
                ...
              </button>
              {isOutputMenuOpen ? (
                <div className="output-menu">
                  <button type="button" className="output-menu-item" onClick={handleCopyOutput}>
                    Copy output
                  </button>
                  <button type="button" className="output-menu-item" onClick={handleClearOutput}>
                    Clear output
                  </button>
                </div>
              ) : null}
            </div>

            <div className="cell-output">
              <pre className={cell.output.success ? "output-ok" : "output-error"}>{outputText}</pre>
            </div>
          </div>
        </>
      ) : isRunning ? (
        <div className="cell-output pending">Executing...</div>
      ) : null}
    </div>
  );
}
