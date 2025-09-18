import { Router } from "express";
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

// Step 1: Redirect user to Google login
router.get("/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // ensures refresh_token is returned
    scope: [
      "openid",
      "email",
      "profile",
      "https://www.googleapis.com/auth/photoslibrary.readonly"
    ]
  });

  res.redirect(url);
});

// Step 2: Handle callback
router.get("/google/callback", async (req, res) => {
  const code = req.query.code as string;
  if (!code) return res.status(400).send("No code provided by Google");

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Fetch user profile info
    const oauth2 = google.oauth2("v2");
    const { data } = await oauth2.userinfo.get({ auth: oauth2Client });

    // Save user in DB
    const user = await User.findOneAndUpdate(
      { googleId: data.id },
      {
        googleId: data.id,
        email: data.email,
        name: data.name,
        picture: data.picture,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiryDate: tokens.expiry_date
      },
      { upsert: true, new: true }
    );

    console.log("User saved/updated in DB:", user);

    res.send("Google OAuth successful! User saved in DB.");
  } catch (err) {
    console.error("OAuth callback error:", err);
    res.status(500).send("Error retrieving Google tokens");
  }
});

export default router;
