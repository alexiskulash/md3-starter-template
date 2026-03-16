import { useMemo, useState } from 'react';
import { useCalendar } from '../contexts/CalendarContext';
import { CalendarEvent } from '../types/calendar';
import {
  getMonthCalendarGrid,
  isSameDay,
  isToday,
  formatDateISO,
  getEventsForDate,
  sortEventsByTime,
  formatTimeDisplay,
} from '../utils/calendar';
import { EventDialog } from './EventDialog';
import { DeleteEventDialog } from './DeleteEventDialog';

export function MonthView() {
  const { state, setSelectedDate, getCalendarById, getEnabledCalendars } = useCalendar();
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [defaultEventDate, setDefaultEventDate] = useState<Date | undefined>();

  const year = state.viewDate.getFullYear();
  const month = state.viewDate.getMonth();

  const calendarGrid = useMemo(() => {
    return getMonthCalendarGrid(year, month);
  }, [year, month]);

  const handleDateClick = (date: Date) => {
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

  const handleDeleteClick = (e: React.MouseEvent, event: CalendarEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setDeleteDialogOpen(true);
  };

  const renderDay = (date: Date) => {
    const isCurrentMonth = date.getMonth() === month;
    const isSelected = isSameDay(date, state.selectedDate);
    const isTodayDate = isToday(date);

    const events = getEventsForDate(state.events, date, getEnabledCalendars());
    const sortedEvents = sortEventsByTime(events);
    const visibleEvents = sortedEvents.slice(0, 3);
    const hasMore = sortedEvents.length > 3;
    const moreCount = sortedEvents.length - 3;

    return (
      <div
        key={formatDateISO(date)}
        onClick={() => handleDateClick(date)}
        style={{
          minHeight: '120px',
          padding: '8px',
          border: '1px solid hsl(var(--md-sys-color-outline-variant))',
          backgroundColor: isSelected
            ? 'hsl(var(--md-sys-color-secondary-container))'
            : isCurrentMonth
            ? 'hsl(var(--md-sys-color-surface))'
            : 'hsl(var(--md-sys-color-surface-variant))',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          display: 'flex',
          flexDirection: 'column',
          opacity: isCurrentMonth ? 1 : 0.5,
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = 'hsl(var(--md-sys-color-surface-container-high))';
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = isCurrentMonth
              ? 'hsl(var(--md-sys-color-surface))'
              : 'hsl(var(--md-sys-color-surface-variant))';
          }
        }}
      >
        {/* Date number */}
        <div
          style={{
            fontSize: '14px',
            fontWeight: isTodayDate ? '600' : '400',
            color: isTodayDate
              ? 'hsl(var(--md-sys-color-on-primary))'
              : 'hsl(var(--md-sys-color-on-surface))',
            backgroundColor: isTodayDate
              ? 'hsl(var(--md-sys-color-primary))'
              : 'transparent',
            width: isTodayDate ? '24px' : 'auto',
            height: isTodayDate ? '24px' : 'auto',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '4px',
          }}
        >
          {date.getDate()}
        </div>

        {/* Events */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
          {visibleEvents.map((event) => {
            const calendar = getCalendarById(event.calendarId);
            return (
              <div
                key={event.id}
                onClick={(e) => handleEventClick(e, event)}
                style={{
                  backgroundColor: calendar?.color || '#888',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                {formatTimeDisplay(event.startTime)} {event.title}
              </div>
            );
          })}
          
          {hasMore && (
            <div
              style={{
                fontSize: '12px',
                color: 'hsl(var(--md-sys-color-on-surface-variant))',
                padding: '2px 6px',
              }}
            >
              +{moreCount} more
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Weekday headers */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            backgroundColor: 'hsl(var(--md-sys-color-surface-container))',
            borderBottom: '2px solid hsl(var(--md-sys-color-outline))',
          }}
        >
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              style={{
                padding: '12px 8px',
                textAlign: 'center',
                fontWeight: '600',
                fontSize: '14px',
                color: 'hsl(var(--md-sys-color-on-surface))',
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gridTemplateRows: 'repeat(6, 1fr)',
            flex: 1,
            overflow: 'hidden',
          }}
        >
          {calendarGrid.map(renderDay)}
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
