/**
 * Jack Daniels' VDOT calculation formulas and utilities.
 */

/**
 * Calculates the VO2 cost for a given velocity.
 * @param v Velocity in meters per minute.
 * @returns VO2 in ml/kg/min.
 */
export function calculateVO2(v: number): number {
  return -4.6 + 0.182258 * v + 0.000104 * Math.pow(v, 2);
}

/**
 * Calculates the percentage of VO2max sustainable for a given duration.
 * @param t Time in minutes.
 * @returns Percentage (as a fraction of 1, e.g., 0.85).
 */
export function calculatePercentMax(t: number): number {
  return (
    0.8 +
    0.1894393 * Math.exp(-0.012778 * t) +
    0.2989558 * Math.exp(-0.1932605 * t)
  );
}

/**
 * Adjusts race time from altitude to sea level equivalent.
 * Data based on Daniels' Table 6.1.
 * @param timeSeconds Time achieved at altitude.
 * @param altitudeMeters Altitude in meters.
 * @returns Sea level equivalent time in seconds.
 */
export function adjustTimeToSeaLevel(timeSeconds: number, altitudeMeters: number): number {
  if (altitudeMeters <= 0) return timeSeconds;

  const tMin = timeSeconds / 60;
  
  // Altitude points: 1000, 1500, 2000, 2250
  const altPoints = [1000, 1500, 2000, 2250];
  // Time points: 5, 10, 20, 30
  const timePoints = [5, 10, 20, 30];
  // Matrix of adjustments [time][altitude]
  const adjMatrix = [
    [1.5, 3.75, 6, 7.75],    // 5 min
    [4.25, 12.5, 21, 25.5],  // 10 min
    [9.75, 30, 51, 61],      // 20 min
    [15.25, 47.5, 81, 96.5], // 30 min
  ];

  // Helper for 1D interpolation
  const interpolate = (x: number, x0: number, x1: number, y0: number, y1: number) => {
    return y0 + (x - x0) * (y1 - y0) / (x1 - x0);
  };

  // Find altitude index
  let aIdx = altPoints.findIndex(a => a >= altitudeMeters);
  if (aIdx === -1) aIdx = altPoints.length - 1;
  if (aIdx === 0) aIdx = 1;

  // Adjustments at the two bounding altitude points for all time categories
  const adjsAtAlt = adjMatrix.map(row => 
    interpolate(altitudeMeters, altPoints[aIdx - 1], altPoints[aIdx], row[aIdx - 1], row[aIdx])
  );

  // Find time index
  let tIdx = timePoints.findIndex(t => t >= tMin);
  if (tIdx === -1) {
    // Extrapolate linearly for times > 30 min (Daniels usually caps or uses factors, 
    // but linear extrapolation of the penalty is a common approximation)
    const slope = (adjsAtAlt[3] - adjsAtAlt[2]) / (timePoints[3] - timePoints[2]);
    const penalty = adjsAtAlt[3] + (tMin - timePoints[3]) * slope;
    return timeSeconds - penalty;
  }
  if (tIdx === 0) tIdx = 1;

  const finalPenalty = interpolate(tMin, timePoints[tIdx - 1], timePoints[tIdx], adjsAtAlt[tIdx - 1], adjsAtAlt[tIdx]);
  return timeSeconds - finalPenalty;
}

/**
 * Adjusts pace based on temperature.
 * Data based on Daniels' Table 6.2 (approx 8s per 5k per 5degF above 55degF).
 * @param paceSperKm Original pace in seconds per kilometer.
 * @param tempCelsius Temperature in Celsius.
 * @returns Temperature adjusted pace.
 */
export function adjustPaceForTemperature(paceSperKm: number, tempCelsius: number): number {
  const tempF = (tempCelsius * 9/5) + 32;
  if (tempF <= 55) return paceSperKm;

  // 8 seconds per 5km for every 5 degrees F above 55
  const penaltyPerKm = ((tempF - 55) / 5 * 8) / 5;
  return paceSperKm + penaltyPerKm;
}

/**
 * Calculates VDOT from race distance and time, with environmental corrections.
 * @param distanceMeters Distance in meters.
 * @param timeSeconds Time in seconds.
 * @param altitude Altitude in meters.
 * @param temperature Temperature in Celsius.
 * @returns VDOT value.
 */
