import { useState, useEffect } from 'react';
import { useCalendar } from '../contexts/CalendarContext';
import { CalendarHeader } from './CalendarHeader';
import { CalendarSidebar } from './CalendarSidebar';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { YearView } from './YearView';

export function CalendarLayout() {
  const { state } = useCalendar();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'hsl(var(--md-sys-color-background))',
      }}
    >
      {/* Header */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {isMobile && (
          <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}>
            <md-icon-button onClick={() => setSidebarOpen(!sidebarOpen)}>
              <md-icon>menu</md-icon>
            </md-icon-button>
          </div>
        )}
        <CalendarHeader />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* Mobile Overlay */}
        {isMobile && sidebarOpen && (
          <div
            onClick={handleOverlayClick}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 15,
            }}
          />
        )}

        {/* Sidebar */}
        <div
          style={{
            position: isMobile ? 'absolute' : 'relative',
            left: isMobile && !sidebarOpen ? '-280px' : '0',
            top: 0,
            bottom: 0,
            zIndex: 20,
            transition: 'left 0.3s ease-in-out',
          }}
        >
          <CalendarSidebar />
        </div>

        {/* Calendar View */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {state.currentView === 'month' && <MonthView />}
          {state.currentView === 'week' && <WeekView />}
          {state.currentView === 'year' && <YearView />}
        </div>
      </div>
    </div>
  );
}
