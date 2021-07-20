const User=require('../models/user');


module.exports.renderRegisterForm=(req,res)=>{
    res.render('users/register');
    };

 module.exports.registerUser=async(req,res)=>{
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
};

module.exports.renderLoginForm=(req,res)=>{
    res.render('users/login');
    };

module.exports.loginUser=(req,res)=>{
    req.flash('success','Welcome Back!');
    const redirectUrl = req.session.returnTo || '/posts';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logoutUser=(req,res)=>{
    req.logOut();
    req.flash('success','You are sucsessfully logged out!');
    res.redirect('/posts');
};