/**
 * Dummy Doctors Data Module
 * 
 * This module provides a mock database for doctors with the following features:
 * - Initial doctor data
 * - CRUD operations for doctors
 * - Filtering capabilities
 * - Specialization-based search
 */

// Initial dummy doctors data
let doctors = [
    {
        _id: 'doc1',
        name: 'Dr. John Smith',
        specialization: 'Cardiologist',
        qualification: 'MD, FACC',
        experience: '15 years',
        consultationFee: 150,
        rating: 4.8,
        totalReviews: 120,
        image: 'https://example.com/doctor1.jpg',
        availability: 'Mon-Fri, 9AM-5PM',
        about: 'Dr. John Smith is a board-certified cardiologist with extensive experience...',
        hospital: 'City General Hospital',
        location: '123 Medical Center Drive, City, State',
        education: 'MD from Harvard Medical School',
        certifications: ['Board Certified Cardiologist', 'Fellow of American College of Cardiology'],
        availableSlots: [
            '2024-03-25T09:00:00',
            '2024-03-25T10:00:00',
            '2024-03-25T11:00:00'
        ]
    },
    {
        _id: 'doc2',
        name: 'Dr. Sarah Wilson',
        specialization: 'Pediatrician',
        qualification: 'MD Pediatrics',
        experience: '10 years',
        consultationFee: 100,
        rating: 4.9,
        totalReviews: 98,
        image: 'https://placehold.co/600x400/ff6b6b/ffffff?text=Dr.+Sarah+Wilson',
        availability: {
            monday: ['10:00-13:00', '15:00-18:00'],
            tuesday: ['10:00-13:00', '15:00-18:00'],
            wednesday: ['10:00-13:00', '15:00-18:00'],
            thursday: ['10:00-13:00', '15:00-18:00'],
            friday: ['10:00-13:00']
        },
        about: 'Dr. Sarah Wilson is a dedicated pediatrician with expertise in child development and preventive care.',
        hospital: 'Children\'s Medical Center',
        location: 'Boston, MA',
        education: 'MBBS, MD (Pediatrics)',
        certifications: [
            'American Board of Pediatrics',
            'Pediatric Advanced Life Support',
            'Neonatal Resuscitation Program'
        ],
        availableSlots: [
            '2024-03-25T10:00:00',
            '2024-03-25T11:00:00',
            '2024-03-25T15:00:00',
            '2024-03-26T16:00:00',
            '2024-03-26T17:00:00'
        ]
    },
    {
        _id: 'doc3',
        name: 'Dr. Michael Chen',
        specialization: 'Dermatologist',
        qualification: 'MD Dermatology',
        experience: '12 years',
        consultationFee: 130,
        rating: 4.7,
        totalReviews: 156,
        image: 'https://placehold.co/600x400/2ecc71/ffffff?text=Dr.+Michael+Chen',
        availability: {
            monday: ['09:30-13:30', '14:30-17:30'],
            tuesday: ['09:30-13:30', '14:30-17:30'],
            wednesday: ['09:30-13:30'],
            thursday: ['09:30-13:30', '14:30-17:30'],
            friday: ['09:30-13:30', '14:30-17:30']
        },
        about: 'Dr. Michael Chen is a board-certified dermatologist specializing in both medical and cosmetic dermatology.',
        hospital: 'Skin & Beauty Clinic',
        location: 'San Francisco, CA',
        education: 'MBBS, MD (Dermatology)',
        certifications: [
            'American Board of Dermatology',
            'American Academy of Dermatology Fellow',
            'Cosmetic Dermatology Certification'
        ],
        availableSlots: [
            '2024-03-25T09:30:00',
            '2024-03-25T10:30:00',
            '2024-03-25T14:30:00',
            '2024-03-26T15:30:00',
            '2024-03-26T16:30:00'
        ]
    },
    {
        _id: 'doc4',
        name: 'Dr. Emily Rodriguez',
        specialization: 'Neurologist',
        qualification: 'MD Neurology',
        experience: '14 years',
        consultationFee: 180,
        rating: 4.9,
        totalReviews: 112,
        image: 'https://placehold.co/600x400/9b59b6/ffffff?text=Dr.+Emily+Rodriguez',
        availability: {
            monday: ['08:00-12:00', '13:00-16:00'],
            tuesday: ['08:00-12:00', '13:00-16:00'],
            wednesday: ['08:00-12:00'],
            thursday: ['08:00-12:00', '13:00-16:00'],
            friday: ['08:00-12:00']
        },
        about: 'Dr. Emily Rodriguez specializes in neurological disorders and has extensive experience in treating migraines, epilepsy, and movement disorders.',
        hospital: 'NeuroCare Institute',
        location: 'Chicago, IL',
        education: 'MBBS, MD (Neurology), Fellowship in Movement Disorders',
        certifications: [
            'American Board of Psychiatry and Neurology',
            'Fellow of American Academy of Neurology',
            'Certified in Clinical Neurophysiology'
        ],
        availableSlots: [
            '2024-03-25T08:00:00',
            '2024-03-25T09:00:00',
            '2024-03-25T13:00:00',
            '2024-03-26T14:00:00',
            '2024-03-26T15:00:00'
        ]
    },
    {
        _id: 'doc5',
        name: 'Dr. James Anderson',
        specialization: 'Orthopedic Surgeon',
        qualification: 'MD Orthopedics',
        experience: '18 years',
        consultationFee: 200,
        rating: 4.8,
        totalReviews: 145,
        image: 'https://placehold.co/600x400/e67e22/ffffff?text=Dr.+James+Anderson',
        availability: {
            monday: ['07:00-11:00', '12:00-15:00'],
            tuesday: ['07:00-11:00'],
            wednesday: ['07:00-11:00', '12:00-15:00'],
            thursday: ['07:00-11:00'],
            friday: ['07:00-11:00', '12:00-15:00']
        },
        about: 'Dr. James Anderson is a renowned orthopedic surgeon specializing in joint replacements and sports medicine.',
        hospital: 'Advanced Orthopedic Center',
        location: 'Houston, TX',
        education: 'MBBS, MS (Orthopedics), Fellowship in Joint Replacement',
        certifications: [
            'American Board of Orthopedic Surgery',
            'Fellow of American Academy of Orthopedic Surgeons',
            'Sports Medicine Certification'
        ],
        availableSlots: [
            '2024-03-25T07:00:00',
            '2024-03-25T08:00:00',
            '2024-03-25T12:00:00',
            '2024-03-26T13:00:00',
            '2024-03-26T14:00:00'
        ]
    },
    {
        _id: 'doc6',
        name: 'Dr. Lisa Thompson',
        specialization: 'Psychiatrist',
        qualification: 'MD Psychiatry',
        experience: '12 years',
        consultationFee: 160,
        rating: 4.9,
        totalReviews: 98,
        image: 'https://placehold.co/600x400/1abc9c/ffffff?text=Dr.+Lisa+Thompson',
        availability: {
            monday: ['10:00-14:00', '15:00-18:00'],
            tuesday: ['10:00-14:00', '15:00-18:00'],
            wednesday: ['10:00-14:00'],
            thursday: ['10:00-14:00', '15:00-18:00'],
            friday: ['10:00-14:00']
        },
        about: 'Dr. Lisa Thompson specializes in adult psychiatry with a focus on anxiety, depression, and mood disorders.',
        hospital: 'Mental Wellness Center',
        location: 'Seattle, WA',
        education: 'MBBS, MD (Psychiatry), Fellowship in Mood Disorders',
        certifications: [
            'American Board of Psychiatry and Neurology',
            'Certified in Psychopharmacology',
            'Cognitive Behavioral Therapy Certification'
        ],
        availableSlots: [
            '2024-03-25T10:00:00',
            '2024-03-25T11:00:00',
            '2024-03-25T15:00:00',
            '2024-03-26T16:00:00',
            '2024-03-26T17:00:00'
        ]
    },
    {
        _id: 'doc7',
        name: 'Dr. Robert Kim',
        specialization: 'Ophthalmologist',
        qualification: 'MD Ophthalmology',
        experience: '16 years',
        consultationFee: 170,
        rating: 4.8,
        totalReviews: 132,
        image: 'https://placehold.co/600x400/3498db/ffffff?text=Dr.+Robert+Kim',
        availability: {
            monday: ['08:30-12:30', '13:30-17:30'],
            tuesday: ['08:30-12:30'],
            wednesday: ['08:30-12:30', '13:30-17:30'],
            thursday: ['08:30-12:30'],
            friday: ['08:30-12:30', '13:30-17:30']
        },
        about: 'Dr. Robert Kim is an experienced ophthalmologist specializing in cataract surgery and refractive procedures.',
        hospital: 'Vision Care Center',
        location: 'Los Angeles, CA',
        education: 'MBBS, MD (Ophthalmology), Fellowship in Cataract Surgery',
        certifications: [
            'American Board of Ophthalmology',
            'Fellow of American Academy of Ophthalmology',
            'Certified in Refractive Surgery'
        ],
        availableSlots: [
            '2024-03-25T08:30:00',
            '2024-03-25T09:30:00',
            '2024-03-25T13:30:00',
            '2024-03-26T14:30:00',
            '2024-03-26T15:30:00'
        ]
    }
];

