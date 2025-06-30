// app/controllers/announcement.controller.js
const Announcement = require('../models/announcement.model');
const Course = require('../models/course.model'); // To check if course exists

// GET /courses/:courseId/announcements
exports.getCourseAnnouncements = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Optional: Check if the course exists first
        const courseExists = await Course.findById(courseId);
        if (!courseExists) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        // Find all announcements for the given courseId
        // Populate the professor to show who made the announcement (e.g., username)
        const announcements = await Announcement.find({ course: courseId })
            .populate('professor', 'username email roles') // Get basic info of the professor
            .sort({ createdAt: -1 }) // Sort by newest first
            .exec();

        res.status(200).json({
            courseId: courseId,
            announcements: announcements.map(ann => ({
                id: ann._id,
                title: ann.title,
                content: ann.content,
                professor: {
                    id: ann.professor._id,
                    username: ann.professor.username,
                    email: ann.professor.email
                },
                createdAt: ann.createdAt,
                updatedAt: ann.updatedAt
            }))
        });

    } catch (error) {
        console.error('Error fetching course announcements:', error);
        res.status(500).json({ message: 'Error fetching course announcements.', error: error.message });
    }
};

// POST /courses/:courseId/announcements (Professor only)
exports.postCourseAnnouncement = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, content } = req.body;
        const professorId = req.userId; // Get professor's ID from the JWT token (verified by authJwt.js)

        // Validate input
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required for an announcement.' });
        }

        // Check if the course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        // Optional but good for data consistency: Verify the user is actually the professor of THIS course
        // Or at least, a professor who is allowed to post announcements for any course.
        // For simplicity, we're just checking 'isProfessor' middleware and then linking by req.userId
        // If you need only *the professor teaching the course* to post, you'd add:
        // if (course.professor.toString() !== professorId) {
        //     return res.status(403).json({ message: 'You are not authorized to post announcements for this course.' });
        // }

        const newAnnouncement = new Announcement({
            course: courseId,
            professor: professorId,
            title,
            content
        });

        await newAnnouncement.save();

        res.status(201).json({ message: 'Announcement posted successfully!', announcement: newAnnouncement });

    } catch (error) {
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.keys(error.errors).map(key => error.errors[key].message);
            return res.status(400).send({ message: 'Validation failed', errors });
        }
        console.error('Error posting announcement:', error);
        res.status(500).json({ message: 'Error posting announcement.', error: error.message });
    }
};