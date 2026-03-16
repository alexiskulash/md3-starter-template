/**
 * Natural Language Event Parser
 * Parses user input like "Team meeting tomorrow at 2pm for 1 hour"
 * into structured event data
 */

export interface ParsedEventData {
  title?: string;
  date?: Date;
  startTime?: string; // HH:MM format
  endTime?: string; // HH:MM format
  duration?: number; // in hours
  calendarName?: string;
  confidence: number; // 0-1 score of how confident we are in the parse
  suggestions?: string[]; // Helpful suggestions for the user
}

/**
 * Parse natural language input and extract event details
 */
export function parseNaturalLanguage(input: string): ParsedEventData {
  const result: ParsedEventData = {
    confidence: 0,
    suggestions: [],
  };

  if (!input || input.trim().length === 0) {
    return result;
  }

  const lowerInput = input.toLowerCase();
  let remainingText = input;

  // Parse date
  const dateResult = parseDate(lowerInput);
  if (dateResult.date) {
    result.date = dateResult.date;
    result.confidence += 0.3;
    remainingText = remainingText.replace(dateResult.matched, "");
  }

  // Parse time
  const timeResult = parseTime(lowerInput);
  if (timeResult.startTime) {
    result.startTime = timeResult.startTime;
    result.confidence += 0.3;
    remainingText = remainingText.replace(timeResult.matched, "");
  }

  // Parse duration
  const durationResult = parseDuration(lowerInput);
  if (durationResult.duration) {
    result.duration = durationResult.duration;
    result.confidence += 0.2;
    remainingText = remainingText.replace(durationResult.matched, "");

    // Calculate end time if we have start time and duration
    if (result.startTime) {
      result.endTime = calculateEndTime(result.startTime, durationResult.duration);
    }
  }

  // Parse calendar name
  const calendarResult = parseCalendar(lowerInput);
  if (calendarResult.calendarName) {
    result.calendarName = calendarResult.calendarName;
    result.confidence += 0.1;
    remainingText = remainingText.replace(calendarResult.matched, "");
  }

  // The remaining text is likely the title
  const cleanedTitle = remainingText
    .replace(/\s+/g, " ")
    .replace(/^\s*(for|at|in|on|tomorrow|today|next)\s*/gi, "")
    .trim();

  if (cleanedTitle.length > 0) {
    result.title = cleanedTitle;
    result.confidence += 0.1;
  }

  // Generate helpful suggestions
  if (!result.date) {
    result.suggestions?.push("Try adding 'today', 'tomorrow', or a specific date");
  }
  if (!result.startTime) {
    result.suggestions?.push("Try adding a time like 'at 2pm' or '14:00'");
  }
  if (!result.title || result.title.length < 3) {
    result.suggestions?.push("Add a descriptive event title");
  }

  return result;
}

/**
 * Parse date from natural language
 */
function parseDate(input: string): { date?: Date; matched: string } {
  const now = new Date();
  
  // Today
  if (/\btoday\b/i.test(input)) {
    return { 
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate()), 
      matched: input.match(/\btoday\b/i)?.[0] || ""
    };
  }

  // Tomorrow
  if (/\btomorrow\b/i.test(input)) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return { 
      date: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate()), 
      matched: input.match(/\btomorrow\b/i)?.[0] || ""
    };
  }

  // Next [day of week]
  const nextDayMatch = input.match(/\bnext\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i);
  if (nextDayMatch) {
    const targetDay = nextDayMatch[1].toLowerCase();
    const date = getNextDayOfWeek(targetDay);
    return { date, matched: nextDayMatch[0] };
  }

  // [Day of week] (e.g., "Monday", "Friday")
  const dayMatch = input.match(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i);
  if (dayMatch) {
    const targetDay = dayMatch[1].toLowerCase();
    const date = getNextDayOfWeek(targetDay);
    return { date, matched: dayMatch[0] };
  }

  // Specific dates: "March 20", "Dec 25", "3/20", "12/25"
  const monthDayMatch = input.match(/\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2})\b/i);
  if (monthDayMatch) {
    const monthStr = monthDayMatch[1];
    const day = parseInt(monthDayMatch[2]);
    const date = parseMonthDay(monthStr, day);
    return { date, matched: monthDayMatch[0] };
  }

  const slashDateMatch = input.match(/\b(\d{1,2})\/(\d{1,2})\b/);
  if (slashDateMatch) {
    const month = parseInt(slashDateMatch[1]) - 1; // 0-indexed
    const day = parseInt(slashDateMatch[2]);
    const year = now.getFullYear();
    const date = new Date(year, month, day);
    return { date, matched: slashDateMatch[0] };
  }

  return { matched: "" };
}

/**
 * Parse time from natural language
 */
