const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    like: {
        type: Number,
    },
    image: {
        type: Buffer
    },
    comment: {
        type: [],
    },
    location: {
        type: String
    },
    userId:{
        type:[mongoose.SchemaTypes.ObjectId],
        refs:"user"
    },
    likes:{
        type:[mongoose.SchemaTypes.ObjectId],
        refs:"user"
    },
    postSave :{
        type:[mongoose.SchemaTypes.ObjectId],
        refs:"user"
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
const postModel = mongoose.model('post', postSchema);
module.exports = postModel