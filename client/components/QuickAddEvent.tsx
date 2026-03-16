import { useState, useCallback, useRef, useEffect } from "react";
import { useCalendar } from "../contexts/CalendarContext";
import { parseNaturalLanguage } from "../utils/naturalLanguageParser";
import { getDefaultEventTime } from "../utils/dateUtils";

// Import Material Web Components
import "@material/web/textfield/filled-text-field.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/text-button.js";
import "@material/web/icon/icon.js";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "md-filled-text-field": any;
      "md-filled-button": any;
      "md-text-button": any;
      "md-icon": any;
    }
  }
}

interface QuickAddEventProps {
  onOpenFullDialog: () => void;
}

export default function QuickAddEvent({ onOpenFullDialog }: QuickAddEventProps) {
  const { addEvent, calendars, getEnabledCalendars } = useCalendar();
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      // Focus the input when expanded
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isExpanded]);

  const handleQuickAdd = useCallback(() => {
    if (!input || input.trim().length === 0) return;

    const parsed = parseNaturalLanguage(input);

    // If we have enough data, create the event
    if (parsed.title && parsed.confidence > 0.3) {
      const date = parsed.date || new Date();
      const dateStr = date.toISOString().split("T")[0];
      
      let startTime = parsed.startTime;
      let endTime = parsed.endTime;

      // If no time specified, use default
      if (!startTime) {
        const times = getDefaultEventTime();
        startTime = times.start;
        endTime = times.end;
      } else if (!endTime) {
        // If start time but no end time, default to 1 hour
        const [hour, minute] = startTime.split(":").map(Number);
        const endHour = (hour + 1) % 24;
        endTime = `${endHour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      }

      // Find calendar
      let calendarId = "";
      if (parsed.calendarName) {
        const matchingCalendar = calendars.find(
          (cal) => cal.name.toLowerCase() === parsed.calendarName?.toLowerCase()
        );
        if (matchingCalendar) {
          calendarId = matchingCalendar.id;
        }
      }
      
      if (!calendarId) {
        const enabledCalendars = getEnabledCalendars();
        calendarId = enabledCalendars[0]?.id || calendars[0]?.id || "";
      }

      // Create the event
      addEvent({
        title: parsed.title,
        description: "",
        startDate: new Date(dateStr),
        startTime: startTime!,
        endDate: new Date(dateStr),
        endTime: endTime!,
        calendarId,
      });

      // Clear input and collapse
      setInput("");
      setIsExpanded(false);
    } else {
      // Not enough confidence, open full dialog
      onOpenFullDialog();
    }
  }, [input, addEvent, calendars, getEnabledCalendars, onOpenFullDialog]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleQuickAdd();
    } else if (e.key === "Escape") {
      setIsExpanded(false);
      setInput("");
    }
  };

  if (!isExpanded) {
    return (
      <md-text-button 
        onClick={() => setIsExpanded(true)}
        style={{
          "--md-text-button-label-text-color": "hsl(var(--md-sys-color-on-primary))",
        }}
      >
        <md-icon slot="icon">bolt</md-icon>
        Quick Add
      </md-text-button>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-1 max-w-md">
      <md-filled-text-field
        ref={inputRef}
        placeholder="Team meeting tomorrow at 2pm..."
        value={input}
        onInput={(e: any) => setInput(e.target.value)}
        onKeyDown={handleKeyDown as any}
        style={{
          flexGrow: 1,
          "--md-filled-text-field-container-color": "hsl(var(--md-sys-color-surface))",
        }}
      />
      <md-filled-button 
        onClick={handleQuickAdd}
        disabled={!input.trim() ? true : undefined}
        style={{
          "--md-filled-button-container-color": "hsl(var(--md-sys-color-on-primary))",
          "--md-filled-button-label-text-color": "hsl(var(--md-sys-color-primary))",
        }}
      >
        Add
      </md-filled-button>
      <md-text-button 
        onClick={() => {
          setIsExpanded(false);
          setInput("");
        }}
        style={{
          "--md-text-button-label-text-color": "hsl(var(--md-sys-color-on-primary))",
        }}
      >
        Cancel
      </md-text-button>
    </div>
  );
}
