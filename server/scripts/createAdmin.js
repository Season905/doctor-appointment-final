const mongoose = require('mongoose');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const createAdminUser = async () => {
    try {
        console.log('MongoDB URI:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const adminData = {
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin',
            phone: '1234567890',
            address: 'Admin Address'
        };

        const adminExists = await User.findOne({ email: adminData.email });
        if (adminExists) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        const admin = await User.create(adminData);
        console.log('Admin user created successfully:', admin);
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
};

createAdminUser(); 