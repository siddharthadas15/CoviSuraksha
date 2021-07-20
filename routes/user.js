const express=require('express');
const passport = require('passport');
const router= express.Router();
const User=require('../models/user');
const catchAsync=require('../utils/catchAsync.js');
const users=require('../controllers/user');

router.route('/register')
.get(users.renderRegisterForm)
.post(catchAsync(users.registerUser));

router.route('/login')
.get(users.renderLoginForm)
.post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.loginUser);

router.get('/logout',users.logoutUser);

module.exports=router;