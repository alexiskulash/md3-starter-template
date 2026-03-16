import { useState } from "react";
import { CalendarProvider } from "../contexts/CalendarContext";
import { sampleCalendars, sampleEvents } from "../data/sampleData";
import CalendarSidebar from "../components/CalendarSidebar";
import MonthView from "../components/MonthView";
import YearView from "../components/YearView";
import AgendaView from "../components/AgendaView";
import EventDialog from "../components/EventDialog";
import { useCalendar } from "../contexts/CalendarContext";
import { getMonthYear } from "../utils/dateUtils";
import type { CalendarEvent } from "../types/calendar";

// Import Material Web Components
import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/icon/icon.js";
import "@material/web/fab/fab.js";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "md-filled-button": any;
      "md-outlined-button": any;
      "md-icon-button": any;
      "md-icon": any;
      "md-fab": any;
    }
  }
}

function CalendarContent() {
  const {
    currentView,
    setCurrentView,
    currentMonth,
    goToToday,
    goToNextMonth,
    goToPrevMonth,
    goToNextYear,
    goToPrevYear,
  } = useCalendar();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [dialogDefaultDate, setDialogDefaultDate] = useState<Date | undefined>(
    undefined
  );

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setDialogDefaultDate(undefined);
    setIsDialogOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setDialogDefaultDate(undefined);
    setIsDialogOpen(true);
  };

  const handleDateClick = (date: Date) => {
    setSelectedEvent(null);
    setDialogDefaultDate(date);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
    setDialogDefaultDate(undefined);
  };

  const handleNext = () => {
    if (currentView === "month") {
      goToNextMonth();
    } else if (currentView === "year") {
      goToNextYear();
    }
  };

  const handlePrev = () => {
    if (currentView === "month") {
      goToPrevMonth();
    } else if (currentView === "year") {
      goToPrevYear();
    }
  };

  const displayTitle =
    currentView === "month"
      ? getMonthYear(currentMonth)
      : currentView === "year"
      ? currentMonth.getFullYear().toString()
      : "Upcoming Events";

  return (
    <div
      className="h-screen flex flex-col"
      style={{ backgroundColor: "hsl(var(--md-sys-color-background))" }}
    >
      {/* Header */}
      <header
        className="border-b px-4 py-3"
        style={{
          backgroundColor: "hsl(var(--md-sys-color-primary))",
          borderColor: "hsl(var(--md-sys-color-outline-variant))",
        }}
      >
        <div className="flex flex-wrap items-center gap-4">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <md-icon
              style={{
                fontSize: "32px",
                color: "hsl(var(--md-sys-color-on-primary))",
              }}
            >
              calendar_month
            </md-icon>
            <h1
              className="text-2xl font-semibold"
              style={{ color: "hsl(var(--md-sys-color-on-primary))" }}
            >
              Calendar
            </h1>
          </div>

          {/* Create Button */}
          <md-filled-button
            onClick={handleCreateEvent}
            style={{
              "--md-filled-button-container-color":
                "hsl(var(--md-sys-color-on-primary))",
              "--md-filled-button-label-text-color":
                "hsl(var(--md-sys-color-primary))",
            }}
          >
            <md-icon slot="icon">add</md-icon>
            Create
          </md-filled-button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <md-outlined-button
              onClick={goToToday}
              style={{
                "--md-outlined-button-outline-color":
                  "hsl(var(--md-sys-color-on-primary))",
                "--md-outlined-button-label-text-color":
                  "hsl(var(--md-sys-color-on-primary))",
              }}
            >
              Today
            </md-outlined-button>
            {currentView !== "agenda" && (
              <>
                <md-icon-button onClick={handlePrev}>
                  <md-icon
                    style={{ color: "hsl(var(--md-sys-color-on-primary))" }}
                  >
                    chevron_left
                  </md-icon>
                </md-icon-button>
                <md-icon-button onClick={handleNext}>
                  <md-icon
                    style={{ color: "hsl(var(--md-sys-color-on-primary))" }}
                  >
                    chevron_right
                  </md-icon>
                </md-icon-button>
              </>
            )}
            <h2
              className="text-lg font-medium min-w-[180px] text-center"
              style={{ color: "hsl(var(--md-sys-color-on-primary))" }}
            >
              {displayTitle}
            </h2>
          </div>

          {/* View Switcher */}
          <div className="flex gap-1">
            <md-outlined-button
              onClick={() => setCurrentView("month")}
              style={{
                backgroundColor:
                  currentView === "month"
                    ? "hsl(var(--md-sys-color-on-primary) / 0.2)"
                    : "transparent",
                "--md-outlined-button-outline-color":
                  "hsl(var(--md-sys-color-on-primary))",
                "--md-outlined-button-label-text-color":
                  "hsl(var(--md-sys-color-on-primary))",
              }}
            >
              Month
            </md-outlined-button>
            <md-outlined-button
              onClick={() => setCurrentView("year")}
              style={{
                backgroundColor:
                  currentView === "year"
                    ? "hsl(var(--md-sys-color-on-primary) / 0.2)"
                    : "transparent",
                "--md-outlined-button-outline-color":
                  "hsl(var(--md-sys-color-on-primary))",
                "--md-outlined-button-label-text-color":
                  "hsl(var(--md-sys-color-on-primary))",
              }}
            >
              Year
            </md-outlined-button>
            <md-outlined-button
              onClick={() => setCurrentView("agenda")}
              style={{
                backgroundColor:
                  currentView === "agenda"
                    ? "hsl(var(--md-sys-color-on-primary) / 0.2)"
                    : "transparent",
                "--md-outlined-button-outline-color":
                  "hsl(var(--md-sys-color-on-primary))",
                "--md-outlined-button-label-text-color":
                  "hsl(var(--md-sys-color-on-primary))",
              }}
            >
              Agenda
            </md-outlined-button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Hidden on mobile */}
        <div className="hidden lg:block">
          <CalendarSidebar />
        </div>

        {/* Calendar View */}
        <div className="flex-1 overflow-hidden">
          {currentView === "month" && (
            <MonthView
              onEventClick={handleEventClick}
              onDateClick={handleDateClick}
            />
          )}
          {currentView === "year" && <YearView onDateClick={handleDateClick} />}
          {currentView === "agenda" && (
            <AgendaView onEventClick={handleEventClick} />
          )}
        </div>
      </div>

      {/* Event Dialog */}
      <EventDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        event={selectedEvent}
        defaultDate={dialogDefaultDate}
      />

      {/* Floating Action Button (Mobile) */}
      <div className="fixed bottom-4 right-4 md:hidden">
        <md-fab onClick={handleCreateEvent}>
          <md-icon slot="icon">add</md-icon>
        </md-fab>
      </div>
    </div>
  );
}

export default function Calendar() {
  return (
    <CalendarProvider
      initialCalendars={sampleCalendars}
      initialEvents={sampleEvents}
    >
      <CalendarContent />
    </CalendarProvider>
  );
}
