const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const productSchema = new Schema({
    name: {                    
        type: String,
        required: true,
    },
    code : {
        type : String , 
        required : true 
    },
    description : {
        type : String , 
        required : true
    },
    dimensions:{
        type : String,
        required : true
    },
    using :{
        type : String,
        required : true
    },
    metalAksan :{
        type : String,
        required : true
    },
    ahsabAksan :{
        type : String,
        required : true
    },
    materials :{
        type : String,
        required : true
    },
    price :{
        type : String,
        required : true
    },



    type:{
        type : String,
        required : true
    },
    image:{
        type : String,
        required : true
    },

},{
    timestamps: true
});


var Products = mongoose.model('Products', productSchema);

module.exports = Products;