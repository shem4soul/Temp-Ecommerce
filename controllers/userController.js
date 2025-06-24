const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');   
const CustomError = require('../errors');


const getAllUsers = async (req, res) => {
  console.log(req.user);
  
const users = await User.find({role:'user'}).select('-password'); 
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
  res.status(StatusCodes.OK).json({ user: req.user }); // Assuming req.user is set by authentication middleware
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