import React, { createContext, useContext, useState, ReactNode } from "react";
import { Calendar, CalendarEvent, ViewMode } from "../types/calendar";

interface CalendarContextType {
  calendars: Calendar[];
  events: CalendarEvent[];
  selectedDate: Date;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  setSelectedDate: (date: Date) => void;
  toggleCalendar: (calendarId: string) => void;
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  updateEvent: (id: string, event: Omit<CalendarEvent, "id">) => void;
  deleteEvent: (id: string) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

// Sample calendars
const initialCalendars: Calendar[] = [
  { id: "personal", name: "Personal", color: "#1976D2", enabled: true },
  { id: "work", name: "Work", color: "#D32F2F", enabled: true },
  { id: "family", name: "Family", color: "#388E3C", enabled: true },
];

// Sample events
const initialEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Standup",
    description: "Daily team sync meeting",
    startDate: "2026-03-17",
    startTime: "10:00",
    endDate: "2026-03-17",
    endTime: "10:30",
    calendarId: "work",
  },
  {
    id: "2",
    title: "Dentist Appointment",
    description: "Regular checkup",
    startDate: "2026-03-18",
    startTime: "14:00",
    endDate: "2026-03-18",
    endTime: "15:00",
    calendarId: "personal",
  },
  {
    id: "3",
    title: "Project Review",
    description: "Quarterly project review meeting",
    startDate: "2026-03-20",
    startTime: "15:00",
    endDate: "2026-03-20",
    endTime: "16:30",
    calendarId: "work",
  },
  {
    id: "4",
    title: "Family Dinner",
    description: "Dinner at mom's house",
    startDate: "2026-03-21",
    startTime: "18:00",
    endDate: "2026-03-21",
    endTime: "20:00",
    calendarId: "family",
  },
  {
    id: "5",
    title: "Gym Session",
    description: "Morning workout",
    startDate: "2026-03-17",
    startTime: "07:00",
    endDate: "2026-03-17",
    endTime: "08:00",
    calendarId: "personal",
  },
  {
    id: "6",
    title: "Client Presentation",
    description: "Q1 results presentation",
    startDate: "2026-03-19",
    startTime: "11:00",
    endDate: "2026-03-19",
    endTime: "12:00",
    calendarId: "work",
  },
  {
    id: "7",
    title: "Birthday Party",
    description: "Sarah's birthday celebration",
    startDate: "2026-03-22",
    startTime: "16:00",
    endDate: "2026-03-22",
    endTime: "19:00",
    calendarId: "family",
  },
  {
    id: "8",
    title: "Code Review",
    description: "Review new feature implementation",
    startDate: "2026-03-18",
    startTime: "10:00",
    endDate: "2026-03-18",
    endTime: "11:00",
    calendarId: "work",
  },
];

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [calendars, setCalendars] = useState<Calendar[]>(initialCalendars);
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");

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
      id: Date.now().toString(),
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  const updateEvent = (id: string, event: Omit<CalendarEvent, "id">) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...event, id } : e))
    );
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <CalendarContext.Provider
      value={{
        calendars,
        events,
        selectedDate,
        viewMode,
        setViewMode,
        setSelectedDate,
        toggleCalendar,
        addEvent,
        updateEvent,
        deleteEvent,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
}
