const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')

const register = async (req, res)  => {
    const {name, email, password} = req.body

    const emailAlreadyExists = await User.findOne({email})
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists')
    
  }
  // first registered user


const user = await User.create({name,email, password})
res.status(StatusCodes.CREATED).json({user})
}

const login = async (req, res) => {
    res.send('Login user')
    }

const logout = async (req, res) => {
    res.send('logout User')
}

module.exports = {
    register,
    login,
    logout
}