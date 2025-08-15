import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.DB_URI as string);
    console.log(`MongoDB connected`, con.connection.host);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
