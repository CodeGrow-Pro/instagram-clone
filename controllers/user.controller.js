const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const key = require('../configs/scretKey')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2
const { cloudinaryConnecton } = require('../configs/scretKey');
const fs = require('fs')
const {
    signup
} = require('../helpers/user.helper')
exports.signup = async (req, res) => {
    if (!signup.isValiedBody(req.body)) {
        return res.status(400).send({
            message: "Please Provide all required fields  !Bad request!"
        })
    }
    const data = {
        username: req.body.username,
        name: req.body.name,
        password: bcrypt.hashSync(req.body.password, 9),
    };
    if (req.body.email) {
        data.email = req.body.email
    }
    if (req.body.mobile) {
        data.mobile = req.body.mobile
    }
    try {
        const user = await userModel.create(data);
        return res.status(201).send({
            message: "Signup successfully!"
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({
            message: "Internal server error!"
        })
    }
}
exports.login = async (req, res) => {
    const data = req.body;
    let findReq = {}
    if (data.username) {
        findReq.username = data.username
    }
    if (data.mobile) {
        findReq.mobile = data.mobile
    }
    if (data.email) {
        findReq.email = data.email
    }
    try {
        const user = await userModel.findOne(findReq);
        if (!user) {
            return res.status(404).send({
                message: "user does not exists!"
            })
        }
        const isValied = bcrypt.compareSync(data.password, user.password);
        if (!isValied) {
            return res.status(401).send({
                message: "Invalied Password!"
            })
        }
        const token = jwt.sign({
            userId: user._id
        }, key.scretKey, {
            expiresIn: '1d'
        })
        return res.status(200).send({
            message: "login successfully",
            userId:user._id,
            accessToken: token
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({
            message: "Internal server error!"
        })
    }
}
exports.filter = async (req, res) => {
    const find = {};
    if (req.query.id) {
        find._id = req.query.id
    }
    if (req.query.name) {
        find.name = {
            $regex: req.query.name
        }
    }
    try {
        const finded = await userModel.find(find);
        const user = finded.filter((us)=>us._id!=req.userId)
        return res.status(200).send({
            users: user
        })
    } catch (err) {
        return res.status(500).send({
            message: "internal server error!"
        })
    }
}

exports.getUser = async (req, res) => {
    try {
        const finded = await userModel.findOne({
            _id: req.userId
        });
        if (!finded) {
            return res.status(404).send({
                message: "user does not exists!"
            })
        }
        const data = {
            _id: finded._id,
            username: finded.username,
            name: finded.name,
            email: finded.email,
            avtar:finded.avtar,
            mobile:finded.mobile,
            followers:finded.followers,
            following:finded.following,
            postSaved:finded.postSaved
        }
        return res.status(200).send({
            users: data
        })
    } catch (err) {
        return res.status(500).send({
            message: "internal server error!"
        })
    }
}

exports.UpdateUser = async (req, res) => {
    const body = req.body;
    const reqData = {}
    if(body.username){
        reqData.username=body.username
    }
    if(body.name){
        reqData.name=body.name
    }
    if(body.email){
        reqData.email = body.email
    }
    if(body.mobile){
        reqData.mobile = body.mobile
    }
    if(req.files.upload){
        cloudinary.uploader.upload(req.files.upload.tempFilePath, async (error,result)=>{
            reqData.avtar=result.secure_url
            try {
                const user = await userModel.findOneAndUpdate({
                    _id: req.userId
                }, reqData)
                return res.status(200).send({
                    message: "User update successfully!"
                })
            } catch (err) {
                console.log(err.message)
                return res.status(500).send({
                    message: "internal server error!"
                })
            }
        }
        )
    }

}

exports.follow = async (req,res)=>{
    const followingId=req.query.id
    try {
          var user = await  userModel.findOne({_id:req.userId});
          var userFollowing = await userModel.findOne({_id:followingId})
          let status = false
          if(req.query.status=="false"){
            user.following.push(followingId)
            userFollowing.followers.push(req.userId)
            status = true
          }else{
            const dataUnFollow = user.following.filter((us)=>us._id!=followingId)
            const dataUnFollower = userFollowing.followers.filter((us)=>us._id!=req.userId)
            user.following = dataUnFollow
            userFollowing.followers = dataUnFollower
            status = false;
          }
          await user.save()
          await userFollowing.save()
          return res.status(200).send({
            message:"follow successfully.",
            status:status
          })
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({
            message: "internal server error!"
        })
    }
}