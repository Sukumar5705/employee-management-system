import { useContext } from 'react';
import Header          from '../others/Header';
import TaskList        from '../others/Tasklist';
import TaskListNumber  from '../others/TaskListNumber';
import AuthContext     from '../../context/AuthContext';

const EmployeeDashboard = ({ data, onLogout }) => {
  const { logout, loggedInUserData } = useContext(AuthContext);
  const handleLogout = onLogout ?? logout;
  // Always use the freshest data from context (updated after each API call)
  const employee = loggedInUserData ?? data;

  return (
    <div style={{ minHeight:'100vh', width:'100%', background:'#0a0a0f',
      padding:'24px 32px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'fixed', top:0, right:0, width:'400px', height:'400px',
        background:'#6c63ff', opacity:0.05, borderRadius:'50%', filter:'blur(100px)',
        pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'fixed', bottom:0, left:0, width:'350px', height:'350px',
        background:'#00e5be', opacity:0.04, borderRadius:'50%', filter:'blur(100px)',
        pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'relative', zIndex:10, maxWidth:'1100px', margin:'0 auto' }}>
        <Header data={employee} onLogout={handleLogout} role="user" />
        <TaskListNumber data={employee} />
        <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px' }}>
          <h3 style={{ color:'#fff', fontWeight:'700', fontSize:'18px', margin:0 }}>My Tasks</h3>
          <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.05)' }} />
          <span style={{ color:'#444', fontSize:'12px' }}>
            {employee?.tasks?.length ?? 0} tasks total
          </span>
        </div>
        <TaskList data={employee} />
      </div>
    </div>
  );
};

export default EmployeeDashboard;