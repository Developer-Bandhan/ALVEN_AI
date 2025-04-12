import mongoose from "mongoose";

function connectDB() {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error(err));
}


export default connectDB;