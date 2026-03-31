import { useLayoutEffect, useRef, type ChangeEvent, type KeyboardEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import { MarkdownCell } from '../../../models/Cell/MarkdownCell';

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
    textarea.style.height = '0px';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [cell.content, cell.isEditing]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  const handleEditorKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && event.shiftKey) {
      event.preventDefault();
      if (!disabled) {
        onFinishEditing();
      }
    }
  };

  if (!cell.isEditing) {
    return (
      <div className="markdown-view-shell">
        <div className="markdown-view">
          {cell.content ? <ReactMarkdown>{cell.content}</ReactMarkdown> : 'Empty markdown cell'}
        </div>
      </div>
    );
  }

  return (
    <div className="markdown-cell markdown-cell-editing">
      <textarea
        ref={editorRef}
        className="markdown-editor"
        value={cell.content}
        onChange={handleChange}
        onKeyDown={handleEditorKeyDown}
        spellCheck={false}
        disabled={disabled}
      />
    </div>
  );
}
