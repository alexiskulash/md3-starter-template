interface ParsedEvent {
  title: string;
  startDate: string; // ISO date string
  startTime: string; // HH:MM format
  endDate: string; // ISO date string
  endTime: string; // HH:MM format
  duration?: number; // in minutes
  calendarHint?: string;
}

export function parseNaturalLanguage(input: string): ParsedEvent | null {
  if (!input.trim()) return null;

  const text = input.trim();
  let remainingText = text;

  // Initialize result
  const result: ParsedEvent = {
    title: text,
    startDate: new Date().toISOString().split('T')[0],
    startTime: new Date().getHours().toString().padStart(2, '0') + ':00',
    endDate: new Date().toISOString().split('T')[0],
    endTime: (new Date().getHours() + 1).toString().padStart(2, '0') + ':00',
  };

  // 1. Extract calendar hint (e.g., "/work", "@personal")
  const calendarMatch = text.match(/[/@](\w+)/);
  if (calendarMatch) {
    result.calendarHint = calendarMatch[1].toLowerCase();
    remainingText = remainingText.replace(calendarMatch[0], '').trim();
  }

  // 2. Extract duration (e.g., "for 2 hours", "1h", "30 min")
  const durationPatterns = [
    /for\s+(\d+)\s*(?:hours?|hrs?|h)/i,
    /for\s+(\d+)\s*(?:minutes?|mins?|m)/i,
    /(\d+)\s*(?:hours?|hrs?|h)/i,
    /(\d+)\s*(?:minutes?|mins?|m)/i,
  ];

  for (const pattern of durationPatterns) {
    const match = remainingText.match(pattern);
    if (match) {
      const value = parseInt(match[1]);
      result.duration = pattern.source.includes('hour') || pattern.source.includes('h') 
        ? value * 60 
        : value;
      remainingText = remainingText.replace(match[0], '').trim();
      break;
    }
  }

  // 3. Extract time (e.g., "2pm", "14:00", "2:30 PM")
  const timePatterns = [
    /\b(\d{1,2}):(\d{2})\s*(am|pm)\b/i,
    /\b(\d{1,2})\s*(am|pm)\b/i,
    /\b(\d{1,2}):(\d{2})\b/,
    /\bnoon\b/i,
    /\bmidnight\b/i,
  ];

  let timeFound = false;
  for (const pattern of timePatterns) {
    const match = remainingText.match(pattern);
    if (match) {
      const time = parseTime(match[0]);
      if (time) {
        result.startTime = time;
        // Calculate end time based on duration
        const [hours, minutes] = time.split(':').map(Number);
        const startMinutes = hours * 60 + minutes;
        const endMinutes = startMinutes + (result.duration || 60);
        const endHours = Math.floor(endMinutes / 60) % 24;
        const endMins = endMinutes % 60;
        result.endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
        timeFound = true;
        remainingText = remainingText.replace(match[0], '').trim();
        break;
      }
    }
  }

  // 4. Extract date (e.g., "tomorrow", "next Tuesday", "Friday", "March 20")
  const dateResult = parseDate(remainingText);
  if (dateResult.date) {
    result.startDate = dateResult.date.toISOString().split('T')[0];
    result.endDate = result.startDate;
    remainingText = remainingText.replace(dateResult.matchedText, '').trim();
  }

  // 5. Clean up title (remove extra "at", "on", etc.)
  result.title = remainingText
    .replace(/\b(at|on|in|for)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // If no title extracted, use original text
  if (!result.title) {
    result.title = text;
  }

  return result;
}

function parseTime(timeStr: string): string | null {
  const lowerTime = timeStr.toLowerCase();

  // Handle special cases
  if (lowerTime === 'noon') return '12:00';
  if (lowerTime === 'midnight') return '00:00';

  // Handle HH:MM AM/PM
  const withMinutesMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
  if (withMinutesMatch) {
    let hours = parseInt(withMinutesMatch[1]);
    const minutes = withMinutesMatch[2];
    const period = withMinutesMatch[3]?.toLowerCase();

    if (period === 'pm' && hours !== 12) hours += 12;
    if (period === 'am' && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }

  // Handle H AM/PM
  const withoutMinutesMatch = timeStr.match(/(\d{1,2})\s*(am|pm)/i);
  if (withoutMinutesMatch) {
    let hours = parseInt(withoutMinutesMatch[1]);
    const period = withoutMinutesMatch[2].toLowerCase();

    if (period === 'pm' && hours !== 12) hours += 12;
    if (period === 'am' && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, '0')}:00`;
  }

  return null;
}

function parseDate(text: string): { date: Date | null; matchedText: string } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Relative dates
  const relativePatterns = [
    { pattern: /\btoday\b/i, days: 0 },
    { pattern: /\btomorrow\b/i, days: 1 },
    { pattern: /\bin\s+(\d+)\s+days?\b/i, extract: true },
  ];

  for (const { pattern, days, extract } of relativePatterns) {
    const match = text.match(pattern);
    if (match) {
      const offset = extract ? parseInt(match[1]) : days;
      const date = new Date(today);
      date.setDate(date.getDate() + offset!);
      return { date, matchedText: match[0] };
    }
  }

  // Next [day of week]
  const nextDayMatch = text.match(/\bnext\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i);
  if (nextDayMatch) {
    const targetDay = nextDayMatch[1].toLowerCase();
    const date = getNextDayOfWeek(today, targetDay);
    date.setDate(date.getDate() + 7); // Next week
    return { date, matchedText: nextDayMatch[0] };
  }

  // Day of week (this week or next)
  const dayMatch = text.match(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i);
  if (dayMatch) {
    const targetDay = dayMatch[1].toLowerCase();
    const date = getNextDayOfWeek(today, targetDay);
    return { date, matchedText: dayMatch[0] };
  }

  return { date: null, matchedText: '' };
}

function getNextDayOfWeek(fromDate: Date, dayName: string): Date {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const targetDay = days.indexOf(dayName.toLowerCase());
  const currentDay = fromDate.getDay();
  
  let daysToAdd = targetDay - currentDay;
  if (daysToAdd <= 0) {
    daysToAdd += 7;
  }
  
  const result = new Date(fromDate);
  result.setDate(result.getDate() + daysToAdd);
  return result;
}

export function formatParsedEvent(parsed: ParsedEvent): string {
  const startDate = new Date(parsed.startDate);
  const isToday = startDate.toDateString() === new Date().toDateString();
  const isTomorrow = startDate.toDateString() === new Date(Date.now() + 86400000).toDateString();
  
  let dateStr = startDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  if (isToday) dateStr = 'Today';
  if (isTomorrow) dateStr = 'Tomorrow';
  
  const timeStr = formatTime(parsed.startTime) + ' - ' + formatTime(parsed.endTime);
  
  return `📅 ${dateStr} • 🕐 ${timeStr}`;
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}
