const POST = require('../models/post.model');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { cloudinaryConnecton } = require('../configs/scretKey');
exports.createPost = async (req, res) => {
    const data = {
        title: req.body.title,
        location: req.body.location
    }
    if (req.files.upload) {
     try {
        cloudinary.uploader.upload(req.files.upload.tempFilePath, async (error,result)=>{
            console.log(result)
            data.image = result.secure_url;
            try {
             const post = await POST.create(data)
             post.userId.push(req.userId)
             await post.save()
             return res.status(201).send({
                 message: "Post created successfully!"
             })
         } catch (error) {
             console.log(error.message)
             return res.status(500).send({
                 message: "Internal server error!"
             })
         }
    })
     } catch (error) {
        console.log(error.message)
        return res.status(500).send({
            message: "Internal server error! Image Not Upload."
        })
     }
    }else{
        return res.status(400).send({
            message: "Bad request!"
        })
    }
}

exports.getAllPost = async (req, res) => {
    try {
        const posts = await POST.find({})
        return res.status(200).send({
            posts: posts
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({
            message: "Internal server error!"
        })
    }
}

exports.getPostById = async (req, res) => {
    try {
        const posts = await POST.find({
            userId: req.userId
        })
        return res.status(200).send({
            posts: posts
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({
            message: "Internal server error!"
        })
    }
}
exports.getPostByOtherUserId = async (req, res) => {
    try {
        const posts = await POST.find({
            userId: req.query.id
        })
        return res.status(200).send({
            posts: posts
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({
            message: "Internal server error!"
        })
    }
}

exports.addCommentById = async (req, res) => {
    const body = req.body
    try {
        const post = await POST.findOne({
            _id: body.postId
        })
        post.comment.push(body.comment)
        post.save()
        return res.status(200).send({
            message: "comment add successfully."
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({
            message: "Internal server error"
        })
    }
}

exports.addLikes = async (req, res) => {
    const postid = req.body.postid
    const status = req.body.status
    try {
           const post = await POST.findOne({_id:postid})
           if(status==true){
              post.likes.push(req.userId)
           }else{
              post.likes = post.likes.filter((like)=> like!=req.userId)
           }
        await post.save()
        return res.status(200).send({
            message:"like successfully."
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({
            message: "Internal server error"
        })
    }
}
exports.addSave = async (req, res) => {
    const postid = req.body.postid
    const status = req.body.status
    try {
           const post = await POST.findOne({_id:postid})
           if(status==true){
              post.postSave.push(req.userId)
           }else{
              post.postSave = post.postSave.filter((s)=> s!=req.userId)
           }
        await post.save()
        return res.status(200).send({
            message:"saved successfully."
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({
            message: "Internal server error"
        })
    }
}