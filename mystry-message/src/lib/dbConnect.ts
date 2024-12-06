import { log } from "console";
import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("already connected to database");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {});
        db.connection.on('connected', () => {
            connection.isConnected = db.connections[0].readyState
            log("connected to database successfully");
        })
    } catch (err) {
        log("database conntection failed !!", err)
        process.exit(1)
    }
}

export default dbConnect;