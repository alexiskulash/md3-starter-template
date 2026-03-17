import type { CalendarEvent } from "../pages/Calendar";

interface WeekViewProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDayClick: (date: Date) => void;
}

export default function WeekView({ date, events, onEventClick, onDayClick }: WeekViewProps) {
  // Get the start of the week (Sunday)
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());

  // Generate week days
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return day;
  });

  const getEventsForDate = (targetDate: Date) => {
    return events.filter(event => 
      event.date.toDateString() === targetDate.toDateString()
    );
  };

  const isToday = (targetDate: Date) => {
    const today = new Date();
    return targetDate.toDateString() === today.toDateString();
  };

  const weekRange = `${weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  return (
    <div style={{ width: "100%", overflow: "hidden" }}>
      {/* Week Header */}
      <div style={{
        padding: "16px",
        background: "hsl(var(--md-sys-color-primary-container))",
        borderRadius: "8px",
        marginBottom: "16px"
      }}>
        <div style={{
          fontSize: "20px",
          fontWeight: "500",
          color: "hsl(var(--md-sys-color-on-primary-container))"
        }}>
          Week of {weekRange}
        </div>
      </div>

      {/* Week Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        gap: "clamp(8px, 2vw, 12px)",
        width: "100%",
        overflow: "hidden"
      }}>
        {weekDays.map((day, index) => {
          const dayEvents = getEventsForDate(day);
          const today = isToday(day);

          return (
            <div
              key={index}
              onClick={() => onDayClick(day)}
              style={{
                background: today 
                  ? "hsl(var(--md-sys-color-primary-container))"
                  : "hsl(var(--md-sys-color-surface-variant) / 0.3)",
                borderRadius: "12px",
                padding: "16px",
                cursor: "pointer",
                transition: "all 0.2s",
                border: today ? "2px solid hsl(var(--md-sys-color-primary))" : "none",
                minHeight: "200px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = today
                  ? "hsl(var(--md-sys-color-primary-container))"
                  : "hsl(var(--md-sys-color-surface-variant) / 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = today
                  ? "hsl(var(--md-sys-color-primary-container))"
                  : "hsl(var(--md-sys-color-surface-variant) / 0.3)";
              }}
            >
              {/* Day Header */}
              <div style={{ marginBottom: "12px" }}>
                <div style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  color: today
                    ? "hsl(var(--md-sys-color-on-primary-container))"
                    : "hsl(var(--md-sys-color-on-surface-variant))",
                  textTransform: "uppercase",
                  marginBottom: "4px"
                }}>
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div style={{
                  fontSize: "24px",
                  fontWeight: today ? "600" : "500",
                  color: today
                    ? "hsl(var(--md-sys-color-on-primary-container))"
                    : "hsl(var(--md-sys-color-on-surface))"
                }}>
                  {day.getDate()}
                </div>
              </div>

              {/* Events */}
              <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                gap: "6px",
                maxHeight: "140px",
                overflowY: "auto"
              }}>
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    style={{
                      padding: "8px",
                      borderRadius: "6px",
                      background: event.color,
                      color: "white",
                      fontSize: "12px",
                      cursor: "pointer",
                      transition: "opacity 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                  >
                    <div style={{ fontWeight: "500", marginBottom: "2px" }}>
                      {event.title}
                    </div>
                    <div style={{ fontSize: "11px", opacity: 0.9 }}>
                      {event.startTime}
                    </div>
                  </div>
                ))}
                {dayEvents.length === 0 && (
                  <div style={{
                    fontSize: "12px",
                    color: "hsl(var(--md-sys-color-on-surface-variant))",
                    opacity: 0.6,
                    fontStyle: "italic"
                  }}>
                    No events
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
