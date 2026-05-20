import mongoose, { Schema, Model, Document } from 'mongoose'

export interface ICandidat extends Document {
  userId: mongoose.Types.ObjectId
  nom: string
  prenom: string
  epreuve: string
  carteEtudiantUrl: string
  qrCode: string
  isPresent: boolean
}

const CandidatSchema = new Schema(
  {
    userId:           { type: Schema.Types.ObjectId, ref: 'User', required: true },
    nom:              { type: String, default: '' },
    prenom:           { type: String, default: '' },
    epreuve:          { type: String, default: '' },
    carteEtudiantUrl: { type: String, default: '' },
    qrCode:           { type: String, default: '' },
    isPresent:        { type: Boolean, default: false },
  },
  { timestamps: true }
)

const Candidat: Model<ICandidat> =
  mongoose.models.Candidat || mongoose.model<ICandidat>('Candidat', CandidatSchema)

export default Candidat