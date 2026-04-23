import { create } from "zustand";

import { CodeCell } from "../models/cell/CodeCell";
import { MarkdownCell } from "../models/cell/MarkdownCell";
import { Notebook } from "../models/notebook/Notebook";
import type { CellOutput, Language } from "../models/types/execution";
import type { ID } from "../models/types/id";
import type { Workspace } from "../models/workspace/Workspace";
import type { NotebookLanguage } from "../config/languages";

/** Creates a new instance with the same prototype, forcing Zustand to detect the change. */
function clone<T extends object>(instance: T): T {
  return Object.assign(Object.create(Object.getPrototypeOf(instance)), instance);
}

export interface WorkspaceStore {
  workspace: Workspace;
  availableLanguages: NotebookLanguage[];
  selectedNotebookId: ID;
  selectedCellIds: Record<ID, ID | undefined>;
  executionCounters: Record<ID, number>;

  // Workspace
  selectNotebook: (id: ID) => void;
  addNotebook: () => void;
  removeNotebook: (notebookId: ID) => void;
  renameWorkspace: (name: string) => void;

  // Notebook
  renameNotebook: (notebookId: ID, name: string) => void;
  setNotebookLanguage: (notebookId: ID, language: Language) => void;
  selectCell: (notebookId: ID, cellId: ID) => void;

  // Cells
  insertCodeCell: (notebookId: ID, index: number) => void;
  insertMarkdownCell: (notebookId: ID, index: number) => void;
  updateCellContent: (notebookId: ID, cellId: ID, content: string) => void;
  setCellEditing: (notebookId: ID, cellId: ID, isEditing: boolean) => void;
  setCellOutput: (notebookId: ID, cellId: ID, output: CellOutput) => void;
  clearCellOutput: (notebookId: ID, cellId: ID) => void;
  moveCellUp: (notebookId: ID, cellId: ID) => void;
  moveCellDown: (notebookId: ID, cellId: ID) => void;
  deleteCell: (notebookId: ID, cellId: ID) => void;

  // Selectors
  getSelectedNotebook: () => Notebook | undefined;
}

