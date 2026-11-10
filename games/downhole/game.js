/* Downhole — original digging/selling vertical slice. Three.js (MIT). Part of Study Desk games. */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const NX = 32, NZ = 32, NY = 64, TOP = NY - 1; /* block y: [y,y+1), grass at y=TOP */
const SAVE_KEY = 'downhole-v1', SET_KEY = 'downhole-settings-v1';
const $ = (s) => document.querySelector(s);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ---------- deterministic world ---------- */
function hash3(x, y, z) {
  let h = (x * 374761393 + y * 668265263 + z * 2147483647) | 0;
  h = (h ^ (h >> 13)) * 1274126177 | 0;
  return ((h ^ (h >> 16)) >>> 0) / 4294967296;
}
const ORES = {
  copper: { value: 8, color: 0xb87333, glow: 0x6b3e14 },
  silver: { value: 22, color: 0xc8ccd4, glow: 0x5d6774 },
  gold: { value: 60, color: 0xf0c419, glow: 0x8a6a0a },
  crystal: { value: 150, color: 0x7ee8fa, glow: 0x1c6f7e }
};
const MATS = {
  grass: { color: 0x5d8a4a, top: 0x6fae57 },
  dirt: { color: 0x7a5a3a, hardness: 1 },
  stone: { color: 0x7c827c, hardness: 2 },
  deep: { color: 0x55605c, hardness: 3.5 },
  hard: { color: 0x3d4a50, hardness: 5.5 },
  bedrock: { color: 0x22282b, hardness: Infinity }
};
function depthOf(y) { return TOP - y; }
function blockInfo(x, y) {
  if (y <= 0) return { mat: 'bedrock' };
  const d = depthOf(y);
  const mat = d < 0 ? 'grass' : d < 6 ? 'dirt' : d < 20 ? 'stone' : d < 38 ? 'deep' : 'hard';
  let ore = null;
  const r = hash3(x, y, ((x * 7 + y) ^ (y * 31)) | 0);
  if (d >= 4 && r < 0.06) ore = 'copper';
  else if (d >= 16 && r >= 0.06 && r < 0.10) ore = 'silver';
  else if (d >= 30 && r >= 0.10 && r < 0.135) ore = 'gold';
  else if (d >= 46 && r >= 0.135 && r < 0.16) ore = 'crystal';
  return { mat, ore };
}

/* ---------- state ---------- */
const world = { top: new Int16Array(NX * NZ), seedNote: 'deterministic hash3 world' };
for (let i = 0; i < world.top.length; i++) world.top[i] = TOP;
const idx = (x, z) => x * NZ + z;
const inB = (x, z) => x >= 0 && x < NX && z >= 0 && z < NZ;

const S = {
  money: 0, hp: 100, pack: {}, ach: {},
  up: { pick: 1, lamp: 1, pack: 1, jet: 0, boots: 0 },
  playSec: 0
};
const UP = {
  pick: { name: 'Pickaxe', max: 5, cost: [60, 220, 650, 1500], desc: lv => `Dig power ${[1, 2, 3, 4.5, 6][lv - 1]} — bites through harder rock` },
  lamp: { name: 'Headlamp', max: 3, cost: [90, 320], desc: lv => `Light reach ${[7, 12, 20][lv - 1]} blocks` },
  pack: { name: 'Backpack', max: 4, cost: [80, 240, 600], desc: lv => `Carry ${[10, 18, 28, 40][lv - 1]} ore` },
  jet: { name: 'Jetpack', max: 2, cost: [400, 1000], desc: () => 'Hold Space to fly (fuel refills on ground)' },
  boots: { name: 'Boots', max: 2, cost: [150, 500], desc: lv => `Fall protection ${lv === 1 ? '50%' : 'full'}` }
};
const pickPower = () => [1, 2, 3, 4.5, 6][S.up.pick - 1];
const packCap = () => [10, 18, 28, 40][S.up.pack - 1];
const lampR = () => [7, 12, 20][S.up.lamp - 1];
const jetFuelMax = () => S.up.jet ? [2.2, 4][S.up.jet - 1] : 0;
const fallProt = () => [1, 0.5, 0][S.up.boots];

