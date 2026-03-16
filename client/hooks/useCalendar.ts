import { useState, useCallback, useMemo } from "react";
import type { Calendar, CalendarEvent, ViewType } from "../types/calendar";

export function useCalendar() {
  const [calendars, setCalendars] = useState<Calendar[]>([
    {
      id: "personal",
      name: "Personal",
      color: "hsl(var(--md-sys-color-primary))",
      enabled: true,
    },
    {
      id: "work",
      name: "Work",
      color: "hsl(var(--md-sys-color-secondary))",
      enabled: true,
    },
    {
      id: "family",
      name: "Family",
      color: "hsl(var(--md-sys-color-tertiary))",
      enabled: true,
    },
  ]);

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<ViewType>("month");

  // Get visible events (only from enabled calendars)
  const visibleEvents = useMemo(() => {
    const enabledCalendarIds = new Set(
      calendars.filter((c) => c.enabled).map((c) => c.id)
    );
    return events.filter((event) => enabledCalendarIds.has(event.calendarId));
  }, [events, calendars]);

  // Get events for a specific date
  const getEventsForDate = useCallback(
    (date: Date) => {
      const dateStr = date.toISOString().split("T")[0];
      return visibleEvents.filter((event) => {
        return dateStr >= event.startDate && dateStr <= event.endDate;
      });
    },
    [visibleEvents]
  );

  // Toggle calendar visibility
  const toggleCalendar = useCallback((calendarId: string) => {
    setCalendars((prev) =>
      prev.map((cal) =>
        cal.id === calendarId ? { ...cal, enabled: !cal.enabled } : cal
      )
    );
  }, []);

  // Create new event
  const createEvent = useCallback((event: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setEvents((prev) => [...prev, newEvent]);
    return newEvent;
  }, []);

  // Update existing event
  const updateEvent = useCallback((eventId: string, updates: Partial<CalendarEvent>) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId ? { ...event, ...updates } : event
      )
    );
  }, []);

  // Delete event
  const deleteEvent = useCallback((eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
  }, []);

  // Navigation helpers
  const goToToday = useCallback(() => {
    setSelectedDate(new Date());
  }, []);

  const goToPreviousMonth = useCallback(() => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  }, []);

  const goToPreviousYear = useCallback(() => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setFullYear(newDate.getFullYear() - 1);
      return newDate;
    });
  }, []);

  const goToNextYear = useCallback(() => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setFullYear(newDate.getFullYear() + 1);
      return newDate;
    });
  }, []);

  return {
    calendars,
    events,
    visibleEvents,
    selectedDate,
    currentView,
    setSelectedDate,
    setCurrentView,
    getEventsForDate,
    toggleCalendar,
    createEvent,
    updateEvent,
    deleteEvent,
    goToToday,
    goToPreviousMonth,
    goToNextMonth,
    goToPreviousYear,
    goToNextYear,
  };
}
