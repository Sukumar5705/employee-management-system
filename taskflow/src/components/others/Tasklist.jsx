import { useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import AcceptTasklist    from './AcceptTasklist';
import NewTaskList       from './NewTaskList';
import CompleteTaskList  from './CompleteTaskList';
import FailedTaskList    from './FailedTasklist';

const FILTERS = ['all', 'new', 'active', 'completed', 'failed'];
const FILTER_STYLES = {
  all:       { color:'#fff',    border:'rgba(255,255,255,0.2)',  bg:'rgba(255,255,255,0.05)' },
  new:       { color:'#facc15', border:'rgba(250,204,21,0.3)',   bg:'rgba(250,204,21,0.1)'  },
  active:    { color:'#6c63ff', border:'rgba(108,99,255,0.3)',   bg:'rgba(108,99,255,0.1)'  },
  completed: { color:'#34d399', border:'rgba(52,211,153,0.3)',   bg:'rgba(52,211,153,0.1)'  },
  failed:    { color:'#f87171', border:'rgba(248,113,113,0.3)',  bg:'rgba(248,113,113,0.1)' },
};

const TaskList = ({ data }) => {
  const { updateTaskStatus, refreshMyTasks } = useContext(AuthContext);
  const [tasks,        setTasks]        = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  // Sync tasks from live data prop (comes from MongoDB via AuthProvider)
  useEffect(() => {
    const raw = data?.tasks ?? [];
    setTasks(raw.map(t => ({ ...t, id: t._id || t.id })));
  }, [data]);

  // Also re-sync when tasksUpdated fires
  useEffect(() => {
    const handler = async () => {
      await refreshMyTasks();
    };
    window.addEventListener('tasksUpdated', handler);
    return () => window.removeEventListener('tasksUpdated', handler);
  }, [refreshMyTasks]);

  const mutate = async (taskId, newStatus) => {
    // Optimistic UI update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    // Persist to MongoDB
    await updateTaskStatus(taskId, newStatus);
  };

  const filtered     = activeFilter === 'all' ? tasks : tasks.filter(t => t.status === activeFilter);
  const filterCount  = f => f === 'all' ? tasks.length : tasks.filter(t => t.status === f).length;

  return (
    <div>
      {/* Filter bar */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'20px', flexWrap:'wrap' }}>
        {FILTERS.map(f => {
          const active = activeFilter === f;
          const s = FILTER_STYLES[f];
          return (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              padding:'6px 14px', borderRadius:'10px',
              border:`1px solid ${active ? s.border : 'rgba(255,255,255,0.08)'}`,
              background: active ? s.bg : 'transparent',
              color: active ? s.color : '#444',
              fontSize:'12px', fontWeight:'600',
              cursor:'pointer', textTransform:'capitalize',
              transition:'all 0.2s', fontFamily:'inherit',
            }}>
              {f} ({filterCount(f)})
            </button>
          );
        })}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
          justifyContent:'center', height:'180px', color:'#333', gap:'8px' }}>
          <span style={{ fontSize:'32px' }}>📋</span>
          <p style={{ margin:0, fontSize:'13px' }}>No tasks in this category</p>
        </div>
      ) : (
        <div id="tasklist" style={{ display:'flex', gap:'16px', overflowX:'auto',
          paddingBottom:'16px', scrollbarWidth:'none' }}>
          {filtered.map(task => {
            const id = task._id || task.id;
            if (task.status === 'new')
              return <NewTaskList key={id} data={task} onAccept={() => mutate(id, 'active')} />;
            if (task.status === 'active')
              return <AcceptTasklist key={id} data={task}
                onMoveToCompleted={() => mutate(id, 'completed')}
                onMoveToFailed={() => mutate(id, 'failed')} />;
            if (task.status === 'completed')
              return <CompleteTaskList key={id} data={task} />;
            if (task.status === 'failed')
              return <FailedTaskList key={id} data={task} />;
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default TaskList;