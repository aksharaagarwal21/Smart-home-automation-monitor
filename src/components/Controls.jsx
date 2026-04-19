import { useSensors } from '../context/SensorContext';
import './Controls.css';

export default function Controls() {
  const { state, setTemp, setLight, triggerMotion, applyScenario } = useSensors();

  return (
    <div className="ctrl-panel">
      <div className="sec-title">
        <span className="sec-icon">🎛️</span>
        <h2>Simulator Controls</h2>
        <div className="sec-line" />
      </div>

      <div className="ctrl-grid">
        {/* Temperature */}
        <div className="ctrl-card">
          <div className="ctrl-head">
            <span>🌡️</span>
            <h3>Temperature</h3>
          </div>
          <p className="ctrl-desc">Simulate room temperature changes</p>
          <input
            type="range" min="0" max="50" value={state.temperature}
            className="range-input range-temp"
            onChange={e => setTemp(+e.target.value)}
          />
          <div className="range-labels">
            <span>0°C</span>
            <span className="range-val">{state.temperature}°C</span>
            <span>50°C</span>
          </div>
          <div className="threshold-bar">
            <span>⚠️ Threshold: <strong>35°C</strong></span>
          </div>
        </div>

        {/* Light */}
        <div className="ctrl-card">
          <div className="ctrl-head">
            <span>💡</span>
            <h3>Light Level</h3>
          </div>
          <p className="ctrl-desc">Simulate ambient light conditions</p>
          <input
            type="range" min="0" max="1000" value={state.lightLevel}
            className="range-input range-light"
            onChange={e => setLight(+e.target.value)}
          />
          <div className="range-labels">
            <span>Dark</span>
            <span className="range-val">{state.lightLevel} lux</span>
            <span>Bright</span>
          </div>
          <div className="threshold-bar">
            <span>🌙 Dark Threshold: <strong>200 lux</strong></span>
          </div>
        </div>

        {/* Motion */}
        <div className="ctrl-card">
          <div className="ctrl-head">
            <span>🚶</span>
            <h3>Motion Trigger</h3>
          </div>
          <p className="ctrl-desc">Simulate motion detection event</p>
          <button className="motion-trigger-btn" onClick={triggerMotion}>
            <span className="wave-icon">👋</span>
            <span>Trigger Motion</span>
          </button>
          <div className="countdown-row">
            Motion clears in:{' '}
            <span className="cd-num">{state.motionSecondsLeft > 0 ? state.motionSecondsLeft + 's' : '--'}</span>
          </div>
        </div>

        {/* Scenarios */}
        <div className="ctrl-card scenarios-card">
          <div className="ctrl-head">
            <span>🎬</span>
            <h3>Quick Scenarios</h3>
          </div>
          <div className="scenario-grid">
            {[
              { id: 'normal', icon: '🏠', label: 'Normal' },
              { id: 'hot', icon: '🔥', label: 'Hot Room' },
              { id: 'dark', icon: '🌙', label: 'Dark Room' },
              { id: 'intruder', icon: '🚨', label: 'Intruder' },
              { id: 'allalert', icon: '⚡', label: 'All Alerts' },
            ].map(s => (
              <button key={s.id} className="scn-btn" onClick={() => applyScenario(s.id)}>
                <span>{s.icon}</span> {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
