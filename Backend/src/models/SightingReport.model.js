import mongoose from 'mongoose';

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
        type: String,
        default:"",
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

export default mongoose.model('SightingReport', sightingReportSchema);
