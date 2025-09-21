import mongoose from "mongoose";


const conectdb=async ()=>{
   try {
     await mongoose.connect(process.env.MONGODB_URL)
     console.log("mongodb connected succesfully")
   } catch (error) {
    console.log("an error occured while connecting to database")
   }
}

export default conectdb