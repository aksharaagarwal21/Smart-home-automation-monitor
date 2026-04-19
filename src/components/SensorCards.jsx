import { useSensors } from '../context/SensorContext';
import './SensorCards.css';

function GaugeRing({ value, max, color1, color2, size = 110, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  const offset = circ * (1 - pct * 0.75);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="gauge-svg">
      <defs>
        <linearGradient id={`g-${color1.replace('#','')}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color1} />
          <stop offset="100%" stopColor={color2} />
        </linearGradient>
      </defs>
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={strokeWidth} 
        strokeDasharray={`${circ * 0.75} ${circ * 0.25}`} strokeDashoffset={0} strokeLinecap="round"
        transform={`rotate(135 ${size/2} ${size/2})`} />
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={`url(#g-${color1.replace('#','')})`} strokeWidth={strokeWidth}
        strokeDasharray={`${circ * 0.75} ${circ * 0.25}`} strokeDashoffset={offset} strokeLinecap="round"
        transform={`rotate(135 ${size/2} ${size/2})`} style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
    </svg>
  );
}

export default function SensorCards() {
  const { state, TEMP_THRESHOLD, LIGHT_THRESHOLD } = useSensors();
  const { temperature, lightLevel, motionDetected, bulbOn, bulbBlinking, beeperActive } = state;

  const tempDanger = temperature >= TEMP_THRESHOLD;
  const tempWarn = temperature >= 28 && !tempDanger;
  const lightDark = lightLevel < LIGHT_THRESHOLD;
  const lightDim = lightLevel < 400 && !lightDark;

  return (
    <section className="cards-section">
      <div className="sec-title">
        <span className="sec-icon">📊</span>
        <h2>System Overview</h2>
        <div className="sec-line" />
      </div>
      <div className="cards-grid">
        {/* Temperature */}
        <div className={`s-card temp-card ${tempDanger ? 'alert' : ''}`}>
          <div className="card-accent temp-accent" />
          <div className="card-top">
            <span className="card-emoji">🌡️</span>
            <span className="card-lbl">Temperature</span>
            <span className="badge">DHT11</span>
          </div>
          <div className="gauge-wrap">
            <GaugeRing value={temperature} max={50} color1="#f59e0b" color2="#ef4444" />
            <div className="gauge-center">
              <span className="gauge-num">{temperature}</span>
              <span className="gauge-unit">°C</span>
            </div>
          </div>
          <div className={`card-pill ${tempDanger ? 'pill-danger' : tempWarn ? 'pill-warn' : 'pill-ok'}`}>
            {tempDanger ? '🔥 HIGH TEMP!' : tempWarn ? '⚠️ Warm' : '✅ Normal'}
          </div>
          <div className="card-action-row">
            <span className="action-label">Bulb</span>
            <span className={`action-dot ${bulbOn && !bulbBlinking ? 'dot-on' : ''}`} />
            <span className="action-txt">{bulbOn && !bulbBlinking ? 'ON (Glow)' : 'OFF'}</span>
          </div>
        </div>

        {/* Light */}
        <div className={`s-card light-card ${lightDark ? 'alert' : ''}`}>
          <div className="card-accent light-accent" />
          <div className="card-top">
            <span className="card-emoji">💡</span>
            <span className="card-lbl">Light Level</span>
            <span className="badge">LDR</span>
          </div>
          <div className="gauge-wrap">
            <GaugeRing value={lightLevel} max={1000} color1="#22d3ee" color2="#6366f1" />
            <div className="gauge-center">
              <span className="gauge-num">{lightLevel}</span>
              <span className="gauge-unit">lux</span>
            </div>
          </div>
          <div className={`card-pill ${lightDark ? 'pill-danger' : lightDim ? 'pill-warn' : 'pill-ok'}`}>
            {lightDark ? '🌙 DARK!' : lightDim ? '🌤️ Dim' : '☀️ Bright'}
          </div>
          <div className="card-action-row">
            <span className="action-label">Bulb</span>
            <span className={`action-dot ${bulbBlinking ? 'dot-blink' : ''}`} />
            <span className="action-txt">{bulbBlinking ? 'BLINKING' : 'OFF'}</span>
          </div>
        </div>

        {/* Motion */}
        <div className={`s-card motion-card ${motionDetected ? 'alert' : ''}`}>
          <div className="card-accent motion-accent" />
          <div className="card-top">
            <span className="card-emoji">🚶</span>
            <span className="card-lbl">Motion</span>
            <span className="badge">PIR HC-SR501</span>
          </div>
          <div className="motion-visual">
            <div className={`motion-rings ${motionDetected ? 'active' : ''}`}>
              <div className="m-ring r1" />
              <div className="m-ring r2" />
              <div className="m-ring r3" />
              <div className="m-center-dot" />
            </div>
            <span className={`motion-big ${motionDetected ? 'detected' : ''}`}>
              {motionDetected ? 'DETECTED!' : 'CLEAR'}
            </span>
          </div>
          <div className={`card-pill ${motionDetected ? 'pill-danger' : 'pill-ok'}`}>
            {motionDetected ? '🚨 Motion Alert!' : '✅ No Motion'}
          </div>
          <div className="card-action-row">
            <span className="action-label">Beeper</span>
            <span className={`action-dot ${beeperActive ? 'dot-danger' : ''}`} />
            <span className="action-txt">{beeperActive ? '🔊 BEEPING' : 'Silent'}</span>
          </div>
        </div>

        {/* Relay Status Mini */}
        <div className="s-card relay-card mini-card">
          <div className="card-accent relay-accent" />
          <div className="mini-top">
            <span className="card-emoji">⚡</span>
            <span className="card-lbl">Relay Module</span>
          </div>
          <div className={`relay-vis ${state.relayActive ? 'active' : ''}`}>
            <div className="relay-box">
              <div className="relay-coil-v" />
              <div className={`relay-led-v ${state.relayActive ? 'on' : ''}`} />
            </div>
          </div>
          <span className="mini-status">{state.relayActive ? '🔴 Energized' : '⚪ Idle'}</span>
        </div>

        {/* ESP32 Status Mini */}
        <div className="s-card esp-card mini-card">
          <div className="card-accent esp-accent" />
          <div className="mini-top">
            <span className="card-emoji">🔲</span>
            <span className="card-lbl">ESP32 MCU</span>
          </div>
          <div className="esp-vis">
            <div className="esp-board-mini">
              <span className="esp-chip-txt">ESP32</span>
              <div className="esp-led-mini pulse" />
            </div>
          </div>
          <span className="mini-status">🟢 Running</span>
        </div>

        {/* Buzzer Status Mini */}
        <div className="s-card buzz-card mini-card">
          <div className="card-accent buzz-accent" />
          <div className="mini-top">
            <span className="card-emoji">🔊</span>
            <span className="card-lbl">Buzzer</span>
          </div>
          <div className={`buzz-vis ${beeperActive ? 'active' : ''}`}>
            <div className="buzz-circle">
              <div className="buzz-inner" />
            </div>
            {beeperActive && <div className="buzz-waves"><span /><span /><span /></div>}
          </div>
          <span className="mini-status">{beeperActive ? '🔴 Active' : '⚪ Standby'}</span>
        </div>
      </div>
    </section>
  );
}
