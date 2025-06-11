const { body, validationResult } = require('express-validator');

exports.validateRegister = [
    body('username')
        .notEmpty().withMessage('Username is required.')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long.')
        .trim().escape(),
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