const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const servicesSchema = new Schema({
    name: {                    
        type: String,
        required: true,
    },
    email : {
        type : String , 
        required : true 
    },
    message : {
        type : String , 
        required : true
    },
    type:{
        type : String,
        required : true
    }
},{
    timestamps: true
});


var Services = mongoose.model('Services', servicesSchema);

module.exports = Services;