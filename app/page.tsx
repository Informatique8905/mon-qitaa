"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  Crown,
  Brain,
  Globe2,
  ClipboardEdit,
  QrCode,
  BarChart3,
  ScrollText,
  Bell,
  LogOut,
  CheckCircle2,
  ScanLine,
  AlertTriangle,
  FileText,
  TrendingUp,
} from "lucide-react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

// ─── Types ────────────────────────────────────────────────────
type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  section?: string;
};

type HistoryRow = {
  action: string;
  school: string;
  type: "valid" | "note" | "scan" | "alert";
  time: string;
};

// ─── Data ─────────────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Tableau de bord",
    icon: <LayoutDashboard size={15} />,
    section: "Navigation",
  },
  {
    id: "inscriptions",
    label: "Inscriptions / Candidats",
    icon: <GraduationCap size={15} />,
  },
  {
    id: "elegance",
    label: "Concours d'Élégance",
    icon: <Crown size={15} />,
  },
  {
    id: "genie",
    label: "Génie en Herbe",
    icon: <Brain size={15} />,
  },
  {
    id: "danses",
    label: "Danses & Cuisine",
    icon: <Globe2 size={15} />,
  },
  {
    id: "notes",
    label: "Saisie des Notes",
    icon: <ClipboardEdit size={15} />,
    section: "Outils",
  },
  {
    id: "qr",
    label: "Scanner QR Code",
    icon: <QrCode size={15} />,
  },
  {
    id: "stats",
    label: "Statistiques Globales",
    icon: <BarChart3 size={15} />,
  },
  {
    id: "historique",
    label: "Historique Activités",
    icon: <ScrollText size={15} />,
  },
];

const HISTORY: HistoryRow[] = [
  {
    action: "Validation dossier",
    school: "Lycée Sainte-Marie",
    type: "valid",
    time: "08h34",
  },
  {
    action: "Notes saisies jury",
    school: "Épreuve Génie – J2",
    type: "note",
    time: "09h12",
  },
  {
    action: "Scan QR Entrée",
    school: "Agent Koné B.",
    type: "scan",
    time: "09h47",
  },
  {
    action: "École inscrite",
    school: "Collège Moderne Yop.",
    type: "valid",
    time: "10h03",
  },
  {
    action: "Alerte jury manquant",
    school: "Table 4 – Danse",
    type: "alert",
    time: "10h21",
  },
];