const ACHS = {
  firstSale: ['First sale', 'Sell ore at the shack'],
  copper: ['Copper strike', 'Dig up copper'],
  silver: ['Silver lining', 'Dig up silver'],
  gold: ['Gold rush', 'Dig up gold'],
  crystal: ['Void crystal', 'Reach crystal depth'],
  deep10: ['Ten down', 'Dig 10 blocks deep'],
  deep30: ['Thirty down', 'Dig 30 blocks deep'],
  rich: ['Money pit', 'Hold $1,000'],
  full: ['Heavy haul', 'Fill your backpack'],
  death: ['Rock bottom', 'Take a fatal fall']
};

/* ---------- settings ---------- */
let settings = { vol: 70, sens: 100, invertY: false, music: true };
try { Object.assign(settings, JSON.parse(localStorage.getItem(SET_KEY) || '{}')); } catch (e) {}
function saveSettings() { try { localStorage.setItem(SET_KEY, JSON.stringify(settings)); } catch (e) {} }

/* ---------- persistence ---------- */
function save() {
  const data = {
    v: 1, money: S.money, hp: S.hp, pack: S.pack, ach: S.ach, up: S.up, playSec: Math.round(S.playSec),
    top: Array.from(world.top).map(t => t - (TOP)).join(',') /* offset so bedrock columns compress as small ints */
  };
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); return true; }
  catch (e) { toast('Could not save (storage blocked)'); return false; }
}
function load() {
  let d = null;
  try { d = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (e) {}
  if (!d || d.v !== 1) return false;
  S.money = d.money | 0; S.hp = d.hp ?? 100;
  S.pack = d.pack || {}; S.ach = d.ach || {}; S.up = Object.assign({ pick: 1, lamp: 1, pack: 1, jet: 0, boots: 0 }, d.up);
  S.playSec = d.playSec || 0;
  if (typeof d.top === 'string') {
    d.top.split(',').forEach((v, i) => { if (i < world.top.length) world.top[i] = clamp(TOP + (+v || 0), 0, TOP); });
  }
  return true;
}
const hasSave = () => { try { return !!localStorage.getItem(SAVE_KEY); } catch (e) { return false; } };

/* ---------- three.js scene ---------- */
const canvas = $('#view');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b1210);
scene.fog = new THREE.Fog(0x0b1210, 8, 26);
const camera = new THREE.PerspectiveCamera(72, 1, 0.05, 400);

scene.add(new THREE.HemisphereLight(0x9fb8a5, 0x1a211c, 0.5));
const lamp = new THREE.PointLight(0xffd9a0, 1.6, 20, 1.6);
scene.add(lamp);

/* instanced blocks: one mesh, per-instance colour */
const blockGeo = new THREE.BoxGeometry(1, 1, 1);
const blockMat = new THREE.MeshLambertMaterial();
const blocks = new THREE.InstancedMesh(blockGeo, blockMat, NX * NZ * 4);
blocks.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
scene.add(blocks);
const dummy = new THREE.Object3D(), tint = new THREE.Color();

