import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { verifySchema } from "@/Schemas/verifySchema";

export async function POST(req:Request){
    await dbConnect()
    try {
        const body = await req.json()

        const decodedVerifyCode = decodeURIComponent(body.verifyCode)
        

        const result = verifySchema.safeParse({ verifyCode: decodedVerifyCode })
        if (!result.success) {
            return Response.json({
                message: "Invalid verification code format",
                errors: result.error.errors,
                success: false
            }, { status: 400 })
        }

        const decodedUsername = decodeURIComponent(body.username)
                
         const user =await User.findOneAndUpdate({username:decodedUsername})

        if(!user){
            return Response.json({message:"User not found",success:false}, {status:404})
        }

        const ifCodeValid = user.verifyCode === body.decodedVerifyCode ;
        const isCodeExpired = user.verifyCodeExpiry < new Date()

        if(!ifCodeValid || isCodeExpired){
            return Response.json({message:"Invalid or expired code",success:false}, {status:400})
        }

        user.verified = true
        await user.save()

        return Response.json({message:"Code verified successfully",success:true}, {status:200})



    } catch(error){
        console.log("error verifying code",error)
        return Response.json({message:"error verifying code",success:false}, {status:500})
    }
}
