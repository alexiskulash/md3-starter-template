import { useState, useMemo } from 'react';
import { useCalendar } from '../contexts/CalendarContext';
import { CalendarEvent } from '../types/calendar';
import {
  getWeekDays,
  getDayNameShort,
  isSameDay,
  isToday,
  formatDateISO,
  getEventsForDate,
  sortEventsByTime,
  formatTimeDisplay,
} from '../utils/calendar';
import { EventDialog } from './EventDialog';
import { DeleteEventDialog } from './DeleteEventDialog';

export function WeekView() {
  const { state, setSelectedDate, getCalendarById, getEnabledCalendars } = useCalendar();
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [defaultEventDate, setDefaultEventDate] = useState<Date | undefined>();

  const weekDays = useMemo(() => {
    return getWeekDays(state.viewDate);
  }, [state.viewDate]);

  // Generate hours (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setDefaultEventDate(date);
    setSelectedEvent(null);
    setEventDialogOpen(true);
  };

  const handleEventClick = (e: React.MouseEvent, event: CalendarEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setEventDialogOpen(true);
  };

  const formatHour = (hour: number): string => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  const getEventPosition = (event: CalendarEvent): { top: number; height: number } => {
    const [startHour, startMinute] = event.startTime.split(':').map(Number);
    const [endHour, endMinute] = event.endTime.split(':').map(Number);
    
    const startDecimal = startHour + startMinute / 60;
    const endDecimal = endHour + endMinute / 60;
    
    const top = startDecimal * 60; // 60px per hour
    const height = (endDecimal - startDecimal) * 60;
    
    return { top, height: Math.max(height, 30) }; // Minimum 30px height
  };

  const renderDayColumn = (date: Date) => {
    const events = getEventsForDate(state.events, date, getEnabledCalendars());
    const isTodayDate = isToday(date);
    const isSelected = isSameDay(date, state.selectedDate);

    return (
      <div
        key={formatDateISO(date)}
        style={{
          flex: 1,
          minWidth: '100px',
          position: 'relative',
          borderRight: '1px solid hsl(var(--md-sys-color-outline-variant))',
        }}
      >
        {/* Hour slots */}
        {hours.map((hour) => (
          <div
            key={hour}
            onClick={() => handleDayClick(date)}
            style={{
              height: '60px',
              borderBottom: '1px solid hsl(var(--md-sys-color-outline-variant))',
              cursor: 'pointer',
              backgroundColor: isSelected
                ? 'hsl(var(--md-sys-color-secondary-container) / 0.3)'
                : 'transparent',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = 'hsl(var(--md-sys-color-surface-container))';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          />
        ))}

        {/* Events overlay */}
        {events.map((event) => {
          const calendar = getCalendarById(event.calendarId);
          const position = getEventPosition(event);
          
          return (
            <div
              key={event.id}
              onClick={(e) => handleEventClick(e, event)}
              style={{
                position: 'absolute',
                top: `${position.top}px`,
                left: '4px',
                right: '4px',
                height: `${position.height}px`,
                backgroundColor: calendar?.color || '#888',
                color: 'white',
                padding: '4px 6px',
                borderRadius: '4px',
                fontSize: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                transition: 'opacity 0.2s',
                zIndex: 1,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                {event.title}
              </div>
              <div style={{ fontSize: '11px', opacity: 0.9 }}>
                {formatTimeDisplay(event.startTime)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Day headers */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'hsl(var(--md-sys-color-surface-container))',
            borderBottom: '2px solid hsl(var(--md-sys-color-outline))',
            position: 'sticky',
            top: 0,
            zIndex: 2,
          }}
        >
          {/* Time column header */}
          <div
            style={{
              width: '80px',
              padding: '12px 8px',
              borderRight: '1px solid hsl(var(--md-sys-color-outline-variant))',
              flexShrink: 0,
            }}
          />

          {/* Day headers */}
          {weekDays.map((date) => {
            const isTodayDate = isToday(date);
            return (
              <div
                key={formatDateISO(date)}
                style={{
                  flex: 1,
                  minWidth: '100px',
                  padding: '12px 8px',
                  textAlign: 'center',
                  borderRight: '1px solid hsl(var(--md-sys-color-outline-variant))',
                  backgroundColor: isTodayDate
                    ? 'hsl(var(--md-sys-color-primary-container))'
                    : 'transparent',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: 'hsl(var(--md-sys-color-on-surface-variant))',
                    marginBottom: '4px',
                  }}
                >
                  {getDayNameShort(date.getDay())}
                </div>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: isTodayDate ? '700' : '500',
                    color: isTodayDate
                      ? 'hsl(var(--md-sys-color-primary))'
                      : 'hsl(var(--md-sys-color-on-surface))',
                  }}
                >
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Week grid */}
        <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
          <div style={{ display: 'flex', minHeight: '1440px' }}>
            {/* Time column */}
            <div
              style={{
                width: '80px',
                flexShrink: 0,
                borderRight: '1px solid hsl(var(--md-sys-color-outline-variant))',
                backgroundColor: 'hsl(var(--md-sys-color-surface))',
                position: 'sticky',
                left: 0,
                zIndex: 1,
              }}
            >
              {hours.map((hour) => (
                <div
                  key={hour}
                  style={{
                    height: '60px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    color: 'hsl(var(--md-sys-color-on-surface-variant))',
                    textAlign: 'right',
                    borderBottom: '1px solid hsl(var(--md-sys-color-outline-variant))',
                  }}
                >
                  {formatHour(hour)}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {weekDays.map(renderDayColumn)}
          </div>
        </div>
      </div>

      {/* Event Dialog */}
      <EventDialog
        open={eventDialogOpen}
        onClose={() => {
          setEventDialogOpen(false);
          setSelectedEvent(null);
          setDefaultEventDate(undefined);
        }}
        event={selectedEvent}
        defaultDate={defaultEventDate}
        onDelete={() => {
          if (selectedEvent) {
            setEventDialogOpen(false);
            setSelectedEvent(selectedEvent);
            setDeleteDialogOpen(true);
          }
        }}
      />

      {/* Delete Dialog */}
      <DeleteEventDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
      />
    </>
  );
}
