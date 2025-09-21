import express from "express"
import { accept, alldoctors, appointments, doctorprofile, getspecial, latest, login, logout, profile, reject, signup } from "../controller/doctorcontroller.js"
import { upload } from "../../middelwares/multer.js"
import { verifyjwt } from "../../middelwares/authmiddelware.js"
import { Apiresponse } from "../utils/Apiresponse.js"

const router=express.Router()

router.post("/signup",upload.single("image"),signup)

router.post("/login",login)

router.post("/logout",verifyjwt,logout)

router.get("/alldoctors",alldoctors)

router.post("/getspecial/:id",getspecial)

router.get("/appointments",verifyjwt,appointments)

router.get("/latest",verifyjwt,latest)

router.post("/accept/:id",verifyjwt,accept)

router.post("/reject/:id",verifyjwt,reject)

router.get("/profile",verifyjwt,profile)

router.get("/",verifyjwt,(req,res,next)=>{
    try {
        if(!req.user){
            throw new Apierror(400,"doctor should login first")
        }
        res.status(200)
        .json(
            new Apiresponse(200,req.user,"doctor fetched succesfully")
        )
    } catch (error) {
        next(error)
    }
})


export default router