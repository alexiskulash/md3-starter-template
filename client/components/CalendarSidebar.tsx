import "@material/web/checkbox/checkbox.js";
import type { Calendar } from "../types/calendar";

interface CalendarSidebarProps {
  calendars: Calendar[];
  selectedDate: Date;
  onToggleCalendar: (calendarId: string) => void;
  onDateSelect: (date: Date) => void;
}

export function CalendarSidebar({
  calendars,
  selectedDate,
  onToggleCalendar,
  onDateSelect,
}: CalendarSidebarProps) {
  // Generate mini calendar for current month
  const generateMiniCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: (number | null)[] = [];

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const days = generateMiniCalendar();
  const today = new Date();
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      selectedDate.getMonth() === selectedDate.getMonth() &&
      selectedDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <aside
      style={{
        width: "280px",
        borderRight: "1px solid hsl(var(--md-sys-color-outline-variant))",
        background: "hsl(var(--md-sys-color-surface))",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
      className="calendar-sidebar"
    >
      {/* Mini Calendar */}
      <div>
        <h3
          style={{
            fontSize: "14px",
            fontWeight: "500",
            color: "hsl(var(--md-sys-color-on-surface))",
            marginBottom: "12px",
          }}
        >
          {selectedDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "4px",
          }}
        >
          {/* Day headers */}
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                fontSize: "12px",
                fontWeight: "500",
                color: "hsl(var(--md-sys-color-on-surface-variant))",
                padding: "4px",
              }}
            >
              {day}
            </div>
          ))}

          {/* Day cells */}
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => {
                if (day) {
                  const newDate = new Date(selectedDate);
                  newDate.setDate(day);
                  onDateSelect(newDate);
                }
              }}
              disabled={!day}
              style={{
                aspectRatio: "1",
                border: "none",
                borderRadius: "50%",
                background: day
                  ? isSelected(day)
                    ? "hsl(var(--md-sys-color-primary))"
                    : isToday(day)
                    ? "hsl(var(--md-sys-color-primary-container))"
                    : "transparent"
                  : "transparent",
                color: day
                  ? isSelected(day)
                    ? "hsl(var(--md-sys-color-on-primary))"
                    : isToday(day)
                    ? "hsl(var(--md-sys-color-on-primary-container))"
                    : "hsl(var(--md-sys-color-on-surface))"
                  : "transparent",
                fontSize: "12px",
                fontWeight: isToday(day) ? "600" : "400",
                cursor: day ? "pointer" : "default",
                transition: "background 0.2s",
              }}
            >
              {day || ""}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar List */}
      <div>
        <h3
          style={{
            fontSize: "14px",
            fontWeight: "500",
            color: "hsl(var(--md-sys-color-on-surface))",
            marginBottom: "12px",
          }}
        >
          My Calendars
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {calendars.map((calendar) => (
            <label
              key={calendar.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "4px",
                cursor: "pointer",
                opacity: calendar.enabled ? 1 : 0.5,
              }}
            >
              <md-checkbox
                checked={calendar.enabled ? true : undefined}
                onClick={() => onToggleCalendar(calendar.id)}
              />
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: calendar.color,
                }}
              />
              <span
                style={{
                  fontSize: "14px",
                  color: "hsl(var(--md-sys-color-on-surface))",
                }}
              >
                {calendar.name}
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
