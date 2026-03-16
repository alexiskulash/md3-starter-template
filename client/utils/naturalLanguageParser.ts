import * as chrono from 'chrono-node';
import { formatDateISO } from './calendar';

export interface ParsedEventData {
  title: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  duration?: number; // in minutes
  calendarKeyword?: string; // e.g., 'work', 'personal'
}

/**
 * Parse natural language input into event data
 * Examples:
 * - "Team meeting tomorrow at 2pm"
 * - "Lunch with Sarah next Tuesday 12:30"
 * - "Dentist appointment Friday 3pm for 1 hour"
 * - "Coffee on work calendar tomorrow at 10am"
 */
export function parseNaturalLanguage(input: string): ParsedEventData {
  const result: ParsedEventData = {
    title: input.trim()
  };

  if (!input.trim()) {
    return result;
  }

  // Parse dates and times using chrono
  const parsed = chrono.parse(input, new Date(), { forwardDate: true });

  if (parsed.length > 0) {
    const firstParsing = parsed[0];
    const startDate = firstParsing.start.date();

    // Extract start date and time
    result.startDate = formatDateISO(startDate);
    result.startTime = formatTime(startDate);

    // Extract end date/time if available
    if (firstParsing.end) {
      const endDate = firstParsing.end.date();
      result.endDate = formatDateISO(endDate);
      result.endTime = formatTime(endDate);
    } else {
      // Default to 1 hour duration if no end time specified
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 1);
      result.endDate = formatDateISO(endDate);
      result.endTime = formatTime(endDate);
    }

    // Extract title by removing the parsed date/time text
    const parsedText = firstParsing.text;
    let cleanTitle = input
      .replace(parsedText, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Remove common duration phrases
    cleanTitle = cleanTitle
      .replace(/for\s+\d+\s+(hour|hours|minute|minutes|min|mins|hr|hrs)/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (cleanTitle) {
      result.title = cleanTitle;
    }
  }

  // Extract calendar keywords
  const calendarKeywords = ['work', 'personal', 'family'];
  const lowerInput = input.toLowerCase();
  
  for (const keyword of calendarKeywords) {
    if (lowerInput.includes(keyword) || lowerInput.includes(`${keyword} calendar`)) {
      result.calendarKeyword = keyword;
      // Remove calendar keyword from title
      result.title = result.title
        .replace(new RegExp(`\\b${keyword}\\s+calendar\\b`, 'gi'), '')
        .replace(new RegExp(`\\bon\\s+${keyword}\\s+calendar\\b`, 'gi'), '')
        .replace(/\s+/g, ' ')
        .trim();
      break;
    }
  }

  return result;
}

/**
 * Format a Date object to HH:mm string
 */
function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Get example suggestions for the user
 */
export function getParserExamples(): string[] {
  return [
    'Team meeting tomorrow at 2pm',
    'Lunch next Tuesday at 12:30',
    'Dentist Friday 3pm for 1 hour',
    'Coffee on work calendar tomorrow at 10am'
  ];
}

/**
 * Check if the input has been successfully parsed
 */
export function isParsed(parsed: ParsedEventData): boolean {
  return !!(parsed.startDate && parsed.startTime);
}
