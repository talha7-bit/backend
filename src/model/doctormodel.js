import mongoose from "mongoose";
import bcrypt from "bcrypt"


const doctorSchema=new mongoose.Schema({
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
    fee:{
        type:String,
        required:true
    },
    room:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    bio:{
    type:String,
    },
    specialization:{
        type:String,
        required:true,
    },
    qualification:{
        type:String,
        required:true,
    },
    experience:{
        type:String,
        required:true
    },
    appointments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"appointments"
    }]
})

doctorSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()

        this.password=await bcrypt.hash(this.password,10)
        next()
})

export const Doctor=mongoose.model("Doctor",doctorSchema)