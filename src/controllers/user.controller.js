// app/controllers/user.controller.js
// This file will contain controllers for protected user-related routes
const User = require('../models/user.model');
const Course = require('../models/course.model');
const bcrypt = require('bcrypt');

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


// NEW: GET /dashboard/term-courses
exports.getTermCourses = async (req, res) => {
    try {
        const userId = req.userId;
        const userRoles = req.userRoles;

        let courses = [];

        if (userRoles.includes('student')) {
            // For students: courses they are registered in and are currently active
            courses = await Course.find({
                participants: userId, // Student is in participants array
                isActive: true // Consider these as "current term" courses
            })
                .populate('professor', 'username') // Populate professor name
                .select('name code description professor capacity'); // Select relevant course fields

        } else if (userRoles.includes('professor')) {
            // For professors: courses they are teaching and are currently active
            courses = await Course.find({
                professor: userId, // Professor is the assigned professor
                isActive: true // Consider these as "current term" courses
            })
                .select('name code description professor capacity');

        } else {
            return res.status(403).json({ message: 'Access denied. Only students and professors can view term courses.' });
        }

        res.status(200).json({ message: 'Current term courses fetched successfully.', courses });

    } catch (error) {
        console.error('Error fetching term courses:', error);
        res.status(500).json({ message: 'Error fetching term courses.', error: error.message });
    }
};

// NEW: GET /dashboard/my-courses
exports.getMyCourses = async (req, res) => {
    try {
        const userId = req.userId;
        const userRoles = req.userRoles;

        let courses = [];

        if (userRoles.includes('student')) {
            // For students: all courses they are registered in (active or inactive)
            courses = await Course.find({
                participants: userId // Student is in participants array
            })
                .populate('professor', 'username')
                .select('name code description professor capacity isActive'); // Include isActive for context

        } else if (userRoles.includes('professor')) {
            // For professors: all courses they have taught (active or inactive)
            courses = await Course.find({
                professor: userId // Professor is the assigned professor
            })
                .select('name code description professor capacity isActive');

        } else {
            return res.status(403).json({ message: 'Access denied. Only students and professors can view their courses.' });
        }

        res.status(200).json({ message: 'All enrolled/taught courses fetched successfully.', courses });

    } catch (error) {
        console.error('Error fetching my courses:', error);
        res.status(500).json({ message: 'Error fetching my courses.', error: error.message });
    }
};