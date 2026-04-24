const mongoose=require("mongoose")

require("dotenv").config()

const mongoUri=process.env.MONGOURL

const dbConnect=async()=>{
    try {
        if (!mongoUri) {
            throw new Error("MONGOURL is missing in the backend .env file")
        }
        await mongoose.connect(mongoUri)
        console.log("connection successfull")
    } catch (error) {
        console.error("error",error)
        throw error
    }
}

module.exports={dbConnect}
