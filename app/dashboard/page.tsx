"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard, GraduationCap, Crown, Brain, Utensils,
  ClipboardList, ScanLine, BarChart3, History, Bell, LogOut,
  Menu, ChevronRight, Users, Trophy, Star,
  TrendingUp, CheckCircle, Clock, AlertCircle, Sparkles
} from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";

interface StatCard { label: string; value: string; icon: React.ReactNode; color: string; trend: string; gradient: string; colorFrom: string; colorTo: string; }
interface ActivityItem { action: string; actor: string; time: string; status: "success" | "pending" | "info"; }
interface NavItem { icon: React.ReactNode; label: string; href: string; }

const STATS: StatCard[] = [
  { label: "Établissements Inscrits", value: "24", icon: <Users size={20} />, color: "text-orange-600", gradient: "from-orange-400 to-orange-600", trend: "+3 ce mois", colorFrom: "#f97316", colorTo: "#ea580c" },
  { label: "Candidats Validés", value: "312", icon: <Trophy size={20} />, color: "text-emerald-600", gradient: "from-emerald-400 to-emerald-600", trend: "+18 cette semaine", colorFrom: "#34d399", colorTo: "#059669" },
  { label: "Moyenne Générale", value: "14.7", icon: <Star size={20} />, color: "text-blue-600", gradient: "from-blue-400 to-blue-600", trend: "Épreuves en cours", colorFrom: "#60a5fa", colorTo: "#2563eb" },
  { label: "Scans QR Terminés", value: "87%", icon: <ScanLine size={20} />, color: "text-purple-600", gradient: "from-purple-400 to-purple-600", trend: "271 / 312 candidats", colorFrom: "#c084fc", colorTo: "#9333ea" },
];

const ACTIVITIES: ActivityItem[] = [
  { action: "Candidature validée — Université UFHB", actor: "Admin QITAA", time: "Il y a 5 min", status: "success" },
  { action: "Note insérée — Catégorie Cuisine Traditionnelle", actor: "Jury Gastronomie", time: "Il y a 22 min", status: "success" },
  { action: "Nouveau candidat inscrit — Lycée Classique", actor: "Système", time: "Il y a 1h", status: "info" },
  { action: "Scan QR Code — Accès Palais de la Culture", actor: "Contrôleur Entrée A", time: "Il y a 1h30", status: "success" },
  { action: "Dossier en attente de validation — Université NA", actor: "Système", time: "Il y a 3h", status: "pending" },
  { action: "Note insérée — Génie en Herbe Demi-finale", actor: "Jury Académique", time: "Il y a 5h", status: "success" },
];

const NAV_ITEMS: NavItem[] = [
  { icon: <LayoutDashboard size={17} />, label: "Tableau de bord", href: "#" },
  { icon: <GraduationCap size={17} />, label: "Inscriptions / Candidats", href: "#" },
  { icon: <Crown size={17} />, label: "Concours d'Élégance", href: "#" },
  { icon: <Brain size={17} />, label: "Génie en Herbe", href: "#" },
  { icon: <Utensils size={17} />, label: "Danses & Cuisine", href: "#" },
  { icon: <ClipboardList size={17} />, label: "Saisie des Notes", href: "#" },
  { icon: <ScanLine size={17} />, label: "Scanner QR Code", href: "#" },
  { icon: <BarChart3 size={17} />, label: "Statistiques Globales", href: "#" },
  { icon: <History size={17} />, label: "Historique des Activités", href: "#" },
];

