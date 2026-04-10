import { useCallback, useState } from "react";
import { CodeCell } from "../models/cell/CodeCell";
import { MarkdownCell } from "../models/cell/MarkdownCell";
import { Notebook } from "../models/notebook/Notebook";
import type { CellOutput, Language } from "../models/types/execution";
import type { ID } from "../models/types/id";
import type { Workspace } from "../models/workspace/Workspace";

export interface NotebookLanguage extends Language {
  runtimeReady: boolean;
  runtimeStatusMessage?: string;
  preparationMessage?: string;
  prepare?: () => Promise<void>;
}

export interface WorkspaceViewModel {
  // State
  workspace: Workspace;
  selectedNotebook: Notebook;
  selectedNotebookId: ID;
  executingCells: Set<ID>;
  isPreparingLanguage: boolean;
  preparationMessage: string | undefined;
  runtimeReady: boolean;
  runtimeStatusMessage: string | undefined;
  availableLanguages: NotebookLanguage[];

  // Workspace
  renameWorkspace: (name: string) => void;
  addNotebook: () => void;
  selectNotebook: (id: ID) => void;

  // Notebook
  renameNotebook: (name: string) => void;
  changeLanguage: (languageName: string) => Promise<void>;
  insertCodeCell: (index: number) => void;
  insertMarkdownCell: (index: number) => void;

  // Cell
  updateCellContent: (cellId: ID, content: string) => void;
  setCellEditing: (cellId: ID, isEditing: boolean) => void;
  runCell: (cellId: ID) => Promise<void>;
  clearCellOutput: (cellId: ID) => void;
  moveCellUp: (cellId: ID) => void;
  moveCellDown: (cellId: ID) => void;
  deleteCell: (cellId: ID) => void;
}

