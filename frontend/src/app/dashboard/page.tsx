"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface Album {
  id: string;
  title: string;
  coverPhotoUrl?: string;
}

export default function Dashboard() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const searchParams = useSearchParams();
  const userId = searchParams?.get("user");

  const fetchAlbums = async () => {
    if (!userId) return;
    try {
      const res = await fetch("http://localhost:5000/api/photos/albums", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // optional, if using JWT
        },
      });
      const data = await res.json();
      setAlbums(data);
    } catch (err) {
      console.error("Failed to fetch albums:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={fetchAlbums}
      >
        Fetch My Albums
      </button>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {albums.map((album) => (
          <div key={album.id} className="border p-2 rounded">
            {album.coverPhotoUrl ? (
              <img
                src={album.coverPhotoUrl}
                alt={album.title}
                className="w-full h-40 object-cover rounded"
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                No Cover
              </div>
            )}
            <p className="mt-2 font-semibold text-center">{album.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
