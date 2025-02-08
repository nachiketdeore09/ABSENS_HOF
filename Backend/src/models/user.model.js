import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            trim: true,
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Others'],
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
        },
        avatar: {
            type: String,
        },
        refreshToken: {
            type: String,
        },
    },
    { timestamps: true },
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        //Payload
        {
            _id : this._id,
            username: this.username,
            email: this.email,
        },
        // Secret Key
        process.env.ACCESS_TOKEN_SECRET,
        // Expiry
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
        
    )
};

userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        //Payload
        {
            _id: this._id,
        },
        // Secret Key
        process.env.REFRESH_TOKEN_SECRET,
        // Expiry
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        },
    );
};

const User = mongoose.model('User', userSchema);
export default User;
