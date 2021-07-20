const express=require('express');
const passport = require('passport');
const router= express.Router();
const User=require('../models/user');
const catchAsync=require('../utils/catchAsync.js');


router.get('/register',(req,res)=>{
res.render('users/register');
});

router.post('/register',catchAsync(async(req,res)=>
{
    try{
const {username,password,email}=req.body;
const user=new User({email,username});
const registeredUser= await User.register(user,password);
console.log(registeredUser);
req.login(registeredUser,(err)=>{
    if(err) return next(err);
    req.flash('success','Welcome to CoviSuraksha');
    res.redirect('/posts');
})

    }
    catch(e)
    {
        req.flash('error',e.message);
        res.redirect('/register');
    }
}));

router.get('/login',(req,res)=>{
res.render('users/login');
});

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    req.flash('success','Welcome Back!');
    const redirectUrl = req.session.returnTo || '/posts';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.get('/logout',(req,res)=>{
    req.logOut();
    req.flash('success','You are sucsessfully logged out!');
    res.redirect('/posts');
})

module.exports=router;