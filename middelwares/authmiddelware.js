import { Admin } from "../src/model/adminmodel.js";
import { Doctor } from "../src/model/doctormodel.js";
import { User } from "../src/model/usermodel.js";
import { Apierror } from "../src/utils/Apierror.js";
import jwt from "jsonwebtoken"

export const verifyjwt=async(req,res,next)=>{
    try {
    const token=req.cookies?.token;
    if(!token){
        throw new Apierror(400,"please login first")
    }
    const existed=jwt.verify(token,process.env.JWT_SECRET)
    const user=await Doctor.findById(existed.id)
    if(!user){
        throw new Apierror(400,"please login first")
    } 
    
    req.user=user;
    next()
    } catch (error) {
       next(error) 
    }
}

export const verifya=async(req,res,next)=>{
    try {
    const token=req.cookies?.token;
    if(!token){
        throw new Apierror(400,"please login first")
    }
    const existed=jwt.verify(token,process.env.JWT_SECRET)
    const user=await Admin.findById(existed.id)
    if(!user){
        throw new Apierror(400,"please login first")
    } 
    
    req.user=user;
    next()
    } catch (error) {
       next(error) 
    }
}

export const verifyu=async(req,res,next)=>{
    try {
    const token=req.cookies?.token;
    if(!token){
        throw new Apierror(400,"please login first")
    }
    const existed=jwt.verify(token,process.env.JWT_SECRET)
    const user=await User.findById(existed.id)
    if(!user){
        throw new Apierror(400,"please login first")
    } 
    
    req.user=user;
    next()
    } catch (error) {
       next(error) 
    }
}