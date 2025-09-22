import { Router, Request, Response } from "express";
import { google } from "googleapis";
import User from "../models/User";
import authMiddleware from "./middleware/auth"; // make sure this exists

const router = Router();

// GET /api/photos/albums → Fetch user's Google Photos albums
router.get("/albums", authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user?.accessToken) return res.status(401).json({ error: "No access token" });

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: user.accessToken });

    const photos = google.photoslibrary({ version: "v1", auth: oauth2Client });
    const result = await photos.albums.list({ pageSize: 50 });

    const albums = result.data.albums?.map((a) => ({
      id: a.id,
      title: a.title,
      coverPhotoUrl: a.coverPhotoBaseUrl ? a.coverPhotoBaseUrl + "=w200-h200" : undefined,
    })) || [];

    res.json(albums);
  } catch (err: any) {
    console.error("Google Photos Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch albums" });
  }
});

// GET /api/photos/media/:albumId → Fetch media items in an album
router.get("/media/:albumId", authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user?.accessToken) return res.status(401).json({ error: "No access token" });

    const { albumId } = req.params;
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: user.accessToken });

    const photos = google.photoslibrary({ version: "v1", auth: oauth2Client });
    const response = await photos.mediaItems.search({ requestBody: { albumId } });

    const mediaItems = response.data.mediaItems?.map((m) => ({
      id: m.id,
      filename: m.filename,
      baseUrl: m.baseUrl + "=w400-h400", // resize for frontend
    })) || [];

    res.json(mediaItems);
  } catch (err: any) {
    console.error("Google Photos Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch media items" });
  }
});

export default router;
