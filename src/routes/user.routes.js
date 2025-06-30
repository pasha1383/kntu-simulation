// app/routes/user.routes.js
const router = require('express').Router();

// Import role-based authorization middleware from authJwt
// Note: verifyToken is applied globally in server.js, so we don't need to add it here explicitly
const { isAdmin, isProfessor, isStudent } = require('../middleware/authJwt');

// Import controllers for user-related actions
const {
    getUserDashboard,
    getAdminPanel,
    getProfessorCourses,
    getStudentGrades,
    getSelfDetails,// New controller for getting own user details
    getTermCourses, // NEW
    getMyCourses    // NEW
} = require('../controllers/user.controller');

// Import the profile controller and its validation


// --- Routes for General User Actions (Protected by global verifyToken) ---

// Route for any authenticated user to access their general dashboard
router.get('/user/dashboard', getUserDashboard);

// Route for an authenticated user to fetch their own details (excluding password)
router.get('/user/me', getSelfDetails);

// Route for authenticated users to update their own profile
// This route is protected by the global verifyToken middleware, and then
// validateProfileUpdate ensures the input data is correct.
// router.put('/profile', validateProfileUpdate, updateProfile);


// --- Routes for Role-Specific Access (Protected by global verifyToken + role middleware) ---

// Route accessible only by users with 'admin' role
router.get('/admin/panel', isAdmin, getAdminPanel);

// Route accessible only by users with 'professor' role
router.get('/professor/courses', isProfessor, getProfessorCourses);

// Route accessible only by users with 'student' role
router.get('/student/grades', isStudent, getStudentGrades);

// GET /api/dashboard/term-courses
// For students: registered courses in current term (isActive)
// For professors: teaching courses in current term (isActive)
router.get('/dashboard/term-courses', getTermCourses);

// GET /api/dashboard/my-courses
// For students: all registered courses
// For professors: all courses they have taught
router.get('/dashboard/my-courses', getMyCourses);


// Export the router to be used in server.js
module.exports = router;