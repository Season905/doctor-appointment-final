// components/AppointmentForm.js
import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import api from '../api';

const AppointmentForm = ({ doctorId, onSuccess }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async () => {
    try {
      const { data } = await api.get(`/appointments/slots/${doctorId}?date=${selectedDate.toISOString()}`);
      setAvailableSlots(data);
    } catch (err) {
      setError('Failed to fetch available slots');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/appointments', {
        doctorId,
        date: selectedDate,
        slot: selectedSlot,
        notes
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  // Filter out weekends
  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  return (
    <Card className="p-4">
      <h3 className="mb-4">Book Appointment</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Select Date</Form.Label>
          <DatePicker
            selected={selectedDate}
            onChange={setSelectedDate}
            minDate={new Date()}
            filterDate={isWeekday}
            dateFormat="MMMM d, yyyy"
            className="form-control"
            placeholderText="Select a date"
            required
          />
        </Form.Group>

        {selectedDate && availableSlots.length > 0 && (
          <Form.Group className="mb-3">
            <Form.Label>Available Time Slots</Form.Label>
            <div className="d-flex flex-wrap gap-2">
              {availableSlots.map((slot) => (
                <Button
                  key={slot}
                  variant={selectedSlot === slot ? 'primary' : 'outline-primary'}
                  onClick={() => setSelectedSlot(slot)}
                  className="me-2 mb-2"
                >
                  {slot}
                </Button>
              ))}
            </div>
          </Form.Group>
        )}

        <Form.Group className="mb-3">
          <Form.Label>Notes (Optional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes for the doctor"
          />
        </Form.Group>

        <Button
          type="submit"
          variant="primary"
          disabled={loading || !selectedDate || !selectedSlot}
        >
          {loading ? 'Booking...' : 'Book Appointment'}
        </Button>
      </Form>
    </Card>
  );
};

export default AppointmentForm;