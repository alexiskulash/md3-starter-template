import { useState, useMemo, useEffect } from "react";
import "@material/web/dialog/dialog.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/text-button.js";
import "@material/web/textfield/filled-text-field.js";
import "@material/web/select/filled-select.js";
import "@material/web/select/select-option.js";
import "@material/web/checkbox/checkbox.js";
import "@material/web/icon/icon.js";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "md-dialog": any;
      "md-filled-button": any;
      "md-text-button": any;
      "md-filled-text-field": any;
      "md-filled-select": any;
      "md-select-option": any;
      "md-checkbox": any;
      "md-icon": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

interface TimeBlockDialogProps {
  timeBlock?: {
    id: string;
    title: string;
    category: 'work' | 'personal' | 'break' | 'focus' | 'meeting' | 'other';
    startTime: string;
    endTime: string;
  };
  onSave: (timeBlock: {
    title: string;
    category: 'work' | 'personal' | 'break' | 'focus' | 'meeting' | 'other';
    startTime: string;
    endTime: string;
    recurring: boolean;
    daysOfWeek: number[];
  }) => void;
  onDelete?: () => void;
  onClose: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  work: '#1976d2',
  personal: '#388e3c',
  break: '#f57c00',
  focus: '#7b1fa2',
  meeting: '#c62828',
  other: '#616161',
};

const DAYS_OF_WEEK = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
];

export default function TimeBlockDialog({
  timeBlock,
  onSave,
  onDelete,
  onClose,
}: TimeBlockDialogProps) {
  const [title, setTitle] = useState(timeBlock?.title || "");
  const [category, setCategory] = useState<'work' | 'personal' | 'break' | 'focus' | 'meeting' | 'other'>(
    timeBlock?.category || "work"
  );
  const [startTime, setStartTime] = useState(timeBlock?.startTime || "09:00");
  const [endTime, setEndTime] = useState(timeBlock?.endTime || "10:00");
  const [recurring, setRecurring] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]); // Default: weekdays

  const isValid = useMemo(() => {
    return title.trim() !== "" && startTime !== "" && endTime !== "";
  }, [title, startTime, endTime]);

  useEffect(() => {
    // Auto-focus title field
    const timer = setTimeout(() => {
      const titleField = document.querySelector('md-filled-text-field[label="Title"]');
      if (titleField) {
        (titleField as any).focus();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    if (!isValid) return;
    
    onSave({
      title,
      category,
      startTime,
      endTime,
      recurring,
      daysOfWeek: recurring ? selectedDays : [],
    });
  };

  const handleToggleDay = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day].sort()
    );
  };

  return (
    <md-dialog open onClose={onClose}>
      <div slot="headline">{timeBlock ? "Edit Time Block" : "Create Time Block"}</div>
      
      <div slot="content">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", minWidth: "400px" }}>
          {/* Title */}
          <md-filled-text-field
            label="Title"
            value={title}
            onInput={(e: any) => setTitle(e.target.value)}
            required
            style={{ width: "100%" }}
          />

          {/* Category */}
          <md-filled-select
            label="Category"
            value={category}
            onInput={(e: any) => setCategory(e.target.value)}
            style={{ width: "100%" }}
          >
            <md-select-option value="work">
              <div slot="headline">Work</div>
            </md-select-option>
            <md-select-option value="personal">
              <div slot="headline">Personal</div>
            </md-select-option>
            <md-select-option value="break">
              <div slot="headline">Break</div>
            </md-select-option>
            <md-select-option value="focus">
              <div slot="headline">Focus Time</div>
            </md-select-option>
            <md-select-option value="meeting">
              <div slot="headline">Meeting</div>
            </md-select-option>
            <md-select-option value="other">
              <div slot="headline">Other</div>
            </md-select-option>
          </md-filled-select>

          {/* Time Range */}
          <div style={{ display: "flex", gap: "12px" }}>
            <md-filled-text-field
              type="time"
              label="Start Time"
              value={startTime}
              onInput={(e: any) => setStartTime(e.target.value)}
              required
              style={{ flex: 1 }}
            />
            <md-filled-text-field
              type="time"
              label="End Time"
              value={endTime}
              onInput={(e: any) => setEndTime(e.target.value)}
              required
              style={{ flex: 1 }}
            />
          </div>

          {/* Recurring */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <md-checkbox
              checked={recurring ? true : undefined}
              onClick={() => setRecurring(!recurring)}
            />
            <label style={{ cursor: "pointer" }} onClick={() => setRecurring(!recurring)}>
              Repeat weekly
            </label>
          </div>

          {/* Days of Week (only shown if recurring) */}
          {recurring && (
            <div>
              <div style={{ fontSize: "14px", marginBottom: "8px", color: "hsl(var(--md-sys-color-on-surface))" }}>
                Repeat on:
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {DAYS_OF_WEEK.map(day => (
                  <div
                    key={day.value}
                    onClick={() => handleToggleDay(day.value)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "16px",
                      cursor: "pointer",
                      background: selectedDays.includes(day.value)
                        ? "hsl(var(--md-sys-color-primary-container))"
                        : "hsl(var(--md-sys-color-surface-container-highest))",
                      color: selectedDays.includes(day.value)
                        ? "hsl(var(--md-sys-color-on-primary-container))"
                        : "hsl(var(--md-sys-color-on-surface-variant))",
                      fontSize: "12px",
                      fontWeight: "500",
                      userSelect: "none",
                    }}
                  >
                    {day.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Color Preview */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "4px",
                background: CATEGORY_COLORS[category],
              }}
            />
            <span style={{ fontSize: "14px", color: "hsl(var(--md-sys-color-on-surface-variant))" }}>
              Block color
            </span>
          </div>
        </div>
      </div>

      <div slot="actions">
        {timeBlock && onDelete && (
          <md-text-button onClick={onDelete} style={{ marginRight: "auto" }}>
            Delete
          </md-text-button>
        )}
        <md-text-button onClick={onClose}>Cancel</md-text-button>
        <md-filled-button onClick={handleSave} disabled={!isValid ? true : undefined}>
          {timeBlock ? "Update" : "Create"}
        </md-filled-button>
      </div>
    </md-dialog>
  );
}
