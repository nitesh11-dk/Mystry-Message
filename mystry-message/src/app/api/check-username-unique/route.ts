import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { z } from "zod";
import { usernameValidation } from "@/Schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(req:Request){

await dbConnect()

try {
    const {searchParams} = new URL(req.url)
    const queryParams = {
        username: searchParams.get("username")
    }
  
    // verify 
    const result = UsernameQuerySchema.safeParse(queryParams)
    if(!result.success){
        const usernameError = result.error.format().username?._errors || [] 
        return Response.json({message:usernameError?.length > 0 ? usernameError.join(",") : "Invalid username",success:false}, {status:400})
    }

    const {username} = result.data
    const user = await User.findOne({username,verified:true})
    if(user){
        return Response.json({message:"Username already exists",success:false}, {status:400})
    }

    return Response.json({message:"Username is unique",success:true}, {status:200})




} catch (error) {
    console.log("error checking username",error);
    return Response.json({message:"error checking username",success:false}, {status:500})
}

}