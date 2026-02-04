const express = require('express');
const authcontroller = require('../controllers/auth.controller')
const { checkUser } = require('../validators/token.validator')

const userRoutes = express.Router();

userRoutes.post('/register', checkUser, authcontroller.signup);
userRoutes.post('/signin', authcontroller.signin);

module.exports = userRoutes;