import type { MouseEventHandler } from 'react';
import { FiArrowDown, FiArrowUp, FiEdit2, FiEdit3, FiTrash2 } from 'react-icons/fi';

interface CommandButtonsViewProps {
  visible?: boolean;
  disabled: boolean;
  showEdit?: boolean;
  isEditing?: boolean;
  onEdit?: MouseEventHandler<HTMLButtonElement>;
  onMoveUp: MouseEventHandler<HTMLButtonElement>;
  onMoveDown: MouseEventHandler<HTMLButtonElement>;
  onDelete: MouseEventHandler<HTMLButtonElement>;
}

export function CommandButtonsView({
  visible = true,
  disabled,
  showEdit = false,
  isEditing = false,
  onEdit,
  onMoveUp,
  onMoveDown,
  onDelete,
}: CommandButtonsViewProps) {
  if (!visible) return null;

  return (
    <div className="cell-actions-right">
      <button type="button" className="cmd-btn cmd-icon-btn" onClick={onMoveUp} disabled={disabled} aria-label="Move cell up" title="Move up">
        <FiArrowUp aria-hidden="true" />
      </button>
      <button type="button" className="cmd-btn cmd-icon-btn" onClick={onMoveDown} disabled={disabled} aria-label="Move cell down" title="Move down">
        <FiArrowDown aria-hidden="true" />
      </button>
      {showEdit ? (
        <button
          type="button"
          className="cmd-btn cmd-icon-btn"
          onClick={onEdit}
          disabled={disabled}
          aria-label={isEditing ? 'Close markdown editor' : 'Edit markdown'}
          title={isEditing ? 'Close markdown editor' : 'Edit markdown'}
        >
          {isEditing ? <FiEdit3 aria-hidden="true" /> : <FiEdit2 aria-hidden="true" />}
        </button>
      ) : null}
      <button type="button" className="cmd-btn cmd-icon-btn cmd-danger" onClick={onDelete} disabled={disabled} aria-label="Delete cell" title="Delete">
        <FiTrash2 aria-hidden="true" />
      </button>
    </div>
  );
}
