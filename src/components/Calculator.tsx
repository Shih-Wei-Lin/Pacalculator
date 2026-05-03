import React, { useState, useEffect } from 'react';
import { calculateVDOT, calculateTrainingPaces, formatPace, predictTime, formatDuration } from '../utils/vdot';
import type { TrainingPaces } from '../utils/vdot';

const COMMON_DISTANCES = [
  { label: '5K', value: 5000 },
  { label: '10K', value: 10000 },
  { label: '21.0975K (Half)', value: 21097.5 },
  { label: '42.195K (Full)', value: 42195 },
];

const PREDICTION_DISTANCES = [
  { label: '1500m', value: 1500 },
  { label: '1 Mile', value: 1609.34 },
  { label: '3000m', value: 3000 },
  { label: '2 Miles', value: 3218.68 },
  { label: '5K', value: 5000 },
  { label: '10K', value: 10000 },
  { label: '15K', value: 15000 },
  { label: 'Half Marathon', value: 21097.5 },
  { label: 'Marathon', value: 42195 },
];

export const Calculator: React.FC = () => {
  const [distance, setDistance] = useState<number>(5000);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(20);
  const [seconds, setSeconds] = useState<number>(0);
  const [altitude, setAltitude] = useState<number>(0);
  const [temperature, setTemperature] = useState<number>(12.8);
  const [vdot, setVdot] = useState<number | null>(null);
  const [paces, setPaces] = useState<TrainingPaces | null>(null);

  useEffect(() => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (totalSeconds > 0 && distance > 0) {
      const calculatedVdot = calculateVDOT(distance, totalSeconds, altitude, temperature);
      setVdot(calculatedVdot);
      setPaces(calculateTrainingPaces(calculatedVdot));
    } else {
      setVdot(null);
      setPaces(null);
    }
  }, [distance, hours, minutes, seconds, altitude, temperature]);

  return (
    <div className="calculator-container">
      <div className="input-group">
        <label>Distance (m)</label>
        <div className="distance-selector">
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
          />
          <div className="preset-buttons">
            {COMMON_DISTANCES.map((d) => (
              <button
                key={d.label}
                onClick={() => setDistance(d.value)}
                className={distance === d.value ? 'active' : ''}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="input-group">
        <label>Time (HH:MM:SS)</label>
        <div className="time-inputs">
          <input
            type="number"
            placeholder="HH"
            value={hours || ''}
            onChange={(e) => setHours(Math.max(0, Number(e.target.value)))}
          />
          <span>:</span>
          <input
            type="number"
            placeholder="MM"
            value={minutes || ''}
            onChange={(e) => setMinutes(Math.max(0, Math.min(59, Number(e.target.value))))}
          />
          <span>:</span>
          <input
            type="number"
            placeholder="SS"
            value={seconds || ''}
            onChange={(e) => setSeconds(Math.max(0, Math.min(59, Number(e.target.value))))}
          />
        </div>
      </div>

      <div className="environment-inputs">
        <div className="input-group">
          <label>Altitude (m)</label>
          <input
            type="number"
            value={altitude}
            onChange={(e) => setAltitude(Number(e.target.value))}
          />
        </div>
        <div className="input-group">
          <label>Temp (°C)</label>
          <input
            type="number"
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
          />
        </div>
      </div>

      {vdot && (
        <div className="results">
          <div className="vdot-score">
            <h3>Sea Level VDOT</h3>
            <div className="vdot-value">{vdot.toFixed(2)}</div>
            <p className="vdot-note">基於環境修正後的跑力值</p>
          </div>

          {paces && (
            <>
              <h3>Training Paces</h3>
              <div className="paces-grid">
                <div className="pace-card">
                  <span className="pace-label">E (Easy)</span>
                  <span className="pace-value">
                    {formatPace(paces.easy.min)} - {formatPace(paces.easy.max)} / km
                  </span>
                </div>
                <div className="pace-card">
                  <span className="pace-label">M (Marathon)</span>
                  <span className="pace-value">
                    {formatPace(paces.marathon.min)} - {formatPace(paces.marathon.max)} / km
                  </span>
                </div>
                <div className="pace-card">
                  <span className="pace-label">T (Threshold)</span>
                  <span className="pace-value">
                    {formatPace(paces.threshold.min)} - {formatPace(paces.threshold.max)} / km
                  </span>
                </div>
                <div className="pace-card">
                  <span className="pace-label">I (Interval)</span>
                  <span className="pace-value">
                    {formatPace(paces.interval.min)} - {formatPace(paces.interval.max)} / km
                  </span>
                </div>
                <div className="pace-card">
                  <span className="pace-label">R (Repetition)</span>
                  <span className="pace-value">
                    {formatPace(paces.repetition.min)} - {formatPace(paces.repetition.max)} / km
                  </span>
                </div>
              </div>

              <div className="predictions-section">
                <h3>Race Predictions</h3>
                <div className="predictions-grid">
                  {PREDICTION_DISTANCES.map((pd) => (
                    <div className="prediction-card" key={pd.label}>
                      <span className="prediction-label">{pd.label}</span>
                      <span className="prediction-value">
                        {formatDuration(predictTime(vdot, pd.value))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
