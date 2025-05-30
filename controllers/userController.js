const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');   
const CustomError = require('../errors');


const getAllUsers = async (req, res) => {
const users = await User.find({role:'user'}).select('-password'); // Exclude password field
  if (!users) {
    throw new CustomError.NotFoundError('No users found');
  }
  res.status(StatusCodes.OK).json({ users, count: users.length });
}

const getSingleUser = async (req, res) => {
 const user = await User.findOne({_id: req.params.id}).select('-password'); // Exclude password field
 if (!user) {
    throw new CustomError.NotFoundError(`No user found with id: ${req.params.id}`);
  }
  res.status(StatusCodes.OK).json({ user });  
}

const showCurrentUser = (req, res) => {
  res.send('show current user');
}   

const updateUser = (req, res) => {
  res.send('update user');
}       

const updateUserPassword = (req, res) => {
  res.send(req.body)
}   

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword
}   