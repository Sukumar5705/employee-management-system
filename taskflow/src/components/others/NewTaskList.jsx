const NewTaskList = ({ data, onAccept }) => (
  <div style={{
    position: 'relative', background: '#13131a',
    border: '1px solid rgba(250,204,21,0.2)', borderRadius: '16px',
    width: '300px', flexShrink: 0, padding: '20px',
    transition: 'border-color 0.2s',
  }}
    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(250,204,21,0.45)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(250,204,21,0.2)'}
  >
    <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: '#facc15', opacity: 0.05, borderRadius: '50%', filter: 'blur(24px)', pointerEvents: 'none' }} />

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
      <span style={{ padding: '4px 10px', borderRadius: '8px', background: 'rgba(250,204,21,0.1)', border: '1px solid rgba(250,204,21,0.2)', color: '#facc15', fontSize: '11px', fontWeight: '600' }}>
        {data.category}
      </span>
      <span style={{ color: '#444', fontSize: '11px' }}>{data.date}</span>
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#facc15', display: 'inline-block' }} />
      <span style={{ color: '#facc15', fontSize: '11px', fontWeight: '500' }}>New Task</span>
    </div>

    <h3 style={{ color: '#fff', fontWeight: '700', fontSize: '15px', margin: '0 0 6px', lineHeight: 1.3 }}>{data.title}</h3>
    <p style={{ color: '#555', fontSize: '12px', lineHeight: 1.6, margin: '0 0 20px' }}>{data.description}</p>

    <button
      onClick={() => onAccept?.(data)}
      style={{
        width: '100%', padding: '9px', borderRadius: '10px',
        background: 'rgba(250,204,21,0.08)', border: '1px solid rgba(250,204,21,0.25)',
        color: '#facc15', fontSize: '13px', fontWeight: '600',
        cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#facc15'; e.currentTarget.style.color = '#000'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(250,204,21,0.08)'; e.currentTarget.style.color = '#facc15'; }}
    >
      Accept Task
    </button>
  </div>
);

export default NewTaskList;