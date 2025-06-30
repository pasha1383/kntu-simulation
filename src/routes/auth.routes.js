// app/routes/auth.routes.js
const { signup, signin } = require('../controllers/auth.controller');
const { validateRegister, validateLogin, validateProfileUpdate} = require('../middleware/validation');
const {updateProfile} = require("../controllers/profile.controller");
const {verifyToken} = require("../middleware/authJwt"); // Import validation middleware
const router = require('express').Router();

// Apply validation to the signup route
router.post('/auth/register', validateRegister, signup);
router.put('/auth/register',verifyToken, validateProfileUpdate, updateProfile);
router.post('/auth/signin', signin);

module.exports = router;