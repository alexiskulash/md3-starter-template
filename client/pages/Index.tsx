import { useState, useMemo } from "react";
import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/icon/icon.js";
import "@material/web/iconbutton/icon-button.js";

import CalendarHeader from "../components/Calendar/CalendarHeader";
import CalendarSidebar from "../components/Calendar/CalendarSidebar";
import MonthView from "../components/Calendar/MonthView";
import YearView from "../components/Calendar/YearView";
import EventDialog from "../components/Calendar/EventDialog";

import { Calendar, CalendarEvent, ViewMode } from "../types/calendar";
import { defaultCalendars, sampleEvents } from "../data/sampleData";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "md-filled-button": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      "md-outlined-button": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      "md-icon": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      "md-icon-button": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

export default function Index() {
  const [calendars, setCalendars] = useState<Calendar[]>(defaultCalendars);
  const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents);
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  // Toggle calendar visibility
  const handleToggleCalendar = (calendarId: string) => {
    setCalendars(prev =>
      prev.map(cal =>
        cal.id === calendarId ? { ...cal, enabled: !cal.enabled } : cal
      )
    );
  };

  // Filter events by enabled calendars
  const visibleEvents = useMemo(() => {
    const enabledCalendarIds = calendars.filter(c => c.enabled).map(c => c.id);
    return events.filter(event => enabledCalendarIds.includes(event.calendarId));
  }, [events, calendars]);

  // Navigation
  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setFullYear(newDate.getFullYear() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Event handlers
  const handleCreateEvent = (event: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString(),
    };
    setEvents(prev => [...prev, newEvent]);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateEvent = (event: CalendarEvent) => {
    setEvents(prev => prev.map(e => (e.id === event.id ? event : e)));
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    setEditingEvent(null);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setEditingEvent(event);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "hsl(var(--md-sys-color-surface))",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <CalendarHeader
        viewMode={viewMode}
        currentDate={currentDate}
        onViewModeChange={setViewMode}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
        onCreate={() => setIsCreateDialogOpen(true)}
      />

      {/* Main Content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <CalendarSidebar
          calendars={calendars}
          currentDate={currentDate}
          selectedDate={selectedDate}
          onToggleCalendar={handleToggleCalendar}
          onDateSelect={handleDateSelect}
        />

        {/* Calendar View */}
        <main style={{ flex: 1, overflow: "auto", padding: "24px" }}>
          {viewMode === "month" ? (
            <MonthView
              currentDate={currentDate}
              selectedDate={selectedDate}
              events={visibleEvents}
              calendars={calendars}
              onDateSelect={handleDateSelect}
              onEventClick={handleEventClick}
            />
          ) : (
            <YearView
              currentDate={currentDate}
              selectedDate={selectedDate}
              events={visibleEvents}
              onDateSelect={handleDateSelect}
            />
          )}
        </main>
      </div>

      {/* Create Event Dialog */}
      {isCreateDialogOpen && (
        <EventDialog
          calendars={calendars.filter(c => c.enabled)}
          selectedDate={selectedDate}
          onSave={handleCreateEvent}
          onClose={() => setIsCreateDialogOpen(false)}
        />
      )}

      {/* Edit Event Dialog */}
      {editingEvent && (
        <EventDialog
          event={editingEvent}
          calendars={calendars}
          selectedDate={selectedDate}
          onSave={handleUpdateEvent}
          onDelete={handleDeleteEvent}
          onClose={() => setEditingEvent(null)}
        />
      )}
    </div>
  );
}
