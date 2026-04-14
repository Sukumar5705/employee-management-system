const CompleteTaskList = ({ data }) => (
  <div style={{
    position: 'relative', background: '#13131a',
    border: '1px solid rgba(52,211,153,0.2)', borderRadius: '16px',
    width: '300px', flexShrink: 0, padding: '20px', transition: 'border-color 0.2s',
  }}
    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(52,211,153,0.4)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(52,211,153,0.2)'}
  >
    <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: '#34d399', opacity: 0.05, borderRadius: '50%', filter: 'blur(24px)', pointerEvents: 'none' }} />

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
      <span style={{ padding: '4px 10px', borderRadius: '8px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399', fontSize: '11px', fontWeight: '600' }}>
        {data.category}
      </span>
      <span style={{ color: '#444', fontSize: '11px' }}>{data.date}</span>
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
      <span style={{ color: '#34d399', fontSize: '13px' }}>✓</span>
      <span style={{ color: '#34d399', fontSize: '11px', fontWeight: '500' }}>Completed</span>
    </div>

    <h3 style={{ color: '#fff', fontWeight: '700', fontSize: '15px', margin: '0 0 6px', lineHeight: 1.3 }}>{data.title}</h3>
    <p style={{ color: '#555', fontSize: '12px', lineHeight: 1.6, margin: '0 0 20px' }}>{data.description}</p>

    <div style={{ padding: '9px', borderRadius: '10px', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399', fontSize: '12px', fontWeight: '600', textAlign: 'center' }}>
      Task Completed
    </div>
  </div>
);

export default CompleteTaskList;