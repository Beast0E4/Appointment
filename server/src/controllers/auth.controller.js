const userService = require('../services/user.service');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken')

const signup = async(req,res) =>  {
        const response  = await userService.createUser(req.body);

        if(response.error){
            return res.status(StatusCodes.BAD_REQUEST).send({
                message : "Signup failed",
                error : response.error
            })
        }

        const token = jwt.sign({ id : response.userData.id, roles: response.userData.roles } , process.env.secret_key);

        return res.status(StatusCodes.CREATED).send({
            message : "Successfully created the account",
            userData: response.userData,
            token
        })
};

const signin = async(req,res) => {
    const response = await userService.validateUser(req.body.email,req.body.password);
    
    if (response.error) {
        return res.status(StatusCodes.BAD_REQUEST).send({
            message:"Login failed",
            error : response.error
        })
    }

    const token = jwt.sign({ id : response.userData.id, roles: response.userData.roles } , process.env.secret_key);

    return res.status(StatusCodes.OK).json({
        message : "Successfully Login",
        userData : response.userData,
        token : token,
    })
}

module.exports = {
    signup,
    signin,
}