export function createWorkspaceStore(initialWorkspace: Workspace, availableLanguages: NotebookLanguage[]) {
  return create<WorkspaceStore>()((set, get) => ({
    workspace: initialWorkspace,
    availableLanguages: availableLanguages,
    selectedNotebookId: initialWorkspace.notebooks[0]?.id,
    selectedCellIds: Object.fromEntries(
      initialWorkspace.notebooks.map((nb) => [nb.id, nb.cells[0]?.id]),
    ),
    executionCounters: Object.fromEntries(
      initialWorkspace.notebooks.map((nb) => [nb.id, 0]),
    ),

    selectNotebook: (id) => set({ selectedNotebookId: id }),

    addNotebook: () =>
      set((state) => {
        const nextName = `Notebook ${state.workspace.notebooks.length + 1}`;
        state.workspace.addNotebook(new Notebook(nextName, availableLanguages[0]));
        return { workspace: clone(state.workspace) };
      }),

    removeNotebook: (notebookId) =>
      set((state) => {
        state.workspace.removeNotebook(notebookId);
        const stillSelected = state.workspace.notebooks.some((nb) => nb.id === state.selectedNotebookId);
        const { [notebookId]: _dropped, ...remainingCellIds } = state.selectedCellIds;
        return {
          workspace: clone(state.workspace),
          selectedNotebookId: stillSelected
            ? state.selectedNotebookId
            : (state.workspace.notebooks[0]?.id ?? state.selectedNotebookId),
          selectedCellIds: remainingCellIds,
        };
      }),

    renameWorkspace: (name) =>
      set((state) => {
        state.workspace.rename(name);
        return { workspace: clone(state.workspace) };
      }),

    renameNotebook: (notebookId, name) =>
      set((state) => {
        const notebook = state.workspace.getNotebook(notebookId);
        if (!notebook) return state;
        state.workspace.updateNotebook(notebookId, notebook.rename(name));
        return { workspace: clone(state.workspace) };
      }),

    setNotebookLanguage: (notebookId, language) =>
      set((state) => {
        const notebook = state.workspace.getNotebook(notebookId);
        if (!notebook) return state;
        state.workspace.updateNotebook(notebookId, notebook.setLanguage(language));
        return { workspace: clone(state.workspace) };
      }),

    selectCell: (notebookId, cellId) =>
      set((state) => {
        const prevCellId = state.selectedCellIds[notebookId];
        const updatedCellIds = { ...state.selectedCellIds, [notebookId]: cellId };

        if (prevCellId && prevCellId !== cellId) {
          const notebook = state.workspace.getNotebook(notebookId);
          const prev = notebook?.getCell(prevCellId);
          if (prev instanceof MarkdownCell && prev.isEditing) {
            prev.setEditing(false);
            notebook!.updateCell(prevCellId, clone(prev));
            state.workspace.updateNotebook(notebookId, clone(notebook!));
            return { workspace: clone(state.workspace), selectedCellIds: updatedCellIds };
          }
        }

        return { selectedCellIds: updatedCellIds };
      }),

    insertCodeCell: (notebookId, index) =>
      set((state) => {
        const notebook = state.workspace.getNotebook(notebookId);
        if (!notebook) return state;
        notebook.insertCell(new CodeCell(""), index);
        state.workspace.updateNotebook(notebookId, clone(notebook));
        return { workspace: clone(state.workspace) };
      }),

    insertMarkdownCell: (notebookId, index) =>
      set((state) => {
        const notebook = state.workspace.getNotebook(notebookId);
        if (!notebook) return state;
        notebook.insertCell(new MarkdownCell(""), index);
        state.workspace.updateNotebook(notebookId, clone(notebook));
        return { workspace: clone(state.workspace) };
      }),

    updateCellContent: (notebookId, cellId, content) =>
      set((state) => {
        const notebook = state.workspace.getNotebook(notebookId);
        if (!notebook) return state;
        const cell = notebook.getCell(cellId);
        if (!cell) return state;
        cell.updateContent(content);
        notebook.updateCell(cellId, clone(cell));
        state.workspace.updateNotebook(notebookId, clone(notebook));
        return { workspace: clone(state.workspace) };
      }),

    setCellEditing: (notebookId, cellId, isEditing) =>
      set((state) => {
        const notebook = state.workspace.getNotebook(notebookId);
        if (!notebook) return state;
        const cell = notebook.getCell(cellId);
        if (!cell) return state;
        cell.setEditing(isEditing);
        notebook.updateCell(cellId, clone(cell));
        state.workspace.updateNotebook(notebookId, clone(notebook));
        return { workspace: clone(state.workspace) };
      }),

    setCellOutput: (notebookId, cellId, output) =>
      set((state) => {
        const notebook = state.workspace.getNotebook(notebookId);
        if (!notebook) return state;
        const cell = notebook.getCell(cellId);
        if (!(cell instanceof CodeCell)) return state;
        const executionOrder = (state.executionCounters[notebookId] ?? 0) + 1;
        cell.withOutput(output, executionOrder);
        notebook.updateCell(cellId, clone(cell));
        state.workspace.updateNotebook(notebookId, clone(notebook));
        return {
          workspace: clone(state.workspace),
          executionCounters: { ...state.executionCounters, [notebookId]: executionOrder },
        };
      }),

    clearCellOutput: (notebookId, cellId) =>
      set((state) => {
        const notebook = state.workspace.getNotebook(notebookId);
        if (!notebook) return state;
        const cell = notebook.getCell(cellId);
        if (!(cell instanceof CodeCell)) return state;
        cell.clearOutput();
        notebook.updateCell(cellId, clone(cell));
        state.workspace.updateNotebook(notebookId, clone(notebook));
        return { workspace: clone(state.workspace) };
      }),

    moveCellUp: (notebookId, cellId) =>
      set((state) => {
        const notebook = state.workspace.getNotebook(notebookId);
        if (!notebook) return state;
        notebook.moveCellUp(cellId);
        state.workspace.updateNotebook(notebookId, clone(notebook));
        return { workspace: clone(state.workspace) };
      }),

    moveCellDown: (notebookId, cellId) =>
      set((state) => {
        const notebook = state.workspace.getNotebook(notebookId);
        if (!notebook) return state;
        notebook.moveCellDown(cellId);
        state.workspace.updateNotebook(notebookId, clone(notebook));
        return { workspace: clone(state.workspace) };
      }),

    deleteCell: (notebookId, cellId) =>
      set((state) => {
        const notebook = state.workspace.getNotebook(notebookId);
        if (!notebook) return state;
        notebook.removeCell(cellId);
        state.workspace.updateNotebook(notebookId, clone(notebook));
        return { workspace: clone(state.workspace) };
      }),

    getSelectedNotebook: () => {
      const { workspace, selectedNotebookId } = get();
      return workspace.getNotebook(selectedNotebookId);
    },
  }));
}

export type WorkspaceStoreInstance = ReturnType<typeof createWorkspaceStore>;
