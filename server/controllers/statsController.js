const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Get dashboard statistics
// @route   GET /api/stats/dashboard
// @access  Private
exports.getDashboardStats = asyncHandler(async (req, res) => {
  try {
    const [totalPatients, availableDoctors, appointmentStats] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ 
        role: 'doctor',
        isAvailable: true
      }),
      Appointment.aggregate([
        {
          $group: {
            _id: null,
            totalAppointments: { $sum: 1 },
            upcomingAppointments: {
              $sum: {
                $cond: [
                  { 
                    $and: [
                      { $gte: ["$date", new Date()] },
                      { $ne: ["$status", "cancelled"] }
                    ]
                  },
                  1,
                  0
                ]
              }
            },
            completedAppointments: {
              $sum: {
                $cond: [
                  { $eq: ["$status", "completed"] },
                  1,
                  0
                ]
              }
            }
          }
        }
      ])
    ]);

    const stats = {
      totalAppointments: appointmentStats[0]?.totalAppointments || 0,
      upcomingAppointments: appointmentStats[0]?.upcomingAppointments || 0,
      completedAppointments: appointmentStats[0]?.completedAppointments || 0,
      totalPatients,
      availableDoctors
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}); // Closing brace for getDashboardStats

// @desc    Get detailed appointment statistics
// @route   GET /api/stats/appointments
// @access  Private/Admin
exports.getAppointmentStats = asyncHandler(async (req, res) => {
  try {
    const stats = await Appointment.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          averageDuration: { $avg: "$duration" }
        }
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
          averageDuration: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    console.error('Error fetching appointment stats:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Get user statistics
// @route   GET /api/stats/users
// @access  Private/Admin
exports.getUserStats = asyncHandler(async (req, res) => {
  try {
    const userStats = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
          activeUsers: {
            $sum: {
              $cond: [{ $eq: ["$isActive", true] }, 1, 0]
            }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: userStats
    });
  } catch (err) {
    console.error('Error fetching user stats:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Get doctor statistics
// @route   GET /api/stats/doctors
// @access  Private/Admin+Doctor
exports.getDoctorStats = asyncHandler(async (req, res) => {
  try {
    const doctorStats = await User.aggregate([
      { $match: { role: "doctor" } },
      {
        $lookup: {
          from: "appointments",
          localField: "_id",
          foreignField: "doctor",
          as: "appointments"
        }
      },
      {
        $project: {
          name: 1,
          specialization: 1,
          totalAppointments: { $size: "$appointments" },
          availableSlots: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: doctorStats
    });
  } catch (err) {
    console.error('Error fetching doctor stats:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});