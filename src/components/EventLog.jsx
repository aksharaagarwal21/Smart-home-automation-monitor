import { useSensors } from '../context/SensorContext';
import { useState } from 'react';
import './EventLog.css';

export default function EventLog() {
  const { state, clearLogs } = useSensors();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? state.logs
    : state.logs.filter(l => l.type === filter);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'temp', label: '🌡️ Temp' },
    { id: 'light', label: '💡 Light' },
    { id: 'motion', label: '🚶 Motion' },
    { id: 'system', label: '⚙️ System' },
  ];

  return (
    <section className="log-section">
      <div className="sec-title">
        <span className="sec-icon">📋</span>
        <h2>System Event Log</h2>
        <div className="sec-line" />
      </div>
      <div className="log-box">
        <div className="log-toolbar">
          <div className="log-filters">
            {filters.map(f => (
              <button key={f.id}
                className={`log-fbtn ${filter === f.id ? 'active' : ''}`}
                onClick={() => setFilter(f.id)}>
                {f.label}
              </button>
            ))}
          </div>
          <button className="log-clear" onClick={clearLogs}>🗑️ Clear</button>
        </div>
        <div className="log-scroll">
          {filtered.length === 0 && (
            <div className="log-empty">No log entries</div>
          )}
          {filtered.map(l => (
            <div key={l.id} className={`log-row log-${l.type}`}>
              <span className="log-time">{l.time}</span>
              <span className="log-ic">{l.icon}</span>
              <span className="log-msg">{l.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
