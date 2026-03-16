import { useMemo } from 'react';
import { useCalendar } from '../contexts/CalendarContext';
import {
  getMonthCalendarGrid,
  isSameDay,
  isToday,
  formatDateISO,
  hasEvents,
  getMonthNameShort,
} from '../utils/calendar';

export function YearView() {
  const { state, setSelectedDate, setViewDate, setCurrentView, getEnabledCalendars } = useCalendar();
  
  const year = state.viewDate.getFullYear();

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setViewDate(date);
    setCurrentView('month');
  };

  const renderMiniMonth = (monthIndex: number) => {
    const calendarGrid = useMemo(() => {
      return getMonthCalendarGrid(year, monthIndex);
    }, [monthIndex]);

    const weeks: Date[][] = [];
    for (let i = 0; i < calendarGrid.length; i += 7) {
      weeks.push(calendarGrid.slice(i, i + 7));
    }

    return (
      <div
        key={monthIndex}
        style={{
          padding: '12px',
          backgroundColor: 'hsl(var(--md-sys-color-surface-container-low))',
          borderRadius: '12px',
          border: '1px solid hsl(var(--md-sys-color-outline-variant))',
        }}
      >
        {/* Month name */}
        <div
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'hsl(var(--md-sys-color-on-surface))',
            marginBottom: '8px',
            textAlign: 'center',
          }}
        >
          {getMonthNameShort(monthIndex)}
        </div>

        {/* Weekday headers */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '2px',
            marginBottom: '4px',
          }}
        >
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
            <div
              key={`${day}-${idx}`}
              style={{
                fontSize: '10px',
                textAlign: 'center',
                color: 'hsl(var(--md-sys-color-on-surface-variant))',
                fontWeight: '500',
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
            gap: '2px',
          }}
        >
          {calendarGrid.map((date) => {
            const isCurrentMonth = date.getMonth() === monthIndex;
            const isSelected = isSameDay(date, state.selectedDate);
            const isTodayDate = isToday(date);
            const hasEventsOnDate = hasEvents(state.events, date, getEnabledCalendars());

            return (
              <div
                key={formatDateISO(date)}
                onClick={() => isCurrentMonth && handleDateClick(date)}
                style={{
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  cursor: isCurrentMonth ? 'pointer' : 'default',
                  borderRadius: '50%',
                  backgroundColor: isSelected
                    ? 'hsl(var(--md-sys-color-primary))'
                    : isTodayDate
                    ? 'hsl(var(--md-sys-color-primary-container))'
                    : 'transparent',
                  color: isSelected
                    ? 'hsl(var(--md-sys-color-on-primary))'
                    : isTodayDate
                    ? 'hsl(var(--md-sys-color-on-primary-container))'
                    : isCurrentMonth
                    ? 'hsl(var(--md-sys-color-on-surface))'
                    : 'hsl(var(--md-sys-color-on-surface-variant))',
                  fontWeight: isTodayDate || isSelected ? '600' : '400',
                  opacity: isCurrentMonth ? 1 : 0.4,
                  position: 'relative',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (isCurrentMonth && !isSelected) {
                    e.currentTarget.style.backgroundColor = 'hsl(var(--md-sys-color-surface-container-highest))';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isCurrentMonth && !isSelected) {
                    e.currentTarget.style.backgroundColor = isTodayDate
                      ? 'hsl(var(--md-sys-color-primary-container))'
                      : 'transparent';
                  }
                }}
              >
                {date.getDate()}
                {hasEventsOnDate && isCurrentMonth && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '2px',
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: isSelected
                        ? 'hsl(var(--md-sys-color-on-primary))'
                        : 'hsl(var(--md-sys-color-primary))',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        padding: '24px',
        height: '100%',
        overflow: 'auto',
      }}
    >
      {/* Year header */}
      <div
        style={{
          fontSize: '32px',
          fontWeight: '700',
          color: 'hsl(var(--md-sys-color-on-surface))',
          marginBottom: '24px',
          textAlign: 'center',
        }}
      >
        {year}
      </div>

      {/* 12 month grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {Array.from({ length: 12 }, (_, i) => renderMiniMonth(i))}
      </div>
    </div>
  );
}
