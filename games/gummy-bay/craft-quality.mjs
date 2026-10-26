// Minigame scores become the batch quality that scales an asking price.
// Missing scores stay at 1 so starter packs and old saves keep their price.
export const SKIP_QUALITY = 0.9;
export const PRICE_QUALITY_FLOOR = 0.55;

const KEYS = ['rawQuality', 'gummyQuality', 'packQuality', 'packComplaint'];

function clamp01(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.min(1, Math.max(0, n));
}

export function ensureCraftQuality(state) {
  if (!state || typeof state !== 'object') return state;
  for (const key of KEYS) {
    if (!Array.isArray(state[key])) state[key] = [];
    else state[key] = state[key].map(entry => {
      const n = clamp01(entry);
      return n === null ? null : n;
    });
  }
  return state;
}

export function growQuality(plant) {
  if (!plant || typeof plant !== 'object') return 1;
  const parts = ['pour', 'seed', 'drizzle'].map(key => clamp01(plant[key])).filter(n => n !== null);
  if (!parts.length) return 1;
  return parts.reduce((sum, n) => sum + n, 0) / parts.length;
}

export function hasGrowScore(plant) {
  return !!plant && ['pour', 'seed', 'drizzle'].some(key => Number.isFinite(plant[key]));
}

export function blendQuality(prevQ, prevN, addQ, addN) {
  const add = clamp01(addQ);
  const count = Number(addN);
  const before = Number(prevN);
  if (add === null || !(count > 0)) return Number.isFinite(prevQ) ? clamp01(prevQ) : 1;
  const kept = before > 0 ? before : 0;
  const base = kept > 0 ? (Number.isFinite(prevQ) ? clamp01(prevQ) : 1) : 0;
  return Math.min(1, Math.max(0, (base * kept + add * count) / (kept + count)));
}

export function packScore(gummyQ, sealQ) {
  const gummy = Number.isFinite(gummyQ) ? clamp01(gummyQ) : 1;
  const seal = Number.isFinite(sealQ) ? clamp01(sealQ) : 1;
  return (gummy + seal) / 2;
}

export function listedQuality(state, index) {
  const q = state?.packQuality?.[index];
  if (!Number.isFinite(q)) return 1;
  return Math.min(1, Math.max(PRICE_QUALITY_FLOOR, q));
}

export function qualityPrice(base, bench = 0, quality = 1) {
  const price = Number(base);
  const q = Number.isFinite(quality) ? Math.min(1, Math.max(PRICE_QUALITY_FLOOR, quality)) : 1;
  const level = Number.isFinite(bench) ? bench : 0;
  if (!(price > 0)) return 1;
  return Math.max(1, Math.round(price * (1 + level * 0.15) * q));
}

export function complaintHits(probability, seed) {
  const p = Number(probability);
  if (!(p > 0)) return false;
  let x = (Number(seed) >>> 0) || 1;
  x = Math.imul(x ^ (x >>> 16), 2246822519);
  x = Math.imul(x ^ (x >>> 13), 3266489917);
  x = (x ^ (x >>> 16)) >>> 0;
  return x / 4294967296 < Math.min(1, p);
}

export function roundTripCraft(state) {
  const copy = JSON.parse(JSON.stringify(state));
  ensureCraftQuality(copy);
  copy.version = state?.version ?? copy.version;
  return copy;
}
