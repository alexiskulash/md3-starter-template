export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatTime(hours: number, minutes: number = 0): string {
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function getCurrentTime(): string {
  const now = new Date();
  return formatTime(now.getHours(), now.getMinutes());
}

export function getMonthName(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long" });
}

export function getYear(date: Date): number {
  return date.getFullYear();
}

export function getMonthYear(date: Date): string {
  return `${getMonthName(date)} ${getYear(date)}`;
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function addMonths(date: Date, months: number): Date {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
}

export function addYears(date: Date, years: number): Date {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + years);
  return newDate;
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function getDaysInMonth(date: Date): number {
  return endOfMonth(date).getDate();
}

export function getFirstDayOfMonth(date: Date): number {
  return startOfMonth(date).getDay();
}

export function getCalendarDays(date: Date): Date[] {
  const firstDay = startOfMonth(date);
  const firstDayOfWeek = getFirstDayOfMonth(date);
  const daysInMonth = getDaysInMonth(date);
  
  const days: Date[] = [];
  
  // Previous month days
  const prevMonthEnd = new Date(date.getFullYear(), date.getMonth(), 0);
  const prevMonthDays = prevMonthEnd.getDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push(new Date(date.getFullYear(), date.getMonth() - 1, prevMonthDays - i));
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(date.getFullYear(), date.getMonth(), i));
  }
  
  // Next month days to fill the grid
  const remainingDays = 42 - days.length; // 6 weeks * 7 days
  for (let i = 1; i <= remainingDays; i++) {
    days.push(new Date(date.getFullYear(), date.getMonth() + 1, i));
  }
  
  return days;
}

export function getMonthsInYear(year: number): Date[] {
  const months: Date[] = [];
  for (let i = 0; i < 12; i++) {
    months.push(new Date(year, i, 1));
  }
  return months;
}
