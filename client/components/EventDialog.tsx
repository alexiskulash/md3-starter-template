import { useState, useEffect, useMemo } from 'react';
import { useCalendar } from '../contexts/CalendarContext';
import { CalendarEvent } from '../types/calendar';
import { formatDateISO, getCurrentTime, getDefaultEndTime, parseISODate } from '../utils/calendar';
import { parseNaturalLanguage, isParsed, getParserExamples } from '../utils/naturalLanguageParser';

// Import Material Web chip components
import '@material/web/chips/chip-set.js';
import '@material/web/chips/input-chip.js';
import '@material/web/divider/divider.js';

interface EventDialogProps {
  open: boolean;
  onClose: () => void;
  event?: CalendarEvent | null;
  defaultDate?: Date;
  onDelete?: () => void;
}

export function EventDialog({ open, onClose, event, defaultDate, onDelete }: EventDialogProps) {
  const { state, addEvent, updateEvent, getCalendarById, setSelectedDate, setViewDate } = useCalendar();
  
  const isEditMode = !!event;
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [calendarId, setCalendarId] = useState('');

  // Natural language input state
  const [nlInput, setNlInput] = useState('');
  const [showNlInput, setShowNlInput] = useState(true);

  // Initialize form with event data or defaults
  useEffect(() => {
    if (open) {
      if (event) {
        // Edit mode - populate with event data
        setTitle(event.title);
        setDescription(event.description || '');
        setStartDate(event.startDate);
        setStartTime(event.startTime);
        setEndDate(event.endDate);
        setEndTime(event.endTime);
        setCalendarId(event.calendarId);
        setNlInput('');
        setShowNlInput(false); // Hide NL input in edit mode
      } else {
        // Create mode - use defaults
        const date = defaultDate || new Date();
        const dateStr = formatDateISO(date);
        const time = getCurrentTime();
        const endTimeStr = getDefaultEndTime(time);

        setTitle('');
        setDescription('');
        setStartDate(dateStr);
        setStartTime(time);
        setEndDate(dateStr);
        setEndTime(endTimeStr);
        setNlInput('');
        setShowNlInput(true); // Show NL input in create mode

        // Select first enabled calendar
        const firstEnabled = state.calendars.find(cal => cal.enabled);
        setCalendarId(firstEnabled?.id || state.calendars[0]?.id || '');
      }
    }
  }, [open, event, defaultDate, state.calendars]);

  // Auto-focus natural language field when dialog opens (only in create mode)
  useEffect(() => {
    if (open && !isEditMode) {
      setTimeout(() => {
        const nlField = document.querySelector<any>('#nl-input-field');
        if (nlField) {
          nlField.focus();
        }
      }, 100);
    }
  }, [open, isEditMode]);

  // Parse natural language input (memoized)
  const parsedNl = useMemo(() => {
    if (!nlInput.trim() || isEditMode) return null;
    return parseNaturalLanguage(nlInput);
  }, [nlInput, isEditMode]);

  // Parse natural language input and update form fields
  useEffect(() => {
    if (!parsedNl) return;

    // Update title if parsed
    if (parsedNl.title && parsedNl.title !== nlInput) {
      setTitle(parsedNl.title);
    } else if (!isParsed(parsedNl)) {
      // If not parsed, use the whole input as title
      setTitle(nlInput);
    }

    // Update dates and times if parsed
    if (parsedNl.startDate) setStartDate(parsedNl.startDate);
    if (parsedNl.startTime) setStartTime(parsedNl.startTime);
    if (parsedNl.endDate) setEndDate(parsedNl.endDate);
    if (parsedNl.endTime) setEndTime(parsedNl.endTime);

    // Try to match calendar by keyword
    if (parsedNl.calendarKeyword) {
      const matchedCalendar = state.calendars.find(cal =>
        cal.name.toLowerCase().includes(parsedNl.calendarKeyword!)
      );
      if (matchedCalendar) {
        setCalendarId(matchedCalendar.id);
      }
    }
  }, [parsedNl, nlInput, state.calendars]);

  // Validate form
  const isValid = useMemo(() => {
    return !!(title.trim() && startDate && startTime && endDate && endTime && calendarId);
  }, [title, startDate, startTime, endDate, endTime, calendarId]);

  const handleSave = () => {
    if (!isValid) return;

    const eventData = {
      title: title.trim(),
      description: description.trim(),
      startDate,
      startTime,
      endDate,
      endTime,
      calendarId,
    };

    if (isEditMode && event) {
      updateEvent(event.id, eventData);
    } else {
      addEvent(eventData);

      // Navigate to the event's date after creation (if not edit mode)
      // This ensures the newly created event is visible
      const eventDate = parseISODate(startDate);
      setSelectedDate(eventDate);
      setViewDate(eventDate);
    }

    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  const handleBackdropClick = (e: any) => {
    if (e.target.getAttribute('id') === 'event-dialog') {
      handleClose();
    }
  };

  if (!open) return null;

  const selectedCalendar = getCalendarById(calendarId);

  return (
    <>
      <md-dialog
        id="event-dialog"
        open={open ? true : undefined}
        onClick={handleBackdropClick}
      >
        <div slot="headline" style={{ fontSize: '24px', fontWeight: '500' }}>
          {isEditMode ? 'Edit Event' : 'Create Event'}
        </div>
        
        <form slot="content" method="dialog" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Natural Language Quick Create - Only in create mode */}
          {showNlInput && !isEditMode && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <md-filled-text-field
                  id="nl-input-field"
                  label="Quick create (e.g., 'Team meeting tomorrow at 2pm')"
                  value={nlInput}
                  onInput={(e: any) => setNlInput(e.target.value)}
                  style={{ width: '100%' }}
                  supportingText={nlInput ? '' : getParserExamples()[0]}
                >
                  <md-icon slot="leading-icon">auto_awesome</md-icon>
                </md-filled-text-field>

                {/* Display parsed data as chips */}
                {parsedNl && isParsed(parsedNl) && (
                  <md-chip-set style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {parsedNl.startDate && (
                      <md-input-chip label={`${parsedNl.startDate} ${parsedNl.startTime}`}>
                        <md-icon slot="icon">schedule</md-icon>
                      </md-input-chip>
                    )}
                    {parsedNl.calendarKeyword && (
                      <md-input-chip label={parsedNl.calendarKeyword}>
                        <md-icon slot="icon">calendar_today</md-icon>
                      </md-input-chip>
                    )}
                  </md-chip-set>
                )}
              </div>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '8px 0' }}>
                <md-divider style={{ flex: 1 }} />
                <span style={{
                  fontSize: '12px',
                  color: 'var(--md-sys-color-on-surface-variant)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  or edit details below
                </span>
                <md-divider style={{ flex: 1 }} />
              </div>
            </>
          )}

          {/* Title */}
          <md-filled-text-field
            id="event-title-field"
            label="Event title"
            value={title}
            onInput={(e: any) => setTitle(e.target.value)}
            required={true}
            style={{ width: '100%' }}
          />

          {/* Description */}
          <md-filled-text-field
            label="Description (optional)"
            value={description}
            onInput={(e: any) => setDescription(e.target.value)}
            type="textarea"
            rows={3}
            style={{ width: '100%' }}
          />

          {/* Start Date & Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <md-filled-text-field
              label="Start date"
              type="date"
              value={startDate}
              onInput={(e: any) => setStartDate(e.target.value)}
              required={true}
            />
            <md-filled-text-field
              label="Start time"
              type="time"
              value={startTime}
              onInput={(e: any) => setStartTime(e.target.value)}
              required={true}
            />
          </div>

          {/* End Date & Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <md-filled-text-field
              label="End date"
              type="date"
              value={endDate}
              onInput={(e: any) => setEndDate(e.target.value)}
              required={true}
            />
            <md-filled-text-field
              label="End time"
              type="time"
              value={endTime}
              onInput={(e: any) => setEndTime(e.target.value)}
              required={true}
            />
          </div>

          {/* Calendar Selection */}
          <md-filled-select
            label="Calendar"
            value={calendarId}
            onInput={(e: any) => setCalendarId(e.target.value)}
            required={true}
            style={{ width: '100%' }}
          >
            {state.calendars.map(cal => (
              <md-select-option key={cal.id} value={cal.id}>
                <div slot="headline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: cal.color,
                    }}
                  />
                  {cal.name}
                </div>
              </md-select-option>
            ))}
          </md-filled-select>
        </form>

        <div slot="actions" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div>
            {isEditMode && onDelete && (
              <md-outlined-button onClick={onDelete}>
                <md-icon slot="icon">delete</md-icon>
                Delete
              </md-outlined-button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <md-text-button onClick={handleClose}>Cancel</md-text-button>
            <md-filled-button
              onClick={handleSave}
              disabled={!isValid ? true : undefined}
            >
              {isEditMode ? 'Save' : 'Create'}
            </md-filled-button>
          </div>
        </div>
      </md-dialog>
    </>
  );
}
