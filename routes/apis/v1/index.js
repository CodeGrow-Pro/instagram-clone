const express = require('express');
const { createPost, getAllPost, getPostById, getPostByOtherUserId, addCommentById, addLikes, addSave } = require('../../../controllers/post.controller');
const userController = require('../../../controllers/user.controller')
const authMiddleware = require('../../../middleware/authValidate.middleware')
const {loginBodyValidate} = require('../../../middleware/authValidate.middleware')

const route = express.Router();
//-------------------------------signup routes || login routes----------------
route.post('/signup',loginBodyValidate,userController.signup)
route.post('/login',loginBodyValidate,userController.login);
//---------------------------------------user find -------------------------------
route.get('/user/filter',authMiddleware.isValieduser,userController.filter);
route.put('/user/update',authMiddleware.isValieduser,authMiddleware.uploadImage,userController.UpdateUser)
route.get('/user/find',authMiddleware.isValieduser,userController.getUser);
route.put('/user/follow',authMiddleware.isValieduser,userController.follow)
//---------------------------------------POSTS -----------------------------------------
route.post('/post/create',authMiddleware.isValieduser,authMiddleware.uploadImage,createPost)
route.get('/post/fetch',authMiddleware.isValieduser,getAllPost)
route.get('/post/find',authMiddleware.isValieduser,getPostById)
route.get('/post/friend',authMiddleware.isValieduser,getPostByOtherUserId)
route.put('/post/add-comment',authMiddleware.isValieduser,addCommentById)
route.put('/post/like',authMiddleware.isValieduser,addLikes);
route.put("/post/save",authMiddleware.isValieduser,addSave)
module.exports = route;