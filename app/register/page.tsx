'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error)
      return
    }

    document.cookie = `token=${data.token}; path=/`
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6">Inscription</h1>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full p-3 rounded bg-gray-700 text-white" placeholder="Nom" value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} />
          <input className="w-full p-3 rounded bg-gray-700 text-white" placeholder="Prénom" value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} />
          <input className="w-full p-3 rounded bg-gray-700 text-white" placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <input className="w-full p-3 rounded bg-gray-700 text-white" placeholder="Mot de passe" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700">
            {loading ? 'Chargement...' : "S'inscrire"}
          </button>
        </form>
        <p className="text-gray-400 mt-4 text-center">Déjà un compte ? <a href="/login" className="text-blue-400">Se connecter</a></p>
      </div>
    </div>
  )
}