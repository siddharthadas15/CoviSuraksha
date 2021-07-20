const mongoose=require('mongoose');
const cities=require('./cities');
const Post=require('../models/post');
const {places,descriptors}=require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/CoviSuraksha', { useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true })

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',()=>{
  console.log('Database Connected!!!');
});


const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async ()=>{
    await Post.deleteMany({});
   for(let i=0;i<50;i++)
   {
       const random1000=Math.floor(Math.random()*1000);
       const post=new Post({
           location:`${cities[random1000].city}, ${cities[random1000].state}`,
           title: `${sample(descriptors)} ${sample(places)}`
       });
       await post.save();
   }
}

seedDB().then(()=>{
mongoose.connection.close();
});

