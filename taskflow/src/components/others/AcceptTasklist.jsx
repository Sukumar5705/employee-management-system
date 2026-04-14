const AcceptTasklist = ({ data, onMoveToCompleted, onMoveToFailed }) => (
  <div style={{
    position: 'relative', background: '#13131a',
    border: '1px solid rgba(108,99,255,0.25)', borderRadius: '16px',
    width: '300px', flexShrink: 0, padding: '20px', transition: 'border-color 0.2s',
  }}
    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(108,99,255,0.5)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(108,99,255,0.25)'}
  >
    <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: '#6c63ff', opacity: 0.05, borderRadius: '50%', filter: 'blur(24px)', pointerEvents: 'none' }} />

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
      <span style={{ padding: '4px 10px', borderRadius: '8px', background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)', color: '#6c63ff', fontSize: '11px', fontWeight: '600' }}>
        {data.category}
      </span>
      <span style={{ color: '#444', fontSize: '11px' }}>{data.date}</span>
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6c63ff', display: 'inline-block' }} />
      <span style={{ color: '#6c63ff', fontSize: '11px', fontWeight: '500' }}>In Progress</span>
    </div>

    <h3 style={{ color: '#fff', fontWeight: '700', fontSize: '15px', margin: '0 0 6px', lineHeight: 1.3 }}>{data.title}</h3>
    <p style={{ color: '#555', fontSize: '12px', lineHeight: 1.6, margin: '0 0 20px' }}>{data.description}</p>

    <div style={{ display: 'flex', gap: '8px' }}>
      <button
        onClick={() => onMoveToCompleted?.(data)}
        style={{
          flex: 1, padding: '8px', borderRadius: '10px',
          background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)',
          color: '#34d399', fontSize: '12px', fontWeight: '600',
          cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#34d399'; e.currentTarget.style.color = '#000'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.08)'; e.currentTarget.style.color = '#34d399'; }}
      >
        ✓ Done
      </button>
      <button
        onClick={() => onMoveToFailed?.(data)}
        style={{
          flex: 1, padding: '8px', borderRadius: '10px',
          background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)',
          color: '#f87171', fontSize: '12px', fontWeight: '600',
          cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#f87171'; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; e.currentTarget.style.color = '#f87171'; }}
      >
        ✕ Failed
      </button>
    </div>
  </div>
);

export default AcceptTasklist;