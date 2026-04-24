const mongoose=require("mongoose")
const Product=require("./productsMoldel")

const wishListSchema=new mongoose.Schema({
   productId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Product",
    required:true
   } 
})

const WishList=mongoose.model("wishList",wishListSchema)
module.exports=WishList