const mongoose=require('mongoose');
const Schema=mongoose.Schema;


const PostSchema=new Schema({
title:String,
description:String,
location:String
});



module.exports=mongoose.model('Post',PostSchema);