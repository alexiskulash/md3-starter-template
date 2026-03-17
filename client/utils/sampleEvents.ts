import type { CalendarEvent } from "../pages/Calendar";

const EVENT_COLORS = [
  '#1976D2', // Blue
  '#D32F2F', // Red
  '#388E3C', // Green
  '#F57C00', // Orange
  '#7B1FA2', // Purple
  '#00897B', // Teal
];

export function generateSampleEvents(): CalendarEvent[] {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const events: CalendarEvent[] = [
    // Current week events
    {
      id: 'event-1',
      title: 'Team Standup',
      description: 'Daily team synchronization meeting to discuss progress and blockers',
      date: new Date(currentYear, currentMonth, today.getDate()),
      startTime: '09:00',
      endTime: '09:30',
      color: EVENT_COLORS[0],
    },
    {
      id: 'event-2',
      title: 'Project Review',
      description: 'Quarterly project review with stakeholders',
      date: new Date(currentYear, currentMonth, today.getDate()),
      startTime: '14:00',
      endTime: '15:30',
      color: EVENT_COLORS[4],
    },
    {
      id: 'event-3',
      title: 'Lunch with Client',
      description: 'Business lunch meeting at downtown restaurant',
      date: new Date(currentYear, currentMonth, today.getDate() + 1),
      startTime: '12:00',
      endTime: '13:30',
      color: EVENT_COLORS[3],
    },
    {
      id: 'event-4',
      title: 'Code Review Session',
      description: 'Review pull requests and discuss technical architecture',
      date: new Date(currentYear, currentMonth, today.getDate() + 2),
      startTime: '10:00',
      endTime: '11:00',
      color: EVENT_COLORS[0],
    },
    {
      id: 'event-5',
      title: 'Design Workshop',
      description: 'Collaborative design session for new feature proposals',
      date: new Date(currentYear, currentMonth, today.getDate() + 2),
      startTime: '15:00',
      endTime: '17:00',
      color: EVENT_COLORS[1],
    },
    
    // Next week events
    {
      id: 'event-6',
      title: 'Sprint Planning',
      description: 'Plan tasks and set goals for the upcoming sprint',
      date: new Date(currentYear, currentMonth, today.getDate() + 5),
      startTime: '09:00',
      endTime: '11:00',
      color: EVENT_COLORS[4],
    },
    {
      id: 'event-7',
      title: 'Client Presentation',
      description: 'Present project progress and demo new features',
      date: new Date(currentYear, currentMonth, today.getDate() + 7),
      startTime: '14:00',
      endTime: '15:00',
      color: EVENT_COLORS[3],
    },
    {
      id: 'event-8',
      title: 'Team Building Event',
      description: 'Quarterly team building activity and social gathering',
      date: new Date(currentYear, currentMonth, today.getDate() + 8),
      startTime: '16:00',
      endTime: '18:00',
      color: EVENT_COLORS[2],
    },
    {
      id: 'event-9',
      title: 'Performance Review',
      description: 'One-on-one performance discussion with manager',
      date: new Date(currentYear, currentMonth, today.getDate() + 9),
      startTime: '11:00',
      endTime: '12:00',
      color: EVENT_COLORS[1],
    },
    
    // Later this month
    {
      id: 'event-10',
      title: 'Training Session',
      description: 'Technical training on new development tools and frameworks',
      date: new Date(currentYear, currentMonth, today.getDate() + 12),
      startTime: '13:00',
      endTime: '16:00',
      color: EVENT_COLORS[5],
    },
    {
      id: 'event-11',
      title: 'Marketing Campaign Launch',
      description: 'Launch new marketing campaign and monitor initial performance',
      date: new Date(currentYear, currentMonth, today.getDate() + 14),
      startTime: '10:00',
      endTime: '11:30',
      color: EVENT_COLORS[3],
    },
    {
      id: 'event-12',
      title: 'Product Demo',
      description: 'Internal product demonstration for cross-functional teams',
      date: new Date(currentYear, currentMonth, today.getDate() + 15),
      startTime: '14:00',
      endTime: '15:00',
      color: EVENT_COLORS[0],
    },
    {
      id: 'event-13',
      title: 'Budget Review',
      description: 'Review quarterly budget and plan resource allocation',
      date: new Date(currentYear, currentMonth, today.getDate() + 16),
      startTime: '09:30',
      endTime: '11:00',
      color: EVENT_COLORS[1],
    },
    {
      id: 'event-14',
      title: 'Developer Meetup',
      description: 'Local developer community meetup and networking event',
      date: new Date(currentYear, currentMonth, today.getDate() + 18),
      startTime: '18:00',
      endTime: '20:00',
      color: EVENT_COLORS[5],
    },
    {
      id: 'event-15',
      title: 'Customer Feedback Session',
      description: 'Review customer feedback and prioritize feature requests',
      date: new Date(currentYear, currentMonth, today.getDate() + 20),
      startTime: '13:00',
      endTime: '14:30',
      color: EVENT_COLORS[2],
    },
    
    // Past events (for reference)
    {
      id: 'event-16',
      title: 'Product Launch',
      description: 'Major product launch event with full team participation',
      date: new Date(currentYear, currentMonth, today.getDate() - 3),
      startTime: '10:00',
      endTime: '12:00',
      color: EVENT_COLORS[4],
    },
    {
      id: 'event-17',
      title: 'Security Audit',
      description: 'Annual security audit and compliance review',
      date: new Date(currentYear, currentMonth, today.getDate() - 5),
      startTime: '09:00',
      endTime: '17:00',
      color: EVENT_COLORS[1],
    },
    {
      id: 'event-18',
      title: 'Company All-Hands',
      description: 'Quarterly company-wide meeting and announcements',
      date: new Date(currentYear, currentMonth, today.getDate() - 7),
      startTime: '15:00',
      endTime: '16:30',
      color: EVENT_COLORS[4],
    },
  ];

  // Filter out events that are outside the current month range (keep nearby months too)
  return events.filter(event => {
    const eventMonth = event.date.getMonth();
    const eventYear = event.date.getFullYear();
    
    // Keep events from previous month, current month, and next month
    return (
      (eventYear === currentYear - 1 && eventMonth === 11 && currentMonth === 0) ||
      (eventYear === currentYear && Math.abs(eventMonth - currentMonth) <= 1) ||
      (eventYear === currentYear + 1 && eventMonth === 0 && currentMonth === 11)
    );
  });
}
