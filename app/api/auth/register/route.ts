import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/lib/models/User'
import Candidat from '@/lib/models/Candidat'

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const { nom, email, password, etablissement, matricule, categorie } = await req.json()

    if (!nom || !email || !password || !etablissement || !matricule || !categorie) {
      return NextResponse.json(
        { error: 'Tous les champs sont obligatoires' },
        { status: 400 }
      )
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est deja utilise' },
        { status: 400 }
      )
    }

    const user = new User({
      nom,
      email,
      password,
      etablissement,
      role: 'candidat',
      isValidated: false,
    })
    await user.save()

    await Candidat.create({
      userId: user._id,
      nom,
      etablissement,
      matricule,
      categorie,
    })

    return NextResponse.json(
      { message: 'Inscription reussie. En attente de validation.' },
      { status: 201 }
    )

  } catch (error) {
    console.error('[REGISTER ERROR]', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}