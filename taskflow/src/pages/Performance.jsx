import { useEffect, useState } from 'react';
import { performanceAPI } from '../utils/api';

/* ─── tiny helpers ─────────────────────────────────────────── */
const GradeChip = ({ grade }) => {
  const map = {
    A: { color:'#34d399', bg:'rgba(52,211,153,0.12)',  border:'rgba(52,211,153,0.3)'  },
    B: { color:'#6c63ff', bg:'rgba(108,99,255,0.12)',  border:'rgba(108,99,255,0.3)'  },
    C: { color:'#facc15', bg:'rgba(250,204,21,0.12)',  border:'rgba(250,204,21,0.3)'  },
    D: { color:'#fb923c', bg:'rgba(251,146,60,0.12)',  border:'rgba(251,146,60,0.3)'  },
    F: { color:'#f87171', bg:'rgba(248,113,113,0.12)', border:'rgba(248,113,113,0.3)' },
  };
  const s = map[grade] || map['F'];
  return (
    <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center',
      width:'32px', height:'32px', borderRadius:'8px', background:s.bg, border:`1px solid ${s.border}`,
      color:s.color, fontWeight:'800', fontSize:'15px' }}>{grade}</span>
  );
};

const Bar = ({ value, max, color }) => (
  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
    <div style={{ flex:1, height:'6px', borderRadius:'999px', background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
      <div style={{ height:'100%', width:`${max>0 ? (value/max)*100 : 0}%`,
        background:color, borderRadius:'999px', transition:'width 0.6s' }} />
    </div>
    <span style={{ color:'#555', fontSize:'11px', width:'24px', textAlign:'right' }}>{value}</span>
  </div>
);

const MiniBar = ({ pct, color }) => (
  <div style={{ width:'60px', height:'5px', borderRadius:'999px',
    background:'rgba(255,255,255,0.06)', overflow:'hidden', display:'inline-block' }}>
    <div style={{ height:'100%', width:`${pct}%`, background:color,
      borderRadius:'999px', transition:'width 0.5s' }} />
  </div>
);

const StatBox = ({ label, value, color, sub }) => (
  <div style={{ background:'#0f0f17', border:'1px solid rgba(255,255,255,0.06)',
    borderRadius:'12px', padding:'16px 20px' }}>
    <p style={{ color:'#555', fontSize:'11px', fontWeight:'600', textTransform:'uppercase',
      letterSpacing:'0.07em', margin:'0 0 6px' }}>{label}</p>
    <h3 style={{ color, fontSize:'28px', fontWeight:'800', margin:0, lineHeight:1 }}>{value}</h3>
    {sub && <p style={{ color:'#444', fontSize:'11px', margin:'4px 0 0' }}>{sub}</p>}
  </div>
);

const statusColor = s =>
  s==='completed'?'#34d399': s==='active'?'#6c63ff': s==='failed'?'#f87171':'#facc15';

const priorityColor = p =>
  p==='high'?'#f87171': p==='medium'?'#facc15':'#34d399';

/* ─── Employee Detail Modal ────────────────────────────────── */
const DetailModal = ({ empId, onClose }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    performanceAPI.byId(empId)
      .then(r => setDetail(r.data))
      .catch(() => setDetail(null))
      .finally(() => setLoading(false));
  }, [empId]);

  const overlay = {
    position:'fixed', inset:0, background:'rgba(0,0,0,0.75)',
    zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center',
    padding:'20px',
  };
  const modal = {
    background:'#13131a', border:'1px solid rgba(255,255,255,0.08)',
    borderRadius:'20px', padding:'28px', width:'100%', maxWidth:'800px',
    maxHeight:'85vh', overflowY:'auto', position:'relative',
  };

  if (loading) return (
    <div style={overlay}>
      <div style={modal}>
        <p style={{ color:'#555', textAlign:'center', padding:'40px 0' }}>Loading performance data…</p>
      </div>
    </div>
  );

  if (!detail) return (
    <div style={overlay} onClick={onClose}>
      <div style={modal}>
        <p style={{ color:'#f87171', textAlign:'center' }}>Failed to load data</p>
      </div>
    </div>
  );

  const { employee, stats, monthlyTrend, tasks } = detail;
  const maxMonthlyTotal = Math.max(...monthlyTrend.map(m => m.total), 1);

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
            <div style={{ width:'48px', height:'48px', borderRadius:'14px',
              background:'linear-gradient(135deg,#6c63ff,#00e5be)',
              display:'flex', alignItems:'center', justifyContent:'center',
              color:'#fff', fontWeight:'800', fontSize:'16px' }}>
              {employee.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)}
            </div>
            <div>
              <h2 style={{ color:'#fff', fontWeight:'700', fontSize:'18px', margin:0 }}>{employee.name}</h2>
              <p style={{ color:'#6c63ff', fontSize:'12px', margin:'2px 0 0' }}>{employee.designation} · {employee.department}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.06)',
            border:'1px solid rgba(255,255,255,0.1)', color:'#888', width:'32px', height:'32px',
            borderRadius:'8px', cursor:'pointer', fontSize:'16px', fontFamily:'inherit',
            display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
        </div>

        {/* Stats row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', marginBottom:'24px' }}>
          <StatBox label="Total Tasks"    value={stats.total}           color="#fff"    />
          <StatBox label="Completed"      value={stats.completed}        color="#34d399" />
          <StatBox label="Completion Rate" value={`${stats.completionRate}%`} color="#6c63ff" />
          <StatBox label="Perf. Score"    value={stats.performanceScore} color="#facc15"
            sub={`Avg ${stats.avgCompletionDays}d to complete`} />
        </div>

        {/* Monthly trend */}
        <div style={{ background:'#0f0f17', border:'1px solid rgba(255,255,255,0.06)',
          borderRadius:'12px', padding:'20px', marginBottom:'20px' }}>
          <p style={{ color:'#555', fontSize:'11px', fontWeight:'600', textTransform:'uppercase',
            letterSpacing:'0.07em', margin:'0 0 16px' }}>Monthly Trend (last 6 months)</p>
          <div style={{ display:'flex', gap:'12px', alignItems:'flex-end', height:'80px' }}>
            {monthlyTrend.map((m, i) => {
              const pct = maxMonthlyTotal > 0 ? (m.total / maxMonthlyTotal) * 100 : 0;
              return (
                <div key={i} style={{ flex:1, display:'flex', flexDirection:'column',
                  alignItems:'center', gap:'6px', height:'100%', justifyContent:'flex-end' }}>
                  <div style={{ width:'100%', display:'flex', flexDirection:'column',
                    justifyContent:'flex-end', gap:'2px' }}>
                    <div style={{ width:'100%', height:`${(m.completed/maxMonthlyTotal)*70}px`,
                      background:'#34d399', borderRadius:'4px 4px 0 0', minHeight: m.completed>0?'4px':0,
                      transition:'height 0.5s' }} />
                    <div style={{ width:'100%', height:`${(m.failed/maxMonthlyTotal)*70}px`,
                      background:'#f87171', minHeight: m.failed>0?'4px':0, transition:'height 0.5s' }} />
                  </div>
                  <span style={{ color:'#444', fontSize:'10px', whiteSpace:'nowrap' }}>{m.month}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display:'flex', gap:'16px', marginTop:'12px' }}>
            <span style={{ color:'#34d399', fontSize:'11px', display:'flex', alignItems:'center', gap:'4px' }}>
              <span style={{ width:'10px', height:'10px', borderRadius:'2px', background:'#34d399', display:'inline-block' }} />
              Completed
            </span>
            <span style={{ color:'#f87171', fontSize:'11px', display:'flex', alignItems:'center', gap:'4px' }}>
              <span style={{ width:'10px', height:'10px', borderRadius:'2px', background:'#f87171', display:'inline-block' }} />
              Failed
            </span>
          </div>
        </div>

        {/* Task list */}
        <div style={{ background:'#0f0f17', border:'1px solid rgba(255,255,255,0.06)',
          borderRadius:'12px', padding:'20px' }}>
          <p style={{ color:'#555', fontSize:'11px', fontWeight:'600', textTransform:'uppercase',
            letterSpacing:'0.07em', margin:'0 0 14px' }}>All Tasks ({tasks.length})</p>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px', maxHeight:'260px', overflowY:'auto' }}>
            {tasks.map((t,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'12px',
                padding:'10px 14px', borderRadius:'10px', background:'rgba(255,255,255,0.02)',
                border:'1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ width:'8px', height:'8px', borderRadius:'50%',
                  background:statusColor(t.status), display:'inline-block', flexShrink:0 }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ color:'#ccc', fontSize:'13px', fontWeight:'500', margin:0,
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.title}</p>
                  <p style={{ color:'#444', fontSize:'11px', margin:'2px 0 0' }}>{t.category} · Due {t.date}</p>
                </div>
                <span style={{ padding:'3px 8px', borderRadius:'6px', fontSize:'11px', fontWeight:'600',
                  background:`${priorityColor(t.priority)}18`, color:priorityColor(t.priority),
                  border:`1px solid ${priorityColor(t.priority)}30`, flexShrink:0 }}>
                  {t.priority}
                </span>
                <span style={{ padding:'3px 10px', borderRadius:'6px', fontSize:'11px', fontWeight:'600',
                  background:`${statusColor(t.status)}18`, color:statusColor(t.status), flexShrink:0,
                  border:`1px solid ${statusColor(t.status)}30`, textTransform:'capitalize' }}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Performance Page ────────────────────────────────── */
const PerformancePage = () => {
  const [data,      setData]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [selected,  setSelected]  = useState(null);
  const [sortBy,    setSortBy]    = useState('score');

  const load = () => {
    setLoading(true); setError(null);
    performanceAPI.all()
      .then(r => setData(r.data))
      .catch(() => setError('Failed to load performance data. Make sure the backend is running.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
      height:'300px', flexDirection:'column', gap:'12px' }}>
      <div style={{ width:'32px', height:'32px', borderRadius:'8px',
        background:'linear-gradient(135deg,#6c63ff,#00e5be)',
        display:'flex', alignItems:'center', justifyContent:'center' }}>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <path d="M3 5h14M3 10h9M3 15h5" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
        </svg>
      </div>
      <p style={{ color:'#444', fontSize:'13px', margin:0 }}>Loading performance data from MongoDB…</p>
    </div>
  );

  if (error) return (
    <div style={{ background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.2)',
      borderRadius:'12px', padding:'20px', textAlign:'center' }}>
      <p style={{ color:'#f87171', margin:'0 0 12px' }}>{error}</p>
      <button onClick={load} style={{ padding:'8px 20px', borderRadius:'8px', cursor:'pointer',
        background:'rgba(108,99,255,0.1)', border:'1px solid rgba(108,99,255,0.3)',
        color:'#6c63ff', fontSize:'13px', fontWeight:'600', fontFamily:'inherit' }}>
        Retry
      </button>
    </div>
  );

  const { summary, employees } = data;

  const sorted = [...employees].sort((a, b) => {
    if (sortBy === 'score')      return b.stats.performanceScore - a.stats.performanceScore;
    if (sortBy === 'completed')  return b.stats.completed        - a.stats.completed;
    if (sortBy === 'rate')       return b.stats.completionRate   - a.stats.completionRate;
    if (sortBy === 'failed')     return b.stats.failed           - a.stats.failed;
    return 0;
  });

  const thStyle = { color:'#444', fontSize:'11px', fontWeight:'600', textTransform:'uppercase',
    letterSpacing:'0.07em', padding:'0 12px 12px', textAlign:'left',
    borderBottom:'1px solid rgba(255,255,255,0.05)', whiteSpace:'nowrap' };
  const tdStyle = { padding:'14px 12px', borderBottom:'1px solid rgba(255,255,255,0.03)',
    verticalAlign:'middle' };

  return (
    <div>
      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'24px' }}>
        <StatBox label="Total Employees"   value={summary.totalEmployees}    color="#6c63ff" />
        <StatBox label="Total Tasks"       value={summary.totalTasks}        color="#fff"    />
        <StatBox label="Avg Completion"    value={`${summary.avgCompletionRate}%`} color="#34d399" />
        <StatBox label="Top Performer"     value={summary.topPerformer}      color="#facc15"
          sub="Highest performance score" />
      </div>

      {/* Overview bar charts */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'24px' }}>
        {/* Completion breakdown */}
        <div style={{ background:'#13131a', border:'1px solid rgba(255,255,255,0.05)',
          borderRadius:'14px', padding:'20px' }}>
          <p style={{ color:'#555', fontSize:'11px', fontWeight:'600', textTransform:'uppercase',
            letterSpacing:'0.07em', margin:'0 0 16px' }}>Task Breakdown</p>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {[
              { label:'Completed', value:summary.totalCompleted, color:'#34d399' },
              { label:'Failed',    value:summary.totalFailed,    color:'#f87171' },
              { label:'Active',    value:summary.totalActive,    color:'#6c63ff' },
              { label:'New',       value:summary.totalTasks - summary.totalCompleted - summary.totalFailed - summary.totalActive,
                                   color:'#facc15' },
            ].map(item => (
              <div key={item.label}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                  <span style={{ color:'#666', fontSize:'12px' }}>{item.label}</span>
                  <span style={{ color:item.color, fontSize:'12px', fontWeight:'700' }}>{item.value}</span>
                </div>
                <Bar value={item.value} max={summary.totalTasks} color={item.color} />
              </div>
            ))}
          </div>
        </div>

        {/* Grade distribution */}
        <div style={{ background:'#13131a', border:'1px solid rgba(255,255,255,0.05)',
          borderRadius:'14px', padding:'20px' }}>
          <p style={{ color:'#555', fontSize:'11px', fontWeight:'600', textTransform:'uppercase',
            letterSpacing:'0.07em', margin:'0 0 16px' }}>Grade Distribution</p>
          {['A','B','C','D','F'].map(g => {
            const count = employees.filter(e => e.grade === g).length;
            const gc = {A:'#34d399',B:'#6c63ff',C:'#facc15',D:'#fb923c',F:'#f87171'}[g];
            return (
              <div key={g} style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'10px' }}>
                <GradeChip grade={g} />
                <div style={{ flex:1 }}>
                  <Bar value={count} max={employees.length} color={gc} />
                </div>
                <span style={{ color:'#444', fontSize:'12px', width:'20px', textAlign:'right' }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Employee performance table */}
      <div style={{ background:'#13131a', border:'1px solid rgba(255,255,255,0.05)',
        borderRadius:'14px', padding:'24px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
          marginBottom:'20px', flexWrap:'wrap', gap:'12px' }}>
          <h2 style={{ color:'#fff', fontWeight:'700', fontSize:'15px', margin:0 }}>
            📊 Employee Performance
          </h2>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <span style={{ color:'#444', fontSize:'12px' }}>Sort by:</span>
            {[
              { key:'score',     label:'Score'     },
              { key:'completed', label:'Completed' },
              { key:'rate',      label:'Rate'      },
              { key:'failed',    label:'Failed'    },
            ].map(s => (
              <button key={s.key} onClick={() => setSortBy(s.key)} style={{
                padding:'5px 12px', borderRadius:'8px', cursor:'pointer', fontFamily:'inherit',
                border:`1px solid ${sortBy===s.key ? 'rgba(108,99,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                background: sortBy===s.key ? 'rgba(108,99,255,0.15)' : 'transparent',
                color: sortBy===s.key ? '#6c63ff' : '#555',
                fontSize:'11px', fontWeight:'600', transition:'all 0.2s',
              }}>{s.label}</button>
            ))}
          </div>
        </div>

        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...thStyle }}>Employee</th>
                <th style={{ ...thStyle, textAlign:'center' }}>Grade</th>
                <th style={{ ...thStyle, textAlign:'center' }}>Score</th>
                <th style={{ ...thStyle, textAlign:'center' }}>Done</th>
                <th style={{ ...thStyle, textAlign:'center' }}>Failed</th>
                <th style={{ ...thStyle, textAlign:'center' }}>Rate</th>
                <th style={{ ...thStyle, textAlign:'center' }}>Avg Days</th>
                <th style={{ ...thStyle, textAlign:'right' }}>Progress</th>
                <th style={{ ...thStyle, textAlign:'center' }}>Detail</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((emp, idx) => {
                const s = emp.stats;
                const initials = emp.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);
                const scoreColor = s.performanceScore>=70?'#34d399':s.performanceScore>=40?'#facc15':'#f87171';
                return (
                  <tr key={emp._id || idx}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}
                    style={{ transition:'background 0.15s' }}>
                    <td style={tdStyle}>
                      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                        <div style={{ width:'34px', height:'34px', borderRadius:'10px', flexShrink:0,
                          background:'linear-gradient(135deg,#6c63ff,#00e5be)',
                          display:'flex', alignItems:'center', justifyContent:'center',
                          color:'#fff', fontSize:'12px', fontWeight:'700' }}>{initials}</div>
                        <div>
                          <p style={{ color:'#fff', fontWeight:'600', fontSize:'13px', margin:0 }}>{emp.name}</p>
                          <p style={{ color:'#444', fontSize:'11px', margin:0 }}>{emp.designation}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, textAlign:'center' }}>
                      <GradeChip grade={emp.grade} />
                    </td>
                    <td style={{ ...tdStyle, textAlign:'center' }}>
                      <span style={{ color:scoreColor, fontWeight:'800', fontSize:'16px' }}>
                        {s.performanceScore}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign:'center' }}>
                      <span style={{ color:'#34d399', fontWeight:'700' }}>{s.completed}</span>
                    </td>
                    <td style={{ ...tdStyle, textAlign:'center' }}>
                      <span style={{ color:'#f87171', fontWeight:'700' }}>{s.failed}</span>
                    </td>
                    <td style={{ ...tdStyle, textAlign:'center' }}>
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' }}>
                        <span style={{ color:s.completionRate>=70?'#34d399':s.completionRate>=40?'#facc15':'#f87171',
                          fontWeight:'700', fontSize:'13px' }}>{s.completionRate}%</span>
                        <MiniBar pct={s.completionRate}
                          color={s.completionRate>=70?'#34d399':s.completionRate>=40?'#facc15':'#f87171'} />
                      </div>
                    </td>
                    <td style={{ ...tdStyle, textAlign:'center' }}>
                      <span style={{ color:'#888', fontSize:'13px' }}>
                        {s.avgCompletionDays > 0 ? `${s.avgCompletionDays}d` : '—'}
                      </span>
                    </td>
                    <td style={{ ...tdStyle }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                        <div style={{ width:'80px', height:'5px', borderRadius:'999px',
                          background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
                          <div style={{ height:'100%', width:`${s.completionRate}%`,
                            background:'linear-gradient(90deg,#6c63ff,#34d399)',
                            borderRadius:'999px', transition:'width 0.5s' }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, textAlign:'center' }}>
                      <button onClick={() => setSelected(emp._id)} style={{
                        padding:'5px 12px', borderRadius:'8px', cursor:'pointer',
                        background:'rgba(108,99,255,0.1)', border:'1px solid rgba(108,99,255,0.25)',
                        color:'#6c63ff', fontSize:'11px', fontWeight:'600', fontFamily:'inherit',
                        transition:'all 0.2s',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background='rgba(108,99,255,0.2)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background='rgba(108,99,255,0.1)'; }}
                      >View →</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {selected && <DetailModal empId={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default PerformancePage;