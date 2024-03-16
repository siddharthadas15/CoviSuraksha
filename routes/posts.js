const express=require('express');
const router=express.Router();
const catchAsync=require('../utils/catchAsync.js');
const Post=require('../models/post');
const posts=require('../controllers/post');
const multer  = require('multer')
const {storage}=require('../cloudinary');
const upload=multer({storage});

const {isLoggedIn,validatePost,isAuthor}=require('../middleware.js');


router.route('/')
.get(catchAsync(posts.index))
.post(isLoggedIn,upload.array('image'),validatePost,catchAsync(posts.createPost));

router.get('/new',isLoggedIn,posts.renderNewForm);

router.route('/:id')
.get(catchAsync(posts.showPost))
.put(isLoggedIn,isAuthor,upload.array('image'),validatePost,catchAsync(posts.updatePost))
.delete(isLoggedIn,isAuthor,catchAsync(posts.deletePost));

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(posts.renderEditForm));
    
module.exports=router;
