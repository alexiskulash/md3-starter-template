export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string; // ISO date string
  startTime: string; // HH:MM format
  endDate: string; // ISO date string
  endTime: string; // HH:MM format
  calendarId: string;
}

export interface Calendar {
  id: string;
  name: string;
  color: string; // Hex color code
  enabled: boolean;
}

export type ViewMode = "month" | "year";

export interface AppState {
  calendars: Calendar[];
  events: CalendarEvent[];
  selectedDate: Date;
  viewMode: ViewMode;
}
