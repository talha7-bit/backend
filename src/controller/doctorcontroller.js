import { Doctor } from "../model/doctormodel.js";
import { User } from "../model/usermodel.js"
import { Apierror } from "../utils/Apierror.js"
import { Apiresponse } from "../utils/Apiresponse.js";
import { uploadoncloudinary } from "../utils/Cloudinary.js";
import {Appointment} from "../model/appointmentmodel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


export const signup=async (req,res,next)=>{
    console.log(req.body)
    const image=req.file.path;
    if(!image){
        throw new Apierror(400,"please upload file")
    }
    try {
        
        const {username,email,password,fee,room,specialization,qualification,experience}=req.body;
        if(!username || !email || !password || !fee || !room || !specialization || !qualification || !experience){
            throw new Apierror(400,"every field is required")
        }
        const existed=await Doctor.findOne({email})
        if(existed){
            throw new Apierror(400,'email already exist')
        }

        const response=await uploadoncloudinary(image)

        const created=await Doctor.create({
            username,
            email,
            password,
            fee,
            room,
            qualification,
            specialization,
            experience,
            image:response.url
        })

        if(!created){
            throw new Apierror(400,"en error occcured while craeting doctor")
        }

        res.status(200)
        .json(
            new Apiresponse(200,{created},"doctor created succesfully")
        )
    } catch (error) {
        console.log("an error occured",error)
        next(error)
    }
}

export const login=async(req,res,next)=>{
    try {
        if(!req.body){
        throw new Apierror(400,"please enter email and password")        
    }
        const {email,password}=req.body;
        if(!email || !password){
            throw new Apierror(400,"please enter email and password") 
        }

        const existed=await Doctor.findOne({email})
        if(!existed){
            throw new Apierror(400,"wrong email or password")
        }
        console.log(password)
        console.log(existed.password)
        const result=await bcrypt.compare(password,existed.password)
        console.log(result)
        if(!result){
            throw new Apierror(400,"wrong email or password")
        }
        const token=jwt.sign({id:existed._id},process.env.JWT_SECRET)
        if(!token){
            throw new Apierror(400,"error occured while assigning token")
        }

        res.status(200)
        .cookie("token",token,{
             httpOnly:true,
            secure:true,
            sameSite:"none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        .json(
            new Apiresponse(200,{},"doctor logged in succesfully")
        )

    } catch (error) {
        console.log("an error occured",error)
        next(error)
    }
}

export const logout=async(req,res,next)=>{
    try {
       if(!req.user){
        throw new Apierror(400,"'please login first")
       }
       
       res.status(200)
       .clearCookie("token",{
         httpOnly:true,
            secure:true,
            sameSite:"none",
            maxAge: 7 * 24 * 60 * 60 * 1000
       })
       .json(
        new Apiresponse(200,{},"doctor logged out succesfully")
       )
    } catch (error) {
        next(error)
    }
}

export const alldoctors=async(req,res,next)=>{
    try {
        const all=await Doctor.find()

        if(all.length==0){
            throw new Apierror(400,"no doctor registered yet")
        }

        res.status(200)
        .json(
            new Apiresponse(200,all,"doctors fetched succesfully")
        )
    } catch (error) {
        next(error)
    }
}

export const getspecial=async(req,res,next)=>{
    try {
        console.log(req.params.id)
        const special=req.params.id;
        const existed=await Doctor.find({specialization:special})

        if(existed.length==0){
            throw new Apierror(400,"no doctor found")
        }

        res.status(200)
        .json(
            new Apiresponse(200,existed,"doctor found succesfully")
        )
    } catch (error) {
        next(error)
    }
}

export const doctorprofile=async(req,res,next)=>{
    try {
        const id=req.params.id
        const existed=await Doctor.findById(id)
        if(!existed){
            throw new Apierror(400,"doctor not found")
        }

        res.status(200)
        .json(
            new Apiresponse(200,existed,"profile fetched succesfully")
        )
    } catch (error) {
        next(error)
    }
}

export const appointments=async(req,res,next)=>{
   try {
     if(!req.user._id){
         throw new Apierror(400,"please login first")
     }
    const appointment=await Appointment.aggregate([
     {
         $match:{doctor:req.user._id}
     },
     {
         $lookup:{
             from:"doctors",
             localField:"doctor",
             foreignField:"_id",
             as:"doctorinfo"
         }
     },
     {
         $unwind:"$doctorinfo"
     },
     {
         $lookup:{
             from:"users",
             localField:"patient",
             foreignField:"_id",
             as:"userinfo"
         }
     },
     {
         $unwind:"$userinfo"
     },
     {
         $project:{
             date:1,
             time:1,
             status:1,
             doctor:"$doctorinfo.username",
             user:"$userinfo.username"
         }
     }
    ])
 
    res.status(200)
    .json(
     new Apiresponse(200,appointment,"appointments fetched succesfully")
    )
   } catch (error) {
    next(error)
   }
}

export const latest=async(req,res,next)=>{
    try {
     if(!req.user._id){
         throw new Apierror(400,"please login first")
     }
    const appointment=await Appointment.aggregate([
     {
         $match:{doctor:req.user._id,status:"pending"}
     },
     {
         $lookup:{
             from:"doctors",
             localField:"doctor",
             foreignField:"_id",
             as:"doctorinfo"
         }
     },
     {
         $unwind:"$doctorinfo"
     },
     {
         $lookup:{
             from:"users",
             localField:"patient",
             foreignField:"_id",
             as:"userinfo"
         }
     },
     {
         $unwind:"$userinfo"
     },
     {
         $project:{
             date:1,
             time:1,
             status:1,
             doctor:"$doctorinfo.username",
             user:"$userinfo.username"
         }
     }
    ])
 
    res.status(200)
    .json(
     new Apiresponse(200,appointment,"appointments fetched succesfully")
    )
   } catch (error) {
    next(error)
   }
}

export const accept=async(req,res,next)=>{
    try {
        if(!req.user){
            throw new Apierror(400,"please login first")
        }
    const id=req.params?.id;
     const accepted=await Appointment.findByIdAndUpdate(id,{status:"accepted"},{new:true})
     if(!accepted){
        throw new Apierror(400,"an error occured while accepting the request")
     }
     res.status(200)
     .json(
        new Apiresponse(200,accepted,"appointment accepted succesfully")
     )
    } catch (error) {
       next(error) 
    }
}

export const reject=async(req,res,next)=>{
    try {
        if(!req.user){
            throw new Apierror(400,"please login first")
        }
    const id=req.params?.id;
     const accepted=await Appointment.findByIdAndUpdate(id,{status:"rejected"},{new:true})
     if(!accepted){
        throw new Apierror(400,"an error occured while accepting the request")
     }
     res.status(200)
     .json(
        new Apiresponse(200,accepted,"appointment accepted succesfully")
     )
    } catch (error) {
       next(error) 
    }
}

export const profile=async(req,res,next)=>{
    try {
      if(!req.user){
        throw new Apierror(400,"please login first")
      }  
      const existed=await Doctor.findById(req.user._id)
      if(!existed){
        throw new Apierror(400,"doctor not exist")
      }

      res.status(200)
      .json(
        new Apiresponse(200,existed,"profile fetched succesfully")
      )
    } catch (error) {
        next(error)
    }
}