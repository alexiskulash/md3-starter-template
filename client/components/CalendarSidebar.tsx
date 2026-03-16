import "@material/web/checkbox/checkbox.js";
import "@material/web/list/list.js";
import "@material/web/list/list-item.js";
import { useCalendar } from "../context/CalendarContext";
import MiniCalendar from "./MiniCalendar";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "md-checkbox": any;
      "md-list": any;
      "md-list-item": any;
    }
  }
}

export default function CalendarSidebar() {
  const { calendars, toggleCalendar } = useCalendar();

  return (
    <div
      style={{
        width: "280px",
        borderRight: "1px solid hsl(var(--md-sys-color-outline-variant))",
        background: "hsl(var(--md-sys-color-surface))",
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
      }}
    >
      {/* Mini Calendar */}
      <div style={{ padding: "16px" }}>
        <MiniCalendar />
      </div>

      {/* Calendar List */}
      <div style={{ padding: "16px", paddingTop: "0" }}>
        <h3
          style={{
            fontSize: "14px",
            fontWeight: "500",
            color: "hsl(var(--md-sys-color-on-surface-variant))",
            marginBottom: "8px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          My Calendars
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {calendars.map((calendar) => (
            <div
              key={calendar.id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "background 0.2s",
                opacity: calendar.enabled ? 1 : 0.5,
              }}
              onClick={() => toggleCalendar(calendar.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "hsl(var(--md-sys-color-surface-variant))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <md-checkbox
                checked={calendar.enabled ? true : undefined}
                onClick={(e: Event) => {
                  e.stopPropagation();
                  toggleCalendar(calendar.id);
                }}
                style={{
                  marginRight: "12px",
                }}
              />
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: calendar.color,
                  marginRight: "12px",
                }}
              />
              <span
                style={{
                  fontSize: "14px",
                  color: "hsl(var(--md-sys-color-on-surface))",
                }}
              >
                {calendar.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
