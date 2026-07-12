import { useState, useEffect, useRef } from "react"

// ─── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
html,body,#root{margin:0;padding:0;width:100%;min-height:100vh;}
.sp{font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg);color:var(--ct);min-height:100vh;width:100%;-webkit-font-smoothing:antialiased;
--cp:#6C63FF;--cpl:#8B85FF;--cpd:#4A43CC;--cpg:rgba(108,99,255,0.2);
--ca:#00D4AA;--cal:#00F0C0;
--bg:#0F0F1A;--bgs:#1A1A2E;--bge:#242438;--bgc:#1E1E32;
--ct:#E8E8F0;--cts:#9090B0;--ctm:#5A5A7A;
--cs:#10B981;--cw:#F59E0B;--ce:#EF4444;--ci:#3B82F6;
--cb:rgba(255,255,255,0.08);--cb2:rgba(255,255,255,0.15);
--sw:260px;}
.sp[data-theme=light]{--cp:#5A52D5;--cpl:#7A72FA;--cpg:rgba(90,82,213,0.15);--ca:#00B894;--cal:#00D6AB;
--bg:#F4F4F9;--bgs:#fff;--bge:#F0F0F7;--bgc:#fff;--ct:#1E1E2D;--cts:#5A5A7A;--ctm:#9090B0;
--cb:rgba(0,0,0,0.08);--cb2:rgba(0,0,0,0.15);}
.sp*,.sp*::before,.sp*::after{margin:0;padding:0;box-sizing:border-box;}
.sp a{color:inherit;text-decoration:none;}.sp button{cursor:pointer;font-family:inherit;}
.sp input,.sp textarea{font-family:inherit;}
.sp p{color:var(--cts);line-height:1.7;}
.sp h1,.sp h2,.sp h3,.sp h4{font-weight:700;line-height:1.2;color:var(--ct);}
.sp ::-webkit-scrollbar{width:6px;}.sp ::-webkit-scrollbar-track{background:var(--bgs);}
.sp ::-webkit-scrollbar-thumb{background:var(--bge);border-radius:3px;}
.sp ::-webkit-scrollbar-thumb:hover{background:var(--cp);}
.grad{background:linear-gradient(135deg,var(--cpl),var(--ca));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
/* Buttons */
.btn{display:inline-flex;align-items:center;gap:0.5rem;padding:.75rem 1.5rem;border-radius:12px;font-weight:600;font-size:.875rem;border:none;transition:all .2s;white-space:nowrap;font-family:inherit;}
.btn:disabled{opacity:.5;cursor:not-allowed !important;transform:none !important;}
.btn-p{background:var(--cp);color:#fff;box-shadow:0 4px 15px var(--cpg);}
.btn-p:hover:not(:disabled){background:var(--cpl);transform:translateY(-2px);}
.btn-s{background:var(--bge);color:var(--ct);border:1px solid var(--cb2);}
.btn-s:hover:not(:disabled){background:var(--bgc);transform:translateY(-1px);}
.btn-g{background:transparent;color:var(--cts);border:1px solid var(--cb);}
.btn-g:hover:not(:disabled){color:var(--ct);border-color:var(--cb2);}
.btn-a{background:var(--ca);color:#0F0F1A;font-weight:700;}
.btn-a:hover:not(:disabled){background:var(--cal);transform:translateY(-2px);}
.btn-sm{padding:.5rem 1rem;font-size:.75rem;}
.btn-lg{padding:1rem 2rem;font-size:1rem;}
/* Cards */
.card{background:var(--bgc);border:1px solid var(--cb);border-radius:16px;padding:1.5rem;transition:all .2s;}
.card-hover:hover{border-color:var(--cp);box-shadow:0 0 30px var(--cpg);transform:translateY(-2px);}
/* Forms */
.fld{display:flex;flex-direction:column;gap:.5rem;}
.lbl{font-size:.875rem;font-weight:600;color:var(--ct);}
.inp{padding:.75rem 1rem;background:var(--bge);border:1px solid var(--cb);border-radius:12px;color:var(--ct);font-size:1rem;transition:all .2s;width:100%;}
.inp:focus{outline:none;border-color:var(--cp);box-shadow:0 0 0 3px var(--cpg);}
.inp::placeholder{color:var(--ctm);}.inp-e{border-color:var(--ce) !important;}
/* ── Kill browser autofill background + size inflation on every field ── */
.inp:-webkit-autofill,
.inp:-webkit-autofill:hover,
.inp:-webkit-autofill:focus,
.inp:-webkit-autofill:active{
  -webkit-box-shadow:0 0 0 1000px var(--bge) inset !important;
  -webkit-text-fill-color:var(--ct) !important;
  caret-color:var(--ct) !important;
  border:1px solid var(--cb) !important;
  border-radius:12px !important;
  padding:.75rem 1rem !important;
  font-size:1rem !important;
  line-height:normal !important;
  transition:background-color 5000s ease-in-out 0s !important;
}
/* Password fields need extra right padding even when autofilled */
.pw-wrap .inp:-webkit-autofill,
.pw-wrap .inp:-webkit-autofill:hover,
.pw-wrap .inp:-webkit-autofill:focus,
.pw-wrap .inp:-webkit-autofill:active{padding-right:2.75rem !important;}
/* Password wrapper — display:grid forces the input to size identically to a bare .inp */
.pw-wrap{position:relative;display:grid;}
.pw-wrap .inp{padding-right:2.75rem;}
.pw-eye{position:absolute;right:.75rem;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--ctm);font-size:1.1rem;cursor:pointer;padding:0;display:flex;align-items:center;line-height:1;}
.err-msg{font-size:.75rem;color:var(--ce);}.err-box{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);border-radius:12px;padding:.75rem;font-size:.875rem;color:var(--ce);}
/* Tags */
.tag{display:inline-flex;align-items:center;gap:4px;padding:.25rem .75rem;border-radius:9999px;font-size:.75rem;font-weight:600;}
.tag-p{background:var(--cpg);color:var(--cpl);}.tag-s{background:rgba(16,185,129,.15);color:#10B981;}
.tag-w{background:rgba(245,158,11,.15);color:#F59E0B;}.tag-e{background:rgba(239,68,68,.15);color:#EF4444;}
.tag-i{background:rgba(59,130,246,.15);color:#3B82F6;}.tag-a{background:rgba(0,212,170,.15);color:var(--ca);}
.tag-n{background:var(--bge);color:var(--cts);}
/* Progress */
.pw{background:var(--bge);border-radius:9999px;overflow:hidden;}
.pf{background:linear-gradient(90deg,var(--cp),var(--ca));border-radius:9999px;transition:width .8s ease;}
/* Spinner */
.spin{border:3px solid var(--bge);border-top-color:var(--cp);border-radius:50%;animation:a-spin .8s linear infinite;flex-shrink:0;}
@keyframes a-spin{to{transform:rotate(360deg)}}
/* Animations */
@keyframes a-up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes a-in{from{opacity:0}to{opacity:1}}
@keyframes a-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.fade-up{animation:a-up .5s ease forwards;}
.fade-in{animation:a-in .3s ease forwards;}
/* Grids */
.g2{display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem;}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem;}
/* Modal */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(4px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem;animation:a-in .2s ease;}
.modal{background:var(--bgs);border:1px solid var(--cb2);border-radius:24px;padding:2rem;width:100%;max-width:520px;animation:a-up .3s ease;max-height:90vh;overflow-y:auto;}
/* Auth */
.auth-pg{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg);padding:1.5rem;position:relative;overflow-y:auto;}
.auth-pg::before{content:'';position:absolute;width:500px;height:500px;background:radial-gradient(circle,var(--cpg) 0%,transparent 70%);top:-200px;right:-200px;pointer-events:none;}
.auth-card{background:var(--bgs);border:1px solid var(--cb2);border-radius:24px;padding:2.5rem;width:100%;max-width:480px;position:relative;z-index:1;}
/* Layout */
.layout{display:flex;min-height:100vh;}
.main-area{flex:1;margin-left:var(--sw);padding:2rem 2rem 2rem 3rem;min-height:100vh;}
/* Sidebar */
.sidebar{width:var(--sw);height:100vh;background:var(--bgs);border-right:1px solid var(--cb);position:fixed;left:0;top:0;display:flex;flex-direction:column;padding:1.5rem 1.5rem 0 1.5rem;z-index:100;overflow:hidden;}
.side-logo{display:flex;align-items:center;gap:.75rem;font-size:1.25rem;font-weight:800;}
.side-nav{display:flex;flex-direction:column;gap:.25rem;overflow-y:auto;padding-bottom:130px;}
.nav-lbl{font-size:.75rem;font-weight:700;color:var(--ctm);text-transform:uppercase;letter-spacing:.1em;padding:.75rem 1rem .25rem;margin-top:1rem;}
.nav-link{display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border-radius:12px;color:var(--cts);font-size:.875rem;font-weight:500;transition:all .2s;background:none;border:none;text-align:left;width:100%;}
.nav-link:hover{background:var(--bge);color:var(--ct);}
.nav-link.active{background:var(--cpg);color:var(--cpl);}
.side-foot{position:absolute;bottom:0;left:0;right:0;padding:1rem 1.5rem 1.5rem;background:var(--bgs);border-top:1px solid var(--cb);}
/* Stat card */
.stat-c{background:var(--bgc);border:1px solid var(--cb);border-radius:16px;padding:1.5rem;display:flex;align-items:flex-start;gap:1rem;}
.stat-ic{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;}
/* Toggle */
.thm-tog{display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;border:1px solid var(--cb);background:var(--bge);font-size:1.1rem;transition:all .2s;}
.thm-tog:hover{border-color:var(--cp);transform:translateY(-2px);}
/* Action btn */
.act-btn{display:flex;align-items:center;gap:1rem;padding:.75rem;border-radius:12px;transition:all .2s;border:1px solid transparent;background:none;cursor:pointer;text-align:left;font-family:inherit;width:100%;}
.act-btn:hover{background:var(--bge);border-color:var(--cb);}
@media(max-width:1024px){.main-area{margin-left:0;padding:1rem;}.sidebar{display:none;}.g4{grid-template-columns:repeat(2,1fr);}.g3{grid-template-columns:repeat(2,1fr);}}
@media(max-width:640px){.g2,.g3,.g4{grid-template-columns:1fr;}}
`

// ─── UTILS ─────────────────────────────────────────────────────────────────────
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2)
const ini = (n = '') => n.split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2)
const fmtDate = d => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''
const lvlTag = { beginner: 's', intermediate: 'w', advanced: 'e' }

// ─── STORAGE — 4-layer: window global → sessionStorage → window.storage → localStorage
// window.__SP survives Babel re-evaluations (Babel reruns the script but keeps window).
// sessionStorage survives refreshes within the same browser tab.
window.__SP = window.__SP || {}
const MEM = window.__SP

const S = {
  async get(k) {
    if (Object.prototype.hasOwnProperty.call(MEM, k)) return MEM[k]
    try { const sv = sessionStorage.getItem('sp:' + k);
      if (sv) { MEM[k] = JSON.parse(sv); return MEM[k] } } catch {}
    try { const r = await window.storage.get(k);
      if (r && r.value) { MEM[k] = JSON.parse(r.value); return MEM[k] } } catch {}
    try { const lv = localStorage.getItem('sp:' + k);
      if (lv) { MEM[k] = JSON.parse(lv); return MEM[k] } } catch {}
    return null
  },
  async set(k, v) {
    MEM[k] = v
    try { sessionStorage.setItem('sp:' + k, JSON.stringify(v)) } catch {}
    try { await window.storage.set(k, JSON.stringify(v)) } catch {}
    try { localStorage.setItem('sp:' + k, JSON.stringify(v)) } catch {}
  },
  async del(k) {
    delete MEM[k]
    try { sessionStorage.removeItem('sp:' + k) } catch {}
    try { await window.storage.delete(k) } catch {}
    try { localStorage.removeItem('sp:' + k) } catch {}
  },
}

// ─── API KEY HELPERS ──────────────────────────────────────────────────────────
// ─── API ─────────────────────────────────────────────────────────────────────
// Key is stored securely in Vercel environment variables — never in this file.

// ─── GROQ API — routed through /api/chat serverless proxy ──────────────────
// Key lives in Vercel env vars only — never exposed to browser
const GROQ_MODEL = 'llama-3.3-70b-versatile'

// All AI calls go through /api/chat — the GROQ_API_KEY lives only in Vercel env vars.
// No user-facing API key input is ever shown.
async function ask(messages, system, maxTokens = 1000) {
  const groqMsgs = []
  if (system) groqMsgs.push({ role: 'system', content: system })
  groqMsgs.push(...messages.map(m => ({ role: m.role, content: m.content })))

  const body = JSON.stringify({ model: GROQ_MODEL, max_tokens: maxTokens, messages: groqMsgs })

  let r
  try {
    // Always use the server-side proxy — GROQ_API_KEY is set in Vercel env vars.
    r = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
  } catch (netErr) {
    throw new Error('Network error — check your internet connection.')
  }

  if (!r.ok) {
    let msg = 'API Error ' + r.status
    try {
      const e = await r.json()
      msg = (typeof e?.error === 'string' ? e.error : e?.error?.message) || msg
    } catch {}
    if (r.status === 429) throw new Error('Rate limit hit — wait a moment and try again.')
    if (r.status === 401) throw new Error('Server API key error — contact the administrator.')
    throw new Error(msg)
  }
  const d = await r.json()
  return d.choices?.[0]?.message?.content || ''
}
const parseJSON = txt => { try { return JSON.parse(txt.replace(new RegExp('```json|```', 'g'), '').trim()) } catch { return null } }

async function genRoadmap(goal, level, hrs) {
  const txt = await ask([{ role: 'user', content: `Generate a learning roadmap JSON. Goal="${goal}", Level="${level}", ${hrs}hrs/week.\nReturn ONLY valid JSON:\n{"steps":[{"stepNumber":1,"title":"...","description":"...","duration":"X weeks","resources":["Site1","Site2","Site3"]}],"estimatedDuration":"24 weeks"}\nCreate exactly 6 steps in logical order. Use real resource names like MDN, freeCodeCamp, Coursera, etc.` }])
  return parseJSON(txt)
}
async function genChat(msgs, goal) {
  // Groq uses system message separately — no need to filter first user turn
  const sys = 'You are SkillPath AI, a friendly, knowledgeable learning assistant.' + (goal ? ' The student is learning ' + goal + '.' : '') + ' Help with concepts, code, learning paths, and projects. Be encouraging and concise.'
  return ask(msgs.map(m => ({ role: m.role, content: m.content })), sys, 900)
}
async function genLesson(topic, desc) {
  return ask([{ role: 'user', content: `Write a lesson about "${topic}". Context: ${desc}\n\nFormat:\n## Overview\n[Brief intro]\n\n## Key Concepts\n[2-3 main points]\n\n## Example\n[Code or practical example]\n\n## Key Takeaways\n- Point 1\n- Point 2\n- Point 3\n\nKeep it ~350 words, clear and practical.` }], null, 900)
}
async function genQuiz(topic) {
  const txt = await ask([{ role: 'user', content: `Generate 3 multiple-choice quiz questions about "${topic}".\nReturn ONLY valid JSON:\n[{"question":"...","options":["A","B","C","D"],"correctIndex":0,"explanation":"..."}]` }], null, 800)
  return parseJSON(txt) || []
}
async function genProjects(goal, level) {
  const txt = await ask([{ role: 'user', content: `Generate 6 project ideas for someone learning ${goal} at ${level} level.\nReturn ONLY valid JSON:\n[{"title":"...","description":"...","difficulty":"beginner|intermediate|advanced","techStack":["T1","T2"],"estimatedTime":"X weeks"}]` }], null, 1000)
  return parseJSON(txt) || []
}

// ─── UI PRIMITIVES ─────────────────────────────────────────────────────────────
const Spin = ({ size = 24 }) => <div className="spin" style={{ width: size, height: size }} />

const Btn = ({ children, v = 'p', sz = '', onClick, disabled, loading, type = 'button', style }) => (
  <button type={type} className={`btn btn-${v}${sz ? ' btn-' + sz : ''}`} onClick={onClick} disabled={disabled || loading} style={style}>
    {loading ? <Spin size={16} /> : children}
  </button>
)

const Field = ({ label, id, type = 'text', value, onChange, placeholder, error, required, autoComplete, disabled }) => (
  <div className="fld">
    {label && <label htmlFor={id} className="lbl">{label} {required && <span style={{ color: 'var(--ce)' }}>*</span>}</label>}
    <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder}
      required={required} autoComplete={autoComplete} disabled={disabled}
      className={`inp${error ? ' inp-e' : ''}`} />
    {error && <span className="err-msg">{error}</span>}
  </div>
)

