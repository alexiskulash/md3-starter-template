export interface Calendar {
  id: string;
  name: string;
  color: string;
  enabled: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startDate: string; // ISO date string
  startTime: string; // HH:MM format
  endDate: string; // ISO date string
  endTime: string; // HH:MM format
  description?: string;
  calendarId: string;
}

export type ViewMode = 'month' | 'year';
