'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import LoginEffects from '@/components/ui/login-effects'

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  // Redirection automatique si session déjà active
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const role = (session.user as any)?.role
      const redirectMap: Record<string, string> = {
        candidat: '/dashboard/candidat',
        admin: '/dashboard/admin',
        jury: '/dashboard/jury',
        controleur: '/dashboard/controleur',
      }
      router.push(redirectMap[role] ?? '/dashboard')
    }
  }, [status, session, router])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const pts = Array.from({ length: 28 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.4 + 0.1,
      opacity: Math.random() * 0.35 + 0.05,
    }))
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pts.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(249,115,22,${p.opacity})`
        ctx.fill()
        p.y -= p.speed
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width }
      })
      animRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  const playSound = (freq = 520) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(freq * 1.3, ctx.currentTime + 0.08)
      gain.gain.setValueAtTime(0.06, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18)
      osc.start(); osc.stop(ctx.currentTime + 0.18)
    } catch {}
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    playSound(480)
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (result?.error) {
      setLoading(false)
      setError('Email ou mot de passe incorrect')
      playSound(220)
    } else {
      playSound(660)
      // La redirection est gérée par le useEffect qui surveille la session
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .qitaa-body { min-height: 100vh; background: #ffffff; display: flex; font-family: 'DM Sans', sans-serif; overflow: hidden; position: relative; }
        .form-panel { flex: 1; display: flex; align-items: center; justify-content: center; padding: 48px 40px; position: relative; z-index: 1; background: #ffffff; }
        .form-card { width: 100%; max-width: 420px; opacity: 0; transform: translateX(-30px); animation: slideIn 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s forwards; }
        .logo-wrap { display: flex; justify-content: center; margin-bottom: 32px; animation: float 5s ease-in-out infinite; }
        .logo-ring { width: 160px; height: 160px; border-radius: 50%; background: #fff7ed; border: 2px solid #fed7aa; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(249,115,22,0.15); }
        .form-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #f97316; margin-bottom: 10px; text-align: center; }
        .form-title { font-family: 'Sora', sans-serif; font-size: 30px; font-weight: 700; color: #0f0a00; letter-spacing: -0.5px; line-height: 1.2; margin-bottom: 8px; text-align: center; }
        .form-subtitle { font-size: 14px; color: #9ca3af; line-height: 1.55; margin-bottom: 36px; text-align: center; }
        .field-group { margin-bottom: 20px; }
        .field-label { display: block; font-size: 11.5px; font-weight: 600; letter-spacing: 0.5px; color: #4b5563; margin-bottom: 7px; text-transform: uppercase; }
        .input-wrap { position: relative; }
        .input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 16px; color: #d1d5db; transition: color 0.2s; pointer-events: none; }
        .input-wrap:focus-within .input-icon { color: #f97316; }
        .field-input { width: 100%; padding: 14px 16px 14px 46px; border-radius: 12px; border: 1.5px solid #f3f4f6; background: #fafafa; font-size: 15px; color: #0f0a00; font-family: 'DM Sans', sans-serif; transition: all 0.25s; outline: none; }
        .field-input::placeholder { color: #d1d5db; }
        .field-input:focus { border-color: #f97316; background: #fff; box-shadow: 0 0 0 4px rgba(249,115,22,0.1); }
        .field-input.has-error { border-color: #ef4444; box-shadow: 0 0 0 4px rgba(239,68,68,0.1); animation: shake 0.4s ease; }
        .eye-btn { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; color: #9ca3af; transition: color 0.2s; font-size: 17px; }
        .eye-btn:hover { color: #f97316; }
        .forgot-row { display: flex; justify-content: flex-end; margin-top: 8px; }
        .forgot-link { font-size: 12.5px; color: #f97316; text-decoration: none; font-weight: 500; transition: color 0.2s; }
        .forgot-link:hover { color: #ea6c0a; text-decoration: underline; }
        .error-box { background: #fff5f5; border: 1px solid #fecaca; border-radius: 10px; padding: 12px 16px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; font-size: 13.5px; color: #dc2626; }
        .submit-btn { width: 100%; padding: 15px; background: #f97316; color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 700; font-family: 'Sora', sans-serif; cursor: pointer; letter-spacing: 0.3px; position: relative; overflow: hidden; transition: all 0.25s; margin-top: 8px; }
        .submit-btn:hover:not(:disabled) { background: #ea6c0a; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(249,115,22,0.45); }
        .submit-btn:disabled { background: #e5e7eb; color: #9ca3af; cursor: not-allowed; }
        .loading-dots span { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #9ca3af; margin: 0 2px; animation: bounce 1.2s infinite; }
        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
        .divider { display: flex; align-items: center; gap: 12px; margin: 24px 0; }
        .divider-line { flex: 1; height: 1px; background: #f3f4f6; }
        .divider-text { font-size: 12px; color: #d1d5db; font-weight: 500; }
        .register-link { text-align: center; font-size: 14px; color: #9ca3af; }
        .register-link a { color: #f97316; font-weight: 700; text-decoration: none; }
        .register-link a:hover { color: #ea6c0a; text-decoration: underline; }
        .side-panel { width: 46%; position: relative; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 60px 50px; overflow: hidden; flex-shrink: 0; }
.side-bg {
  position: absolute;
  inset: 0;

  /* IMAGE */
  background-image:
    linear-gradient(
      160deg,
      rgba(10,4,0,0.88) 0%,
      rgba(30,10,0,0.80) 40%,
      rgba(100,40,0,0.70) 75%,
      rgba(180,80,0,0.60) 100%
    ),
    url('/PHOTO.jpeg');

  /* ADAPTATION */
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;

  /* EFFET PREMIUM */
  transform: scale(1.03);
  transition: transform 6s ease;

  z-index: 0;
}

/* Animation élégante */
.side-panel:hover .side-bg {
  transform: scale(1.08);
}
          .side-overlay { position: absolute; inset: 0; background: linear-gradient(160deg, rgba(10,4,0,0.88) 0%, rgba(30,10,0,0.80) 40%, rgba(100,40,0,0.70) 75%, rgba(180,80,0,0.60) 100%); z-index: 1; }
        .side-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(249,115,22,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.06) 1px, transparent 1px); background-size: 48px 48px; z-index: 2; }
        .side-content { position: relative; z-index: 3; text-align: center; }
        .side-title { font-family: 'Sora', sans-serif; font-size: 26px; font-weight: 700; color: #fff; line-height: 1.3; margin-bottom: 14px; letter-spacing: -0.3px; }
        .side-title span { color: #f97316; }
        .side-desc { font-size: 13.5px; color: rgba(255,255,255,0.55); line-height: 1.75; max-width: 270px; margin: 0 auto 36px; }
        .features-list { text-align: left; }
        .feature-item { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 18px; opacity: 0; animation: fadeUp 0.5s ease forwards; }
        .feature-item:nth-child(1) { animation-delay: 0.3s; }
        .feature-item:nth-child(2) { animation-delay: 0.5s; }
        .feature-item:nth-child(3) { animation-delay: 0.7s; }
        .feature-icon { width: 38px; height: 38px; border-radius: 10px; background: rgba(249,115,22,0.18); border: 1px solid rgba(249,115,22,0.25); display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0; }
        .feature-text { font-size: 13px; color: rgba(255,255,255,0.68); line-height: 1.5; }
        .feature-text strong { color: #fff; font-weight: 600; display: block; margin-bottom: 2px; }
        @keyframes slideIn { to { opacity: 1; transform: translateX(0); } }
        @keyframes shake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-8px); } 40% { transform: translateX(8px); } 60% { transform: translateX(-5px); } 80% { transform: translateX(5px); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes bounce { 0%,80%,100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 768px) { .side-panel { display: none; } .form-panel { padding: 28px 24px; } }
      `}</style>

      <div className="qitaa-body">
        <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.6 }} />

        <div className="form-panel">
          <div className="form-card">
            <div className="logo-wrap">
              <div className="logo-ring">
                <Image src="/logo.png" alt="QITAA" width={104} height={104} style={{ objectFit: 'contain' }} priority />
              </div>
            </div>
            <div className="form-eyebrow">Espace participant</div>
            <h1 className="form-title">Bon retour</h1>
            <p className="form-subtitle">Accédez à votre espace QITAA.</p>

            {error && (
              <div className="error-box">
                <span style={{ fontSize: '18px' }}>⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="field-group">
                <label className="field-label">Adresse email</label>
                <div className="input-wrap">
                  <span className="input-icon">✉️</span>
                  <input
                    className={`field-input${error ? ' has-error' : ''}`}
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => playSound(440)}
                    required
                    placeholder="ton@email.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Mot de passe</label>
                <div className="input-wrap">
                  <span className="input-icon">🔑</span>
                  <input
                    className={`field-input${error ? ' has-error' : ''}`}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => playSound(460)}
                    required
                    placeholder="••••••••"
                    autoComplete="current-password"
                    style={{ paddingRight: '44px' }}
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                <div className="forgot-row">
                  <a href="/forgot-password" className="forgot-link">Mot de passe oublié ?</a>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? <span className="loading-dots"><span /><span /><span /></span> : 'Se connecter →'}
              </button>
            </form>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">ou</span>
              <div className="divider-line" />
            </div>

            <p className="register-link">
              Pas encore de compte ?{' '}
              <a href="/register">S'inscrire au concours</a>
            </p>
          </div>
        </div>

        <div className="side-panel">
          <div className="side-bg" />
          <div className="side-grid" />
          <div className="side-content">
            <h2 className="side-title">
              Quand l'intelligence et la tradition<br />
              <span>réconcilient la jeunesse.</span>
            </h2>
            <p className="side-desc">
              Représente ta région, valorise ton savoir-faire et vis une immersion
              culturelle unique au coeur de nos traditions.
            </p>
            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">🧠</div>
                <div className="feature-text">
                  <strong>Savoir & Esprit d'Équipe</strong>
                  Défie les meilleures universités et lycées de Côte d'Ivoire lors des épreuves de Génie en herbe.
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🌍</div>
                <div className="feature-text">
                  <strong>Retour aux Sources</strong>
                  Vis une immersion totale dans nos villages pour apprendre nos danses, chants et arts culinaires.
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🤝</div>
                <div className="feature-text">
                  <strong>Cohésion & Fierté</strong>
                  Unis ta génération autour des valeurs qui font la richesse de notre culture.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
