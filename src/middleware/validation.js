const { body, validationResult } = require('express-validator');

exports.validateLogin = [
    body('username')
        .notEmpty().withMessage('Username is required.')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long.')
        .trim().escape(),
    body('password')
        .notEmpty().withMessage('Password is required.')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
]

exports.validateProfileUpdate = [
    body('username')
        .optional() // Username is optional for update
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long.')
        .trim().escape(),
    body('email')
        .optional() // Email is optional for update
        .isEmail().withMessage('Invalid email format.')
        .normalizeEmail(),
    body('password')
        .optional() // Password is optional for update
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    body('roles')
        .optional() // Roles should typically be managed by an admin endpoint, but for validation purposes here:
        .isArray().withMessage('Roles must be an array.')
        .custom(roles => {
            if (!Array.isArray(roles)) return false;
            const validRoles = ['student', 'professor', 'admin'];
            const invalidRoles = roles.filter(role => !validRoles.includes(role));
            if (invalidRoles.length > 0) {
                throw new Error(`Invalid role(s) provided: ${invalidRoles.join(', ')}. Valid roles are: ${validRoles.join(', ')}`);
            }
            return true;
        }),
    body('studentId')
        .optional()
        .isString().withMessage('Student ID must be a string.')
        .trim()
        .isLength({ min: 8, max: 8 }).withMessage('Student ID must be exactly 8 digits long.')
        .matches(/^\d{8}$/).withMessage('Student ID must be an 8-digit number.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

exports.validateRegister = [
    body('username')
        .notEmpty().withMessage('Username is required.')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long.')
        .trim().escape(),
    body('studentId')
        .isString().withMessage('Student ID must be a string.')
        .trim()
        .isLength({ min: 8, max: 8 }).withMessage('Student ID must be exactly 8 digits long.')
        .matches(/^\d{8}$/).withMessage('Student ID must be an 8-digit number.'),
    body('email')
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Invalid email format.')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required.')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    body('roles')
        .optional()
        .isArray().withMessage('Roles must be an array.')
        .custom(roles => {
            if (!Array.isArray(roles)) return false;
            const validRoles = ['student','teacher'];
            const invalidRoles = roles.filter(role => !validRoles.includes(role));
            if (invalidRoles.length > 0) {
                throw new Error(`Invalid role(s) provided: ${invalidRoles.join(', ')}`);
            }
            return true;
        }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];