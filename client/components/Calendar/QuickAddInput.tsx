import { useState, useMemo, useRef, useEffect } from "react";
import "@material/web/textfield/filled-text-field.js";
import "@material/web/icon/icon.js";
import { parseNaturalLanguage, formatParsedEvent } from "../../utils/naturalLanguageParser";
import { Calendar } from "../../types/calendar";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "md-filled-text-field": any;
      "md-icon": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

interface QuickAddInputProps {
  calendars: Calendar[];
  onQuickAdd: (event: {
    title: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    calendarId: string;
  }) => void;
}

export default function QuickAddInput({ calendars, onQuickAdd }: QuickAddInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const inputRef = useRef<any>(null);

  const parsedEvent = useMemo(() => {
    if (!inputValue.trim()) return null;
    return parseNaturalLanguage(inputValue);
  }, [inputValue]);

  const previewText = useMemo(() => {
    if (!parsedEvent) return "";
    return formatParsedEvent(parsedEvent);
  }, [parsedEvent]);

  const handleInput = (e: any) => {
    setInputValue(e.target.value);
    setShowPreview(e.target.value.trim().length > 3);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && parsedEvent && inputValue.trim()) {
      handleQuickAdd();
    } else if (e.key === "Escape") {
      setInputValue("");
      setShowPreview(false);
      inputRef.current?.blur();
    }
  };

  const handleQuickAdd = () => {
    if (!parsedEvent) return;

    // Find the calendar by hint or use the first enabled calendar
    let targetCalendar = calendars.find(c => c.enabled);
    if (parsedEvent.calendarHint) {
      const hintCalendar = calendars.find(
        c => c.name.toLowerCase().includes(parsedEvent.calendarHint!) && c.enabled
      );
      if (hintCalendar) targetCalendar = hintCalendar;
    }

    if (!targetCalendar) {
      alert("Please enable at least one calendar");
      return;
    }

    onQuickAdd({
      title: parsedEvent.title,
      startDate: parsedEvent.startDate,
      startTime: parsedEvent.startTime,
      endDate: parsedEvent.endDate,
      endTime: parsedEvent.endTime,
      calendarId: targetCalendar.id,
    });

    // Clear input
    setInputValue("");
    setShowPreview(false);
  };

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "400px" }}>
      <md-filled-text-field
        ref={inputRef}
        type="text"
        value={inputValue}
        placeholder="Quick add: 'Team meeting tomorrow at 2pm'"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        style={{
          width: "100%",
          "--md-filled-text-field-container-color": "hsl(var(--md-sys-color-surface-container-highest))",
        }}
      >
        <md-icon slot="leading-icon">bolt</md-icon>
      </md-filled-text-field>

      {/* Preview Tooltip */}
      {showPreview && parsedEvent && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: "hsl(var(--md-sys-color-surface-container-high))",
            color: "hsl(var(--md-sys-color-on-surface))",
            padding: "8px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            zIndex: 1000,
            border: "1px solid hsl(var(--md-sys-color-outline-variant))",
          }}
        >
          <div style={{ fontWeight: "500", marginBottom: "4px" }}>
            {parsedEvent.title}
          </div>
          <div style={{ color: "hsl(var(--md-sys-color-on-surface-variant))", fontSize: "11px" }}>
            {previewText}
          </div>
          <div style={{ marginTop: "4px", fontSize: "10px", color: "hsl(var(--md-sys-color-tertiary))" }}>
            Press Enter to create • Esc to cancel
          </div>
        </div>
      )}
    </div>
  );
}
