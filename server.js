const mongoose  = require('mongoose');
const app = require('./index')
require('dotenv').config()
mongoose.set('strictQuery', false);
//mongodb+srv://instagramdb:xthoG0RuqnWqnMtV@cluster0.8v0a0xv.mongodb.net/?retryWrites=true&w=majority
mongoose.connect(process.env.MONGO_URI+process.env.DB_NAME,{family:4},(err)=>{
          if(!err){
            console.log('Node envirnment : ', process.env.NODE_ENV)
            console.log("database connected successfully DataBaseName : ", process.env.DB_NAME);
            app.listen(process.env.PORT || 5000,()=>{
                console.log('App started at port : ',process.env.PORT || 5000)
            })
          }
})