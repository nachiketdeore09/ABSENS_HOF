import SightingReport from '../models/SightingReport.model.js';
import MissingPerson from '../models/MissingPerson.model.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import ApiResponse from '../utils/apiResponse.js';

export const createSightingReport = async (req, res) => {
  try {
    const { personId, description, location } = req.body;
    
    // Validate required fields
    if (!personId || !location) {
      return ApiResponse.error(res, 400, 'Person ID and location are required');
    }

    // Check if person exists
    const person = await MissingPerson.findById(personId);
    if (!person) {
      return ApiResponse.error(res, 404, 'Missing person not found');
    }

    // Upload photos
    const photos = await Promise.all(
      req.files.map(file => uploadToCloudinary(file.path))
    );

    // Create report
    const report = await SightingReport.create({
      person: personId,
      reportedBy: req.user.id,
      photos: photos.map(p => p.url),
      description,
      location: {
        type: 'Point',
        coordinates: location.coordinates,
        address: location.address
      },
      timestamp: new Date()
    });

    return ApiResponse.success(
      res,
      201,
      'Sighting report created successfully',
      report
    );

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
    const report = await SightingReport.findById(req.params.id)
      .populate('person', 'name age photos')
      .populate('reportedBy', 'name email phone');

    if (!report) {
      return ApiResponse.error(res, 404, 'Report not found');
    }

    return ApiResponse.success(res, 200, 'Sighting report', report);
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
        $set: { verifiedBy: req.user.id }
      },
      { new: true, runValidators: true }
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