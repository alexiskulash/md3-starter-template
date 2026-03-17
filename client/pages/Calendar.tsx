import { useState, useMemo } from "react";
import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/button/text-button.js";
import "@material/web/iconbutton/filled-icon-button.js";
import "@material/web/icon/icon.js";
import "@material/web/labs/card/elevated-card.js";
import "@material/web/tabs/tabs.js";
import "@material/web/tabs/primary-tab.js";
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
      "md-tabs": any;
      "md-primary-tab": any;
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
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
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
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
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
      padding: "clamp(12px, 3vw, 24px)"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "clamp(16px, 3vw, 24px)",
          flexWrap: "wrap",
          gap: "12px"
        }}>
          <h1 style={{
            fontSize: "clamp(24px, 5vw, 32px)",
            fontWeight: "500",
            color: "hsl(var(--md-sys-color-on-surface))",
            margin: 0
          }}>
            Calendar
          </h1>

          <div style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            flexWrap: "wrap"
          }}>
            <md-text-button onClick={goToToday}>Today</md-text-button>
            <md-filled-button onClick={() => {
              setSelectedDate(new Date());
              setShowEventDialog(true);
            }}>
              <md-icon slot="icon">add</md-icon>
              <span style={{ display: "inline" }}>New Event</span>
            </md-filled-button>
          </div>
        </div>

        {/* Calendar Card */}
        <md-elevated-card style={{ width: "100%", overflow: "hidden" }}>
          <div style={{ padding: "16px", overflow: "hidden" }}>
            {/* View Tabs */}
            <md-tabs
              style={{ marginBottom: "16px", width: "100%" }}
              onchange={(e: any) => {
                const selectedIndex = e.target.activeTabIndex;
                if (selectedIndex === 0) setViewMode('day');
                else if (selectedIndex === 1) setViewMode('week');
                else if (selectedIndex === 2) setViewMode('month');
              }}
            >
              <md-primary-tab active={viewMode === 'day' ? true : undefined}>
                <md-icon slot="icon">calendar_view_day</md-icon>
                Day
              </md-primary-tab>
              <md-primary-tab active={viewMode === 'week' ? true : undefined}>
                <md-icon slot="icon">calendar_view_week</md-icon>
                Week
              </md-primary-tab>
              <md-primary-tab active={viewMode === 'month' ? true : undefined}>
                <md-icon slot="icon">calendar_view_month</md-icon>
                Month
              </md-primary-tab>
            </md-tabs>
            {/* Navigation */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
              flexWrap: "wrap",
              gap: "12px"
            }}>
              <md-filled-icon-button onClick={goToPrevious}>
                <md-icon>chevron_left</md-icon>
              </md-filled-icon-button>

              <h2 style={{
                fontSize: "clamp(16px, 4vw, 24px)",
                fontWeight: "500",
                color: "hsl(var(--md-sys-color-on-surface))",
                margin: 0,
                textAlign: "center",
                flex: "1"
              }}>
                {viewTitle}
              </h2>

              <md-filled-icon-button onClick={goToNext}>
                <md-icon>chevron_right</md-icon>
              </md-filled-icon-button>
            </div>

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
