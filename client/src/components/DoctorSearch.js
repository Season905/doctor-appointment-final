// components/DoctorSearch.js
const DoctorSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [doctors, setDoctors] = useState([]);
  
    const handleSearch = async () => {
      const res = await api.get(`/doctors/search?name=${searchTerm}`);
      setDoctors(res.data);
    };
  
    return (
      <div>
        <input onChange={e => setSearchTerm(e.target.value)} />
        <button onClick={handleSearch}>Search</button>
        {/* Display results */}
      </div>
    );
  };