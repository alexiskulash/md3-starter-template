import { useState } from 'react';
import { useCalendar } from '../contexts/CalendarContext';
import { getMonthName } from '../utils/calendar';
import { EventDialog } from './EventDialog';

export function CalendarHeader() {
  const { state, navigateMonth, navigateWeek, navigateYear, goToToday, setCurrentView } = useCalendar();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const year = state.viewDate.getFullYear();
  const month = state.viewDate.getMonth();

  const handlePrevious = () => {
    if (state.currentView === 'month') {
      navigateMonth('prev');
    } else if (state.currentView === 'week') {
      navigateWeek('prev');
    } else {
      navigateYear('prev');
    }
  };

  const handleNext = () => {
    if (state.currentView === 'month') {
      navigateMonth('next');
    } else if (state.currentView === 'week') {
      navigateWeek('next');
    } else {
      navigateYear('next');
    }
  };

  const handleCreate = () => {
    setCreateDialogOpen(true);
  };

  const getCurrentPeriodText = () => {
    if (state.currentView === 'month') {
      return `${getMonthName(month)} ${year}`;
    } else if (state.currentView === 'week') {
      const weekStart = new Date(state.viewDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      if (weekStart.getMonth() === weekEnd.getMonth()) {
        return `${getMonthName(weekStart.getMonth())} ${weekStart.getDate()}-${weekEnd.getDate()}, ${year}`;
      } else {
        return `${getMonthName(weekStart.getMonth())} ${weekStart.getDate()} - ${getMonthName(weekEnd.getMonth())} ${weekEnd.getDate()}, ${year}`;
      }
    } else {
      return `${year}`;
    }
  };

  return (
    <>
      <div
        style={{
          minHeight: '64px',
          backgroundColor: 'rgba(231, 14, 14, 1)',
          borderBottom: '1px solid hsl(var(--md-sys-color-outline-variant))',
          display: 'flex',
          alignItems: 'center',
          padding: '8px 16px',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        {/* Create Button */}
        <md-filled-button onClick={handleCreate}>
          <md-icon slot="icon">add</md-icon>
          <span style={{ display: window.innerWidth < 640 ? 'none' : 'inline' }}>Create</span>
        </md-filled-button>

        {/* Current Period */}
        <div
          style={{
            fontSize: window.innerWidth < 640 ? '18px' : '22px',
            fontWeight: '600',
            color: 'hsl(var(--md-sys-color-on-surface))',
            flex: '1 1 auto',
            minWidth: '120px',
          }}
        >
          {getCurrentPeriodText()}
        </div>

        {/* Navigation Controls */}
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <md-icon-button onClick={handlePrevious}>
            <md-icon>chevron_left</md-icon>
          </md-icon-button>

          <md-outlined-button onClick={goToToday}>Today</md-outlined-button>

          <md-icon-button onClick={handleNext}>
            <md-icon>chevron_right</md-icon>
          </md-icon-button>
        </div>

        {/* View Switcher */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            backgroundColor: 'hsl(var(--md-sys-color-surface-container-highest))',
            padding: '4px',
            borderRadius: '8px',
          }}
        >
          <md-outlined-button
            onClick={() => setCurrentView('month')}
            style={{
              backgroundColor: state.currentView === 'month'
                ? 'hsl(var(--md-sys-color-secondary-container))'
                : 'transparent',
            }}
          >
            Month
          </md-outlined-button>

          <md-outlined-button
            onClick={() => setCurrentView('week')}
            style={{
              backgroundColor: state.currentView === 'week'
                ? 'hsl(var(--md-sys-color-secondary-container))'
                : 'transparent',
            }}
          >
            Week
          </md-outlined-button>

          <md-outlined-button
            onClick={() => setCurrentView('year')}
            style={{
              backgroundColor: state.currentView === 'year'
                ? 'hsl(var(--md-sys-color-secondary-container))'
                : 'transparent',
            }}
          >
            Year
          </md-outlined-button>
        </div>
      </div>

      {/* Create Event Dialog */}
      <EventDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        event={null}
      />
    </>
  );
}
