const express=require('express');
const router=express.Router();
const ExpressError=require('../utils/ExpressError');
const catchAsync=require('../utils/catchAsync.js');
const Post=require('../models/post');
const {postSchema}=require('../schemas.js');

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



router.get('/',catchAsync(async(req,res)=>{
    const posts=await Post.find({});
    res.render('posts/index',{posts});
    }));
    
    
    router.get('/new',(req,res)=>{
        res.render('posts/new');
        });
    
    router.get('/:id',catchAsync(async(req,res)=>{
      const post=await Post.findById(req.params.id).populate('reviews');
      if(!post)
        {
            req.flash('error','Cannot find that post');
            return   res.redirect('/posts');
        }
    
    res.render('posts/show',{post});
    }));
    
    
    router.post('/',validatePost,catchAsync(async (req,res,next)=>{
    
    const post=new Post(req.body.post);
    await post.save();
    req.flash('success','Successfully created a post!');
    res.redirect(`/posts/${post._id}`);
      
    }));
    
    
    router.get('/:id/edit',catchAsync(async(req,res)=>{
        const post=await Post.findById(req.params.id);
        if(!post)
        {
            req.flash('error','Cannot find that post');
            return   res.redirect('/posts');
        }
    
      res.render('posts/edit',{post});
      
      }));
    
    
    router.put('/:id',validatePost,catchAsync(async(req,res)=>{
    const {id}=req.params;
    const post=await Post.findByIdAndUpdate(id,{...req.body.post});
    req.flash('success','Successfully updated the post!');
    res.redirect(`/posts/${post._id}`);
    }));
    
    
    
    router.delete('/:id',catchAsync(async (req,res)=>{
    const {id}=req.params;
    await Post.findByIdAndDelete(id);
    req.flash('success','Post Deleted!');
    res.redirect('/posts');
    }));
    

    module.exports=router;