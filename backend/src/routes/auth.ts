import { Router, Request, Response } from "express";
import { google } from "googleapis";
import dotenv from "dotenv";
import User from "../models/User";

dotenv.config();

const router = Router();

// Initialize OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// 🔹 Step 1: Redirect user to Google login
router.get("/google", (req: Request, res: Response) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    scope: [
      "openid",
      "email",
      "profile",
      "https://www.googleapis.com/auth/photoslibrary.readonly",
    ],
  });

  res.redirect(url);
});

// 🔹 Step 2: Handle Google callback
router.get("/google/callback", async (req: Request, res: Response) => {
  const code = req.query.code as string;
  if (!code) return res.status(400).send("No code provided by Google");

  try {
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken({
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    });

    oauth2Client.setCredentials(tokens);

    // Get user info
    const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
    const userInfo = await oauth2.userinfo.get();

    // Save or update user in MongoDB
    const user = await User.findOneAndUpdate(
    { googleId: userInfo.data.id },
      {
        googleId: userInfo.data.id,
        email: userInfo.data.email,
        name: userInfo.data.name,
        profilePic: userInfo.data.picture || "", // ensure a string is stored
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      },
      { upsert: true, new: true }
    );

    console.log("Saved user profilePic:", user.profilePic); // ✅ Debug
    console.log("✅ User saved:", user);
    console.log("Google user info:", userInfo.data);


    // Redirect to frontend dashboard with user ID
    res.redirect(`http://localhost:3000/dashboard?user=${user._id}`);
  } catch (err) {
    console.error("OAuth callback error:", err);
    res.status(500).send("Error retrieving Google tokens");
  }
});

export default router;
