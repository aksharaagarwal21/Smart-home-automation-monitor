import { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';

const TEMP_THRESHOLD = 35;
const LIGHT_THRESHOLD = 200;
const MOTION_DURATION = 5000;
const MAX_HISTORY = 80;

const initialState = {
  temperature: 25,
  lightLevel: 650,
  motionDetected: false,
  motionSecondsLeft: 0,
  bulbOn: false,
  bulbBlinking: false,
  beeperActive: false,
  relayActive: false,
  tempHistory: [],
  lightHistory: [],
  motionHistory: [],
  logs: [
    { id: Date.now(), type: 'system', icon: '⚙️', msg: 'ESP32 Smart Home System booted', time: new Date().toLocaleTimeString('en-US', { hour12: false }) },
    { id: Date.now() + 1, type: 'system', icon: '📡', msg: 'Sensors calibrated — DHT11, LDR, PIR ready', time: new Date().toLocaleTimeString('en-US', { hour12: false }) },
    { id: Date.now() + 2, type: 'system', icon: '✅', msg: 'Relay module & buzzer connected', time: new Date().toLocaleTimeString('en-US', { hour12: false }) },
  ],
  uptime: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_TEMP':
      return { ...state, temperature: action.value };
    case 'SET_LIGHT':
      return { ...state, lightLevel: action.value };
    case 'SET_MOTION':
      return { ...state, motionDetected: action.value, motionSecondsLeft: action.value ? MOTION_DURATION / 1000 : 0 };
    case 'MOTION_TICK':
      return { ...state, motionSecondsLeft: Math.max(0, state.motionSecondsLeft - 1) };
    case 'UPDATE_OUTPUTS': {
      const { bulbOn, bulbBlinking, beeperActive, relayActive } = action;
      return { ...state, bulbOn, bulbBlinking, beeperActive, relayActive };
    }
    case 'PUSH_HISTORY': {
      const now = Date.now();
      const t = [...state.tempHistory, { t: now, v: state.temperature }].slice(-MAX_HISTORY);
      const l = [...state.lightHistory, { t: now, v: state.lightLevel }].slice(-MAX_HISTORY);
      const m = [...state.motionHistory, { t: now, v: state.motionDetected ? 1 : 0 }].slice(-MAX_HISTORY);
      return { ...state, tempHistory: t, lightHistory: l, motionHistory: m };
    }
    case 'ADD_LOG': {
      const time = new Date().toLocaleTimeString('en-US', { hour12: false });
      const entry = { id: Date.now() + Math.random(), type: action.logType, icon: action.icon, msg: action.msg, time };
      const logs = [entry, ...state.logs].slice(0, 150);
      return { ...state, logs };
    }
    case 'CLEAR_LOGS':
      return { ...state, logs: [] };
    case 'APPLY_SCENARIO':
      return { ...state, ...action.values };
    case 'TICK_UPTIME':
      return { ...state, uptime: state.uptime + 1 };
    default:
      return state;
  }
}

const SensorContext = createContext(null);

