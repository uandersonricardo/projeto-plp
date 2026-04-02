import { useEffect, useMemo, useState } from "react";
import { Exp1 } from "../lib/plp/exp1";
import { Exp2 } from "../lib/plp/exp2";
import { CodeCell } from "../models/Cell/CodeCell";
import { MarkdownCell } from "../models/Cell/MarkdownCell";
import { Notebook } from "../models/Notebook/Notebook";
import type { CellOutput, Language } from "../models/types/execution";
import type { ID } from "../models/types/id";
import { Workspace } from "../models/Workspace/Workspace";
import { useNotebook } from "./notebook/hooks/useNotebook";
import { WorkspaceView } from "./workspace/components/WorkspaceView";
import { useWorkspace } from "./workspace/hooks/useWorkspace";

interface NotebookLanguage extends Language {
  runtimeReady: boolean;
  runtimeStatusMessage?: string;
  preparationMessage?: string;
  prepare?: () => Promise<void>;
}

const exp1Language: NotebookLanguage = {
  name: "Exp1",
  runtimeReady: true,
  preparationMessage: "Importing and compiling Exp1 runtime...",
  async prepare() {
    await Promise.resolve();
  },
  run(sourceCode: string): CellOutput {
    const start = performance.now();

    try {
      const evaluator = new Exp1();
      const result = evaluator.run(sourceCode);
      const executionTime = performance.now() - start;

      return {
        stdout: result == null ? "" : String(result),
        stderr: "",
        result,
        executionTime,
        success: true,
      };
    } catch (error) {
      const executionTime = performance.now() - start;
      return {
        stdout: "",
        stderr: error instanceof Error ? error.message : "Unknown execution error",
        executionTime,
        success: false,
      };
    }
  },
};

const exp2Language: NotebookLanguage = {
  name: "Exp2",
  runtimeReady: true,
  preparationMessage: "Importing and compiling Exp2 runtime...",
  runtimeStatusMessage: "Exp2 parser/interpreter entry point is not implemented in src/lib/plp/exp2 yet.",
  async prepare() {
    await Promise.resolve();
  },
  run(sourceCode: string): CellOutput {
    const start = performance.now();

    try {
      const evaluator = new Exp2();
      const result = evaluator.run(sourceCode);
      const executionTime = performance.now() - start;

      return {
        stdout: result == null ? "" : String(result),
        stderr: "",
        result,
        executionTime,
        success: true,
      };
    } catch (error) {
      const executionTime = performance.now() - start;
      return {
        stdout: "",
        stderr: error instanceof Error ? error.message : "Unknown execution error",
        executionTime,
        success: false,
      };
    }
  },
};

const func1Language: NotebookLanguage = {
  name: "Func1",
  runtimeReady: false,
  preparationMessage: "Importing and compiling Func1 runtime...",
  runtimeStatusMessage: "Func1 parser/interpreter entry point is not implemented in src/lib/plp/func1 yet.",
  async prepare() {
    await Promise.resolve();
  },
  run(): CellOutput {
    return {
      stdout: "",
      stderr: "Func1 parser/interpreter entry point is not implemented in src/lib/plp/func1 yet.",
      executionTime: 0,
      success: false,
    };
  },
};

const availableLanguages: NotebookLanguage[] = [exp1Language, exp2Language, func1Language];

function App() {
  const initialWorkspace = useMemo(() => {
    const starterNotebook = new Notebook("Notebook 1", exp1Language, [
      new MarkdownCell("# Welcome\nWrite notes and explanations here."),
      new CodeCell('5 + length("hello" ++ "world")'),
    ]);

    return new Workspace("PLP Workspace", [starterNotebook]);
  }, []);

  const { workspace, actions } = useWorkspace(initialWorkspace);
  const [selectedNotebookId, setSelectedNotebookId] = useState<ID>(workspace.notebooks[0].id);

  const selectedNotebook = workspace.getNotebook(selectedNotebookId) ?? workspace.notebooks[0];

  if (!selectedNotebook) {
    return <div className="empty-state">No notebooks available.</div>;
  }

  return (
    <NotebookController
      key={selectedNotebook.id}
      workspace={workspace}
      selectedNotebookId={selectedNotebookId}
      selectedNotebook={selectedNotebook}
      onRenameWorkspace={(name: string) => {
        actions.rename(name);
      }}
      onSelectNotebook={setSelectedNotebookId}
      onAddNotebook={() => {
        const nextCount = workspace.notebooks.length + 1;
        actions.addNotebook(`Notebook ${nextCount}`, exp1Language);
      }}
      availableLanguages={availableLanguages}
      onNotebookChange={(updatedNotebook) => {
        actions.updateNotebook(updatedNotebook.id, updatedNotebook);
      }}
    />
  );
}

