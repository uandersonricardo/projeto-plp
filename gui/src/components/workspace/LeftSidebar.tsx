import { FiBook, FiCode, FiFile } from "react-icons/fi";
import { useWorkspace } from "../../hooks/useWorkspace";

export function LeftSidebar() {
  const { addNotebook, workspace, selectedNotebookId, selectNotebook } = useWorkspace();

  return (
    <aside className="bg-white rounded-2xl h-full flex flex-col overflow-hidden min-h-0">
      <div className="flex items-center justify-between p-[14px] border-b border-gray-200">
        <h2>Notebooks</h2>
        <button
          type="button"
          className="border border-gray-200 bg-white text-gray-900 w-7 h-7 rounded-md cursor-pointer hover:bg-gray-100"
          onClick={addNotebook}
        >
          +
        </button>
      </div>
      <ul className="list-none m-0 p-[10px] grid gap-2 flex-1 min-h-0 overflow-y-auto content-start">
        {workspace.notebooks.map((notebook) => (
          <li key={notebook.id}>
            <button
              type="button"
              className={`w-full flex items-center gap-3 text-left border rounded-lg px-3 py-2 cursor-pointer text-gray-900 hover:border-gray-200 ${
                notebook.id === selectedNotebookId ? "border-gray-100 bg-gray-100" : "border-white"
              }`}
              onClick={() => selectNotebook(notebook.id)}
            >
              <FiCode className="text-gray-500" />
              {notebook.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
