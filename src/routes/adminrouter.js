import express from "express"
import { accepted, logout, signup } from "../controller/admincontroller.js"
import { login } from "../controller/admincontroller.js"
import { verifya } from "../../middelwares/authmiddelware.js"
import { Apierror } from "../utils/Apierror.js"
import { Apiresponse } from "../utils/Apiresponse.js"

const router=express.Router()

router.post("/signup",signup)

router.post("/login",login)

router.post("/logout",verifya,logout)

router.get("/accepted",accepted)

router.get("/",verifya,(req,res,next)=>{
    console.log('admin route was hit')
    try {
        if(!req.user){
            throw new Apierror(400,"admin should login first")
        }
        res.status(200)
        .json(
            new Apiresponse(200,req.user,"admin fetched succesfully")
        )
    } catch (error) {
        next(error)
    }
})
export default router