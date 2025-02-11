import User from '../models/user.model.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
// import {uploadOnCloudinary} from '../utils/cloudinary.js';

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findOne({ _id: userId });
        if (!user) {
            throw new ApiError(404, 'User not found');
        }
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        console.log({ accessToken, refreshToken });
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, error.message);
    }
};

const getUsers = asyncHandler(async (req, res) => {
    
    const users = await User.find().select('-password -refreshToken');
    if (!users) {
        throw new ApiError(404, 'No users found');
    }
    return res.status(200).json(new ApiResponse(200, 'Users found', users));
});

const registerUser = async (req, res) => {
    // Destructure form data from req.body
    const { password, email, fullname, gender } = req.body;
    
    // Simple validation
    if (!password || !email) {
      throw new ApiError(400, 'Password and email are required');
    }
  
    try {
    //   console.log("req.body", req.body);
      // Check for existing user
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new ApiError(409, 'User already exists');
      }
  
      // Extract username from email (everything before the '@')
      const extractedUsername = email.split('@')[0];
  
      // Ensure gender value matches the schema's enum
      const formattedGender = gender
        ? gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase()
        : 'Others';
  
      // Create new user, using the extracted username
      const user = await User.create({
        username: extractedUsername,  // Use extracted username from email
        password,
        email,
        fullname: fullname || '',
        gender: formattedGender,
      });
      
      if (!user) {
        throw new Error('User creation returned null or undefined');
      }
  
      // Prepare user data for response (omit sensitive info)
      const userData = {
        _id: user._id,
        username: user.username,
        email: user.email,
        gender:user.gender,
        fullname: user.fullname,
        createdAt: user.createdAt,
        avatar: user.avatar,
      };
  
      // Return a successful response
      return ApiResponse.success(res, { 
        statusCode: 201, 
        message: 'Registration successful', 
        data: userData 
      });
    } catch (error) {
      return ApiResponse.error(res, { 
        statusCode: 500, 
        message: error.message, 
        data: {} 
      });
    }
  };
  


const loginUser = asyncHandler(async (req, res) => {
    const { password, email } = req.body;
    // console.log(req.body);

    const extractedUsername = email.split('@')[0];
    const username=extractedUsername;

    if (!username && !email) {
        throw new ApiError(400, 'Please provide a username or email');
    }
    if (!password) {
        throw new ApiError(400, 'Please provide a password');
    }

    const user = await User.findOne({
        $or: [{ username }, { email }],
    });
    // console.log("user", user);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    
    const isMatch = await user.isPasswordCorrect(password);
    // console.log("Password match:", isMatch);
    if (!isMatch) {
        throw new ApiError(401, 'Invalid credentials');
    }
    
    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    // console.log("Access Token:", accessToken, "Refresh Token:", refreshToken);

    // Save the refresh token on the user model
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Retrieve the user data without sensitive information
    const newUser = await User.findById(user._id).select('-password');
    // console.log("newUser", newUser);
    if (!newUser) {
        throw new ApiError(500, 'Error logging in user');
    }

    // Cookie options (adjust secure flag for local testing)
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    };

    // Set cookies and return the response using the ApiResponse.success static method
    res
        .cookie('refreshToken', refreshToken, options)
        .cookie('accessToken', accessToken, options);
    
    return ApiResponse.success(res, { 
        statusCode: 200, 
        message: 'User logged in successfully', 
        data: { user: newUser, accessToken, refreshToken } 
    });
});

const logOutUser = asyncHandler(async (req, res) => {
    // console.log(req.user);
    if(!req.user){
        throw new ApiError(401, 'Unauthorized');
    }
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: '',
            },
        },
        {
            new: true,
            select: '-password ',
        },
    );

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None', // Use the same setting as when setting the cookies
        path: '/', // Default is '/' if not explicitly set
    };

    return res
        .status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(new ApiResponse(200, {}, 'User logged out successfully'));
});

export {
    getUsers,
    registerUser,
    loginUser,
    logOutUser,
};
