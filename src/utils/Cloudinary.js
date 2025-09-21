import { v2 as cloudinary } from "cloudinary";
import { Apierror } from "./Apierror.js";


cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadoncloudinary=async (localfilepath)=>{
try {
    if(!localfilepath){
        throw new Apierror('failed to upload image')
    }
    
    const response=await cloudinary.uploader.upload(localfilepath,{
        resource_type:"auto",
        folder:"tiktok",
       
    })
    
    console.log("an image have been uploaded",response.url)
    return response
    
} catch (error) {
    console.log(error.message)
    throw new Apierror(400,"an error occured while uploading image on lcoudinary");
}
}

export {uploadoncloudinary}