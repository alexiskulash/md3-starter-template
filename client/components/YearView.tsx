import { useCalendar } from "../context/CalendarContext";
import {
  getMonthsInYear,
  getCalendarDays,
  isSameDay,
  isToday,
  formatDate,
  getMonthName,
} from "../utils/dateUtils";

interface YearViewProps {
  onDateClick: (date: Date) => void;
}

export default function YearView({ onDateClick }: YearViewProps) {
  const { selectedDate, events, calendars } = useCalendar();
  const year = selectedDate.getFullYear();
  const months = getMonthsInYear(year);

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
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "24px",
        padding: "24px",
        background: "hsl(var(--md-sys-color-surface))",
        overflow: "auto",
      }}
    >
      {months.map((monthDate, monthIndex) => {
        const days = getCalendarDays(monthDate);
        const currentMonth = monthDate.getMonth();

        return (
          <div
            key={monthIndex}
            style={{
              background: "hsl(var(--md-sys-color-surface-container-low))",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            {/* Month name */}
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "500",
                color: "hsl(var(--md-sys-color-on-surface))",
                marginBottom: "12px",
                textAlign: "center",
              }}
            >
              {getMonthName(monthDate)}
            </h3>

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
                    onClick={() => onDateClick(day)}
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
                      opacity: isCurrentMonth ? 1 : 0.3,
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
      })}
    </div>
  );
}