/**
 * Get all doctors
 * @returns {Array} Copy of all doctors
 */
export const getAllDoctors = () => {
    return [...doctors];
};

/**
 * Get doctor by ID
 * @param {string} id - Doctor ID
 * @returns {Object|null} Doctor object or null if not found
 */
export const getDoctorById = (id) => {
    return doctors.find(doctor => doctor._id === id);
};

/**
 * Get doctors by specialization
 * @param {string} specialization - Doctor's specialization
 * @returns {Array} Filtered doctors by specialization
 */
export const getDoctorsBySpecialization = (specialization) => {
    return doctors.filter(doctor =>
        doctor.specialization.toLowerCase() === specialization.toLowerCase()
    );
};

/**
 * Add a new doctor
 * @param {Object} doctorData - Doctor details
 * @returns {Object} New doctor object with generated ID
 */
export const addDoctor = (doctorData) => {
    const newDoctor = {
        _id: `doc${doctors.length + 1}`,
        ...doctorData
    };
    doctors.push(newDoctor);
    return newDoctor;
};

/**
 * Update an existing doctor
 * @param {string} id - Doctor ID
 * @param {Object} doctorData - Updated doctor details
 * @returns {Object|null} Updated doctor or null if not found
 */
export const updateDoctor = (id, doctorData) => {
    const doctorIndex = doctors.findIndex(doc => doc._id === id);
    if (doctorIndex !== -1) {
        doctors[doctorIndex] = { ...doctors[doctorIndex], ...doctorData };
        return doctors[doctorIndex];
    }
    return null;
};

/**
 * Delete a doctor
 * @param {string} id - Doctor ID
 * @returns {boolean} True if deleted, false if not found
 */
export const deleteDoctor = (id) => {
    const index = doctors.findIndex(doc => doc._id === id);
    if (index !== -1) {
        doctors.splice(index, 1);
        return true;
    }
    return false;
};

export default doctors; 