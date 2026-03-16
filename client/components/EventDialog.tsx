import { useEffect, useState, useMemo, useRef } from "react";
import { useCalendar } from "../contexts/CalendarContext";
import { getDefaultEventTime } from "../utils/dateUtils";
import type { CalendarEvent } from "../types/calendar";

// Import Material Web Components
import "@material/web/dialog/dialog.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/text-button.js";
import "@material/web/textfield/filled-text-field.js";
import "@material/web/select/filled-select.js";
import "@material/web/select/select-option.js";

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
  isOpen: boolean;
  onClose: () => void;
  event?: CalendarEvent | null;
  defaultDate?: Date;
}

export default function EventDialog({
  isOpen,
  onClose,
  event,
  defaultDate,
}: EventDialogProps) {
  const { addEvent, updateEvent, deleteEvent, getEnabledCalendars, calendars } =
    useCalendar();
  const dialogRef = useRef<any>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [calendarId, setCalendarId] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isEditMode = !!event;

  useEffect(() => {
    if (isOpen) {
      if (event) {
        // Edit mode
        setTitle(event.title);
        setDescription(event.description || "");
        setStartDate(event.startDate.toISOString().split("T")[0]);
        setStartTime(event.startTime);
        setEndDate(event.endDate.toISOString().split("T")[0]);
        setEndTime(event.endTime);
        setCalendarId(event.calendarId);
      } else {
        // Create mode
        const date = defaultDate || new Date();
        const dateStr = date.toISOString().split("T")[0];
        const times = getDefaultEventTime();

        setTitle("");
        setDescription("");
        setStartDate(dateStr);
        setStartTime(times.start);
        setEndDate(dateStr);
        setEndTime(times.end);

        const enabledCalendars = getEnabledCalendars();
        setCalendarId(enabledCalendars[0]?.id || calendars[0]?.id || "");
      }

      if (dialogRef.current) {
        dialogRef.current.show();
      }
    } else {
      if (dialogRef.current) {
        dialogRef.current.close();
      }
    }
  }, [isOpen, event, defaultDate, getEnabledCalendars, calendars]);

  const isFormValid = useMemo(() => {
    return !!(title && startDate && startTime && endDate && endTime && calendarId);
  }, [title, startDate, startTime, endDate, endTime, calendarId]);

  const handleSave = () => {
    if (!isFormValid) return;

    const eventData = {
      title,
      description,
      startDate: new Date(startDate),
      startTime,
      endDate: new Date(endDate),
      endTime,
      calendarId,
    };

    if (event) {
      updateEvent({ ...eventData, id: event.id });
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

  const handleCancel = () => {
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <md-dialog ref={dialogRef} onClose={handleCancel}>
      <div slot="headline">
        {isEditMode ? "Edit Event" : "Create Event"}
      </div>
      <form slot="content" id="event-form" method="dialog">
        <div className="flex flex-col gap-4 py-2">
          {/* Title */}
          <md-filled-text-field
            label="Event title"
            required
            value={title}
            onInput={(e: any) => setTitle(e.target.value)}
          />

          {/* Description */}
          <md-filled-text-field
            label="Description (optional)"
            type="textarea"
            rows="3"
            value={description}
            onInput={(e: any) => setDescription(e.target.value)}
          />

          {/* Start Date & Time */}
          <div className="grid grid-cols-2 gap-2">
            <md-filled-text-field
              label="Start date"
              type="date"
              required
              value={startDate}
              onInput={(e: any) => setStartDate(e.target.value)}
            />
            <md-filled-text-field
              label="Start time"
              type="time"
              required
              value={startTime}
              onInput={(e: any) => setStartTime(e.target.value)}
            />
          </div>

          {/* End Date & Time */}
          <div className="grid grid-cols-2 gap-2">
            <md-filled-text-field
              label="End date"
              type="date"
              required
              value={endDate}
              onInput={(e: any) => setEndDate(e.target.value)}
            />
            <md-filled-text-field
              label="End time"
              type="time"
              required
              value={endTime}
              onInput={(e: any) => setEndTime(e.target.value)}
            />
          </div>

          {/* Calendar Selection */}
          <md-filled-select
            label="Calendar"
            required
            value={calendarId}
            onInput={(e: any) => setCalendarId(e.target.value)}
          >
            {calendars.map((cal) => (
              <md-select-option key={cal.id} value={cal.id}>
                <div slot="headline">{cal.name}</div>
              </md-select-option>
            ))}
          </md-filled-select>
        </div>
      </form>
      <div slot="actions">
        {isEditMode && !showDeleteConfirm && (
          <md-text-button onClick={() => setShowDeleteConfirm(true)}>
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
            <md-text-button onClick={handleCancel}>Cancel</md-text-button>
            <md-filled-button
              onClick={handleSave}
              disabled={!isFormValid ? true : undefined}
            >
              {isEditMode ? "Save" : "Create"}
            </md-filled-button>
          </>
        )}
      </div>
    </md-dialog>
  );
}
