import type { ChangeEvent } from 'react';
import { CodeCell } from '../../models/Cell/CodeCell';

interface CodeCellViewProps {
  cell: CodeCell;
  isRunning: boolean;
  onChange: (value: string) => void;
}

export function CodeCellView({ cell, isRunning, onChange }: CodeCellViewProps) {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="code-cell">
      <textarea
        className="code-editor"
        value={cell.content}
        onChange={handleChange}
        spellCheck={false}
      />
      {cell.output ? (
        <div className="cell-output">
          <div className="cell-output-header">Output</div>
          <pre className={cell.output.success ? 'output-ok' : 'output-error'}>
            {cell.output.success ? String(cell.output.result ?? cell.output.stdout ?? '') : cell.output.stderr}
          </pre>
        </div>
      ) : isRunning ? (
        <div className="cell-output pending">Executing...</div>
      ) : null}
    </div>
  );
}