const Tag = ({ children, v = 'n' }) => <span className={`tag tag-${v}`}>{children}</span>

const Bar = ({ val = 0, h = 8 }) => (
  <div className="pw" style={{ height: h }}>
    <div className="pf" style={{ width: `${Math.min(val, 100)}%`, height: '100%' }} />
  </div>
)

const Ring = ({ val = 0, size = 120, sw = 10 }) => {
  const r = (size - sw) / 2, c = 2 * Math.PI * r, off = c - (val / 100) * c
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <defs><linearGradient id="rg"><stop offset="0%" stopColor="var(--cp)" /><stop offset="100%" stopColor="var(--ca)" /></linearGradient></defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bge)" strokeWidth={sw} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#rg)" strokeWidth={sw}
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease', filter: 'drop-shadow(0 0 6px var(--ca))' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1, color: 'var(--ct)' }}>{Math.round(val)}%</span>
        <span style={{ fontSize: '.75rem', color: 'var(--cts)', marginTop: 2 }}>complete</span>
      </div>
    </div>
  )
}

const Av = ({ name = '', size = 40 }) => {
  const cols = ['#6C63FF', '#00D4AA', '#F59E0B', '#EF4444', '#3B82F6']
  const col = name ? cols[name.charCodeAt(0) % cols.length] : cols[0]
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: `${col}33`, border: `2px solid ${col}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.35, fontWeight: 700, color: col, flexShrink: 0 }}>
      {ini(name)}
    </div>
  )
}

// ─── SIDEBAR + LAYOUT ──────────────────────────────────────────────────────────
const NAV = [
  { id: 'dashboard', em: '⊞', label: 'Dashboard' },
  { id: 'roadmap', em: '🗺', label: 'My Roadmap' },
  { id: 'chat', em: '💬', label: 'AI Chat' },
  { id: 'projects', em: '📁', label: 'Project Ideas' },
  { id: 'resources', em: '📚', label: 'Resources' },
  { id: 'profile', em: '👤', label: 'Profile' },
]

const Sidebar = ({ user, page, go, theme, toggleTheme, logout }) => (
  <aside className="sidebar">
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
      <div className="side-logo" onClick={() => go('dashboard')} style={{ cursor: 'pointer' }}>
        <span style={{ color: 'var(--cp)', fontSize: '1.4rem' }}>⚡</span>
        SkillPath <span className="grad">AI</span>
      </div>
      <button onClick={toggleTheme} className="thm-tog">{theme === 'dark' ? '☀️' : '🌙'}</button>
    </div>
    <nav className="side-nav">
      <span className="nav-lbl">Navigation</span>
      {NAV.map(({ id, em, label }) => (
        <button key={id} onClick={() => go(id)} className={`nav-link${page === id ? ' active' : ''}`}>
          <span>{em}</span> {label}
        </button>
      ))}
    </nav>
    <div className="side-foot">
      <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', padding: '.75rem', borderRadius: '12px' }}>
        <Av name={user?.name} size={36} />
        <div>
          <div style={{ fontSize: '.875rem', fontWeight: 600, color: 'var(--ct)' }}>{user?.name}</div>
          <div style={{ fontSize: '.75rem', color: 'var(--cts)' }}>user</div>
        </div>
      </div>
      <button onClick={logout} className="nav-link" style={{ color: 'var(--ce)', marginTop: 4 }}>🚪 Logout</button>
    </div>
  </aside>
)

const Layout = ({ children, user, page, go, theme, toggleTheme, logout }) => (
  <div className="layout">
    <Sidebar user={user} page={page} go={go} theme={theme} toggleTheme={toggleTheme} logout={logout} />
    <main className="main-area">{children}</main>
  </div>
)

// ─── TOAST ─────────────────────────────────────────────────────────────────────
const Toast = ({ msg }) => msg ? (
  <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, background: 'var(--bge)', border: '1px solid var(--cb)', borderRadius: '12px', padding: '12px 20px', fontWeight: 600, fontSize: '.875rem', boxShadow: '0 4px 20px rgba(0,0,0,.4)', color: 'var(--ct)', animation: 'a-in .3s ease' }}>
    {msg}
  </div>
) : null

function useToast() {
  const [msg, setMsg] = useState('')
  const show = m => { setMsg(m); setTimeout(() => setMsg(''), 3000) }
  return [msg, show]
}

// ─── LOGIN ─────────────────────────────────────────────────────────────────────
function Login({ onLogin, go }) {
  const [f, setF] = useState({ email: '', password: '' })
  const [err, setErr] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const submit = async e => {
    e.preventDefault()
    const errs = {}
    if (!f.email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(f.email)) errs.email = 'Invalid email'
    if (!f.password) errs.password = 'Password is required'
    if (Object.keys(errs).length) { setErr(errs); return }
    setLoading(true)
    try { await onLogin(f.email, f.password) }
    catch (e) { setErr({ general: e.message }) }
    finally { setLoading(false) }
  }

  return (
    <div className="auth-pg">
      <div className="auth-card fade-up">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>
            <span style={{ color: 'var(--cp)' }}>⚡</span> SkillPath <span className="grad">AI</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>Welcome Back</h2>
          <p style={{ fontSize: '.875rem' }}>Sign in to continue your learning journey</p>
        </div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {err.general && <div className="err-box">{err.general}</div>}
          <Field label="Email" id="em" type="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} placeholder="you@example.com" error={err.email} required autoComplete="email" />
          <div className="fld">
            <label className="lbl">Password <span style={{ color: 'var(--ce)' }}>*</span></label>
            <div className="pw-wrap">
              <input type={showPw ? 'text' : 'password'} value={f.password} onChange={e => setF({ ...f, password: e.target.value })}
                placeholder="Your password" className={`inp${err.password ? ' inp-e' : ''}`} />
              <button type="button" className="pw-eye" onClick={() => setShowPw(!showPw)}>
                {showPw ? '🙈' : '👁'}
              </button>
            </div>
            {err.password && <span className="err-msg">{err.password}</span>}
          </div>
          <Btn type="submit" v="p" loading={loading} style={{ width: '100%', justifyContent: 'center' }}>Sign In</Btn>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '.875rem', color: 'var(--cts)' }}>
          Don't have an account? <span onClick={() => go('register')} style={{ color: 'var(--cpl)', fontWeight: 600, cursor: 'pointer' }}>Create one free</span>
        </p>
      </div>
    </div>
  )
}

// ─── REGISTER ──────────────────────────────────────────────────────────────────
function Register({ onRegister, go }) {
  const [f, setF] = useState({ name: '', email: '', password: '', confirm: '' })
  const [err, setErr] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const s = k => e => setF({ ...f, [k]: e.target.value })

  const submit = async e => {
    e.preventDefault()
    const errs = {}
    if (!f.name.trim()) errs.name = 'Name is required'
    if (!f.email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(f.email)) errs.email = 'Invalid email'
    if (!f.password || f.password.length < 6) errs.password = 'Min 6 characters'
    if (f.password !== f.confirm) errs.confirm = 'Passwords do not match'
    if (Object.keys(errs).length) { setErr(errs); return }
    setLoading(true)
    try { await onRegister(f.name.trim(), f.email, f.password) }
    catch (e) { setErr({ general: e.message }) }
    finally { setLoading(false) }
  }

  return (
    <div className="auth-pg">
      <div className="auth-card fade-up">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>
            <span style={{ color: 'var(--cp)' }}>⚡</span> SkillPath <span className="grad">AI</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>Create Your Account</h2>
          <p style={{ fontSize: '.875rem' }}>Start your AI-powered learning journey today — free forever</p>
        </div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {err.general && <div className="err-box">{err.general}</div>}
          <Field label="Full Name" id="nm" value={f.name} onChange={s('name')} placeholder="Alex Johnson" error={err.name} required />
          <Field label="Email" id="em" type="email" value={f.email} onChange={s('email')} placeholder="you@example.com" error={err.email} required autoComplete="email" />
          <div className="fld">
            <label className="lbl">Password <span style={{ color: 'var(--ce)' }}>*</span></label>
            <div className="pw-wrap">
              <input type={showPw ? 'text' : 'password'} value={f.password} onChange={s('password')}
                placeholder="Min 6 characters" className={`inp${err.password ? ' inp-e' : ''}`} />
              <button type="button" className="pw-eye" onClick={() => setShowPw(!showPw)}>
                {showPw ? '🙈' : '👁'}
              </button>
            </div>
            {err.password && <span className="err-msg">{err.password}</span>}
          </div>
          <Field label="Confirm Password" id="cf" type="password" value={f.confirm} onChange={s('confirm')} placeholder="Repeat password" error={err.confirm} required />
          <Btn type="submit" v="p" loading={loading} style={{ width: '100%', justifyContent: 'center' }}>Create Account — It's Free</Btn>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '.875rem', color: 'var(--cts)' }}>
          Already have an account? <span onClick={() => go('login')} style={{ color: 'var(--cpl)', fontWeight: 600, cursor: 'pointer' }}>Sign in</span>
        </p>
      </div>
    </div>
  )
}

// ─── ONBOARDING ────────────────────────────────────────────────────────────────
const GOALS = ['Web Development', 'Data Science', 'Machine Learning', 'Mobile Development', 'DevOps & Cloud', 'UI/UX Design', 'Cybersecurity', 'Blockchain']
const LEVELS = [
  { v: 'beginner', l: 'Beginner', d: 'Just starting out — little to no experience', em: '🌱' },
  { v: 'intermediate', l: 'Intermediate', d: 'Have some basics — want to go deeper', em: '🚀' },
  { v: 'advanced', l: 'Advanced', d: 'Solid foundation — want to master advanced topics', em: '⚡' },
]
const TIMES = [
  { v: 2, l: '2 hrs/week', d: 'Casual pace — slow and steady', em: '☕' },
  { v: 5, l: '5 hrs/week', d: 'Moderate pace — balanced approach', em: '📚' },
  { v: 10, l: '10+ hrs/week', d: 'Intensive — fast-track your learning', em: '🔥' },
]

const StepDots = ({ cur }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '2rem' }}>
    {[0, 1, 2].map(i => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: i < cur ? 'var(--cp)' : i === cur ? 'var(--cpg)' : 'var(--bge)',
          border: `2px solid ${i <= cur ? 'var(--cp)' : 'var(--cb)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '.875rem', fontWeight: 700, transition: 'all .2s',
          color: i < cur ? '#fff' : i === cur ? 'var(--cpl)' : 'var(--ctm)',
        }}>
          {i < cur ? '✓' : i + 1}
        </div>
        {i < 2 && <div style={{ width: 40, height: 2, background: i < cur ? 'var(--cp)' : 'var(--cb)', transition: 'all .2s' }} />}
      </div>
    ))}
  </div>
)