interface NotebookControllerProps {
  workspace: Workspace;
  selectedNotebookId: ID;
  selectedNotebook: Notebook;
  onRenameWorkspace: (name: string) => void;
  onSelectNotebook: (notebookId: ID) => void;
  onAddNotebook: () => void;
  availableLanguages: NotebookLanguage[];
  onNotebookChange: (notebook: Notebook) => void;
}

function NotebookController({
  workspace,
  selectedNotebookId,
  selectedNotebook,
  onRenameWorkspace,
  onSelectNotebook,
  onAddNotebook,
  availableLanguages,
  onNotebookChange,
}: NotebookControllerProps) {
  const { notebook, executingCells, actions } = useNotebook(selectedNotebook);
  const [isPreparingLanguage, setIsPreparingLanguage] = useState(false);
  const [preparationMessage, setPreparationMessage] = useState<string | undefined>();
  const selectedLanguage = availableLanguages.find((item) => item.name === notebook.language.name);
  const runtimeReady = selectedLanguage?.runtimeReady ?? false;

  useEffect(() => {
    onNotebookChange(notebook);
  }, [notebook, onNotebookChange]);

  return (
    <WorkspaceView
      workspace={workspace}
      selectedNotebookId={selectedNotebookId}
      selectedNotebook={notebook}
      executingCells={executingCells}
      runtimeReady={runtimeReady}
      runtimeStatusMessage={selectedLanguage?.runtimeStatusMessage}
      notebookLocked={isPreparingLanguage}
      notebookLockMessage={preparationMessage}
      onSelectNotebook={onSelectNotebook}
      onAddNotebook={onAddNotebook}
      onRenameWorkspace={onRenameWorkspace}
      onInsertCodeCell={(index: number) => {
        if (isPreparingLanguage) return;
        actions.insertCell(new CodeCell(""), index);
      }}
      onInsertMarkdownCell={(index: number) => {
        if (isPreparingLanguage) return;
        actions.insertCell(new MarkdownCell(""), index);
      }}
      onRenameNotebook={(name: string) => {
        if (isPreparingLanguage) return;
        actions.rename(name);
      }}
      availableLanguages={availableLanguages}
      selectedLanguageName={notebook.language.name}
      onChangeLanguage={async (languageName: string) => {
        const language = availableLanguages.find((item) => item.name === languageName);
        if (!language) return;
        if (language.name === notebook.language.name) return;

        setPreparationMessage(language.preparationMessage ?? `Importing and compiling ${language.name} runtime...`);
        setIsPreparingLanguage(true);

        try {
          await language.prepare?.();
          actions.setLanguage(language);
        } finally {
          setIsPreparingLanguage(false);
          setPreparationMessage(undefined);
        }
      }}
      onChangeCellContent={(cellId: ID, content: string) => {
        if (isPreparingLanguage) return;
        actions.updateCell(cellId, content);
      }}
      onSetCellEditing={(cellId: ID, isEditing: boolean) => {
        if (isPreparingLanguage) return;
        actions.setCellEditing(cellId, isEditing);
      }}
      onRunCell={async (cellId: ID) => {
        if (isPreparingLanguage || !runtimeReady) return;
        await actions.runCell(cellId);
      }}
      onClearCellOutput={(cellId: ID) => {
        if (isPreparingLanguage) return;
        actions.clearCellOutput(cellId);
      }}
      onMoveCellUp={(cellId: ID) => {
        if (isPreparingLanguage) return;
        actions.moveUp(cellId);
      }}
      onMoveCellDown={(cellId: ID) => {
        if (isPreparingLanguage) return;
        actions.moveDown(cellId);
      }}
      onDeleteCell={(cellId: ID) => {
        if (isPreparingLanguage) return;
        actions.removeCell(cellId);
      }}
    />
  );
}

export default App;
