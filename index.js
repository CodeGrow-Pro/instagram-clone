const express = require('express');
const bodyParser = require('body-parser')
const routers = require('./routes/apis/index')
const cors = require('cors');
const fileUpload = require('express-fileupload');
const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());
app.use(cors({
    origin:'*'
}))
app.get('/',(req,res)=>{
    return res.status(200).send("welcome to instagram clone app");
})
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/uploads/'
}));
app.use('/instagram',routers);

module.exports = app;

