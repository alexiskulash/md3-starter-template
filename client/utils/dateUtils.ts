export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function isSameMonth(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
}

export function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function getMonthEnd(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function getMonthName(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long" });
}

export function getMonthYear(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function getDaysInMonth(date: Date): number {
  return getMonthEnd(date).getDate();
}

export function getFirstDayOfMonth(date: Date): number {
  return getMonthStart(date).getDay(); // 0 = Sunday
}

export function getCalendarWeeks(date: Date): Date[][] {
  const monthStart = getMonthStart(date);
  const monthEnd = getMonthEnd(date);
  const firstDay = getFirstDayOfMonth(date);
  const daysInMonth = getDaysInMonth(date);

  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  // Fill in previous month's days
  const prevMonthEnd = new Date(date.getFullYear(), date.getMonth(), 0);
  const prevMonthDays = prevMonthEnd.getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    currentWeek.push(
      new Date(date.getFullYear(), date.getMonth() - 1, prevMonthDays - i)
    );
  }

  // Fill in current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(new Date(date.getFullYear(), date.getMonth(), day));
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Fill in next month's days
  if (currentWeek.length > 0) {
    let nextDay = 1;
    while (currentWeek.length < 7) {
      currentWeek.push(
        new Date(date.getFullYear(), date.getMonth() + 1, nextDay++)
      );
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

export function formatTime(time: string): string {
  // Convert "14:00" to "2:00 PM"
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export function getCurrentTime(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
}

export function getDefaultEventTime(): { start: string; end: string } {
  const now = new Date();
  const startHour = now.getHours();
  const start = `${startHour.toString().padStart(2, "0")}:00`;
  const endHour = (startHour + 1) % 24;
  const end = `${endHour.toString().padStart(2, "0")}:00`;
  return { start, end };
}
