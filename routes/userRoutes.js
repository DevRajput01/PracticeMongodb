const express = require('express');
const userController = require('../controllers/userController');
const { validateUserCreation, validateUserUpdate } = require('../middleware/validationMiddleware');
const validateObjectId = require('../middleware/idValidationMiddleware');

const router = express.Router();

// User routes
router
    .route('/')
    .get(userController.getAllUsers)
    .post(validateUserCreation, userController.createUser);

router
    .route('/:id')
    .all(validateObjectId) // Apply ID validation to all routes with :id parameter
    .get(userController.getUser)
    .put(validateUserUpdate, userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;