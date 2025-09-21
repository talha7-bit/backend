import { Appointment } from "../model/appointmentmodel.js";
import { Doctor } from "../model/doctormodel.js";
import { User } from "../model/usermodel.js"
import { Apierror } from "../utils/Apierror.js"
import { Apiresponse } from "../utils/Apiresponse.js";
import { uploadoncloudinary } from "../utils/Cloudinary.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


export const signup=async (req,res,next)=>{
    console.log(req.body)
    const image=req.file.path;
    if(!image){
        throw new Apierror(400,"please upload file")
    }
    try {
        
        const {username,email,password}=req.body;
        if(!username || !email || !password){
            throw new Apierror(400,"every field is required")
        }
        const existed=await User.findOne({email})
        if(existed){
            throw new Apierror(400,'email already exist')
        }

        const response=await uploadoncloudinary(image)

        const created=await User.create({
            username,
            email,
            password,
            image:response.url
        })

        if(!created){
            throw new Apierror(400,"en error occcured while craeting user")
        }

        res.status(200)
        .json(
            new Apiresponse(200,{created},"user created succesfully")
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

        const existed=await User.findOne({email})
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
        .cookie("token",token)
        .json(
            new Apiresponse(200,{},"user logged in succesfully")
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
       .clearCookie("token")
       .json(
        new Apiresponse(200,{},"user logged out succesfully")
       )
    } catch (error) {
        next(error)
    }
}

export const alluser=async(req,res,next)=>{
    try {
        const all=await User.find()

        if(all.length==0){
            throw new Apierror(400,"no user registered yet")
        }

        res.status(200)
        .json(
            new Apiresponse(200,all,"users fetched succesfully")
        )
    } catch (error) {
        nect(error)
    }
}

export const profile=async(req,res,next)=>{
    try {
        if(!req.user){
            throw new Apierror(400,"please login first")
        }

        const existed=await User.findById(req.user._id)
        if(!existed){
            throw new Apierror(400,"please login first")
        }

        res.status(200)
        .json(
            new Apiresponse(200,existed,"profile fetched succesfully")
        )
    } catch (error) {
        next(error)
    }
}

export const myappointments=async(req,res,next)=>{
    if(!req.user){
        throw new Apierror(400,"please login first")
    }
    
    const appointments=await Appointment.aggregate([
        {
            $match:{patient:req.user._id}
        },
        {
            $lookup:{
                from:"doctors",
                localField:"doctor",
                foreignField:"_id",
                as:"doctorinfo",
            },  
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
                status:1,
                date:1,
                time:1,
                doctor:"$doctorinfo.username",
                patient:"$userinfo.username",
            }
        },
        {
            $sort:{date:1,time:1}
        }
       
    ])

    res.status(200)
    .json(
        new Apiresponse(200,appointments,"appointments fetched succesfully")
    )
}