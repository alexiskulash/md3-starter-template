export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  startTime: string; // HH:MM format
  endDate: Date;
  endTime: string; // HH:MM format
  calendarId: string;
}

export interface Calendar {
  id: string;
  name: string;
  color: string; // hex color
  enabled: boolean;
}

export type ViewType = "month" | "year" | "agenda";

export interface CalendarState {
  calendars: Calendar[];
  events: CalendarEvent[];
  selectedDate: Date;
  currentView: ViewType;
  currentMonth: Date; // First day of the currently viewed month
}
