import "@material/web/icon/icon.js";
import "@material/web/iconbutton/icon-button.js";
import { useCalendar } from "../context/CalendarContext";
import {
  getMonthName,
  getYear,
  getCalendarDays,
  isSameDay,
  isToday,
  addMonths,
  formatDate,
} from "../utils/dateUtils";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "md-icon": any;
      "md-icon-button": any;
    }
  }
}

export default function MiniCalendar() {
  const { selectedDate, setSelectedDate, events, calendars } = useCalendar();
  const days = getCalendarDays(selectedDate);
  const currentMonth = selectedDate.getMonth();

  const handlePrevMonth = () => {
    setSelectedDate(addMonths(selectedDate, -1));
  };

  const handleNextMonth = () => {
    setSelectedDate(addMonths(selectedDate, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  // Check if a date has events
  const hasEvents = (date: Date): boolean => {
    const dateStr = formatDate(date);
    const enabledCalendarIds = calendars
      .filter((c) => c.enabled)
      .map((c) => c.id);
    return events.some(
      (event) =>
        event.startDate === dateStr &&
        enabledCalendarIds.includes(event.calendarId)
    );
  };

  return (
    <div
      style={{
        background: "hsl(var(--md-sys-color-surface-container-low))",
        borderRadius: "12px",
        padding: "12px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <span
          style={{
            fontSize: "14px",
            fontWeight: "500",
            color: "hsl(var(--md-sys-color-on-surface))",
          }}
        >
          {getMonthName(selectedDate)} {getYear(selectedDate)}
        </span>
        <div style={{ display: "flex", gap: "4px" }}>
          <md-icon-button onClick={handlePrevMonth}>
            <md-icon style={{ fontSize: "18px" }}>chevron_left</md-icon>
          </md-icon-button>
          <md-icon-button onClick={handleNextMonth}>
            <md-icon style={{ fontSize: "18px" }}>chevron_right</md-icon>
          </md-icon-button>
        </div>
      </div>

      {/* Day headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "2px",
          marginBottom: "4px",
        }}
      >
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div
            key={i}
            style={{
              fontSize: "11px",
              fontWeight: "500",
              color: "hsl(var(--md-sys-color-on-surface-variant))",
              textAlign: "center",
              padding: "4px 0",
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "2px",
        }}
      >
        {days.map((day, i) => {
          const isCurrentMonth = day.getMonth() === currentMonth;
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);
          const hasEventsOnDay = hasEvents(day);

          return (
            <button
              key={i}
              onClick={() => handleDateClick(day)}
              style={{
                position: "relative",
                fontSize: "12px",
                padding: "6px",
                background: isSelected
                  ? "hsl(var(--md-sys-color-primary))"
                  : "transparent",
                color: isSelected
                  ? "hsl(var(--md-sys-color-on-primary))"
                  : isCurrentMonth
                    ? "hsl(var(--md-sys-color-on-surface))"
                    : "hsl(var(--md-sys-color-on-surface-variant))",
                border: isTodayDate && !isSelected
                  ? "1px solid hsl(var(--md-sys-color-primary))"
                  : "1px solid transparent",
                borderRadius: "50%",
                cursor: "pointer",
                opacity: isCurrentMonth ? 1 : 0.4,
                aspectRatio: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background =
                    "hsl(var(--md-sys-color-surface-variant))";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {day.getDate()}
              {hasEventsOnDay && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "2px",
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: isSelected
                      ? "hsl(var(--md-sys-color-on-primary))"
                      : "hsl(var(--md-sys-color-primary))",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
