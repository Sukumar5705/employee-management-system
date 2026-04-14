import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

const ROLE_META = {
  admin:    { label:'👑 Admin',   color:'#6c63ff' },
  hr:       { label:'🧑‍💼 HR',     color:'#00e5be' },
  manager:  { label:'📋 Manager', color:'#facc15' },
  employee: { label:'',           color:'#888'    },
  user:     { label:'',           color:'#888'    },
};

const Header = ({ data, onLogout, role = 'user' }) => {
  const { logout } = useContext(AuthContext);
  const handleLogout = onLogout ?? logout;

  const initials = data?.name
    ? data.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : (role === 'admin' ? 'AD' : role === 'hr' ? 'HR' : role === 'manager' ? 'MG' : '?');

  const meta = ROLE_META[role] || ROLE_META['user'];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      marginBottom:'2rem', padding:'14px 20px',
      background:'#13131a', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'16px',
    }}>
      {/* Left: avatar + name */}
      <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
        <div style={{
          width:'44px', height:'44px', borderRadius:'12px', flexShrink:0,
          background:'linear-gradient(135deg,#6c63ff,#00e5be)',
          display:'flex', alignItems:'center', justifyContent:'center',
          color:'#fff', fontWeight:'700', fontSize:'14px',
          boxShadow:'0 4px 14px rgba(108,99,255,0.3)',
        }}>{initials}</div>
        <div>
          <p style={{ color:'#555', fontSize:'11px', fontWeight:'500', margin:'0 0 2px',
            display:'flex', alignItems:'center', gap:'6px' }}>
            {greeting()}
            {meta.label && (
              <span style={{ padding:'1px 8px', borderRadius:'6px', fontSize:'10px', fontWeight:'700',
                background:`${meta.color}18`, color:meta.color,
                border:`1px solid ${meta.color}30` }}>{meta.label}</span>
            )}
          </p>
          <h2 style={{ color:'#fff', fontWeight:'700', fontSize:'17px', margin:0, lineHeight:1.2 }}>
            {data?.name ?? (role === 'admin' ? 'Admin' : role === 'hr' ? 'HR Manager' : 'Manager')}
          </h2>
          {data?.designation && (
            <p style={{ color:'#6c63ff', fontSize:'11px', fontWeight:'500', margin:'2px 0 0' }}>
              {data.designation}{data.department ? ` · ${data.department}` : ''}
            </p>
          )}
        </div>
      </div>

      {/* Right: date + logout */}
      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'7px', padding:'7px 14px',
          borderRadius:'999px', background:'#0a0a0f', border:'1px solid rgba(255,255,255,0.07)',
          color:'#555', fontSize:'11px', whiteSpace:'nowrap' }}>
          <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#34d399',
            display:'inline-block', flexShrink:0 }} />
          {new Date().toLocaleDateString('en-IN', { weekday:'short', month:'short', day:'numeric' })}
        </div>

        <button onClick={handleLogout} style={{
          display:'flex', alignItems:'center', gap:'7px', padding:'7px 16px', borderRadius:'10px',
          background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.3)',
          color:'#f87171', fontSize:'13px', fontWeight:'600',
          cursor:'pointer', whiteSpace:'nowrap', fontFamily:'inherit', transition:'all 0.18s',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.18)';
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.6)';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(239,68,68,0.2)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;