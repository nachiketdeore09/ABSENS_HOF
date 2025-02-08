import asyncHandler from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/apiError.js';
import User from '../models/user.model.js';

const verifyToken = asyncHandler(async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header('Authorization')?.replace('Bearer ', '');
                                                                                
        if (!token) throw new ApiError(401, 'Unauthorized access');             
        const decodedToken = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id);

        if (!user) return new ApiError(401, 'Unauthorized access');

        req.user = user;
        next();
    } catch (error) {
        // Handle token verification errors
        if (
            error.name === 'JsonWebTokenError' ||
            error.name === 'TokenExpiredError'
        ) {
            throw new ApiError(
                401,
                'Unauthorized access: Invalid or expired token',
            );
        }
        // Handle other errors
        throw new ApiError(500, 'Internal server error');
    }
});

export { verifyToken };
