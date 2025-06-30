// app/models/course.model.js (UPDATED)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    code: { // Course code, e.g., "CE401"
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        trim: true
    },
    professor: {
        type: Schema.Types.ObjectId, // Reference to the User model (professor role)
        ref: 'User',
        required: true
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    participants: [ // Students enrolled in the course
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    isActive: { // NEW: To signify if the course is active in the current term
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;