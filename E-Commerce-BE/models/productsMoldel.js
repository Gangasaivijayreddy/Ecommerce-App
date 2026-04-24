const mongoose=require("mongoose")

const productsSchema=new mongoose.Schema({
    productName:{
        type:String,
        required:true,
        trim:true,
    },
    fullDetails:{
        type:String,
        required:true,
        trim:true,

    },
    imgUrl:{
        type:String,
        required:true,
        trim:true,
    },
    rating:{
        type:Number,
        trim:true,
    },
    price:{
        type:Number,
        trim:true,
        required:true,
    },
    discount:{
        type:Number,
        trim:true,
    },
    description:{
        type:[String],
        required:true
    },
    category:{
        type:String,
        enum:["men","women","kids"]
    }

},{timestamps:true})

const Product=mongoose.model("Product",productsSchema)

module.exports=Product