import { useState, useMemo } from "react";
import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/button/text-button.js";
import "@material/web/iconbutton/filled-icon-button.js";
import "@material/web/icon/icon.js";
import "@material/web/labs/card/elevated-card.js";
import EventDialog from "../components/EventDialog";
import { generateSampleEvents } from "../utils/sampleEvents";

// Types
export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  color: string;
}

// Declare custom elements for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "md-filled-button": any;
      "md-outlined-button": any;
      "md-text-button": any;
      "md-filled-icon-button": any;
      "md-icon": any;
      "md-elevated-card": any;
    }
  }
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(() => generateSampleEvents());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(undefined);

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

  const monthName = useMemo(() => {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [currentDate]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(undefined);
    setShowEventDialog(true);
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent day click
    setSelectedDate(event.date);
    setSelectedEvent(event);
    setShowEventDialog(true);
  };

  const handleSaveEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    if (selectedEvent) {
      // Update existing event
      setEvents(events.map(evt =>
        evt.id === selectedEvent.id
          ? { ...eventData, id: selectedEvent.id }
          : evt
      ));
    } else {
      // Create new event
      const newEvent: CalendarEvent = {
        ...eventData,
        id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      setEvents([...events, newEvent]);
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(evt => evt.id !== eventId));
  };

  const handleCloseDialog = () => {
    setShowEventDialog(false);
    setSelectedEvent(undefined);
  };

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
      minHeight: "100vh",
      background: "hsl(var(--md-sys-color-background))",
      padding: "24px"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <h1 style={{
            fontSize: "32px",
            fontWeight: "500",
            color: "hsl(var(--md-sys-color-on-surface))",
            margin: 0
          }}>
            Calendar
          </h1>
          
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <md-text-button onClick={goToToday}>Today</md-text-button>
            <md-filled-button onClick={() => {
              setSelectedDate(new Date());
              setShowEventDialog(true);
            }}>
              <md-icon slot="icon">add</md-icon>
              New Event
            </md-filled-button>
          </div>
        </div>

        {/* Calendar Card */}
        <md-elevated-card style={{ width: "100%" }}>
          <div style={{ padding: "24px" }}>
            {/* Month Navigation */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px"
            }}>
              <md-filled-icon-button onClick={goToPreviousMonth}>
                <md-icon>chevron_left</md-icon>
              </md-filled-icon-button>
              
              <h2 style={{
                fontSize: "24px",
                fontWeight: "500",
                color: "hsl(var(--md-sys-color-on-surface))",
                margin: 0
              }}>
                {monthName}
              </h2>
              
              <md-filled-icon-button onClick={goToNextMonth}>
                <md-icon>chevron_right</md-icon>
              </md-filled-icon-button>
            </div>

            {/* Calendar Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "8px"
            }}>
              {/* Week day headers */}
              {weekDays.map(day => (
                <div key={day} style={{
                  textAlign: "center",
                  padding: "12px 8px",
                  fontSize: "14px",
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
                    onClick={() => handleDayClick(date)}
                    style={{
                      minHeight: "80px",
                      padding: "8px",
                      background: today 
                        ? "hsl(var(--md-sys-color-primary-container))"
                        : "hsl(var(--md-sys-color-surface-variant) / 0.3)",
                      borderRadius: "8px",
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
                      fontSize: "14px",
                      fontWeight: today ? "600" : "400",
                      color: today 
                        ? "hsl(var(--md-sys-color-on-primary-container))"
                        : "hsl(var(--md-sys-color-on-surface))",
                      marginBottom: "4px"
                    }}>
                      {date.getDate()}
                    </div>
                    
                    {/* Event indicators */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      {dayEvents.slice(0, 2).map(event => (
                        <div
                          key={event.id}
                          onClick={(e) => handleEventClick(event, e)}
                          style={{
                            fontSize: "11px",
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
          </div>
        </md-elevated-card>
      </div>

      {/* Event Dialog */}
      <EventDialog
        open={showEventDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        selectedDate={selectedDate}
        existingEvent={selectedEvent}
      />
    </div>
  );
}
