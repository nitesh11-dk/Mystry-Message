import mongoose, { Document, Mongoose, Schema } from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
})


export interface User extends Document {
    username: string;
    password: string;
    email: string;
    verifyCode: string;
    verified: boolean;
    messages: Message[];
    verifyCodeExpiry: Date;
    isMessageAccepting: boolean
}

const UserSchema: Schema<User> = new Schema({
    username: {
        unique: true,
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        match: [/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, 'please use a valid email address']
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "Verification code is required"]
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verification code Expiry is required"]
    },
    verified: {
        type: Boolean,
        default: false
    },
    isMessageAccepting: {
        type: Boolean,
        default: true
    },
    messages: [MessageSchema]

})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel


//  yaha par mongoose .model.User ad mongoose.Model<User> likha hai qkii hum chhaite hai kii mongoose.models.User ka  return type jo rahe vo mongoose.Model<User> ka ho 