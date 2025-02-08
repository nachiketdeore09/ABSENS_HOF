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
        // console.log({ accessToken, refreshToken });
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

const registerUser = asyncHandler(async (req, res) => {
    const { username, password, fullname, email, gender } = req.body;
    if (!username || !password || !fullname) {
        throw new ApiError(400, 'Please fill in all fields');
    }
    User.findOne({ $or: [{ username: username, email: email }] }).then(
        (user) => {
            if (user) {
                throw new ApiError(400, 'Username already exists');
            }
        },
    );

    // let avatarLocalPath = null;
    // if (req.files && req.files.avatar && req.files.avatar.length > 0) {
    //     avatarLocalPath = req.files.avatar[0].path;
    // }

    // if (avatarLocalPath==null) {
    //     throw new ApiError(400, 'Please provide an avatar !');
    // }

    // const avatar = await uploadOnCloudinary(avatarLocalPath);
    // if (!avatar) {
    //     throw new ApiError(500, 'Error uploading avatar');
    // }

    const user = await User.create({
        username,
        password,
        fullname,
        email,
        gneder: gender?.toLowerCase() || 'other',
        avatar: "asasasasa",
    });

    const newUser = await User
        .findOne({ _id: user._id })
        .select('-password -refreshToken');

    if (!newUser) {
        throw new ApiError(500, 'Error creating user');
    }

    return res
        .status(201)
        .json(new ApiResponse(201, 'User created successfully', newUser));
});

const loginUser = asyncHandler(async (req, res) => {
    const { username, password, email } = req.body;
    if (!username && !email) {
        throw new ApiError(400, 'Please provide a username or email');
    }
    if (!password) {
        throw new ApiError(400, 'Please provide a password');
    }

    const user = await User.findOne({
        $or: [{ username: username }, { email: email }],
    });
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) {
        throw new ApiError(401, 'Invalid credentials');
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id,
    );
    // console.log(accessToken, refreshToken);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const newUser = await User.findById({ _id: user._id }).select(
        '-password',
    );
    if (!newUser) {
        throw new ApiError(500, 'Error logging in user');
    }
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie('refreshToken', refreshToken, options)
        .cookie('accessToken', accessToken, options)
        .json(new ApiResponse(200, 'User logged in successfully', {user: newUser, accessToken, refreshToken}));
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
