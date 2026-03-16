import { useMemo } from "react";
import { useCalendar } from "../contexts/CalendarContext";
import { getCalendarWeeks, isSameDay, getMonthName } from "../utils/dateUtils";

// Import Material Web Components
import "@material/web/checkbox/checkbox.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/icon/icon.js";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "md-checkbox": any;
      "md-icon-button": any;
      "md-icon": any;
    }
  }
}

export default function CalendarSidebar() {
  const {
    currentMonth,
    selectedDate,
    calendars,
    toggleCalendar,
    setSelectedDate,
    setCurrentMonth,
    getEventsForDate,
  } = useCalendar();

  const today = useMemo(() => new Date(), []);
  const weeks = useMemo(() => getCalendarWeeks(currentMonth), [currentMonth]);
  const monthName = useMemo(() => getMonthName(currentMonth), [currentMonth]);

  const handlePrevMonth = () => {
    const prev = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentMonth(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    setCurrentMonth(next);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  return (
    <div
      className="w-64 border-r flex flex-col"
      style={{
        backgroundColor: "hsl(var(--md-sys-color-surface))",
        borderColor: "hsl(var(--md-sys-color-outline-variant))",
      }}
    >
      {/* Mini Calendar */}
      <div className="p-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-3">
          <h3
            className="text-sm font-medium"
            style={{ color: "hsl(var(--md-sys-color-on-surface))" }}
          >
            {monthName} {currentMonth.getFullYear()}
          </h3>
          <div className="flex gap-1">
            <md-icon-button onClick={handlePrevMonth}>
              <md-icon>chevron_left</md-icon>
            </md-icon-button>
            <md-icon-button onClick={handleNextMonth}>
              <md-icon>chevron_right</md-icon>
            </md-icon-button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <div
              key={i}
              className="text-xs text-center font-medium"
              style={{ color: "hsl(var(--md-sys-color-on-surface-variant))" }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="space-y-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1">
              {week.map((date, dayIndex) => {
                const events = getEventsForDate(date);
                const hasEvents = events.length > 0;
                const isToday = isSameDay(date, today);
                const isSelected = isSameDay(date, selectedDate);
                const isCurrentMonth =
                  date.getMonth() === currentMonth.getMonth();

                return (
                  <button
                    key={dayIndex}
                    onClick={() => handleDateClick(date)}
                    className="w-8 h-8 text-xs rounded-full flex items-center justify-center relative hover:bg-opacity-70 transition-colors"
                    style={{
                      backgroundColor: isToday
                        ? "hsl(var(--md-sys-color-primary))"
                        : isSelected
                        ? "hsl(var(--md-sys-color-primary-container))"
                        : "transparent",
                      color: isToday
                        ? "hsl(var(--md-sys-color-on-primary))"
                        : isSelected
                        ? "hsl(var(--md-sys-color-on-primary-container))"
                        : isCurrentMonth
                        ? "hsl(var(--md-sys-color-on-surface))"
                        : "hsl(var(--md-sys-color-on-surface-variant))",
                      opacity: isCurrentMonth ? 1 : 0.4,
                    }}
                  >
                    {date.getDate()}
                    {hasEvents && (
                      <div
                        className="absolute bottom-0.5 w-1 h-1 rounded-full"
                        style={{
                          backgroundColor: isToday
                            ? "hsl(var(--md-sys-color-on-primary))"
                            : "hsl(var(--md-sys-color-primary))",
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div
        className="h-px mx-4 mb-4"
        style={{ backgroundColor: "hsl(var(--md-sys-color-outline-variant))" }}
      />

      {/* Calendars List */}
      <div className="flex-1 overflow-auto px-4 pb-4">
        <h3
          className="text-sm font-medium mb-3"
          style={{ color: "hsl(var(--md-sys-color-on-surface))" }}
        >
          My Calendars
        </h3>
        <div className="space-y-2">
          {calendars.map((calendar) => (
            <label
              key={calendar.id}
              className="flex items-center gap-2 cursor-pointer hover:bg-opacity-50 rounded p-1 transition-colors"
              style={{
                opacity: calendar.enabled ? 1 : 0.5,
              }}
            >
              <md-checkbox
                checked={calendar.enabled ? true : undefined}
                onClick={(e: any) => {
                  e.preventDefault();
                  toggleCalendar(calendar.id);
                }}
              />
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: calendar.color }}
              />
              <span
                className="text-sm"
                style={{ color: "hsl(var(--md-sys-color-on-surface))" }}
              >
                {calendar.name}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
