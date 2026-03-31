/**
 * React hook for managing workspace state
 * Use case: Workspace management and notebook operations
 */

import { useState, useCallback } from 'react';
import { Notebook } from '../../../models/Notebook/Notebook';
import { Workspace } from '../../../models/Workspace/Workspace';
import type { ID } from '../../../models/types/id';
import type { Language } from '../../../models/types/execution';

export interface UseWorkspaceReturnType {
  workspace: Workspace;
  actions: {
    addNotebook: (name: string, language: Language) => void;
    removeNotebook: (notebookId: ID) => void;
    updateNotebook: (notebookId: ID, updatedNotebook: Notebook) => void;
    rename: (name: string) => void;
  };
}

/**
 * Hook for managing workspace state
 */
export function useWorkspace(initialWorkspace: Workspace): UseWorkspaceReturnType {
  const [workspace, setWorkspace] = useState(initialWorkspace);

  const addNotebook = useCallback((name: string, language: Language) => {
    const newNotebook = new Notebook(name, language);
    setWorkspace((prev: Workspace) => prev.addNotebook(newNotebook));
  }, []);

  const removeNotebook = useCallback((notebookId: ID) => {
    setWorkspace((prev: Workspace) => prev.removeNotebook(notebookId));
  }, []);

  const updateNotebook = useCallback((notebookId: ID, updatedNotebook: Notebook) => {
    setWorkspace((prev: Workspace) => prev.updateNotebook(notebookId, updatedNotebook));
  }, []);

  const rename = useCallback((name: string) => {
    setWorkspace((prev: Workspace) => prev.rename(name));
  }, []);

  return {
    workspace,
    actions: {
      addNotebook,
      removeNotebook,
      updateNotebook,
      rename,
    },
  };
}
