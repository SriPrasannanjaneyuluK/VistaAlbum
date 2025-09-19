import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import connectDB from "./config/db";

dotenv.config();

// ✅ Connect to MongoDB once
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(express.json());

// To this:
app.use("/api/auth", authRoutes);

// ✅ Server listen
app.listen(PORT, () => {
  console.log(`🚀 API is running on port ${PORT}`);
});
