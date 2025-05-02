// components/Calendar.js
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const DoctorCalendar = ({ appointments }) => {
  const events = appointments.map(appt => ({
    title: `Appt with ${appt.patient.name}`,
    start: new Date(appt.date),
    end: new Date(moment(appt.date).add(30, 'minutes')),
  }));

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
    />
  );
};