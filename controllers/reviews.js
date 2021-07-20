const Review=require('../models/review');
const Post=require('../models/post');
module.exports.createReview=async(req,res)=>{
    const {id}=req.params;
    const post = await Post.findById(id);
    const review=new Review(req.body.review);
    review.author=req.user._id;
    post.reviews.push(review);
    await review.save();
    await post.save();
    req.flash('success','Created New Review');
    res.redirect(`/posts/${id}`);
    };

module.exports.deleteReview=async(req,res)=>{
    const {id,reviewId}=req.params;
    await Post.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndRemove(reviewId);
    req.flash('success','Review Deleted!');
    res.redirect(`/posts/${id}`);
    
    };