import React from 'react';

export interface WorkoutSegment {
  label: string;
  duration: number; // in minutes
  intensity: number; // 0 to 1, where 1 is R pace, 0.8 is T pace, etc.
  color: string;
}

interface WorkoutChartProps {
  segments: WorkoutSegment[];
  totalMinutes: number;
}

export const WorkoutChart: React.FC<WorkoutChartProps> = ({ segments, totalMinutes }) => {
  const chartHeight = 60;
  
  return (
    <div className="workout-chart-wrapper">
      <div className="chart-container" style={{ height: `${chartHeight}px` }}>
        {segments.map((seg, idx) => (
          <div
            key={idx}
            className="chart-bar"
            style={{
              width: `${(seg.duration / totalMinutes) * 100}%`,
              height: `${seg.intensity * 100}%`,
              backgroundColor: seg.color,
            }}
            title={`${seg.label}: ${seg.duration} min`}
          />
        ))}
      </div>
      <div className="chart-labels">
        <span>0m</span>
        <span>{totalMinutes}m</span>
      </div>
    </div>
  );
};
