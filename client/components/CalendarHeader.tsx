import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/icon/icon.js";
import "@material/web/iconbutton/icon-button.js";
import { useCalendar } from "../context/CalendarContext";
import { getMonthYear } from "../utils/dateUtils";
import { addMonths, addYears } from "../utils/dateUtils";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "md-filled-button": any;
      "md-outlined-button": any;
      "md-icon": any;
      "md-icon-button": any;
    }
  }
}

interface CalendarHeaderProps {
  onCreateEvent: () => void;
}

export default function CalendarHeader({ onCreateEvent }: CalendarHeaderProps) {
  const { selectedDate, setSelectedDate, viewMode, setViewMode } = useCalendar();

  const handlePrevious = () => {
    if (viewMode === "month") {
      setSelectedDate(addMonths(selectedDate, -1));
    } else {
      setSelectedDate(addYears(selectedDate, -1));
    }
  };

  const handleNext = () => {
    if (viewMode === "month") {
      setSelectedDate(addMonths(selectedDate, 1));
    } else {
      setSelectedDate(addYears(selectedDate, 1));
    }
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const displayText = viewMode === "month" 
    ? getMonthYear(selectedDate)
    : selectedDate.getFullYear().toString();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "16px 24px",
        borderBottom: "1px solid hsl(var(--md-sys-color-outline-variant))",
        background: "hsl(var(--md-sys-color-surface))",
      }}
    >
      {/* Top row: Create button and navigation */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <md-filled-button onClick={onCreateEvent}>
          <md-icon slot="icon">add</md-icon>
          Create
        </md-filled-button>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <md-outlined-button onClick={handleToday}>
            Today
          </md-outlined-button>
          
          <md-icon-button onClick={handlePrevious}>
            <md-icon>chevron_left</md-icon>
          </md-icon-button>
          
          <md-icon-button onClick={handleNext}>
            <md-icon>chevron_right</md-icon>
          </md-icon-button>

          <h2
            style={{
              fontSize: "22px",
              fontWeight: "500",
              color: "hsl(var(--md-sys-color-on-surface))",
              marginLeft: "16px",
              minWidth: "200px",
            }}
          >
            {displayText}
          </h2>
        </div>
      </div>

      {/* Bottom row: View switcher */}
      <div style={{ display: "flex", gap: "8px" }}>
        <md-outlined-button
          onClick={() => setViewMode("month")}
          style={{
            background: viewMode === "month" 
              ? "hsl(var(--md-sys-color-secondary-container))" 
              : "transparent",
          }}
        >
          Month
        </md-outlined-button>
        <md-outlined-button
          onClick={() => setViewMode("year")}
          style={{
            background: viewMode === "year"
              ? "hsl(var(--md-sys-color-secondary-container))"
              : "transparent",
          }}
        >
          Year
        </md-outlined-button>
      </div>
    </div>
  );
}
