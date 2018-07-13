const mongoose = require('mongoose');
const Schema = mongoose.Schema;





const orderSchema = new Schema({
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


var Order= mongoose.model('Order', orderSchema);

module.exports = Order;