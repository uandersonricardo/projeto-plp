import { type ChangeEvent, type KeyboardEvent, useLayoutEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import type { MarkdownCell } from "../../models/cell/MarkdownCell";

interface MarkdownCellViewProps {
  cell: MarkdownCell;
  disabled: boolean;
  onChange: (value: string) => void;
  onFinishEditing: () => void;
}

export function MarkdownCellView({ cell, disabled, onChange, onFinishEditing }: MarkdownCellViewProps) {
  const editorRef = useRef<HTMLTextAreaElement | null>(null);

  useLayoutEffect(() => {
    if (!cell.isEditing) return;
    const textarea = editorRef.current;
    if (!textarea) return;
    textarea.style.height = "0px";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [cell.isEditing]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      if (!disabled) onFinishEditing();
    }
  };

  if (!cell.isEditing) {
    return (
      <div className="">
        <div className="markdown-editor leading-[1.6] text-[#25344f] [&_h1]:my-1 [&_h2]:my-1 [&_h3]:my-1 [&_h4]:my-1 [&_h5]:my-1 [&_h6]:my-1">
          {cell.content ? <ReactMarkdown>{cell.content}</ReactMarkdown> : "Empty markdown cell"}
        </div>
      </div>
    );
  }

  return (
    <div className="p-0 bg-transparent">
      <textarea
        ref={editorRef}
        className="w-full min-h-[calc(1.4em+20px)] border-0 outline-none rounded-[10px] p-[10px] resize-none overflow-hidden leading-[1.4] font-mono text-[0.9rem] bg-transparent text-gray-900 focus:outline-none focus:shadow-none disabled:opacity-55 disabled:cursor-not-allowed"
        value={cell.content}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        disabled={disabled}
      />
    </div>
  );
}
