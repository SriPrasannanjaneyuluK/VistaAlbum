// routes/profile.ts
import { Router, Request, Response } from "express";
import User from "../models/User";

const router = Router();

// Simple example: use query param userId (later we’ll replace with session/cookie)
router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-refreshToken -accessToken"); 
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
