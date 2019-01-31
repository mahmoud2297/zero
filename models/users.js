
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    name : {
        type : String,
        default : " "
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
    admin:   {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        required: true
    }

});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);