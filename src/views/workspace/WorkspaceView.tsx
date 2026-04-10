import { useEffect, useRef, useState } from "react";
import type { WorkspaceViewModel } from "../../view-models/useWorkspaceViewModel";
import { NotebookView } from "../notebook/NotebookView";
import { RightPanelView } from "./RightPanelView";
import { WorkspaceSidebarView } from "./WorkspaceSidebarView";

const MIN_LEFT_WIDTH = 180;
const MIN_CENTER_WIDTH = 420;
const MIN_RIGHT_WIDTH = 220;
const HANDLE_SPACE = 20;

interface WorkspaceViewProps {
  viewModel: WorkspaceViewModel;
}

export function WorkspaceView({ viewModel }: WorkspaceViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  const [leftPanelWidth, setLeftPanelWidth] = useState(250);
  const [rightPanelWidth, setRightPanelWidth] = useState(280);
  const [draggingSide, setDraggingSide] = useState<"left" | "right" | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(viewModel.workspace.name);

  useEffect(() => {
    setTitleDraft(viewModel.workspace.name);
  }, [viewModel.workspace.name]);

  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isEditingTitle]);

  const commitTitle = () => {
    const name = titleDraft.trim() || viewModel.workspace.name;
    if (name !== viewModel.workspace.name) viewModel.renameWorkspace(name);
    setTitleDraft(name);
    setIsEditingTitle(false);
  };

  useEffect(() => {
    if (!draggingSide) return;

    const onMouseMove = (event: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      if (draggingSide === "left") {
        const max = rect.width - rightPanelWidth - MIN_CENTER_WIDTH - HANDLE_SPACE;
        const raw = event.clientX - rect.left;
        setLeftPanelWidth(Math.max(MIN_LEFT_WIDTH, Math.min(raw, Math.max(MIN_LEFT_WIDTH, max))));
      }

      if (draggingSide === "right") {
        const max = rect.width - leftPanelWidth - MIN_CENTER_WIDTH - HANDLE_SPACE;
        const raw = rect.right - event.clientX;
        setRightPanelWidth(Math.max(MIN_RIGHT_WIDTH, Math.min(raw, Math.max(MIN_RIGHT_WIDTH, max))));
      }
    };

    const onMouseUp = () => setDraggingSide(null);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [draggingSide, leftPanelWidth, rightPanelWidth]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center px-[14px] py-3 bg-white border-b border-gray-200 shrink-0">
        {isEditingTitle ? (
          <input
            ref={titleInputRef}
            type="text"
            className="m-0 text-[1.2rem] font-bold text-gray-900 border-2 border-gray-900 rounded-md py-1 px-2 font-[inherit] bg-white outline-none focus:shadow-[0_0_0_3px_rgba(17,24,39,0.1)]"
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
              else if (e.key === "Escape") {
                setTitleDraft(viewModel.workspace.name);
                setIsEditingTitle(false);
              }
            }}
            aria-label="Edit workspace name"
          />
        ) : (
          <button
            type="button"
            className="m-0 text-[1.2rem] font-bold text-gray-900 cursor-pointer py-1 px-2 border-0 bg-transparent rounded-md transition-colors hover:bg-gray-100 font-[inherit]"
            onClick={() => setIsEditingTitle(true)}
          >
            {viewModel.workspace.name}
          </button>
        )}
      </div>

      <div
        ref={containerRef}
        className={`flex items-stretch flex-1 min-h-0 p-[14px] gap-0${draggingSide ? " select-none cursor-col-resize" : ""}`}
      >
        <div className="min-w-0 h-full relative" style={{ width: `${leftPanelWidth}px` }}>
          <WorkspaceSidebarView viewModel={viewModel} />
        </div>

        {/* biome-ignore lint/a11y/noStaticElementInteractions: drag handle has no semantic HTML element */}
        {/* biome-ignore lint/a11y/useAriaPropsSupportedByRole: decorative drag handle div */}
        <div
          className="relative w-[10px] h-full cursor-col-resize shrink-0 before:content-[''] before:absolute before:left-1/2 before:top-[10px] before:bottom-[10px] before:w-px before:bg-[#c9d6ea] before:-translate-x-1/2 before:transition-colors hover:before:bg-gray-900"
          aria-label="Resize left panel"
          onMouseDown={() => setDraggingSide("left")}
        />

        <div className="flex-1 min-w-0 h-full px-[10px] relative">
          <NotebookView viewModel={viewModel} />
        </div>

        {/* biome-ignore lint/a11y/noStaticElementInteractions: drag handle has no semantic HTML element */}
        {/* biome-ignore lint/a11y/useAriaPropsSupportedByRole: decorative drag handle div */}
        <div
          className="relative w-[10px] h-full cursor-col-resize shrink-0 before:content-[''] before:absolute before:left-1/2 before:top-[10px] before:bottom-[10px] before:w-px before:bg-[#c9d6ea] before:-translate-x-1/2 before:transition-colors hover:before:bg-gray-900"
          aria-label="Resize right panel"
          onMouseDown={() => setDraggingSide("right")}
        />

        <div className="min-w-0 h-full relative" style={{ width: `${rightPanelWidth}px` }}>
          <RightPanelView />
        </div>
      </div>
    </div>
  );
}
