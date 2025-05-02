// components/AvailabilityPicker.js
const AvailabilityPicker = ({ doctorId }) => {
    const [selectedSlots, setSelectedSlots] = useState([]);
  
    const handleSave = async () => {
      await api.post(`/doctors/${doctorId}/availability`, selectedSlots);
    };
  
    return (
      <Calendar
        selectable
        onSelectSlot={slot => setSelectedSlots([...selectedSlots, slot])}
      />
    );
  };