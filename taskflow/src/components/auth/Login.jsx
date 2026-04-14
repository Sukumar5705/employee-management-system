import { useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';

const DEMO_USERS = [
  { role:'Admin',    email:'admin@example.com',     password:'123456', color:'#6c63ff' },
  { role:'HR',       email:'hr@example.com',         password:'123456', color:'#00e5be' },
  { role:'Manager',  email:'manager@example.com',    password:'123456', color:'#facc15' },
  { role:'Employee', email:'employee1@example.com',  password:'123456', color:'#f87171' },
];

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (u) => { setEmail(u.email); setPassword(u.password); setError(''); };

  const inputStyle = {
    width:'100%', background:'#0a0a0f', border:'1px solid rgba(255,255,255,0.08)',
    color:'#fff', borderRadius:'12px', padding:'12px 16px', fontSize:'14px',
    outline:'none', fontFamily:'inherit', boxSizing:'border-box', transition:'border-color 0.2s',
  };

  return (
    <div style={{ minHeight:'100vh', width:'100vw', display:'flex', alignItems:'center',
      justifyContent:'center', background:'#0a0a0f', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'-20%', left:'-10%', width:'600px', height:'600px',
        background:'#6c63ff', opacity:0.1, borderRadius:'50%', filter:'blur(120px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-20%', right:'-10%', width:'500px', height:'500px',
        background:'#00e5be', opacity:0.1, borderRadius:'50%', filter:'blur(100px)', pointerEvents:'none' }} />

      <div style={{ position:'relative', zIndex:10, width:'100%', maxWidth:'440px', padding:'0 24px' }}>
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'32px', justifyContent:'center' }}>
          <div style={{ width:'42px', height:'42px', borderRadius:'12px',
            background:'linear-gradient(135deg,#6c63ff,#00e5be)',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 4px 20px rgba(108,99,255,0.35)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 5h14M3 10h9M3 15h5" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
              <circle cx="16" cy="14" r="3" fill="white" fillOpacity="0.9"/>
            </svg>
          </div>
          <span style={{ color:'#fff', fontSize:'24px', fontWeight:'800', letterSpacing:'-0.5px' }}>
            Task<span style={{ color:'#6c63ff' }}>Flow</span>
          </span>
        </div>

        {/* Card */}
        <div style={{ background:'#13131a', border:'1px solid rgba(255,255,255,0.07)',
          borderRadius:'20px', padding:'28px', boxShadow:'0 24px 60px rgba(0,0,0,0.5)' }}>
          <h1 style={{ color:'#fff', fontWeight:'700', fontSize:'20px', margin:'0 0 4px' }}>Welcome back</h1>
          <p style={{ color:'#555', fontSize:'13px', margin:'0 0 24px' }}>Sign in to your workspace</p>

          {error && (
            <div style={{ marginBottom:'16px', padding:'10px 14px', borderRadius:'10px',
              background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)',
              color:'#f87171', fontSize:'13px', display:'flex', alignItems:'center', gap:'8px' }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <div>
              <label style={{ color:'#666', fontSize:'11px', fontWeight:'600', textTransform:'uppercase',
                letterSpacing:'0.08em', display:'block', marginBottom:'7px' }}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com" required autoComplete="email" style={inputStyle}
                onFocus={e => e.target.style.borderColor='#6c63ff'}
                onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.08)'} />
            </div>
            <div>
              <label style={{ color:'#666', fontSize:'11px', fontWeight:'600', textTransform:'uppercase',
                letterSpacing:'0.08em', display:'block', marginBottom:'7px' }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required autoComplete="current-password" style={inputStyle}
                onFocus={e => e.target.style.borderColor='#6c63ff'}
                onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.08)'} />
            </div>
            <button type="submit" disabled={loading} style={{
              marginTop:'4px', width:'100%', padding:'13px', borderRadius:'12px',
              fontWeight:'600', fontSize:'14px', color:'#fff',
              background:'linear-gradient(135deg,#6c63ff,#8b5cf6)',
              border:'none', cursor: loading?'not-allowed':'pointer',
              opacity: loading?0.6:1, fontFamily:'inherit',
              boxShadow:'0 4px 20px rgba(108,99,255,0.3)', transition:'all 0.2s',
            }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform='translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; }}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          {/* Quick fill demo accounts */}
          <div style={{ marginTop:'20px', paddingTop:'18px', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ color:'#333', fontSize:'11px', margin:'0 0 10px', textTransform:'uppercase',
              letterSpacing:'0.07em', fontWeight:'600' }}>Quick fill demo account</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
              {DEMO_USERS.map(u => (
                <button key={u.role} onClick={() => quickFill(u)} style={{
                  padding:'8px 10px', borderRadius:'8px', cursor:'pointer', fontFamily:'inherit',
                  background:`${u.color}10`, border:`1px solid ${u.color}30`,
                  color:u.color, fontSize:'11px', fontWeight:'600', textAlign:'left',
                  transition:'all 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background=`${u.color}20`; }}
                  onMouseLeave={e => { e.currentTarget.style.background=`${u.color}10`; }}>
                  {u.role} <span style={{ opacity:0.6, fontWeight:'400' }}>· {u.email}</span>
                </button>
              ))}
            </div>
            <p style={{ color:'#2a2a2a', fontSize:'11px', margin:'10px 0 0', textAlign:'center' }}>
              All passwords: 123456
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;