import { SensorProvider } from './context/SensorContext';
import ParticlesBg from './components/ParticlesBg';
import Header from './components/Header';
import SensorCards from './components/SensorCards';
import Controls from './components/Controls';
import RoomViz from './components/RoomViz';
import Charts from './components/Charts';
import EventLog from './components/EventLog';
import CircuitDiagram from './components/CircuitDiagram';
import CodeSection from './components/CodeSection';
import './App.css';

function Dashboard() {
  return (
    <>
      <ParticlesBg />
      <Header />
      <main className="dashboard-main">
        <SensorCards />

        <div className="sim-layout">
          <Controls />
          <RoomViz />
        </div>

        <Charts />
        <EventLog />
        <CircuitDiagram />
        <CodeSection />
      </main>
      <footer className="dash-footer">
        <p>ESP32 Smart Home Automation — IoT Real-Time Dashboard</p>
        <p className="foot-sub">Built with React + Vite &nbsp;❤️&nbsp; for IoT Education</p>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <SensorProvider>
      <Dashboard />
    </SensorProvider>
  );
}
