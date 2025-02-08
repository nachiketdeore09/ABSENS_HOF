import mongoose from "mongoose";

const connectDB = async () =>{
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URL}`,
        );
        console.log(`MongoDB connected: ${connectionInstance.connection.name}`);
    } catch (error) {
        console.log("Error connecting Database, ", error);
        process.exit(1);
    }
}

export default connectDB;