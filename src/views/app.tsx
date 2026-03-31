import { useEffect, useMemo, useState } from 'react';
import { Exp1 } from '../lib/plp/exp1';
import { CodeCell } from '../models/Cell/CodeCell';
import { MarkdownCell } from '../models/Cell/MarkdownCell';
import { Notebook } from '../models/Notebook/Notebook';
import { Workspace } from '../models/Workspace/Workspace';
import type { ID } from '../models/types/id';
import type { CellOutput, Language } from '../models/types/execution';
import { useNotebook } from './notebook/useNotebook';
import { WorkspaceView } from './workspace/WorkspaceView';
import { useWorkspace } from './workspace/useWorkspace';

const exp1Language: Language = {
  name: 'Exp1',
  run(sourceCode: string): CellOutput {
    const start = performance.now();

    try {
      const evaluator = new Exp1();
      const result = evaluator.run(sourceCode);
      const executionTime = performance.now() - start;

      return {
        stdout: result == null ? '' : String(result),
        stderr: '',
        result,
        executionTime,
        success: true,
      };
    } catch (error) {
      const executionTime = performance.now() - start;
      return {
        stdout: '',
        stderr: error instanceof Error ? error.message : 'Unknown execution error',
        executionTime,
        success: false,
      };
    }
  },
};

function App() {
  const initialWorkspace = useMemo(() => {
    const starterNotebook = new Notebook('Notebook 1', exp1Language, [
      new MarkdownCell('# Welcome\nWrite notes and explanations here.'),
      new CodeCell('5 + length("hello" ++ "world")'),
    ]);

    return new Workspace('PLP Workspace', [starterNotebook]);
  }, []);

  const { workspace, actions } = useWorkspace(initialWorkspace);
  const [selectedNotebookId, setSelectedNotebookId] = useState<ID>(workspace.notebooks[0].id);

  const selectedNotebook = workspace.getNotebook(selectedNotebookId) ?? workspace.notebooks[0];

  if (!selectedNotebook) {
    return <div className="empty-state">No notebooks available.</div>;
  }

  return (
    <NotebookController
      key={selectedNotebook.id}
      workspace={workspace}
      selectedNotebookId={selectedNotebookId}
      selectedNotebook={selectedNotebook}
      onSelectNotebook={setSelectedNotebookId}
      onAddNotebook={() => {
        const nextCount = workspace.notebooks.length + 1;
        actions.addNotebook(`Notebook ${nextCount}`, exp1Language);
      }}
      onNotebookChange={(updatedNotebook) => {
        actions.updateNotebook(updatedNotebook.id, updatedNotebook);
      }}
    />
  );
}

interface NotebookControllerProps {
  workspace: Workspace;
  selectedNotebookId: ID;
  selectedNotebook: Notebook;
  onSelectNotebook: (notebookId: ID) => void;
  onAddNotebook: () => void;
  onNotebookChange: (notebook: Notebook) => void;
}

function NotebookController({
  workspace,
  selectedNotebookId,
  selectedNotebook,
  onSelectNotebook,
  onAddNotebook,
  onNotebookChange,
}: NotebookControllerProps) {
  const { notebook, executingCells, actions } = useNotebook(selectedNotebook);

  useEffect(() => {
    onNotebookChange(notebook);
  }, [notebook, onNotebookChange]);

  return (
    <WorkspaceView
      workspace={workspace}
      selectedNotebookId={selectedNotebookId}
      selectedNotebook={notebook}
      executingCells={executingCells}
      onSelectNotebook={onSelectNotebook}
      onAddNotebook={onAddNotebook}
      onAddCodeCell={() => {
        actions.addCell(new CodeCell(''));
      }}
      onAddMarkdownCell={() => {
        actions.addCell(new MarkdownCell(''));
      }}
      onRenameNotebook={(name: string) => {
        actions.rename(name);
      }}
      onChangeCellContent={(cellId: ID, content: string) => {
        actions.updateCell(cellId, content);
      }}
      onRunCell={async (cellId: ID) => {
        await actions.runCell(cellId);
      }}
      onMoveCellUp={(cellId: ID) => {
        actions.moveUp(cellId);
      }}
      onMoveCellDown={(cellId: ID) => {
        actions.moveDown(cellId);
      }}
      onDeleteCell={(cellId: ID) => {
        actions.removeCell(cellId);
      }}
    />
  );
}

export default App;
