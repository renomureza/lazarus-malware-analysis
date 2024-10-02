const mongoose = require('mongoose');

module.exports = async function(){
    mongoose.connect(process.env.MONGODB_URI, {
   
    }).then(console.log('MongoDB connected')).catch ((error)=>{
      console.error('MongoDB connection error:', error);
      process.exit(1);
      }); 
};
