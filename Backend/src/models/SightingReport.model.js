const mongoose = require('mongoose');

const sightingReportSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    reportedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    photos: {
        type: [String],
        required: true,
        validate: {
            validator: function (v) {
                return v.length >= 1;
            },
            message: 'At least one photo is required',
        },
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            required: true,
        },
        address: String,
    },
    description: String,
    status: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending',
    },
    timestamp: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('SightingReport', sightingReportSchema);
