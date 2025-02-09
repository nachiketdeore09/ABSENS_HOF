const mongoose = require('mongoose');

const missingPersonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    age: {
        type: Number,
        required: [true, 'Please add an age'],
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
    },
    description: String,
    missingDate: {
        type: Date,
        required: true,
    },
    lastSeenLocation: {
        type: String,
        required: true,
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
    // facialEmbedding: {
    //   type: [Number],
    //   required: true,
    //   select: false
    // },
    reportedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['missing', 'found'],
        default: 'missing',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('MissingPerson', missingPersonSchema);
