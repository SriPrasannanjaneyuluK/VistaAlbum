import { Router } from "express";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

// Initialize OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Debug: Check redirect URI
console.log("Google OAuth Redirect URI:", oauth2Client.redirectUri);

// Step 1: Redirect user to Google login
router.get("/google", (req, res) => {
  const scopes = ["https://www.googleapis.com/auth/photoslibrary.readonly", "openid", "email", "profile"];
  
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
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

    // You can save tokens in DB/session for future API calls
    console.log("Google OAuth tokens:", tokens);

    res.send("Google OAuth successful! Tokens acquired.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving Google tokens");
  }
});

export default router;
