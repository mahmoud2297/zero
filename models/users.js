
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    name : {
        type : String,
        default : " ",
    },
    username:{
        type : String,
        required : true ,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    email : {
        type : String , 
        required : true,
        unique : true
    },
    phone : {
        type : Number ,
        required : true 
    },
    country : {
        type : String ,
        required : true 
    },
    photo : {
        type : String , 
        required : true
    },
    admin:   {
        type: Boolean,
        default: false
    },
    resetPasswordToken  : {
        type : String 
    },
    resetPasswordExpires :{
        type : String 
    },
    facebookId : String
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);