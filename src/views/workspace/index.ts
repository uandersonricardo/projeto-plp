/**
 * Central export for workspace view models and hooks
 */

export { type UseWorkspaceReturnType, useWorkspace } from "./hooks/useWorkspace";
export {
  useWorkspaceReducer,
  useWorkspaceViewModel,
  type WorkspaceAction,
  type WorkspaceViewModel,
  workspaceReducer,
} from "./hooks/useWorkspaceViewModel";
