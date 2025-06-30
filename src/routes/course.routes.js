// app/routes/course.routes.js
const router = require('express').Router();
const { getCourseParticipants, getCourseDetails, createCourse } = require('../controllers/course.controller');
const { isAdmin } = require('../middleware/authJwt'); // For example: to protect createCourse

// All routes here are automatically protected by verifyToken in server.js

// GET /api/courses/:courseId/participants
// List all participants of a specific course with basic information
router.get('/courses/:courseId/participants', getCourseParticipants);

// GET /api/courses/:courseId
// Get full details of a specific course, including its participants
router.get('/courses/:courseId', getCourseDetails);

// --- Admin-only or setup routes (example) ---
// This route to create a course should typically be restricted to admins
router.post('/courses', isAdmin, createCourse); // Add isAdmin middleware for protection

module.exports = router;