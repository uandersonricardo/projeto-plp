import type { WorkspaceViewModel } from "../../view-models/useWorkspaceViewModel";

interface WorkspaceSidebarViewProps {
  viewModel: WorkspaceViewModel;
}

export function WorkspaceSidebarView({ viewModel }: WorkspaceSidebarViewProps) {
  return (
    <aside className="bg-white border border-gray-200 rounded-[10px] h-full flex flex-col overflow-hidden min-h-0">
      <div className="flex items-center justify-between p-[14px] border-b border-gray-200 font-semibold">
        <h2 className="m-0 text-[0.9rem] uppercase tracking-[0.04em] text-gray-500">Notebooks</h2>
        <button
          type="button"
          className="border border-gray-200 bg-white text-gray-900 w-7 h-7 rounded-md cursor-pointer hover:border-gray-900"
          onClick={viewModel.addNotebook}
        >
          +
        </button>
      </div>
      <ul className="list-none m-0 p-[10px] grid gap-2 flex-1 min-h-0 overflow-y-auto content-start">
        {viewModel.workspace.notebooks.map((notebook) => (
          <li key={notebook.id}>
            <button
              type="button"
              className={`w-full text-left border rounded-md p-[10px] cursor-pointer text-gray-900 bg-transparent${
                notebook.id === viewModel.selectedNotebookId
                  ? " border-gray-900 bg-gray-100"
                  : " border-gray-200"
              }`}
              onClick={() => viewModel.selectNotebook(notebook.id)}
            >
              {notebook.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
