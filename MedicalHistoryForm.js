// components/MedicalHistoryForm.js
const MedicalHistoryForm = ({ patientId }) => {
    const [formData, setFormData] = useState({
      allergies: [],
      conditions: [],
      // ...
    });
  
    const handleSubmit = async () => {
      await api.post(`/patients/${patientId}/medical-history`, formData);
    };
  
    // Form fields implementation
  };