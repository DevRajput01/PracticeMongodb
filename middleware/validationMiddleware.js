const Joi = require('joi');
const AppError = require('../utils/AppError');

// Validation schemas
const userSchemas = {
    create: Joi.object({
        name: Joi.string()
            .min(3)
            .max(50)
            .required()
            .messages({
                'string.min': 'Name must be at least 3 characters long',
                'string.max': 'Name cannot exceed 50 characters',
                'any.required': 'Name is required'
            }),
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Please provide a valid email address',
                'any.required': 'Email is required'
            })
    }),

    update: Joi.object({
        name: Joi.string()
            .min(3)
            .max(50)
            .messages({
                'string.min': 'Name must be at least 3 characters long',
                'string.max': 'Name cannot exceed 50 characters'
            }),
        email: Joi.string()
            .email()
            .messages({
                'string.email': 'Please provide a valid email address'
            })
    }).min(1).messages({
        'object.min': 'Please provide name or email to update'
    })
};

// Validation middleware factory
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        
        if (error) {
            const errorMessages = error.details.map(detail => detail.message).join(', ');
            return next(new AppError(errorMessages, 400));
        }
        
        next();
    };
};

module.exports = {
    validateUserCreation: validate(userSchemas.create),
    validateUserUpdate: validate(userSchemas.update)
};