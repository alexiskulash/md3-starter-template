import { useMemo } from "react";
import "@material/web/list/list.js";
import "@material/web/list/list-item.js";
import "@material/web/divider/divider.js";
import "@material/web/icon/icon.js";
import type { CalendarEvent, Calendar } from "../types/calendar";

interface AgendaViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  calendars: Calendar[];
  onEventClick: (event: CalendarEvent) => void;
}

export function AgendaView({
  currentDate,
  events,
  calendars,
  onEventClick,
}: AgendaViewProps) {
  const calendarMap = useMemo(() => {
    return new Map(calendars.map((cal) => [cal.id, cal]));
  }, [calendars]);

  // Get today's events sorted by time
  const todayEvents = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    return events
      .filter((event) => {
        return todayStr >= event.startDate && todayStr <= event.endDate;
      })
      .sort((a, b) => {
        // Sort by start time
        return a.startTime.localeCompare(b.startTime);
      });
  }, [events]);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatTimeRange = (startTime: string, endTime: string) => {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  const isToday = () => {
    const today = new Date();
    return (
      currentDate.getDate() === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
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
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "500",
              color: "hsl(var(--md-sys-color-on-surface))",
              marginBottom: "8px",
            }}
          >
            {isToday() ? "Today's Schedule" : currentDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "hsl(var(--md-sys-color-on-surface-variant))",
            }}
          >
            {todayEvents.length === 0
              ? "No events scheduled"
              : `${todayEvents.length} event${todayEvents.length === 1 ? "" : "s"} scheduled`}
          </p>
        </div>

        {/* Events List */}
        {todayEvents.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 24px",
              background: "hsl(var(--md-sys-color-surface-variant))",
              borderRadius: "12px",
            }}
          >
            <md-icon
              style={{
                fontSize: "64px",
                color: "hsl(var(--md-sys-color-on-surface-variant))",
                marginBottom: "16px",
                display: "block",
              }}
            >
              event_available
            </md-icon>
            <p
              style={{
                fontSize: "16px",
                color: "hsl(var(--md-sys-color-on-surface-variant))",
              }}
            >
              {isToday() ? "You have no events today. Enjoy your free time!" : "No events scheduled for this day."}
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {todayEvents.map((event, index) => {
              const calendar = calendarMap.get(event.calendarId);
              const isMultiDay = event.startDate !== event.endDate;

              return (
                <div
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  style={{
                    display: "flex",
                    gap: "16px",
                    padding: "16px",
                    background: "hsl(var(--md-sys-color-surface-variant))",
                    borderRadius: "12px",
                    borderLeft: `4px solid ${calendar?.color || "hsl(var(--md-sys-color-primary))"}`,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "hsl(var(--md-sys-color-secondary-container))";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "hsl(var(--md-sys-color-surface-variant))";
                  }}
                >
                  {/* Time column */}
                  <div
                    style={{
                      minWidth: "100px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "hsl(var(--md-sys-color-primary))",
                      }}
                    >
                      {formatTime(event.startTime)}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "hsl(var(--md-sys-color-on-surface-variant))",
                      }}
                    >
                      {formatTime(event.endTime)}
                    </span>
                  </div>

                  {/* Event details */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <h3
                        style={{
                          fontSize: "16px",
                          fontWeight: "500",
                          color: "hsl(var(--md-sys-color-on-surface))",
                          margin: 0,
                        }}
                      >
                        {event.title}
                      </h3>
                      {isMultiDay && (
                        <span
                          style={{
                            fontSize: "11px",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            background: "hsl(var(--md-sys-color-tertiary-container))",
                            color: "hsl(var(--md-sys-color-on-tertiary-container))",
                          }}
                        >
                          Multi-day
                        </span>
                      )}
                    </div>

                    {event.description && (
                      <p
                        style={{
                          fontSize: "14px",
                          color: "hsl(var(--md-sys-color-on-surface-variant))",
                          margin: 0,
                        }}
                      >
                        {event.description}
                      </p>
                    )}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginTop: "4px",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: calendar?.color || "hsl(var(--md-sys-color-primary))",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "12px",
                          color: "hsl(var(--md-sys-color-on-surface-variant))",
                        }}
                      >
                        {calendar?.name || "Calendar"}
                      </span>
                    </div>
                  </div>

                  {/* Icon */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <md-icon
                      style={{
                        fontSize: "20px",
                        color: "hsl(var(--md-sys-color-on-surface-variant))",
                      }}
                    >
                      chevron_right
                    </md-icon>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
