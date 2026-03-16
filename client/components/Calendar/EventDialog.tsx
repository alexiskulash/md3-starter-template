import { useState, useMemo } from "react";
import { Calendar, CalendarEvent } from "../../types/calendar";
import "@material/web/dialog/dialog.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/text-button.js";
import "@material/web/textfield/filled-text-field.js";
import "@material/web/select/filled-select.js";
import "@material/web/select/select-option.js";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "md-dialog": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        open?: boolean;
      };
      "md-filled-button": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        disabled?: boolean;
      };
      "md-text-button": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      "md-filled-text-field": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        label?: string;
        value?: string;
        type?: string;
        required?: boolean;
      };
      "md-filled-select": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        label?: string;
        required?: boolean;
      };
      "md-select-option": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        value?: string;
        selected?: boolean;
      };
    }
  }
}

interface EventDialogProps {
  event?: CalendarEvent;
  calendars: Calendar[];
  selectedDate: Date;
  onSave: (event: CalendarEvent | Omit<CalendarEvent, "id">) => void;
  onDelete?: (eventId: string) => void;
  onClose: () => void;
}

export default function EventDialog({
  event,
  calendars,
  selectedDate,
  onSave,
  onDelete,
  onClose,
}: EventDialogProps) {
  const isEditMode = !!event;

  // Get current time rounded to next hour
  const getCurrentTime = () => {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    now.setHours(now.getHours() + 1);
    return now.toTimeString().slice(0, 5);
  };

  const getEndTime = (startTime: string) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const endDate = new Date();
    endDate.setHours(hours + 1, minutes);
    return endDate.toTimeString().slice(0, 5);
  };

  const [title, setTitle] = useState(event?.title || "");
  const [startDate, setStartDate] = useState(
    event?.startDate || selectedDate.toISOString().split("T")[0]
  );
  const [startTime, setStartTime] = useState(event?.startTime || getCurrentTime());
  const [endDate, setEndDate] = useState(
    event?.endDate || selectedDate.toISOString().split("T")[0]
  );
  const [endTime, setEndTime] = useState(event?.endTime || getEndTime(getCurrentTime()));
  const [description, setDescription] = useState(event?.description || "");
  const [calendarId, setCalendarId] = useState(
    event?.calendarId || calendars.find(c => c.enabled)?.id || calendars[0]?.id || ""
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isFormValid = useMemo(() => {
    return !!(title && startDate && startTime && endDate && endTime && calendarId);
  }, [title, startDate, startTime, endDate, endTime, calendarId]);

  const handleSave = () => {
    if (!isFormValid) return;

    const eventData = {
      title,
      startDate,
      startTime,
      endDate,
      endTime,
      description,
      calendarId,
    };

    if (isEditMode && event) {
      onSave({ ...eventData, id: event.id });
    } else {
      onSave(eventData);
    }
  };

  const handleDelete = () => {
    if (event && onDelete) {
      onDelete(event.id);
    }
  };

  return (
    <>
      {/* Main Dialog */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "24px",
        }}
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "hsl(var(--md-sys-color-surface-container-high))",
            borderRadius: "28px",
            maxWidth: "560px",
            width: "100%",
            maxHeight: "90vh",
            overflow: "auto",
            padding: "24px",
            animation: "dialogZoom 0.2s ease-out",
          }}
        >
          {/* Header */}
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "500",
              color: "hsl(var(--md-sys-color-on-surface))",
              marginBottom: "24px",
            }}
          >
            {isEditMode ? "Edit Event" : "Create Event"}
          </h2>

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Title */}
            <md-filled-text-field
              label="Event title"
              value={title}
              required={true}
              onInput={(e: any) => setTitle(e.target.value)}
              style={{ width: "100%" }}
            />

            {/* Start Date & Time */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <md-filled-text-field
                label="Start date"
                type="date"
                value={startDate}
                required={true}
                onInput={(e: any) => setStartDate(e.target.value)}
                style={{ width: "100%" }}
              />
              <md-filled-text-field
                label="Start time"
                type="time"
                value={startTime}
                required={true}
                onInput={(e: any) => {
                  setStartTime(e.target.value);
                  if (!event) {
                    setEndTime(getEndTime(e.target.value));
                  }
                }}
                style={{ width: "100%" }}
              />
            </div>

            {/* End Date & Time */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <md-filled-text-field
                label="End date"
                type="date"
                value={endDate}
                required={true}
                onInput={(e: any) => setEndDate(e.target.value)}
                style={{ width: "100%" }}
              />
              <md-filled-text-field
                label="End time"
                type="time"
                value={endTime}
                required={true}
                onInput={(e: any) => setEndTime(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            {/* Calendar Selection */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  color: "hsl(var(--md-sys-color-on-surface-variant))",
                  marginBottom: "8px",
                }}
              >
                Calendar
              </label>
              <select
                value={calendarId}
                onChange={(e) => setCalendarId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "4px",
                  border: "1px solid hsl(var(--md-sys-color-outline))",
                  background: "hsl(var(--md-sys-color-surface-container-highest))",
                  color: "hsl(var(--md-sys-color-on-surface))",
                  fontSize: "16px",
                }}
              >
                {calendars.map((calendar) => (
                  <option key={calendar.id} value={calendar.id}>
                    {calendar.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <md-filled-text-field
              label="Description (optional)"
              value={description}
              onInput={(e: any) => setDescription(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "24px",
              gap: "12px",
            }}
          >
            <div>
              {isEditMode && onDelete && (
                <md-text-button
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{ color: "hsl(var(--md-sys-color-error))" }}
                >
                  Delete
                </md-text-button>
              )}
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <md-text-button onClick={onClose}>Cancel</md-text-button>
              <md-filled-button
                disabled={!isFormValid ? true : undefined}
                onClick={handleSave}
              >
                {isEditMode ? "Save" : "Create"}
              </md-filled-button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001,
          }}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "hsl(var(--md-sys-color-surface-container-high))",
              borderRadius: "28px",
              maxWidth: "400px",
              width: "100%",
              padding: "24px",
            }}
          >
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "500",
                color: "hsl(var(--md-sys-color-on-surface))",
                marginBottom: "16px",
              }}
            >
              Delete event?
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "hsl(var(--md-sys-color-on-surface-variant))",
                marginBottom: "24px",
              }}
            >
              This action cannot be undone.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <md-text-button onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </md-text-button>
              <md-filled-button
                onClick={handleDelete}
                style={{
                  background: "hsl(var(--md-sys-color-error))",
                  color: "hsl(var(--md-sys-color-on-error))",
                }}
              >
                Delete
              </md-filled-button>
            </div>
          </div>
        </div>
      )}

      {/* Animation */}
      <style>{`
        @keyframes dialogZoom {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