export function SensorProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const motionTimerRef = useRef(null);
  const motionCountdownRef = useRef(null);
  const prevOutputs = useRef({ bulbOn: false, blinking: false, beeper: false });

  const setTemp = useCallback((v) => dispatch({ type: 'SET_TEMP', value: v }), []);
  const setLight = useCallback((v) => dispatch({ type: 'SET_LIGHT', value: v }), []);

  const triggerMotion = useCallback(() => {
    if (motionTimerRef.current) clearTimeout(motionTimerRef.current);
    if (motionCountdownRef.current) clearInterval(motionCountdownRef.current);
    dispatch({ type: 'SET_MOTION', value: true });
    motionCountdownRef.current = setInterval(() => dispatch({ type: 'MOTION_TICK' }), 1000);
    motionTimerRef.current = setTimeout(() => {
      dispatch({ type: 'SET_MOTION', value: false });
      clearInterval(motionCountdownRef.current);
    }, MOTION_DURATION);
  }, []);

  const clearMotion = useCallback(() => {
    if (motionTimerRef.current) clearTimeout(motionTimerRef.current);
    if (motionCountdownRef.current) clearInterval(motionCountdownRef.current);
    dispatch({ type: 'SET_MOTION', value: false });
  }, []);

  const addLog = useCallback((logType, icon, msg) => dispatch({ type: 'ADD_LOG', logType, icon, msg }), []);
  const clearLogs = useCallback(() => dispatch({ type: 'CLEAR_LOGS' }), []);

  const applyScenario = useCallback((name) => {
    const scenarios = {
      normal: { temperature: 25, lightLevel: 650 },
      hot: { temperature: 42, lightLevel: 500 },
      dark: { temperature: 22, lightLevel: 50 },
      intruder: { temperature: 25, lightLevel: 80 },
      allalert: { temperature: 45, lightLevel: 30 },
    };
    const vals = scenarios[name];
    if (!vals) return;
    dispatch({ type: 'APPLY_SCENARIO', values: vals });
    if (name === 'intruder' || name === 'allalert') triggerMotion();
    if (name === 'normal') clearMotion();
    const labels = { normal: '🏠 Normal conditions', hot: '🔥 Hot Room (42°C)', dark: '🌙 Dark Room (50 lux)', intruder: '🚨 Intruder Alert', allalert: '⚡ All Alerts Active' };
    addLog('system', '🎬', `Scenario: ${labels[name]}`);
  }, [triggerMotion, clearMotion, addLog]);

  // Automation engine
  useEffect(() => {
    const { temperature, lightLevel, motionDetected } = state;
    let bulbOn = false, bulbBlinking = false, beeperActive = false, relayActive = false;

    if (temperature >= TEMP_THRESHOLD) {
      bulbOn = true; relayActive = true;
      if (!prevOutputs.current.bulbOn || prevOutputs.current.blinking) {
        addLog('temp', '🔥', `HIGH TEMP ${temperature}°C → Bulb ON (steady glow)`);
      }
    } else if (lightLevel < LIGHT_THRESHOLD) {
      bulbBlinking = true; relayActive = true;
      if (!prevOutputs.current.blinking) {
        addLog('light', '🌙', `DARK (${lightLevel} lux) → Bulb blinking`);
      }
    } else {
      if (prevOutputs.current.bulbOn || prevOutputs.current.blinking) {
        addLog('system', '💡', 'Normal conditions → Bulb OFF');
      }
    }

    if (motionDetected) {
      beeperActive = true;
      if (!prevOutputs.current.beeper) {
        addLog('motion', '🚨', 'MOTION DETECTED → Beeper activated');
      }
    } else {
      if (prevOutputs.current.beeper) {
        addLog('motion', '✅', 'Motion cleared → Beeper off');
      }
    }

    prevOutputs.current = { bulbOn: bulbOn || bulbBlinking, blinking: bulbBlinking, beeper: beeperActive };
    dispatch({ type: 'UPDATE_OUTPUTS', bulbOn, bulbBlinking, beeperActive, relayActive });
  }, [state.temperature, state.lightLevel, state.motionDetected, addLog]);

  // History push loop
  useEffect(() => {
    const id = setInterval(() => dispatch({ type: 'PUSH_HISTORY' }), 1000);
    return () => clearInterval(id);
  }, []);

  // Uptime counter
  useEffect(() => {
    const id = setInterval(() => dispatch({ type: 'TICK_UPTIME' }), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <SensorContext.Provider value={{
      state, setTemp, setLight, triggerMotion, clearMotion,
      addLog, clearLogs, applyScenario,
      TEMP_THRESHOLD, LIGHT_THRESHOLD,
    }}>
      {children}
    </SensorContext.Provider>
  );
}

export function useSensors() {
  const ctx = useContext(SensorContext);
  if (!ctx) throw new Error('useSensors must be inside SensorProvider');
  return ctx;
}
