// Close-up bench. The camera keeps a fixed view of original props, the cursor
// stays free, and Esc leaves without using supplies.
import {CAVITY_POINTS, nearestCavity, SEED_SNAP_M} from './mould.mjs';
import {createPour, stepPour, assistPour, pourProgress, POUR_DONE} from './mg-pour.mjs';
import {createSeed, stepSeed, assistSeed, trySeed, seedProgress} from './mg-seed.mjs';
import {createDrizzle, stepDrizzle, assistDrizzle, drizzleTarget, onDrizzleTarget} from './mg-drizzle.mjs';
import {createSeal, stepSeal, assistSeal, sealProgress, crimpInGreen, SEAL_GREEN_START, SEAL_GREEN_END, SEAL_HOLD} from './mg-seal.mjs';
import {SKIP_QUALITY} from './craft-quality.mjs';

export const BENCH_KIND = Object.freeze({
  prepare: 'pour',
  plant: 'seed',
  water: 'drizzle',
  pack: 'seal',
});

const COPY = Object.freeze({
  pour: ['POUR', 'Tip the jug', 'Hold and sweep the spout. Stop between 80% and a spill.'],
  seed: ['SEED', 'Drop a crystal', 'Pop the vial, then let go over each cavity.'],
  drizzle: ['DRIZZLE', 'Follow the ring', 'Keep the stream on the ring. It jumps every moment.'],
  seal: ['SEAL', 'Bag, crimp, chute', 'Seat the gummy, hold the green, then drop it in.'],
});

function drizzleProgress(state) {
  return Math.min(1, state?.fill || 0);
}

function mesh(THREE, geometry, color, extras = {}) {
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: extras.roughness ?? 0.72,
    metalness: extras.metalness ?? 0.02,
    emissive: color,
    emissiveIntensity: extras.glow ?? 0.3,
    transparent: !!extras.transparent,
    opacity: extras.opacity ?? 1,
  });
  const object = new THREE.Mesh(geometry, material);
  object.castShadow = false;
  object.receiveShadow = false;
  object.frustumCulled = false;
  object.renderOrder = 40;
  return object;
}

function labelTexture(THREE, draw) {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const pen = canvas.getContext('2d');
    if (!pen) return null;
    draw(pen, canvas);
    const texture = new THREE.CanvasTexture(canvas);
    if ('colorSpace' in texture && THREE.SRGBColorSpace) texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  } catch {
    return null;
  }
}


// v133: the bench sits in a small, warmly lit shed instead of floating in front
// of the street. Everything here is baked into canvas textures on unlit
// materials, so it reads the same at noon and at 2 AM and adds no scene lights.
function bakedTexture(THREE, width, height, draw) {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const pen = canvas.getContext('2d');
    if (!pen) return null;
    draw(pen, width, height);
    const texture = new THREE.CanvasTexture(canvas);
    if ('colorSpace' in texture && THREE.SRGBColorSpace) texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    texture.needsUpdate = true;
    return texture;
  } catch {
    return null;
  }
}

function glowPool(pen, x, y, radius, strength) {
  const pool = pen.createRadialGradient(x, y, 0, x, y, radius);
  pool.addColorStop(0, `rgba(255,226,170,${strength})`);
  pool.addColorStop(1, 'rgba(255,226,170,0)');
  pen.fillStyle = pool;
  pen.fillRect(0, 0, pen.canvas.width, pen.canvas.height);
}

function shade(pen, w, h, edge) {
  const dark = pen.createRadialGradient(w / 2, h * 0.35, Math.min(w, h) * 0.2, w / 2, h * 0.35, Math.max(w, h) * 0.75);
  dark.addColorStop(0, 'rgba(20,14,10,0)');
  dark.addColorStop(1, `rgba(20,14,10,${edge})`);
  pen.fillStyle = dark;
  pen.fillRect(0, 0, w, h);
}

