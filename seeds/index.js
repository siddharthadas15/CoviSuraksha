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
           author:'60c24182e73ef05fc89f28ba',
           title: `${sample(descriptors)} ${sample(places)}`,
           images: [
            {
                url: 'https://res.cloudinary.com/sd15/image/upload/v1623441694/CoviSuraksha/jvws1yewir3ivtkk541r.jpg',
                filename: 'CoviSuraksha/jvws1yewir3ivtkk541r'
              },
              {              
                url: 'https://res.cloudinary.com/sd15/image/upload/v1623441695/CoviSuraksha/p3lqwmj7h1siik0on5xx.jpg',
                filename: 'CoviSuraksha/p3lqwmj7h1siik0on5xx'
              }
          
        ],
           description:'  Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam, voluptates deleniti illum omnis autem labore numquam consequuntur ad alias id vitae! Unde, minima harum. Temporibus repellat perferendis cupiditate ipsum nemo?'
           
           
       });
       await post.save();
   }
}

seedDB().then(()=>{
mongoose.connection.close();
});

