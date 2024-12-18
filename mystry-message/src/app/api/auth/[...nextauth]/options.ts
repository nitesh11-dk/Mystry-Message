// import {NextAuthOptions} from 'nex'
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { NextAuthOptions } from "next-auth";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jnk@gmail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials:any): Promise<any> {
               try {
                await dbConnect();
                const user = await UserModel.findOne(
                    {$or: [{email: credentials.identifier}, {username: credentials.identifier}]}
                )

                if(!user) throw new Error("User not found");
                if(!user.verified) throw new Error("User not verified");

                const passwordsMatch = await bcrypt.compare(credentials.password, user.password);

                if(!passwordsMatch) throw new Error("Invalid credentials");
                
                return user;
                
               } catch (error) {
                throw new Error(error as string);
               }
            }   

        })
    ],
    callbacks:{
        async jwt({ token, user }) {

            if(user){
                token._id = user._id?.toString();
                token.verified = user.verified;
                token.isMessageAccepting = user.isMessageAccepting;
                token.username = user.username;
            }

            return token
          },
        async session({ session, token }) {

            if(token){
                session.user._id = token._id;
                session.user.verified = token.verified;
                session.user.isMessageAccepting = token.isMessageAccepting;
                session.user.username = token.username;
            }
            
            return session
          },
    },
    pages:{
        signIn: "/sign-in"
    },
    session:{
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET

}
