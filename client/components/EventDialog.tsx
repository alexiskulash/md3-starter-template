import { useState, useEffect, useMemo, useRef } from "react";
import "@material/web/dialog/dialog.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/text-button.js";
import "@material/web/textfield/filled-text-field.js";
import "@material/web/icon/icon.js";
import type { CalendarEvent } from "../pages/Calendar";

interface EventDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  onDelete?: (eventId: string) => void;
  selectedDate: Date | null;
  existingEvent?: CalendarEvent;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "md-dialog": any;
      "md-filled-button": any;
      "md-text-button": any;
      "md-filled-text-field": any;
      "md-icon": any;
    }
  }
}

const EVENT_COLORS = [
  { name: 'Blue', value: '#1976D2' },
  { name: 'Red', value: '#D32F2F' },
  { name: 'Green', value: '#388E3C' },
  { name: 'Orange', value: '#F57C00' },
  { name: 'Purple', value: '#7B1FA2' },
  { name: 'Teal', value: '#00897B' },
];

export default function EventDialog({ 
  open, 
  onClose, 
  onSave, 
  onDelete,
  selectedDate, 
  existingEvent 
}: EventDialogProps) {
  const dialogRef = useRef<any>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [selectedColor, setSelectedColor] = useState(EVENT_COLORS[0].value);

  // Update dialog open state
  useEffect(() => {
    if (dialogRef.current) {
      if (open) {
        dialogRef.current.show();
      } else {
        dialogRef.current.close();
      }
    }
  }, [open]);

  // Initialize form with existing event data or defaults
  useEffect(() => {
    if (existingEvent) {
      setTitle(existingEvent.title);
      setDescription(existingEvent.description);
      setStartTime(existingEvent.startTime);
      setEndTime(existingEvent.endTime);
      setSelectedColor(existingEvent.color);
    } else {
      // Reset form for new event
      setTitle('');
      setDescription('');
      setStartTime('09:00');
      setEndTime('10:00');
      setSelectedColor(EVENT_COLORS[0].value);
    }
  }, [existingEvent, open]);

  const isFormValid = useMemo(() => {
    return !!(title.trim() && selectedDate && startTime && endTime);
  }, [title, selectedDate, startTime, endTime]);

  const handleSave = () => {
    if (!isFormValid || !selectedDate) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      date: selectedDate,
      startTime,
      endTime,
      color: selectedColor,
    });

    handleClose();
  };

  const handleDelete = () => {
    if (existingEvent && onDelete) {
      onDelete(existingEvent.id);
      handleClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  const formattedDate = useMemo(() => {
    if (!selectedDate) return '';
    return selectedDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }, [selectedDate]);

  return (
    <md-dialog ref={dialogRef}>
      <div slot="headline" style={{
        fontSize: "24px",
        fontWeight: "500",
        color: "hsl(var(--md-sys-color-on-surface))"
      }}>
        {existingEvent ? 'Edit Event' : 'New Event'}
      </div>
      
      <form slot="content" method="dialog" style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "0 4px"
      }}>
        {/* Date display */}
        <div style={{
          padding: "12px",
          background: "hsl(var(--md-sys-color-surface-variant) / 0.3)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <md-icon style={{ color: "hsl(var(--md-sys-color-primary))" }}>
            event
          </md-icon>
          <span style={{
            fontSize: "14px",
            color: "hsl(var(--md-sys-color-on-surface))"
          }}>
            {formattedDate}
          </span>
        </div>

        {/* Title field */}
        <md-filled-text-field
          label="Event Title"
          value={title}
          onInput={(e: any) => setTitle(e.target.value)}
          required={true}
          style={{ width: "100%" }}
        >
          <md-icon slot="leading-icon">title</md-icon>
        </md-filled-text-field>

        {/* Description field */}
        <md-filled-text-field
          label="Description"
          value={description}
          onInput={(e: any) => setDescription(e.target.value)}
          type="textarea"
          rows={3}
          style={{ width: "100%" }}
        >
          <md-icon slot="leading-icon">description</md-icon>
        </md-filled-text-field>

        {/* Time fields */}
        <div style={{ display: "flex", gap: "12px" }}>
          <md-filled-text-field
            label="Start Time"
            type="time"
            value={startTime}
            onInput={(e: any) => setStartTime(e.target.value)}
            required={true}
            style={{ flex: 1 }}
          >
            <md-icon slot="leading-icon">schedule</md-icon>
          </md-filled-text-field>

          <md-filled-text-field
            label="End Time"
            type="time"
            value={endTime}
            onInput={(e: any) => setEndTime(e.target.value)}
            required={true}
            style={{ flex: 1 }}
          >
            <md-icon slot="leading-icon">schedule</md-icon>
          </md-filled-text-field>
        </div>

        {/* Color picker */}
        <div>
          <label style={{
            display: "block",
            fontSize: "12px",
            color: "hsl(var(--md-sys-color-on-surface-variant))",
            marginBottom: "8px"
          }}>
            Event Color
          </label>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {EVENT_COLORS.map(color => (
              <div
                key={color.value}
                onClick={() => setSelectedColor(color.value)}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: color.value,
                  cursor: "pointer",
                  border: selectedColor === color.value 
                    ? "3px solid hsl(var(--md-sys-color-primary))"
                    : "2px solid transparent",
                  transition: "all 0.2s",
                  boxShadow: selectedColor === color.value 
                    ? "0 2px 8px rgba(0,0,0,0.2)"
                    : "0 1px 3px rgba(0,0,0,0.1)"
                }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </form>

      <div slot="actions" style={{ display: "flex", gap: "8px", justifyContent: "space-between", width: "100%" }}>
        <div>
          {existingEvent && onDelete && (
            <md-text-button onClick={handleDelete}>
              <md-icon slot="icon">delete</md-icon>
              Delete
            </md-text-button>
          )}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <md-text-button onClick={handleClose}>
            Cancel
          </md-text-button>
          <md-filled-button 
            onClick={handleSave}
            disabled={!isFormValid ? true : undefined}
          >
            <md-icon slot="icon">save</md-icon>
            {existingEvent ? 'Update' : 'Create'}
          </md-filled-button>
        </div>
      </div>
    </md-dialog>
  );
}
