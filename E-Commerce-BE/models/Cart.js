const mongoose =require("mongoose")
const Product=require("./productsMoldel")

const cartSchema=new mongoose.Schema({
    productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  size:{
    type:String,
    required:true,
    enum:["S","M","L","XL","XXL"]
  }
})

const Cart= mongoose.model("cart",cartSchema)
module.exports=Cart