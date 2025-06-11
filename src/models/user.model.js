const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    studentId: {
        type: String,
        unique: true,
        trim: true,
        minlength: 8,
        maxlength: 8,
        match: /^\d{8}$/,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    roles: [
        {
            type: String,
            enum: ['student', 'admin'],
            default: 'student'
        }
    ]
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;