import { useState } from 'react';
import './CodeSection.css';

const ARDUINO_CODE = `#include <DHT.h>

// ===== Pin Definitions =====
#define DHT_PIN       4      // DHT11 Temperature Sensor
#define LDR_PIN       34     // LDR (Light Sensor) - Analog
#define PIR_PIN       27     // PIR Motion Sensor
#define RELAY_PIN     26     // Relay Module (controls Bulb)
#define BUZZER_PIN    25     // Piezo Buzzer/Beeper

// ===== Thresholds =====
#define TEMP_THRESHOLD    35   // °C - Bulb ON if above
#define LIGHT_THRESHOLD   200  // Lux - Blink if below (dark)
#define BLINK_INTERVAL    500  // ms - Blink rate

// ===== Sensor Setup =====
#define DHT_TYPE DHT11
DHT dht(DHT_PIN, DHT_TYPE);

// ===== Variables =====
unsigned long lastBlink = 0;
bool blinkState = false;
bool motionDetected = false;

void setup() {
    Serial.begin(115200);
    Serial.println("Smart Home Automation - ESP32");
    dht.begin();
    pinMode(LDR_PIN, INPUT);
    pinMode(PIR_PIN, INPUT);
    pinMode(RELAY_PIN, OUTPUT);
    pinMode(BUZZER_PIN, OUTPUT);
    digitalWrite(RELAY_PIN, LOW);
    digitalWrite(BUZZER_PIN, LOW);
    Serial.println("System Ready!");
}

void loop() {
    float temperature = dht.readTemperature();
    int lightLevel = analogRead(LDR_PIN);
    int lux = map(lightLevel, 0, 4095, 0, 1000);
    motionDetected = digitalRead(PIR_PIN);

    // Rule 1: Bulb GLOW when temp is HIGH
    if (temperature > TEMP_THRESHOLD) {
        digitalWrite(RELAY_PIN, HIGH);
        Serial.println("HIGH TEMP! Bulb ON");
    }
    // Rule 2: Bulb BLINK when room is DARK
    else if (lux < LIGHT_THRESHOLD) {
        if (millis() - lastBlink > BLINK_INTERVAL) {
            blinkState = !blinkState;
            digitalWrite(RELAY_PIN, blinkState);
            lastBlink = millis();
        }
    }
    // Normal: Bulb OFF
    else {
        digitalWrite(RELAY_PIN, LOW);
    }

    // Rule 3: Beeper BEEP on MOTION
    if (motionDetected) {
        tone(BUZZER_PIN, 2000, 200);
        delay(300);
        noTone(BUZZER_PIN);
    } else {
        noTone(BUZZER_PIN);
    }

    Serial.print("Temp: "); Serial.print(temperature);
    Serial.print("°C | Light: "); Serial.print(lux);
    Serial.print(" lux | Motion: ");
    Serial.println(motionDetected ? "YES" : "NO");
    delay(500);
}`;

export default function CodeSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ARDUINO_CODE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section className="code-section">
      <div className="sec-title">
        <span className="sec-icon">💻</span>
        <h2>ESP32 Arduino Code</h2>
        <div className="sec-line" />
      </div>
      <div className="code-box">
        <div className="code-bar">
          <span className="code-fname">smart_home.ino</span>
          <div className="code-bar-dots">
            <span className="dot-r" /><span className="dot-y" /><span className="dot-g" />
          </div>
          <button className="copy-btn" onClick={handleCopy}>
            {copied ? '✅ Copied!' : '📋 Copy Code'}
          </button>
        </div>
        <pre className="code-pre"><code>{ARDUINO_CODE}</code></pre>
      </div>
    </section>
  );
}
