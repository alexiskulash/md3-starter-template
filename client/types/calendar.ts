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
  isTimeBlock?: boolean; // Flag to indicate if this is a time block
  timeBlockCategory?: 'work' | 'personal' | 'break' | 'focus' | 'meeting' | 'other';
}

export interface TimeBlock {
  id: string;
  title: string;
  category: 'work' | 'personal' | 'break' | 'focus' | 'meeting' | 'other';
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  color: string;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    daysOfWeek?: number[]; // 0-6, 0 = Sunday
  };
}

export type ViewMode = 'month' | 'year';
