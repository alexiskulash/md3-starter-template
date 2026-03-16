import { useMemo } from 'react';
import { useCalendar } from '../contexts/CalendarContext';
import {
  getMonthCalendarGrid,
  isSameDay,
  isToday,
  formatDateISO,
  getMonthName,
} from '../utils/calendar';

export function CalendarSidebar() {
  const { state, toggleCalendar, setSelectedDate, setViewDate } = useCalendar();

  const year = state.viewDate.getFullYear();
  const month = state.viewDate.getMonth();

  const calendarGrid = useMemo(() => {
    return getMonthCalendarGrid(year, month);
  }, [year, month]);

  const weeks: Date[][] = [];
  for (let i = 0; i < calendarGrid.length; i += 7) {
    weeks.push(calendarGrid.slice(i, i + 7));
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setViewDate(date);
  };

  const handleCalendarToggle = (calendarId: string) => {
    toggleCalendar(calendarId);
  };

  return (
    <div
      style={{
        width: '280px',
        height: '100%',
        backgroundColor: 'hsl(var(--md-sys-color-surface-container-low))',
        borderRight: '1px solid hsl(var(--md-sys-color-outline-variant))',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
      }}
    >
      {/* Mini Calendar */}
      <div style={{ padding: '16px', borderBottom: '1px solid hsl(var(--md-sys-color-outline-variant))' }}>
        <div
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'hsl(var(--md-sys-color-on-surface))',
            marginBottom: '12px',
            textAlign: 'center',
          }}
        >
          {getMonthName(month)} {year}
        </div>

        {/* Weekday headers */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '4px',
            marginBottom: '4px',
          }}
        >
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
            <div
              key={`${day}-${idx}`}
              style={{
                fontSize: '11px',
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
        {weeks.map((week, weekIdx) => (
          <div
            key={weekIdx}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '4px',
              marginBottom: '4px',
            }}
          >
            {week.map((date) => {
              const isCurrentMonth = date.getMonth() === month;
              const isSelected = isSameDay(date, state.selectedDate);
              const isTodayDate = isToday(date);

              return (
                <div
                  key={formatDateISO(date)}
                  onClick={() => handleDateClick(date)}
                  style={{
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    cursor: 'pointer',
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
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'hsl(var(--md-sys-color-surface-container-highest))';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = isTodayDate
                        ? 'hsl(var(--md-sys-color-primary-container))'
                        : 'transparent';
                    }
                  }}
                >
                  {date.getDate()}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Calendar List */}
      <div style={{ padding: '16px', flex: 1 }}>
        <div
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'hsl(var(--md-sys-color-on-surface))',
            marginBottom: '12px',
          }}
        >
          My Calendars
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {state.calendars.map((calendar) => (
            <div
              key={calendar.id}
              onClick={() => handleCalendarToggle(calendar.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                opacity: calendar.enabled ? 1 : 0.5,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'hsl(var(--md-sys-color-surface-container))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <md-checkbox
                checked={calendar.enabled ? true : undefined}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCalendarToggle(calendar.id);
                }}
              />
              
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '4px',
                  backgroundColor: calendar.color,
                  flexShrink: 0,
                }}
              />
              
              <span
                style={{
                  fontSize: '14px',
                  color: 'hsl(var(--md-sys-color-on-surface))',
                  flex: 1,
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
