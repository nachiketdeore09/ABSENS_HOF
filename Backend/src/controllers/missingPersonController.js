import MissingPerson from '../models/MissingPerson.model.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import ApiResponse from '../utils/apiResponse.js';
import mongoose from 'mongoose';
import User from '../models/user.model.js';

export const createMissingPerson = async (req, res) => {
    try {
        const { name, age, gender, missingDate, lastSeenLocation } = req.body;

        // Step 1: Validate required fields BEFORE uploading images
        if (!name || !age || !gender || !missingDate || !lastSeenLocation) {
            return ApiResponse.error(res, 400, 'All fields are required');
        }

        if (!req.files || req.files.length === 0) {
            return ApiResponse.error(
                res,
                400,
                'At least one photo is required',
            );
        }

        // console.log('req.body:', req.body);
        // console.log('req.files:', req.files);

        // Step 2: Upload images only if validation passes
        const uploadPromises = req.files.map((file) =>
            uploadToCloudinary(file.buffer, file.mimetype.split('/')[1]),
        );

        const cloudinaryResults = await Promise.all(uploadPromises);
        // console.log('cloudinaryResults:', cloudinaryResults);

        // Step 3: Save missing person record in the database
        const missingPerson = await MissingPerson.create({
            name,
            age,
            gender,
            missingDate,
            lastSeenLocation,
            photos: cloudinaryResults, // Use URLs returned from Cloudinary
            reportedBy: req.user.id,
        });
        
        const user = await User.findById(req.user.id);
        user.missingCases.push(missingPerson._id);
        await user.save();

        return ApiResponse.success(res, {
            status: 201,
            message: 'Missing person report created successfully',
            data: missingPerson,
        });
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

        return ApiResponse.success(res, {
            status: 200,
            message: 'Search results',
            data: results,
        });
    } catch (error) {
        console.error('Search error:', error);
        return ApiResponse.error(res, 500, 'Server Error');
    }
};

export const getMissingPersonById = async (req, res) => {
    try {
        // Expecting the frontend to send { ids: [id1, id2, id3, ...] }
        const { ids } = req.body;
    
        // Validate that ids exist and is an array
        if (!ids || !Array.isArray(ids)) {
          return ApiResponse.error(res, {
            statusCode: 400,
            message: 'Invalid input: expected an array of IDs',
          });
        }
    
        // Filter out invalid MongoDB ObjectIds
        const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
        if (validIds.length === 0) {
          return ApiResponse.error(res, {
            statusCode: 400,
            message: 'No valid IDs provided',
          });
        }
    
        // Query the MissingPerson collection for documents with these IDs
        const missingPersons = await MissingPerson.find({
          _id: { $in: validIds },
        });
    
        return ApiResponse.success(res, {
          statusCode: 200,
          message: 'Missing persons retrieved successfully',
          data: missingPersons,
        });
      } catch (error) {
        console.error('Error fetching missing persons:', error);
        return ApiResponse.error(res, {
          statusCode: 500,
          message: 'Server error',
          error: error.message,
        });
      }
};

export const updateMissingPersonStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const person = await MissingPerson.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true },
        );

        if (!person) {
            return ApiResponse.error(res, 404, 'Missing person not found');
        }

        return ApiResponse.success(res, {status:200,message: 'Status updated',data: person});
    } catch (error) {
        console.error('Status update error:', error);
        return ApiResponse.error(res, 500, 'Server Error');
    }
};
