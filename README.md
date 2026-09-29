# Smart Home Automation Monitor

An interactive dashboard that simulates an ESP32 smart home system with temperature, light and motion sensors, and shows how the home reacts in real time.

## Features

- Simulated DHT11 temperature, LDR light and PIR motion sensors, controlled with sliders, buttons and preset scenarios
- Automatic outputs: a light bulb, a blinking alert, a relay and a buzzer (played with the Web Audio API)
- Room visualisation, live sensor charts and an event log
- Circuit diagram and the matching Arduino code for the ESP32

> Sensor values are simulated in the browser; the dashboard is not connected to real hardware.

## Tech stack

React · Vite · CSS

## Run locally

```bash
npm install
npm run dev
```
