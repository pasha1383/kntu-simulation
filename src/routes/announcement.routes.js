// app/routes/announcement.routes.js
const router = require('express').Router();
const { getCourseAnnouncements, postCourseAnnouncement } = require('../controllers/announcement.controller');
const { isProfessor } = require('../middleware/authJwt'); // For protecting the POST endpoint

// All routes here are automatically protected by verifyToken in server.js

// GET /api/courses/:courseId/announcements
// Get all announcements for a specific course
router.get('/courses/:courseId/announcements', getCourseAnnouncements);

// POST /api/courses/:courseId/announcements
// Post a new announcement for a specific course (Professor only)
router.post('/courses/:courseId/announcements', isProfessor, postCourseAnnouncement);

module.exports = router;