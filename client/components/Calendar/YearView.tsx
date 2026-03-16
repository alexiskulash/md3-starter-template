import { CalendarEvent } from "../../types/calendar";

interface YearViewProps {
  currentDate: Date;
  selectedDate: Date;
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
}

export default function YearView({
  currentDate,
  selectedDate,
  events,
  onDateSelect,
}: YearViewProps) {
  const year = currentDate.getFullYear();
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (monthIndex: number) => {
    return new Date(year, monthIndex + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (monthIndex: number) => {
    return new Date(year, monthIndex, 1).getDay();
  };

  const hasEventsOnDate = (monthIndex: number, day: number) => {
    const dateStr = new Date(year, monthIndex, day).toISOString().split("T")[0];
    return events.some(event => event.startDate === dateStr);
  };

  const renderMiniMonth = (monthIndex: number) => {
    const daysInMonth = getDaysInMonth(monthIndex);
    const firstDay = getFirstDayOfMonth(monthIndex);
    const days: JSX.Element[] = [];
    const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthIndex, day);
      const isSelected =
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === monthIndex &&
        selectedDate.getFullYear() === year;
      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === monthIndex &&
        new Date().getFullYear() === year;
      const hasEvents = hasEventsOnDate(monthIndex, day);

      days.push(
        <button
          key={day}
          onClick={() => onDateSelect(date)}
          style={{
            width: "28px",
            height: "28px",
            border: "none",
            background: isSelected
              ? "hsl(var(--md-sys-color-primary))"
              : "transparent",
            color: isSelected
              ? "hsl(var(--md-sys-color-on-primary))"
              : isToday
              ? "hsl(var(--md-sys-color-primary))"
              : "hsl(var(--md-sys-color-on-surface))",
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: "11px",
            fontWeight: isToday ? "600" : "400",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (!isSelected) {
              e.currentTarget.style.background =
                "hsl(var(--md-sys-color-surface-container-highest))";
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              e.currentTarget.style.background = "transparent";
            }
          }}
        >
          {day}
          {hasEvents && !isSelected && (
            <div
              style={{
                position: "absolute",
                bottom: "2px",
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "hsl(var(--md-sys-color-primary))",
              }}
            />
          )}
        </button>
      );
    }

    return (
      <div
        style={{
          background: "hsl(var(--md-sys-color-surface-container))",
          borderRadius: "8px",
          padding: "12px",
          border: "1px solid hsl(var(--md-sys-color-outline-variant))",
        }}
      >
        {/* Month name */}
        <h3
          style={{
            fontSize: "13px",
            fontWeight: "600",
            color: "hsl(var(--md-sys-color-on-surface))",
            marginBottom: "8px",
            textAlign: "center",
          }}
        >
          {months[monthIndex]}
        </h3>

        {/* Week day headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "2px",
            marginBottom: "4px",
          }}
        >
          {weekDays.map((day, i) => (
            <div
              key={i}
              style={{
                fontSize: "10px",
                fontWeight: "500",
                color: "hsl(var(--md-sys-color-on-surface-variant))",
                textAlign: "center",
                width: "28px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "2px",
          }}
        >
          {days}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2
        style={{
          fontSize: "28px",
          fontWeight: "500",
          color: "hsl(var(--md-sys-color-on-surface))",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        {year}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {months.map((_, index) => (
          <div key={index}>{renderMiniMonth(index)}</div>
        ))}
      </div>
    </div>
  );
}
