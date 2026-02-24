import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not set");
  }

  const isProduction = process.env.NODE_ENV === "production";

  try {
    await mongoose.connect(uri, {
      autoIndex: !isProduction
    });
    console.log("MongoDB connected");
  } catch (err) {
    throw new Error(`MongoDB connection error: ${err.message}`);
  }
};
