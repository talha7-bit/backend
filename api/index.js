import { app } from "../app";
import ServerlessHttp from "serverless-http";
import connectdb from "../src/db/db.js"
import dotenv from "dotenv"


dotenv.config()
connectdb()
export const handler=ServerlessHttp(app)