import { useMemo } from "react";
import { useCalendar } from "../contexts/CalendarContext";
import { formatTime, isSameDay } from "../utils/dateUtils";
import type { CalendarEvent } from "../types/calendar";

// Import Material Web Components
import "@material/web/list/list.js";
import "@material/web/list/list-item.js";
import "@material/web/divider/divider.js";
import "@material/web/icon/icon.js";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "md-list": any;
      "md-list-item": any;
      "md-divider": any;
      "md-icon": any;
    }
  }
}

interface AgendaViewProps {
  onEventClick: (event: CalendarEvent) => void;
}

interface EventsByDate {
  date: Date;
  events: CalendarEvent[];
}

export default function AgendaView({ onEventClick }: AgendaViewProps) {
  const { events, calendars } = useCalendar();

  const getCalendarColor = (calendarId: string): string => {
    const calendar = calendars.find((cal) => cal.id === calendarId);
    return calendar?.color || "#666";
  };

  const getCalendarName = (calendarId: string): string => {
    const calendar = calendars.find((cal) => cal.id === calendarId);
    return calendar?.name || "Unknown";
  };

  // Get enabled calendar IDs
  const enabledCalendarIds = useMemo(
    () => calendars.filter((cal) => cal.enabled).map((cal) => cal.id),
    [calendars]
  );

  // Group events by date, sorted chronologically
  const eventsByDate = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter to enabled calendars and future/today events
    const upcomingEvents = events
      .filter((event) => {
        if (!enabledCalendarIds.includes(event.calendarId)) return false;
        const eventDate = new Date(event.startDate);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today;
      })
      .sort((a, b) => {
        // Sort by date first, then by time
        const dateCompare =
          a.startDate.getTime() - b.startDate.getTime();
        if (dateCompare !== 0) return dateCompare;
        return a.startTime.localeCompare(b.startTime);
      });

    // Group by date
    const grouped: EventsByDate[] = [];
    let currentDate: Date | null = null;
    let currentGroup: CalendarEvent[] = [];

    upcomingEvents.forEach((event) => {
      if (!currentDate || !isSameDay(currentDate, event.startDate)) {
        if (currentGroup.length > 0) {
          grouped.push({ date: currentDate!, events: currentGroup });
        }
        currentDate = new Date(event.startDate);
        currentGroup = [event];
      } else {
        currentGroup.push(event);
      }
    });

    if (currentGroup.length > 0 && currentDate) {
      grouped.push({ date: currentDate, events: currentGroup });
    }

    return grouped;
  }, [events, enabledCalendarIds]);

  const formatDateHeader = (date: Date): string => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (isSameDay(date, today)) {
      return `Today, ${date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      })}`;
    } else if (isSameDay(date, tomorrow)) {
      return `Tomorrow, ${date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      })}`;
    }

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
  };

  if (eventsByDate.length === 0) {
    return (
      <div
        className="h-full flex flex-col items-center justify-center p-8"
        style={{ color: "hsl(var(--md-sys-color-on-surface-variant))" }}
      >
        <md-icon style={{ fontSize: "64px", marginBottom: "16px" }}>
          event_available
        </md-icon>
        <h3 className="text-xl font-medium mb-2">No upcoming events</h3>
        <p className="text-center">
          Create an event or enable calendars to see your schedule
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      {eventsByDate.map(({ date, events }, groupIndex) => (
        <div key={date.toISOString()}>
          {/* Date Header */}
          <div
            className="sticky top-0 z-10 px-6 py-3 font-medium"
            style={{
              backgroundColor: "hsl(var(--md-sys-color-surface-container))",
              color: "hsl(var(--md-sys-color-on-surface))",
            }}
          >
            {formatDateHeader(date)}
          </div>

          {/* Events List */}
          <md-list>
            {events.map((event, eventIndex) => {
              const calendarColor = getCalendarColor(event.calendarId);
              const calendarName = getCalendarName(event.calendarId);

              return (
                <div key={event.id}>
                  <md-list-item
                    type="button"
                    onClick={() => onEventClick(event)}
                  >
                    <div slot="start" className="flex items-center gap-3">
                      {/* Time */}
                      <div
                        className="text-sm font-medium min-w-[80px] text-right"
                        style={{
                          color: "hsl(var(--md-sys-color-on-surface-variant))",
                        }}
                      >
                        {formatTime(event.startTime)}
                      </div>
                      {/* Color indicator */}
                      <div
                        className="w-1 h-12 rounded-full"
                        style={{ backgroundColor: calendarColor }}
                      />
                    </div>

                    <div slot="headline" className="font-medium">
                      {event.title}
                    </div>

                    {event.description && (
                      <div
                        slot="supporting-text"
                        className="text-sm"
                        style={{
                          color: "hsl(var(--md-sys-color-on-surface-variant))",
                        }}
                      >
                        {event.description}
                      </div>
                    )}

                    <div
                      slot="supporting-text"
                      className="text-xs flex items-center gap-1 mt-1"
                      style={{
                        color: "hsl(var(--md-sys-color-on-surface-variant))",
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: calendarColor }}
                      />
                      {calendarName} • {formatTime(event.startTime)} -{" "}
                      {formatTime(event.endTime)}
                    </div>

                    <md-icon slot="end">chevron_right</md-icon>
                  </md-list-item>
                  {eventIndex < events.length - 1 && <md-divider />}
                </div>
              );
            })}
          </md-list>

          {/* Divider between date groups */}
          {groupIndex < eventsByDate.length - 1 && (
            <md-divider style={{ margin: "8px 0" }} />
          )}
        </div>
      ))}
    </div>
  );
}
