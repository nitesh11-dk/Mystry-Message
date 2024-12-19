import User from "@/models/User";

import UserModel from "@/models/User";
import {Message} from "@/models/User"
import dbConnect from "@/lib/dbConnect";


export async function POST(req:Request){
    await dbConnect()

    const {username,content} = await req.json()

    try {
        const user = await UserModel.findOne({username})

        if(!user){
            return Response.json({message:"User not found",success:false}, {status:404})
        }
       
        //  is user is accepting messages
        if(!user.isMessageAccepting){
            return Response.json({message:"User is not accepting messages",success:false}, {status:400})
        }

        const newMessage = {
            content,
            createdAt:new Date()
        }

        user.messages.push(newMessage as Message)
        await user.save();
        


        return Response.json({message:"Message sent successfully",success:true}, {status:200})



    } catch (error) {
        return Response.json({message:"Failed to send message",success:false}, {status:500})
    }

    
}
