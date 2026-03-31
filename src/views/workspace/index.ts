/**
 * Central export for workspace view models and hooks
 */

export { useWorkspace, type UseWorkspaceReturnType } from './hooks/useWorkspace';
export {
  useWorkspaceViewModel,
  useWorkspaceReducer,
  workspaceReducer,
  type WorkspaceViewModel,
  type WorkspaceAction,
} from './hooks/useWorkspaceViewModel';
