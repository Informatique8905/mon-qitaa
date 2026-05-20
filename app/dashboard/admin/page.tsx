"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Candidat {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  etablissement: string;
  carteEtudiantUrl: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Candidat | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCandidats = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/pending-candidates");
    const data = await res.json();
    setCandidats(data.candidats || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") fetchCandidats();
  }, [status, router, fetchCandidats]);

  const handleAction = async (id: string, action: "validate" | "reject") => {
    setActionLoading(true);
    const res = await fetch("/api/admin/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidatId: id, action }),
    });
    const data = await res.json();
    if (res.ok) {
      showToast(data.message, "success");
      setSelected(null);
      fetchCandidats();
    } else {
      showToast(data.error || "Erreur", "error");
    }
    setActionLoading(false);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg font-semibold transition-all
          ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              🛡️ Back-office QITAA
            </h1>
            <p className="text-gray-400 mt-1">
              Connecté en tant que <span className="text-emerald-400 font-semibold">{session?.user?.email}</span>
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl px-4 py-2 text-center">
            <p className="text-2xl font-bold text-yellow-400">{candidats.length}</p>
            <p className="text-gray-400 text-sm">en attente</p>
          </div>
        </div>

        {/* Tableau + Modal côte à côte */}
        <div className="flex gap-6">
          {/* Liste candidats */}
          <div className="flex-1">
            {candidats.length === 0 ? (
              <div className="bg-gray-900 rounded-2xl p-12 text-center">
                <p className="text-4xl mb-3">🎉</p>
                <p className="text-gray-400 text-lg">Aucun candidat en attente</p>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left p-4 text-gray-400 font-medium">Candidat</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Établissement</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Date</th>
                      <th className="p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidats.map((c) => (
                      <tr
                        key={c._id}
                        onClick={() => setSelected(c)}
                        className={`border-b border-gray-800/50 cursor-pointer transition-colors hover:bg-gray-800/50
                          ${selected?._id === c._id ? "bg-gray-800" : ""}`}
                      >
                        <td className="p-4">
                          <p className="font-semibold">{c.prenom} {c.nom}</p>
                          <p className="text-gray-400 text-sm">{c.email}</p>
                        </td>
                        <td className="p-4 text-gray-300">{c.etablissement}</td>
                        <td className="p-4 text-gray-400 text-sm">
                          {new Date(c.createdAt).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="p-4">
                          <span className="bg-yellow-500/10 text-yellow-400 text-xs px-2 py-1 rounded-full">
                            En attente
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Panel détail */}
          {selected && (
            <div className="w-80 bg-gray-900 rounded-2xl p-6 self-start sticky top-6">
              <h2 className="text-lg font-bold mb-1">{selected.prenom} {selected.nom}</h2>
              <p className="text-gray-400 text-sm mb-4">{selected.email}</p>

              <div className="mb-4">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Établissement</p>
                <p className="text-white font-medium">{selected.etablissement}</p>
              </div>

              <div className="mb-6">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Carte étudiant</p>
                {selected.carteEtudiantUrl ? (
                  <a href={selected.carteEtudiantUrl} target="_blank" rel="noopener noreferrer">
                    <img
                      src={selected.carteEtudiantUrl}
                      alt="Carte étudiant"
                      className="w-full rounded-xl border border-gray-700 hover:border-emerald-500 transition-colors cursor-zoom-in"
                    />
                  </a>
                ) : (
                  <div className="bg-gray-800 rounded-xl p-4 text-center text-gray-500 text-sm">
                    Aucune carte soumise
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleAction(selected._id, "validate")}
                  disabled={actionLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed
                    text-white font-bold py-3 rounded-xl transition-colors"
                >
                  {actionLoading ? "..." : "✅ Valider"}
                </button>
                <button
                  onClick={() => handleAction(selected._id, "reject")}
                  disabled={actionLoading}
                  className="w-full bg-red-900/50 hover:bg-red-800 border border-red-700 disabled:opacity-50
                    disabled:cursor-not-allowed text-red-400 font-bold py-3 rounded-xl transition-colors"
                >
                  {actionLoading ? "..." : "❌ Rejeter"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}