import SightingReport from '../models/SightingReport.model.js';
import MissingPerson from '../models/MissingPerson.model.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import ApiResponse from '../utils/apiResponse.js';
import mongoose from 'mongoose';
import User from '../models/user.model.js';

export const createSightingReport = async (req, res) => {
    try {
        const { name, description, location } = req.body;
        // console.log('req.body:', req.body);
        // console.log("req.files:", req.files);

        // Validate required fields
        if (!location) {
            return ApiResponse.error(res, 400, 'Location is required');
        }

        // Upload photos
        const photos = await Promise.all(
            req.files.map((file) => uploadToCloudinary(file.buffer)),
        );

        // console.log("first photo:", photos[0]);
        // console.log("photos:", photos);

        // Create report
        const report = await SightingReport.create({
            name: name || 'Unknown',
            reportedBy: req.user.id,
            photos: photos,
            description,
            location,
            timestamp: new Date(),
        });

        // console.log('report:', report);
        const user = await User.findById(req.user.id);
        user.reportedCases.push(sightingReport._id);
        await user.save();

        return ApiResponse.success(res, {
            status: 201,
            message: 'Sighting report created successfully',
            data: report,
        });
    } catch (error) {
        console.error('Create sighting error:', error);
        return ApiResponse.error(res, 500, 'Server Error');
    }
};

export const getSightingReports = async (req, res) => {
    try {
        const { status, personId } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (personId) filter.person = personId;

        const reports = await SightingReport.find(filter)
            .populate('person', 'name age photos')
            .populate('reportedBy', 'name role')
            .sort({ timestamp: -1 });

        return ApiResponse.success(res, 200, 'Sighting reports', reports);
    } catch (error) {
        console.error('Get reports error:', error);
        return ApiResponse.error(res, 500, 'Server Error');
    }
};

export const getSightingReportById = async (req, res) => {
    try {
        const { sightingReportIds } = req.body; // Expecting an array of sighting report IDs

        if (!sightingReportIds || !Array.isArray(sightingReportIds)) {
            return ApiResponse.error(res, {
                statusCode: 400,
                message:
                    'Invalid input: Expected an array of sighting report IDs',
            });
        }

        const validObjectIds = sightingReportIds
            .filter((id) => mongoose.Types.ObjectId.isValid(id))
            .map((id) => new mongoose.Types.ObjectId(id));

        if (validObjectIds.length === 0) {
            return ApiResponse.error(res, {
                statusCode: 400,
                message: 'No valid sighting report IDs provided',
            });
        }

        const reports = await SightingReport.find({
            _id: { $in: validObjectIds },
        });

        return ApiResponse.success(res, {
            status: 200,
            message: 'Sighting report',
            data: reports,
        });
    } catch (error) {
        console.error('Get report error:', error);
        return ApiResponse.error(res, 500, 'Server Error');
    }
};

export const updateSightingStatus = async (req, res) => {
    try {
        const { status, verificationNotes } = req.body;

        if (!['pending', 'verified', 'rejected'].includes(status)) {
            return ApiResponse.error(res, 400, 'Invalid status');
        }

        const report = await SightingReport.findByIdAndUpdate(
            req.params.id,
            {
                status,
                verificationNotes,
                $set: { verifiedBy: req.user.id },
            },
            { new: true, runValidators: true },
        );

        if (!report) {
            return ApiResponse.error(res, 404, 'Report not found');
        }

        return ApiResponse.success(res, 200, 'Status updated', report);
    } catch (error) {
        console.error('Update status error:', error);
        return ApiResponse.error(res, 500, 'Server Error');
    }
};
