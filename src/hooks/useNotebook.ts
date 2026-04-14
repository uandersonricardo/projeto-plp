import { useState } from "react";

import type { ID } from "../models/types/id";
import { useWorkspaceStore } from "../contexts/workspace-store-context";
import { MarkdownCell } from "../models/cell/MarkdownCell";

export function useNotebook(notebookId: ID) {
  const store = useWorkspaceStore();

  const notebook = store((state) => state.workspace.getNotebook(notebookId));
  const availableLanguages = store((state) => state.availableLanguages);

  if (!notebook) throw new Error(`Notebook ${notebookId} not found`);

  const [isPreparingLanguage, setIsPreparingLanguage] = useState(false);
  const [preparationMessage, setPreparationMessage] = useState<string | undefined>();
  const [selectedCellId, setSelectedCellId] = useState<ID | undefined>(notebook.cells[0]?.id);

  const selectedLanguage = availableLanguages.find((lang) => lang.name === notebook.language.name);
  const runtimeReady = selectedLanguage?.runtimeReady ?? false;
  const runtimeStatusMessage = selectedLanguage?.runtimeStatusMessage;

  const renameNotebook = store((state) => state.renameNotebook);
  const setNotebookLanguage = store((state) => state.setNotebookLanguage);
  const insertCodeCell = store((state) => state.insertCodeCell);
  const insertMarkdownCell = store((state) => state.insertMarkdownCell);
  const setCellEditing = store((state) => state.setCellEditing);

  const changeLanguage = async (languageName: string) => {
    const language = availableLanguages.find((lang) => lang.name === languageName);
    if (!language || language.name === notebook.language.name) return;

    setPreparationMessage(language.preparationMessage ?? `Loading ${language.name}...`);
    setIsPreparingLanguage(true);

    try {
      await language.prepare?.();
      setNotebookLanguage(notebookId, language);
    } finally {
      setIsPreparingLanguage(false);
      setPreparationMessage(undefined);
    }
  };

  const selectCell = (notebookId: ID, cellId: ID) => {
    if (selectedCellId && selectedCellId !== cellId) {
      const prev = notebook.getCell(selectedCellId);
      if (prev instanceof MarkdownCell && prev.isEditing) {
        setCellEditing(notebookId, selectedCellId, false);
      }
    }

    setSelectedCellId(cellId);
  };

  return {
    notebook,
    isPreparingLanguage,
    preparationMessage,
    runtimeReady,
    runtimeStatusMessage,
    selectedCellId,
    rename: (name: string) => renameNotebook(notebookId, name),
    changeLanguage: (languageName: string) => changeLanguage(languageName),
    insertCodeCell: (index: number) => insertCodeCell(notebookId, index),
    insertMarkdownCell: (index: number) => insertMarkdownCell(notebookId, index),
    selectCell: (cellId: ID) => selectCell(notebookId, cellId),
  };
}
