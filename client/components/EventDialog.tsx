import { useState, useEffect, useMemo } from "react";
import "@material/web/dialog/dialog.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/text-button.js";
import "@material/web/textfield/filled-text-field.js";
import "@material/web/select/filled-select.js";
import "@material/web/select/select-option.js";
import { useCalendar } from "../context/CalendarContext";
import { CalendarEvent } from "../types/calendar";
import { formatDate, formatTime } from "../utils/dateUtils";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "md-dialog": any;
      "md-filled-button": any;
      "md-text-button": any;
      "md-filled-text-field": any;
      "md-filled-select": any;
      "md-select-option": any;
    }
  }
}

interface EventDialogProps {
  open: boolean;
  event?: CalendarEvent | null;
  defaultDate?: Date;
  onClose: () => void;
}

export default function EventDialog({
  open,
  event,
  defaultDate,
  onClose,
}: EventDialogProps) {
  const { addEvent, updateEvent, deleteEvent, calendars } = useCalendar();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [calendarId, setCalendarId] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Initialize form when dialog opens or event changes
  useEffect(() => {
    if (open) {
      if (event) {
        // Edit mode
        setTitle(event.title);
        setDescription(event.description || "");
        setStartDate(event.startDate);
        setStartTime(event.startTime);
        setEndDate(event.endDate);
        setEndTime(event.endTime);
        setCalendarId(event.calendarId);
      } else {
        // Create mode
        const date = defaultDate || new Date();
        const now = new Date();
        const currentHour = now.getHours();
        
        setTitle("");
        setDescription("");
        setStartDate(formatDate(date));
        setStartTime(formatTime(currentHour));
        setEndDate(formatDate(date));
        setEndTime(formatTime(currentHour + 1));
        
        // Set first enabled calendar
        const firstEnabled = calendars.find((c) => c.enabled);
        setCalendarId(firstEnabled?.id || calendars[0]?.id || "");
      }
      setShowDeleteConfirm(false);
    }
  }, [open, event, defaultDate, calendars]);

  // Validate form
  const isValid = useMemo(() => {
    return !!(
      title.trim() &&
      startDate &&
      startTime &&
      endDate &&
      endTime &&
      calendarId
    );
  }, [title, startDate, startTime, endDate, endTime, calendarId]);

  const handleSave = () => {
    if (!isValid) return;

    const eventData = {
      title: title.trim(),
      description: description.trim(),
      startDate,
      startTime,
      endDate,
      endTime,
      calendarId,
    };

    if (event) {
      updateEvent(event.id, eventData);
    } else {
      addEvent(eventData);
    }

    onClose();
  };

  const handleDelete = () => {
    if (event) {
      deleteEvent(event.id);
      onClose();
    }
  };

  const handleClose = () => {
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <md-dialog open={open ? true : undefined} onClose={handleClose}>
      <div slot="headline">{event ? "Edit Event" : "Create Event"}</div>
      <div slot="content">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Title */}
          <md-filled-text-field
            label="Event title"
            value={title}
            onInput={(e: any) => setTitle(e.target.value)}
            required
            style={{ width: "100%" }}
          />

          {/* Description */}
          <md-filled-text-field
            label="Description (optional)"
            value={description}
            onInput={(e: any) => setDescription(e.target.value)}
            type="textarea"
            rows={3}
            style={{ width: "100%" }}
          />

          {/* Start Date and Time */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <md-filled-text-field
              label="Start date"
              type="date"
              value={startDate}
              onInput={(e: any) => setStartDate(e.target.value)}
              required
            />
            <md-filled-text-field
              label="Start time"
              type="time"
              value={startTime}
              onInput={(e: any) => setStartTime(e.target.value)}
              required
            />
          </div>

          {/* End Date and Time */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <md-filled-text-field
              label="End date"
              type="date"
              value={endDate}
              onInput={(e: any) => setEndDate(e.target.value)}
              required
            />
            <md-filled-text-field
              label="End time"
              type="time"
              value={endTime}
              onInput={(e: any) => setEndTime(e.target.value)}
              required
            />
          </div>

          {/* Calendar Selection */}
          <md-filled-select
            label="Calendar"
            value={calendarId}
            onInput={(e: any) => setCalendarId(e.target.value)}
            required
            style={{ width: "100%" }}
          >
            {calendars.map((calendar) => (
              <md-select-option
                key={calendar.id}
                value={calendar.id}
                selected={calendar.id === calendarId ? true : undefined}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
        </div>
      </div>
      <div slot="actions">
        {event && !showDeleteConfirm && (
          <md-text-button
            onClick={() => setShowDeleteConfirm(true)}
            style={{ color: "hsl(var(--md-sys-color-error))" }}
          >
            Delete
          </md-text-button>
        )}
        {showDeleteConfirm && (
          <>
            <md-text-button onClick={() => setShowDeleteConfirm(false)}>
              Cancel Delete
            </md-text-button>
            <md-text-button
              onClick={handleDelete}
              style={{ color: "hsl(var(--md-sys-color-error))" }}
            >
              Confirm Delete
            </md-text-button>
          </>
        )}
        {!showDeleteConfirm && (
          <>
            <md-text-button onClick={handleClose}>Cancel</md-text-button>
            <md-filled-button onClick={handleSave} disabled={!isValid ? true : undefined}>
              {event ? "Save" : "Create"}
            </md-filled-button>
          </>
        )}
      </div>
    </md-dialog>
  );
}
