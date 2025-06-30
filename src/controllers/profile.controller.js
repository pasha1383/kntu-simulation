// app/controllers/profile.controller.js
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.userId; // Get user ID from the authenticated token
        const { username, email, password, roles, studentId } = req.body;

        const user = await User.findOne({ username });


        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }

        // --- Update fields if provided and valid ---

        // Update Username
        // if (username !== undefined && username !== user.username) {
        //     const existingUsernameUser = await User.findOne({ username });
        //     if (existingUsernameUser && existingUsernameUser._id.toString() !== userId) {
        //         return res.status(409).send({ message: 'Username already taken.' });
        //     }
        //     user.username = username;
        // }

        // Update Email
        if (email !== undefined && email !== user.email) {
            const existingEmailUser = await User.findOne({ email });
            if (existingEmailUser && existingEmailUser._id.toString() !== userId) {
                return res.status(409).send({ message: 'Email already taken.' });
            }
            user.email = email;
        }

        // Update Password (hash it if provided)
        if (password !== undefined) {
            user.password = await bcrypt.hash(password, 10);
        }

        // Update Roles (handle with caution, typically requires admin privileges)
        // For this endpoint, we will *not* allow regular users to change their own roles.
        // If roles are being updated, this should be handled by an admin-specific endpoint.
        // Leaving this as a placeholder, but for a general "profile update",
        // users should not be able to elevate their own privileges.
        // If roles property is passed in the body, it's ignored for security unless it's an admin path.
        // For simplicity of this task, we will ignore 'roles' update from a user's self-update for now.
        // If you need role updates, specify if it's an admin-only feature or how it should work for users.

        // Update Student ID (conditionally based on roles)
        if (studentId !== undefined) {
            // Check if the user is a student or is becoming a student
            const isStudentRole = (roles && roles.includes('student')) || user.roles.includes('student');

            if (isStudentRole) {
                // If the user's role is student (or becoming student), studentId is required
                if (!studentId) {
                    return res.status(400).send({ message: 'Student ID is required for student users.' });
                }

                // Check for uniqueness of the new studentId
                const existingStudentIdUser = await User.findOne({ studentId });
                if (existingStudentIdUser && existingStudentIdUser._id.toString() !== userId) {
                    return res.status(409).send({ message: 'Student ID already in use by another user.' });
                }

                // Validate format and length (schema validation also handles this, but good to have explicit check)
                if (!/^\d{8}$/.test(studentId)) {
                    return res.status(400).send({ message: 'Student ID must be an 8-digit number string.' });
                }

                user.studentId = studentId;
            } else {
                // If user is not a student, ensure studentId is null/undefined
                user.studentId = undefined; // Or null, depending on your preference
            }
        }


        await user.save();
        res.status(200).send({ message: 'Profile updated successfully!', user: user.toObject({ virtuals: true }) });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.keys(error.errors).map(key => error.errors[key].message);
            return res.status(400).send({ message: 'Validation failed', errors });
        }
        console.error('Error updating profile:', error);
        res.status(500).send({ message: 'Error updating profile. Please try again.' });
    }
};