export function useWorkspaceViewModel(
  initialWorkspace: Workspace,
  availableLanguages: NotebookLanguage[],
): WorkspaceViewModel {
  const [workspace, setWorkspace] = useState(initialWorkspace);
  const [selectedNotebookId, setSelectedNotebookId] = useState<ID>(initialWorkspace.notebooks[0].id);
  const [executingCells, setExecutingCells] = useState<Set<ID>>(new Set());
  const [isPreparingLanguage, setIsPreparingLanguage] = useState(false);
  const [preparationMessage, setPreparationMessage] = useState<string | undefined>();

  const selectedNotebook = workspace.getNotebook(selectedNotebookId) ?? workspace.notebooks[0];
  const selectedLanguage = availableLanguages.find((lang) => lang.name === selectedNotebook.language.name);
  const runtimeReady = selectedLanguage?.runtimeReady ?? false;
  const runtimeStatusMessage = selectedLanguage?.runtimeStatusMessage;

  const updateSelectedNotebook = useCallback(
    (fn: (notebook: Notebook) => Notebook) => {
      setWorkspace((prev) => {
        const notebook = prev.getNotebook(selectedNotebookId);
        if (!notebook) return prev;
        return prev.updateNotebook(selectedNotebookId, fn(notebook));
      });
    },
    [selectedNotebookId],
  );

  // Workspace actions
  const selectNotebook = useCallback((id: ID) => setSelectedNotebookId(id), []);

  const addNotebook = useCallback(() => {
    setWorkspace((prev) => {
      const nextName = `Notebook ${prev.notebooks.length + 1}`;
      return prev.addNotebook(new Notebook(nextName, availableLanguages[0]));
    });
  }, [availableLanguages]);

  const renameWorkspace = useCallback((name: string) => {
    setWorkspace((prev) => prev.rename(name));
  }, []);

  // Notebook actions
  const renameNotebook = useCallback(
    (name: string) => updateSelectedNotebook((nb) => nb.rename(name)),
    [updateSelectedNotebook],
  );

  const changeLanguage = useCallback(
    async (languageName: string) => {
      const language = availableLanguages.find((l) => l.name === languageName);
      if (!language || language.name === selectedNotebook.language.name) return;

      setPreparationMessage(language.preparationMessage ?? `Loading ${language.name}...`);
      setIsPreparingLanguage(true);

      try {
        await language.prepare?.();
        updateSelectedNotebook((nb) => nb.setLanguage(language));
      } finally {
        setIsPreparingLanguage(false);
        setPreparationMessage(undefined);
      }
    },
    [availableLanguages, selectedNotebook.language.name, updateSelectedNotebook],
  );

  const insertCodeCell = useCallback(
    (index: number) => {
      if (isPreparingLanguage) return;
      updateSelectedNotebook((nb) => nb.insertCell(new CodeCell(""), index));
    },
    [isPreparingLanguage, updateSelectedNotebook],
  );

  const insertMarkdownCell = useCallback(
    (index: number) => {
      if (isPreparingLanguage) return;
      updateSelectedNotebook((nb) => nb.insertCell(new MarkdownCell(""), index));
    },
    [isPreparingLanguage, updateSelectedNotebook],
  );

  // Cell actions
  const updateCellContent = useCallback(
    (cellId: ID, content: string) => {
      if (isPreparingLanguage) return;
      updateSelectedNotebook((nb) => {
        const cell = nb.getCell(cellId);
        if (!cell) return nb;
        return nb.updateCell(cellId, cell.updateContent(content));
      });
    },
    [isPreparingLanguage, updateSelectedNotebook],
  );

  const setCellEditing = useCallback(
    (cellId: ID, isEditing: boolean) => {
      if (isPreparingLanguage) return;
      updateSelectedNotebook((nb) => {
        const cell = nb.getCell(cellId);
        if (!cell) return nb;
        return nb.updateCell(cellId, cell.setEditing(isEditing));
      });
    },
    [isPreparingLanguage, updateSelectedNotebook],
  );

  const runCell = useCallback(
    async (cellId: ID) => {
      if (isPreparingLanguage || !runtimeReady) return;

      setExecutingCells((prev) => new Set(prev).add(cellId));

      try {
        const notebook = workspace.getNotebook(selectedNotebookId);
        if (!notebook) return;

        const cell = notebook.getCell(cellId);
        if (!(cell instanceof CodeCell)) return;

        const output: CellOutput = await notebook.language.run(cell.content);
        updateSelectedNotebook((nb) => nb.updateCell(cellId, cell.withOutput(output)));
      } finally {
        setExecutingCells((prev) => {
          const next = new Set(prev);
          next.delete(cellId);
          return next;
        });
      }
    },
    [isPreparingLanguage, runtimeReady, workspace, selectedNotebookId, updateSelectedNotebook],
  );

  const clearCellOutput = useCallback(
    (cellId: ID) => {
      if (isPreparingLanguage) return;
      updateSelectedNotebook((nb) => {
        const cell = nb.getCell(cellId);
        if (!(cell instanceof CodeCell)) return nb;
        return nb.updateCell(cellId, cell.clearOutput());
      });
    },
    [isPreparingLanguage, updateSelectedNotebook],
  );

  const moveCellUp = useCallback(
    (cellId: ID) => {
      if (isPreparingLanguage) return;
      updateSelectedNotebook((nb) => nb.moveCellUp(cellId));
    },
    [isPreparingLanguage, updateSelectedNotebook],
  );

  const moveCellDown = useCallback(
    (cellId: ID) => {
      if (isPreparingLanguage) return;
      updateSelectedNotebook((nb) => nb.moveCellDown(cellId));
    },
    [isPreparingLanguage, updateSelectedNotebook],
  );

  const deleteCell = useCallback(
    (cellId: ID) => {
      if (isPreparingLanguage) return;
      updateSelectedNotebook((nb) => nb.removeCell(cellId));
    },
    [isPreparingLanguage, updateSelectedNotebook],
  );

  return {
    workspace,
    selectedNotebook,
    selectedNotebookId,
    executingCells,
    isPreparingLanguage,
    preparationMessage,
    runtimeReady,
    runtimeStatusMessage,
    availableLanguages,
    selectNotebook,
    addNotebook,
    renameWorkspace,
    renameNotebook,
    changeLanguage,
    insertCodeCell,
    insertMarkdownCell,
    updateCellContent,
    setCellEditing,
    runCell,
    clearCellOutput,
    moveCellUp,
    moveCellDown,
    deleteCell,
  };
}
