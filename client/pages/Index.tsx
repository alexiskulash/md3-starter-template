import { CalendarProvider } from '../contexts/CalendarContext';
import { CalendarLayout } from '../components/CalendarLayout';

export default function Index() {
  return (
    <CalendarProvider>
      <CalendarLayout />
    </CalendarProvider>
  );
}
