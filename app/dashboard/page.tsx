'use client'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()

  function handleLogout() {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">
            Déconnexion
          </button>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <p className="text-gray-300">Bienvenue sur votre espace candidat !</p>
        </div>
      </div>
    </div>
  )
}