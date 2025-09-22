import React from "react";

interface ClientPageProps {
  params: { clientId: string };
}

export default function ClientAlbum({ params }: ClientPageProps) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Client Album: {params.clientId}</h1>
      {/* TODO: Fetch photos for this client */}
    </div>
  );
}
