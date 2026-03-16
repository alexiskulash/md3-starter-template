import { useCalendar } from "../context/CalendarContext";
import { CalendarEvent } from "../types/calendar";
import {
  getCalendarDays,
  isSameDay,
  isToday,
  formatDate,
} from "../utils/dateUtils";

interface MonthViewProps {
  onEventClick: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
}

export default function MonthView({ onEventClick, onDateClick }: MonthViewProps) {
  const { selectedDate, events, calendars } = useCalendar();
  const days = getCalendarDays(selectedDate);
  const currentMonth = selectedDate.getMonth();

  // Get events for a specific date
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateStr = formatDate(date);
    const enabledCalendarIds = calendars
      .filter((c) => c.enabled)
      .map((c) => c.id);

    return events
      .filter(
        (event) =>
          event.startDate === dateStr &&
          enabledCalendarIds.includes(event.calendarId)
      )
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  // Get calendar color
  const getCalendarColor = (calendarId: string): string => {
    return calendars.find((c) => c.id === calendarId)?.color || "#1976D2";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "hsl(var(--md-sys-color-surface))",
      }}
    >
      {/* Day headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          borderBottom: "1px solid hsl(var(--md-sys-color-outline-variant))",
        }}
      >
        {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
          (day) => (
            <div
              key={day}
              style={{
                padding: "12px",
                fontSize: "14px",
                fontWeight: "500",
                color: "hsl(var(--md-sys-color-on-surface-variant))",
                textAlign: "center",
                borderRight: "1px solid hsl(var(--md-sys-color-outline-variant))",
              }}
            >
              {day}
            </div>
          )
        )}
      </div>

      {/* Calendar grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gridTemplateRows: "repeat(6, 1fr)",
          flex: 1,
          overflow: "auto",
        }}
      >
        {days.map((day, i) => {
          const isCurrentMonth = day.getMonth() === currentMonth;
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);
          const dayEvents = getEventsForDate(day);
          const visibleEvents = dayEvents.slice(0, 3);
          const moreCount = dayEvents.length - 3;

          return (
            <div
              key={i}
              onClick={() => onDateClick(day)}
              style={{
                minHeight: "100px",
                borderRight: "1px solid hsl(var(--md-sys-color-outline-variant))",
                borderBottom: "1px solid hsl(var(--md-sys-color-outline-variant))",
                padding: "8px",
                background: isSelected
                  ? "hsl(var(--md-sys-color-surface-container-highest))"
                  : "transparent",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                overflow: "hidden",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background =
                    "hsl(var(--md-sys-color-surface-container-low))";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {/* Date number */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: isCurrentMonth
                    ? "hsl(var(--md-sys-color-on-surface))"
                    : "hsl(var(--md-sys-color-on-surface-variant))",
                  background: isTodayDate
                    ? "hsl(var(--md-sys-color-primary))"
                    : "transparent",
                  ...(isTodayDate && {
                    color: "hsl(var(--md-sys-color-on-primary))",
                  }),
                  opacity: isCurrentMonth ? 1 : 0.5,
                }}
              >
                {day.getDate()}
              </div>

              {/* Events */}
              {visibleEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick(event);
                  }}
                  style={{
                    fontSize: "12px",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    background: getCalendarColor(event.calendarId),
                    color: "white",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  {event.startTime} {event.title}
                </div>
              ))}

              {/* More indicator */}
              {moreCount > 0 && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "hsl(var(--md-sys-color-on-surface-variant))",
                    padding: "4px 8px",
                  }}
                >
                  +{moreCount} more
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
