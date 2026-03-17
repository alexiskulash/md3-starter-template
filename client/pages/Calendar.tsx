import { useState, useMemo } from "react";
import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/button/text-button.js";
import "@material/web/iconbutton/filled-icon-button.js";
import "@material/web/icon/icon.js";
import "@material/web/labs/card/elevated-card.js";
import EventDialog from "../components/EventDialog";
import MonthView from "../components/MonthView";
import WeekView from "../components/WeekView";
import DayView from "../components/DayView";
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

type ViewMode = 'day' | 'week' | 'month';

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
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [events, setEvents] = useState<CalendarEvent[]>(() => generateSampleEvents());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(undefined);

  const viewTitle = useMemo(() => {
    if (viewMode === 'day') {
      return currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } else if (viewMode === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  }, [currentDate, viewMode]);

  const goToPrevious = () => {
    if (viewMode === 'day') {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 1);
      setCurrentDate(newDate);
    } else if (viewMode === 'week') {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 7);
      setCurrentDate(newDate);
    } else {
      // Month view: go to previous month, preserving the day of month when possible
      const newDate = new Date(currentDate);
      newDate.setMonth(currentDate.getMonth() - 1);
      setCurrentDate(newDate);
    }
  };

  const goToNext = () => {
    if (viewMode === 'day') {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 1);
      setCurrentDate(newDate);
    } else if (viewMode === 'week') {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 7);
      setCurrentDate(newDate);
    } else {
      // Month view: go to next month, preserving the day of month when possible
      const newDate = new Date(currentDate);
      newDate.setMonth(currentDate.getMonth() + 1);
      setCurrentDate(newDate);
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(undefined);
    setShowEventDialog(true);
  };

  const handleTimeSlotClick = (time: string) => {
    if (!selectedDate) return;
    setSelectedEvent(undefined);
    setShowEventDialog(true);
  };

  const handleEventClick = (event: CalendarEvent, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // Prevent day click
    }
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
      padding: "clamp(16px, 3vw, 32px)"
    }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "clamp(24px, 4vw, 32px)",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          {/* Title Section */}
          <div>
            <h1 style={{
              fontSize: "clamp(28px, 5vw, 40px)",
              fontWeight: "600",
              color: "hsl(var(--md-sys-color-on-surface))",
              margin: 0,
              marginBottom: "4px"
            }}>
              Calendar
            </h1>
            <p style={{
              fontSize: "clamp(13px, 2.5vw, 15px)",
              color: "hsl(var(--md-sys-color-on-surface-variant))",
              margin: 0,
              fontWeight: "400"
            }}>
              Manage your events and schedule
            </p>
          </div>

          {/* Actions Section */}
          <div style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap"
          }}>
            <md-filled-icon-button>
              <md-icon>light_mode</md-icon>
            </md-filled-icon-button>
            <md-filled-button onClick={() => {
              setSelectedDate(new Date());
              setShowEventDialog(true);
            }}>
              <md-icon slot="icon">add</md-icon>
              New Event
            </md-filled-button>
          </div>
        </div>

        {/* Navigation Bar */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px",
          padding: "16px 0"
        }}>
          {/* Left: View Tabs and Today's Date */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap"
          }}>
            {/* View Tabs */}
            <div style={{
              display: "flex",
              gap: "8px",
              background: "hsl(var(--md-sys-color-surface-variant) / 0.4)",
              padding: "4px",
              borderRadius: "8px"
            }}>
              <md-filled-button
                onClick={() => setViewMode('month')}
                style={{
                  background: viewMode === 'month'
                    ? "hsl(var(--md-sys-color-primary))"
                    : "transparent",
                  color: viewMode === 'month'
                    ? "hsl(var(--md-sys-color-on-primary))"
                    : "hsl(var(--md-sys-color-on-surface))",
                  minWidth: "80px"
                }}
              >
                Month
              </md-filled-button>
              <md-filled-button
                onClick={() => setViewMode('week')}
                style={{
                  background: viewMode === 'week'
                    ? "hsl(var(--md-sys-color-primary))"
                    : "transparent",
                  color: viewMode === 'week'
                    ? "hsl(var(--md-sys-color-on-primary))"
                    : "hsl(var(--md-sys-color-on-surface))",
                  minWidth: "80px"
                }}
              >
                Week
              </md-filled-button>
              <md-filled-button
                onClick={() => setViewMode('day')}
                style={{
                  background: viewMode === 'day'
                    ? "hsl(var(--md-sys-color-primary))"
                    : "transparent",
                  color: viewMode === 'day'
                    ? "hsl(var(--md-sys-color-on-primary))"
                    : "hsl(var(--md-sys-color-on-surface))",
                  minWidth: "80px"
                }}
              >
                Day
              </md-filled-button>
            </div>

            {/* Current Date Display */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px 16px",
              background: "hsl(var(--md-sys-color-surface-variant) / 0.4)",
              borderRadius: "8px"
            }}>
              <md-icon style={{
                fontSize: "24px",
                color: "hsl(var(--md-sys-color-primary))"
              }}>
                calendar_today
              </md-icon>
              <div>
                <div style={{
                  fontSize: "12px",
                  color: "hsl(var(--md-sys-color-on-surface-variant))",
                  fontWeight: "500",
                  marginBottom: "2px"
                }}>
                  {currentDate.toDateString() === new Date().toDateString() ? 'Today' : 'Selected Date'}
                </div>
                <div style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "hsl(var(--md-sys-color-on-surface))"
                }}>
                  {currentDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Month Navigation */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "16px"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>
              <md-icon style={{
                fontSize: "28px",
                color: "hsl(var(--md-sys-color-primary))"
              }}>
                calendar_month
              </md-icon>
              <h2 style={{
                fontSize: "clamp(18px, 4vw, 24px)",
                fontWeight: "600",
                color: "hsl(var(--md-sys-color-on-surface))",
                margin: 0
              }}>
                {viewTitle}
              </h2>
            </div>

            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <md-filled-icon-button onClick={goToPrevious}>
                <md-icon>chevron_left</md-icon>
              </md-filled-icon-button>
              <md-text-button onClick={goToToday}>Today</md-text-button>
              <md-filled-icon-button onClick={goToNext}>
                <md-icon>chevron_right</md-icon>
              </md-filled-icon-button>
            </div>
          </div>
        </div>

        {/* Calendar Card */}
        <md-elevated-card style={{ width: "100%", overflow: "hidden" }}>
          <div style={{ padding: "clamp(16px, 3vw, 24px)", overflow: "hidden" }}>
            {/* View Content */}
            <div style={{ width: "100%", overflow: "hidden" }}>
              {viewMode === 'month' && (
                <MonthView
                  currentDate={currentDate}
                  events={events}
                  onDayClick={handleDayClick}
                  onEventClick={handleEventClick}
                />
              )}

              {viewMode === 'week' && (
                <WeekView
                  date={currentDate}
                  events={events}
                  onEventClick={(event) => handleEventClick(event)}
                  onDayClick={handleDayClick}
                />
              )}

              {viewMode === 'day' && (
                <DayView
                  date={currentDate}
                  events={events}
                  onEventClick={(event) => handleEventClick(event)}
                  onTimeSlotClick={handleTimeSlotClick}
                />
              )}
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
