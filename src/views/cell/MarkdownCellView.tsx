import type { ChangeEvent } from 'react';
import { MarkdownCell } from '../../models/Cell/MarkdownCell';

interface MarkdownCellViewProps {
  cell: MarkdownCell;
  onChange: (value: string) => void;
}

export function MarkdownCellView({ cell, onChange }: MarkdownCellViewProps) {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="markdown-cell">
      <textarea
        className="markdown-editor"
        value={cell.content}
        onChange={handleChange}
        spellCheck={false}
      />
      <div className="markdown-preview">
        {cell.content || 'Markdown preview'}
      </div>
    </div>
  );
}
