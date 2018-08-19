const mongoose = require('mongoose');
const Schema = mongoose.Schema;





const productOrderSchema = new Schema({
    name: {                    
        type: String,
        required: true,
    },
    email : {
        type : String , 
        required : true 
    },
    phone : {
        type : String , 
        required : true 
    },
    address : {
        type : String , 
        required : true
    },
    number:{
        type : String,
        required : true
    },
    woodColor :{
        type : String,
        required : true
    },
    metalColor :{
        type : String,
        required : true
    }
},{
    timestamps: true
});


var productOrder= mongoose.model('productOrder', productOrderSchema);

module.exports = productOrder;