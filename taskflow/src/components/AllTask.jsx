import { useEffect, useState } from 'react';

const readEmployees = () => {
  try { return JSON.parse(localStorage.getItem('employees')) || []; }
  catch { return []; }
};

const AllTask = ({ data }) => {
  const [employees, setEmployees] = useState(() => data || readEmployees());
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handler = () => setEmployees(data || readEmployees());
    window.addEventListener('tasksUpdated', handler);
    handler();
    return () => window.removeEventListener('tasksUpdated', handler);
  }, [data]);

  const filtered = employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

  const totals = employees.reduce((acc, emp) => {
    acc.new       += emp.taskStats?.newTask   ?? 0;
    acc.active    += emp.taskStats?.active    ?? 0;
    acc.completed += emp.taskStats?.completed ?? 0;
    acc.failed    += emp.taskStats?.failed    ?? 0;
    return acc;
  }, { new: 0, active: 0, completed: 0, failed: 0 });

  const thStyle = { color: '#444', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '0 12px 12px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)', whiteSpace: 'nowrap' };
  const tdStyle = { padding: '14px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '14px', verticalAlign: 'middle' };

  const Badge = ({ value, color, bg }) => (
    <span style={{ display: 'inline-block', minWidth: '28px', padding: '3px 8px', borderRadius: '8px', background: bg, color, fontWeight: '700', fontSize: '12px', textAlign: 'center' }}>
      {value}
    </span>
  );

  return (
    <div style={{ background: '#13131a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', fontSize: '16px' }}>
            👥
          </div>
          <h2 style={{ color: '#fff', fontWeight: '700', fontSize: '15px', margin: 0 }}>Team Overview</h2>
          <span style={{ padding: '3px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#555', fontSize: '12px' }}>
            {employees.length} members
          </span>
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#444', fontSize: '13px' }}>🔍</span>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search employee…"
            style={{ paddingLeft: '30px', paddingRight: '14px', paddingTop: '7px', paddingBottom: '7px', borderRadius: '10px', background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '12px', outline: 'none', fontFamily: 'inherit', width: '180px' }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, textAlign: 'left' }}>Employee</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>New</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Active</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Done</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Failed</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Progress</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp, idx) => {
              const s = emp.taskStats ?? {};
              const total = (s.newTask ?? 0) + (s.active ?? 0) + (s.completed ?? 0) + (s.failed ?? 0);
              const pct = total > 0 ? Math.round(((s.completed ?? 0) / total) * 100) : 0;
              const initials = emp.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
              return (
                <tr key={idx} style={{ transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg,#6c63ff,#00e5be)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>
                        {initials}
                      </div>
                      <div>
                        <p style={{ color: '#fff', fontWeight: '600', fontSize: '13px', margin: 0 }}>{emp.name}</p>
                        <p style={{ color: '#444', fontSize: '11px', margin: 0 }}>{emp.designation || 'Employee'}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}><Badge value={s.newTask ?? 0} color="#facc15" bg="rgba(250,204,21,0.1)" /></td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}><Badge value={s.active ?? 0} color="#6c63ff" bg="rgba(108,99,255,0.1)" /></td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}><Badge value={s.completed ?? 0} color="#34d399" bg="rgba(52,211,153,0.1)" /></td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}><Badge value={s.failed ?? 0} color="#f87171" bg="rgba(248,113,113,0.1)" /></td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                      <div style={{ width: '80px', height: '5px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, borderRadius: '999px', background: 'linear-gradient(90deg,#6c63ff,#34d399)', transition: 'width 0.5s' }} />
                      </div>
                      <span style={{ color: '#555', fontSize: '11px', width: '30px', textAlign: 'right' }}>{pct}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <td style={{ ...tdStyle, color: '#444', fontSize: '11px', fontWeight: '600' }}>Totals</td>
              <td style={{ ...tdStyle, textAlign: 'center' }}><Badge value={totals.new}       color="#facc15" bg="rgba(250,204,21,0.1)" /></td>
              <td style={{ ...tdStyle, textAlign: 'center' }}><Badge value={totals.active}    color="#6c63ff" bg="rgba(108,99,255,0.1)" /></td>
              <td style={{ ...tdStyle, textAlign: 'center' }}><Badge value={totals.completed} color="#34d399" bg="rgba(52,211,153,0.1)" /></td>
              <td style={{ ...tdStyle, textAlign: 'center' }}><Badge value={totals.failed}    color="#f87171" bg="rgba(248,113,113,0.1)" /></td>
              <td />
            </tr>
          </tfoot>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#333', fontSize: '13px' }}>No employees found</div>
        )}
      </div>
    </div>
  );
};

export default AllTask;