const TYPE_CONFIG = {
  valid: {
    label: "Validé",
    icon: <CheckCircle2 size={11} />,
    className: "bg-green-50 text-green-700 border border-green-200",
  },
  note: {
    label: "Notes",
    icon: <FileText size={11} />,
    className: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  scan: {
    label: "Scan",
    icon: <ScanLine size={11} />,
    className: "bg-purple-50 text-purple-700 border border-purple-200",
  },
  alert: {
    label: "Alerte",
    icon: <AlertTriangle size={11} />,
    className: "bg-orange-50 text-orange-700 border border-orange-200",
  },
};

// ─── Page ─────────────────────────────────────────────────────
export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState("dashboard");
  let lastSection = "";

  return (
    <div className="flex h-screen bg-[#f8f7f4] overflow-hidden font-sans">
      {/* ── SIDEBAR ── */}
      <aside className="w-[220px] flex-shrink-0 bg-white border-r border-gray-100 flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center text-white font-extrabold text-sm tracking-tight">
              Q
            </div>
            <span className="text-[15px] font-bold text-gray-900 tracking-tight">
              QITAA <span className="text-orange-500">2026</span>
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-600 text-[9px] font-semibold px-2.5 py-1 rounded-full border border-orange-100 uppercase tracking-wide">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
            Vue Concepteur
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2.5 py-3 overflow-y-auto flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const showSection = item.section && item.section !== lastSection;
            if (item.section) lastSection = item.section;
            return (
              <React.Fragment key={item.id}>
                {showSection && (
                  <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest px-2 pt-3 pb-1">
                    {item.section}
                  </p>
                )}
                <button
                  onClick={() => setActiveNav(item.id)}
                  className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-[12.5px] transition-all duration-150 text-left ${
                    activeNav === item.id
                      ? "bg-orange-50 text-orange-600 font-semibold"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800 font-normal"
                  }`}
                >
                  <span className={activeNav === item.id ? "text-orange-500" : "text-gray-400"}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              </React.Fragment>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-3.5 border-t border-gray-100">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              CP
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">Concepteur Pro</p>
              <p className="text-[10px] text-gray-400">Accès complet · Admin</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-gray-200 text-[11px] text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all duration-150">
            <LogOut size={12} /> Se déconnecter
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-[60px] bg-white border-b border-gray-100 px-6 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-[17px] font-bold text-gray-900 tracking-tight">
              Tableau de bord QITAA 2026
            </h1>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Abidjan · Palais de la Culture · Édition 2026
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-[11px] font-medium px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Système Actif
            </span>
            <button className="relative w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-all">
              <Bell size={16} className="text-gray-500" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-orange-500 border-2 border-white rounded-full text-[7px] text-white flex items-center justify-center font-bold">
                3
              </span>
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-4 gap-3">
            {[
              {
                emoji: "🏫",
                label: "Établissements",
                value: "32",
                sub: "↑ +4 vs 2025",
                bg: "bg-orange-50",
              },
              {
                emoji: "🎓",
                label: "Candidats validés",
                value: "1 245",
                sub: "↑ +12% vs 2025",
                bg: "bg-blue-50",
              },
              {
                emoji: "🧮",
                label: "Moyenne épreuves",
                value: "284/400",
                sub: "Score moyen général",
                bg: "bg-green-50",
              },
              {
                emoji: "🏛️",
                label: "Accès Palais Culture",
                value: "94.2%",
                sub: "Taux élevé · excellent",
                bg: "bg-purple-50",
              },
            ].map((card) => (
              <div
                key={card.label}
                className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-orange-300 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 cursor-default"
              >
                <div className={`w-9 h-9 ${card.bg} rounded-xl flex items-center justify-center text-lg mb-3`}>
                  {card.emoji}
                </div>
                <p className="text-[10.5px] text-gray-400 font-medium uppercase tracking-wide mb-1">
                  {card.label}
                </p>
                <p className="text-[22px] font-bold text-gray-900 tracking-tight leading-none">
                  {card.value}
                </p>
                <p className="text-[10px] text-green-600 font-medium mt-1.5 flex items-center gap-1">
                  <TrendingUp size={10} />
                  {card.sub}
                </p>
              </div>
            ))}
          </div>

          {/* ── Banner ── */}
          <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 rounded-2xl px-7 py-5 flex items-center justify-between relative overflow-hidden">
            <div
              className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 bg-white"
              style={{ transform: "translate(30%, -30%)" }}
            />
            <div
              className="absolute bottom-0 left-1/3 w-28 h-28 rounded-full opacity-5 bg-white"
              style={{ transform: "translate(0, 40%)" }}
            />
            <div className="relative">
              <p className="text-[10px] font-bold text-orange-200 uppercase tracking-[3px] mb-1.5">
                Slogan officiel 2026
              </p>
              <p className="text-white text-[17px] font-bold tracking-tight max-w-lg leading-snug">
                "Quand l'intelligence et la tradition réconcilient la jeunesse."
              </p>
            </div>
            <div className="relative bg-white/15 border border-white/30 text-white text-sm font-semibold px-4 py-2 rounded-full backdrop-blur-sm flex-shrink-0">
              🏆 QITAA 2026
            </div>
          </div>

          {/* ── Bottom Grid ── */}
          <div className="grid grid-cols-2 gap-4">

            {/* History Table */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                <span className="text-[13px] font-bold text-gray-900">
                  📜 Historique récent
                </span>
                <span className="text-[10px] bg-orange-50 text-orange-600 border border-orange-100 px-2.5 py-0.5 rounded-full font-semibold">
                  Dernières actions
                </span>
              </div>
              <table className="w-full text-[11.5px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-2.5 text-[9.5px] font-semibold text-gray-400 uppercase tracking-widest">Action</th>
                    <th className="text-left px-3 py-2.5 text-[9.5px] font-semibold text-gray-400 uppercase tracking-widest">École / Agent</th>
                    <th className="text-left px-3 py-2.5 text-[9.5px] font-semibold text-gray-400 uppercase tracking-widest">Type</th>
                    <th className="text-left px-3 py-2.5 text-[9.5px] font-semibold text-gray-400 uppercase tracking-widest">Heure</th>
                  </tr>
                </thead>
                <tbody>
                  {HISTORY.map((row, i) => {
                    const cfg = TYPE_CONFIG[row.type];
                    return (
                      <tr
                        key={i}
                        className="border-b border-gray-50 hover:bg-orange-50/40 transition-colors"
                      >
                        <td className="px-5 py-2.5 text-gray-700 font-medium">{row.action}</td>
                        <td className="px-3 py-2.5 text-gray-500">{row.school}</td>
                        <td className="px-3 py-2.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.className}`}>
                            {cfg.icon} {cfg.label}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-gray-400 text-[10.5px]">{row.time}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ContainerScroll Section */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100">
                <p className="text-[9px] font-bold text-orange-500 uppercase tracking-[2px] mb-0.5">
                  ✦ Vitrine Officielle
                </p>
                <p className="text-[13px] font-bold text-gray-900">
                  Découvrez l'expérience QITAA 2026
                </p>
              </div>

              {/* ContainerScroll — animation 3D au scroll */}
              <div className="px-4 pb-4">
                <ContainerScroll
                  titleComponent={
                    <div className="text-center py-3">
                      <p className="text-xs text-orange-500 font-semibold uppercase tracking-widest mb-1">
                        Palais de la Culture · Abidjan
                      </p>
                      <h2 className="text-xl font-extrabold text-gray-900 tracking-tight leading-tight">
                        L'intelligence au cœur<br />
                        <span className="text-orange-500">de la tradition</span>
                      </h2>
                    </div>
                  }
                >
                  <div className="relative w-full h-full">
                    <img
                      src="https://images.unsplash.com/photo-1531058020387-3be344556be6?w=900&q=80"
                      alt="Festival culturel QITAA 2026 – jeunesse d'Abidjan"
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-600/60 via-transparent rounded-xl flex items-end p-5">
                      <div>
                        <p className="text-white font-bold text-base tracking-tight">
                          Festival QITAA 2026
                        </p>
                        <p className="text-orange-100 text-xs mt-0.5">
                          Palais de la Culture · Abidjan, Côte d'Ivoire
                        </p>
                      </div>
                    </div>
                  </div>
                </ContainerScroll>

                {/* Mini stats sous l'image */}
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[
                    { val: "32", lbl: "Établissements", color: "text-orange-500" },
                    { val: "1 245", lbl: "Candidats", color: "text-gray-900" },
                    { val: "94%", lbl: "Accès Palais", color: "text-green-600" },
                  ].map((s) => (
                    <div
                      key={s.lbl}
                      className="bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-center"
                    >
                      <p className={`text-[17px] font-bold ${s.color} tracking-tight leading-none`}>
                        {s.val}
                      </p>
                      <p className="text-[9px] text-gray-400 mt-1 leading-tight">{s.lbl}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}