import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Candidat from "@/lib/models/Candidat";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { candidatId, action } = await req.json(); // action: "validate" | "reject"

  if (!candidatId || !["validate", "reject"].includes(action)) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  await dbConnect();

  if (action === "validate") {
    await Candidat.findByIdAndUpdate(candidatId, { isValidated: true });
    return NextResponse.json({ message: "Candidat validé ✅" }, { status: 200 });
  }

  if (action === "reject") {
    await Candidat.findByIdAndDelete(candidatId);
    return NextResponse.json({ message: "Candidat rejeté et supprimé ❌" }, { status: 200 });
  }
}