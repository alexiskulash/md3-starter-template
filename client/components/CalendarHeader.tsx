import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/icon/icon.js";

interface CalendarHeaderProps {
  currentDate: Date;
  currentView: "month" | "year" | "agenda";
  theme: "light" | "dark";
  showTaskSidebar: boolean;
  unscheduledTaskCount: number;
  onViewChange: (view: "month" | "year" | "agenda") => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onCreateEvent: () => void;
  onThemeToggle: () => void;
  onToggleTaskSidebar: () => void;
}

export function CalendarHeader({
  currentDate,
  currentView,
  theme,
  showTaskSidebar,
  unscheduledTaskCount,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
  onCreateEvent,
  onThemeToggle,
  onToggleTaskSidebar,
}: CalendarHeaderProps) {
  const formatTitle = () => {
    if (currentView === "month") {
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
        padding: "16px 24px",
        borderBottom: "1px solid hsl(var(--md-sys-color-primary))",
        background: "hsl(var(--md-sys-color-primary))",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left side - Logo and navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: "500",
              color: "hsl(var(--md-sys-color-on-primary))",
              margin: 0,
            }}
          >
            Calendar
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <md-outlined-button onClick={onToday}>Today</md-outlined-button>

            <md-icon-button onClick={onPrevious}>
              <md-icon>chevron_left</md-icon>
            </md-icon-button>

            <md-icon-button onClick={onNext}>
              <md-icon>chevron_right</md-icon>
            </md-icon-button>

            <h2
              style={{
                fontSize: "16px",
                fontWeight: "500",
                color: "hsl(var(--md-sys-color-on-primary))",
                margin: "0 8px",
                minWidth: "150px",
              }}
            >
              {formatTitle()}
            </h2>
          </div>
        </div>

        {/* Right side - View switcher and create button */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* View Switcher */}
          <div
            style={{
              display: "flex",
              gap: "0",
              border: "1px solid hsl(var(--md-sys-color-on-primary) / 0.3)",
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => onViewChange("month")}
              style={{
                padding: "8px 16px",
                border: "none",
                background:
                  currentView === "month"
                    ? "hsl(var(--md-sys-color-secondary-container))"
                    : "transparent",
                color:
                  currentView === "month"
                    ? "hsl(var(--md-sys-color-on-secondary-container))"
                    : "hsl(var(--md-sys-color-on-primary))",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s",
              }}
            >
              Month
            </button>
            <button
              onClick={() => onViewChange("year")}
              style={{
                padding: "8px 16px",
                border: "none",
                borderLeft: "1px solid hsl(var(--md-sys-color-on-primary) / 0.3)",
                background:
                  currentView === "year"
                    ? "hsl(var(--md-sys-color-secondary-container))"
                    : "transparent",
                color:
                  currentView === "year"
                    ? "hsl(var(--md-sys-color-on-secondary-container))"
                    : "hsl(var(--md-sys-color-on-primary))",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s",
              }}
            >
              Year
            </button>
            <button
              onClick={() => onViewChange("agenda")}
              style={{
                padding: "8px 16px",
                border: "none",
                borderLeft: "1px solid hsl(var(--md-sys-color-on-primary) / 0.3)",
                background:
                  currentView === "agenda"
                    ? "hsl(var(--md-sys-color-secondary-container))"
                    : "transparent",
                color:
                  currentView === "agenda"
                    ? "hsl(var(--md-sys-color-on-secondary-container))"
                    : "hsl(var(--md-sys-color-on-primary))",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s",
              }}
            >
              Agenda
            </button>
          </div>

          <div style={{ position: "relative" }}>
            <md-icon-button
              onClick={onToggleTaskSidebar}
              title="Toggle task sidebar"
              style={{
                background: showTaskSidebar
                  ? "hsl(var(--md-sys-color-secondary-container))"
                  : "transparent",
              } as any}
            >
              <md-icon>task_alt</md-icon>
            </md-icon-button>
            {unscheduledTaskCount > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  background: "hsl(var(--md-sys-color-error))",
                  color: "hsl(var(--md-sys-color-on-error))",
                  borderRadius: "50%",
                  width: "18px",
                  height: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  fontWeight: "700",
                  pointerEvents: "none",
                }}
              >
                {unscheduledTaskCount > 9 ? "9+" : unscheduledTaskCount}
              </div>
            )}
          </div>

          <md-icon-button onClick={onThemeToggle} title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}>
            <md-icon>{theme === "light" ? "dark_mode" : "light_mode"}</md-icon>
          </md-icon-button>

          <md-filled-button onClick={onCreateEvent}>
            <md-icon slot="icon">add</md-icon>
            Create
          </md-filled-button>
        </div>
      </div>
    </header>
  );
}
