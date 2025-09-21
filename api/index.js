import { app } from "../app.js";
import ServerlessHttp from "serverless-http";
import connectdb from "../src/db/db.js"
import dotenv from "dotenv"


dotenv.config()
try {
   await connectdb()
   console.log("db connected")
} catch (error) {
   console.log("db error",error) 
}
export const handler=ServerlessHttp(app)