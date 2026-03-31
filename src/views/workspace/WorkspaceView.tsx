import { NotebookView } from '../notebook/NotebookView';
import { WorkspaceSidebarView } from './WorkspaceSidebarView';
import { RightPanelView } from './RightPanelView';
import type { Workspace } from '../../models/Workspace/Workspace';
import type { Notebook } from '../../models/Notebook/Notebook';
import type { ID } from '../../models/types/id';

interface WorkspaceViewProps {
  workspace: Workspace;
  selectedNotebookId: ID;
  selectedNotebook: Notebook;
  executingCells: Set<ID>;
  onSelectNotebook: (notebookId: ID) => void;
  onAddNotebook: () => void;
  onAddCodeCell: () => void;
  onAddMarkdownCell: () => void;
  onRenameNotebook: (name: string) => void;
  onChangeCellContent: (cellId: ID, value: string) => void;
  onRunCell: (cellId: ID) => void;
  onMoveCellUp: (cellId: ID) => void;
  onMoveCellDown: (cellId: ID) => void;
  onDeleteCell: (cellId: ID) => void;
}

export function WorkspaceView({
  workspace,
  selectedNotebookId,
  selectedNotebook,
  executingCells,
  onSelectNotebook,
  onAddNotebook,
  onAddCodeCell,
  onAddMarkdownCell,
  onRenameNotebook,
  onChangeCellContent,
  onRunCell,
  onMoveCellUp,
  onMoveCellDown,
  onDeleteCell,
}: WorkspaceViewProps) {
  return (
    <div className="workspace-layout">
      <WorkspaceSidebarView
        workspace={workspace}
        selectedNotebookId={selectedNotebookId}
        onSelectNotebook={onSelectNotebook}
        onAddNotebook={onAddNotebook}
      />

      <NotebookView
        notebook={selectedNotebook}
        executingCells={executingCells}
        onAddCodeCell={onAddCodeCell}
        onAddMarkdownCell={onAddMarkdownCell}
        onRenameNotebook={onRenameNotebook}
        onChangeCellContent={onChangeCellContent}
        onRunCell={onRunCell}
        onMoveCellUp={onMoveCellUp}
        onMoveCellDown={onMoveCellDown}
        onDeleteCell={onDeleteCell}
      />

      <RightPanelView />
    </div>
  );
}
