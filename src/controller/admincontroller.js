import { Admin } from "../model/adminmodel.js";
import { Appointment } from "../model/appointmentmodel.js";
import { User } from "../model/usermodel.js";
import { Apierror } from "../utils/Apierror.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { uploadoncloudinary } from "../utils/Cloudinary.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const signup=async (req,res,next)=>{
    console.log(req.body)
    
    try {
        
        const {username,email,password}=req.body;
        if(!username || !email || !password){
            throw new Apierror(400,"every field is required")
        }
        const existed=await Admin.findOne({email})
        if(existed){
            throw new Apierror(400,'email already exist')
        }

       

        const created=await Admin.create({
            username,
            email,
            password,
        })

        if(!created){
            throw new Apierror(400,"en error occcured while craeting admin")
        }

        res.status(200)
        .json(
            new Apiresponse(200,{created},"admin created succesfully")
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

        const existed=await Admin.findOne({email})
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
            new Apiresponse(200,{},"admin logged in succesfully")
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
       console.log("working")
       res.status(200)
       .clearCookie("token",{
         httpOnly:true,
            secure:true,
            sameSite:"none",
            maxAge: 7 * 24 * 60 * 60 * 1000
       })
       .json(
        new Apiresponse(200,{},"admin logged out succesfully")
       )
    } catch (error) {
        next(error)
    }
}

export const accepted=async(req,res,next)=>{
    try {
       const appointments=await Appointment.aggregate([
        {
            $match:{status:"accepted"}
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

       if(!appointments || appointments.length==0){
        throw new Apierror(400,"an error occured while fetching the appointments")
       }

       res.status(200)
       .json(
        new Apiresponse(200,appointments,"appointments fetched succesfully")
       )
    } catch (error) {
        next(error)
    }
}