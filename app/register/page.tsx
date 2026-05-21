'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    nom: '',
    email: '',
    password: '',
    etablissement: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [strength, setStrength] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const pts = Array.from({length: 22}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.5 + 0.8,
      speed: Math.random() * 0.35 + 0.08,
      opacity: Math.random() * 0.3 + 0.04,
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

  const checkStrength = (pwd: string) => {
    let s = 0
    if (pwd.length >= 8) s++
    if (/[A-Z]/.test(pwd)) s++
    if (/[0-9]/.test(pwd)) s++
    if (/[^A-Za-z0-9]/.test(pwd)) s++
    setStrength(s)
  }

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (name === 'password') checkStrength(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    playSound(480)
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, role: 'candidat' }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.error || "Erreur lors de l'inscription")
      playSound(220)
    } else {
      playSound(660)
      router.push('/login')
    }
  }

  const strengthColors = ['#e5e7eb','#ef4444','#f97316','#eab308','#22c55e']
  const strengthLabels = ['','Trop faible','Faible','Moyen','Fort 💪']

  const etablissements = [
    'Université Félix Houphouët-Boigny',
    'Université Nord-Sud',
    'Université Nangui Abrogoua',
    'Université Alassane Ouattara',
    'Université Jean Lorougnon Guédé',
    'Institut National Polytechnique Félix Houphouët-Boigny',
    "Lycée Classique d'Abidjan",
    "Lycée Technique d'Abidjan",
    'Lycée Sainte-Marie de Cocody',
    'Lycée Moderne de Yamoussoukro',
    'Autre établissement',
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .qitaa-body {
          min-height: 100vh; background: #ffffff;
          display: flex; font-family: 'DM Sans', sans-serif;
          overflow: hidden; position: relative;
        }
        .form-panel {
          flex: 1; display: flex; align-items: center;
          justify-content: center; padding: 40px;
          position: relative; z-index: 1; overflow-y: auto;
        }
        .form-card {
          width: 100%; max-width: 460px;
          opacity: 0; transform: translateX(-30px);
          animation: slideIn 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s forwards;
          padding: 20px 0;
        }
        .side-panel {
          width: 44%; position: relative;
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          padding: 60px 50px; overflow: hidden; flex-shrink: 0;
        }

        /* ── MODIFICATION 1 : intensité du noir réduite ── */
        .side-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(
              160deg,
              rgba(10,4,0,0.35) 0%,
              rgba(30,10,0,0.28) 40%,
              rgba(100,40,0,0.22) 75%,
              rgba(180,80,0,0.18) 100%
            ),
            url('/PHOTO.jpeg');
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          transform: scale(1.03);
          transition: transform 6s ease;
          z-index: 0;
        }
        .side-panel:hover .side-bg {
          transform: scale(1.08);
        }

        /* overlay également allégé */
        .side-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            160deg,
            rgba(10,4,0,0.40) 0%,
            rgba(30,10,0,0.32) 40%,
            rgba(100,40,0,0.22) 75%,
            rgba(180,80,0,0.18) 100%
          );
          z-index: 1;
        }

        .side-grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(249,115,22,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,0.06) 1px,transparent 1px);
          background-size: 48px 48px; z-index: 2;
        }
        .side-panel::before {
          content: ''; position: absolute;
          width: 420px; height: 420px; border-radius: 50%;
          background: radial-gradient(circle,rgba(249,115,22,0.18) 0%,transparent 70%);
          top: -80px; left: -80px; z-index: 2;
        }
        .side-content { position: relative; z-index: 3; text-align: center; }

        /* ── MODIFICATION 2 : logo droite 4× plus grand ── */
        .side-logo-wrap {
          margin: 0 auto 28px;
          animation: float 5s ease-in-out infinite;
          width: 160px; height: 160px; position: relative;
        }

        .side-title {
          font-family: 'Sora', sans-serif; font-size: 26px; font-weight: 700;
          color: #fff; line-height: 1.3; margin-bottom: 14px; letter-spacing: -0.3px;
        }
        .side-title span { color: #f97316; }
        .side-desc {
          font-size: 13.5px; color: rgba(255,255,255,0.75);
          line-height: 1.75; max-width: 270px; margin: 0 auto 36px;
        }
        .features-list { text-align: left; }
        .feature-item {
          display: flex; align-items: flex-start; gap: 12px;
          margin-bottom: 18px; opacity: 0; animation: fadeUp 0.5s ease forwards;
        }
        .feature-item:nth-child(1) { animation-delay: 0.3s; }
        .feature-item:nth-child(2) { animation-delay: 0.5s; }
        .feature-item:nth-child(3) { animation-delay: 0.7s; }
        .feature-icon {
          width: 38px; height: 38px; border-radius: 10px;
          background: rgba(249,115,22,0.18); border: 1px solid rgba(249,115,22,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 17px; flex-shrink: 0; margin-top: 2px;
        }
        .feature-text { font-size: 13px; color: rgba(255,255,255,0.82); line-height: 1.5; }
        .feature-text strong { color: #fff; font-weight: 600; display: block; margin-bottom: 2px; }

        @keyframes slideIn { to { opacity: 1; transform: translateX(0); } }
        @keyframes shake {
          0%,100% { transform: translateX(0); } 20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); } 60% { transform: translateX(-5px); } 80% { transform: translateX(5px); }
        }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

        .form-eyebrow {
          font-size: 11px; font-weight: 600; letter-spacing: 2px;
          text-transform: uppercase; color: #f97316; margin-bottom: 10px;
        }
        .form-title {
          font-family: 'Sora', sans-serif; font-size: 24px; font-weight: 700;
          color: #0f0a00; letter-spacing: -0.5px; line-height: 1.25; margin-bottom: 8px;
        }
        .form-subtitle { font-size: 13.5px; color: #9ca3af; line-height: 1.6; margin-bottom: 28px; }
        .steps-bar { display: flex; gap: 6px; margin-bottom: 24px; }
        .step-dot { height: 4px; border-radius: 2px; background: #f3f4f6; transition: all 0.35s ease; flex: 1; }
        .step-dot.active { background: #f97316; }
        .field-group { margin-bottom: 18px; }
        .field-label {
          display: flex; justify-content: space-between; font-size: 11.5px; font-weight: 600;
          letter-spacing: 0.5px; color: #4b5563; margin-bottom: 7px; text-transform: uppercase;
        }
        .input-wrap { position: relative; }
        .input-icon {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          font-size: 15px; color: #d1d5db; transition: color 0.2s; pointer-events: none; z-index: 1;
        }
        .input-wrap:focus-within .input-icon { color: #f97316; }
        .field-input {
          width: 100%; padding: 13px 16px 13px 46px; border-radius: 12px;
          border: 1.5px solid #f3f4f6; background: #fafafa;
          font-size: 14.5px; color: #0f0a00; font-family: 'DM Sans', sans-serif;
          transition: all 0.25s; outline: none; appearance: none;
        }
        .field-input::placeholder { color: #d1d5db; }
        .field-input:focus {
          border-color: #f97316; background: #fff;
          box-shadow: 0 0 0 4px rgba(249,115,22,0.1);
        }
        .select-wrap { position: relative; }
        .select-wrap::after {
          content: '▾'; position: absolute; right: 16px; top: 50%;
          transform: translateY(-50%); color: #9ca3af; font-size: 13px; pointer-events: none;
        }
        .select-wrap:focus-within::after { color: #f97316; }
        .eye-btn {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          padding: 4px; color: #9ca3af; transition: color 0.2s; font-size: 16px;
        }
        .eye-btn:hover { color: #f97316; }
        .strength-bars { display: flex; gap: 4px; margin-top: 8px; }
        .strength-bar { flex: 1; height: 3px; border-radius: 2px; background: #f3f4f6; transition: background 0.3s ease; }
        .error-box {
          background: #fff5f5; border: 1px solid #fecaca; border-radius: 10px;
          padding: 12px 16px; margin-bottom: 20px;
          display: flex; align-items: center; gap: 10px; font-size: 13.5px; color: #dc2626;
        }
        .submit-btn {
          width: 100%; padding: 15px; background: #f97316; color: white;
          border: none; border-radius: 12px; font-size: 15px; font-weight: 700;
          font-family: 'Sora', sans-serif; cursor: pointer; letter-spacing: 0.3px;
          position: relative; overflow: hidden; transition: all 0.25s; margin-top: 8px;
        }
        .submit-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg,rgba(255,255,255,0.15) 0%,transparent 60%);
          border-radius: 12px;
        }
        .submit-btn:hover:not(:disabled) {
          background: #ea6c0a; transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(249,115,22,0.45);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { background: #e5e7eb; color: #9ca3af; cursor: not-allowed; transform: none; }
        .loading-dots span {
          display: inline-block; width: 6px; height: 6px; border-radius: 50%;
          background: #9ca3af; margin: 0 2px; animation: bounce 1.2s infinite;
        }
        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce { 0%,80%,100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }
        .terms-note { font-size: 11.5px; color: #9ca3af; text-align: center; margin-top: 14px; line-height: 1.5; }
        .terms-note a { color: #f97316; text-decoration: none; }
        .login-link { text-align: center; font-size: 14px; color: #9ca3af; margin-top: 20px; }
        .login-link a { color: #f97316; font-weight: 700; text-decoration: none; transition: color 0.2s; }
        .login-link a:hover { color: #ea6c0a; }
        @media (max-width: 768px) { .side-panel { display: none; } .form-panel { padding: 24px; } }
      `}</style>

      <div className="qitaa-body">
        <canvas ref={canvasRef} style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.5
        }} />

        {/* ── GAUCHE : Formulaire ── */}
        <div className="form-panel">
          <div className="form-card">

            {/* ── MODIFICATION 2 : logo 192px AU-DESSUS du eyebrow ── */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div style={{ width: '192px', height: '192px', position: 'relative', marginBottom: '16px' }}>
                <Image
                  src="/logo.png"
                  alt="Logo QITAA"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <div className="form-eyebrow">Inscription au concours</div>
            </div>

            <h1 className="form-title">
              Prêt à défendre les couleurs<br />de ton établissement ? 🏆
            </h1>
            <p className="form-subtitle">
              Inscris-toi dès maintenant pour participer au plus grand rendez-vous
              intellectuel et culturel des étudiants de Côte d'Ivoire.
            </p>

            <div className="steps-bar">
              {[0,1,2,3].map(i => {
                const vals = [form.nom, form.email, form.password, form.etablissement]
                return <div key={i} className={`step-dot ${vals[i] ? 'active' : ''}`} />
              })}
            </div>

            {error && (
              <div className="error-box">
                <span style={{ fontSize: '18px' }}>⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="field-group">
                <label className="field-label">Nom complet</label>
                <div className="input-wrap">
                  <span className="input-icon">👤</span>
                  <input className="field-input" type="text" name="nom" value={form.nom}
                    onChange={handleChange} onFocus={() => playSound(440)}
                    required placeholder="Kouassi Jean-Marc" autoComplete="name" />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Adresse email</label>
                <div className="input-wrap">
                  <span className="input-icon">✉️</span>
                  <input className="field-input" type="email" name="email" value={form.email}
                    onChange={handleChange} onFocus={() => playSound(460)}
                    required placeholder="ton@email.com" autoComplete="email" />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">
                  Mot de passe
                  {form.password && (
                    <span style={{ color: strengthColors[strength], fontWeight: 600, fontSize: '11px', textTransform: 'none', letterSpacing: 0 }}>
                      {strengthLabels[strength]}
                    </span>
                  )}
                </label>
                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input className="field-input" type={showPassword ? 'text' : 'password'}
                    name="password" value={form.password} onChange={handleChange}
                    onFocus={() => playSound(480)}
                    required placeholder="Min. 8 caractères"
                    autoComplete="new-password" style={{ paddingRight: '44px' }} />
                  <button type="button" className="eye-btn"
                    onClick={() => { setShowPassword(!showPassword); playSound(500) }}
                    aria-label={showPassword ? 'Masquer' : 'Afficher'}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {form.password && (
                  <div className="strength-bars">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="strength-bar"
                        style={{ background: i <= strength ? strengthColors[strength] : '#f3f4f6' }} />
                    ))}
                  </div>
                )}
              </div>

              <div className="field-group">
                <label className="field-label">Établissement</label>
                <div className="input-wrap select-wrap">
                  <span className="input-icon">🏫</span>
                  <select className="field-input" name="etablissement" value={form.etablissement}
                    onChange={handleChange} onFocus={() => playSound(450)}
                    required style={{ cursor: 'pointer' }}>
                    <option value="" disabled>Sélectionne ton établissement</option>
                    {etablissements.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}
                onClick={() => !loading && playSound(480)}>
                {loading ? (
                  <span className="loading-dots"><span /><span /><span /></span>
                ) : "Je m'inscris au concours →"}
              </button>
            </form>

            <p className="terms-note">
              En t'inscrivant, tu acceptes nos{' '}
              <a href="#">conditions d'utilisation</a> et notre{' '}
              <a href="#">politique de confidentialité</a>.
            </p>
            <p className="login-link">
              Déjà inscrit ?{' '}
              <a href="/login" onClick={() => playSound(520)}>Se connecter</a>
            </p>
          </div>
        </div>

        {/* ── DROITE : Photo + contenu ── */}
        <div className="side-panel">
          <div className="side-bg" />
          <div className="side-overlay" />
          <div className="side-grid" />
          <div className="side-content">

            <div className="side-logo-wrap">
              <Image
                src="/logo.png"
                alt="Logo QITAA"
                fill
                style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
              />
            </div>

            <h2 className="side-title">
              Quand l'intelligence et la tradition<br />
              <span>réconcilient la jeunesse.</span>
            </h2>
            <p className="side-desc">
              Représente ta région, valorise ton savoir-faire et vis une immersion
              culturelle unique au cœur de nos traditions.
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
                  Vis une immersion totale dans nos villages pour apprendre et restituer nos danses et arts culinaires.
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🤝</div>
                <div className="feature-text">
                  <strong>Citoyenneté & Impact</strong>
                  Participe à des actions sociales majeures et bâtis ton réseau pour devenir un cadre de demain.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}