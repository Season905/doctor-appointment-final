// components/AvailabilityCalendar.js
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const AvailabilityCalendar = ({ onSelectSlot }) => {
  return (
    <Calendar
      localizer={localizer}
      selectable
      onSelectSlot={onSelectSlot}
      defaultView="week"
      min={new Date(0, 0, 0, 9, 0, 0)} // 9 AM
      max={new Date(0, 0, 0, 17, 0, 0)} // 5 PM
      style={{ height: 500 }}
    />
  );
};