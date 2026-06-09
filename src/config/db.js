//Import mongoose
import mongoose from "mongoose";

async function connectDB() {
  try {
    // Try to connect using MONGO_URI from .env file
    const conn = await mongoose.connect(process.env.MONGO_URI)

    // If successful
    console.log ('MongoDB Connected: ' + conn.connection.host)

  }
  catch(error){
    // If fails
    console.log('MongoDB connection error:' + error.message)
    process.exit(1)
  }
}

export default connectDB