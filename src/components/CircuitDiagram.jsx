import { useRef, useEffect } from 'react';
import './CircuitDiagram.css';

export default function CircuitDiagram() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;

    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#64748b';
    ctx.font = '600 13px Orbitron';
    ctx.textAlign = 'center';
    ctx.fillText('ESP32 Smart Home — Circuit Schematic', w / 2, 28);

    const drawBox = (x, y, bw, bh, bg, border, label, tc) => {
      ctx.fillStyle = bg; ctx.strokeStyle = border; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(x, y, bw, bh, 6); ctx.fill(); ctx.stroke();
      ctx.fillStyle = tc; ctx.font = '600 10px Orbitron'; ctx.textAlign = 'center';
      ctx.fillText(label, x + bw / 2, y + bh / 2 + 4);
    };

    const drawWire = (x1, y1, x2, y2, color) => {
      ctx.strokeStyle = color; ctx.lineWidth = 1.8; ctx.beginPath();
      ctx.moveTo(x1, y1);
      const mx = (x1 + x2) / 2;
      ctx.bezierCurveTo(mx, y1, mx, y2, x2, y2);
      ctx.stroke();
      [{ x: x1, y: y1 }, { x: x2, y: y2 }].forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = color; ctx.fill();
      });
    };

    // ESP32
    const ex = w / 2 - 50, ey = h / 2 - 55;
    drawBox(ex, ey, 100, 110, '#1a5e1a', '#2d8e2d', 'ESP32', '#aaffaa');

    // Pin labels
    ctx.font = '8px JetBrains Mono'; ctx.fillStyle = '#aaffaa';
    ctx.textAlign = 'right';
    ctx.fillText('GPIO4', ex - 5, ey + 22);
    ctx.fillText('GPIO34', ex - 5, ey + 42);
    ctx.fillText('GPIO27', ex - 5, ey + 62);
    ctx.textAlign = 'left';
    ctx.fillText('GPIO26', ex + 105, ey + 32);
    ctx.fillText('GPIO25', ex + 105, ey + 52);
    ctx.fillText('3.3V', ex + 105, ey + 78);
    ctx.fillText('GND', ex + 105, ey + 95);

    // DHT11
    drawBox(50, 65, 75, 45, '#1565C0', '#42A5F5', 'DHT11', '#BBDEFB');
    ctx.font = '7px Inter'; ctx.fillStyle = '#90CAF9'; ctx.textAlign = 'center';
    ctx.fillText('Temp Sensor', 87, 122);
    drawWire(125, 87, ex, ey + 22, '#42A5F5');

    // LDR
    drawBox(50, 185, 75, 45, '#004D40', '#26A69A', 'LDR', '#B2DFDB');
    ctx.fillStyle = '#80CBC4'; ctx.fillText('Light Sensor', 87, 242);
    drawWire(125, 207, ex, ey + 42, '#26A69A');

    // PIR
    drawBox(50, 305, 75, 45, '#4A148C', '#AB47BC', 'PIR', '#E1BEE7');
    ctx.fillStyle = '#CE93D8'; ctx.fillText('Motion Sensor', 87, 362);
    drawWire(125, 327, ex, ey + 62, '#AB47BC');

    // Relay
    drawBox(600, 90, 85, 50, '#1A237E', '#5C6BC0', 'RELAY', '#C5CAE9');
    ctx.font = '7px Inter'; ctx.fillStyle = '#9FA8DA'; ctx.textAlign = 'center';
    ctx.fillText('5V Relay Module', 642, 152);
    drawWire(ex + 100, ey + 32, 600, 115, '#5C6BC0');

    // Bulb
    ctx.beginPath(); ctx.arc(642, 230, 22, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,220,80,0.12)'; ctx.fill();
    ctx.strokeStyle = '#FDD835'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#FDD835'; ctx.font = '18px serif'; ctx.fillText('💡', 642, 236);
    ctx.font = '8px Inter'; ctx.fillText('AC Bulb + Holder', 642, 265);
    drawWire(642, 140, 642, 208, '#FDD835');

    // Buzzer
    ctx.beginPath(); ctx.arc(642, 350, 18, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(239,68,68,0.1)'; ctx.fill();
    ctx.strokeStyle = '#EF5350'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#EF5350'; ctx.font = '14px serif'; ctx.fillText('🔊', 642, 355);
    ctx.font = '8px Inter'; ctx.fillText('Buzzer', 642, 378);
    drawWire(ex + 100, ey + 52, 624, 350, '#EF5350');

    // Socket
    ctx.fillStyle = '#757575'; ctx.fillRect(630, 160, 26, 26);
    ctx.strokeStyle = '#BDBDBD'; ctx.lineWidth = 1; ctx.strokeRect(630, 160, 26, 26);
    ctx.fillStyle = '#333'; ctx.fillRect(636, 165, 4, 7); ctx.fillRect(646, 165, 4, 7);
    ctx.fillStyle = '#BDBDBD'; ctx.font = '7px Inter'; ctx.textAlign = 'center';
    ctx.fillText('Socket 230V', 643, 198);

    ctx.strokeStyle = '#ff5722'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(643, 186); ctx.lineTo(642, 208); ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.font = '8px Inter';
    ctx.fillText('── Jumper Wires ──', w / 2, h - 12);
  }, []);

  const components = [
    { icon: '🔲', name: 'ESP32 DevKit V1', desc: 'Wi-Fi + BLE Microcontroller' },
    { icon: '🌡️', name: 'DHT11 Sensor', desc: 'Temperature & Humidity' },
    { icon: '☀️', name: 'LDR Module', desc: 'Light Dependent Resistor' },
    { icon: '📡', name: 'PIR HC-SR501', desc: 'Passive Infrared Motion' },
    { icon: '⚡', name: '5V Relay Module', desc: 'Controls AC Bulb Circuit' },
    { icon: '💡', name: 'AC Bulb + Holder', desc: '230V Light Bulb E27' },
    { icon: '🔊', name: 'Piezo Buzzer', desc: 'Audible Alert for Motion' },
    { icon: '🔌', name: 'Socket + Wires', desc: 'Power & Jumper Wires' },
  ];

  return (
    <section className="circuit-section">
      <div className="sec-title">
        <span className="sec-icon">🔌</span>
        <h2>Circuit Diagram & Components</h2>
        <div className="sec-line" />
      </div>
      <div className="circuit-layout">
        <div className="circuit-canvas-wrap">
          <canvas ref={canvasRef} width={800} height={420} className="circuit-cv" />
        </div>
        <div className="comp-list">
          <h3>Components Used</h3>
          {components.map((c, i) => (
            <div key={i} className="comp-item">
              <span className="ci-icon">{c.icon}</span>
              <div className="ci-info">
                <span className="ci-name">{c.name}</span>
                <span className="ci-desc">{c.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
