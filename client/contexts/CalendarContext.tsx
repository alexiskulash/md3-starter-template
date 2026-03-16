import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Calendar, CalendarEvent, ViewType, CalendarState } from '../types/calendar';

interface CalendarContextType {
  state: CalendarState;
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (eventId: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (eventId: string) => void;
  toggleCalendar: (calendarId: string) => void;
  setSelectedDate: (date: Date) => void;
  setCurrentView: (view: ViewType) => void;
  setViewDate: (date: Date) => void;
  navigateMonth: (direction: 'prev' | 'next') => void;
  navigateYear: (direction: 'prev' | 'next') => void;
  goToToday: () => void;
  getCalendarById: (calendarId: string) => Calendar | undefined;
  getEnabledCalendars: () => Calendar[];
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

// Sample initial calendars
const initialCalendars: Calendar[] = [
  { id: 'personal', name: 'Personal', color: '#1976d2', enabled: true },
  { id: 'work', name: 'Work', color: '#d32f2f', enabled: true },
  { id: 'family', name: 'Family', color: '#388e3c', enabled: true },
];

// Sample initial events
const initialEvents: CalendarEvent[] = [
  // Today's events
  {
    id: 'event-1',
    title: 'Morning Standup',
    description: 'Daily team sync',
    startDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endDate: new Date().toISOString().split('T')[0],
    endTime: '09:30',
    calendarId: 'work',
  },
  {
    id: 'event-2',
    title: 'Lunch with Sarah',
    description: 'Downtown cafe',
    startDate: new Date().toISOString().split('T')[0],
    startTime: '12:00',
    endDate: new Date().toISOString().split('T')[0],
    endTime: '13:00',
    calendarId: 'personal',
  },
  {
    id: 'event-3',
    title: 'Project Review',
    description: 'Q1 project presentation',
    startDate: new Date().toISOString().split('T')[0],
    startTime: '14:00',
    endDate: new Date().toISOString().split('T')[0],
    endTime: '15:30',
    calendarId: 'work',
  },
  // Tomorrow's events
  {
    id: 'event-4',
    title: 'Gym Session',
    description: 'Leg day',
    startDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    startTime: '07:00',
    endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    endTime: '08:00',
    calendarId: 'personal',
  },
  {
    id: 'event-5',
    title: 'Client Meeting',
    description: 'Quarterly business review',
    startDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    startTime: '10:00',
    endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    endTime: '11:30',
    calendarId: 'work',
  },
  // Weekend events
  {
    id: 'event-6',
    title: 'Family Dinner',
    description: 'Parents anniversary celebration',
    startDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    startTime: '18:00',
    endDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    endTime: '21:00',
    calendarId: 'family',
  },
  {
    id: 'event-7',
    title: 'Soccer Game',
    description: 'Kids soccer match',
    startDate: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0],
    startTime: '10:00',
    endDate: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0],
    endTime: '12:00',
    calendarId: 'family',
  },
  // Next week events
  {
    id: 'event-8',
    title: 'Design Workshop',
    description: 'New product brainstorming',
    startDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    startTime: '13:00',
    endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    endTime: '16:00',
    calendarId: 'work',
  },
  {
    id: 'event-9',
    title: 'Dentist Appointment',
    description: 'Regular checkup',
    startDate: new Date(Date.now() + 9 * 86400000).toISOString().split('T')[0],
    startTime: '15:00',
    endDate: new Date(Date.now() + 9 * 86400000).toISOString().split('T')[0],
    endTime: '16:00',
    calendarId: 'personal',
  },
  {
    id: 'event-10',
    title: 'Team Building Event',
    description: 'Bowling night with the team',
    startDate: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0],
    startTime: '17:00',
    endDate: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0],
    endTime: '20:00',
    calendarId: 'work',
  },
];

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CalendarState>({
    calendars: initialCalendars,
    events: initialEvents,
    selectedDate: new Date(),
    currentView: 'month',
    viewDate: new Date(),
  });

  const addEvent = useCallback((eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    setState(prev => ({
      ...prev,
      events: [...prev.events, newEvent],
    }));
  }, []);

  const updateEvent = useCallback((eventId: string, updates: Partial<CalendarEvent>) => {
    setState(prev => ({
      ...prev,
      events: prev.events.map(event =>
        event.id === eventId ? { ...event, ...updates } : event
      ),
    }));
  }, []);

  const deleteEvent = useCallback((eventId: string) => {
    setState(prev => ({
      ...prev,
      events: prev.events.filter(event => event.id !== eventId),
    }));
  }, []);

  const toggleCalendar = useCallback((calendarId: string) => {
    setState(prev => ({
      ...prev,
      calendars: prev.calendars.map(cal =>
        cal.id === calendarId ? { ...cal, enabled: !cal.enabled } : cal
      ),
    }));
  }, []);

  const setSelectedDate = useCallback((date: Date) => {
    setState(prev => ({ ...prev, selectedDate: date }));
  }, []);

  const setCurrentView = useCallback((view: ViewType) => {
    setState(prev => ({ ...prev, currentView: view }));
  }, []);

  const setViewDate = useCallback((date: Date) => {
    setState(prev => ({ ...prev, viewDate: date }));
  }, []);

  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    setState(prev => {
      const newDate = new Date(prev.viewDate);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return { ...prev, viewDate: newDate };
    });
  }, []);

  const navigateYear = useCallback((direction: 'prev' | 'next') => {
    setState(prev => {
      const newDate = new Date(prev.viewDate);
      if (direction === 'prev') {
        newDate.setFullYear(newDate.getFullYear() - 1);
      } else {
        newDate.setFullYear(newDate.getFullYear() + 1);
      }
      return { ...prev, viewDate: newDate };
    });
  }, []);

  const goToToday = useCallback(() => {
    const today = new Date();
    setState(prev => ({
      ...prev,
      selectedDate: today,
      viewDate: today,
    }));
  }, []);

  const getCalendarById = useCallback((calendarId: string) => {
    return state.calendars.find(cal => cal.id === calendarId);
  }, [state.calendars]);

  const getEnabledCalendars = useCallback(() => {
    return state.calendars.filter(cal => cal.enabled);
  }, [state.calendars]);

  const value: CalendarContextType = {
    state,
    addEvent,
    updateEvent,
    deleteEvent,
    toggleCalendar,
    setSelectedDate,
    setCurrentView,
    setViewDate,
    navigateMonth,
    navigateYear,
    goToToday,
    getCalendarById,
    getEnabledCalendars,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}
