const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// GET all users
const getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find().select('-__v');
    
    res.status(200).json({
        success: true,
        count: users.length,
        data: users
    });
});

// GET single user by ID
const getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id).select('-__v');
    
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.status(200).json({
        success: true,
        data: user
    });
});

// POST create new user
const createUser = catchAsync(async (req, res, next) => {
    const { name, email } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new AppError('Email already exists', 400));
    }

    // Create new user
    const newUser = await User.create({
        name,
        email
    });

    // Remove __v from response
    const userResponse = newUser.toObject();
    delete userResponse.__v;

    res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: userResponse
    });
});

// PUT update user
const updateUser = catchAsync(async (req, res, next) => {
    const { name, email } = req.body;

    // Check if email already exists (if updating email)
    if (email) {
        const existingUser = await User.findOne({ 
            email, 
            _id: { $ne: req.params.id } 
        });
        
        if (existingUser) {
            return next(new AppError('Email already exists', 400));
        }
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { name, email },
        { 
            new: true, 
            runValidators: true,
            context: 'query'
        }
    ).select('-__v');

    if (!updatedUser) {
        return next(new AppError('User not found', 404));
    }

    res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser
    });
});

// DELETE user
const deleteUser = catchAsync(async (req, res, next) => {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
        return next(new AppError('User not found', 404));
    }

    res.status(200).json({
        success: true,
        message: 'User deleted successfully'
    });
});

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
};