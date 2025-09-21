import express from "express"
import { alluser, login, logout, myappointments, profile, signup } from "../controller/usercontroller.js"
import { upload } from "../../middelwares/multer.js"
import { verifyu } from "../../middelwares/authmiddelware.js"
import { Apiresponse } from "../utils/Apiresponse.js"
import { doctorprofile } from "../controller/doctorcontroller.js"

const router=express.Router()

router.post("/signup",upload.single("image"),signup)

router.post("/login",login)

router.post("/logout",verifyu,logout)

router.get("/allusers",alluser)

router.get("/profile",verifyu,profile)

router.get("/doctorprofile/:id",verifyu,doctorprofile)

router.get("/myappointments",verifyu,myappointments)

router.get("/",verifyu,(req,res,next)=>{
    try {
        if(!req.user){
            throw new Apierror(400,"user should login first")
        }
        res.status(200)
        .json(
            new Apiresponse(200,req.user,"user fetched succesfully")
        )
    } catch (error) {
        next(error)
    }
})
export default router