function parseTime(input: string): { startTime?: string; matched: string } {
  // "at 2pm", "at 14:00", "at 2:30pm"
  const atTimeMatch = input.match(/\bat\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i);
  if (atTimeMatch) {
    const hour = parseInt(atTimeMatch[1]);
    const minute = atTimeMatch[2] ? parseInt(atTimeMatch[2]) : 0;
    const period = atTimeMatch[3]?.toLowerCase();

    const time24 = convertTo24Hour(hour, minute, period);
    return { 
      startTime: `${time24.hour.toString().padStart(2, "0")}:${time24.minute.toString().padStart(2, "0")}`,
      matched: atTimeMatch[0]
    };
  }

  // Just "2pm", "14:00", "2:30pm"
  const timeMatch = input.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i);
  if (timeMatch) {
    const hour = parseInt(timeMatch[1]);
    const minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    const period = timeMatch[3]?.toLowerCase();

    const time24 = convertTo24Hour(hour, minute, period);
    return { 
      startTime: `${time24.hour.toString().padStart(2, "0")}:${time24.minute.toString().padStart(2, "0")}`,
      matched: timeMatch[0]
    };
  }

  // Military time "14:00", "09:30"
  const militaryMatch = input.match(/\b([0-2]?\d):([0-5]\d)\b/);
  if (militaryMatch) {
    const hour = parseInt(militaryMatch[1]);
    const minute = parseInt(militaryMatch[2]);
    if (hour <= 23 && minute <= 59) {
      return { 
        startTime: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
        matched: militaryMatch[0]
      };
    }
  }

  return { matched: "" };
}

/**
 * Parse duration from natural language
 */
function parseDuration(input: string): { duration?: number; matched: string } {
  // "for 1 hour", "for 2 hours", "for 30 minutes", "for 1.5 hours"
  const durationMatch = input.match(/\bfor\s+(\d+(?:\.\d+)?)\s*(hour|hours|hr|hrs|h|minute|minutes|min|mins|m)\b/i);
  if (durationMatch) {
    const value = parseFloat(durationMatch[1]);
    const unit = durationMatch[2].toLowerCase();

    let hours = 0;
    if (unit.startsWith("h")) {
      hours = value;
    } else if (unit.startsWith("m")) {
      hours = value / 60;
    }

    return { duration: hours, matched: durationMatch[0] };
  }

  // "until 3pm", "until 15:00"
  const untilMatch = input.match(/\buntil\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i);
  if (untilMatch) {
    // We'll need the start time to calculate duration, so just mark it as matched
    return { matched: untilMatch[0] };
  }

  return { matched: "" };
}

/**
 * Parse calendar name from natural language
 */
function parseCalendar(input: string): { calendarName?: string; matched: string } {
  // "in Personal calendar", "in Work", "on Family calendar"
  const calendarMatch = input.match(/\b(?:in|on)\s+(personal|work|family)\s*(?:calendar)?\b/i);
  if (calendarMatch) {
    return { 
      calendarName: calendarMatch[1].charAt(0).toUpperCase() + calendarMatch[1].slice(1).toLowerCase(),
      matched: calendarMatch[0]
    };
  }

  return { matched: "" };
}

/**
 * Helper: Convert 12-hour time to 24-hour format
 */
function convertTo24Hour(
  hour: number,
  minute: number,
  period?: string
): { hour: number; minute: number } {
  let hour24 = hour;

  if (period) {
    if (period === "pm" && hour !== 12) {
      hour24 = hour + 12;
    } else if (period === "am" && hour === 12) {
      hour24 = 0;
    }
  }

  return { hour: hour24, minute };
}

/**
 * Helper: Get next occurrence of a day of week
 */
function getNextDayOfWeek(dayName: string): Date {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const targetDay = days.indexOf(dayName.toLowerCase());
  
  const today = new Date();
  const currentDay = today.getDay();
  
  let daysToAdd = targetDay - currentDay;
  if (daysToAdd <= 0) {
    daysToAdd += 7;
  }

  const result = new Date(today);
  result.setDate(result.getDate() + daysToAdd);
  return new Date(result.getFullYear(), result.getMonth(), result.getDate());
}

/**
 * Helper: Parse month name and day into a date
 */
function parseMonthDay(monthStr: string, day: number): Date {
  const months: { [key: string]: number } = {
    january: 0, jan: 0,
    february: 1, feb: 1,
    march: 2, mar: 2,
    april: 3, apr: 3,
    may: 4,
    june: 5, jun: 5,
    july: 6, jul: 6,
    august: 7, aug: 7,
    september: 8, sep: 8,
    october: 9, oct: 9,
    november: 10, nov: 10,
    december: 11, dec: 11,
  };

  const month = months[monthStr.toLowerCase()];
  const now = new Date();
  let year = now.getFullYear();

  // If the month/day has passed this year, assume next year
  const testDate = new Date(year, month, day);
  if (testDate < now) {
    year += 1;
  }

  return new Date(year, month, day);
}

/**
 * Helper: Calculate end time given start time and duration
 */
function calculateEndTime(startTime: string, durationHours: number): string {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  
  const totalMinutes = startHour * 60 + startMinute + durationHours * 60;
  const endHour = Math.floor(totalMinutes / 60) % 24;
  const endMinute = totalMinutes % 60;

  return `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`;
}

/**
 * Format parsed data into a human-readable summary
 */
export function formatParsedSummary(parsed: ParsedEventData): string {
  const parts: string[] = [];

  if (parsed.title) {
    parts.push(parsed.title);
  }

  if (parsed.date) {
    const dateStr = parsed.date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    parts.push(`on ${dateStr}`);
  }

  if (parsed.startTime) {
    const [hour, minute] = parsed.startTime.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    parts.push(`at ${displayHour}:${minute.toString().padStart(2, "0")} ${period}`);
  }

  if (parsed.duration) {
    if (parsed.duration === 1) {
      parts.push("for 1 hour");
    } else if (parsed.duration < 1) {
      parts.push(`for ${Math.round(parsed.duration * 60)} minutes`);
    } else {
      parts.push(`for ${parsed.duration} hours`);
    }
  }

  if (parsed.calendarName) {
    parts.push(`in ${parsed.calendarName}`);
  }

  return parts.join(" ");
}
