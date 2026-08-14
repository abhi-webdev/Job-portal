import mongoose from "mongoose"

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongodb connected successfully");
        
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }

}

export default connectDb