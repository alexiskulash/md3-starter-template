import { useState, useCallback, useMemo } from "react";
import type { Calendar, CalendarEvent, Task, ViewType } from "../types/calendar";

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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<ViewType>("month");

  // Get visible events (only from enabled calendars)
  const visibleEvents = useMemo(() => {
    const enabledCalendarIds = new Set(
      calendars.filter((c) => c.enabled).map((c) => c.id)
    );
    return events.filter((event) => enabledCalendarIds.has(event.calendarId));
  }, [events, calendars]);

  // Get visible tasks (only from enabled calendars)
  const visibleTasks = useMemo(() => {
    const enabledCalendarIds = new Set(
      calendars.filter((c) => c.enabled).map((c) => c.id)
    );
    return tasks.filter((task) => enabledCalendarIds.has(task.calendarId));
  }, [tasks, calendars]);

  // Get unscheduled tasks
  const unscheduledTasks = useMemo(() => {
    return visibleTasks.filter((task) => !task.scheduledDate && !task.completed);
  }, [visibleTasks]);

  // Get completed tasks
  const completedTasks = useMemo(() => {
    return visibleTasks.filter((task) => task.completed);
  }, [visibleTasks]);

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

  // Get tasks for a specific date (scheduled tasks only)
  const getTasksForDate = useCallback(
    (date: Date) => {
      const dateStr = date.toISOString().split("T")[0];
      return visibleTasks.filter((task) => task.scheduledDate === dateStr);
    },
    [visibleTasks]
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

  // Create new task
  const createTask = useCallback((task: Omit<Task, "id">) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  }, []);

  // Update existing task
  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
    );
  }, []);

  // Delete task
  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  }, []);

  // Toggle task completion
  const toggleTaskComplete = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  // Schedule a task to a specific date/time (time blocking)
  const scheduleTask = useCallback(
    (taskId: string, date: string, startTime?: string) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, scheduledDate: date, scheduledStartTime: startTime }
            : task
        )
      );
    },
    []
  );

  // Unschedule a task (remove from calendar, back to task list)
  const unscheduleTask = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, scheduledDate: undefined, scheduledStartTime: undefined }
          : task
      )
    );
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
    tasks,
    visibleTasks,
    unscheduledTasks,
    completedTasks,
    selectedDate,
    currentView,
    setSelectedDate,
    setCurrentView,
    getEventsForDate,
    getTasksForDate,
    toggleCalendar,
    createEvent,
    updateEvent,
    deleteEvent,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    scheduleTask,
    unscheduleTask,
    goToToday,
    goToPreviousMonth,
    goToNextMonth,
    goToPreviousYear,
    goToNextYear,
  };
}
