import { useState } from "react";
import { CalendarProvider, useCalendar } from "../context/CalendarContext";
import CalendarHeader from "../components/CalendarHeader";
import CalendarSidebar from "../components/CalendarSidebar";
import MonthView from "../components/MonthView";
import YearView from "../components/YearView";
import EventDialog from "../components/EventDialog";
import { CalendarEvent } from "../types/calendar";

function CalendarApp() {
  const { viewMode, setSelectedDate } = useCalendar();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [defaultDate, setDefaultDate] = useState<Date | undefined>(undefined);

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setDefaultDate(undefined);
    setDialogOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setDefaultDate(undefined);
    setDialogOpen(true);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setDefaultDate(date);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedEvent(null);
    setDefaultDate(undefined);
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
      <CalendarHeader onCreateEvent={handleCreateEvent} />

      {/* Main content area */}
      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* Sidebar - hidden on mobile */}
        <div
          className="calendar-sidebar"
          style={{
            display: "flex",
          }}
        >
          <CalendarSidebar />
        </div>

        {/* Calendar view */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
          }}
        >
          {viewMode === "month" && (
            <MonthView
              onEventClick={handleEventClick}
              onDateClick={handleDateClick}
            />
          )}
          {viewMode === "year" && <YearView onDateClick={handleDateClick} />}
        </div>
      </div>

      {/* Event Dialog */}
      <EventDialog
        open={dialogOpen}
        event={selectedEvent}
        defaultDate={defaultDate}
        onClose={handleCloseDialog}
      />
    </div>
  );
}

export default function Index() {
  return (
    <CalendarProvider>
      <CalendarApp />
    </CalendarProvider>
  );
}
