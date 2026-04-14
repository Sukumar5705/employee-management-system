import { useContext } from 'react';
import AuthContext from './context/AuthContext';
import Login from './components/auth/Login';
import AdminDashboard    from './components/Dashboard/AdminDashboard';
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard';
import HRDashboard       from './components/Dashboard/HrDashboard';
import ManagerDashboard  from './components/Dashboard/ManagerDashboard';

const Spinner = () => (
  <div style={{ minHeight:'100vh', width:'100vw', display:'flex', alignItems:'center',
    justifyContent:'center', background:'#0a0a0f', flexDirection:'column', gap:'16px' }}>
    <div style={{ width:'42px', height:'42px', borderRadius:'12px',
      background:'linear-gradient(135deg,#6c63ff,#00e5be)', display:'flex',
      alignItems:'center', justifyContent:'center',
      boxShadow:'0 4px 20px rgba(108,99,255,0.35)' }}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 5h14M3 10h9M3 15h5" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    </div>
    <p style={{ color:'#444', fontSize:'13px', margin:0 }}>Connecting to TaskFlow…</p>
  </div>
);

const App = () => {
  const { user, loggedInUserData, logout, loading } = useContext(AuthContext);

  if (loading) return <Spinner />;
  if (!user)   return <Login />;

  if (user === 'admin')   return <AdminDashboard   onLogout={logout} />;
  if (user === 'hr')      return <HRDashboard      data={loggedInUserData} onLogout={logout} />;
  if (user === 'manager') return <ManagerDashboard data={loggedInUserData} onLogout={logout} />;
  return                         <EmployeeDashboard data={loggedInUserData} onLogout={logout} />;
};

export default App;