function blockColor(x, y, z, info) {
  if (info.ore) return ORES[info.ore].color;
  const base = new THREE.Color(MATS[info.mat].color);
  if (info.mat === 'grass' && y === TOP) base.set(MATS.grass.top);
  const v = 0.9 + hash3(x * 5 + 1, y, z * 3) * 0.18;
  return base.multiplyScalar(v);
}
/* exposed = column tops + blocks whose side is open because a neighbour column is lower */
function rebuildBlocks() {
  let n = 0;
  const put = (x, y, z) => {
    dummy.position.set(x + 0.5, y + 0.5, z + 0.5);
    dummy.updateMatrix();
    blocks.setMatrixAt(n, dummy.matrix);
    blocks.setColorAt(n, blockColor(x, y, z, blockInfo(x, y)));
    n++;
  };
  for (let x = 0; x < NX; x++) for (let z = 0; z < NZ; z++) {
    const t = world.top[idx(x, z)];
    if (t < 0) continue;
    put(x, t, z);
    /* side-exposed: neighbours lower than us expose our blocks below the top */
    let lowest = t;
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      if (!inB(x + dx, z + dz)) continue;
      lowest = Math.min(lowest, world.top[idx(x + dx, z + dz)]);
    }
    for (let y = lowest + 1; y < t && n < blocks.count; y++) put(x, y, z);
  }
  blocks.count = n;
  blocks.instanceMatrix.needsUpdate = true;
  if (blocks.instanceColor) blocks.instanceColor.needsUpdate = true;
}

/* shack decoration near spawn */
const shack = new THREE.Group();
{
  const wood = new THREE.MeshLambertMaterial({ color: 0x8a6b42 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(3, 2, 3), wood); body.position.y = 1; shack.add(body);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.5, 3.6), new THREE.MeshLambertMaterial({ color: 0xb04a3a }));
  roof.position.y = 2.3; shack.add(roof);
  const sign = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.7, 0.15), new THREE.MeshLambertMaterial({ color: 0xf2d98a }));
  sign.position.set(0, 1.6, 1.6); shack.add(sign);
}
shack.position.set(4.5, TOP + 1, 4.5);
scene.add(shack);

/* ---------- player ---------- */
const player = {
  pos: new THREE.Vector3(16.5, TOP + 1, 16.5),
  vel: new THREE.Vector3(),
  yaw: Math.PI * 0.75, pitch: -0.2,
  onGround: true, fuel: 0, dead: false
};
const keys = new Set();
let mode = 'title'; /* title | play | pause | shop | dead */

const groundAt = (x, z) => {
  if (!inB(Math.floor(x), Math.floor(z))) return TOP + 1;
  return world.top[idx(Math.floor(x), Math.floor(z))] + 1;
};
const solidAt = (x, y, z) => {
  if (!inB(Math.floor(x), Math.floor(z))) return false;
  return y < world.top[idx(Math.floor(x), Math.floor(z))] + 1 && y >= 0;
};

/* ---------- input ---------- */
let locked = false;
canvas.addEventListener('click', () => { if (mode === 'play') canvas.requestPointerLock(); });
document.addEventListener('pointerlockchange', () => { locked = document.pointerLockElement === canvas; });
addEventListener('keydown', (e) => {
  if (e.repeat) return;
  keys.add(e.code);
  if (e.code === 'KeyE') onE();
});
addEventListener('keyup', (e) => keys.delete(e.code));
let mouseDown = 0;
addEventListener('mousedown', (e) => { if (e.button === 0) mouseDown = 1; });
addEventListener('mouseup', (e) => { if (e.button === 0) { mouseDown = 0; digReset(); } });
addEventListener('mousemove', (e) => {
  if (!locked || mode !== 'play') return;
  const s = settings.sens / 100 * 0.0022;
  player.yaw -= e.movementX * s;
  player.pitch = clamp(player.pitch - e.movementY * s * (settings.invertY ? -1 : 1), -1.45, 1.45);
});

