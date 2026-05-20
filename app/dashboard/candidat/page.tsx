"use client";
import { useSession } from "next-auth/react";

export default function CandidatDashboard() {
  const { data: session } = useSession();
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
      <div className="text-center">
        <p className="text-5xl mb-4">🎓</p>
        <h1 className="text-2xl font-bold">Espace Candidat</h1>
        <p className="text-gray-400 mt-2">Bienvenue, {session?.user?.email}</p>
        <p className="text-yellow-400 mt-4 text-sm">Phase 5 — QR Code à venir</p>
      </div>
    </div>
  );
}