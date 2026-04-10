import { Exp1 } from "./lib/plp/exp1";
import { Exp2 } from "./lib/plp/exp2";
import { CodeCell } from "./models/cell/CodeCell";
import { MarkdownCell } from "./models/cell/MarkdownCell";
import { Notebook } from "./models/notebook/Notebook";
import type { CellOutput } from "./models/types/execution";
import { Workspace } from "./models/workspace/Workspace";
import type { NotebookLanguage } from "./view-models/useWorkspaceViewModel";
import { useWorkspaceViewModel } from "./view-models/useWorkspaceViewModel";
import { WorkspaceView } from "./views/workspace/WorkspaceView";

const AVAILABLE_LANGUAGES: NotebookLanguage[] = [
  {
    name: "Exp1",
    runtimeReady: true,
    preparationMessage: "Importing and compiling Exp1 runtime...",
    async prepare() {
      await Promise.resolve();
    },
    run(sourceCode: string): CellOutput {
      const start = performance.now();
      try {
        const result = new Exp1().run(sourceCode);
        return {
          stdout: result == null ? "" : String(result),
          stderr: "",
          result,
          executionTime: performance.now() - start,
          success: true,
        };
      } catch (error) {
        return {
          stdout: "",
          stderr: error instanceof Error ? error.message : "Unknown execution error",
          executionTime: performance.now() - start,
          success: false,
        };
      }
    },
  },
  {
    name: "Exp2",
    runtimeReady: true,
    preparationMessage: "Importing and compiling Exp2 runtime...",
    async prepare() {
      await Promise.resolve();
    },
    run(sourceCode: string): CellOutput {
      const start = performance.now();
      try {
        const result = new Exp2().run(sourceCode);
        return {
          stdout: result == null ? "" : String(result),
          stderr: "",
          result,
          executionTime: performance.now() - start,
          success: true,
        };
      } catch (error) {
        return {
          stdout: "",
          stderr: error instanceof Error ? error.message : "Unknown execution error",
          executionTime: performance.now() - start,
          success: false,
        };
      }
    },
  },
  {
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
  },
];

const INITIAL_WORKSPACE = new Workspace("PLP Workspace", [
  new Notebook("Notebook 1", AVAILABLE_LANGUAGES[0], [
    new MarkdownCell("# Welcome\nWrite notes and explanations here."),
    new CodeCell('5 + length("hello" ++ "world")'),
  ]),
]);

function App() {
  const viewModel = useWorkspaceViewModel(INITIAL_WORKSPACE, AVAILABLE_LANGUAGES);

  if (!viewModel.selectedNotebook) {
    return <div className="empty-state">No notebooks available.</div>;
  }

  return <WorkspaceView viewModel={viewModel} />;
}

export default App;