function drawPegboard(pen, w, h) {
  pen.fillStyle = '#b98f5e';
  pen.fillRect(0, 0, w, h);
  for (let y = 0; y < h; y += 4) { pen.fillStyle = y % 8 ? 'rgba(90,60,30,.05)' : 'rgba(255,240,210,.04)'; pen.fillRect(0, y, w, 2); }
  pen.fillStyle = 'rgba(60,38,20,.55)';
  for (let y = 14; y < h; y += 22) for (let x = 14; x < w; x += 22) { pen.beginPath(); pen.arc(x, y, 2.6, 0, Math.PI * 2); pen.fill(); }
  // Original tool silhouettes: spatula, whisk, measuring jug, scoop, scissors.
  const tool = (x, y, draw) => { pen.save(); pen.translate(x, y); pen.fillStyle = 'rgba(40,26,16,.28)'; pen.translate(5, 6); draw(); pen.restore(); pen.save(); pen.translate(x, y); draw(); pen.restore(); };
  tool(90, 120, () => { pen.fillStyle = '#5b6770'; pen.fillRect(-5, 0, 10, 120); pen.fillStyle = '#e76f51'; pen.fillRect(-22, 120, 44, 60); });
  tool(190, 110, () => { pen.strokeStyle = '#cfd6da'; pen.lineWidth = 5; for (let i = -2; i <= 2; i++) { pen.beginPath(); pen.ellipse(0, 150, 8 + Math.abs(i) * 7, 60, 0, 0, Math.PI * 2); pen.stroke(); } pen.fillStyle = '#2a9d8f'; pen.fillRect(-7, 20, 14, 80); });
  tool(310, 150, () => { pen.fillStyle = 'rgba(200,236,240,.9)'; pen.fillRect(-36, 0, 72, 90); pen.fillStyle = '#2b6f7a'; for (let i = 1; i < 5; i++) pen.fillRect(-36, i * 18, 22, 3); pen.strokeStyle = '#c9e8ec'; pen.lineWidth = 8; pen.beginPath(); pen.arc(44, 40, 20, -1.4, 1.4); pen.stroke(); });
  tool(w - 300, 120, () => { pen.fillStyle = '#f4a261'; pen.fillRect(-6, 0, 12, 90); pen.beginPath(); pen.arc(0, 120, 34, 0, Math.PI); pen.fill(); pen.fillRect(-34, 96, 68, 24); });
  tool(w - 190, 130, () => { pen.strokeStyle = '#d9dee2'; pen.lineWidth = 6; pen.beginPath(); pen.moveTo(-20, 150); pen.lineTo(20, 0); pen.moveTo(20, 150); pen.lineTo(-20, 0); pen.stroke(); pen.fillStyle = '#e63946'; pen.beginPath(); pen.arc(-24, 160, 16, 0, Math.PI * 2); pen.arc(24, 160, 16, 0, Math.PI * 2); pen.fill(); });
  // A hand-written recipe card and a doodled bear sticker.
  pen.save(); pen.translate(w / 2 + 30, 200); pen.rotate(-0.05);
  pen.fillStyle = '#fbf6e9'; pen.fillRect(-80, -50, 160, 110);
  pen.fillStyle = '#c0392b'; pen.fillRect(-80, -50, 160, 8);
  pen.fillStyle = '#4a3b2c'; pen.font = '700 20px system-ui, sans-serif'; pen.textAlign = 'center'; pen.fillText("GRAMPS' MIX", 0, -16);
  pen.font = '15px system-ui, sans-serif'; pen.fillText('80% fill · 1 crystal', 0, 12); pen.fillText('stay on the ring!', 0, 34);
  pen.restore();
  pen.fillStyle = '#e25b8a'; pen.beginPath(); pen.arc(w / 2 - 150, 290, 26, 0, Math.PI * 2); pen.arc(w / 2 - 170, 266, 11, 0, Math.PI * 2); pen.arc(w / 2 - 130, 266, 11, 0, Math.PI * 2); pen.fill();
  pen.fillStyle = '#fff'; pen.fillRect(w / 2 - 160, 286, 6, 6); pen.fillRect(w / 2 - 146, 286, 6, 6);
  glowPool(pen, w / 2, 0, w * 0.5, 0.5);
  shade(pen, w, h, 0.5);
}

function drawPlanks(pen, w, h) {
  const tones = ['#8a6141', '#7d573a', '#93694a', '#845c3e'];
  const plank = 64;
  for (let x = 0, i = 0; x < w; x += plank, i++) {
    pen.fillStyle = tones[i % tones.length];
    pen.fillRect(x, 0, plank, h);
    pen.fillStyle = 'rgba(40,24,12,.55)';
    pen.fillRect(x, 0, 3, h);
    const seam = (i * 157) % h;
    pen.fillRect(x, seam, plank, 3);
    pen.fillStyle = 'rgba(255,235,200,.05)';
    for (let g = 0; g < 6; g++) pen.fillRect(x + 8 + g * 9, 0, 1, h);
    pen.fillStyle = 'rgba(30,18,8,.35)';
    pen.beginPath(); pen.arc(x + 12, seam + 12, 2, 0, Math.PI * 2); pen.arc(x + plank - 12, seam + 12, 2, 0, Math.PI * 2); pen.fill();
  }
  glowPool(pen, w / 2, h * 0.42, w * 0.42, 0.34);
  shade(pen, w, h, 0.62);
}

function drawTin(pen, w, h) {
  pen.fillStyle = '#6f8a86';
  pen.fillRect(0, 0, w, h);
  for (let x = 0; x < w; x += 24) {
    const ridge = pen.createLinearGradient(x, 0, x + 24, 0);
    ridge.addColorStop(0, 'rgba(255,255,255,.12)');
    ridge.addColorStop(0.5, 'rgba(0,0,0,.16)');
    ridge.addColorStop(1, 'rgba(255,255,255,.12)');
    pen.fillStyle = ridge;
    pen.fillRect(x, 0, 24, h);
  }
  pen.fillStyle = 'rgba(150,90,50,.22)';
  for (let i = 0; i < 18; i++) pen.fillRect((i * 97) % w, h - 30 - ((i * 53) % 60), 6 + (i % 4) * 3, 30 + (i % 5) * 8);
  glowPool(pen, w * 0.5, h * 0.65, w * 0.6, 0.3);
  shade(pen, w, h, 0.66);
}

