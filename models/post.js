const mongoose=require('mongoose');
const Review=require('./review');
const Schema=mongoose.Schema;


const PostSchema=new Schema({
title:String,
image:String,
description:String,
location:String,
reviews:[
    {
        type: Schema.Types.ObjectId,
        ref:'Review'
    }
]
});

PostSchema.post('findOneAndDelete',async function(doc){
if(doc)
{
await Review.deleteMany({
    _id:{
        $in:doc.reviews
    }
})
}
});

module.exports=mongoose.model('Post',PostSchema);