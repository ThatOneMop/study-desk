// Shared 12-cavity mould. Spacing is wider than two snap radii so a
// crystal can land in only one cavity. All measurements are metres.
export const MOULD_CAVITIES = 12;
export const MOULD_COLS = 4;
export const MOULD_ROWS = 3;
export const MOULD_GAP = 0.056;
export const SEED_SNAP_M = 0.025;

const points = [];
for (let row = 0; row < MOULD_ROWS; row++) {
  for (let col = 0; col < MOULD_COLS; col++) {
    points.push(Object.freeze({
      index: row * MOULD_COLS + col,
      col,
      row,
      x: (col - (MOULD_COLS - 1) / 2) * MOULD_GAP,
      z: (row - (MOULD_ROWS - 1) / 2) * MOULD_GAP,
    }));
  }
}

export const CAVITY_POINTS = Object.freeze(points);

export function cavityAt(index) {
  const i = index | 0;
  return CAVITY_POINTS[i] || null;
}

export function nearestCavity(x, z, radius = SEED_SNAP_M) {
  if (!Number.isFinite(x) || !Number.isFinite(z) || !(radius > 0)) return null;
  let best = null;
  for (const cavity of CAVITY_POINTS) {
    const distance = Math.hypot(x - cavity.x, z - cavity.z);
    if (distance <= radius && (!best || distance < best.distance)) {
      best = {index: cavity.index, x: cavity.x, z: cavity.z, distance, accuracy: 1 - distance / radius};
    }
  }
  return best;
}
