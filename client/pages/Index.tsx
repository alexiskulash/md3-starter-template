import { useState, useMemo, useEffect } from "react";
import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/icon/icon.js";
import "@material/web/iconbutton/icon-button.js";

import CalendarHeader from "../components/Calendar/CalendarHeader";
import CalendarSidebar from "../components/Calendar/CalendarSidebar";
import MonthView from "../components/Calendar/MonthView";
import YearView from "../components/Calendar/YearView";
import EventDialog from "../components/Calendar/EventDialog";
import TimeBlockDialog from "../components/Calendar/TimeBlockDialog";

import { Calendar, CalendarEvent, ViewMode, TimeBlock } from "../types/calendar";
import { defaultCalendars, sampleEvents } from "../data/sampleData";
import { getWeatherForecast, WeatherData } from "../utils/weatherService";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "md-filled-button": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      "md-outlined-button": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      "md-icon": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      "md-icon-button": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

export default function Index() {
  const [calendars, setCalendars] = useState<Calendar[]>(defaultCalendars);
  const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [isTimeBlockDialogOpen, setIsTimeBlockDialogOpen] = useState(false);

  // Theme state - initialize from localStorage or system preference
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      return saved === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // Theme toggle handler
  const handleThemeToggle = () => {
    setIsDarkMode(prev => !prev);
  };

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      // Get weather for the current month (30 days from start of month)
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const weatherData = await getWeatherForecast(startOfMonth, 30);
      setWeather(weatherData);
    };

    fetchWeather();
  }, [currentDate]);

  // Toggle calendar visibility
  const handleToggleCalendar = (calendarId: string) => {
    setCalendars(prev =>
      prev.map(cal =>
        cal.id === calendarId ? { ...cal, enabled: !cal.enabled } : cal
      )
    );
  };

  // Filter events by enabled calendars
  const visibleEvents = useMemo(() => {
    const enabledCalendarIds = calendars.filter(c => c.enabled).map(c => c.id);
    return events.filter(event => enabledCalendarIds.includes(event.calendarId));
  }, [events, calendars]);

  // Navigation
  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setFullYear(newDate.getFullYear() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Event handlers
  const handleCreateEvent = (event: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString(),
    };
    setEvents(prev => [...prev, newEvent]);
    setIsCreateDialogOpen(false);
  };

  const handleQuickAdd = (event: Omit<CalendarEvent, "id" | "description">) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString(),
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const handleUpdateEvent = (event: CalendarEvent) => {
    setEvents(prev => prev.map(e => (e.id === event.id ? event : e)));
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    setEditingEvent(null);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setEditingEvent(event);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  // Time block handlers
  const handleCreateTimeBlock = (timeBlock: {
    title: string;
    category: 'work' | 'personal' | 'break' | 'focus' | 'meeting' | 'other';
    startTime: string;
    endTime: string;
    recurring: boolean;
    daysOfWeek: number[];
  }) => {
    const CATEGORY_COLORS: Record<string, string> = {
      work: '#1976d2',
      personal: '#388e3c',
      break: '#f57c00',
      focus: '#7b1fa2',
      meeting: '#c62828',
      other: '#616161',
    };

    const newTimeBlock: TimeBlock = {
      id: Date.now().toString(),
      title: timeBlock.title,
      category: timeBlock.category,
      startTime: timeBlock.startTime,
      endTime: timeBlock.endTime,
      color: CATEGORY_COLORS[timeBlock.category],
      recurring: timeBlock.recurring ? {
        frequency: 'weekly',
        daysOfWeek: timeBlock.daysOfWeek,
      } : undefined,
    };

    setTimeBlocks(prev => [...prev, newTimeBlock]);

    // Apply time block to calendar events
    applyTimeBlockToEvents(newTimeBlock);

    setIsTimeBlockDialogOpen(false);
  };

  const applyTimeBlockToEvents = (timeBlock: TimeBlock) => {
    const today = new Date();
    const newEvents: CalendarEvent[] = [];

    // If recurring, create events for next 4 weeks
    if (timeBlock.recurring) {
      for (let week = 0; week < 4; week++) {
        timeBlock.recurring.daysOfWeek?.forEach(dayOfWeek => {
          const eventDate = new Date(today);
          eventDate.setDate(today.getDate() + (dayOfWeek - today.getDay()) + (week * 7));

          // Skip past dates
          if (eventDate < today) return;

          newEvents.push({
            id: `tb-${timeBlock.id}-${eventDate.toISOString()}`,
            title: timeBlock.title,
            startDate: eventDate.toISOString().split('T')[0],
            startTime: timeBlock.startTime,
            endDate: eventDate.toISOString().split('T')[0],
            endTime: timeBlock.endTime,
            calendarId: timeBlock.category === 'work' ? 'work' : 'personal',
            isTimeBlock: true,
            timeBlockCategory: timeBlock.category,
          });
        });
      }
    } else {
      // Create single event for today
      newEvents.push({
        id: `tb-${timeBlock.id}-${today.toISOString()}`,
        title: timeBlock.title,
        startDate: today.toISOString().split('T')[0],
        startTime: timeBlock.startTime,
        endDate: today.toISOString().split('T')[0],
        endTime: timeBlock.endTime,
        calendarId: timeBlock.category === 'work' ? 'work' : 'personal',
        isTimeBlock: true,
        timeBlockCategory: timeBlock.category,
      });
    }

    setEvents(prev => [...prev, ...newEvents]);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "hsl(var(--md-sys-color-surface))",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <CalendarHeader
        viewMode={viewMode}
        currentDate={currentDate}
        isDarkMode={isDarkMode}
        calendars={calendars}
        onViewModeChange={setViewMode}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
        onCreate={() => setIsCreateDialogOpen(true)}
        onCreateTimeBlock={() => setIsTimeBlockDialogOpen(true)}
        onQuickAdd={handleQuickAdd}
        onThemeToggle={handleThemeToggle}
      />

      {/* Main Content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <CalendarSidebar
          calendars={calendars}
          currentDate={currentDate}
          selectedDate={selectedDate}
          onToggleCalendar={handleToggleCalendar}
          onDateSelect={handleDateSelect}
        />

        {/* Calendar View */}
        <main style={{ flex: 1, overflow: "auto", padding: "24px" }}>
          {viewMode === "month" ? (
            <MonthView
              currentDate={currentDate}
              selectedDate={selectedDate}
              events={visibleEvents}
              calendars={calendars}
              weather={weather}
              onDateSelect={handleDateSelect}
              onEventClick={handleEventClick}
            />
          ) : (
            <YearView
              currentDate={currentDate}
              selectedDate={selectedDate}
              events={visibleEvents}
              onDateSelect={handleDateSelect}
            />
          )}
        </main>
      </div>

      {/* Create Event Dialog */}
      {isCreateDialogOpen && (
        <EventDialog
          calendars={calendars.filter(c => c.enabled)}
          selectedDate={selectedDate}
          onSave={handleCreateEvent}
          onClose={() => setIsCreateDialogOpen(false)}
        />
      )}

      {/* Edit Event Dialog */}
      {editingEvent && (
        <EventDialog
          event={editingEvent}
          calendars={calendars}
          selectedDate={selectedDate}
          onSave={handleUpdateEvent}
          onDelete={handleDeleteEvent}
          onClose={() => setEditingEvent(null)}
        />
      )}

      {/* Time Block Dialog */}
      {isTimeBlockDialogOpen && (
        <TimeBlockDialog
          onSave={handleCreateTimeBlock}
          onClose={() => setIsTimeBlockDialogOpen(false)}
        />
      )}
    </div>
  );
}