function Onboarding({ onDone }) {
  const [step, setStep] = useState(0)
  const [f, setF] = useState({ learningGoal: '', currentLevel: '', weeklyHours: '' })
  const [loading, setLoading] = useState(false)
  const [genError, setGenError] = useState('')
  const valid = [!!f.learningGoal, !!f.currentLevel, !!f.weeklyHours][step]

  const submit = async () => {
    setLoading(true); setGenError('')
    try { await onDone(f) }
    catch (e) {
      setGenError(e.message || 'Failed to generate roadmap. Please try again.')
    }
    finally { setLoading(false) }
  }

  const opt = (field, val) => (
    <button onClick={() => setF({ ...f, [field]: val })} style={{
      padding: '1rem', borderRadius: '12px', textAlign: 'left',
      background: f[field] === val ? 'var(--cpg)' : 'var(--bge)',
      border: `1px solid ${f[field] === val ? 'var(--cp)' : 'var(--cb)'}`,
      color: f[field] === val ? 'var(--cpl)' : 'var(--ct)',
      fontWeight: 600, fontSize: '.875rem', cursor: 'pointer', transition: 'all .2s', fontFamily: 'inherit',
    }}>{val}</button>
  )

  const optRow = (field, { v, l, d, em }) => (
    <button key={v} onClick={() => setF({ ...f, [field]: v })} style={{
      padding: '1.25rem', borderRadius: '12px', textAlign: 'left',
      background: f[field] === v ? 'var(--cpg)' : 'var(--bge)',
      border: `1px solid ${f[field] === v ? 'var(--cp)' : 'var(--cb)'}`,
      color: 'var(--ct)', cursor: 'pointer', transition: 'all .2s',
      display: 'flex', alignItems: 'center', gap: '1rem', fontFamily: 'inherit',
    }}>
      <span style={{ fontSize: '1.5rem' }}>{em}</span>
      <div>
        <div style={{ fontWeight: 700, fontSize: '1rem', color: f[field] === v ? 'var(--cpl)' : 'var(--ct)' }}>{l}</div>
        <div style={{ fontSize: '.875rem', color: 'var(--cts)' }}>{d}</div>
      </div>
    </button>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: 640 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--ct)' }}>
            <span style={{ color: 'var(--cp)' }}>⚡</span> SkillPath <span className="grad">AI</span>
          </div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '.5rem' }}>Let's Build Your Learning Path</h1>
          <p>Answer 3 quick questions — our AI will create your personalized roadmap instantly.</p>
        </div>
        <div className="card" style={{ padding: '2rem' }}>
          <StepDots cur={step} />
          {step === 0 && (
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '.5rem' }}>What do you want to learn?</h2>
              <p style={{ marginBottom: '1.5rem', fontSize: '.875rem' }}>Choose your primary learning goal.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '.75rem' }}>
                {GOALS.map(g => opt('learningGoal', g))}
              </div>
            </div>
          )}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '.5rem' }}>What's your current level?</h2>
              <p style={{ marginBottom: '1.5rem', fontSize: '.875rem' }}>Be honest — the AI will tailor your roadmap accordingly.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                {LEVELS.map(l => optRow('currentLevel', l))}
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '.5rem' }}>How much time can you dedicate?</h2>
              <p style={{ marginBottom: '1.5rem', fontSize: '.875rem' }}>This helps us set realistic timelines in your roadmap.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                {TIMES.map(t => optRow('weeklyHours', t))}
              </div>
            </div>
          )}
          {genError && (
            <div className="err-box" style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '.5rem' }}>
              <span>⚠️</span>
              <div style={{ flex: 1 }}>
                <strong>Generation failed</strong>
                <div style={{ marginTop: 4, fontSize: '.8rem' }}>{genError}</div>
              </div>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', gap: '.75rem' }}>
            {step > 0 && <Btn v="s" onClick={() => setStep(step - 1)}>← Back</Btn>}
            <div style={{ marginLeft: 'auto' }}>
              {step < 2
                ? <Btn v="p" onClick={() => setStep(step + 1)} disabled={!valid}>Next →</Btn>
                : <Btn v="a" onClick={submit} disabled={!valid} loading={loading}>✨ Generate My Roadmap</Btn>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── DASHBOARD ─────────────────────────────────────────────────────────────────
const SC = ({ icon, label, value, col }) => (
  <div className="stat-c">
    <div className="stat-ic" style={{ background: `${col}22`, color: col }}>{icon}</div>
    <div>
      <div style={{ fontSize: String(value).length > 10 ? '1.125rem' : '1.875rem', fontWeight: 800, lineHeight: 1, marginBottom: '.25rem', color: 'var(--ct)' }}>{value}</div>
      <div style={{ fontSize: '.875rem', color: 'var(--cts)' }}>{label}</div>
    </div>
  </div>
)

function Dashboard({ user, roadmap, progress, go, lp }) {
  const pct = progress?.percentComplete || 0
  const done = progress?.completedSteps?.length || 0
  const total = roadmap?.steps?.length || 0

  return (
    <Layout {...lp}>
      <div className="fade-up">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '.25rem' }}>Welcome back, <span className="grad">{user?.name?.split(' ')[0]}</span> 👋</h1>
          <p>Here's your learning overview for today.</p>
        </div>
        <div className="g4" style={{ marginBottom: '2rem' }}>
          <SC icon="📈" label="Progress" value={`${Math.round(pct)}%`} col="#6C63FF" />
          <SC icon="✅" label="Steps Done" value={`${done}/${total}`} col="#10B981" />
          <SC icon="🔥" label="Streak" value={`${progress?.streak || 0}d`} col="#F59E0B" />
          <SC icon="🎯" label="Goal" value={roadmap?.goal || 'Set Goal'} col="#00D4AA" />
        </div>
        <div className="g2" style={{ marginBottom: '2rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Overall Progress</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <Ring val={pct} size={140} />
              <div>
                <p style={{ marginBottom: '.5rem', fontSize: '.875rem' }}>
                  You've completed <strong style={{ color: 'var(--ca)' }}>{done} topics</strong> out of {total}.
                </p>
                {roadmap && <p style={{ fontSize: '.75rem', color: 'var(--ctm)' }}>Goal: {roadmap.goal} · Level: {roadmap.level}</p>}
                <button className="btn btn-p btn-sm" onClick={() => go('roadmap')} style={{ marginTop: '1rem' }}>View Roadmap →</button>
              </div>
            </div>
          </div>
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
              {[
                { p: 'roadmap', em: '🗺', l: 'Continue Roadmap', s: 'Pick up where you left off', col: '#6C63FF' },
                { p: 'chat', em: '💬', l: 'Ask AI a Question', s: 'Get instant doubt resolution', col: '#00D4AA' },
                { p: 'projects', em: '📁', l: 'Find a Project', s: 'Build something real', col: '#F59E0B' },
                { p: 'resources', em: '📚', l: 'Browse Resources', s: 'Curated learning materials', col: '#3B82F6' },
              ].map(({ p, em, l, s, col }) => (
                <button key={p} onClick={() => go(p)} className="act-btn">
                  <div style={{ width: 40, height: 40, borderRadius: '8px', background: `${col}22`, color: col, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.2rem' }}>{em}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '.875rem', color: 'var(--ct)' }}>{l}</div>
                    <div style={{ fontSize: '.75rem', color: 'var(--cts)' }}>{s}</div>
                  </div>
                  <span style={{ color: 'var(--ctm)' }}>→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        {roadmap?.steps ? (
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3>Your Roadmap — Next Steps</h3>
              <button className="btn btn-g btn-sm" onClick={() => go('roadmap')}>View All →</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
              {roadmap.steps.slice(0, 4).map(step => {
                const isDone = progress?.completedSteps?.includes(step.stepNumber)
                return (
                  <div key={step.stepNumber} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '.75rem', background: 'var(--bge)', borderRadius: '12px' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: isDone ? 'rgba(16,185,129,.15)' : 'var(--bgc)', border: `2px solid ${isDone ? '#10B981' : 'var(--cb)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem', fontWeight: 700, flexShrink: 0, color: isDone ? '#10B981' : 'var(--cts)' }}>
                      {isDone ? '✓' : step.stepNumber}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '.875rem', textDecoration: isDone ? 'line-through' : 'none', color: isDone ? 'var(--cts)' : 'var(--ct)' }}>{step.title}</div>
                      <div style={{ fontSize: '.75rem', color: 'var(--ctm)' }}>{step.duration}</div>
                    </div>
                    <Tag v={isDone ? 's' : 'n'}>{isDone ? 'Done' : 'Pending'}</Tag>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
            <h3 style={{ marginBottom: '.75rem' }}>No Roadmap Yet</h3>
            <p style={{ marginBottom: '1.5rem' }}>Complete onboarding to get your personalized AI roadmap.</p>
            <button className="btn btn-p" onClick={() => go('onboarding')}>Generate My Roadmap ✨</button>
          </div>
        )}
      </div>
    </Layout>
  )
}

// ─── MODALS ────────────────────────────────────────────────────────────────────
function LessonModal({ open, onClose, topic, content, loading }) {
  if (!open) return null
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal fade-in" style={{ maxWidth: 700 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>📖 {topic}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--cts)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
        </div>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem', gap: '1rem' }}>
            <Spin size={40} /><p>Generating lesson with AI...</p>
          </div>
        ) : (
          <>
            <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '8px', lineHeight: 1.8, fontSize: '.875rem', color: 'var(--ct)', whiteSpace: 'pre-wrap' }}>{content}</div>
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <Btn v="p" onClick={onClose}>Got it! ✓</Btn>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function QuizModal({ open, onClose, topic, quiz, loading, onPass }) {
  const [cur, setCur] = useState(0)
  const [sel, setSel] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => { if (open) { setCur(0); setSel(null); setAnswered(false); setScore(0); setDone(false) } }, [open, topic])
  if (!open) return null

  const q = quiz[cur]
  const check = () => { setAnswered(true); if (sel === q.correctIndex) setScore(s => s + 1) }
  const next = () => { if (cur < quiz.length - 1) { setCur(c => c + 1); setSel(null); setAnswered(false) } else setDone(true) }
  const finish = () => { if (score >= quiz.length * 0.6) onPass?.(); onClose() }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal fade-in" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>{done ? 'Quiz Results' : `🧠 ${topic}`}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--cts)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
        </div>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem', gap: '1rem' }}>
            <Spin size={40} /><p>Generating quiz with AI...</p>
          </div>
        ) : !done ? (
          <div>
            <p style={{ fontSize: '.875rem', marginBottom: '1.5rem', color: 'var(--cts)' }}>Question {cur + 1} of {quiz.length}</p>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', lineHeight: 1.4 }}>{q?.question}</h3>
            {q?.options.map((opt, i) => {
              let bg = 'var(--bge)', border = 'var(--cb)', color = 'var(--ct)'
              if (!answered && sel === i) { bg = 'var(--cpg)'; border = 'var(--cp)' }
              if (answered) {
                if (i === q.correctIndex) { bg = 'rgba(16,185,129,.1)'; border = '#10B981'; color = '#10B981' }
                else if (sel === i) { bg = 'rgba(239,68,68,.1)'; border = '#EF4444'; color = '#EF4444' }
              }
              return (
                <button key={i} onClick={() => !answered && setSel(i)} disabled={answered}
                  style={{ width: '100%', textAlign: 'left', padding: '1rem', marginBottom: '.75rem', border: `2px solid ${border}`, borderRadius: '12px', background: bg, color, fontSize: '1rem', cursor: answered ? 'default' : 'pointer', transition: 'all .2s', fontFamily: 'inherit' }}>
                  {opt}
                </button>
              )
            })}
            {answered && (
              <div style={{ padding: '1rem', borderRadius: '12px', marginTop: '1rem', background: sel === q.correctIndex ? 'rgba(16,185,129,.1)' : 'rgba(239,68,68,.1)', border: `1px solid ${sel === q.correctIndex ? 'rgba(16,185,129,.3)' : 'rgba(239,68,68,.3)'}`, color: sel === q.correctIndex ? '#10B981' : '#EF4444' }}>
                <strong>{sel === q.correctIndex ? '✓ Correct!' : '✗ Incorrect'}</strong>
                <p style={{ marginTop: 4, fontSize: '.875rem', color: 'inherit' }}>{q.explanation}</p>
              </div>
            )}
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              {!answered ? <Btn v="p" disabled={sel === null} onClick={check}>Check Answer</Btn>
                : <Btn v="p" onClick={next}>{cur === quiz.length - 1 ? 'See Results' : 'Next →'}</Btn>}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{score >= quiz.length * 0.6 ? '🎉' : '📚'}</div>
            <h3 style={{ marginBottom: '.75rem' }}>{score >= quiz.length * 0.6 ? 'Congratulations!' : 'Good Effort!'}</h3>
            <p style={{ marginBottom: '2rem' }}>You scored {score}/{quiz.length}.{score >= quiz.length * 0.6 ? " You've mastered this topic!" : ' Review and try again!'}</p>
            <Btn v="p" sz="lg" onClick={finish}>{score >= quiz.length * 0.6 ? 'Complete Step ✓' : 'Back to Roadmap'}</Btn>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── ROADMAP ───────────────────────────────────────────────────────────────────
function Roadmap({ roadmap, progress, onMark, onRegen, go, lp }) {
  const [upd, setUpd] = useState(null)
  const [regen, setRegen] = useState(false)
  const [lesson, setLesson] = useState({ open: false, topic: '', content: '', loading: false })
  const [quiz, setQuiz] = useState({ open: false, topic: '', data: [], loading: false, step: null })
  const [toast, showToast] = useToast()

  if (!roadmap) return (
    <Layout {...lp}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem' }}>🗺️</div>
        <h2>No Roadmap Found</h2>
        <p>Complete onboarding to generate your AI-powered roadmap.</p>
        <button className="btn btn-p" onClick={() => go('onboarding')}>Generate Roadmap ✨</button>
      </div>
    </Layout>
  )

  const pct = progress?.percentComplete || 0
  const doneSet = new Set(progress?.completedSteps || [])

  const toggle = async (num, isDone) => {
    setUpd(num); await onMark(num, !isDone)
    showToast(!isDone ? '✅ Step completed!' : 'Step marked incomplete'); setUpd(null)
  }

  const doRegen = async () => {
    if (!confirm('Replace your current roadmap?')) return
    setRegen(true); await onRegen(roadmap.goal, roadmap.level, roadmap.weeklyHours)
    setRegen(false); showToast('🎉 New roadmap generated!')
  }

  const openLesson = async step => {
    setLesson({ open: true, topic: step.title, content: '', loading: true })
    const c = await genLesson(step.title, step.description)
    setLesson(p => ({ ...p, content: c, loading: false }))
  }

  const openQuiz = async step => {
    setQuiz({ open: true, topic: step.title, data: [], loading: true, step })
    const d = await genQuiz(step.title)
    setQuiz(p => ({ ...p, data: d, loading: false }))
  }

  return (
    <Layout {...lp}>
      <Toast msg={toast} />
      <div className="fade-up">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', marginBottom: '.5rem' }}>Your <span className="grad">Roadmap</span></h1>
            <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: 'var(--cts)' }}>{roadmap.goal}</span>
              <Tag v={lvlTag[roadmap.level] || 'n'}>{roadmap.level}</Tag>
              <Tag v="p">✨ AI Generated</Tag>
            </div>
          </div>
          <Btn v="s" sz="sm" onClick={doRegen} loading={regen}>🔄 Regenerate</Btn>
        </div>
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.75rem' }}>
            <span style={{ fontWeight: 600 }}>Overall Progress</span>
            <span style={{ color: 'var(--ca)', fontWeight: 700 }}>{Math.round(pct)}%</span>
          </div>
          <Bar val={pct} h={10} />
          <p style={{ marginTop: '.75rem', fontSize: '.875rem' }}>
            {doneSet.size} of {roadmap.steps.length} steps completed{roadmap.estimatedDuration ? ` · Est. ${roadmap.estimatedDuration}` : ''}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {roadmap.steps.map(step => {
            const isDone = doneSet.has(step.stepNumber)
            return (
              <div key={step.stepNumber} style={{ display: 'flex', gap: '1.25rem', padding: '1.5rem', background: isDone ? 'rgba(16,185,129,.03)' : 'var(--bgc)', border: `1px solid ${isDone ? 'rgba(16,185,129,.3)' : 'var(--cb)'}`, borderRadius: '16px', transition: 'all .2s' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: isDone ? 'rgba(16,185,129,.15)' : 'var(--bge)', border: `2px solid ${isDone ? '#10B981' : 'var(--cb)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '.875rem', flexShrink: 0, color: isDone ? '#10B981' : 'var(--cts)' }}>
                  {upd === step.stepNumber ? <Spin size={16} /> : isDone ? '✓' : step.stepNumber}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '.25rem', textDecoration: isDone ? 'line-through' : 'none', color: isDone ? 'var(--cts)' : 'var(--ct)' }}>{step.title}</div>
                  <div style={{ fontSize: '.875rem', color: 'var(--cts)', marginBottom: '.75rem' }}>{step.description}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', flexWrap: 'wrap' }}>
                    <Tag v="n">⏱ {step.duration}</Tag>
                    {step.resources?.map((r, i) => <Tag key={i} v="i">{r}</Tag>)}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', cursor: 'pointer', fontSize: '.875rem', color: 'var(--cts)', marginLeft: 'auto' }}>
                      <input type="checkbox" checked={isDone} onChange={() => toggle(step.stepNumber, isDone)}
                        style={{ width: 18, height: 18, accentColor: 'var(--cs)', cursor: 'pointer' }} />
                      {isDone ? 'Completed' : 'Mark done'}
                    </label>
                  </div>
                  {!isDone && (
                    <div style={{ display: 'flex', gap: '.75rem', marginTop: '1rem' }}>
                      <Btn v="s" sz="sm" onClick={() => openLesson(step)}>📖 Learn Now</Btn>
                      <Btn v="g" sz="sm" onClick={() => openQuiz(step)}>🧠 Test Knowledge</Btn>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <LessonModal open={lesson.open} onClose={() => setLesson(p => ({ ...p, open: false }))} topic={lesson.topic} content={lesson.content} loading={lesson.loading} />
      <QuizModal open={quiz.open} onClose={() => setQuiz(p => ({ ...p, open: false }))} topic={quiz.topic} quiz={quiz.data} loading={quiz.loading} onPass={() => quiz.step && toggle(quiz.step.stepNumber, false)} />
    </Layout>
  )
}

// ─── CHAT ──────────────────────────────────────────────────────────────────────
const TypingDots = () => (
  <div style={{ display: 'flex', gap: 5, alignItems: 'center', padding: '12px 16px', background: 'var(--bge)', borderRadius: '16px', width: 64, borderBottomLeftRadius: 4 }}>
    {[0, 1, 2].map(i => (
      <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--cp)', animation: `a-bounce 1s ${i * .2}s infinite ease-in-out` }} />
    ))}
  </div>
)

function Chat({ user, roadmap, lp }) {
  const [msgs, setMsgs] = useState([{ role: 'assistant', content: "Hi! I'm SkillPath AI 🤖 Ask me anything about your learning journey, concepts, or projects!" }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bot = useRef()

  useEffect(() => { bot.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, typing])

  const send = async () => {
    const t = input.trim()
    if (!t || typing) return
    const newMsgs = [...msgs, { role: 'user', content: t }]
    setMsgs(newMsgs); setInput(''); setTyping(true)
    try {
      const reply = await genChat(newMsgs, roadmap?.goal)
      setMsgs(m => [...m, { role: 'assistant', content: reply }])
    } catch(e) {
      const msg = e.message || "I'm having trouble connecting. Please try again!"
      setMsgs(m => [...m, { role: 'assistant', content: msg }])
    }
    finally { setTyping(false) }
  }

  return (
    <Layout {...lp}>
      <div style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>AI Doubt <span className="grad">Assistant</span></h1>
            <p style={{ fontSize: '.875rem' }}>Ask anything about your learning journey — available 24/7</p>
          </div>
          <button className="btn btn-s btn-sm" onClick={() => setMsgs([{ role: 'assistant', content: "Hi! I'm SkillPath AI 🤖 Ask me anything!" }])}>+ New Chat</button>
        </div>
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: '.75rem', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', maxWidth: '80%', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: m.role === 'user' ? 'var(--ca)' : 'var(--cpg)', border: `2px solid ${m.role === 'user' ? 'var(--ca)' : 'var(--cp)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.875rem', fontWeight: 700, flexShrink: 0, color: m.role === 'user' ? '#0F0F1A' : 'var(--cpl)' }}>
                  {m.role === 'user' ? ini(user?.name) : '🤖'}
                </div>
                <div style={{ padding: '12px 16px', borderRadius: '16px', fontSize: '.875rem', lineHeight: 1.7, whiteSpace: 'pre-wrap', background: m.role === 'user' ? 'var(--cp)' : 'var(--bge)', border: `1px solid ${m.role === 'user' ? 'transparent' : 'var(--cb)'}`, color: m.role === 'user' ? '#fff' : 'var(--ct)', borderBottomRightRadius: m.role === 'user' ? 4 : '16px', borderBottomLeftRadius: m.role === 'assistant' ? 4 : '16px' }}>
                  {m.content}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display: 'flex', gap: '.75rem', alignSelf: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--cpg)', border: '2px solid var(--cp)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>🤖</div>
                <TypingDots />
              </div>
            )}
            <div ref={bot} />
          </div>
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--cb)', display: 'flex', gap: '.75rem', alignItems: 'flex-end', flexShrink: 0 }}>
            <textarea value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="Ask me anything about your learning journey..." rows={1}
              style={{ flex: 1, padding: '.75rem 1rem', background: 'var(--bge)', border: '1px solid var(--cb)', borderRadius: '16px', color: 'var(--ct)', resize: 'none', fontFamily: 'inherit', fontSize: '.875rem', maxHeight: 120, outline: 'none', lineHeight: 1.5, transition: 'border-color .2s' }}
              onFocus={e => e.target.style.borderColor = 'var(--cp)'}
              onBlur={e => e.target.style.borderColor = 'var(--cb)'}
              onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px' }}
            />
            <button className="btn btn-p" onClick={send} disabled={!input.trim() || typing} style={{ height: 44, flexShrink: 0 }}>↑</button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

// ─── PROJECTS ──────────────────────────────────────────────────────────────────
function Projects({ roadmap, lp }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    (async () => {
      setLoading(true)
      const ps = await genProjects(roadmap?.goal || 'Web Development', roadmap?.level || 'beginner')
      setProjects(ps); setLoading(false)
    })()
  }, [])

  const dc = { beginner: 's', intermediate: 'w', advanced: 'e' }
  const filt = filter === 'all' ? projects : projects.filter(p => p.difficulty === filter)

  return (
    <Layout {...lp}>
      <div className="fade-up">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '.5rem' }}>Project <span className="grad">Ideas</span></h1>
          <p>AI-recommended projects matched to your skill level. Build a real portfolio.</p>
        </div>
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['all', 'beginner', 'intermediate', 'advanced'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 16px', borderRadius: '9999px', border: '1px solid', borderColor: filter === f ? 'var(--cp)' : 'var(--cb)', background: filter === f ? 'var(--cpg)' : 'transparent', color: filter === f ? 'var(--cpl)' : 'var(--cts)', fontSize: '.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s' }}>
              {f === 'all' ? 'All' : f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Spin size={48} /><p>⚡ AI is generating project ideas for you...</p>
          </div>
        ) : (
          <div className="g3">
            {filt.map((p, i) => (
              <div key={i} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Tag v={dc[p.difficulty] || 'n'}>{p.difficulty}</Tag>
                  <button className="btn btn-g btn-sm">🔖</button>
                </div>
                <h3 style={{ fontSize: '1rem' }}>{p.title}</h3>
                <p style={{ fontSize: '.875rem', flex: 1 }}>{p.description}</p>
                {p.techStack?.length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{p.techStack.map(t => <Tag key={t} v="i">{t}</Tag>)}</div>}
                {p.estimatedTime && <div style={{ fontSize: '.75rem', color: 'var(--ctm)' }}>⏱ {p.estimatedTime}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

// ─── RESOURCES ─────────────────────────────────────────────────────────────────
const RSRC = [
  { title: 'MDN Web Docs', type: 'documentation', topic: 'Web Dev', desc: 'Comprehensive web technology documentation', url: 'https://developer.mozilla.org', tags: ['HTML', 'CSS', 'JS'] },
  { title: 'freeCodeCamp', type: 'course', topic: 'Web Dev', desc: 'Free coding curriculum with certificates', url: 'https://freecodecamp.org', tags: ['Full Stack', 'Python'] },
  { title: 'JavaScript.info', type: 'documentation', topic: 'JavaScript', desc: 'Modern JS tutorial from basics to advanced', url: 'https://javascript.info', tags: ['JS', 'ES6'] },
  { title: 'CSS-Tricks', type: 'article', topic: 'CSS', desc: 'Tips and guides for web design', url: 'https://css-tricks.com', tags: ['CSS', 'Grid', 'Flex'] },
  { title: 'React.dev', type: 'documentation', topic: 'React', desc: 'Official React docs and tutorials', url: 'https://react.dev', tags: ['React', 'Hooks'] },
  { title: 'Kaggle', type: 'course', topic: 'Data Science', desc: 'Data science competitions and notebooks', url: 'https://kaggle.com', tags: ['Python', 'ML'] },
  { title: 'CS50 Harvard', type: 'course', topic: 'CS Fundamentals', desc: "World-class intro to computer science", url: 'https://cs50.harvard.edu', tags: ['C', 'Python'] },
  { title: 'The Odin Project', type: 'course', topic: 'Web Dev', desc: 'Full stack curriculum, completely free', url: 'https://theodinproject.com', tags: ['HTML', 'CSS', 'JS'] },
  { title: 'Linux Foundation', type: 'course', topic: 'DevOps', desc: 'Cloud and DevOps learning paths', url: 'https://training.linuxfoundation.org', tags: ['Linux', 'K8s'] },
]
const TI = { video: '🎬', article: '📄', course: '🎓', documentation: '📚', tool: '🛠️' }
const TV = { video: 'e', article: 'i', course: 'p', documentation: 'a', tool: 'w' }

function Resources({ lp }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const filt = RSRC.filter(r => {
    const ms = r.title.toLowerCase().includes(search.toLowerCase()) || r.topic.toLowerCase().includes(search.toLowerCase())
    return ms && (filter === 'all' || r.type === filter)
  })

  return (
    <Layout {...lp}>
      <div className="fade-up">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '.5rem' }}>Resource <span className="grad">Library</span></h1>
          <p>Curated learning materials handpicked by our instructors.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ctm)', pointerEvents: 'none' }}>🔍</span>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title or topic..." className="inp" style={{ paddingLeft: 40 }} />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[{ v: 'all', l: 'All' }, { v: 'course', l: '🎓 Courses' }, { v: 'documentation', l: '📚 Docs' }, { v: 'article', l: '📄 Articles' }].map(f => (
              <button key={f.v} onClick={() => setFilter(f.v)} style={{ padding: '6px 16px', borderRadius: '9999px', border: '1px solid', borderColor: filter === f.v ? 'var(--cp)' : 'var(--cb)', background: filter === f.v ? 'var(--cpg)' : 'transparent', color: filter === f.v ? 'var(--cpl)' : 'var(--cts)', fontSize: '.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s' }}>{f.l}</button>
            ))}
          </div>
        </div>
        <div className="g3">
          {filt.map((r, i) => (
            <div key={i} className="card card-hover">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '.75rem' }}>
                <span style={{ fontSize: '1.4rem' }}>{TI[r.type] || '📄'}</span>
                <Tag v={TV[r.type] || 'n'}>{r.type}</Tag>
              </div>
              <h3 style={{ fontSize: '1rem', marginBottom: '.5rem' }}>{r.title}</h3>
              <p style={{ fontSize: '.875rem', marginBottom: '1rem' }}>{r.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <Tag v="n">{r.topic}</Tag>
                  {r.tags?.slice(0, 2).map(t => <Tag key={t} v="n">{t}</Tag>)}
                </div>
                <a href={r.url} target="_blank" rel="noopener noreferrer">
                  <button className="btn btn-p btn-sm">🔗 Visit</button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

// ─── PROFILE ───────────────────────────────────────────────────────────────────
function Profile({ user, roadmap, progress, onUpdate, lp }) {
  const [name, setName] = useState(user?.name || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const save = async e => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true); await new Promise(r => setTimeout(r, 400))
    onUpdate({ name: name.trim() }); setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <Layout {...lp}>
      <div className="fade-up" style={{ maxWidth: 700 }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '.5rem' }}>Your <span className="grad">Profile</span></h1>
          <p>Manage your account information and settings.</p>
        </div>
        <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Av name={user?.name} size={80} />
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: 4 }}>{user?.name}</h3>
            <p style={{ fontSize: '.875rem', marginBottom: '.25rem' }}>{user?.email}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Tag v="p">user</Tag>
              <Tag v="n">Joined {fmtDate(user?.createdAt)}</Tag>
            </div>
          </div>
        </div>
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>👤 Personal Information</h3>
          <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Field label="Full Name" id="pn" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
            <div className="fld">
              <label className="lbl">✉️ Email</label>
              <input className="inp" value={user?.email} disabled style={{ opacity: .6, cursor: 'not-allowed' }} />
              <span style={{ fontSize: '.75rem', color: 'var(--ctm)' }}>Email cannot be changed.</span>
            </div>
            <Btn type="submit" v="p" loading={saving} style={{ alignSelf: 'flex-start' }}>{saved ? '✓ Saved!' : '💾 Save Changes'}</Btn>
          </form>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>📊 Learning Stats</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
            {[
              { l: 'Topics Completed', v: progress?.completedSteps?.length || 0, em: '✅' },
              { l: 'Current Goal', v: roadmap?.goal || 'None', em: '🎯' },
              { l: 'Skill Level', v: roadmap?.level ? roadmap.level[0].toUpperCase() + roadmap.level.slice(1) : 'Not set', em: '⚡' },
            ].map(s => (
              <div key={s.l} style={{ background: 'var(--bge)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>{s.em}</div>
                <div style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: 4, color: 'var(--ct)' }}>{s.v}</div>
                <div style={{ fontSize: '.75rem', color: 'var(--cts)' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

// ApiKeyModal removed — GROQ_API_KEY is set server-side in Vercel env vars only.

// ─── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState('login')
  const [user, setUser] = useState(null)
  const [theme, setTheme] = useState('dark')
  const [roadmap, setRoadmap] = useState(null)
  const [progress, setProgress] = useState(null)
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    // Inject CSS
    if (!document.getElementById('sp-css')) {
      const el = document.createElement('style'); el.id = 'sp-css'; el.textContent = CSS; document.head.appendChild(el)
    }
    // Auto-show API key modal when opened from file:// (local) or any non-Claude origin

    // Load session
    ;(async () => {
      // Load theme first
      const th = await S.get('sp_theme')
      if (th) setTheme(th)
      // Restore session
      const sess = await S.get('sp_sess')
      if (sess && sess.uid) {
        const users = await S.get('sp_users') || []
        const u = users.find(u => u.id === sess.uid)
        if (u) {
          setUser(u)
          const rm = await S.get('sp_rm_' + u.id)
          const pr = await S.get('sp_pr_' + u.id)
          setRoadmap(rm); setProgress(pr)
          setPage(rm ? 'dashboard' : 'onboarding')
        }
      }
      setBooting(false)
    })()
  }, [])

  if (booting) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F0F1A', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spin" style={{ width: 48, height: 48, margin: '0 auto 16px', border: '3px solid #242438', borderTopColor: '#6C63FF' }} />
        <p style={{ color: '#9090B0' }}>Loading SkillPath AI...</p>
      </div>
    </div>
  )

  const go = pg => setPage(pg)

  const login = async (email, pass) => {
    const users = await S.get('sp_users') || []
    const u = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === pass)
    if (!u) throw new Error('Invalid email or password. Note: if you just registered, please use the same credentials.')
    setUser(u); await S.set('sp_sess', { uid: u.id })
    const rm = await S.get('sp_rm_' + u.id)
    const pr = await S.get('sp_pr_' + u.id)
    setRoadmap(rm); setProgress(pr)
    go(rm ? 'dashboard' : 'onboarding')
  }

  const register = async (name, email, pass) => {
    const users = await S.get('sp_users') || []
    const normEmail = email.toLowerCase().trim()
    if (users.find(u => u.email.toLowerCase() === normEmail)) throw new Error('Email already registered')
    const nu = { id: uid(), name: name.trim(), email: normEmail, password: pass, createdAt: new Date().toISOString() }
    const updatedUsers = [...users, nu]
    await S.set('sp_users', updatedUsers)
    // Verify it was stored correctly in memory
    if (!MEM['sp_users']) MEM['sp_users'] = updatedUsers
    setUser(nu); await S.set('sp_sess', { uid: nu.id })
    setRoadmap(null); setProgress(null); go('onboarding')
  }

  const logout = async () => {
    // Only clear the SESSION — never delete sp_users from memory so re-login works
    await S.del('sp_sess')
    setUser(null); setRoadmap(null); setProgress(null); go('login')
  }

  const onboardDone = async form => {
    const rm = await genRoadmap(form.learningGoal, form.currentLevel, form.weeklyHours)
    if (!rm) throw new Error('AI returned an invalid roadmap. Please try again.')
    const data = { ...rm, goal: form.learningGoal, level: form.currentLevel, weeklyHours: form.weeklyHours, aiGenerated: true }
    setRoadmap(data); await S.set('sp_rm_' + user.id, data)
    const pr = { completedSteps: [], percentComplete: 0, streak: 0 }
    setProgress(pr); await S.set('sp_pr_' + user.id, pr)
    go('dashboard')
  }

  const markStep = async (num, completed) => {
    setProgress(prev => {
      const cs = completed ? [...(prev?.completedSteps || []).filter(s => s !== num), num] : (prev?.completedSteps || []).filter(s => s !== num)
      const pct = (cs.length / (roadmap?.steps?.length || 1)) * 100
      const np = { ...prev, completedSteps: cs, percentComplete: pct }
      S.set('sp_pr_' + user.id, np)
      return np
    })
  }

  const regen = async (goal, level, hrs) => {
    const rm = await genRoadmap(goal, level, hrs)
    if (rm) {
      const data = { ...rm, goal, level, weeklyHours: hrs, aiGenerated: true }
      setRoadmap(data); await S.set('sp_rm_' + user.id, data)
      const pr = { completedSteps: [], percentComplete: 0, streak: 0 }
      setProgress(pr); await S.set('sp_pr_' + user.id, pr)
    }
  }

  const updateUser = async data => {
    const nu = { ...user, ...data }; setUser(nu)
    const users = await S.get('sp_users') || []
    await S.set('sp_users', users.map(u => u.id === user.id ? nu : u))
  }

  const toggleTheme = async () => {
    const t = theme === 'dark' ? 'light' : 'dark'; setTheme(t); await S.set('sp_theme', t)
  }

  const lp = { user, page, go, theme, toggleTheme, logout }

  return (
    <div className="sp" data-theme={theme}>
      {page === 'login' && <Login onLogin={login} go={go} />}
      {page === 'register' && <Register onRegister={register} go={go} />}
      {page === 'onboarding' && user && <Onboarding onDone={onboardDone} />}
      {page === 'dashboard' && user && <Dashboard user={user} roadmap={roadmap} progress={progress} go={go} lp={lp} />}
      {page === 'roadmap' && user && <Roadmap roadmap={roadmap} progress={progress} onMark={markStep} onRegen={regen} go={go} lp={lp} />}
      {page === 'chat' && user && <Chat user={user} roadmap={roadmap} lp={lp} />}
      {page === 'projects' && user && <Projects roadmap={roadmap} lp={lp} />}
      {page === 'resources' && user && <Resources lp={lp} />}
      {page === 'profile' && user && <Profile user={user} roadmap={roadmap} progress={progress} onUpdate={updateUser} lp={lp} />}
    </div>
  )
}
