const express=require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const Post=require('./models/post');
const ExpressError=require('./utils/ExpressError');
const catchAsync=require('./utils/catchAsync.js');
const {postSchema}=require('./schemas.js');

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


const validatePost= (req,res,next)=>{
  //   console.log(req.body.post);
//  if(!req.body.post)
//  throw new ExpressError('Invalid Post Data',400);

const {error}=postSchema.validate(req.body);
if(error)
{
  const msg=error.details.map(el=>el.message).join(',');
  throw new ExpressError(msg,400);
}
else
next();
}


app.get('/',(req,res)=>{
res.render('home');
});

app.get('/posts',catchAsync(async(req,res)=>{
const posts=await Post.find({});
res.render('posts/index',{posts});
}));


app.get('/posts/new',(req,res)=>{
    res.render('posts/new');
    });

app.get('/posts/:id',catchAsync(async(req,res)=>{
  const post=await Post.findById(req.params.id);
res.render('posts/show',{post});

}));


app.post('/posts',validatePost,catchAsync(async (req,res,next)=>{

const post=new Post(req.body.post);
await post.save();
res.redirect(`/posts/${post._id}`);
  
}));


app.get('/posts/:id/edit',catchAsync(async(req,res)=>{
    const post=await Post.findById(req.params.id);
  res.render('posts/edit',{post});
  
  }));


app.put('/posts/:id',validatePost,catchAsync(async(req,res)=>{
const {id}=req.params;
const post=await Post.findByIdAndUpdate(id,{...req.body.post});
res.redirect(`/posts/${post._id}`);
}));



app.delete('/posts/:id',catchAsync(async (req,res)=>{
const {id}=req.params;
await Post.findByIdAndDelete(id);
res.redirect('/posts');
}));

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