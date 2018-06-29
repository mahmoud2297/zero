const mongoose = require('mongoose');
const Schema = mongoose.Schema;





const contactSchema = new Schema({
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


var Contact= mongoose.model('Contact', contactSchema);

module.exports = Contact;