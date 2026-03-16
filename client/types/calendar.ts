export type ViewType = 'month' | 'year';

export interface Calendar {
  id: string;
  name: string;
  color: string;
  enabled: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string; // ISO date string
  startTime: string; // HH:mm format
  endDate: string; // ISO date string
  endTime: string; // HH:mm format
  calendarId: string;
}

export interface CalendarState {
  calendars: Calendar[];
  events: CalendarEvent[];
  selectedDate: Date;
  currentView: ViewType;
  viewDate: Date; // The month/year being viewed
}
