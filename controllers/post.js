const Post=require('../models/post');
const {cloudinary}=require('../cloudinary');
module.exports.index=async(req,res)=>{
    const posts=await Post.find({});
    res.render('posts/index',{posts});
    }


module.exports.renderNewForm=(req,res)=>{
    res.render('posts/new');
    };


module.exports.createPost=async (req,res,next)=>{
    const post=new Post(req.body.post);
    post.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    post.author=req.user._id;
    await post.save();
    console.log(post);
    req.flash('success','Successfully created a post!');
    res.redirect(`/posts/${post._id}`);
      
    };

module.exports.showPost=async(req,res)=>{
    const post=await Post.findById(req.params.id).populate({path:'reviews',
  populate:{
    path:'author'
  }
}).populate('author');
    if(!post)
      {
          req.flash('error','Cannot find that post');
          return   res.redirect('/posts');
      }
  
  res.render('posts/show',{post});
  };

  module.exports.renderEditForm=async(req,res)=>{
     
    const post=await Post.findById(req.params.id);
   
    if(!post)
    {
        req.flash('error','Cannot find that post');
        return   res.redirect('/posts');
    }
   
  res.render('posts/edit',{post});
  
  };

  module.exports.updatePost=async(req,res)=>{
    const {id}=req.params;
    console.log(req.body);
    const post=await Post.findByIdAndUpdate(id,{...req.body.post});
    const newImages=req.files.map(f => ({ url: f.path, filename: f.filename }));
    post.images.push(...newImages);
    await post.save();
    if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
    }
      await post.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
      
  }
  console.log(post);
    req.flash('success','Successfully updated the post!');
    res.redirect(`/posts/${post._id}`);
    };

module.exports.deletePost=async (req,res)=>{
    const {id}=req.params;
    
    await Post.findByIdAndDelete(id);
    req.flash('success','Post Deleted!');
    res.redirect('/posts');
    };
