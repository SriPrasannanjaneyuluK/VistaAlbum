"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface User {
  name: string;
  email: string;
  profilePic?: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const searchParams = useSearchParams();
  const userId = searchParams?.get("user");

  useEffect(() => {
    if (!userId) return;

    // Fetch user JSON from backend
    fetch(`http://localhost:5000/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched user:", data); // ✅ check profilePic
        setUser(data);
      })
      .catch(console.error);
  }, [userId]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {user ? (
        <div className="mt-4 flex flex-col items-start gap-2">
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>

          {/* Render profile picture or fallback avatar */}
          {user.profilePic ? (
            <img
              src={user.profilePic} // direct Google URL
              alt="Profile Picture"
              className="mt-2 w-24 h-24 rounded-full object-cover border border-gray-300"
            />
          ) : (
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.name
              )}&size=128`} // fallback avatar
              alt="Profile Picture"
              className="mt-2 w-24 h-24 rounded-full object-cover border border-gray-300"
            />
          )}
        </div>
      ) : (
        <p className="mt-4">Loading user data...</p>
      )}
    </div>
  );
}
