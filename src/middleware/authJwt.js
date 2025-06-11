const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); // Assuming you have a User model
const config = require('../config/main.config');


const verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers.authorization;

    if (!token) {
        return res.status(403).send({ message: 'No token provided!' });
    }

    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }

    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Unauthorized!' });
        }
        req.userId = decoded.id; // Store user ID from token in request object
        req.userRoles = decoded.roles; // Store user roles from token
        next();
    });
};

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (user && user.roles.includes('admin')) {
            next();
        } else {
            return res.status(403).send({ message: 'Require Admin Role!' });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const isProfessor = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (user && user.roles.includes('professor')) {
            next();
        } else {
            return res.status(403).send({ message: 'Require Professor Role!' });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const isStudent = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (user && user.roles.includes('student')) {
            next();
        } else {
            return res.status(403).send({ message: 'Require Student Role!' });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


const authJwt = {
    verifyToken,
    isAdmin,
    isProfessor,
    isStudent
};

module.exports = authJwt;