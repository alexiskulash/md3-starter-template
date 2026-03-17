import { useMemo } from "react";
import type { CalendarEvent } from "../pages/Calendar";

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDayClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent, e: React.MouseEvent) => void;
}

export default function MonthView({ currentDate, events, onDayClick, onEventClick }: MonthViewProps) {
  // Get calendar data for current month
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of month
    const firstDay = new Date(year, month, 1);
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday
    
    // Last day of month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Previous month's last day
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    // Build calendar grid
    const days: (Date | null)[] = [];
    
    // Add previous month's trailing days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month - 1, prevMonthLastDay - i));
    }
    
    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    // Add next month's leading days to complete the grid (6 rows)
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  }, [currentDate]);

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      gap: "clamp(4px, 1vw, 8px)",
      width: "100%",
      overflow: "hidden"
    }}>
      {/* Week day headers */}
      {weekDays.map(day => (
        <div key={day} style={{
          textAlign: "center",
          padding: "clamp(8px, 2vw, 12px) clamp(4px, 1vw, 8px)",
          fontSize: "clamp(11px, 2vw, 14px)",
          fontWeight: "500",
          color: "hsl(var(--md-sys-color-on-surface-variant))"
        }}>
          {day}
        </div>
      ))}

      {/* Calendar days */}
      {calendarData.map((date, index) => {
        if (!date) return null;
        
        const dayEvents = getEventsForDate(date);
        const today = isToday(date);
        const currentMonth = isCurrentMonth(date);
        
        return (
          <div
            key={index}
            onClick={() => onDayClick(date)}
            style={{
              minHeight: "clamp(60px, 12vw, 80px)",
              padding: "clamp(4px, 1vw, 8px)",
              background: today
                ? "hsl(var(--md-sys-color-primary-container))"
                : "hsl(var(--md-sys-color-surface-variant) / 0.3)",
              borderRadius: "clamp(4px, 1vw, 8px)",
              cursor: "pointer",
              opacity: currentMonth ? 1 : 0.5,
              transition: "all 0.2s",
              border: today ? "2px solid hsl(var(--md-sys-color-primary))" : "none"
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
            <div style={{
              fontSize: "clamp(12px, 2.5vw, 14px)",
              fontWeight: today ? "600" : "400",
              color: today
                ? "hsl(var(--md-sys-color-on-primary-container))"
                : "hsl(var(--md-sys-color-on-surface))",
              marginBottom: "clamp(2px, 0.5vw, 4px)"
            }}>
              {date.getDate()}
            </div>

            {/* Event indicators */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {dayEvents.slice(0, 2).map(event => (
                <div
                  key={event.id}
                  onClick={(e) => onEventClick(event, e)}
                  style={{
                    fontSize: "clamp(9px, 1.8vw, 11px)",
                    padding: "2px 4px",
                    borderRadius: "4px",
                    background: event.color,
                    color: "white",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  {event.title}
                </div>
              ))}
              {dayEvents.length > 2 && (
                <div style={{
                  fontSize: "10px",
                  color: "hsl(var(--md-sys-color-on-surface-variant))",
                  padding: "2px"
                }}>
                  +{dayEvents.length - 2} more
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
