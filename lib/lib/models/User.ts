import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  password: string
  role: 'candidat' | 'controleur' | 'jury' | 'admin'
  createdAt: Date
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['candidat', 'controleur', 'jury', 'admin'], 
    default: 'candidat' 
  },
}, { timestamps: true })

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