function flat(THREE, texture, fallback, extras = {}) {
  const material = new THREE.MeshBasicMaterial({color: texture ? 0xffffff : fallback, map: texture || null, fog: false, toneMapped: false, side: extras.side ?? THREE.FrontSide, transparent: !!extras.transparent, opacity: extras.opacity ?? 1});
  return material;
}

function roomPiece(THREE, geometry, material, at, turn = [0, 0, 0]) {
  const piece = new THREE.Mesh(geometry, material);
  piece.position.set(at[0], at[1], at[2]);
  piece.rotation.set(turn[0], turn[1], turn[2]);
  piece.frustumCulled = false;
  piece.renderOrder = 38;
  piece.castShadow = false;
  piece.receiveShadow = false;
  return piece;
}

export function createBenchRoom(THREE) {
  const room = new THREE.Group();
  room.name = 'gummy-bench-shed';
  const FLOOR = -0.78;
  const BACK = -0.6;
  const SIDE = 1.25;
  const pegboard = bakedTexture(THREE, 1024, 360, drawPegboard);
  const planks = bakedTexture(THREE, 512, 512, drawPlanks);
  const tin = bakedTexture(THREE, 512, 256, drawTin);
  const PEG_LOW = FLOOR + 0.42, PEG_TOP = 0.36;
  room.add(roomPiece(THREE, new THREE.PlaneGeometry(SIDE * 2, PEG_TOP - PEG_LOW), flat(THREE, pegboard, 0xb98f5e), [0, (PEG_LOW + PEG_TOP) / 2, BACK]));
  room.add(roomPiece(THREE, new THREE.PlaneGeometry(SIDE * 2, 1.2), flat(THREE, tin, 0x6f8a86), [0, PEG_TOP + 0.6, BACK - 0.005]));
  const skirting = flat(THREE, null, 0x4b3424);
  room.add(roomPiece(THREE, new THREE.BoxGeometry(SIDE * 2, 0.42, 0.02), flat(THREE, tin, 0x6f8a86), [0, FLOOR + 0.21, BACK + 0.01]));
  room.add(roomPiece(THREE, new THREE.BoxGeometry(SIDE * 2, 0.05, 0.04), skirting, [0, FLOOR + 0.42, BACK + 0.02]));
  room.add(roomPiece(THREE, new THREE.PlaneGeometry(3, 2.6), flat(THREE, planks, 0x845c3e), [0, FLOOR, 0.3], [-Math.PI / 2, 0, 0]));
  for (const side of [-1, 1]) {
    room.add(roomPiece(THREE, new THREE.PlaneGeometry(2.6, 2.2), flat(THREE, tin, 0x6f8a86), [side * SIDE, FLOOR + 1.1, 0.3], [0, -side * Math.PI / 2, 0]));
  }
  room.add(roomPiece(THREE, new THREE.PlaneGeometry(SIDE * 2, 2.6), flat(THREE, null, 0x2e2620), [0, FLOOR + 2.2, 0.3], [Math.PI / 2, 0, 0]));
  // Strip light over the pegboard, with a soft halo behind it.
  room.add(roomPiece(THREE, new THREE.BoxGeometry(0.9, 0.035, 0.04), flat(THREE, null, 0xfff4d6), [0, 0.3, BACK + 0.05]));
  room.add(roomPiece(THREE, new THREE.BoxGeometry(0.96, 0.02, 0.06), flat(THREE, null, 0x3b3f44), [0, 0.325, BACK + 0.05]));
  const halo = bakedTexture(THREE, 256, 64, (pen, w, h) => { const g = pen.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(255,236,190,.75)'); g.addColorStop(1, 'rgba(255,236,190,0)'); pen.fillStyle = g; pen.fillRect(0, 0, w, h); });
  room.add(roomPiece(THREE, new THREE.PlaneGeometry(1.6, 0.4), flat(THREE, halo, 0xfff0c8, {transparent: true, opacity: halo ? 1 : 0.3}), [0, 0.27, BACK + 0.015]));
  // Table frame, legs and a low shelf of jars so the bench stands on something.
  const wood = flat(THREE, null, 0x7a5435);
  const woodDark = flat(THREE, null, 0x5c3d26);
  room.add(roomPiece(THREE, new THREE.BoxGeometry(0.94, 0.07, 0.6), woodDark, [0, -0.09, 0]));
  for (const [x, z] of [[-0.42, -0.25], [0.42, -0.25], [-0.42, 0.25], [0.42, 0.25]]) {
    room.add(roomPiece(THREE, new THREE.BoxGeometry(0.06, Math.abs(FLOOR) - 0.12, 0.06), wood, [x, (FLOOR - 0.12) / 2, z]));
  }
  room.add(roomPiece(THREE, new THREE.BoxGeometry(0.84, 0.03, 0.5), wood, [0, FLOOR + 0.18, 0]));
  const jarColours = [0xf2c14e, 0xe25b8a, 0x7d5cff, 0x3ddc7a, 0xf4a261];
  jarColours.forEach((tint, index) => {
    const jar = roomPiece(THREE, new THREE.CylinderGeometry(0.05, 0.05, 0.13, 10), flat(THREE, null, tint, {transparent: true, opacity: 0.85}), [-0.3 + index * 0.15, FLOOR + 0.26, -0.08 + (index % 2) * 0.1]);
    room.add(jar);
    room.add(roomPiece(THREE, new THREE.CylinderGeometry(0.052, 0.052, 0.025, 10), flat(THREE, null, 0xe9e2d0), [jar.position.x, FLOOR + 0.335, jar.position.z]));
  });
  return room;
}

export function createBenchSession({THREE, scene, camera, canvas, emit, attach = 'camera'} = {}) {
  if (!THREE || !scene || !camera) throw new Error('Bench needs a scene and a camera.');
  const root = new THREE.Group();
  root.name = 'gummy-bench';
  root.visible = false;
  root.frustumCulled = false;
  if (attach === 'camera') {
    root.position.set(0, -0.2, -1.08);
    // Positive tilt shows the bench top. A negative tilt showed its underside.
    root.rotation.x = 0.9;
    camera.add(root);
  } else {
    root.position.set(0, 0, 0);
    scene.add(root);
  }

  const shed = attach === 'camera' ? createBenchRoom(THREE) : null;
  if (shed) root.add(shed);
  const table = mesh(THREE, new THREE.BoxGeometry(0.92, 0.05, 0.58), 0xc4a574, {roughness: 0.86});
  table.position.y = -0.03;
  root.add(table);
  const tray = mesh(THREE, new THREE.BoxGeometry(0.3, 0.028, 0.22), 0x3f6f68, {roughness: 0.55});
  tray.position.y = 0.012;
  root.add(tray);

  const wells = CAVITY_POINTS.map(cavity => {
    const well = mesh(THREE, new THREE.CylinderGeometry(0.016, 0.014, 0.02, 10), 0x244640, {roughness: 0.4});
    well.position.set(cavity.x, 0.02, cavity.z);
    root.add(well);
    return well;
  });
  const gelatin = CAVITY_POINTS.map(cavity => {
    const blob = mesh(THREE, new THREE.SphereGeometry(0.014, 12, 8), 0xf2c14e, {transparent: true, opacity: 0.92, roughness: 0.28, glow: 0.22});
    blob.position.set(cavity.x, 0.03, cavity.z);
    blob.scale.y = 0.2;
    blob.visible = false;
    root.add(blob);
    return blob;
  });
  const stickies = CAVITY_POINTS.map(cavity => {
    const spot = mesh(THREE, new THREE.CircleGeometry(0.02, 12), 0xd98a3a, {transparent: true, opacity: 0.85, roughness: 0.35});
    spot.rotation.x = -Math.PI / 2;
    spot.position.set(cavity.x + 0.02, 0.028, cavity.z + 0.012);
    spot.visible = false;
    root.add(spot);
    return spot;
  });

  const jug = new THREE.Group();
  jug.add(mesh(THREE, new THREE.CylinderGeometry(0.045, 0.05, 0.16, 12), 0x8fd0c8, {roughness: 0.32, metalness: 0.08}));
  const neck = mesh(THREE, new THREE.CylinderGeometry(0.02, 0.028, 0.06, 10), 0xd8efe8, {roughness: 0.3});
  neck.position.set(0.04, 0.08, 0);
  neck.rotation.z = -0.8;
  jug.add(neck);
  jug.position.set(0.28, 0.16, 0.08);
  root.add(jug);
  const stream = mesh(THREE, new THREE.CylinderGeometry(0.006, 0.008, 0.18, 8), 0xf2c14e, {transparent: true, opacity: 0.8, roughness: 0.2});
  stream.visible = false;
  root.add(stream);

  const vial = new THREE.Group();
  vial.add(mesh(THREE, new THREE.CylinderGeometry(0.028, 0.03, 0.12, 10), 0xd7e4ef, {transparent: true, opacity: 0.78, roughness: 0.12, metalness: 0.04}));
  const cap = mesh(THREE, new THREE.CylinderGeometry(0.032, 0.032, 0.03, 10), 0xf0d36a, {metalness: 0.2, roughness: 0.4});
  cap.position.y = 0.07;
  cap.name = 'vial-cap';
  vial.add(cap);
  vial.position.set(-0.34, 0.1, 0.08);
  root.add(vial);
  const looseCrystal = mesh(THREE, new THREE.OctahedronGeometry(0.016, 0), 0x7d5cff, {glow: 0.35, roughness: 0.25});
  looseCrystal.visible = false;
  root.add(looseCrystal);
  const planted = CAVITY_POINTS.map(cavity => {
    const crystal = mesh(THREE, new THREE.OctahedronGeometry(0.012, 0), 0xb9a6ff, {glow: 0.4, roughness: 0.22});
    crystal.position.set(cavity.x, 0.045, cavity.z);
    crystal.visible = false;
    root.add(crystal);
    return crystal;
  });

  const bottle = new THREE.Group();
  bottle.add(mesh(THREE, new THREE.CylinderGeometry(0.04, 0.046, 0.18, 12), 0xe25b8a, {roughness: 0.35}));
  const nozzle = mesh(THREE, new THREE.CylinderGeometry(0.012, 0.018, 0.07, 8), 0xf7c1d6, {roughness: 0.3});
  nozzle.position.set(0.03, 0.1, 0);
  nozzle.rotation.z = -0.9;
  bottle.add(nozzle);
  bottle.position.set(0.3, 0.16, -0.02);
  root.add(bottle);
  const syrup = mesh(THREE, new THREE.CylinderGeometry(0.007, 0.01, 0.2, 8), 0xff8fb8, {transparent: true, opacity: 0.82, roughness: 0.18});
  syrup.visible = false;
  root.add(syrup);
  const targetRing = mesh(THREE, new THREE.TorusGeometry(0.022, 0.004, 8, 18), 0xfff1a8, {glow: 0.45, roughness: 0.3});
  targetRing.rotation.x = Math.PI / 2;
  root.add(targetRing);
  const puddles = Array.from({length: 6}, () => {
    const puddle = mesh(THREE, new THREE.CircleGeometry(0.018, 12), 0xc44d78, {transparent: true, opacity: 0.7});
    puddle.rotation.x = -Math.PI / 2;
    puddle.visible = false;
    puddle.position.y = 0.03;
    root.add(puddle);
    return puddle;
  });

  const bag = mesh(THREE, new THREE.BoxGeometry(0.16, 0.2, 0.07), 0xf4efe2, {roughness: 0.84});
  bag.position.set(0.05, 0.14, 0.02);
  const bagMark = labelTexture(THREE, (pen, canvas) => {
    pen.fillStyle = '#f4efe2';
    pen.fillRect(0, 0, canvas.width, canvas.height);
    pen.fillStyle = '#2b4034';
    pen.font = '700 54px system-ui, sans-serif';
    pen.textAlign = 'center';
    pen.fillText('BAY', canvas.width / 2, 78);
  });
  if (bagMark) {
    const sticker = mesh(THREE, new THREE.PlaneGeometry(0.1, 0.05), 0xffffff, {roughness: 0.6, glow: 0});
    sticker.material.map = bagMark;
    sticker.material.color.setHex(0xffffff);
    sticker.position.set(0, 0.01, 0.037);
    bag.add(sticker);
  }
  root.add(bag);
  const gummy = mesh(THREE, new THREE.SphereGeometry(0.028, 14, 10), 0xf2c14e, {roughness: 0.35, glow: 0.2});
  gummy.scale.set(1, 0.72, 0.84);
  gummy.position.set(-0.28, 0.06, 0.05);
  root.add(gummy);
  const crimpTrack = mesh(THREE, new THREE.BoxGeometry(0.22, 0.018, 0.02), 0x2c3338, {roughness: 0.5});
  crimpTrack.position.set(0.05, 0.25, 0.02);
  root.add(crimpTrack);
  const crimpGreen = mesh(THREE, new THREE.BoxGeometry(0.22 * (SEAL_GREEN_END - SEAL_GREEN_START), 0.022, 0.024), 0x3ddc7a, {glow: 0.4, roughness: 0.35});
  crimpGreen.position.copy(crimpTrack.position);
  root.add(crimpGreen);
  const crimpMark = mesh(THREE, new THREE.BoxGeometry(0.012, 0.04, 0.03), 0xfff6d8, {glow: 0.3});
  crimpMark.position.copy(crimpTrack.position);
  root.add(crimpMark);
  const hopper = new THREE.Group();
  const chute = mesh(THREE, new THREE.BoxGeometry(0.16, 0.18, 0.16), 0x66707c, {metalness: 0.18, roughness: 0.45});
  chute.position.y = 0.1;
  hopper.add(chute);
  const mouth = mesh(THREE, new THREE.BoxGeometry(0.1, 0.04, 0.1), 0x1d242b, {roughness: 0.6});
  mouth.position.y = 0.2;
  hopper.add(mouth);
  hopper.position.set(0.36, 0, 0.02);
  root.add(hopper);

  const hitPlane = mesh(THREE, new THREE.PlaneGeometry(0.9, 0.56), 0xffffff, {transparent: true, opacity: 0, roughness: 1, glow: 0});
  hitPlane.rotation.x = -Math.PI / 2;
  hitPlane.position.y = 0.03;
  hitPlane.material.depthWrite = false;
  root.add(hitPlane);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const hitPoint = new THREE.Vector3();
  let styleReady = false;
  let hud = null;
  let active = false;
  let kind = '';
  let state = null;
  let dragging = false;
  let pointerLocal = {x: 0, z: 0, over: false};
  let savedFov = null;
  let finished = false;
  let color = 0xf2c14e;
  let hold = false;

  function ensureHud() {
    if (hud || typeof document === 'undefined') return;
    if (!styleReady) {
      styleReady = true;
      try {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = new URL('./bench.css?v=128', import.meta.url).href;
        (document.head || document.body).appendChild(link);
      } catch { /* the bench still runs without the extra stylesheet */ }
    }
    hud = document.createElement('div');
    hud.id = 'benchHUD';
    hud.hidden = true;
    hud.innerHTML = '<div class="bench-top"><div class="bench-kicker"></div><div class="bench-title"></div><div class="bench-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div></div></div><p class="bench-detail"></p></div><div class="bench-actions"><button type="button" class="bench-skip">Skip · −10% quality</button><button type="button" class="bench-cancel">Cancel</button></div>';
    document.body.appendChild(hud);
    hud.querySelector('.bench-skip').addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      skip();
    });
    hud.querySelector('.bench-cancel').addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      if (typeof api.onCancel === 'function') api.onCancel();
    });
  }

  function localHit(event) {
    if (!canvas || !event) return null;
    const rect = canvas.getBoundingClientRect?.();
    if (!rect || !rect.width || !rect.height) return null;
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObject(hitPlane, false);
    if (!hits.length) return null;
    root.worldToLocal(hitPoint.copy(hits[0].point));
    return {x: hitPoint.x, z: hitPoint.z};
  }

  function cavityFromPointer() {
    const hit = nearestCavity(pointerLocal.x, pointerLocal.z, 0.05);
    return hit ? hit.index : state?.cavity || 0;
  }

  function showKit() {
    const pour = kind === 'pour';
    const seed = kind === 'seed';
    const drizzle = kind === 'drizzle';
    const seal = kind === 'seal';
    jug.visible = pour;
    stream.visible = false;
    vial.visible = seed;
    looseCrystal.visible = false;
    bottle.visible = drizzle;
    syrup.visible = false;
    targetRing.visible = drizzle;
    bag.visible = seal;
    gummy.visible = seal;
    crimpTrack.visible = seal;
    crimpGreen.visible = seal;
    crimpMark.visible = seal;
    hopper.visible = seal;
    wells.forEach(well => { well.visible = !seal; });
    if (!pour) gelatin.forEach(blob => { blob.visible = false; });
    if (!pour) stickies.forEach(spot => { spot.visible = false; });
    if (!seed) planted.forEach(crystal => { crystal.visible = false; });
    if (!drizzle) puddles.forEach(puddle => { puddle.visible = false; });
  }

  function paintGelatin(fills, sticky) {
    fills.forEach((fill, index) => {
      const blob = gelatin[index];
      blob.visible = fill > 0.02;
      const height = 0.25 + Math.min(POUR_DONE * 1.4, fill) * 1.1;
      blob.scale.set(1, height, 1);
      blob.position.y = 0.026 + height * 0.012;
      blob.material.color.setHex(fill > 1.05 ? 0xe07a32 : color);
      blob.material.emissive.setHex(fill > 1.05 ? 0xe07a32 : color);
      stickies[index].visible = !!sticky?.[index];
    });
  }

  function syncMeshes() {
    if (!state) return;
    if (kind === 'pour') {
      const cavity = CAVITY_POINTS[state.cavity] || CAVITY_POINTS[0];
      jug.position.x = cavity.x;
      jug.position.z = cavity.z - 0.08;
      jug.rotation.z = state.pouring ? -0.85 : -0.15;
      stream.visible = !!state.pouring && !state.done;
      stream.position.set(cavity.x, 0.12, cavity.z - 0.02);
      stream.scale.y = 0.7 + (state.pouring ? 0.35 : 0);
      paintGelatin(state.fills, state.sticky);
    } else if (kind === 'seed') {
      cap.position.y = state.popped ? 0.12 : 0.07;
      looseCrystal.visible = !!state.popped && dragging && !state.done;
      if (looseCrystal.visible) looseCrystal.position.set(pointerLocal.x, 0.08, pointerLocal.z);
      state.placed.forEach((placed, index) => { planted[index].visible = !!placed; });
      planted.forEach(crystal => crystal.material.color.setHex(color));
    } else if (kind === 'drizzle') {
      const target = drizzleTarget(state);
      bottle.position.x = Number.isFinite(pointerLocal.x) && dragging ? pointerLocal.x : target.x;
      bottle.position.z = (Number.isFinite(pointerLocal.z) && dragging ? pointerLocal.z : target.z) - 0.06;
      bottle.rotation.z = state.pouring ? -0.7 : -0.1;
      syrup.visible = !!state.pouring && state.prime > 0.2 && !state.done;
      syrup.position.set(bottle.position.x, 0.1, bottle.position.z + 0.04);
      targetRing.position.set(target.x, 0.04, target.z);
      const pulse = 1 + Math.sin(state.elapsed * 8) * 0.08;
      targetRing.scale.setScalar(pulse);
      paintGelatin(CAVITY_POINTS.map(() => state.fill * 0.8), []);
      puddles.forEach((puddle, index) => {
        puddle.visible = index < state.puddles;
        const spot = CAVITY_POINTS[(index * 3 + 1) % CAVITY_POINTS.length];
        puddle.position.set(spot.x + 0.02, 0.03, spot.z);
      });
    } else if (kind === 'seal') {
      const seated = Math.min(1, state.bag);
      gummy.position.set(-0.28 + seated * 0.3, 0.06 + seated * 0.05, 0.05);
      gummy.visible = state.phase === 'bag' || state.bag < 1;
      gummy.material.color.setHex(color);
      gummy.material.emissive.setHex(color);
      const along = (state.crimp - 0.5) * 0.22;
      crimpMark.position.x = crimpTrack.position.x + along;
      crimpMark.material.color.setHex(crimpInGreen(state.crimp) && state.holding ? 0x3ddc7a : 0xfff6d8);
      if (state.phase === 'hopper' || state.dropped) {
        bag.position.x = 0.22;
        bag.position.y = state.dropped ? 0.08 : 0.12;
      } else {
        bag.position.set(0.05, 0.14, 0.02);
      }
    }
  }

  function progress() {
    if (kind === 'pour') return pourProgress(state);
    if (kind === 'seed') return seedProgress(state);
    if (kind === 'drizzle') return drizzleProgress(state);
    return sealProgress(state);
  }

  function detail() {
    if (!state) return '';
    if (kind === 'pour') {
      const ready = state.fills.filter(fill => fill >= POUR_DONE).length;
      return ready + ' / 12 filled' + (state.spills ? ' · ' + state.spills + ' spill' + (state.spills === 1 ? '' : 's') : '') + ' · Esc cancels';
    }
    if (kind === 'seed') return (state.popped ? 'Vial open' : 'Tap the cap') + ' · ' + state.placed.filter(Boolean).length + ' / 12 · 2.5 cm snap';
    if (kind === 'drizzle') return Math.round(state.fill * 100) + '% syrup' + (state.puddles ? ' · ' + state.puddles + ' puddle' + (state.puddles === 1 ? '' : 's') : '');
    if (state.phase === 'crimp') return state.bad ? 'Outside the green' : 'Hold inside the green for a moment';
    if (state.phase === 'hopper') return 'Drop the bag into the chute';
    if (state.phase === 'done') return 'Sealed';
    return 'Drag the gummy into the bag';
  }

  function syncHud() {
    ensureHud();
    if (!hud) return;
    const copy = COPY[kind] || COPY.pour;
    hud.hidden = !active;
    hud.querySelector('.bench-kicker').textContent = copy[0];
    hud.querySelector('.bench-title').textContent = copy[1];
    hud.querySelector('.bench-detail').textContent = detail();
    const amount = Math.round(progress() * 100);
    const bar = hud.querySelector('.bench-progress');
    bar.setAttribute('aria-valuenow', String(amount));
    bar.firstElementChild.style.width = amount + '%';
    if (typeof document !== 'undefined') document.body.classList.toggle('bench-open', active);
  }

  function applyLook(on) {
    if (!camera) return;
    if (on) {
      if (savedFov === null) savedFov = camera.fov;
      camera.fov = attach === 'camera' ? 46 : camera.fov;
      camera.updateProjectionMatrix();
    } else if (savedFov !== null) {
      camera.fov = savedFov;
      savedFov = null;
      camera.updateProjectionMatrix();
    }
  }

  function finish(score, skipped = false) {
    if (finished || !active) return;
    finished = true;
    const quality = skipped ? SKIP_QUALITY : score.quality;
    const payload = {kind, quality, skipped, spills: state?.spills || 0, complaint: skipped ? 0 : (score.complaint || 0), bad: !skipped && !!score.bad};
    emit?.(skipped ? 'skip' : 'done');
    const done = api.onComplete;
    close(true);
    if (typeof done === 'function') done(payload);
  }

  function skip() {
    if (!active) return;
    finish({quality: SKIP_QUALITY, complaint: 0, bad: false}, true);
  }

  function close(restoreLook = true) {
    active = false;
    dragging = false;
    hold = false;
    root.visible = false;
    if (hud) hud.hidden = true;
    if (typeof document !== 'undefined') document.body?.classList?.remove('bench-open');
    if (restoreLook) applyLook(false);
  }

  function open(task, options = {}) {
    kind = BENCH_KIND[task?.k] || task?.kind || 'pour';
    if (!COPY[kind]) kind = 'pour';
    color = options.color || 0xf2c14e;
    state = kind === 'pour' ? createPour() : kind === 'seed' ? createSeed() : kind === 'drizzle' ? createDrizzle() : createSeal();
    finished = false;
    dragging = false;
    active = true;
    hold = !!options.hold;
    root.visible = true;
    gelatin.forEach(blob => { blob.material.color.setHex(color); blob.material.emissive.setHex(color); });
    showKit();
    syncMeshes();
    ensureHud();
    syncHud();
    applyLook(true);
    try { if (typeof document !== 'undefined') document.exitPointerLock?.(); } catch { /* already free */ }
  }

  function tick(dt, {assist = false} = {}) {
    if (!active || finished || hold) return;
    const step = Math.max(0, Number.isFinite(dt) ? Math.min(0.06, dt) : 0);
    if (kind === 'pour') {
      const before = state.spills;
      const was = state.pouring;
      state = assist ? assistPour(state, step) : stepPour(state, step, {pouring: dragging, cavity: cavityFromPointer()});
      if (state.pouring && !was) emit?.('pour');
      if (state.spills > before) emit?.('spill');
      if (state.done) { syncMeshes(); syncHud(); finish(state); return; }
    } else if (kind === 'seed') {
      const before = state.placed.filter(Boolean).length;
      const popped = state.popped;
      state = assist ? assistSeed(state, step) : stepSeed(state, step, dragging && pointerLocal.over ? {} : {});
      if (state.popped && !popped) emit?.('pop');
      if (state.placed.filter(Boolean).length > before) emit?.('snap');
      if (state.done) { syncMeshes(); syncHud(); finish(state); return; }
    } else if (kind === 'drizzle') {
      const before = state.puddles;
      const was = state.pouring;
      const target = drizzleTarget(state);
      const aim = assist ? {pouring: true, aimX: target.x, aimZ: target.z} : {pouring: dragging, aimX: pointerLocal.x, aimZ: pointerLocal.z};
      state = assist ? assistDrizzle(state, step) : stepDrizzle(state, step, aim);
      if (state.pouring && !was) emit?.('drizzle');
      if (state.puddles > before) emit?.('spill');
      if (state.done) { syncMeshes(); syncHud(); finish(state); return; }
    } else if (kind === 'seal') {
      const phase = state.phase;
      if (assist) state = assistSeal(state, step);
      else {
        const input = {};
        if (state.phase === 'bag') input.inBag = dragging && pointerLocal.x > -0.05 && pointerLocal.x < 0.16;
        if (state.phase === 'crimp') {
          input.holding = dragging;
          input.crimp = Math.min(1, Math.max(0, (pointerLocal.x - (crimpTrack.position.x - 0.11)) / 0.22));
        }
        if (state.phase === 'hopper') input.inHopper = dragging && pointerLocal.x > 0.24;
        state = stepSeal(state, step, input);
      }
      if (state.phase !== phase && state.phase === 'crimp') emit?.('crimp');
      if (state.phase !== phase && state.phase === 'hopper') emit?.('crimp');
      if (state.phase !== phase && state.phase === 'done') emit?.('drop');
      if (state.done) { syncMeshes(); syncHud(); finish(state); return; }
    }
    syncMeshes();
    syncHud();
  }

  function onPointer(event, down) {
    if (!active || hold) return;
    const point = localHit(event);
    if (point) pointerLocal = {...point, over: true};
    if (down === 'down') {
      dragging = true;
      if (kind === 'seed' && !state.popped && point && point.x < -0.2) stepSeed(state, 0.5, {pop: true});
      if (kind === 'seed' && state.popped) looseCrystal.visible = true;
    }
    if (down === 'up') {
      if (kind === 'seed' && state.popped && point) {
        const hit = trySeed(state, point.x, point.z);
        if (hit) emit?.('snap');
      }
      if (kind === 'seal' && state?.phase === 'crimp' && !crimpInGreen(state.crimp)) {
        state = stepSeal(state, 0, {forceBad: true, crimp: state.crimp});
      }
      dragging = false;
    }
    syncMeshes();
    syncHud();
    if (state?.done) finish(state);
  }

  if (canvas?.addEventListener) {
    canvas.addEventListener('pointerdown', event => {
      if (!active || event.button > 0) return;
      event.preventDefault();
      event.stopPropagation();
      onPointer(event, 'down');
    }, true);
    canvas.addEventListener('pointermove', event => {
      if (!active) return;
      onPointer(event, 'move');
    }, true);
    const up = event => { if (active) onPointer(event, 'up'); };
    const host = typeof window === 'undefined' ? globalThis : window;
    host.addEventListener?.('pointerup', up, true);
    host.addEventListener?.('pointercancel', up, true);
  }

  const api = {
    get active() { return active; },
    get kind() { return kind; },
    get state() { return state; },
    open,
    close,
    tick,
    skip,
    syncHud,
    applyCamera() { if (active) applyLook(true); },
    onComplete: null,
    onCancel: null,
    holdPose(nextKind, at = 0.45) {
      open({k: {pour: 'prepare', seed: 'plant', drizzle: 'water', seal: 'pack'}[nextKind] || 'prepare'}, {color: 0xf2c14e, hold: true});
      if (kind === 'pour') {
        state.fills = state.fills.map((_, index) => index < 7 ? 0.7 + (index % 3) * 0.12 : index === 7 ? 0.4 : 0);
        state.pouring = true;
        state.cavity = 6;
        state.sticky[2] = at > 0.7;
        if (state.sticky[2]) state.spills = 1;
      } else if (kind === 'seed') {
        state.popped = true;
        state.placed = state.placed.map((_, index) => index < 5);
        state.accuracy = state.accuracy.map((_, index) => index < 5 ? 0.8 : 0);
        dragging = true;
        pointerLocal = {x: CAVITY_POINTS[5].x, z: CAVITY_POINTS[5].z, over: true};
      } else if (kind === 'drizzle') {
        state.fill = 0.46;
        state.pouring = true;
        state.prime = 1;
        state.target = 4;
        state.puddles = 1;
        dragging = true;
        const target = drizzleTarget(state);
        pointerLocal = {x: target.x, z: target.z, over: true};
      } else {
        state.phase = 'crimp';
        state.bag = 1;
        state.crimp = SEAL_GREEN_START + (SEAL_GREEN_END - SEAL_GREEN_START) * 0.5;
        state.holding = true;
        state.hold = SEAL_HOLD * 0.45;
        pointerLocal = {x: 0.05, z: 0, over: true};
      }
      syncMeshes();
      syncHud();
    },
  };
  return api;
}

export {onDrizzleTarget};
export {SKIP_QUALITY};
export {ensureCraftQuality, growQuality, hasGrowScore, blendQuality, packScore, listedQuality, complaintHits} from './craft-quality.mjs';
export {playBenchCue} from './bench-audio.mjs';
