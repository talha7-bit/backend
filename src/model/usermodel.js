import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema=new mongoose.Schema({
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
    appointments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"appointments"
    }],
    image:{
        type:String,
        required:true
    }
})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()

        this.password=await bcrypt.hash(this.password,10)
        next()
})

export const User=mongoose.model("User",userSchema)