/* ---------- digging ---------- */
let dig = null; /* {x,y,z,need,t} */
function aimTarget() {
  const dir = new THREE.Vector3(0, 0, -1)
    .applyEuler(new THREE.Euler(player.pitch, player.yaw, 0, 'YXZ'));
  const eye = player.pos.clone().add(new THREE.Vector3(0, 0.8, 0));
  let prev = null;
  for (let t = 0.4; t <= 5.2; t += 0.1) {
    const p = eye.clone().add(dir.clone().multiplyScalar(t));
    const cx = Math.floor(p.x), cz = Math.floor(p.z);
    if (!inB(cx, cz)) continue;
    const top = world.top[idx(cx, cz)];
    if (p.y < top + 1 && p.y >= 0) {
      const y = clamp(Math.floor(p.y) === top ? top : top, 0, TOP);
      return { x: cx, y: top, z: cz, dist: t };
    }
    prev = p;
  }
  return null;
}
function digReset() { dig = null; $('#digRing').hidden = true; }
function digTick(dt) {
  const hit = aimTarget();
  if (!hit) { digReset(); $('#hint').textContent = ''; return; }
  const info = blockInfo(hit.x, hit.y);
  const hard = MATS[info.mat].hardness;
  $('#hint').textContent = info.ore
    ? `${info.ore} ore · hardness ${hard}`
    : `hardness ${hard}${hard > pickPower() ? ' — need better pickaxe' : ''}`;
  if (hard > pickPower()) { digReset(); return; }
  if (!dig || dig.x !== hit.x || dig.y !== hit.y || dig.z !== hit.z) {
    dig = { x: hit.x, y: hit.y, z: hit.z, need: 0.9 * hard / pickPower(), t: 0 };
  }
  dig.t += dt;
  $('#digRing').hidden = false;
  $('#digFill').style.setProperty('--p', `${Math.min(100, dig.t / dig.need * 100)}%`);
  if (dig.t >= dig.need) {
    dig.t = 0;
    world.top[idx(dig.x, dig.z)] = Math.max(0, hit.y - 1);
    rebuildBlocks();
    const packTotal = Object.values(S.pack).reduce((a, b) => a + b, 0);
    if (info.ore) {
      if (packTotal < packCap()) { S.pack[info.ore] = (S.pack[info.ore] || 0) + 1; DHaudio.sfx.pickup(); ach(info.ore); }
      else { DHaudio.sfx.ui(); toast('Backpack full — sell at the shack (E on the surface)'); }
    } else DHaudio.sfx.dig();
    if (hash3(dig.x, hit.y, dig.z) > 0.7) setTimeout(() => DHaudio.sfx.crack(), 90);
    const d = depthOf(hit.y);
    if (d >= 10) ach('deep10'); if (d >= 30) ach('deep30'); if (d >= 46) ach('crystal');
    saveSoon();
  } else if (Math.random() < dt * 8) DHaudio.sfx.dig();
}

