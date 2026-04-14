import { useContext, useState } from 'react';
import Header          from '../../components/others/Header';
import CreateTask      from '../../components/others/CreateTask';
import AllTask         from '../../components/AllTask';
import PerformancePage from '../../pages/Performance';
import AuthContext     from '../../context/AuthContext';

const TABS = ['tasks', 'team', 'performance'];

const ManagerDashboard = ({ data, onLogout }) => {
  const { logout, userData } = useContext(AuthContext);
  const handleLogout = onLogout ?? logout;
  const [tab, setTab] = useState('tasks');
  const employees = userData?.employees || [];

  const chips = [
    { label:'Team Size',          value: employees.length,
      color:'#6c63ff', bg:'rgba(108,99,255,0.1)', border:'rgba(108,99,255,0.2)' },
    { label:'Tasks Assigned',
      value: employees.reduce((a,e) => a+(e.tasks?.length??0), 0),
      color:'#fff', bg:'rgba(255,255,255,0.05)', border:'rgba(255,255,255,0.1)' },
    { label:'Completed',
      value: employees.reduce((a,e) => a+(e.taskStats?.completed??0), 0),
      color:'#34d399', bg:'rgba(52,211,153,0.1)', border:'rgba(52,211,153,0.2)' },
    { label:'Needs Attention',
      value: employees.reduce((a,e) => a+(e.taskStats?.failed??0), 0),
      color:'#f87171', bg:'rgba(248,113,113,0.1)', border:'rgba(248,113,113,0.2)' },
  ];

  const TAB_LABELS = {
    tasks:       '➕ Assign Tasks',
    team:        '👥 Team Overview',
    performance: '📊 Performance',
  };

  return (
    <div style={{ minHeight:'100vh', width:'100%', background:'#0a0a0f',
      padding:'24px 32px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'fixed', top:0, right:0, width:'500px', height:'500px',
        background:'#6c63ff', opacity:0.04, borderRadius:'50%', filter:'blur(120px)',
        pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'fixed', bottom:0, left:0, width:'400px', height:'400px',
        background:'#00e5be', opacity:0.04, borderRadius:'50%', filter:'blur(100px)',
        pointerEvents:'none', zIndex:0 }} />

      <div style={{ position:'relative', zIndex:10, maxWidth:'1200px', margin:'0 auto' }}>
        <Header data={data} onLogout={handleLogout} role="manager" />

        <div style={{ display:'flex', gap:'12px', marginBottom:'24px', flexWrap:'wrap' }}>
          {chips.map(c => (
            <div key={c.label} style={{ display:'flex', alignItems:'center', gap:'10px',
              padding:'10px 18px', borderRadius:'12px', background:c.bg, border:`1px solid ${c.border}` }}>
              <span style={{ color:c.color, fontWeight:'800', fontSize:'22px' }}>{c.value}</span>
              <span style={{ color:c.color, opacity:0.7, fontSize:'12px' }}>{c.label}</span>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div style={{ display:'flex', gap:'8px', marginBottom:'24px' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding:'8px 20px', borderRadius:'10px', fontFamily:'inherit',
              border:`1px solid ${tab===t ? 'rgba(108,99,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
              background: tab===t ? 'rgba(108,99,255,0.15)' : 'transparent',
              color: tab===t ? '#6c63ff' : '#555',
              fontSize:'13px', fontWeight:'600', cursor:'pointer', transition:'all 0.2s',
            }}>{TAB_LABELS[t]}</button>
          ))}
        </div>

        {tab === 'tasks'       && <CreateTask />}
        {tab === 'team'        && <AllTask />}
        {tab === 'performance' && <PerformancePage />}
      </div>
    </div>
  );
};

export default ManagerDashboard;