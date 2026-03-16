import { useState, useEffect } from "react";
import { useCalendar } from "../hooks/useCalendar";
import { CalendarHeader } from "../components/CalendarHeader";
import { CalendarSidebar } from "../components/CalendarSidebar";
import { MonthView } from "../components/MonthView";
import { YearView } from "../components/YearView";
import { EventDialog } from "../components/EventDialog";
import type { CalendarEvent } from "../types/calendar";

export default function Index() {
  const calendar = useCalendar();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  // Populate with sample events
  useEffect(() => {
    // Only populate if there are no events
    if (calendar.events.length === 0) {
      const now = new Date();
      const today = now.toISOString().split("T")[0];

      // Helper to create date strings
      const getDateStr = (daysOffset: number) => {
        const date = new Date(now);
        date.setDate(date.getDate() + daysOffset);
        return date.toISOString().split("T")[0];
      };

      const sampleEvents = [
        {
          title: "Team Standup",
          startDate: today,
          endDate: today,
          startTime: "10:00",
          endTime: "10:30",
          description: "Daily team sync meeting",
          calendarId: "work",
        },
        {
          title: "Project Review",
          startDate: getDateStr(2),
          endDate: getDateStr(2),
          startTime: "14:00",
          endTime: "15:30",
          description: "Q1 project review with stakeholders",
          calendarId: "work",
        },
        {
          title: "Dentist Appointment",
          startDate: getDateStr(5),
          endDate: getDateStr(5),
          startTime: "09:00",
          endTime: "10:00",
          description: "Regular checkup",
          calendarId: "personal",
        },
        {
          title: "Gym Session",
          startDate: getDateStr(1),
          endDate: getDateStr(1),
          startTime: "06:30",
          endTime: "07:30",
          description: "Morning workout",
          calendarId: "personal",
        },
        {
          title: "Family Dinner",
          startDate: getDateStr(3),
          endDate: getDateStr(3),
          startTime: "18:00",
          endTime: "20:00",
          description: "Dinner at Mom's place",
          calendarId: "family",
        },
        {
          title: "Client Presentation",
          startDate: getDateStr(7),
          endDate: getDateStr(7),
          startTime: "11:00",
          endTime: "12:00",
          description: "Present new design proposals",
          calendarId: "work",
        },
        {
          title: "Weekend Getaway",
          startDate: getDateStr(10),
          endDate: getDateStr(12),
          startTime: "09:00",
          endTime: "17:00",
          description: "Road trip to the mountains",
          calendarId: "personal",
        },
        {
          title: "Birthday Party",
          startDate: getDateStr(15),
          endDate: getDateStr(15),
          startTime: "15:00",
          endTime: "18:00",
          description: "Sarah's birthday celebration",
          calendarId: "family",
        },
        {
          title: "Team Building Event",
          startDate: getDateStr(20),
          endDate: getDateStr(20),
          startTime: "13:00",
          endTime: "17:00",
          description: "Outdoor team building activities",
          calendarId: "work",
        },
        {
          title: "Yoga Class",
          startDate: getDateStr(-2),
          endDate: getDateStr(-2),
          startTime: "07:00",
          endTime: "08:00",
          description: "Morning yoga session",
          calendarId: "personal",
        },
        {
          title: "Budget Planning",
          startDate: getDateStr(-5),
          endDate: getDateStr(-5),
          startTime: "10:00",
          endTime: "11:30",
          description: "Monthly budget review",
          calendarId: "work",
        },
        {
          title: "Movie Night",
          startDate: getDateStr(8),
          endDate: getDateStr(8),
          startTime: "19:00",
          endTime: "22:00",
          description: "Family movie night at home",
          calendarId: "family",
        },
      ];

      sampleEvents.forEach((event) => calendar.createEvent(event));
    }
  }, []);

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setDialogOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setEditingEvent(event);
    setDialogOpen(true);
  };

  const handleSaveEvent = (eventData: Omit<CalendarEvent, "id">) => {
    if (editingEvent) {
      calendar.updateEvent(editingEvent.id, eventData);
    } else {
      calendar.createEvent(eventData);
    }
    setDialogOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    calendar.deleteEvent(eventId);
    setDialogOpen(false);
    setEditingEvent(null);
  };

  const handleNavigation = () => {
    if (calendar.currentView === "month") {
      return {
        onPrevious: calendar.goToPreviousMonth,
        onNext: calendar.goToNextMonth,
      };
    } else {
      return {
        onPrevious: calendar.goToPreviousYear,
        onNext: calendar.goToNextYear,
      };
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "hsl(var(--md-sys-color-background))",
      }}
    >
      {/* Header */}
      <CalendarHeader
        currentDate={calendar.selectedDate}
        currentView={calendar.currentView}
        onViewChange={calendar.setCurrentView}
        onPrevious={handleNavigation().onPrevious}
        onNext={handleNavigation().onNext}
        onToday={calendar.goToToday}
        onCreateEvent={handleCreateEvent}
      />

      {/* Main content area with sidebar */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar - hidden on mobile */}
        <div className="sidebar-container">
          <CalendarSidebar
            calendars={calendar.calendars}
            selectedDate={calendar.selectedDate}
            onToggleCalendar={calendar.toggleCalendar}
            onDateSelect={calendar.setSelectedDate}
          />
        </div>

        {/* Main calendar view */}
        {calendar.currentView === "month" ? (
          <MonthView
            currentDate={calendar.selectedDate}
            events={calendar.visibleEvents}
            calendars={calendar.calendars}
            selectedDate={calendar.selectedDate}
            onDateSelect={calendar.setSelectedDate}
            onEventClick={handleEventClick}
          />
        ) : (
          <YearView
            currentDate={calendar.selectedDate}
            events={calendar.visibleEvents}
            selectedDate={calendar.selectedDate}
            onDateSelect={calendar.setSelectedDate}
          />
        )}
      </div>

      {/* Event dialog */}
      <EventDialog
        open={dialogOpen}
        event={editingEvent}
        calendars={calendar.calendars}
        defaultDate={calendar.selectedDate}
        onClose={() => {
          setDialogOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
}
