import express from "express"
import { verifyu } from "../../middelwares/authmiddelware.js"
import { aappointments, allappointments, apply } from "../controller/appointmentcontroller.js"

const router=express.Router()

router.post("/apply/:id",verifyu,apply)

router.get("/aappointments",aappointments)

router.get("/allappointments",allappointments)

export default router