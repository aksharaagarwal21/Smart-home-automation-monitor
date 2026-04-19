import { useSensors } from '../context/SensorContext';
import './Header.css';
import { useState, useEffect } from 'react';

export default function Header() {
  const { state } = useSensors();
  const [clock, setClock] = useState('');

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const formatUptime = (s) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  return (
    <header className="hdr">
      <div className="hdr-inner">
        <div className="hdr-left">
          <div className="hdr-chip">
            <div className="chip-pins-l" />
            <span className="chip-text">ESP32</span>
            <div className="chip-pins-r" />
          </div>
          <div className="hdr-titles">
            <h1 className="hdr-h1">Smart Home Automation</h1>
            <p className="hdr-sub">IoT Real-Time Dashboard</p>
          </div>
        </div>
        <div className="hdr-right">
          <div className="hdr-pill online">
            <span className="pill-dot" />
            <span>ESP32 Online</span>
          </div>
          <div className="hdr-uptime">
            <span className="uptime-label">Uptime</span>
            <span className="uptime-value">{formatUptime(state.uptime)}</span>
          </div>
          <div className="hdr-clock">{clock}</div>
        </div>
      </div>
    </header>
  );
}
