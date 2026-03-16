import { useState, useEffect } from "react";
import { useCalendar } from "../hooks/useCalendar";
import { useTheme } from "../hooks/useTheme";
import { CalendarHeader } from "../components/CalendarHeader";
import { CalendarSidebar } from "../components/CalendarSidebar";
import { TaskSidebar } from "../components/TaskSidebar";
import { MonthView } from "../components/MonthView";
import { YearView } from "../components/YearView";
import { AgendaView } from "../components/AgendaView";
import { EventDialog } from "../components/EventDialog";
import { TaskDialog } from "../components/TaskDialog";
import type { CalendarEvent, Task } from "../types/calendar";

export default function Index() {
  const calendar = useCalendar();
  const { theme, toggleTheme } = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showTaskSidebar, setShowTaskSidebar] = useState(true);

  // Populate with sample events
  useEffect(() => {
    // Only populate if there are no events
    if (calendar.events.length === 0) {
      const now = new Date();
      const today = now.toISOString().split("T")[0];

      // Helper to create date strings
      const getDateStr = (daysOffset: number) => {
        const date = new Date(now);
        date.setDate(date.getDate() + daysOffset);
        return date.toISOString().split("T")[0];
      };

      const sampleEvents = [
        {
          title: "Team Standup",
          startDate: today,
          endDate: today,
          startTime: "10:00",
          endTime: "10:30",
          description: "Daily team sync meeting",
          calendarId: "work",
        },
        {
          title: "Project Review",
          startDate: getDateStr(2),
          endDate: getDateStr(2),
          startTime: "14:00",
          endTime: "15:30",
          description: "Q1 project review with stakeholders",
          calendarId: "work",
        },
        {
          title: "Dentist Appointment",
          startDate: getDateStr(5),
          endDate: getDateStr(5),
          startTime: "09:00",
          endTime: "10:00",
          description: "Regular checkup",
          calendarId: "personal",
        },
        {
          title: "Gym Session",
          startDate: getDateStr(1),
          endDate: getDateStr(1),
          startTime: "06:30",
          endTime: "07:30",
          description: "Morning workout",
          calendarId: "personal",
        },
        {
          title: "Family Dinner",
          startDate: getDateStr(3),
          endDate: getDateStr(3),
          startTime: "18:00",
          endTime: "20:00",
          description: "Dinner at Mom's place",
          calendarId: "family",
        },
        {
          title: "Client Presentation",
          startDate: getDateStr(7),
          endDate: getDateStr(7),
          startTime: "11:00",
          endTime: "12:00",
          description: "Present new design proposals",
          calendarId: "work",
        },
        {
          title: "Weekend Getaway",
          startDate: getDateStr(10),
          endDate: getDateStr(12),
          startTime: "09:00",
          endTime: "17:00",
          description: "Road trip to the mountains",
          calendarId: "personal",
        },
        {
          title: "Birthday Party",
          startDate: getDateStr(15),
          endDate: getDateStr(15),
          startTime: "15:00",
          endTime: "18:00",
          description: "Sarah's birthday celebration",
          calendarId: "family",
        },
        {
          title: "Team Building Event",
          startDate: getDateStr(20),
          endDate: getDateStr(20),
          startTime: "13:00",
          endTime: "17:00",
          description: "Outdoor team building activities",
          calendarId: "work",
        },
        {
          title: "Yoga Class",
          startDate: getDateStr(-2),
          endDate: getDateStr(-2),
          startTime: "07:00",
          endTime: "08:00",
          description: "Morning yoga session",
          calendarId: "personal",
        },
        {
          title: "Budget Planning",
          startDate: getDateStr(-5),
          endDate: getDateStr(-5),
          startTime: "10:00",
          endTime: "11:30",
          description: "Monthly budget review",
          calendarId: "work",
        },
        {
          title: "Movie Night",
          startDate: getDateStr(8),
          endDate: getDateStr(8),
          startTime: "19:00",
          endTime: "22:00",
          description: "Family movie night at home",
          calendarId: "family",
        },
      ];

      sampleEvents.forEach((event) => calendar.createEvent(event));
    }

    // Populate sample tasks
    if (calendar.tasks.length === 0) {
      const now = new Date();
      const today = now.toISOString().split("T")[0];

      // Helper to create date strings
      const getDateStr = (daysOffset: number) => {
        const date = new Date(now);
        date.setDate(date.getDate() + daysOffset);
        return date.toISOString().split("T")[0];
      };

      const sampleTasks = [
        {
          title: "Review project proposal",
          description: "Review and provide feedback on the Q2 project proposal document",
          calendarId: "work",
          estimatedDuration: 60,
          completed: false,
          dueDate: getDateStr(3),
          // Unscheduled
        },
        {
          title: "Grocery shopping",
          description: "Buy groceries for the week",
          calendarId: "personal",
          estimatedDuration: 45,
          completed: false,
          scheduledDate: getDateStr(5), // Saturday
          scheduledStartTime: "10:00",
        },
        {
          title: "Call dentist",
          description: "Schedule cleaning appointment",
          calendarId: "personal",
          estimatedDuration: 15,
          completed: false,
          dueDate: today,
          // Unscheduled
        },
        {
          title: "Prepare presentation",
          description: "Create slides for Monday's client meeting",
          calendarId: "work",
          estimatedDuration: 120,
          completed: false,
          scheduledDate: today,
          scheduledStartTime: "14:00",
        },
        {
          title: "Update resume",
          description: "Add recent projects and achievements",
          calendarId: "work",
          estimatedDuration: 90,
          completed: false,
          dueDate: getDateStr(7),
          // Unscheduled
        },
        {
          title: "Plan birthday party",
          description: "Organize activities and guest list for Sarah's birthday",
          calendarId: "family",
          estimatedDuration: 60,
          completed: false,
          scheduledDate: getDateStr(14),
          scheduledStartTime: "11:00",
        },
        {
          title: "Read investment report",
          description: "Review quarterly investment portfolio performance",
          calendarId: "personal",
          estimatedDuration: 30,
          completed: true,
          scheduledDate: getDateStr(-3),
          scheduledStartTime: "09:00",
        },
        {
          title: "Order office supplies",
          description: "Restock printer paper, pens, and notebooks",
          calendarId: "work",
          estimatedDuration: 20,
          completed: true,
        },
      ];

      sampleTasks.forEach((task) => calendar.createTask(task));
    }
  }, []);

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setDialogOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setEditingEvent(event);
    setDialogOpen(true);
  };

  const handleSaveEvent = (eventData: Omit<CalendarEvent, "id">) => {
    if (editingEvent) {
      calendar.updateEvent(editingEvent.id, eventData);
    } else {
      calendar.createEvent(eventData);
    }
    setDialogOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    calendar.deleteEvent(eventId);
    setDialogOpen(false);
    setEditingEvent(null);
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setTaskDialogOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
    setTaskDialogOpen(true);
  };

  const handleSaveTask = (taskData: Omit<Task, "id">) => {
    if (editingTask) {
      calendar.updateTask(editingTask.id, taskData);
    } else {
      calendar.createTask(taskData);
    }
    setTaskDialogOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    calendar.deleteTask(taskId);
    setTaskDialogOpen(false);
    setEditingTask(null);
  };

  const handleNavigation = () => {
    if (calendar.currentView === "month") {
      return {
        onPrevious: calendar.goToPreviousMonth,
        onNext: calendar.goToNextMonth,
      };
    } else {
      return {
        onPrevious: calendar.goToPreviousYear,
        onNext: calendar.goToNextYear,
      };
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "hsl(var(--md-sys-color-background))",
      }}
    >
      {/* Header */}
      <CalendarHeader
        currentDate={calendar.selectedDate}
        currentView={calendar.currentView}
        theme={theme}
        showTaskSidebar={showTaskSidebar}
        unscheduledTaskCount={calendar.unscheduledTasks.length}
        onViewChange={calendar.setCurrentView}
        onPrevious={handleNavigation().onPrevious}
        onNext={handleNavigation().onNext}
        onToday={calendar.goToToday}
        onCreateEvent={handleCreateEvent}
        onThemeToggle={toggleTheme}
        onToggleTaskSidebar={() => setShowTaskSidebar(!showTaskSidebar)}
      />

      {/* Main content area with sidebar */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar - hidden on mobile */}
        <div className="sidebar-container">
          <CalendarSidebar
            calendars={calendar.calendars}
            selectedDate={calendar.selectedDate}
            onToggleCalendar={calendar.toggleCalendar}
            onDateSelect={calendar.setSelectedDate}
          />
        </div>

        {/* Main calendar view */}
        {calendar.currentView === "month" ? (
          <MonthView
            currentDate={calendar.selectedDate}
            events={calendar.visibleEvents}
            tasks={calendar.visibleTasks}
            calendars={calendar.calendars}
            selectedDate={calendar.selectedDate}
            onDateSelect={calendar.setSelectedDate}
            onEventClick={handleEventClick}
            onTaskClick={handleTaskClick}
          />
        ) : calendar.currentView === "year" ? (
          <YearView
            currentDate={calendar.selectedDate}
            events={calendar.visibleEvents}
            selectedDate={calendar.selectedDate}
            onDateSelect={calendar.setSelectedDate}
          />
        ) : (
          <AgendaView
            currentDate={calendar.selectedDate}
            events={calendar.visibleEvents}
            tasks={calendar.visibleTasks}
            calendars={calendar.calendars}
            onEventClick={handleEventClick}
            onTaskClick={handleTaskClick}
            onToggleTaskComplete={calendar.toggleTaskComplete}
          />
        )}

        {/* Task Sidebar */}
        {showTaskSidebar && (
          <TaskSidebar
            unscheduledTasks={calendar.unscheduledTasks}
            completedTasks={calendar.completedTasks}
            calendars={calendar.calendars}
            onTaskClick={handleTaskClick}
            onToggleComplete={calendar.toggleTaskComplete}
            onCreateTask={handleCreateTask}
          />
        )}
      </div>

      {/* Event dialog */}
      <EventDialog
        open={dialogOpen}
        event={editingEvent}
        calendars={calendar.calendars}
        defaultDate={calendar.selectedDate}
        onClose={() => {
          setDialogOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />

      {/* Task dialog */}
      <TaskDialog
        open={taskDialogOpen}
        task={editingTask}
        calendars={calendar.calendars}
        defaultDate={calendar.selectedDate}
        onClose={() => {
          setTaskDialogOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}
