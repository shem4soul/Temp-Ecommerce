const CustomErr = require('../errors');
const { isTokenValid } = require('../utils');


const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token
    
    if(!token) {
      throw new CustomErr.UnauthenticatedError('Authentication Invalid'); 
                  
    }
    try {
        const payload = isTokenValid({ token });
       console.log(payload);
       next();
        
    } catch (error) {
        throw new CustomErr.UnauthenticatedError('Authentication Invalid');
    }
      
    
}


module.exports = {
    authenticateUser
}