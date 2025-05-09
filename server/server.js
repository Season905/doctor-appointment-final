const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
require('dotenv').config();

// Initialize Express
const app = express();

// Configuration
const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
};

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Database Connection
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: config.corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// API Routes
const routes = [
  { path: '/api/users', router: require('./routes/userRoutes') },
  { path: '/api/doctors', router: require('./routes/doctorRoutes') },
  { path: '/api/appointments', router: require('./routes/appointmentRoutes') },
  { path: '/api/stats', router: require('./routes/statsRoutes') },
  { path: '/api/admin', router: require('./routes/adminRoutes') }
];

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();

    // Register routes
    routes.forEach(route => {
      app.use(route.path, route.router);
      console.log(`Route registered: ${route.path}`);
    });

    // Production setup
    if (config.nodeEnv === 'production') {
      app.use(express.static(path.join(__dirname, '../client/build')));
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
      });
    }

    // 404 Handler
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        path: req.path
      });
    });

    // Error Handler
    app.use((err, req, res, next) => {
      console.error('Server Error:', {
        message: err.message,
        stack: config.nodeEnv === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method
      });

      res.status(err.status || 500).json({
        success: false,
        error: config.nodeEnv === 'development' ? {
          message: err.message,
          stack: err.stack
        } : 'Internal server error'
      });
    });

    // Start server
    app.listen(config.port, () => {
      console.log(`Server running in ${config.nodeEnv} mode`);
      console.log(`Server listening on port ${config.port}`);
      console.log(`CORS enabled for origin: ${config.corsOrigin}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

startServer();