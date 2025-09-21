import mongoose from "mongoose";

const appointmentSchema=new mongoose.Schema({
    doctor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Doctor"
    },
    patient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    time:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"pending",
        enum:["pending","accepted","rejected"]
    }
})

export const Appointment=mongoose.model("Appointment",appointmentSchema)