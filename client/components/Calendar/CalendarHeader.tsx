import { ViewMode, Calendar } from "../../types/calendar";
import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/icon/icon.js";
import QuickAddInput from "./QuickAddInput";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "md-filled-button": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      "md-outlined-button": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      "md-icon-button": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      "md-icon": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

interface CalendarHeaderProps {
  viewMode: ViewMode;
  currentDate: Date;
  isDarkMode: boolean;
  calendars: Calendar[];
  onViewModeChange: (mode: ViewMode) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onCreate: () => void;
  onCreateTimeBlock: () => void;
  onQuickAdd: (event: {
    title: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    calendarId: string;
  }) => void;
  onThemeToggle: () => void;
}

export default function CalendarHeader({
  viewMode,
  currentDate,
  isDarkMode,
  calendars,
  onViewModeChange,
  onPrevious,
  onNext,
  onToday,
  onCreate,
  onCreateTimeBlock,
  onQuickAdd,
  onThemeToggle,
}: CalendarHeaderProps) {
  const formatTitle = () => {
    if (viewMode === "month") {
      return currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    } else {
      return currentDate.getFullYear().toString();
    }
  };

  return (
    <header
      style={{
        background: "#221640",
        borderBottom: "1px solid hsl(var(--md-sys-color-outline-variant))",
        padding: "16px 24px",
      }}
    >
      <div
        className="header-content"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        {/* Left Section */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", flex: 1 }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "500",
              color: "#ffffff",
              margin: 0,
            }}
          >
            Calendar
          </h1>

          <md-filled-button onClick={onCreate}>
            <md-icon slot="icon">add</md-icon>
            Create
          </md-filled-button>

          <md-outlined-button onClick={onCreateTimeBlock}>
            <md-icon slot="icon">schedule</md-icon>
            Time Block
          </md-outlined-button>

          <QuickAddInput calendars={calendars} onQuickAdd={onQuickAdd} />
        </div>

        {/* Center Section - Navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <md-outlined-button onClick={onToday}>Today</md-outlined-button>

          <md-icon-button onClick={onPrevious}>
            <md-icon>chevron_left</md-icon>
          </md-icon-button>

          <md-icon-button onClick={onNext}>
            <md-icon>chevron_right</md-icon>
          </md-icon-button>

          <h2
            style={{
              fontSize: "18px",
              fontWeight: "500",
              color: "#ffffff",
              margin: 0,
              minWidth: "200px",
              textAlign: "center",
            }}
          >
            {formatTitle()}
          </h2>
        </div>

        {/* Right Section - View Toggle & Theme Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* View Toggle */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              background: "hsl(var(--md-sys-color-surface-container-highest))",
              borderRadius: "20px",
              padding: "4px",
            }}
          >
            <md-outlined-button
              onClick={() => onViewModeChange("month")}
              style={{
                background:
                  viewMode === "month"
                    ? "hsl(var(--md-sys-color-secondary-container))"
                    : "transparent",
                color:
                  viewMode === "month"
                    ? "hsl(var(--md-sys-color-on-secondary-container))"
                    : "#ffffff",
              }}
            >
              Month
            </md-outlined-button>
            <md-outlined-button
              onClick={() => onViewModeChange("year")}
              style={{
                background:
                  viewMode === "year"
                    ? "hsl(var(--md-sys-color-secondary-container))"
                    : "transparent",
                color:
                  viewMode === "year"
                    ? "hsl(var(--md-sys-color-on-secondary-container))"
                    : "#ffffff",
              }}
            >
              Year
            </md-outlined-button>
          </div>

          {/* Theme Toggle */}
          <md-icon-button onClick={onThemeToggle} title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}>
            <md-icon>{isDarkMode ? "light_mode" : "dark_mode"}</md-icon>
          </md-icon-button>
        </div>
      </div>

      {/* Mobile Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            align-items: stretch !important;
          }
          .header-content > div {
            justify-content: center;
          }
        }
      `}</style>
    </header>
  );
}
