import type { Workspace } from '../../../models/Workspace/Workspace';
import type { ID } from '../../../models/types/id';

interface WorkspaceSidebarViewProps {
  workspace: Workspace;
  selectedNotebookId: ID;
  onSelectNotebook: (notebookId: ID) => void;
  onAddNotebook: () => void;
}

export function WorkspaceSidebarView({
  workspace,
  selectedNotebookId,
  onSelectNotebook,
  onAddNotebook,
}: WorkspaceSidebarViewProps) {

  return (
    <aside className="workspace-sidebar">
      <div className="sidebar-header">
        <h2>Notebooks</h2>
        <button type="button" className="sidebar-add" onClick={onAddNotebook}>
          +
        </button>
      </div>
      <ul className="notebook-list">
        {workspace.notebooks.map((notebook) => (
          <li key={notebook.id}>
            <button
              type="button"
              className={notebook.id === selectedNotebookId ? 'notebook-item active' : 'notebook-item'}
              onClick={() => onSelectNotebook(notebook.id)}
            >
              {notebook.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