export function calculateVDOT(
  distanceMeters: number, 
  timeSeconds: number, 
  altitude: number = 0, 
  temperature: number = 12.8
): number {
  // 1. Correct time to sea-level equivalent
  let seaLevelTime = adjustTimeToSeaLevel(timeSeconds, altitude);
  
  // 2. Correct for temperature (Inverse: if ran in heat, real VDOT is higher)
  const tempF = (temperature * 9/5) + 32;
  if (tempF > 55) {
    const penaltyPerKm = ((tempF - 55) / 5 * 8) / 5;
    const totalPenalty = penaltyPerKm * (distanceMeters / 1000);
    seaLevelTime -= totalPenalty;
  }

  const t = seaLevelTime / 60;
  const v = distanceMeters / t;
  const vo2 = calculateVO2(v);
  const percentMax = calculatePercentMax(t);
  return vo2 / percentMax;
}

/**
 * Calculates the velocity corresponding to a given VO2 (VDOT).
 * Solves: 0.000104 * v^2 + 0.182258 * v - (4.6 + VDOT) = 0
 * @param vdot VDOT value.
 * @returns Velocity in meters per minute.
 */
export function calculateVelocityFromVO2(vdot: number): number {
  const a = 0.000104;
  const b = 0.182258;
  const c = -(4.6 + vdot);
  // Quadratic formula: v = (-b + sqrt(b^2 - 4ac)) / 2a
  return (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
}

export interface TrainingPaces {
  easy: { min: number; max: number };
  marathon: { min: number; max: number };
  threshold: { min: number; max: number };
  interval: { min: number; max: number };
  repetition: { min: number; max: number };
}

/**
 * Calculates training paces based on VDOT.
 * Paces are returned as seconds per kilometer (s/km).
 * @param vdot VDOT value.
 * @returns Training paces.
 */
export function calculateTrainingPaces(vdot: number): TrainingPaces {
  const vVO2max = calculateVelocityFromVO2(vdot);

  // Intensity percentages based on Daniels' Running Formula
  const intensities = {
    easyMin: 0.59,
    easyMax: 0.74,
    marathonMin: 0.75,
    marathonMax: 0.84,
    thresholdMin: 0.83,
    thresholdMax: 0.88,
    intervalMin: 0.95,
    intervalMax: 1.00,
    repetitionMin: 1.05,
    repetitionMax: 1.20,
  };

  const getSperKm = (v: number) => (1000 / v) * 60;

  return {
    easy: {
      min: getSperKm(vVO2max * intensities.easyMax), // Faster pace
      max: getSperKm(vVO2max * intensities.easyMin), // Slower pace
    },
    marathon: {
      min: getSperKm(vVO2max * intensities.marathonMax),
      max: getSperKm(vVO2max * intensities.marathonMin),
    },
    threshold: {
      min: getSperKm(vVO2max * intensities.thresholdMax),
      max: getSperKm(vVO2max * intensities.thresholdMin),
    },
    interval: {
      min: getSperKm(vVO2max * intensities.intervalMax),
      max: getSperKm(vVO2max * intensities.intervalMin),
    },
    repetition: {
      min: getSperKm(vVO2max * intensities.repetitionMax),
      max: getSperKm(vVO2max * intensities.repetitionMin),
    },
  };
}

/**
 * Predicts race time for a given distance based on VDOT.
 * Uses bisection method to solve the VDOT equation for time.
 * @param vdot VDOT value.
 * @param distanceMeters Target distance in meters.
 * @returns Predicted time in seconds.
 */
export function predictTime(vdot: number, distanceMeters: number): number {
  let low = 2; // 2 minutes (minimum sensible time)
  let high = 600; // 600 minutes (10 hours)
  
  // Bisection method to solve VDOT = VO2(D/t) / %Max(t)
  for (let i = 0; i < 25; i++) {
    const mid = (low + high) / 2;
    const v = distanceMeters / mid;
    const vo2 = calculateVO2(v);
    const pMax = calculatePercentMax(mid);
    const estimatedVDOT = vo2 / pMax;
    
    // Higher estimated VDOT means the time is too fast
    if (estimatedVDOT > vdot) {
      low = mid;
    } else {
      high = mid;
    }
  }
  
  return ((low + high) / 2) * 60;
}

/**
 * Formats seconds into HH:MM:SS or MM:SS duration string.
 * @param totalSeconds Total seconds.
 * @returns Formatted string.
 */
export function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.round(totalSeconds % 60);
  
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Formats seconds into a M:SS pace string.
 * @param totalSeconds Total seconds.
 * @returns Formatted string.
 */
export function formatPace(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
