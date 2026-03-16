// Calendar application types and interfaces

export interface Calendar {
  id: string;
  name: string;
  color: string; // HSL color value
  enabled: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string; // ISO date string (YYYY-MM-DD)
  startTime: string; // HH:MM format (24-hour)
  endTime: string; // HH:MM format (24-hour)
  description?: string;
  calendarId: string;
}

export type ViewType = "month" | "year" | "agenda";

export interface CalendarState {
  calendars: Calendar[];
  events: CalendarEvent[];
  selectedDate: Date;
  currentView: ViewType;
}
