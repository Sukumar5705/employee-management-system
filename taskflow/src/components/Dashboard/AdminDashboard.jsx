import { useContext } from 'react';
import Header      from '../others/Header';
import CreateTask  from '../others/CreateTask';
import AllTask     from '../AllTask';
import AuthContext from '../../context/AuthContext';

const AdminDashboard = ({ onLogout }) => {
  const { userData, logout } = useContext(AuthContext);
  const handleLogout = onLogout ?? logout;
  const employees   = userData?.employees || [];

  const chips = [
    { label:'Total Employees', value: employees.length,
      color:'#6c63ff', bg:'rgba(108,99,255,0.1)', border:'rgba(108,99,255,0.2)' },
    { label:'Total Tasks',
      value: employees.reduce((a,e) => a+(e.tasks?.length??0), 0),
      color:'#fff', bg:'rgba(255,255,255,0.05)', border:'rgba(255,255,255,0.1)' },
    { label:'Completed',
      value: employees.reduce((a,e) => a+(e.taskStats?.completed??0), 0),
      color:'#34d399', bg:'rgba(52,211,153,0.1)', border:'rgba(52,211,153,0.2)' },
    { label:'In Progress',
      value: employees.reduce((a,e) => a+(e.taskStats?.active??0), 0),
      color:'#facc15', bg:'rgba(250,204,21,0.1)', border:'rgba(250,204,21,0.2)' },
    { label:'Failed',
      value: employees.reduce((a,e) => a+(e.taskStats?.failed??0), 0),
      color:'#f87171', bg:'rgba(248,113,113,0.1)', border:'rgba(248,113,113,0.2)' },
  ];

  return (
    <div style={{ minHeight:'100vh', width:'100%', background:'#0a0a0f',
      padding:'24px 32px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'fixed', top:0, left:0, width:'500px', height:'500px',
        background:'#6c63ff', opacity:0.04, borderRadius:'50%', filter:'blur(120px)',
        pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'fixed', bottom:0, right:0, width:'400px', height:'400px',
        background:'#00e5be', opacity:0.04, borderRadius:'50%', filter:'blur(100px)',
        pointerEvents:'none', zIndex:0 }} />

      <div style={{ position:'relative', zIndex:10, maxWidth:'1200px', margin:'0 auto' }}>
        <Header onLogout={handleLogout} role="admin" />

        <div style={{ display:'flex', gap:'12px', marginBottom:'24px', flexWrap:'wrap' }}>
          {chips.map(chip => (
            <div key={chip.label} style={{ display:'flex', alignItems:'center', gap:'10px',
              padding:'10px 18px', borderRadius:'12px',
              background:chip.bg, border:`1px solid ${chip.border}` }}>
              <span style={{ color:chip.color, fontWeight:'800', fontSize:'22px' }}>{chip.value}</span>
              <span style={{ color:chip.color, opacity:0.7, fontSize:'12px' }}>{chip.label}</span>
            </div>
          ))}
        </div>

        <CreateTask />
        <AllTask />
      </div>
    </div>
  );
};

export default AdminDashboard;