import React from 'react';
import type { TrainingPaces } from '../utils/vdot';
import { formatPace } from '../utils/vdot';

interface TrainingPlansProps {
  paces: TrainingPaces;
}

export const TrainingPlans: React.FC<TrainingPlansProps> = ({ paces }) => {
  const ePace = `${formatPace(paces.easy.min)} - ${formatPace(paces.easy.max)}`;
  const tPace = `${formatPace(paces.threshold.min)} - ${formatPace(paces.threshold.max)}`;
  const mPace = `${formatPace(paces.marathon.min)} - ${formatPace(paces.marathon.max)}`;
  const rPace = `${formatPace(paces.repetition.min)} - ${formatPace(paces.repetition.max)}`;

  return (
    <div className="training-plans-container">
      <div className="plan-section">
        <h4>1. 週期化訓練原則 (Table 10.1)</h4>
        <div className="periodization-grid">
          <div className="period-card">
            <span className="period-tag">第 I 週期</span>
            <strong>基礎期</strong>
            <p>建立基礎、預防受傷</p>
          </div>
          <div className="period-card highlight">
            <span className="period-tag">第 II 週期</span>
            <strong>質量起步期</strong>
            <p>為嚴峻訓練做準備</p>
          </div>
          <div className="period-card">
            <span className="period-tag">第 III 週期</span>
            <strong>轉換期</strong>
            <p>提升最大攝氧量 (最辛苦)</p>
          </div>
          <div className="period-card">
            <span className="period-tag">第 IV 週期</span>
            <strong>訓練驗收期</strong>
            <p>適應比賽配速、達巔峰</p>
          </div>
        </div>
      </div>

      <div className="plan-section">
        <h4>2. T 配速課表 (Threshold)</h4>
        <p className="section-note">您的 T 配速建議：<strong>{tPace} / km</strong></p>
        <div className="workout-list">
          <div className="workout-item">
            <strong>A1 (入門節奏跑)</strong>
            <span>20 分鐘 T 配速連續跑</span>
          </div>
          <div className="workout-item">
            <strong>B1 (巡航間歇)</strong>
            <span>5~6 趟 × (6 分鐘 T 配速 ＋ 1 分鐘休息)</span>
          </div>
          <div className="workout-item">
            <strong>B2 (混合巡航)</strong>
            <span>2 趟 × 12 分 T + 2 趟 × 5 分 T</span>
          </div>
        </div>
      </div>

      <div className="plan-section">
        <h4>3. 白色計畫 (傷後復出/入門)</h4>
        <p className="section-note">您的 E 配速建議：<strong>{ePace} / km</strong></p>
        <div className="workout-list">
          <div className="workout-item">
            <strong>第 1, 7 天</strong>
            <span>5分走 + 10趟 × (1分 E + 1分走) + 5分走</span>
          </div>
          <div className="workout-item">
            <strong>第 3, 4 天</strong>
            <span>5分走 + 7趟 × (2分 E + 1分走) + 4分走</span>
          </div>
        </div>
      </div>

      <div className="plan-section">
        <h4>4. 半馬 2 週循環 (2Q 邏輯)</h4>
        <div className="biweekly-grid">
          <div className="week-col">
            <h5>奇數週</h5>
            <div className="day-box">Q1: 長跑 (L/E) - <strong>{ePace}</strong></div>
            <div className="day-box">Q2: T 課表 - <strong>{tPace}</strong></div>
            <div className="day-box">Q3: R 間歇 - <strong>{rPace}</strong></div>
          </div>
          <div className="week-col">
            <h5>偶數週</h5>
            <div className="day-box">Q1: M 跑 (馬拉松速) - <strong>{mPace}</strong></div>
            <div className="day-box">Q2: T 課表 - <strong>{tPace}</strong></div>
            <div className="day-box">休息或輕鬆跑累積跑量</div>
          </div>
        </div>
      </div>
    </div>
  );
};
