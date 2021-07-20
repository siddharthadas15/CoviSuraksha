const express=require('express');
const router=express.Router({mergeParams:true});
const ExpressError=require('../utils/ExpressError');
const catchAsync=require('../utils/catchAsync.js');
const Post=require('../models/post');
const Review=require('../models/review');
const {validateReview,isLoggedIn,isReviewAuthor}=require('../middleware');
const reviews=require('../controllers/reviews');


router.post('/',isLoggedIn,validateReview,catchAsync(reviews.createReview));
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview));


module.exports=router;
    