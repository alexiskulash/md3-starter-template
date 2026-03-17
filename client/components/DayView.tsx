import type { CalendarEvent } from "../pages/Calendar";

interface DayViewProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onTimeSlotClick: (time: string) => void;
}

export default function DayView({ date, events, onEventClick, onTimeSlotClick }: DayViewProps) {
  // Generate time slots from 8 AM to 8 PM
  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const dayEvents = events.filter(event => 
    event.date.toDateString() === date.toDateString()
  );

  const formattedDate = date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const getEventsForTimeSlot = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    return dayEvents.filter(event => {
      const eventStartHour = parseInt(event.startTime.split(':')[0]);
      const eventEndHour = parseInt(event.endTime.split(':')[0]);
      return hour >= eventStartHour && hour < eventEndHour;
    });
  };

  return (
    <div>
      {/* Date Header */}
      <div style={{
        padding: "clamp(12px, 3vw, 16px)",
        background: "hsl(var(--md-sys-color-primary-container))",
        borderRadius: "8px",
        marginBottom: "16px"
      }}>
        <div style={{
          fontSize: "clamp(16px, 3.5vw, 20px)",
          fontWeight: "500",
          color: "hsl(var(--md-sys-color-on-primary-container))"
        }}>
          {formattedDate}
        </div>
        <div style={{
          fontSize: "clamp(12px, 2.5vw, 14px)",
          color: "hsl(var(--md-sys-color-on-primary-container))",
          marginTop: "4px",
          opacity: 0.8
        }}>
          {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'}
        </div>
      </div>

      {/* Time Slots */}
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: "4px",
        maxHeight: "600px",
        overflowY: "auto"
      }}>
        {timeSlots.map(time => {
          const slotEvents = getEventsForTimeSlot(time);
          
          return (
            <div
              key={time}
              onClick={() => onTimeSlotClick(time)}
              style={{
                display: "flex",
                gap: "12px",
                padding: "12px",
                background: "hsl(var(--md-sys-color-surface-variant) / 0.3)",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "background 0.2s",
                minHeight: "60px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "hsl(var(--md-sys-color-surface-variant) / 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "hsl(var(--md-sys-color-surface-variant) / 0.3)";
              }}
            >
              {/* Time Label */}
              <div style={{
                minWidth: "60px",
                fontSize: "14px",
                fontWeight: "500",
                color: "hsl(var(--md-sys-color-on-surface-variant))",
                paddingTop: "4px"
              }}>
                {time}
              </div>

              {/* Events in this time slot */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                {slotEvents.map(event => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      background: event.color,
                      color: "white",
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
                    <div style={{ 
                      fontSize: "14px", 
                      fontWeight: "500",
                      marginBottom: "4px"
                    }}>
                      {event.title}
                    </div>
                    <div style={{ fontSize: "12px", opacity: 0.9 }}>
                      {event.startTime} - {event.endTime}
                    </div>
                    {event.description && (
                      <div style={{ 
                        fontSize: "12px", 
                        marginTop: "4px",
                        opacity: 0.8
                      }}>
                        {event.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
