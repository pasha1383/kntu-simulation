// app/models/announcement.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const announcementSchema = new Schema({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    professor: { // The user who made the announcement (should be a professor)
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        trim: true,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

const Announcement = mongoose.model('Announcement', announcementSchema);
module.exports = Announcement;