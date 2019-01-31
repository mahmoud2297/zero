var express = require('express');
var userRouter = express.Router();
const bodyParser = require('body-parser');
var passport = require('passport');
var User = require('../models/users');
var authenticate = require("../authenticate")
const cors = require('./cors');
const multer = require('multer');
var crypto = require("crypto");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/users'); 
    },

    filename: (req, file, cb) => {
        cb(null,  Math.random() +file.originalname)
    }
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFileFilter});



userRouter.route('/upload')
.options(cors.cors, (req, res) => { res.sendStatus(200); })
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})
.post(cors.corsWithOptions,upload.single('imageFile'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file.path);
})

userRouter.use(bodyParser.json());
/* GET users listing. */
userRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions ,authenticate.verifyUser,authenticate.verifyAdmin, function(req, res, next) {
    User.find({})
    .then((users)=>{
      if(users){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
      }else{

      }
    }).catch(err => next(err))
});

userRouter.route('/signup')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions , (req, res, next) => {
  User.register(new User(
    {
    name: req.body.name , 
    username : req.body.username ,
    password : req.body.password,
    email : req.body.email,
    admin : req.body.admin,
    image : req.body.image,
    }), 
    req.body.password, (err, user) => {
      console.log("the body is : " + JSON.stringify(req.body))
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      console.log("error occured" + JSON.stringify(err))
      res.json(JSON.stringify(err));
    }
    else {
      console.log("the body is : " + JSON.stringify(req.body))
      if (req.body.firstname)
        user.firstname = req.body.firstname;
      if (req.body.lastname)
        user.lastname = req.body.lastname;
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return  false;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      });
    }
  });
}); 

userRouter.route("/resetAdmin/:id")
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .post( cors.corsWithOptions, (req, res, next) => {
    User.findOne(req.params._id).then((user)=>{
      if(!user){
        return res.json("no user exist with this username")
      }
      user.firstname = req.body.firstname;
      user.lastname = req.body.lastname;
      user.residence = req.body.residence;
      user.phone = req.body.phone;
      user.country = req.body.country;
      user.age = req.body.age;
      user.email = req.body.email;
      user.education = req.body.education;
      user.gender = req.body.gender;
      user.admin = req.body.admin;
      user.photo = req.body.photo;
      user.password = req.body.password;
      user.setPassword(req.body.password, function(err) {
        user.save(function(err) {
          req.logIn(user, function(err) {
            if(user){
              user.password = req.body.password;
              res.json(user);
            }else{
              res.json(err);
            }
          });
      })
    })
  })
  })

  userRouter.route("/resetuser/:id")
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .post( cors.corsWithOptions, (req, res, next) => {
    User.findOne(req.params._id).then((user)=>{
      if(!user){
        return res.json("no user exist with this username")
      }
      user.firstname = req.body.firstname;
      user.lastname = req.body.lastname;
      user.residence = req.body.residence;
      user.phone = req.body.phone;
      user.country = req.body.country;
      user.age = req.body.age;
      user.email = req.body.email;
      user.education = req.body.education;
      user.gender = req.body.gender;
      user.admin = req.body.admin;
      user.photo = req.body.photo;
      user.password = req.body.password;
      user.setPassword(req.body.password, function(err) {
        user.save(function(err) {
          req.logIn(user, function(err) {
            if(user){
              user.password = req.body.password;
              res.json(user);
            }else{
              res.json(err);
            }
          });
      })
    })
  })
  })
  
