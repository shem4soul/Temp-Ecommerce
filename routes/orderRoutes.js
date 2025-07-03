const express = require('express');
const router = express.Router();
const {
    authenticateUser,
    authorizePermissions,
} = require('../middleware/authentication');

const {
    createOrder,
    getSingleOrder,
    getCurrentUserOrders,
    getAllOrders,
    updateOrder,    
} = require('../controllers/orderControllers'); 


router.route('/').post(authenticateUser, createOrder)
