import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import connectDB from "./config/db";



dotenv.config();

// ✅ Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(express.json());

// ✅ CORS - must be before routes
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend
    credentials: true,
  })
);

// ✅ Routes
app.use("/api/auth", authRoutes); // Google OAuth
app.use("/api/users", userRoutes); // Fetch user info

// ✅ Default route for testing
app.get("/", (req, res) => res.send("API is running"));

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 API is running on port ${PORT}`);
});
