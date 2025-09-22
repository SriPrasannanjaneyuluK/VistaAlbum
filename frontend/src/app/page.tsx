"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface User {
  name: string;
  email: string;
  profilePic?: string;
  googleAccessToken?: string; // for later
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const searchParams = useSearchParams();
  const userId = searchParams?.get("user");

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/users/${userId}`)
      .then((res) => res.json())
      .then(setUser)
      .catch(console.error);
  }, [userId]);

  // 🔹 Picker handler
  const openPicker = () => {
    // ⚠️ Temporary test token (replace later with real user token)
    const dummyToken = "YOUR_TEST_ACCESS_TOKEN";

    (window as any).gapi.load("picker", () => {
      const view = new (window as any).google.picker.View(
        (window as any).google.picker.ViewId.PHOTOS
      );

      const picker = new (window as any).google.picker.PickerBuilder()
        .addView(view)
        .setOAuthToken(dummyToken) // 👈 use dummy for now
        .setDeveloperKey(process.env.NEXT_PUBLIC_GOOGLE_API_KEY)
        .setCallback((data: any) => {
          if (
            data[window.google.picker.Response.ACTION] ===
            window.google.picker.Action.PICKED
          ) {
            const photos = data[window.google.picker.Response.DOCUMENTS];
            console.log("Selected photos:", photos);
          }
        })
        .build();

      picker.setVisible(true);
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {user ? (
        <div className="mt-4 flex flex-col items-start gap-2">
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>

          {user.profilePic ? (
            <img
              src={user.profilePic}
              alt="Profile Picture"
              className="mt-2 w-24 h-24 rounded-full object-cover border border-gray-300"
            />
          ) : (
            <p>Profile Picture not available</p>
          )}

          {/* 🔹 Pick Photos */}
          <button
            onClick={openPicker}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Pick Photos from Google
          </button>
        </div>
      ) : (
        <p className="mt-4">Loading user data...</p>
      )}
    </div>
  );
}
