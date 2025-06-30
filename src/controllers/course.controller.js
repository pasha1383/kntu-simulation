// app/controllers/course.controller.js
const Course = require('../models/course.model');
const User = require('../models/user.model'); // To get basic user info for participants

// Helper function to get course details and populated participants
const getCourseWithParticipants = async (courseId) => {
    // Populate professor and participants fields
    // Select specific fields for participants (username, email, studentId, roles)
    // -password to exclude password
    const course = await Course.findById(courseId)
        .populate('professor', 'username email roles') // Only basic info for professor
        .populate('participants', 'username email studentId roles') // Only basic info for participants
        .exec();

    if (!course) {
        return null;
    }

    // Filter participants to only include students or professors if needed,
    // or just return all users associated. The request specified "students, professors".
    const filteredParticipants = course.participants.filter(p =>
        p.roles.includes('student') || p.roles.includes('professor')
    );

    return {
        _id: course._id,
        name: course.name,
        code: course.code,
        description: course.description,
        professor: course.professor,
        capacity: course.capacity,
        // Ensure participants only include necessary basic info for each person
        participants: filteredParticipants.map(p => ({
            id: p._id,
            username: p.username,
            email: p.email,
            studentId: p.studentId, // Will be undefined for non-students
            roles: p.roles
        })),
        createdAt: course.createdAt,
        updatedAt: course.updatedAt
    };
};


// GET /courses/:courseId/participants
exports.getCourseParticipants = async (req, res) => {
    try {
        const { courseId } = req.params;

        const courseData = await getCourseWithParticipants(courseId);

        if (!courseData) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        // Return only the participants list
        res.status(200).json({
            courseId: courseData._id,
            courseName: courseData.name,
            participants: courseData.participants
        });

    } catch (error) {
        console.error('Error fetching course participants:', error);
        res.status(500).json({ message: 'Error fetching course participants.', error: error.message });
    }
};

// GET /courses/:courseId
exports.getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.params;

        const courseData = await getCourseWithParticipants(courseId);

        if (!courseData) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        // Return full course details including participants
        res.status(200).json(courseData);

    } catch (error) {
        console.error('Error fetching course details:', error);
        res.status(500).json({ message: 'Error fetching course details.', error: error.message });
    }
};


// --- Admin-only or setup endpoint (example: to add a course) ---
// You will likely need an admin route to create courses in the first place.
// This is an example, not explicitly requested, but necessary for data.
exports.createCourse = async (req, res) => {
    try {
        const { name, code, description, professorId, capacity, participantIds } = req.body;

        // Basic validation for required fields
        if (!name || !code || !professorId || !capacity) {
            return res.status(400).json({ message: 'Missing required course fields.' });
        }

        // Check if professorId actually belongs to a professor
        const professor = await User.findById(professorId);
        if (!professor || !professor.roles.includes('professor')) {
            return res.status(400).json({ message: 'Invalid professor ID or user is not a professor.' });
        }

        // Optional: Validate participantIds if provided
        let validParticipants = [];
        if (participantIds && Array.isArray(participantIds) && participantIds.length > 0) {
            const users = await User.find({ _id: { $in: participantIds } });
            validParticipants = users.map(u => u._id); // Ensure only valid IDs are added
        }


        const newCourse = new Course({
            name,
            code,
            description,
            professor: professor._id,
            capacity,
            participants: validParticipants
        });

        await newCourse.save();

        res.status(201).json({ message: 'Course created successfully!', course: newCourse });

    } catch (error) {
        if (error.code === 11000) { // MongoDB duplicate key error
            return res.status(409).json({ message: 'Course with this name or code already exists.' });
        }
        console.error('Error creating course:', error);
        res.status(500).json({ message: 'Error creating course.', error: error.message });
    }
};