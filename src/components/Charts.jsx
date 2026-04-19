import { useSensors } from '../context/SensorContext';
import { useRef, useEffect, useCallback } from 'react';
import './Charts.css';

export default function Charts() {
  const { state, TEMP_THRESHOLD, LIGHT_THRESHOLD } = useSensors();
  const tempRef = useRef(null);
  const lightRef = useRef(null);
  const motionRef = useRef(null);

  const drawLine = useCallback((canvas, data, color1, color2, min, max, unit, threshold) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width, h = rect.height;
    const pad = { t: 18, r: 8, b: 22, l: 42 };
    const cw = w - pad.l - pad.r, ch = h - pad.t - pad.b;

    ctx.clearRect(0, 0, w, h);

    // grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.t + (ch / 4) * i;
      ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.font = '9px JetBrains Mono'; ctx.textAlign = 'right';
      ctx.fillText(Math.round(max - (max - min) / 4 * i) + unit, pad.l - 4, y + 3);
    }

    // threshold
    if (threshold != null) {
      const ty = pad.t + ch - ((threshold - min) / (max - min)) * ch;
      ctx.strokeStyle = 'rgba(239,68,68,0.3)';
      ctx.setLineDash([4, 3]); ctx.beginPath();
      ctx.moveTo(pad.l, ty); ctx.lineTo(w - pad.r, ty); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(239,68,68,0.5)'; ctx.font = '8px JetBrains Mono';
      ctx.textAlign = 'right'; ctx.fillText('Threshold', w - pad.r, ty - 4);
    }

    const vals = data.map(d => d.v);
    if (vals.length < 2) return;
    const maxPts = 80;

    // area
    ctx.beginPath();
    ctx.moveTo(pad.l, pad.t + ch);
    vals.forEach((v, i) => {
      const x = pad.l + (i / (maxPts - 1)) * cw;
      const y = pad.t + ch - ((v - min) / (max - min)) * ch;
      ctx.lineTo(x, y);
    });
    ctx.lineTo(pad.l + ((vals.length - 1) / (maxPts - 1)) * cw, pad.t + ch);
    ctx.closePath();
    const aGrad = ctx.createLinearGradient(0, pad.t, 0, pad.t + ch);
    aGrad.addColorStop(0, color1 + '25'); aGrad.addColorStop(1, color1 + '03');
    ctx.fillStyle = aGrad; ctx.fill();

    // line
    ctx.beginPath();
    vals.forEach((v, i) => {
      const x = pad.l + (i / (maxPts - 1)) * cw;
      const y = pad.t + ch - ((v - min) / (max - min)) * ch;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    const lGrad = ctx.createLinearGradient(0, 0, w, 0);
    lGrad.addColorStop(0, color2); lGrad.addColorStop(1, color1);
    ctx.strokeStyle = lGrad; ctx.lineWidth = 2; ctx.stroke();

    // dot
    const li = vals.length - 1;
    const lx = pad.l + (li / (maxPts - 1)) * cw;
    const ly = pad.t + ch - ((vals[li] - min) / (max - min)) * ch;
    ctx.beginPath(); ctx.arc(lx, ly, 4, 0, Math.PI * 2);
    ctx.fillStyle = color1; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
  }, []);

  const drawMotion = useCallback((canvas, data) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width, h = rect.height;
    const pad = { t: 18, r: 8, b: 22, l: 42 };
    const cw = w - pad.l - pad.r, ch = h - pad.t - pad.b;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = '9px JetBrains Mono'; ctx.textAlign = 'right';
    ctx.fillText('Motion', pad.l - 4, pad.t + 10);
    ctx.fillText('Clear', pad.l - 4, pad.t + ch);

    const vals = data.map(d => d.v);
    const maxPts = 80;
    const bw = Math.max(2, cw / maxPts - 1);

    vals.forEach((v, i) => {
      const x = pad.l + (i / (maxPts - 1)) * cw - bw / 2;
      if (v) {
        const bh = ch * 0.65;
        ctx.fillStyle = 'rgba(239,68,68,0.6)';
        ctx.fillRect(x, pad.t + (ch - bh) / 2, bw, bh);
      } else {
        ctx.fillStyle = 'rgba(34,197,94,0.1)';
        ctx.fillRect(x, pad.t + ch * 0.4, bw, ch * 0.2);
      }
    });
  }, []);

  useEffect(() => {
    drawLine(tempRef.current, state.tempHistory, '#f97316', '#f59e0b', 0, 50, '°C', TEMP_THRESHOLD);
    drawLine(lightRef.current, state.lightHistory, '#22d3ee', '#14b8a6', 0, 1000, 'lux', LIGHT_THRESHOLD);
    drawMotion(motionRef.current, state.motionHistory);
  }, [state.tempHistory, state.lightHistory, state.motionHistory, drawLine, drawMotion, TEMP_THRESHOLD, LIGHT_THRESHOLD]);

  return (
    <section className="charts-section">
      <div className="sec-title">
        <span className="sec-icon">📈</span>
        <h2>Real-Time Sensor Data</h2>
        <div className="sec-line" />
      </div>
      <div className="charts-wrap">
        <div className="chart-box">
          <div className="chart-hdr">
            <span className="ch-title">🌡️ Temperature History</span>
            <span className="ch-live">● LIVE</span>
          </div>
          <canvas ref={tempRef} className="chart-canvas" />
        </div>
        <div className="chart-box">
          <div className="chart-hdr">
            <span className="ch-title">💡 Light Level History</span>
            <span className="ch-live">● LIVE</span>
          </div>
          <canvas ref={lightRef} className="chart-canvas" />
        </div>
        <div className="chart-box">
          <div className="chart-hdr">
            <span className="ch-title">🚶 Motion Events</span>
            <span className="ch-live">● LIVE</span>
          </div>
          <canvas ref={motionRef} className="chart-canvas" />
        </div>
      </div>
    </section>
  );
}
