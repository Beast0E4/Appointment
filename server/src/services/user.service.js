const User = require('../models/user.model')
const bcrypt = require('bcrypt');

const createUser = async(data) => { 
    const response  = {};

    try {
        let user = await User.findOne({ email: data.email });
        if (user) {
            response.error = "Email already exists";
            return response;
        }

        if (!data.email) {
            response.error = "Please start sign up again";
            return response;
        }

        const res = await User.create (data);
        response.user = res;

        return response;
    } catch (error) {
        response.error = error.message;
        return response ; 
    }
};

const validateUser = async (email, password) => {
    const response = {};
    try {
        let res = await User.findOne({ email });

        if (!res) {
            response.error = "Invalid email";
            return response;
        }

        const passwordsMatch = bcrypt.compareSync (password, res.password);

        if (!passwordsMatch) {
            response.error = "Invalid password";
            return response;
        }

        response.userData = res;

        return response;
    } catch (error) {
        response.error = error.message;
        return response;
    }
};

module.exports = {
    createUser,
    validateUser,
}
