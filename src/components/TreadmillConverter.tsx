import React, { useState } from 'react';
import { kmhToPace, paceToKmh } from '../utils/vdot';

export const TreadmillConverter: React.FC = () => {
  const [kmh, setKmh] = useState<number | string>(12);
  const [paceMin, setPaceMin] = useState<number | string>(5);
  const [paceSec, setPaceSec] = useState<number | string>(0);

  const handleKmhChange = (valStr: string) => {
    setKmh(valStr);
    const val = Number(valStr);
    if (val > 0) {
      const paceSeconds = Math.round(kmhToPace(val));
      setPaceMin(Math.floor(paceSeconds / 60));
      setPaceSec(paceSeconds % 60);
    }
  };

  const handlePaceChange = (minStr: string, secStr: string) => {
    setPaceMin(minStr);
    setPaceSec(secStr);
    const totalSeconds = Number(minStr) * 60 + Number(secStr);
    if (totalSeconds > 0) {
      setKmh(Number(paceToKmh(totalSeconds).toFixed(2)));
    }
  };

  return (
    <div className="treadmill-converter">
      <h3>跑步機換算 (時速 ↔ 配速)</h3>
      <div className="converter-grid">
        <div className="input-group">
          <label>跑步機時速 (km/h)</label>
          <input
            type="number"
            step="0.1"
            value={kmh}
            onChange={(e) => handleKmhChange(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>對應配速 (/km)</label>
          <div className="time-inputs">
            <input
              type="number"
              placeholder="分"
              value={paceMin}
              onChange={(e) => handlePaceChange(e.target.value, String(paceSec))}
            />
            <input
              type="number"
              placeholder="秒"
              value={paceSec}
              onChange={(e) => handlePaceChange(String(paceMin), e.target.value)}
            />
          </div>
        </div>
      </div>
      <p className="section-note">
        💡 丹尼爾斯教練建議：在跑步機上使用 <strong>1.0% 坡度</strong> 可以更準確地模擬室外平地跑步時的空氣阻力。
      </p>
    </div>
  );
};
