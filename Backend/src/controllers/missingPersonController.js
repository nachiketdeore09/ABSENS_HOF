import MissingPerson from '../models/MissingPerson.model.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import ApiResponse from '../utils/apiResponse.js';

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
        const person = await MissingPerson.findById(req.params.id).populate(
            'reportedBy',
            'name email phone',
        );

        if (!person) {
            return ApiResponse.error(res, 404, 'Missing person not found');
        }

        return ApiResponse.success(res, {status:200,message: 'Record found',data: person});
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
