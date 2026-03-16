import React, { createContext, useContext, useState, useMemo } from "react";
import type {
  Calendar,
  CalendarEvent,
  CalendarState,
  ViewType,
} from "../types/calendar";

interface CalendarContextType extends CalendarState {
  setSelectedDate: (date: Date) => void;
  setCurrentView: (view: ViewType) => void;
  setCurrentMonth: (date: Date) => void;
  goToToday: () => void;
  goToNextMonth: () => void;
  goToPrevMonth: () => void;
  goToNextYear: () => void;
  goToPrevYear: () => void;
  toggleCalendar: (calendarId: string) => void;
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (eventId: string) => void;
  getEventsForDate: (date: Date) => CalendarEvent[];
  getEnabledCalendars: () => Calendar[];
}

const CalendarContext = createContext<CalendarContextType | null>(null);

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within CalendarProvider");
  }
  return context;
}

interface CalendarProviderProps {
  children: React.ReactNode;
  initialCalendars: Calendar[];
  initialEvents: CalendarEvent[];
}

export function CalendarProvider({
  children,
  initialCalendars,
  initialEvents,
}: CalendarProviderProps) {
  const [calendars, setCalendars] = useState<Calendar[]>(initialCalendars);
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<ViewType>("month");
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );

  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() + 1);
      return next;
    });
  };

  const goToPrevMonth = () => {
    setCurrentMonth((prev) => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() - 1);
      return next;
    });
  };

  const goToNextYear = () => {
    setCurrentMonth((prev) => {
      const next = new Date(prev);
      next.setFullYear(next.getFullYear() + 1);
      return next;
    });
  };

  const goToPrevYear = () => {
    setCurrentMonth((prev) => {
      const next = new Date(prev);
      next.setFullYear(next.getFullYear() - 1);
      return next;
    });
  };

  const toggleCalendar = (calendarId: string) => {
    setCalendars((prev) =>
      prev.map((cal) =>
        cal.id === calendarId ? { ...cal, enabled: !cal.enabled } : cal
      )
    );
  };

  const addEvent = (event: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  const updateEvent = (event: CalendarEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === event.id ? event : e))
    );
  };

  const deleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const enabledCalendarIds = calendars
      .filter((cal) => cal.enabled)
      .map((cal) => cal.id);

    return events.filter((event) => {
      if (!enabledCalendarIds.includes(event.calendarId)) return false;

      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);

      return (
        date >= new Date(eventStart.getFullYear(), eventStart.getMonth(), eventStart.getDate()) &&
        date <= new Date(eventEnd.getFullYear(), eventEnd.getMonth(), eventEnd.getDate())
      );
    });
  };

  const getEnabledCalendars = (): Calendar[] => {
    return calendars.filter((cal) => cal.enabled);
  };

  const value: CalendarContextType = useMemo(
    () => ({
      calendars,
      events,
      selectedDate,
      currentView,
      currentMonth,
      setSelectedDate,
      setCurrentView,
      setCurrentMonth,
      goToToday,
      goToNextMonth,
      goToPrevMonth,
      goToNextYear,
      goToPrevYear,
      toggleCalendar,
      addEvent,
      updateEvent,
      deleteEvent,
      getEventsForDate,
      getEnabledCalendars,
    }),
    [calendars, events, selectedDate, currentView, currentMonth]
  );

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}