/* ---------- ore / shop / sell ---------- */
function onE() {
  if (mode !== 'play') return;
  const onSurface = player.pos.y >= TOP + 0.5 && groundAt(player.pos.x, player.pos.z) >= TOP + 1;
  if (onSurface) { openShop(); return; }
  const total = Object.values(S.pack).reduce((a, b) => a + b, 0);
  toast(total ? `Cargo: ${cargoText()} (sell on the surface)` : 'Backpack empty. Deeper = richer.');
}
const cargoText = () => Object.entries(S.pack).filter(([, n]) => n).map(([k, n]) => `${n} ${k}`).join(', ');
function openShop() {
  mode = 'shop'; digReset();
  document.exitPointerLock?.();
  $('#shopSell').innerHTML = ''; $('#shopBuy').innerHTML = ''; $('#shopMsg').textContent = '';
  const packRows = Object.entries(S.pack).filter(([, n]) => n > 0);
  if (packRows.length) {
    let total = 0;
    for (const [k, n] of packRows) {
      const row = document.createElement('div'); row.className = 'shopRow';
      const v = ORES[k].value * n; total += v;
      row.innerHTML = `<span>${n} × ${k}<span class="sub">$${ORES[k].value} each</span></span>`;
      const b = document.createElement('button'); b.textContent = 'Sell';
      b.onclick = () => { S.money += v; S.pack[k] = 0; DHaudio.sfx.sell(); ach('firstSale'); if (S.money >= 1000) ach('rich'); save(); openShop(); };
      row.appendChild(b); $('#shopSell').appendChild(row);
    }
    const all = document.createElement('button'); all.className = 'primary'; all.textContent = `Sell everything — $${total}`;
    all.style.marginBottom = '14px';
    all.onclick = () => {
      S.money += total; for (const [k] of packRows) S.pack[k] = 0;
      DHaudio.sfx.sell(); ach('firstSale'); if (S.money >= 1000) ach('rich');
      save(); updateHUD(); openShop();
    };
    const wrap = document.createElement('div'); wrap.appendChild(all); $('#shopSell').prepend(wrap);
  } else {
    $('#shopSell').innerHTML = '<p class="sub">Backpack empty — go dig. Deeper blocks hide richer ore.</p>';
  }
  for (const key of Object.keys(UP)) {
    const lv = S.up[key], spec = UP[key];
    if (lv >= spec.max) continue;
    const cost = spec.cost[lv - 1];
    const row = document.createElement('div'); row.className = 'shopRow';
    row.innerHTML = `<span>${spec.name} → level ${lv + 1}<span class="sub">${spec.desc(lv + 1)}</span></span>`;
    const b = document.createElement('button'); b.textContent = `$${cost}`;
    b.disabled = S.money < cost;
    b.onclick = () => { S.money -= cost; S.up[key] = lv + 1; DHaudio.sfx.buy(); save(); updateHUD(); openShop(); };
    row.appendChild(b); $('#shopBuy').appendChild(row);
  }
  if (!$('#shopBuy').children.length) $('#shopBuy').innerHTML = '<p class="sub">Every upgrade is maxed. Legend.</p>';
  $('#shopTitle').textContent = `Shack — $${S.money} · pack ${cargoText() || 'empty'}`;
  $('#shop').hidden = false;
  $('#hud').hidden = true;
}
$('#shopClose').onclick = () => { $('#shop').hidden = true; enterPlay(); };

/* ---------- health / death ---------- */
function hurt(n) {
  S.hp = Math.max(0, S.hp - n);
  DHaudio.sfx.hurt(); updateHUD(); saveSoon();
  if (S.hp <= 0 && !player.dead) {
    player.dead = true; mode = 'dead'; ach('death');
    const lost = cargoText();
    S.pack = {};
    save();
    toast(lost ? `You blacked out and dropped: ${lost}` : 'You blacked out.');
    setTimeout(() => { respawn(); }, 1200);
  }
}
function respawn() {
  player.dead = false; S.hp = 100;
  player.pos.set(16.5, TOP + 6, 16.5); player.vel.set(0, 0, 0);
  mode = 'play'; save();
}

