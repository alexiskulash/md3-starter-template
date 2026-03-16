import { useMemo } from "react";
import type { CalendarEvent, Calendar, Task } from "../types/calendar";

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  tasks: Task[];
  calendars: Calendar[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onTaskClick: (task: Task) => void;
}

export function MonthView({
  currentDate,
  events,
  tasks,
  calendars,
  selectedDate,
  onDateSelect,
  onEventClick,
  onTaskClick,
}: MonthViewProps) {
  const calendarMap = useMemo(() => {
    return new Map(calendars.map((cal) => [cal.id, cal]));
  }, [calendars]);

  const { weeks, monthStart } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    // Calculate dates including previous/next month days
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];

    // Add days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      currentWeek.push(new Date(year, month - 1, prevMonthLastDay - i));
    }

    // Add days from current month
    for (let day = 1; day <= daysInMonth; day++) {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(new Date(year, month, day));
    }

    // Add days from next month
    let nextMonthDay = 1;
    while (currentWeek.length < 7) {
      currentWeek.push(new Date(year, month + 1, nextMonthDay));
      nextMonthDay++;
    }
    weeks.push(currentWeek);

    return { weeks, monthStart: firstDay };
  }, [currentDate]);

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return events.filter((event) => {
      return dateStr >= event.startDate && dateStr <= event.endDate;
    });
  };

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return tasks.filter((task) => task.scheduledDate === dateStr);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelectedDate = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "hsl(var(--md-sys-color-surface))",
        padding: "16px",
      }}
    >
      {/* Calendar Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: "auto 1fr",
          flex: 1,
          gap: "8px",
        }}
      >
        {/* Day headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
            (day) => (
              <div
                key={day}
                style={{
                  textAlign: "center",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "hsl(var(--md-sys-color-on-surface-variant))",
                  padding: "8px",
                }}
              >
                {day}
              </div>
            )
          )}
        </div>

        {/* Weeks grid */}
        <div
          style={{
            display: "grid",
            gridTemplateRows: `repeat(${weeks.length}, 1fr)`,
            gap: "8px",
            flex: 1,
          }}
        >
          {weeks.map((week, weekIndex) => (
            <div
              key={weekIndex}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "8px",
              }}
            >
              {week.map((date, dayIndex) => {
                const dayEvents = getEventsForDate(date);
                const dayTasks = getTasksForDate(date);
                const allItems = [...dayEvents, ...dayTasks];
                const visibleEvents = dayEvents.slice(0, 2);
                const visibleTasks = dayTasks.slice(0, 3 - visibleEvents.length);
                const moreCount = allItems.length - (visibleEvents.length + visibleTasks.length);

                return (
                  <div
                    key={dayIndex}
                    onClick={() => onDateSelect(date)}
                    style={{
                      border: `1px solid hsl(var(--md-sys-color-outline-variant))`,
                      borderRadius: "8px",
                      padding: "8px",
                      cursor: "pointer",
                      background: isSelectedDate(date)
                        ? "hsl(var(--md-sys-color-surface-variant))"
                        : "transparent",
                      minHeight: "100px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      transition: "background 0.2s",
                      minWidth: 0,
                      overflow: "hidden",
                    }}
                  >
                    {/* Date number */}
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: isToday(date) ? "700" : "500",
                        color: !isCurrentMonth(date)
                          ? "hsl(var(--md-sys-color-outline))"
                          : isToday(date)
                          ? "hsl(var(--md-sys-color-primary))"
                          : "hsl(var(--md-sys-color-on-surface))",
                        marginBottom: "4px",
                      }}
                    >
                      {isToday(date) ? (
                        <span
                          style={{
                            background: "hsl(var(--md-sys-color-primary))",
                            color: "hsl(var(--md-sys-color-on-primary))",
                            borderRadius: "50%",
                            width: "24px",
                            height: "24px",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {date.getDate()}
                        </span>
                      ) : (
                        date.getDate()
                      )}
                    </div>

                    {/* Events and Tasks */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                        minWidth: 0,
                        width: "100%",
                      }}
                    >
                      {/* Events */}
                      {visibleEvents.map((event) => {
                        const calendar = calendarMap.get(event.calendarId);
                        return (
                          <button
                            key={event.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onEventClick(event);
                            }}
                            className="calendar-event-chip"
                            style={{
                              background: calendar?.color || "hsl(var(--md-sys-color-primary))",
                              color: "white",
                              padding: "4px 6px",
                              borderRadius: "4px",
                              fontSize: "11px",
                              border: "none",
                              textAlign: "left",
                              cursor: "pointer",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              transition: "opacity 0.2s",
                              width: "100%",
                              minWidth: 0,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.opacity = "0.8";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.opacity = "1";
                            }}
                          >
                            {formatTime(event.startTime)} {event.title}
                          </button>
                        );
                      })}

                      {/* Tasks */}
                      {visibleTasks.map((task) => {
                        const calendar = calendarMap.get(task.calendarId);
                        const taskColor = calendar?.color || "hsl(var(--md-sys-color-primary))";
                        return (
                          <button
                            key={task.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onTaskClick(task);
                            }}
                            className="calendar-task-chip"
                            style={{
                              background: taskColor,
                              color: "white",
                              padding: "4px 6px",
                              borderRadius: "4px",
                              fontSize: "11px",
                              border: "2px dashed rgba(255, 255, 255, 0.5)",
                              textAlign: "left",
                              cursor: "pointer",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              transition: "opacity 0.2s",
                              width: "100%",
                              minWidth: 0,
                              opacity: 0.85,
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.opacity = "0.7";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.opacity = "0.85";
                            }}
                          >
                            <span style={{ fontSize: "10px" }}>☐</span>
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                              {task.scheduledStartTime ? `${formatTime(task.scheduledStartTime)} ` : ""}
                              {task.title}
                            </span>
                          </button>
                        );
                      })}

                      {moreCount > 0 && (
                        <div
                          style={{
                            fontSize: "11px",
                            color: "hsl(var(--md-sys-color-primary))",
                            fontWeight: "500",
                            padding: "2px 6px",
                          }}
                        >
                          +{moreCount} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
