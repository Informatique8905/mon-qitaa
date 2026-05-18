import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/lib/models/User'
import Candidat from '@/lib/models/Candidat'
import { hashPassword, generateToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    
    const { email, password, nom, prenom } = await req.json()

    if (!email || !password || !nom || !prenom) {
      return NextResponse.json(
        { error: 'Tous les champs sont obligatoires' },
        { status: 400 }
      )
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      )
    }

    const hashedPassword = await hashPassword(password)
    
    const user = await User.create({
      email,
      password: hashedPassword,
      role: 'candidat'
    })

    await Candidat.create({
      userId: user._id,
      nom,
      prenom,
    })

    const token = generateToken({ userId: user._id.toString(), role: user.role })

    return NextResponse.json({ token, role: user.role }, { status: 201 })

  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}