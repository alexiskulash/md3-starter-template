import { useState, useEffect, useMemo, useRef } from "react";
import "@material/web/dialog/dialog.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/text-button.js";
import "@material/web/textfield/filled-text-field.js";
import "@material/web/select/filled-select.js";
import "@material/web/select/select-option.js";
import type { Task, Calendar } from "../types/calendar";

interface TaskDialogProps {
  open: boolean;
  task?: Task | null;
  calendars: Calendar[];
  defaultDate?: Date;
  onClose: () => void;
  onSave: (task: Omit<Task, "id">) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskDialog({
  open,
  task,
  calendars,
  defaultDate,
  onClose,
  onSave,
  onDelete,
}: TaskDialogProps) {
  const dialogRef = useRef<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [calendarId, setCalendarId] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Initialize form with task data or defaults
  useEffect(() => {
    if (open) {
      if (task) {
        // Edit mode
        setTitle(task.title);
        setDescription(task.description || "");
        setDueDate(task.dueDate || "");
        setEstimatedDuration(task.estimatedDuration ? String(task.estimatedDuration) : "");
        setCalendarId(task.calendarId);
      } else {
        // Create mode - set defaults
        const targetDate = defaultDate || new Date();
        const dateStr = targetDate.toISOString().split("T")[0];

        setTitle("");
        setDescription("");
        setDueDate(dateStr);
        setEstimatedDuration("30"); // Default 30 minutes

        // Select first enabled calendar
        const firstEnabled = calendars.find((c) => c.enabled);
        setCalendarId(firstEnabled?.id || calendars[0]?.id || "");
      }
      setShowDeleteConfirm(false);

      // Open dialog
      if (dialogRef.current) {
        dialogRef.current.show();
      }
    } else {
      // Close dialog
      if (dialogRef.current) {
        dialogRef.current.close();
      }
    }
  }, [open, task, calendars, defaultDate]);

  // Validate form
  const isValid = useMemo(() => {
    return !!(title && calendarId);
  }, [title, calendarId]);

  const handleSave = () => {
    if (!isValid) return;

    onSave({
      title,
      description: description || undefined,
      dueDate: dueDate || undefined,
      estimatedDuration: estimatedDuration ? parseInt(estimatedDuration, 10) : undefined,
      calendarId,
      completed: task?.completed || false,
      scheduledDate: task?.scheduledDate,
      scheduledStartTime: task?.scheduledStartTime,
    });

    onClose();
  };

  const handleDelete = () => {
    if (task && onDelete) {
      onDelete(task.id);
      onClose();
    }
  };

  return (
    <md-dialog ref={dialogRef} onClose={onClose}>
      <div slot="headline">{task ? "Edit Task" : "Create Task"}</div>

      <form slot="content" id="task-form" method="dialog">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            minWidth: "400px",
          }}
        >
          {/* Title */}
          <md-filled-text-field
            label="Task title"
            value={title}
            onInput={(e: any) => setTitle(e.target.value)}
            required
            autoFocus
          />

          {/* Calendar selection */}
          <md-filled-select
            label="Calendar"
            value={calendarId}
            onInput={(e: any) => setCalendarId(e.target.value)}
            required
          >
            {calendars.map((calendar) => (
              <md-select-option key={calendar.id} value={calendar.id}>
                <div slot="headline" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: calendar.color,
                    }}
                  />
                  {calendar.name}
                </div>
              </md-select-option>
            ))}
          </md-filled-select>

          {/* Due date and estimated duration */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <md-filled-text-field
              type="date"
              label="Due date (optional)"
              value={dueDate}
              onInput={(e: any) => setDueDate(e.target.value)}
            />
            <md-filled-text-field
              type="number"
              label="Duration (min)"
              value={estimatedDuration}
              onInput={(e: any) => setEstimatedDuration(e.target.value)}
              min="0"
              step="15"
            />
          </div>

          {/* Description */}
          <md-filled-text-field
            type="textarea"
            label="Description (optional)"
            value={description}
            onInput={(e: any) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
      </form>

      <div slot="actions">
        {task && onDelete && !showDeleteConfirm && (
          <md-text-button onClick={() => setShowDeleteConfirm(true)} style={{ marginRight: "auto" }}>
            Delete
          </md-text-button>
        )}

        {showDeleteConfirm && (
          <>
            <md-text-button onClick={() => setShowDeleteConfirm(false)} style={{ marginRight: "auto" }}>
              Cancel Delete
            </md-text-button>
            <md-text-button onClick={handleDelete} style={{ color: "hsl(var(--md-sys-color-error))" }}>
              Confirm Delete
            </md-text-button>
          </>
        )}

        {!showDeleteConfirm && (
          <>
            <md-text-button onClick={onClose}>Cancel</md-text-button>
            <md-filled-button onClick={handleSave} disabled={!isValid ? true : undefined}>
              {task ? "Save" : "Create"}
            </md-filled-button>
          </>
        )}
      </div>
    </md-dialog>
  );
}
