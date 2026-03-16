import { useCalendar } from '../contexts/CalendarContext';
import { CalendarEvent } from '../types/calendar';

interface DeleteEventDialogProps {
  open: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
}

export function DeleteEventDialog({ open, onClose, event }: DeleteEventDialogProps) {
  const { deleteEvent } = useCalendar();

  const handleDelete = () => {
    if (event) {
      deleteEvent(event.id);
    }
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleBackdropClick = (e: any) => {
    if (e.target.getAttribute('id') === 'delete-dialog') {
      handleCancel();
    }
  };

  if (!open || !event) return null;

  return (
    <md-dialog
      id="delete-dialog"
      open={open ? true : undefined}
      onClick={handleBackdropClick}
    >
      <div slot="headline" style={{ fontSize: '24px', fontWeight: '500' }}>
        Delete Event?
      </div>
      
      <div slot="content">
        <p style={{ margin: 0, lineHeight: '1.5' }}>
          Are you sure you want to delete "{event.title}"? This action cannot be undone.
        </p>
      </div>

      <div slot="actions">
        <md-text-button onClick={handleCancel}>Cancel</md-text-button>
        <md-filled-button onClick={handleDelete}>Delete</md-filled-button>
      </div>
    </md-dialog>
  );
}
