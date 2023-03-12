const jwt = require('jsonwebtoken')
const key = require('../configs/scretKey')
const multer = require('multer')

exports.isValieduser = (req, res, next) => {
  const token = req.headers.auth;
  jwt.verify(token, key.scretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      })
    }
    req.userId = decoded.userId;
    next()
  })
}
exports.loginBodyValidate = (req, res, next) => {
  if (req.body.data.includes('@')) {
    req.body.email = req.body.data
    next()
  } else if (req.body.data.length == 10) {
    req.body.mobile = req.body.data
    next()
  } else if (req.body.data) {
    req.body.username = req.body.data
    next()
  } else {
    return res.status(400).send({
      message: "Bad request!"
    })
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/profile')
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now().toString() + '-' + Math.floor(Math.random() * 1000)
    cb(null, file.fieldname + uniqueName + '.png')
  }
})
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == 'image/png' || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true)
    } else {
      cb(null, false)
      return cb(new Error("Only .png, .jpg and .jpeg format allowed"))
    }
  }
})
exports.uploadImage = async (req, res, next) => {
  const uploads = upload.single('upload')
  uploads(req, res, (err) => {
    if (err) {
      console.log(err)
    } else {
      next()
    }
  })
}