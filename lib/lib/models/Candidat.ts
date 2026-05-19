import mongoose, { Schema, Document } from 'mongoose'

export interface ICandidat extends Document {
  userId: mongoose.Types.ObjectId
  nom: string
  prenom: string
  photo: string
  carteEtudiant: string
  statut: 'PENDING' | 'VALIDATED' | 'REJECTED'
  qrCode: string
  createdAt: Date
}

const CandidatSchema = new Schema<ICandidat>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  photo: { type: String, default: '' },
  carteEtudiant: { type: String, default: '' },
  statut: { 
    type: String, 
    enum: ['PENDING', 'VALIDATED', 'REJECTED'], 
    default: 'PENDING' 
  },
  qrCode: { type: String, default: '' },
}, { timestamps: true })

export default mongoose.models.Candidat || mongoose.model<ICandidat>('Candidat', CandidatSchema)
