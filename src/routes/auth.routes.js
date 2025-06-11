// app/routes/auth.routes.js
const { signup, signin } = require('../controllers/auth.controller');
const { validateRegister } = require('../middleware/validation'); // Import validation middleware
const router = require('express').Router();

// Apply validation to the signup route
router.post('/auth/signup', validateRegister, signup);
router.post('/auth/signin', signin);

module.exports = router;