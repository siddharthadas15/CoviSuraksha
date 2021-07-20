if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}


const express=require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const flash=require('connect-flash');
const session=require('express-session');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const Post=require('./models/post');
const Review=require('./models/review');
const ExpressError=require('./utils/ExpressError');
const catchAsync=require('./utils/catchAsync.js');
const {postSchema,reviewSchema}=require('./schemas.js');
const postRoutes=require('./routes/posts');
const reviewRoutes=require('./routes/reviews');
const userRoutes=require('./routes/user');
const User=require('./models/user');

mongoose.connect('mongodb://localhost:27017/CoviSuraksha', { useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true })

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',()=>{
  console.log('Database Connected!!!');
});



app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));

const sessionConfig={
  secret:'#2467#9090*/324##configsessionuid15',
  resave:false,
  saveUninitialized:true,
  cookie:{
    httpOnly:true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
res.locals.currentUser=req.user;
res.locals.success=req.flash('success');
res.locals.error=req.flash('error');
next();
});


const validatePost= (req,res,next)=>{
 
const {error}=postSchema.validate(req.body);
if(error)
{
  const msg=error.details.map(el=>el.message).join(',');
  throw new ExpressError(msg,400);
}
else
next();
}

const validateReview= (req,res,next)=>{
  console.log(req.body);
  const {error}=reviewSchema.validate(req.body);
  if(error)
  {
    const msg=error.details.map(el=>el.message).join(',');
    throw new ExpressError(msg,400);
  }
  else
  next();
  }
  
app.use('/posts',postRoutes);
app.use('/posts/:id/reviews',reviewRoutes);
app.use('/',userRoutes);
app.get('/',(req,res)=>{
res.render('home');
});





app.all('*',(req,res,next)=>
{
next(new ExpressError('Page Not Found',404));
});


app.use((err,req,res,next)=>{
  const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
});



app.listen('3000',()=>{
console.log('Server Started!!!');
});