const express=require('express');
const router=express.Router({mergeParams:true});
const ExpressError=require('../utils/ExpressError');
const catchAsync=require('../utils/catchAsync.js');
const Post=require('../models/post');
const {reviewSchema}=require('../schemas.js');
const Review=require('../models/review');

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

router.post('/',validateReview,catchAsync(async(req,res)=>{
    const {id}=req.params;
    const post = await Post.findById(id);
    const review=new Review(req.body.review);
    post.reviews.push(review);
    await review.save();
    await post.save();
    req.flash('success','Created New Review');
    res.redirect(`/posts/${id}`);
    }));
    
router.delete('/:reviewId',catchAsync(async(req,res)=>{
    const {id,reviewId}=req.params;
    await Post.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndRemove(reviewId);
    req.flash('success','Review Deleted!');
    res.redirect(`/posts/${id}`);
    
    }));


module.exports=router;
    