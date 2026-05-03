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
 * Calculates VDOT from race distance and time.
 * @param distanceMeters Distance in meters.
 * @param timeSeconds Time in seconds.
 * @returns VDOT value.
 */
export function calculateVDOT(distanceMeters: number, timeSeconds: number): number {
  const t = timeSeconds / 60;
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
 * Formats seconds into a M:SS pace string.
 * @param totalSeconds Total seconds.
 * @returns Formatted string.
 */
export function formatPace(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