/* ---------- achievements / toasts ---------- */
function ach(k) {
  if (S.ach[k]) return;
  S.ach[k] = true; DHaudio.sfx.ach();
  toast(`Achievement — ${ACHS[k][0]}`); saveSoon();
}
function toast(msg) {
  const el = document.createElement('div'); el.className = 'toast'; el.textContent = msg;
  $('#toasts').appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

/* ---------- HUD ---------- */
function updateHUD() {
  const depth = Math.max(0, Math.round(TOP + 1 - player.pos.y));
  $('#hudDepth').textContent = depth === 0 ? 'Surface' : `${depth} deep`;
  const packTotal = Object.values(S.pack).reduce((a, b) => a + b, 0);
  $('#hudOre').textContent = cargoText() || 'no ore yet';
  $('#hudMoney').textContent = `$${S.money}`;
  $('#hudPack').textContent = `pack ${packTotal}/${packCap()}`;
  $('#hpFill').style.width = `${S.hp}%`;
  $('#hpFill').style.background = S.hp > 50 ? '#7fae62' : S.hp > 25 ? '#d0a23c' : '#c0563a';
}

/* ---------- simulation ---------- */
let lastSave = 0;
function saveSoon() { save(); lastSave = performance.now(); }
function physics(dt) {
  const speed = 4.6;
  const fwd = new THREE.Vector3(-Math.sin(player.yaw), 0, -Math.cos(player.yaw));
  const right = new THREE.Vector3(fwd.z, 0, -fwd.x);
  const move = new THREE.Vector3();
  if (keys.has('KeyW')) move.add(fwd);
  if (keys.has('KeyS')) move.sub(fwd);
  if (keys.has('KeyA')) move.sub(right);
  if (keys.has('KeyD')) move.add(right);
  if (move.lengthSq() > 0) move.normalize().multiplyScalar(speed * dt);

  /* jetpack */
  if (keys.has('Space') && S.up.jet && player.fuel > 0 && !player.dead) {
    player.vel.y = Math.min(player.vel.y + 14 * dt, 6.5);
    player.fuel -= dt;
    if (Math.random() < dt * 6) DHaudio.sfx.jet();
  }

  /* horizontal move with 1-block step-up */
  const tryPos = (nx, nz) => {
    const r = 0.32;
    for (const [ox, oz] of [[r, r], [-r, r], [r, -r], [-r, -r]]) {
      if (solidAt(nx + ox, player.pos.y + 0.1, nz + oz)) {
        /* try step up */
        let ok = true;
        for (const [ox2, oz2] of [[r, r], [-r, r], [r, -r], [-r, -r]]) {
          if (solidAt(nx + ox2, player.pos.y + 1.15, nz + oz2)) ok = false;
        }
        if (ok) { player.pos.y += 1.02; return true; }
        return false;
      }
    }
    return true;
  };
  if (!tryPos(player.pos.x + move.x, player.pos.z)) { /* blocked */ }
  else { player.pos.x += move.x; }
  if (tryPos(player.pos.x, player.pos.z + move.z)) player.pos.z += move.z;

  /* keep inside plot */
  player.pos.x = clamp(player.pos.x, 0.4, NX - 0.4);
  player.pos.z = clamp(player.pos.z, 0.4, NZ - 0.4);

  /* gravity */
  const g0 = groundAt(player.pos.x, player.pos.z);
  player.vel.y -= 22 * dt;
  let ny = player.pos.y + player.vel.y * dt;
  if (ny <= g0) {
    const fall = g0 - player.pos.y;
    if (fall > 3.5 && !player.dead) {
      const dmg = Math.round((fall - 3) * 11 * fallProt());
      if (dmg > 0) hurt(dmg); else toast('Soft landing.');
    }
    ny = g0; player.vel.y = 0; player.onGround = true;
    player.fuel = Math.min(player.fuel + dt * 1.2, jetFuelMax());
  } else player.onGround = false;
  if (ny > TOP + 30) { ny = TOP + 30; player.vel.y = 0; }
  player.pos.y = ny;
}

let hudT = 0;
function frame(tReq) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (tReq - (frame.last || tReq)) / 1000 || 0.016);
  frame.last = tReq;
  if (mode === 'play') {
    physics(dt); digTick(dt);
    S.playSec += dt; hudT += dt;
    if (hudT > 0.25) { hudT = 0; updateHUD(); }
    if (S.playSec - (frame.savedAt || 0) > 20) { frame.savedAt = S.playSec; save(); }
  }
  const eye = player.pos.clone().add(new THREE.Vector3(0, 0.8, 0));
  camera.position.copy(eye);
  camera.rotation.set(player.pitch, player.yaw, 0, 'YXZ');
  lamp.position.copy(eye);
  lamp.distance = lampR();
  const d = Math.max(1, TOP + 1 - player.pos.y);
  scene.fog.near = lampR() * 0.5; scene.fog.far = clamp(lampR() + d * 0.4, 10, 70);
  renderer.render(scene, camera);
}

/* ---------- menus ---------- */
function resize() {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
}
addEventListener('resize', resize); resize();

