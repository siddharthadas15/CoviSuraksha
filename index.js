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
const helmet=require('helmet');
const ejsMate=require('ejs-mate');
const passport=require('passport');
const mongoSanitize = require('express-mongo-sanitize');
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

const MongoDBStore = require("connect-mongo")(session);
const dbUrl=process.env.DB_URL||'mongodb://localhost:27017/CoviSuraksha';
//'mongodb://localhost:27017/CoviSuraksha'
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true })

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
app.use(mongoSanitize());
app.use(helmet());


const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com/", 
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com/", 
];
const connectSrcUrls = [
  "https://api.maptiler.com/", 
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: [],
          connectSrc: ["'self'", ...connectSrcUrls],
          scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
          styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
          workerSrc: ["'self'", "blob:"],
          objectSrc: [],
          imgSrc: [
              "'self'",
              "blob:",
              "data:",
              "https://res.cloudinary.com/sd15/", 
              "https://api.maptiler.com/",
              "https://images.unsplash.com/",
              "https://images.pexels.com/photos/3786124/pexels-photo-3786124.jpeg",
              "https://images.pexels.com/photos/3786120/pexels-photo-3786120.jpeg",
              "https://www.hnl.physio/wp-content/uploads/2020/04/rm208batch7-adj-11.png"
          ],
          fontSrc: ["'self'", ...fontSrcUrls],
      },
  })
);

const secret=process.env.SECRET||'#2467#9090*/324##configsessionuid15';

const store = new MongoDBStore({
  url: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60
});


store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e)
})

const sessionConfig={
  store,
  name:'azy1HlAkX367nKq',
  secret,
  // secure:true,
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
// console.log(req.query);
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

const PORT=process.env.PORT||3000;

app.listen(PORT,()=>{
console.log('Server Started!!!');
});