import React, { useState, useEffect } from 'react';
import api from '../api'; // Add this import

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/appointments');
        setAppointments(response.data);
      } catch (err) {
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div>
      <h1>Appointments</h1>
      {loading ? (
        <p>Loading appointments...</p>
      ) : (
        <ul>
          {appointments.map(appointment => (
            <li key={appointment._id}>
              {new Date(appointment.date).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Appointments; // Add this default export