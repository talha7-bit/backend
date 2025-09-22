import express from "express"
import doctorrouter from "./src/routes/doctorrouter.js"
import userrouter from "./src/routes/userrouter.js"
import adminrouter from "./src/routes/adminrouter.js"
import appointmentrouter from "./src/routes/appointmentrouter.js"
import cookieParser from "cookie-parser"
import cors from "cors"

const app=express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors({
    origin:"https://pfrontend-sigma.vercel.app",
    credentials:true
}))


app.use("/api/doctor",doctorrouter)
app.use("/api/user",userrouter)
app.use("/api/admin",adminrouter)
app.use("/api/appointment",appointmentrouter)


export default app