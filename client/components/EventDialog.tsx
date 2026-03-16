import { useState, useEffect, useMemo, useRef } from "react";
import "@material/web/dialog/dialog.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/text-button.js";
import "@material/web/textfield/filled-text-field.js";
import "@material/web/select/filled-select.js";
import "@material/web/select/select-option.js";
import type { CalendarEvent, Calendar } from "../types/calendar";

interface EventDialogProps {
  open: boolean;
  event?: CalendarEvent | null;
  calendars: Calendar[];
  defaultDate?: Date;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, "id">) => void;
  onDelete?: (eventId: string) => void;
}

export function EventDialog({
  open,
  event,
  calendars,
  defaultDate,
  onClose,
  onSave,
  onDelete,
}: EventDialogProps) {
  const dialogRef = useRef<any>(null);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [calendarId, setCalendarId] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Initialize form with event data or defaults
  useEffect(() => {
    if (open) {
      if (event) {
        // Edit mode
        setTitle(event.title);
        setStartDate(event.startDate);
        setEndDate(event.endDate);
        setStartTime(event.startTime);
        setEndTime(event.endTime);
        setDescription(event.description || "");
        setCalendarId(event.calendarId);
      } else {
        // Create mode - set defaults
        const now = new Date();
        const targetDate = defaultDate || now;
        const dateStr = targetDate.toISOString().split("T")[0];

        // Default to current hour with 1-hour duration
        const currentHour = now.getHours();
        const nextHour = (currentHour + 1) % 24;

        setTitle("");
        setStartDate(dateStr);
        setEndDate(dateStr);
        setStartTime(`${String(currentHour).padStart(2, "0")}:00`);
        setEndTime(`${String(nextHour).padStart(2, "0")}:00`);
        setDescription("");

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
  }, [open, event, calendars, defaultDate]);

  // Validate form
  const isValid = useMemo(() => {
    return !!(title && startDate && endDate && startTime && endTime && calendarId);
  }, [title, startDate, endDate, startTime, endTime, calendarId]);

  const handleSave = () => {
    if (!isValid) return;

    onSave({
      title,
      startDate,
      endDate,
      startTime,
      endTime,
      description,
      calendarId,
    });

    onClose();
  };

  const handleDelete = () => {
    if (event && onDelete) {
      onDelete(event.id);
      onClose();
    }
  };

  return (
    <md-dialog ref={dialogRef} onClose={onClose}>
      <div slot="headline">{event ? "Edit Event" : "Create Event"}</div>

      <form slot="content" id="event-form" method="dialog">
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
            label="Event title"
            value={title}
            onInput={(e: any) => setTitle(e.target.value)}
            required
            autoFocus
          />

          {/* Date range */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <md-filled-text-field
              type="date"
              label="Start date"
              value={startDate}
              onInput={(e: any) => setStartDate(e.target.value)}
              required
            />
            <md-filled-text-field
              type="date"
              label="End date"
              value={endDate}
              onInput={(e: any) => setEndDate(e.target.value)}
              required
            />
          </div>

          {/* Time range */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <md-filled-text-field
              type="time"
              label="Start time"
              value={startTime}
              onInput={(e: any) => setStartTime(e.target.value)}
              required
            />
            <md-filled-text-field
              type="time"
              label="End time"
              value={endTime}
              onInput={(e: any) => setEndTime(e.target.value)}
              required
            />
          </div>

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
        {event && onDelete && !showDeleteConfirm && (
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
              {event ? "Save" : "Create"}
            </md-filled-button>
          </>
        )}
      </div>
    </md-dialog>
  );
}
