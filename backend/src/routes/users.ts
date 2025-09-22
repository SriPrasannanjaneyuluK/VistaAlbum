import express from "express";
import User from "../models/User";

const router = express.Router();

// GET user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user); // ✅ returns JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
