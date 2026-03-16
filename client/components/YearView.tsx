import { useMemo } from "react";
import type { CalendarEvent } from "../types/calendar";

interface YearViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function YearView({
  currentDate,
  events,
  selectedDate,
  onDateSelect,
}: YearViewProps) {
  const year = currentDate.getFullYear();

  const hasEventsOnDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return events.some((event) => {
      return dateStr >= event.startDate && dateStr <= event.endDate;
    });
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

  return (
    <div
      style={{
        flex: 1,
        background: "hsl(var(--md-sys-color-surface))",
        padding: "24px",
        overflow: "auto",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "24px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {Array.from({ length: 12 }, (_, monthIndex) => (
          <MiniMonth
            key={monthIndex}
            year={year}
            month={monthIndex}
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
            hasEventsOnDate={hasEventsOnDate}
            isToday={isToday}
            isSelectedDate={isSelectedDate}
          />
        ))}
      </div>
    </div>
  );
}

interface MiniMonthProps {
  year: number;
  month: number;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  hasEventsOnDate: (date: Date) => boolean;
  isToday: (date: Date) => boolean;
  isSelectedDate: (date: Date) => boolean;
}

function MiniMonth({
  year,
  month,
  selectedDate,
  onDateSelect,
  hasEventsOnDate,
  isToday,
  isSelectedDate,
}: MiniMonthProps) {
  const { days, monthName } = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: (Date | null)[] = [];

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    const monthName = firstDay.toLocaleDateString("en-US", { month: "long" });

    return { days, monthName };
  }, [year, month]);

  return (
    <div
      style={{
        border: "1px solid hsl(var(--md-sys-color-outline-variant))",
        borderRadius: "12px",
        padding: "16px",
        background: "hsl(var(--md-sys-color-surface-variant))",
      }}
    >
      {/* Month name */}
      <h3
        style={{
          fontSize: "14px",
          fontWeight: "600",
          color: "hsl(var(--md-sys-color-on-surface))",
          marginBottom: "12px",
          textAlign: "center",
        }}
      >
        {monthName}
      </h3>

      {/* Calendar grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "4px",
        }}
      >
        {/* Day headers */}
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div
            key={i}
            style={{
              textAlign: "center",
              fontSize: "11px",
              fontWeight: "600",
              color: "hsl(var(--md-sys-color-on-surface-variant))",
              padding: "4px 0",
            }}
          >
            {day}
          </div>
        ))}

        {/* Day cells */}
        {days.map((date, index) => {
          if (!date) {
            return <div key={index} style={{ aspectRatio: "1" }} />;
          }

          const today = isToday(date);
          const selected = isSelectedDate(date);
          const hasEvents = hasEventsOnDate(date);

          return (
            <button
              key={index}
              onClick={() => onDateSelect(date)}
              style={{
                aspectRatio: "1",
                border: "none",
                borderRadius: "50%",
                background: selected
                  ? "hsl(var(--md-sys-color-primary))"
                  : today
                  ? "hsl(var(--md-sys-color-primary-container))"
                  : "transparent",
                color: selected
                  ? "hsl(var(--md-sys-color-on-primary))"
                  : today
                  ? "hsl(var(--md-sys-color-on-primary-container))"
                  : "hsl(var(--md-sys-color-on-surface))",
                fontSize: "12px",
                fontWeight: today ? "700" : "400",
                cursor: "pointer",
                position: "relative",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!selected && !today) {
                  e.currentTarget.style.background =
                    "hsl(var(--md-sys-color-surface-variant))";
                }
              }}
              onMouseLeave={(e) => {
                if (!selected && !today) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {date.getDate()}
              {hasEvents && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "2px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: selected
                      ? "hsl(var(--md-sys-color-on-primary))"
                      : "hsl(var(--md-sys-color-primary))",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
