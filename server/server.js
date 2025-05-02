const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Initialize Express
const app = express();

// Database Connection
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection URI:', process.env.MONGO_URI);

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully');
    console.log('Database Name:', conn.connection.name);
    console.log('Database Host:', conn.connection.host);
    console.log('Database Port:', conn.connection.port);

    // Log all collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available Collections:', collections.map(c => c.name));

  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    console.error('Error Details:', {
      message: err.message,
      code: err.code,
      name: err.name
    });
    process.exit(1);
  }
};

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Security headers
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  next();
});

// Connect to database and start server
const startServer = async () => {
  await connectDB();

  // API Routes
  app.use('/api/users', require('./routes/userRoutes'));
  app.use('/api/doctors', require('./routes/doctorRoutes'));
  app.use('/api/appointments', require('./routes/appointmentRoutes'));
  app.use('/api/stats', require('./routes/statsRoutes'));
  app.use('/api/admin', require('./routes/adminRoutes'));

  // Production setup
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
  }

  // Error Handling
  app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Endpoint not found' });
  });

  app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    console.error('Error Stack:', err.stack);
    console.error('Request Body:', req.body);
    console.error('Request Headers:', req.headers);

    res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === 'development' ? {
        message: err.message,
        stack: err.stack,
        name: err.name
      } : 'Server error'
    });
  });

  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`Server listening on port ${PORT}`);
  });
};

startServer();