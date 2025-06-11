// app/controllers/auth.controller.js
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/main.config');

exports.signup = async (req, res) => {
    try {
        const { username, email, password, roles } = req.body;

        // Check if user already exists (handles requirement 'c' - unique email/username)
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            let message = '';
            if (existingUser.username === username) {
                message += 'Username already exists.';
            }
            if (existingUser.email === email) {
                if (message) message += ' ';
                message += 'Email already exists.';
            }
            return res.status(409).send({ message: message || 'User already exists.' }); // 409 Conflict for duplicate resource
        }

        // Hash password (handles requirement 'b' - no plaintext passwords)
        const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds

        // Determine roles: Default to 'student' if no roles provided
        const userRoles = (roles && Array.isArray(roles) && roles.length > 0) ? roles : ['student'];

        // Create new user (handles requirement 'a' - ability to create user)
        const user = new User({
            username,
            email,
            password: hashedPassword,
            roles: userRoles
        });

        await user.save();
        res.status(201).send({ message: 'User registered successfully!' });

    } catch (error) {
        console.error("Signup error:", error); // Log the detailed error
        res.status(500).send({ message: 'Error registering user. Please try again later.' });
    }
};

exports.signin = async (req, res) => {
    // ... (keep this as is from the previous step)
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).send({ message: 'User Not found.' });
        }

        // Compare password
        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ accessToken: null, message: 'Invalid Password!' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, roles: user.roles },
            config.jwtSecret,
            { expiresIn: '1h' }
        );

        res.status(200).send({
            id: user._id,
            username: user.username,
            email: user.email,
            roles: user.roles,
            accessToken: token
        });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};