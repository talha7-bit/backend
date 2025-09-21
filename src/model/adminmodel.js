import mongoose from "mongoose";
import bcrypt from "bcrypt"

const adminSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
    },
   
})

adminSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()

        this.password=await bcrypt.hash(this.password,10)
        next()
})

export const Admin=mongoose.model("Admin",adminSchema)