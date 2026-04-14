import { useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';

const CATEGORIES = ['Development', 'Design', 'QA', 'DevOps', 'HR', 'Reporting', 'Administration',
  'Maintenance', 'Security', 'Database', 'Integration', 'Planning', 'Compliance', 'Other'];

const inputStyle = {
  width: '100%', background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.08)',
  color: '#fff', borderRadius: '10px', padding: '10px 14px',
  fontSize: '13px', outline: 'none', fontFamily: 'inherit',
  transition: 'border-color 0.2s', boxSizing: 'border-box',
};

const labelStyle = {
  color: '#666', fontSize: '11px', fontWeight: '600',
  textTransform: 'uppercase', letterSpacing: '0.07em',
  display: 'block', marginBottom: '6px',
};

const Field = ({ label, children }) => (
  <div style={{ marginBottom: '4px' }}>
    <label style={labelStyle}>{label}</label>
    {children}
  </div>
);

const CreateTask = () => {
  const { userData, createTask } = useContext(AuthContext);
  const [form, setForm] = useState({ title: '', date: '', description: '', assignTo: '', category: '' });
  const [status, setStatus] = useState(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      createTask(form.assignTo, { title: form.title, date: form.date, description: form.description, category: form.category });
      setStatus('success');
      setMsg(`Task assigned to ${form.assignTo} successfully!`);
      setForm({ title: '', date: '', description: '', assignTo: '', category: '' });
    } catch (err) {
      setStatus('error');
      setMsg(err.message || 'Failed to create task');
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const focusStyle = (e) => { e.target.style.borderColor = '#6c63ff'; };
  const blurStyle  = (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; };

  return (
    <div style={{ background: '#13131a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>

      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6c63ff', fontSize: '18px', flexShrink: 0 }}>+</div>
        <h2 style={{ color: '#fff', fontWeight: '700', fontSize: '15px', margin: 0 }}>Create New Task</h2>
      </div>

      {/* Status banner */}
      {status && (
        <div style={{
          marginBottom: '16px', padding: '10px 14px', borderRadius: '10px',
          fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px',
          background: status === 'success' ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
          border: `1px solid ${status === 'success' ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'}`,
          color: status === 'success' ? '#34d399' : '#f87171',
        }}>
          {status === 'success' ? '✓' : '✕'} {msg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Field label="Task Title">
              <input style={inputStyle} value={form.title} onChange={e => set('title', e.target.value)}
                placeholder="e.g. Fix login bug" required onFocus={focusStyle} onBlur={blurStyle} />
            </Field>
            <Field label="Due Date">
              <input style={inputStyle} type="date" value={form.date} onChange={e => set('date', e.target.value)}
                required onFocus={focusStyle} onBlur={blurStyle} />
            </Field>
            <Field label="Assign To">
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.assignTo}
                onChange={e => set('assignTo', e.target.value)} required onFocus={focusStyle} onBlur={blurStyle}>
                <option value="" disabled>Select employee…</option>
                {(userData?.employees || []).map(emp => (
                  <option key={emp.id} value={emp.name}>{emp.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Category">
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.category}
                onChange={e => set('category', e.target.value)} required onFocus={focusStyle} onBlur={blurStyle}>
                <option value="" disabled>Select category…</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          {/* Right column — description */}
          <Field label="Description">
            <textarea
              style={{ ...inputStyle, height: '100%', minHeight: '190px', resize: 'none', verticalAlign: 'top' }}
              value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Describe the task in detail…" required onFocus={focusStyle} onBlur={blurStyle}
            />
          </Field>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 24px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)',
            color: '#fff', fontSize: '13px', fontWeight: '600',
            border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1, fontFamily: 'inherit',
            boxShadow: '0 4px 14px rgba(108,99,255,0.25)',
            transition: 'opacity 0.2s',
          }}
        >
          {loading ? 'Creating…' : '+ Create Task'}
        </button>
      </form>
    </div>
  );
};

export default CreateTask;