export default function HomePage() {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);

  const userName = session?.user?.email?.split("@")[0] || "Visiteur";

  const statusBadge = session?.user
    ? { label: "Compte Actif", color: "bg-emerald-100 text-emerald-700", icon: <CheckCircle size={12} /> }
    : { label: "Non connecté", color: "bg-gray-100 text-gray-500", icon: <AlertCircle size={12} /> };

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex font-sans">

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ━━━━━━━━━━━━ SIDEBAR ━━━━━━━━━━━━ */}
      <aside className={`fixed top-0 left-0 h-full w-64 z-30 flex flex-col transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static
        bg-white border-r border-gray-100 shadow-2xl lg:shadow-none`}>

        <div className="flex flex-col items-center justify-center pt-6 pb-2 px-4">
          <div className="w-52 h-52 flex items-center justify-center drop-shadow-sm">
            <img src="/logo.png" alt="logo" className="w-full h-full object-contain" />
          </div>
          <div className="text-center mt-1">
            <p className="font-black text-gray-900 text-sm tracking-widest uppercase">QITAA</p>
            <p className="text-xs text-orange-400 font-semibold tracking-wider">Édition 2027</p>
          </div>
        </div>

        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-1" />

        <div className="px-4 py-3">
          <div className="flex items-center gap-3 p-2.5 bg-orange-50 rounded-2xl border border-orange-100">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-white font-bold text-xs uppercase">{userName[0]}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-gray-800 text-xs truncate capitalize">{userName}</p>
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-full ${statusBadge.color}`}>
                {statusBadge.icon}
                {statusBadge.label}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
          {NAV_ITEMS.map((item, i) => (
            <button
              key={i}
              onClick={() => setActiveNav(i)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group
                ${activeNav === i
                  ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-200"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}
            >
              <span className={`flex-shrink-0 transition-colors ${activeNav === i ? "text-white" : "text-gray-400 group-hover:text-orange-500"}`}>
                {item.icon}
              </span>
              <span className="text-sm font-medium truncate">{item.label}</span>
              {activeNav === i && <ChevronRight size={13} className="ml-auto text-white/60" />}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100">
          {session?.user ? (
            <button onClick={() => signOut({ callbackUrl: "/login" })} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-all duration-150">
              <LogOut size={16} />
              <span className="text-sm font-semibold">Déconnexion</span>
            </button>
          ) : (
            <button onClick={() => window.location.href = "/login"} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-orange-500 hover:bg-orange-50 transition-all duration-150">
              <LogOut size={16} />
              <span className="text-sm font-semibold">Se connecter</span>
            </button>
          )}
        </div>
      </aside>

      {/* ━━━━━━━━━━━━ MAIN ━━━━━━━━━━━━ */}
      <main className="flex-1 min-w-0 flex flex-col">

        <header className="sticky top-0 z-10 bg-white/70 backdrop-blur-xl border-b border-gray-100/80 px-4 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
              <Menu size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-gray-900 text-lg leading-none">Tableau de bord</h1>
                <span className="hidden sm:inline-flex items-center gap-1 bg-orange-50 text-orange-500 text-xs font-bold px-2 py-0.5 rounded-full border border-orange-100">
                  <Sparkles size={10} />
                  LIVE
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Bienvenue sur QITAA 2027</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
                <Bell size={19} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-white animate-pulse" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-bold text-gray-800 text-sm">Notifications</p>
                    <span className="text-xs bg-orange-100 text-orange-600 font-bold px-2 py-0.5 rounded-full">3 nouvelles</span>
                  </div>
                  <div className="space-y-3">
                    {ACTIVITIES.slice(0, 3).map((a, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-default">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.status === "success" ? "bg-emerald-400" : a.status === "pending" ? "bg-yellow-400" : "bg-blue-400"}`} />
                        <div>
                          <p className="text-xs text-gray-700 leading-snug font-medium">{a.action}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center cursor-pointer shadow-md shadow-orange-200">
              <span className="text-white font-bold text-sm uppercase">{userName[0]}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 space-y-6">

          {/* ── Stats avec BorderBeam ── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-gray-700 uppercase tracking-widest">Vue d'ensemble</h2>
              <span className="text-xs text-gray-400 bg-white border border-gray-100 px-3 py-1 rounded-full font-medium shadow-sm">
                Mise à jour en direct
              </span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              {STATS.map((stat, i) => (
                <div
                  key={i}
                  className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-4 lg:p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-default group overflow-hidden"
                >
                  {/* ✨ BorderBeam effect */}
                  <BorderBeam
                    size={120}
                    duration={8}
                    delay={i * 2}
                    colorFrom={stat.colorFrom}
                    colorTo={stat.colorTo}
                    borderWidth={1.5}
                  />

                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-white">{stat.icon}</span>
                  </div>
                  <p className="text-2xl lg:text-3xl font-black text-gray-900 leading-none mb-1">{stat.value}</p>
                  <p className="text-xs font-semibold text-gray-500 mb-1.5">{stat.label}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <TrendingUp size={10} className="text-emerald-500" />
                    {stat.trend}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Historique ── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-gray-700 uppercase tracking-widest">Historique récent</h2>
              <button className="text-xs text-orange-500 font-bold hover:text-orange-600 transition-colors bg-orange-50 px-3 py-1 rounded-full border border-orange-100 hover:bg-orange-100">
                Voir tout →
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="hidden sm:grid grid-cols-4 px-5 py-3 bg-gray-50/80 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest col-span-2">Action</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Auteur</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Heure</p>
              </div>
              {ACTIVITIES.map((a, i) => {
                const statusConfig = {
                  success: { bg: "bg-emerald-100", text: "text-emerald-600", icon: <CheckCircle size={13} /> },
                  pending: { bg: "bg-amber-100", text: "text-amber-600", icon: <Clock size={13} /> },
                  info: { bg: "bg-blue-100", text: "text-blue-600", icon: <AlertCircle size={13} /> },
                }[a.status];
                return (
                  <div key={i} className={`px-5 py-3.5 hover:bg-orange-50/30 transition-colors duration-150 cursor-default ${i !== ACTIVITIES.length - 1 ? "border-b border-gray-50" : ""}`}>
                    <div className="sm:hidden">
                      <div className="flex items-start gap-3">
                        <span className={`mt-0.5 p-1.5 rounded-lg ${statusConfig.bg} ${statusConfig.text} flex-shrink-0`}>{statusConfig.icon}</span>
                        <div>
                          <p className="text-sm text-gray-700 font-semibold leading-snug">{a.action}</p>
                          <p className="text-xs text-gray-400 mt-1">{a.actor} · {a.time}</p>
                        </div>
                      </div>
                    </div>
                    <div className="hidden sm:grid grid-cols-4 items-center">
                      <div className="col-span-2 flex items-center gap-3">
                        <span className={`p-1.5 rounded-lg ${statusConfig.bg} ${statusConfig.text} flex-shrink-0`}>{statusConfig.icon}</span>
                        <p className="text-sm text-gray-700 font-medium truncate">{a.action}</p>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{a.actor}</p>
                      <p className="text-xs text-gray-400">{a.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <footer className="text-center py-6">
            <div className="inline-flex items-center gap-2 text-xs text-gray-300 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
              QITAA 2027 · Plateforme officielle · Abidjan, Côte d'Ivoire 🇨🇮
            </div>
          </footer>

        </div>
      </main>
    </div>
  );
}