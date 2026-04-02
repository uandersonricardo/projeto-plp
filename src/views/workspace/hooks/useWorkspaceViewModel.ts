/**
 * Workspace view model hook
 * Use case: UI integration for workspace display
 */

import { useReducer } from "react";
import { Notebook } from "../../../models/Notebook/Notebook";
import type { Language } from "../../../models/types/execution";
import type { ID } from "../../../models/types/id";
import type { Workspace } from "../../../models/Workspace/Workspace";
import { type NotebookViewModel, useNotebookViewModel } from "../../notebook/hooks/useNotebookViewModel";

/**
 * Workspace view model for UI rendering
 */
export interface WorkspaceViewModel {
  id: ID;
  workspace: Workspace;
  notebooks: NotebookViewModel[];
  commands: {
    addNotebook?: (name: string, language: Language) => void;
    removeNotebook?: (notebookId: ID) => void;
    updateNotebook?: (notebookId: ID, notebook: Notebook) => void;
    rename?: (name: string) => void;
  };
}

/**
 * Reducer action types for workspace management
 */
export type WorkspaceAction =
  | { type: "ADD_NOTEBOOK"; payload: { name: string; language: Language } }
  | { type: "REMOVE_NOTEBOOK"; payload: { notebookId: ID } }
  | { type: "UPDATE_NOTEBOOK"; payload: { notebookId: ID; notebook: Notebook } }
  | { type: "RENAME_WORKSPACE"; payload: { name: string } };

/**
 * Reducer function for workspace operations
 */
export function workspaceReducer(state: Workspace, action: WorkspaceAction): Workspace {
  switch (action.type) {
    case "ADD_NOTEBOOK": {
      const newNotebook = new Notebook(action.payload.name, action.payload.language);
      return state.addNotebook(newNotebook);
    }
    case "REMOVE_NOTEBOOK":
      return state.removeNotebook(action.payload.notebookId);
    case "UPDATE_NOTEBOOK":
      return state.updateNotebook(action.payload.notebookId, action.payload.notebook);
    case "RENAME_WORKSPACE":
      return state.rename(action.payload.name);
    default:
      return state;
  }
}

/**
 * Hook to convert Workspace to WorkspaceViewModel
 */
export function useWorkspaceViewModel(
  initialWorkspace: Workspace,
  onWorkspaceChange?: (workspace: Workspace) => void,
): WorkspaceViewModel {
  const [workspace, dispatch] = useReducer(workspaceReducer, initialWorkspace);

  const notebookViewModels: NotebookViewModel[] = workspace.notebooks.map((notebook: Notebook) =>
    useNotebookViewModel(notebook, (updatedNotebook) => {
      const updatedWorkspace = workspace.updateNotebook(notebook.id, updatedNotebook);
      onWorkspaceChange?.(updatedWorkspace);
    }),
  );

  return {
    id: workspace.id,
    workspace,
    notebooks: notebookViewModels,
    commands: {
      addNotebook: (name: string, language: Language) => {
        dispatch({
          type: "ADD_NOTEBOOK",
          payload: { name, language },
        });
      },
      removeNotebook: (notebookId: ID) => {
        dispatch({
          type: "REMOVE_NOTEBOOK",
          payload: { notebookId },
        });
      },
      updateNotebook: (notebookId: ID, updatedNotebook: Notebook) => {
        dispatch({
          type: "UPDATE_NOTEBOOK",
          payload: { notebookId, notebook: updatedNotebook },
        });
      },
      rename: (name: string) => {
        dispatch({
          type: "RENAME_WORKSPACE",
          payload: { name },
        });
      },
    },
  };
}

/**
 * Hook using useReducer for workspace state
 */
export function useWorkspaceReducer(initialWorkspace: Workspace) {
  const [workspace, dispatch] = useReducer(workspaceReducer, initialWorkspace);

  return {
    workspace,
    dispatch,
  };
}