userRouter.route('/login')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .post( cors.corsWithOptions, (req, res, next) => {
    User.findOne({email : req.body.email}).then((user)=>{
      req.body.username = user.username;
      console.log("the user of the request is :"  + JSON.stringify(req.body) )
      console.log("the user data is :"  + JSON.stringify(user) );
      passport.authenticate('local', (err, user, info) => {
        if(user.admin ===true){
          req.logIn(user, (err) => {
            console.log("the user is :" + user)
            if (err) {
              res.statusCode = 401;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!'});          
            }
            var token = authenticate.getToken({_id: req.user._id});
            var _id = req.user._id;
            var username = user.username;
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'Login Successful!', token: token , _id : _id , username : username  });
          }); 
        }else if(err){    
          console.log("err ____________________________________")  
          return next(err);
        }else if (!user) {
          console.log("user ____________________________________")  
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          res.end( 'Login Unsuccessful!');
        }else{
          console.log("else ____________________________________") 
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false, status: 'Login Unsuccessful!', err: info});
        }
      }) (req, res, next);
    })
  });



userRouter.route('/loginAdmin')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .post( cors.corsWithOptions, (req, res, next) => {
      User.findOne(req.params.username).then((user)=>{
        console.log("the user of the request is :"  + JSON.stringify(req.body) )
        console.log("the user data is :"  + JSON.stringify(user) );
        passport.authenticate('local', (err, user, info) => {
          if(user.admin ===true){
            req.logIn(user, (err) => {
              console.log("the user is :" + user)
              if (err) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!'});          
              }
              var token = authenticate.getToken({_id: req.user._id});
              var _id = req.user._id;
              var username = user.username;
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: true, status: 'Login Successful!', token: token , _id : _id , username : username  });
            }); 
          }else if(err){    
            console.log("err ____________________________________")  
            return next(err);
          }else if (!user) {
            console.log("user ____________________________________")  
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end( 'Login Unsuccessful!');
          }else{
            console.log("else ____________________________________") 
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, status: 'Login Unsuccessful!', err: info});
          }
        }) (req, res, next);
      })
    });
  userRouter.route('/loginUser')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .post( cors.corsWithOptions, (req, res, next) => {
      User.findOne({email : req.body.email}).then((user)=>{
       // console.log("the user of the request is :"  + JSON.stringify(req.body) )
        console.log("the user finded email is :"  + JSON.stringify(user) );
        passport.authenticate('local-login', (err, user, info) => {
          if(err){    
            console.log("err ____________________________________")  
            return next(err);
          }else if (!user) {
            console.log("user ____________________________________")  
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end( 'Login Unsuccessful!');
          }else{
            console.log("else ____________________________________") 
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, status: 'Login Unsuccessful!', err: info});
          }
        }) (req, res, next);
      })
    });
     
userRouter.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if (req.user) {
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
  }
});
userRouter.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

userRouter.get('/checkJWTToken', cors.corsWithOptions, (req, res) => {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if (err)
      return next(err);
    
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT invalid!', success: false, err: info});
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT valid!', success: true, user: user});

    }
  }) (req, res);
});
userRouter.route('/:scholarId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
  User.findById(req.params.scholarId)
  .populate('comments.author')
      .then((user) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(user);
      }, (err) => next(err))
      .catch((err) => next(err));
  })

  .post(cors.corsWithOptions, (req, res, next) => {
     res.statusCode = 403;
     res.end('POST operation not supported on /Scholarships/'
        + req.params.scholarId);
  })
  .put( cors.corsWithOptions, (req, res, next) => {
    User.findByIdAndUpdate(req.params.scholarId, {
      $set: req.body
    }, {
          new: true
      })
      .then((user) => {
          console.log('scholarship updated: ', user);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(user);
      }, (err) => next(err))
      .catch((err) => {
        console.log("error ")
          next(err)
        });
    })
    .delete( cors.corsWithOptions, (req, res, next) => {
     User.findByIdAndRemove(req.params.scholarId)
         .then((resp) => {
             res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(resp);
              }, (err) => next(err))
              .catch((err) => next(err));
    })

    userRouter.route('/profiles/:username')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
      User.findOne({"username" : req.params.username})
      .populate('comments.author')
          .then((user) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(user);
          }, (err) => next(err))
          .catch((err) => next(err));
      })
      
module.exports = userRouter ;
