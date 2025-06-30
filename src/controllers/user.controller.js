// app/controllers/user.controller.js
// This file will contain controllers for protected user-related routes
const User = require('../models/user.model');

exports.getUserDashboard = (req, res) => {
    // req.userId and req.userRoles are available thanks to verifyToken middleware
    // This endpoint is accessible by any authenticated user (student, professor, admin)
    res.status(200).json({
        message: 'Welcome to your general dashboard!',
        userId: req.userId,
        userRoles: req.userRoles,
        // You could fetch more user-specific data here from the database if needed
        // For example: const user = await User.findById(req.userId).select('-password');
        // then send user data: user: user
    });
};

exports.getAdminPanel = (req, res) => {
    // This endpoint is protected by isAdmin middleware (requires 'admin' role)
    res.status(200).json({
        message: 'Welcome to the Admin Panel! You have full administrative access.',
        userId: req.userId,
        userRoles: req.userRoles
    });
};

exports.getProfessorCourses = (req, res) => {
    // This endpoint is protected by isProfessor middleware (requires 'professor' role)
    res.status(200).json({
        message: 'Welcome, Professor! Here are your assigned courses and teaching resources.',
        userId: req.userId,
        userRoles: req.userRoles
    });
};

exports.getStudentGrades = (req, res) => {
    // This endpoint is protected by isStudent middleware (requires 'student' role)
    res.status(200).json({
        message: 'Welcome, Student! Here are your grades and academic progress.',
        userId: req.userId,
        userRoles: req.userRoles
    });
};

// You can add more user-specific controllers here as your project grows.
// For instance, a controller to get a user's own details:
exports.getSelfDetails = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('-password'); // Exclude password from the response
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ message: 'Error fetching user details.' });
    }
};