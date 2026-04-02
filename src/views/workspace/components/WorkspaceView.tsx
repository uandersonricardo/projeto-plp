import { useEffect, useRef, useState } from "react";
import type { Notebook } from "../../../models/Notebook/Notebook";
import type { Language } from "../../../models/types/execution";
import type { ID } from "../../../models/types/id";
import type { Workspace } from "../../../models/Workspace/Workspace";
import { NotebookView } from "../../notebook/components/NotebookView";
import { RightPanelView } from "./RightPanelView";
import { WorkspaceSidebarView } from "./WorkspaceSidebarView";

interface WorkspaceViewProps {
  workspace: Workspace;
  selectedNotebookId: ID;
  selectedNotebook: Notebook;
  executingCells: Set<ID>;
  runtimeReady: boolean;
  runtimeStatusMessage?: string;
  notebookLocked: boolean;
  notebookLockMessage?: string;
  onSelectNotebook: (notebookId: ID) => void;
  onAddNotebook: () => void;
  onRenameWorkspace: (name: string) => void;
  onInsertCodeCell: (index: number) => void;
  onInsertMarkdownCell: (index: number) => void;
  onRenameNotebook: (name: string) => void;
  availableLanguages: Language[];
  selectedLanguageName: string;
  onChangeLanguage: (languageName: string) => void;
  onChangeCellContent: (cellId: ID, value: string) => void;
  onSetCellEditing: (cellId: ID, isEditing: boolean) => void;
  onRunCell: (cellId: ID) => void;
  onClearCellOutput: (cellId: ID) => void;
  onMoveCellUp: (cellId: ID) => void;
  onMoveCellDown: (cellId: ID) => void;
  onDeleteCell: (cellId: ID) => void;
}

export function WorkspaceView({
  workspace,
  selectedNotebookId,
  selectedNotebook,
  executingCells,
  runtimeReady,
  runtimeStatusMessage,
  notebookLocked,
  notebookLockMessage,
  onSelectNotebook,
  onAddNotebook,
  onRenameWorkspace,
  onInsertCodeCell,
  onInsertMarkdownCell,
  onRenameNotebook,
  availableLanguages,
  selectedLanguageName,
  onChangeLanguage,
  onChangeCellContent,
  onSetCellEditing,
  onRunCell,
  onClearCellOutput,
  onMoveCellUp,
  onMoveCellDown,
  onDeleteCell,
}: WorkspaceViewProps) {
  const MIN_LEFT_WIDTH = 180;
  const MIN_CENTER_WIDTH = 420;
  const MIN_RIGHT_WIDTH = 220;
  const HANDLE_SPACE = 20;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [leftPanelWidth, setLeftPanelWidth] = useState(250);
  const [rightPanelWidth, setRightPanelWidth] = useState(280);
  const [draggingSide, setDraggingSide] = useState<"left" | "right" | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(workspace.name);
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setTitleDraft(workspace.name);
  }, [workspace.name]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const commitTitleChange = () => {
    const trimmed = titleDraft.trim();
    const nextName = trimmed.length > 0 ? trimmed : workspace.name;

    if (nextName !== workspace.name) {
      onRenameWorkspace(nextName);
    }

    if (titleDraft !== nextName) {
      setTitleDraft(nextName);
    }

    setIsEditingTitle(false);
  };

  useEffect(() => {
    if (!draggingSide) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      if (draggingSide === "left") {
        const maxLeftWidth = rect.width - rightPanelWidth - MIN_CENTER_WIDTH - HANDLE_SPACE;
        const rawWidth = event.clientX - rect.left;
        const clampedWidth = Math.max(MIN_LEFT_WIDTH, Math.min(rawWidth, Math.max(MIN_LEFT_WIDTH, maxLeftWidth)));
        setLeftPanelWidth(clampedWidth);
      }

      if (draggingSide === "right") {
        const maxRightWidth = rect.width - leftPanelWidth - MIN_CENTER_WIDTH - HANDLE_SPACE;
        const rawWidth = rect.right - event.clientX;
        const clampedWidth = Math.max(MIN_RIGHT_WIDTH, Math.min(rawWidth, Math.max(MIN_RIGHT_WIDTH, maxRightWidth)));
        setRightPanelWidth(clampedWidth);
      }
    };

    const handleMouseUp = () => {
      setDraggingSide(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingSide, leftPanelWidth, rightPanelWidth]);

  return (
    <div className="workspace-container">
      <div className="workspace-header">
        {isEditingTitle ? (
          <input
            ref={titleInputRef}
            type="text"
            className="workspace-title-input"
            value={titleDraft}
            onChange={(event) => setTitleDraft(event.target.value)}
            onBlur={commitTitleChange}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.currentTarget.blur();
              } else if (event.key === "Escape") {
                setTitleDraft(workspace.name);
                setIsEditingTitle(false);
              }
            }}
            aria-label="Edit workspace name"
          />
        ) : (
          <h1
            className="workspace-title"
            onClick={() => setIsEditingTitle(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setIsEditingTitle(true);
              }
            }}
          >
            {workspace.name}
          </h1>
        )}
      </div>
      <div
        ref={containerRef}
        className={draggingSide ? "workspace-layout workspace-layout-resizing" : "workspace-layout"}
      >
        <div className="workspace-left-panel" style={{ width: `${leftPanelWidth}px` }}>
          <WorkspaceSidebarView
            workspace={workspace}
            selectedNotebookId={selectedNotebookId}
            onSelectNotebook={onSelectNotebook}
            onAddNotebook={onAddNotebook}
          />
        </div>

        <div
          className="workspace-resizer"
          role="separator"
          aria-label="Resize left panel"
          aria-orientation="vertical"
          onMouseDown={() => setDraggingSide("left")}
        />

        <div className="workspace-center-panel">
          <NotebookView
            notebook={selectedNotebook}
            executingCells={executingCells}
            runtimeReady={runtimeReady}
            runtimeStatusMessage={runtimeStatusMessage}
            notebookLocked={notebookLocked}
            notebookLockMessage={notebookLockMessage}
            onInsertCodeCell={onInsertCodeCell}
            onInsertMarkdownCell={onInsertMarkdownCell}
            onRenameNotebook={onRenameNotebook}
            availableLanguages={availableLanguages}
            selectedLanguageName={selectedLanguageName}
            onChangeLanguage={onChangeLanguage}
            onChangeCellContent={onChangeCellContent}
            onSetCellEditing={onSetCellEditing}
            onRunCell={onRunCell}
            onClearCellOutput={onClearCellOutput}
            onMoveCellUp={onMoveCellUp}
            onMoveCellDown={onMoveCellDown}
            onDeleteCell={onDeleteCell}
          />
        </div>

        <div
          className="workspace-resizer"
          role="separator"
          aria-label="Resize right panel"
          aria-orientation="vertical"
          onMouseDown={() => setDraggingSide("right")}
        />

        <div className="workspace-right-panel" style={{ width: `${rightPanelWidth}px` }}>
          <RightPanelView />
        </div>
      </div>
    </div>
  );
}
