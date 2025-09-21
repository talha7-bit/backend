import { Appointment } from "../model/appointmentmodel.js";
import { Apierror } from "../utils/Apierror.js";
import { Apiresponse } from "../utils/Apiresponse.js";

export const apply=async(req,res,next)=>{
    try {
       const {date,time}=req.body; 
       const doctorid=req.params.id;
       
       if(!req.user){
        throw new Apierror(400,"please login first")
       } 
       const user=req.user
       const existed=await Appointment.findOne({
        $and:[{doctor:doctorid},{date},{time}]
       })

       if(existed){
        throw new Apierror(400,"slot already booked")
       }

       const apply=await Appointment.create({
        doctor:doctorid,
        patient:user,
        date,
        time
       })

       if(!apply){
        throw new Apierror(400,"an error occured while applying appointment")
       }

       res.status(200)
       .json(
        new Apiresponse(200,apply,"appointment applied succesfully")
       )
    } catch (error) {
        next(error)
    }
}

export const aappointments=async(req,res,next)=>{
    try {
       const all=await Appointment.find({status:"accepted"})
       
       if(all.length==0){
        throw new Apierror(400,'no appointment found')
       }

       res.status(200)
       .json(
        new Apiresponse(200,all,"appointments fetched succesfully")
       )
    } catch (error) {
       next(error) 
    }
}

export const allappointments=async(req,res,next)=>{
    try {
        const appointments=await Appointment.aggregate([
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
            new Apiresponse(200,appointments,"appointmnets fetched succesfully")
        )
    } catch (error) {
        next(error)
    }
}