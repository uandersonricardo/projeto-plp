import { useWorkspaceStore } from "../contexts/workspace-store-context";
import type { ID } from "../models/types/id";

export function useWorkspace() {
  const store = useWorkspaceStore();

  const workspace = store((state) => state.workspace);
  const availableLanguages = store((state) => state.availableLanguages);
  const selectedNotebookId = store((state) => state.selectedNotebookId);
  const selectedNotebook = store((state) => state.getSelectedNotebook());

  const selectNotebook = store((state) => state.selectNotebook);
  const addNotebook = store((state) => state.addNotebook);
  const removeNotebook = store((state) => state.removeNotebook);
  const renameWorkspace = store((state) => state.renameWorkspace);

  return {
    workspace,
    availableLanguages,
    selectedNotebookId,
    selectedNotebook,
    selectNotebook: (id: ID) => selectNotebook(id),
    addNotebook: () => addNotebook(),
    removeNotebook: (notebookId: ID) => removeNotebook(notebookId),
    renameWorkspace: (name: string) => renameWorkspace(name),
  };
}
