import { useEffect, useState, useCallback } from 'react';
import AuthContext from './AuthContext';
import { authAPI, taskAPI, employeeAPI } from '../utils/api';

const AuthProvider = ({ children }) => {
  const [userData,         setUserData]         = useState({ employees: [] });
  const [user,             setUser]             = useState(null);
  const [loggedInUserData, setLoggedInUserData] = useState(null);
  const [loading,          setLoading]          = useState(true);
  const [apiError,         setApiError]         = useState(null);

  useEffect(() => {
    const restore = async () => {
      const token   = localStorage.getItem('tf_token');
      const session = localStorage.getItem('tf_session');
      if (!token || !session) { setLoading(false); return; }
      try {
        const res      = await authAPI.me();
        const userData = res.data.user;
        const role     = userData.role;
        setLoggedInUserData(userData);
        setUser(role);
        if (['admin', 'hr', 'manager'].includes(role)) {
          const empRes = await employeeAPI.all();
          setUserData({ employees: empRes.data.employees });
        }
      } catch {
        localStorage.removeItem('tf_token');
        localStorage.removeItem('tf_session');
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const login = useCallback(async (email, password) => {
    setApiError(null);
    try {
      const res              = await authAPI.login(email, password);
      const { token, user: userData } = res.data;
      const role             = userData.role;
      localStorage.setItem('tf_token',   token);
      localStorage.setItem('tf_session', JSON.stringify({ role }));
      setLoggedInUserData(userData);
      setUser(role);   // ← this sets 'hr', 'manager', 'admin', or 'employee'
      if (['admin', 'hr', 'manager'].includes(role)) {
        const empRes = await employeeAPI.all();
        setUserData({ employees: empRes.data.employees });
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Invalid credentials';
      throw new Error(msg);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('tf_token');
    localStorage.removeItem('tf_session');
    setUser(null);
    setLoggedInUserData(null);
    setUserData({ employees: [] });
  }, []);

  const refreshMyTasks = useCallback(async () => {
    try {
      const res = await taskAPI.myTasks();
      setLoggedInUserData(prev => ({
        ...prev,
        tasks:     res.data.tasks,
        taskStats: res.data.stats,
      }));
    } catch { /* ignore */ }
  }, []);

  const refreshAllEmployees = useCallback(async () => {
    try {
      const res = await employeeAPI.all();
      setUserData({ employees: res.data.employees });
    } catch { /* ignore */ }
  }, []);

  const updateTaskStatus = useCallback(async (taskId, newStatus) => {
    try {
      const res = await taskAPI.updateStatus(taskId, newStatus);
      setLoggedInUserData(prev => ({
        ...prev,
        tasks: prev.tasks.map(t =>
          (t._id === taskId || t.id === taskId) ? { ...t, status: newStatus } : t
        ),
        taskStats: res.data.stats,
      }));
      window.dispatchEvent(new CustomEvent('tasksUpdated'));
    } catch (err) {
      console.error('Failed to update task:', err.response?.data?.error);
    }
  }, []);

  const createTask = useCallback(async (taskPayload) => {
    const res = await taskAPI.create(taskPayload);
    await refreshAllEmployees();
    window.dispatchEvent(new CustomEvent('tasksUpdated'));
    return res.data;
  }, [refreshAllEmployees]);

  return (
    <AuthContext.Provider value={{
      userData, user, loggedInUserData, loading, apiError,
      login, logout, updateTaskStatus, createTask,
      refreshMyTasks, refreshAllEmployees,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;