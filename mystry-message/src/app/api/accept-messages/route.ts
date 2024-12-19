import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";

export async function POST(req:Request){
    await dbConnect()
    const session = await getServerSession(authOptions)

    const user:User = session?.user as User

    if(!session || !user){
        return Response.json({message:"Unauthorized",success:false}, {status:401})
    }

    const userId = user._id ;
    const {acceptMessages} = await req.json()

    try {

        const updatedUser = await UserModel.findByIdAndUpdate(userId,{isMessageAccepting:acceptMessages},{new:true})

        if(!updatedUser){
            return Response.json({message:"User not found",success:false}, {status:404})
        }

        return Response.json({message:"Message acceptance updated successfully",success:true,updatedUser}, {status:200})

    } catch (error) {
        
        return Response.json({message:"Failed to update message acceptance",success:false}, {status:500})
    }
     
}

export async function GET(req:Request){
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user:User = session?.user as User

    if(!session || !user){
        return Response.json({message:"Unauthorized",success:false}, {status:401})
    }

    const userId = user._id ;   

  try {
      const currentUser    = await UserModel.findById(userId)
  
      if(!currentUser){
          return Response.json({message:"User not found",success:false}, {status:404})
      }
  
      return Response.json({message:"Message acceptance updated successfully",success:true,isMessageAccepting:currentUser.isMessageAccepting}, {status:200})
      
  } catch (error) {
    return Response.json({message:"Failed to get message acceptance",success:false}, {status:500})
  }

}

