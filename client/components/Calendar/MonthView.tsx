import { Calendar, CalendarEvent } from "../../types/calendar";

interface MonthViewProps {
  currentDate: Date;
  selectedDate: Date;
  events: CalendarEvent[];
  calendars: Calendar[];
  onDateSelect: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export default function MonthView({
  currentDate,
  selectedDate,
  events,
  calendars,
  onDateSelect,
  onEventClick,
}: MonthViewProps) {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const getPreviousMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 0).getDate();
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return events.filter((event) => event.startDate === dateStr);
  };

  const getCalendarColor = (calendarId: string) => {
    const calendar = calendars.find((c) => c.id === calendarId);
    return calendar?.color || "hsl(var(--md-sys-color-primary))";
  };

  const renderWeekDays = () => {
    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return weekDays.map((day) => (
      <div
        key={day}
        style={{
          padding: "12px",
          fontSize: "14px",
          fontWeight: "600",
          color: "hsl(var(--md-sys-color-on-surface-variant))",
          textAlign: "center",
          borderBottom: "1px solid hsl(var(--md-sys-color-outline-variant))",
        }}
      >
        {day}
      </div>
    ));
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const previousMonthDays = getPreviousMonthDays(currentDate);
    const days: JSX.Element[] = [];

    // Previous month's days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = previousMonthDays - i;
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, day);

      days.push(
        <div
          key={`prev-${day}`}
          style={{
            minHeight: "120px",
            padding: "8px",
            background: "hsl(var(--md-sys-color-surface-container-lowest))",
            borderBottom: "1px solid hsl(var(--md-sys-color-outline-variant))",
            borderRight: "1px solid hsl(var(--md-sys-color-outline-variant))",
            opacity: 0.4,
          }}
        >
          <div
            style={{
              fontSize: "14px",
              color: "hsl(var(--md-sys-color-on-surface-variant))",
              marginBottom: "4px",
            }}
          >
            {day}
          </div>
        </div>
      );
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isSelected =
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear();
      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === currentDate.getMonth() &&
        new Date().getFullYear() === currentDate.getFullYear();

      // Show max 3 events, then "+X more"
      const visibleEvents = dayEvents.slice(0, 3);
      const hiddenCount = dayEvents.length - 3;

      days.push(
        <div
          key={day}
          onClick={() => onDateSelect(date)}
          style={{
            minHeight: "120px",
            padding: "8px",
            background: isSelected
              ? "hsl(var(--md-sys-color-primary-container) / 0.2)"
              : "hsl(var(--md-sys-color-surface))",
            borderBottom: "1px solid hsl(var(--md-sys-color-outline-variant))",
            borderRight: "1px solid hsl(var(--md-sys-color-outline-variant))",
            cursor: "pointer",
            transition: "background 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (!isSelected) {
              e.currentTarget.style.background =
                "hsl(var(--md-sys-color-surface-container-highest))";
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              e.currentTarget.style.background = "hsl(var(--md-sys-color-surface))";
            }
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "4px",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                fontWeight: isToday ? "600" : "400",
                color: isToday
                  ? "hsl(var(--md-sys-color-primary))"
                  : "hsl(var(--md-sys-color-on-surface))",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                background: isToday
                  ? "hsl(var(--md-sys-color-primary-container))"
                  : "transparent",
              }}
            >
              {day}
            </div>
          </div>

          {/* Events */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {visibleEvents.map((event) => (
              <div
                key={event.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick(event);
                }}
                style={{
                  background: getCalendarColor(event.calendarId),
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  cursor: "pointer",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  transition: "opacity 0.2s ease",
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
            {hiddenCount > 0 && (
              <div
                style={{
                  fontSize: "11px",
                  color: "hsl(var(--md-sys-color-on-surface-variant))",
                  padding: "2px 8px",
                }}
              >
                +{hiddenCount} more
              </div>
            )}
          </div>
        </div>
      );
    }

    // Next month's days to fill the grid
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const nextMonthDays = totalCells - (firstDay + daysInMonth);

    for (let day = 1; day <= nextMonthDays; day++) {
      days.push(
        <div
          key={`next-${day}`}
          style={{
            minHeight: "120px",
            padding: "8px",
            background: "hsl(var(--md-sys-color-surface-container-lowest))",
            borderBottom: "1px solid hsl(var(--md-sys-color-outline-variant))",
            borderRight: "1px solid hsl(var(--md-sys-color-outline-variant))",
            opacity: 0.4,
          }}
        >
          <div
            style={{
              fontSize: "14px",
              color: "hsl(var(--md-sys-color-on-surface-variant))",
              marginBottom: "4px",
            }}
          >
            {day}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div
      style={{
        background: "hsl(var(--md-sys-color-surface))",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid hsl(var(--md-sys-color-outline-variant))",
      }}
    >
      {/* Week days header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          background: "hsl(var(--md-sys-color-surface-container))",
        }}
      >
        {renderWeekDays()}
      </div>

      {/* Calendar grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {renderCalendarDays()}
      </div>
    </div>
  );
}
