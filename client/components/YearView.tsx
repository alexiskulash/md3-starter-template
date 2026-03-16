import { useMemo } from "react";
import { useCalendar } from "../contexts/CalendarContext";
import {
  getCalendarWeeks,
  isSameDay,
  getMonthName,
} from "../utils/dateUtils";

interface YearViewProps {
  onDateClick: (date: Date) => void;
}

export default function YearView({ onDateClick }: YearViewProps) {
  const { currentMonth, selectedDate, getEventsForDate, setSelectedDate } =
    useCalendar();

  const year = currentMonth.getFullYear();
  const today = useMemo(() => new Date(), []);

  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
  }, [year]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateClick(date);
  };

  const renderMiniMonth = (monthDate: Date) => {
    const weeks = getCalendarWeeks(monthDate);
    const monthName = getMonthName(monthDate);

    return (
      <div
        key={monthDate.getMonth()}
        className="p-4 rounded-lg"
        style={{ backgroundColor: "hsl(var(--md-sys-color-surface-container))" }}
      >
        {/* Month name */}
        <div
          className="text-center font-medium mb-2"
          style={{ color: "hsl(var(--md-sys-color-on-surface))" }}
        >
          {monthName}
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <div
              key={i}
              className="text-xs text-center"
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
                const isCurrentMonth = date.getMonth() === monthDate.getMonth();

                return (
                  <button
                    key={dayIndex}
                    onClick={() => handleDateClick(date)}
                    className="w-7 h-7 text-xs rounded-full flex items-center justify-center relative hover:bg-opacity-70 transition-colors"
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
    );
  };

  return (
    <div className="h-full overflow-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {months.map((monthDate) => renderMiniMonth(monthDate))}
      </div>
    </div>
  );
}
