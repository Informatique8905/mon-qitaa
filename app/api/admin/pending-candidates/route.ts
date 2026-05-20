import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Candidat from "@/lib/models/Candidat";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  await dbConnect();

  const candidats = await Candidat.find({ isValidated: false })
    .select("nom prenom email etablissement carteEtudiantUrl createdAt")
    .sort({ createdAt: -1 });

  return NextResponse.json({ candidats }, { status: 200 });
}