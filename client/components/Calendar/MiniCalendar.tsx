interface MiniCalendarProps {
  currentDate: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function MiniCalendar({
  currentDate,
  selectedDate,
  onDateSelect,
}: MiniCalendarProps) {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days: JSX.Element[] = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isSelected =
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear();
      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === currentDate.getMonth() &&
        new Date().getFullYear() === currentDate.getFullYear();

      days.push(
        <button
          key={day}
          onClick={() => onDateSelect(date)}
          style={{
            width: "32px",
            height: "32px",
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
            fontSize: "13px",
            fontWeight: isToday ? "600" : "400",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
        </button>
      );
    }

    return days;
  };

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div>
      <h3
        style={{
          fontSize: "14px",
          fontWeight: "500",
          color: "hsl(var(--md-sys-color-on-surface))",
          marginBottom: "12px",
          textAlign: "center",
        }}
      >
        {currentDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })}
      </h3>

      {/* Week day headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "4px",
          marginBottom: "8px",
        }}
      >
        {weekDays.map((day, i) => (
          <div
            key={i}
            style={{
              fontSize: "12px",
              fontWeight: "500",
              color: "hsl(var(--md-sys-color-on-surface-variant))",
              textAlign: "center",
              width: "32px",
              height: "24px",
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
          gap: "4px",
        }}
      >
        {renderCalendar()}
      </div>
    </div>
  );
}
