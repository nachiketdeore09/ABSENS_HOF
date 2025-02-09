import MissingPerson from '../models/MissingPerson.model.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import ApiResponse from '../utils/apiResponse.js';

export const createMissingPerson = async (req, res) => {
  try {
    // Validate files exist
    if (!req.files || req.files.length === 0) {
      return ApiResponse.error(res, 400, 'At least one photo is required');
    }

    // Upload all photos to Cloudinary
    const uploadPromises = req.files.map(file => 
      uploadToCloudinary(file.path)
    );
    
    const cloudinaryResults = await Promise.all(uploadPromises);
    
    // Create missing person record
    const missingPerson = await MissingPerson.create({
      ...req.body,
      photos: cloudinaryResults.map(result => result.secure_url),
      reportedBy: req.user.id
    });

    return ApiResponse.success(
      res, 
      201, 
      'Missing person report created successfully', 
      missingPerson
    );

  } catch (error) {
    console.error('Error creating missing person:', error);
    return ApiResponse.error(res, 500, 'Server Error');
  }
};

export const searchMissingPersons = async (req, res) => {
  try {
    // Basic search implementation (customize as needed)
    const { name, age } = req.query;
    const query = { status: 'missing' };

    if (name) query.name = { $regex: name, $options: 'i' };
    if (age) query.age = age;

    const results = await MissingPerson.find(query)
      .populate('reportedBy', 'name phone')
      .sort({ missingDate: -1 });

    return ApiResponse.success(res, 200, 'Search results', results);

  } catch (error) {
    console.error('Search error:', error);
    return ApiResponse.error(res, 500, 'Server Error');
  }
};

export const getMissingPersonById = async (req, res) => {
  try {
    const person = await MissingPerson.findById(req.params.id)
      .populate('reportedBy', 'name email phone');

    if (!person) {
      return ApiResponse.error(res, 404, 'Missing person not found');
    }

    return ApiResponse.success(res, 200, 'Record found', person);
  } catch (error) {
    console.error('Get by ID error:', error);
    return ApiResponse.error(res, 500, 'Server Error');
  }
};

export const updateMissingPersonStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const person = await MissingPerson.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!person) {
      return ApiResponse.error(res, 404, 'Missing person not found');
    }

    return ApiResponse.success(res, 200, 'Status updated', person);
  } catch (error) {
    console.error('Status update error:', error);
    return ApiResponse.error(res, 500, 'Server Error');
  }
};