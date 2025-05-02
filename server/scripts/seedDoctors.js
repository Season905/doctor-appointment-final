const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const doctors = [
    {
        name: 'Dr. John Smith',
        specialization: 'Cardiologist',
        qualification: 'MD, DM Cardiology',
        experience: '15 years',
        consultationFee: 150,
        rating: 4.8,
        totalReviews: 124,
        image: 'https://example.com/doctor1.jpg',
        availability: {
            monday: ['09:00-12:00', '14:00-17:00'],
            tuesday: ['09:00-12:00', '14:00-17:00'],
            wednesday: ['09:00-12:00', '14:00-17:00'],
            thursday: ['09:00-12:00', '14:00-17:00'],
            friday: ['09:00-12:00', '14:00-17:00']
        },
        about: 'Dr. John Smith is a highly experienced cardiologist specializing in cardiovascular diseases and preventive cardiology.',
        hospital: 'City Heart Hospital',
        location: 'New York, NY',
        education: 'MBBS, MD (Cardiology), DM (Cardiology)',
        certifications: [
            'American Board of Internal Medicine',
            'Certification in Advanced Cardiac Life Support',
            'Fellow of American College of Cardiology'
        ],
        availableSlots: [
            '2024-03-25T09:00:00',
            '2024-03-25T10:00:00',
            '2024-03-25T11:00:00',
            '2024-03-26T14:00:00',
            '2024-03-26T15:00:00'
        ]
    },
    {
        name: 'Dr. Sarah Wilson',
        specialization: 'Pediatrician',
        qualification: 'MD Pediatrics',
        experience: '10 years',
        consultationFee: 100,
        rating: 4.9,
        totalReviews: 98,
        image: 'https://example.com/doctor2.jpg',
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
        name: 'Dr. Michael Chen',
        specialization: 'Dermatologist',
        qualification: 'MD Dermatology',
        experience: '12 years',
        consultationFee: 130,
        rating: 4.7,
        totalReviews: 156,
        image: 'https://example.com/doctor3.jpg',
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
    }
];

const seedDoctors = async () => {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB successfully');

        // Clear existing doctors
        await Doctor.deleteMany({});
        console.log('Cleared existing doctors');

        // Insert new doctors
        const createdDoctors = await Doctor.insertMany(doctors);
        console.log('Successfully seeded', createdDoctors.length, 'doctors');

        // Log the IDs of created doctors for reference
        console.log('Created doctors with IDs:');
        createdDoctors.forEach(doctor => {
            console.log(`- ${doctor.name}: ${doctor._id}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error seeding doctors:', error);
        process.exit(1);
    }
};

// Run the seeding function
seedDoctors(); 