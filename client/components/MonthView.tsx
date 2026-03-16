import { useMemo } from "react";
import { useCalendar } from "../contexts/CalendarContext";
import {
  getCalendarWeeks,
  isSameDay,
  isSameMonth,
  formatTime,
} from "../utils/dateUtils";
import type { CalendarEvent } from "../types/calendar";

interface MonthViewProps {
  onEventClick: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
}

export default function MonthView({
  onEventClick,
  onDateClick,
}: MonthViewProps) {
  const {
    currentMonth,
    selectedDate,
    getEventsForDate,
    calendars,
    setSelectedDate,
  } = useCalendar();

  const weeks = useMemo(() => getCalendarWeeks(currentMonth), [currentMonth]);
  const today = useMemo(() => new Date(), []);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateClick(date);
  };

  const getCalendarColor = (calendarId: string): string => {
    const calendar = calendars.find((cal) => cal.id === calendarId);
    return calendar?.color || "#666";
  };

  const renderEventChip = (event: CalendarEvent) => {
    const color = getCalendarColor(event.calendarId);
    return (
      <button
        key={event.id}
        onClick={(e) => {
          e.stopPropagation();
          onEventClick(event);
        }}
        className="w-full text-left mb-1 px-2 py-0.5 rounded text-xs text-white truncate hover:opacity-80 transition-opacity"
        style={{ backgroundColor: color }}
      >
        {formatTime(event.startTime)} {event.title}
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b" style={{ borderColor: "hsl(var(--md-sys-color-outline-variant))" }}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium"
            style={{ color: "hsl(var(--md-sys-color-on-surface-variant))" }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 overflow-auto">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 border-b" style={{ borderColor: "hsl(var(--md-sys-color-outline-variant))", minHeight: "120px" }}>
            {week.map((date, dayIndex) => {
              const events = getEventsForDate(date);
              const isToday = isSameDay(date, today);
              const isSelected = isSameDay(date, selectedDate);
              const isCurrentMonth = isSameMonth(date, currentMonth);
              const visibleEvents = events.slice(0, 3);
              const hasMore = events.length > 3;

              return (
                <button
                  key={dayIndex}
                  onClick={() => handleDateClick(date)}
                  className="p-2 border-r text-left hover:bg-opacity-50 transition-colors relative"
                  style={{
                    backgroundColor: isSelected
                      ? "hsl(var(--md-sys-color-primary-container) / 0.3)"
                      : "transparent",
                    borderColor: "hsl(var(--md-sys-color-outline-variant))",
                    opacity: isCurrentMonth ? 1 : 0.4,
                  }}
                >
                  {/* Date number */}
                  <div className="flex justify-end mb-1">
                    <span
                      className={`text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center ${
                        isToday ? "text-white" : ""
                      }`}
                      style={{
                        backgroundColor: isToday
                          ? "hsl(var(--md-sys-color-primary))"
                          : "transparent",
                        color: isToday
                          ? "hsl(var(--md-sys-color-on-primary))"
                          : isCurrentMonth
                          ? "hsl(var(--md-sys-color-on-surface))"
                          : "hsl(var(--md-sys-color-on-surface-variant))",
                      }}
                    >
                      {date.getDate()}
                    </span>
                  </div>

                  {/* Events */}
                  <div className="space-y-1">
                    {visibleEvents.map((event) => renderEventChip(event))}
                    {hasMore && (
                      <div
                        className="text-xs px-2 py-0.5"
                        style={{ color: "hsl(var(--md-sys-color-on-surface-variant))" }}
                      >
                        +{events.length - 3} more
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
