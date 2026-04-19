import { useSensors } from '../context/SensorContext';
import { useState, useEffect } from 'react';
import './RoomViz.css';

export default function RoomViz() {
  const { state, TEMP_THRESHOLD, LIGHT_THRESHOLD } = useSensors();
  const { temperature, lightLevel, motionDetected, bulbOn, bulbBlinking, beeperActive, relayActive } = state;
  const [blinkVisible, setBlinkVisible] = useState(true);

  useEffect(() => {
    if (!bulbBlinking) { setBlinkVisible(false); return; }
    const id = setInterval(() => setBlinkVisible(v => !v), 500);
    return () => clearInterval(id);
  }, [bulbBlinking]);

  const bulbIsLit = bulbOn || (bulbBlinking && blinkVisible);
  const darkness = lightLevel < LIGHT_THRESHOLD ? Math.max(0, (LIGHT_THRESHOLD - lightLevel) / LIGHT_THRESHOLD * 0.65) : 0;
  const heat = temperature >= TEMP_THRESHOLD ? Math.min(0.12, (temperature - TEMP_THRESHOLD) / 25 * 0.12) : 0;

  return (
    <section className="room-section">
      <div className="sec-title">
        <span className="sec-icon">🏠</span>
        <h2>Room Visualization</h2>
        <div className="sec-line" />
      </div>
      <div className="room-outer">
        {/* Room */}
        <div className="room-box">
          <div className="room-tag">LIVING ROOM</div>

          {/* Ceiling */}
          <div className="rm-ceiling">
            <div className="fixture">
              <div className="fix-plate" />
              <div className="fix-rod" />
              <div className={`fix-bulb ${bulbIsLit ? 'lit' : ''}`}>
                <div className="bulb-glass" />
                <div className="bulb-cap" />
              </div>
              {bulbIsLit && <div className="bulb-glow-ring" />}
              {bulbIsLit && <div className="light-cone-v" />}
            </div>
          </div>

          {/* Room body */}
          <div className="rm-body">
            {/* Components row */}
            <div className="comp-row">
              <div className="rm-comp">
                <div className="rm-esp">
                  <div className="esp-pcb">
                    <span className="esp-txt">ESP32</span>
                    <div className="esp-led-r on" />
                  </div>
                </div>
                <span className="comp-label">ESP32 DevKit</span>
              </div>

              <div className="rm-comp">
                <div className={`rm-relay ${relayActive ? 'active' : ''}`}>
                  <div className="rel-coil" />
                  <div className={`rel-led ${relayActive ? 'on' : ''}`} />
                  <span className="rel-txt">RELAY</span>
                </div>
                <span className="comp-label">Relay Module</span>
              </div>

              <div className="rm-comp">
                <div className={`rm-beeper ${beeperActive ? 'active' : ''}`}>
                  <div className="beep-hole" />
                  {beeperActive && (
                    <div className="beep-waves-v">
                      <span /><span /><span />
                    </div>
                  )}
                </div>
                <span className="comp-label">Buzzer</span>
              </div>
            </div>

            {/* Sensors row */}
            <div className="sensor-row">
              <div className={`rm-sensor ${temperature >= TEMP_THRESHOLD ? 'glow-amber' : ''}`}>
                <span className="sens-ico">🌡️</span>
                <span className="sens-lbl">DHT11</span>
                <span className="sens-val">{temperature}°C</span>
              </div>
              <div className={`rm-sensor ${lightLevel < LIGHT_THRESHOLD ? 'glow-cyan' : ''}`}>
                <span className="sens-ico">☀️</span>
                <span className="sens-lbl">LDR</span>
                <span className="sens-val">{lightLevel} lux</span>
              </div>
              <div className={`rm-sensor ${motionDetected ? 'glow-red' : ''}`}>
                <span className="sens-ico">📡</span>
                <span className="sens-lbl">PIR</span>
                <span className="sens-val">{motionDetected ? 'YES' : 'NO'}</span>
              </div>
            </div>

            {/* Socket */}
            <div className="rm-socket-row">
              <div className="rm-socket">
                <div className="sock-holes"><div /><div /></div>
              </div>
              <span className="comp-label">Socket (230V AC)</span>
            </div>

            {/* Wires SVG overlay */}
            <svg className="wire-overlay" viewBox="0 0 600 260" preserveAspectRatio="none">
              <defs>
                <linearGradient id="wg1"><stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4"/><stop offset="100%" stopColor="#6366f1" stopOpacity="0.4"/></linearGradient>
                <linearGradient id="wg2"><stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35"/><stop offset="100%" stopColor="#ef4444" stopOpacity="0.35"/></linearGradient>
                <linearGradient id="wg3"><stop offset="0%" stopColor="#22c55e" stopOpacity="0.35"/><stop offset="100%" stopColor="#14b8a6" stopOpacity="0.35"/></linearGradient>
              </defs>
              {/* ESP to Relay */}
              <path d="M 140 55 C 220 55, 280 55, 340 55" stroke="url(#wg1)" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
              {/* ESP to Beeper */}
              <path d="M 140 65 C 260 80, 400 65, 480 55" stroke="url(#wg2)" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
              {/* Sensors to ESP */}
              <path d="M 120 155 C 120 120, 100 80, 100 65" stroke="url(#wg3)" strokeWidth="1" fill="none" strokeDasharray="3 2" />
              <path d="M 300 155 C 250 120, 130 90, 120 65" stroke="url(#wg3)" strokeWidth="1" fill="none" strokeDasharray="3 2" />
              <path d="M 480 155 C 400 120, 180 80, 130 65" stroke="url(#wg3)" strokeWidth="1" fill="none" strokeDasharray="3 2" />
              {/* Relay to Bulb */}
              <path d="M 340 40 C 340 10, 300 -20, 300 -40" stroke="url(#wg1)" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
            </svg>
          </div>

          {/* Overlays */}
          <div className="dark-overlay" style={{ background: `rgba(0,0,20,${darkness})` }} />
          <div className="heat-overlay" style={{ background: `rgba(255,50,0,${heat})` }} />
        </div>

        {/* Legend */}
        <div className="room-legend">
          <div className="legend-item">
            <span className={`legend-dot ${bulbIsLit ? 'bg-amber' : ''}`} />
            <span>Bulb: {bulbOn ? 'ON (Temp)' : bulbBlinking ? 'Blinking (Dark)' : 'OFF'}</span>
          </div>
          <div className="legend-item">
            <span className={`legend-dot ${relayActive ? 'bg-blue' : ''}`} />
            <span>Relay: {relayActive ? 'Energized' : 'Idle'}</span>
          </div>
          <div className="legend-item">
            <span className={`legend-dot ${beeperActive ? 'bg-red' : ''}`} />
            <span>Beeper: {beeperActive ? 'BEEPING' : 'Silent'}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
