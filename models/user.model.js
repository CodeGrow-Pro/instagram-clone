const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique:true
    },
    name: {
        type: String,
        required: true
    },
    avtar:{
        type:String
    },
    email: {
        type: String,
        unique: true,
    },
    mobile: {
        type: String,
        default:""
    },
    password: {
        type: String,
        required: true,
    },
    following:{
        type:[mongoose.SchemaTypes.ObjectId]
    },
    followers:{
            type:[mongoose.SchemaTypes.ObjectId]
    },
    postSaved:{
        type:[mongoose.SchemaType.ObjectId],
        refs:"post"
    },
    createdAt: {
        type: String,
        default: () => {
            return Date.now();
        },
        immutable: true
    },
    updatedAt: {
        type: String,
        default: () => {
            return Date.now()
        }
    }
})
const userModel = mongoose.model('user', userSchema);
module.exports = userModel