function enterPlay() {
  mode = 'play'; $('#hud').hidden = false;
  ['#title', '#pause', '#howto', '#achv', '#settings'].forEach(s => $(s).hidden = true);
  updateHUD(); DHaudio.resume(); DHaudio.startMusic();
}
$('#btnContinue').onclick = () => { if (load()) { rebuildBlocks(); enterPlay(); } };
$('#btnNew').onclick = () => {
  if (hasSave() && !confirm('Start a new mine? Current save is replaced.')) return;
  try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
  Object.assign(S, { money: 0, hp: 100, pack: {}, ach: {}, up: { pick: 1, lamp: 1, pack: 1, jet: 0, boots: 0 }, playSec: 0 });
  for (let i = 0; i < world.top.length; i++) world.top[i] = TOP;
  player.pos.set(16.5, TOP + 1, 16.5); player.vel.set(0, 0, 0);
  rebuildBlocks(); enterPlay();
};
$('#btnHow').onclick = () => { $('#howto').hidden = false; };
$('#btnAch').onclick = () => {
  const ul = $('#achList'); ul.innerHTML = '';
  for (const [k, [name, desc]] of Object.entries(ACHS)) {
    const li = document.createElement('li');
    li.className = S.ach[k] ? '' : 'locked';
    li.innerHTML = `${S.ach[k] ? '★' : '☆'} ${name}<small>${desc}</small>`;
    ul.appendChild(li);
  }
  $('#achv').hidden = false;
};
$('#btnSettings').onclick = () => { $('#settings').hidden = false; syncSettingsUI(); };
$('#btnResume').onclick = enterPlay;
$('#btnSave').onclick = () => { save(); toast('Saved.'); };
$('#btnQuit').onclick = () => { save(); mode = 'title'; $('#pause').hidden = true; $('#title').hidden = false; $('#hud').hidden = true; $('#btnContinue').hidden = !hasSave(); };
document.querySelectorAll('.panel .close').forEach(b => b.onclick = () => b.closest('.overlay').hidden = true);

function syncSettingsUI() {
  $('#vol').value = settings.vol; $('#volVal').textContent = settings.vol + '%';
  $('#sens').value = settings.sens; $('#sensVal').textContent = settings.sens + '%';
  $('#invertY').checked = settings.invertY; $('#musicChk').checked = settings.music;
}
$('#vol').oninput = (e) => { settings.vol = +e.target.value; $('#volVal').textContent = settings.vol + '%'; DHaudio.setVolume(settings.vol / 100); saveSettings(); };
$('#sens').oninput = (e) => { settings.sens = +e.target.value; $('#sensVal').textContent = settings.sens + '%'; saveSettings(); };
$('#invertY').onchange = (e) => { settings.invertY = e.target.checked; saveSettings(); };
$('#musicChk').onchange = (e) => { settings.music = e.target.checked; DHaudio.setMusic(settings.music); saveSettings(); };
DHaudio.setVolume(settings.vol / 100);

addEventListener('keydown', (e) => {
  if (e.code !== 'Escape') return;
  if (mode === 'play') { mode = 'pause'; digReset(); document.exitPointerLock?.(); $('#pause').hidden = false; }
  else if (mode === 'pause') enterPlay();
});

/* ---------- boot ---------- */
$('#btnContinue').hidden = !hasSave();
rebuildBlocks();
updateHUD();
requestAnimationFrame(frame);

/* debug hooks for headless playtests */
window.DH = {
  state: () => ({ mode, money: S.money, hp: S.hp, pack: S.pack, up: { ...S.up }, depth: Math.round(TOP + 1 - player.pos.y), pos: player.pos.toArray(), topSum: world.top.reduce((a, b) => a + b, 0) }),
  dig: (x, z) => { world.top[idx(clamp(x, 0, NX - 1) | 0, clamp(z, 0, NZ - 1) | 0)] = Math.max(0, world.top[idx(x | 0, z | 0)] - 1); rebuildBlocks(); },
  teleport: (x, y, z) => player.pos.set(x, y, z),
  give: (k, n) => { S.pack[k] = (S.pack[k] || 0) + n; updateHUD(); },
  save, load, shop: openShop
};