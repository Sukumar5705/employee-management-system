import { useEffect, useState } from 'react';

const readStats = (id) => {
  try {
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    const emp = employees.find(e => e.id === id);
    return emp?.taskStats ?? { newTask: 0, active: 0, completed: 0, failed: 0 };
  } catch { return { newTask: 0, active: 0, completed: 0, failed: 0 }; }
};

const CARDS = [
  { key: 'newTask',   label: 'New Tasks',   color: '#facc15', border: 'rgba(250,204,21,0.2)',  bg: 'rgba(250,204,21,0.06)',  icon: '＋' },
  { key: 'active',    label: 'In Progress', color: '#6c63ff', border: 'rgba(108,99,255,0.2)', bg: 'rgba(108,99,255,0.06)', icon: '↻' },
  { key: 'completed', label: 'Completed',   color: '#34d399', border: 'rgba(52,211,153,0.2)',  bg: 'rgba(52,211,153,0.06)',  icon: '✓' },
  { key: 'failed',    label: 'Failed',      color: '#f87171', border: 'rgba(248,113,113,0.2)', bg: 'rgba(248,113,113,0.06)', icon: '✕' },
];

const TaskListNumber = ({ data }) => {
  const [stats, setStats] = useState(() => readStats(data?.id));

  useEffect(() => {
    const handler = () => setStats(readStats(data?.id));
    window.addEventListener('tasksUpdated', handler);
    handler();
    return () => window.removeEventListener('tasksUpdated', handler);
  }, [data?.id]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
      {CARDS.map(card => (
        <div key={card.key} style={{
          position: 'relative', overflow: 'hidden',
          background: '#13131a',
          border: `1px solid ${card.border}`,
          borderRadius: '16px', padding: '20px',
          transition: 'transform 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          {/* Glow blob */}
          <div style={{
            position: 'absolute', top: '-16px', right: '-16px',
            width: '80px', height: '80px', borderRadius: '50%',
            background: card.color, opacity: 0.15, filter: 'blur(24px)',
            pointerEvents: 'none',
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
            <div>
              <p style={{ color: '#666', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                {card.label}
              </p>
              <h2 style={{ color: card.color, fontSize: '40px', fontWeight: '800', margin: 0, lineHeight: 1 }}>
                {stats[card.key] ?? 0}
              </h2>
            </div>
            <div style={{
              width: '38px', height: '38px', borderRadius: '10px',
              background: card.bg, border: `1px solid ${card.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: card.color, fontSize: '18px', fontWeight: '700',
            }}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskListNumber;