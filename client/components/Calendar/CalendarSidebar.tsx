import { Calendar } from "../../types/calendar";
import "@material/web/checkbox/checkbox.js";
import MiniCalendar from "./MiniCalendar";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "md-checkbox": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        checked?: boolean;
      };
    }
  }
}

interface CalendarSidebarProps {
  calendars: Calendar[];
  currentDate: Date;
  selectedDate: Date;
  onToggleCalendar: (calendarId: string) => void;
  onDateSelect: (date: Date) => void;
}

export default function CalendarSidebar({
  calendars,
  currentDate,
  selectedDate,
  onToggleCalendar,
  onDateSelect,
}: CalendarSidebarProps) {
  return (
    <aside
      className="calendar-sidebar"
      style={{
        width: "280px",
        background: "hsl(var(--md-sys-color-surface-container-low))",
        borderRight: "1px solid hsl(var(--md-sys-color-outline-variant))",
        padding: "24px 16px",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* Mini Calendar */}
      <div>
        <MiniCalendar
          currentDate={currentDate}
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
        />
      </div>

      {/* Calendar List */}
      <div>
        <h3
          style={{
            fontSize: "14px",
            fontWeight: "500",
            color: "hsl(var(--md-sys-color-on-surface-variant))",
            marginBottom: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          My Calendars
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {calendars.map((calendar) => (
            <div
              key={calendar.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "8px",
                borderRadius: "8px",
                cursor: "pointer",
                opacity: calendar.enabled ? 1 : 0.5,
                transition: "all 0.2s ease",
              }}
              onClick={() => onToggleCalendar(calendar.id)}
            >
              <md-checkbox
                checked={calendar.enabled ? true : undefined}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCalendar(calendar.id);
                }}
              />
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: calendar.color,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: "14px",
                  color: "hsl(var(--md-sys-color-on-surface))",
                  flex: 1,
                }}
              >
                {calendar.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .calendar-sidebar {
            display: none !important;
          }
        }
      `}</style>
    </aside>
  );
}
