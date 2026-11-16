import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

const DATA = window.SX_DATA;
const END = DATA.timelineSeconds;
const phone = Math.min(innerWidth, innerHeight) < 820;
const canvas = document.getElementById('view');
const $ = (id) => document.getElementById(id);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: !phone, powerPreference: 'high-performance' });
renderer.setPixelRatio(phone ? 1 : Math.min(1.5, devicePixelRatio || 1));
renderer.setSize(innerWidth, innerHeight, false);
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.toneMapping = THREE.NoToneMapping;
renderer.shadowMap.enabled = !phone;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x1a140f, phone ? 0.006 : 0.004);
scene.background = new THREE.Color(0x121826);
const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.15, 280);

scene.add(new THREE.AmbientLight(0xb7c4de, 0.85));
scene.add(new THREE.HemisphereLight(0x8fb4ff, 0x8a4b28, 0.7));
const key = new THREE.DirectionalLight(0xfff0dc, 2.4);
key.position.set(-24, 48, 18);
if (!phone) {
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 8;
  key.shadow.camera.far = 120;
  key.shadow.camera.left = -50;
  key.shadow.camera.right = 50;
  key.shadow.camera.top = 40;
  key.shadow.camera.bottom = -40;
}
scene.add(key);

function dirtTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = '#7a4b2c';
  g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 5000; i++) {
    const n = (i * 17) % 255;
    g.fillStyle = `rgba(${90 + (n % 70)},${40 + (n % 35)},${18},0.28)`;
    g.fillRect((i * 53) % 512, (i * 97) % 512, 2 + (i % 3), 2);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 6);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
const dirtMap = dirtTexture();
const dirt = new THREE.MeshStandardMaterial({ map: dirtMap, color: 0xe0a06a, roughness: 0.9, metalness: 0.02 });
const groomed = new THREE.MeshStandardMaterial({ map: dirtMap, color: 0xc98448, roughness: 0.82, metalness: 0.04 });
const sandMat = new THREE.MeshStandardMaterial({ color: 0xd7bf86, roughness: 1 });

function ribbon(pts, width) {
  const pos = [];
  const uv = [];
  const idx = [];
  for (let i = 0; i < pts.length; i++) {
    const prev = pts[Math.max(0, i - 1)];
    const next = pts[Math.min(pts.length - 1, i + 1)];
    const tx = next.x - prev.x;
    const tz = next.z - prev.z;
    const len = Math.hypot(tx, tz) || 1;
    const sx = -tz / len;
    const sz = tx / len;
    const half = width * 0.5;
    const lift = Math.min(1.4, Math.abs(next.z - prev.z) * 0.08);
    pos.push(pts[i].x + sx * half, pts[i].y + lift, pts[i].z + sz * half);
    pos.push(pts[i].x - sx * half, pts[i].y, pts[i].z - sz * half);
    uv.push(0, i / 6, 1, i / 6);
    if (i) {
      const a = (i - 1) * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, groomed);
  mesh.receiveShadow = true;
  return mesh;
}

const straight = [];
for (let i = 0; i <= 28; i++) straight.push(new THREE.Vector3(-34 + i * 1.55, 0.04, 0));
for (let i = 1; i <= 18; i++) {
  const a = (i / 18) * Math.PI * 0.55;
  straight.push(new THREE.Vector3(9.4 + Math.sin(a) * 16, 0.08 + Math.sin(a) * 0.55, -((1 - Math.cos(a)) * 18)));
}
scene.add(ribbon(straight, 15));

const floor = new THREE.Mesh(new THREE.CircleGeometry(78, 48), dirt);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);
const bowl = new THREE.Mesh(
  new THREE.CylinderGeometry(62, 74, 22, 40, 1, true),
  new THREE.MeshStandardMaterial({ color: 0x10141c, side: THREE.BackSide, roughness: 0.95 })
);
bowl.position.y = 8;
scene.add(bowl);

function box(w, h, d, mat, x, y, z, rx) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  if (rx) m.rotation.z = rx;
  m.castShadow = m.receiveShadow = !phone;
  scene.add(m);
  return m;
}
const block = new THREE.MeshStandardMaterial({ color: 0xf2f2f2, roughness: 0.6 });
const blockRed = new THREE.MeshStandardMaterial({ color: 0xd23a2a, roughness: 0.55 });
for (let i = 0; i < 22; i++) {
  const x = -30 + i * 1.7;
  box(0.45, 0.35, 0.7, i % 2 ? block : blockRed, x, 0.2, 7.6);
  box(0.45, 0.35, 0.7, i % 2 ? blockRed : block, x, 0.2, -7.6);
}
for (let lane = 0; lane < 2; lane++) {
  for (let j = 0; j < 3; j++) {
    const x = -2 - j * 7;
    const z = -22 - lane * 8;
    box(4.2, 0.15, 2.4, groomed, x, 0.45, z, 0.08);
    box(3.2, 0.9, 2.2, groomed, x - 0.4, 0.45, z);
  }
}
for (let i = 0; i < 8; i++) {
  const mound = new THREE.Mesh(new THREE.SphereGeometry(1.15, 10, 8), groomed);
  mound.scale.y = 0.38;
  mound.position.set(-30, 0.25, -6 + i * 1.7);
  scene.add(mound);
}
const sand = new THREE.Mesh(new THREE.CircleGeometry(9, 20), sandMat);
sand.rotation.x = -Math.PI / 2;
sand.position.set(22, 0.03, 10);
scene.add(sand);
const bridgeMat = new THREE.MeshStandardMaterial({ color: 0x6e645c, roughness: 0.7 });
box(10, 0.35, 3.2, bridgeMat, 16, 2.4, -6);
box(0.4, 2.2, 3.2, bridgeMat, 12, 1.2, -6);
box(0.4, 2.2, 3.2, bridgeMat, 20, 1.2, -6);
const banner = new THREE.Mesh(new THREE.PlaneGeometry(8, 1.2), new THREE.MeshBasicMaterial({ color: 0xfff6e8, side: THREE.DoubleSide }));
banner.position.set(-6, 3.2, 14);
scene.add(banner);

function stand(angle, length) {
  const g = new THREE.Group();
  const shell = new THREE.Mesh(new THREE.BoxGeometry(length, 7, 6), new THREE.MeshStandardMaterial({ color: 0x1a2030, roughness: 0.8 }));
  shell.position.y = 4.2;
  g.add(shell);
  const lip = new THREE.Mesh(new THREE.BoxGeometry(length, 0.4, 6.4), new THREE.MeshStandardMaterial({ color: 0xc5ccd6 }));
  lip.position.y = 7.6;
  g.add(lip);
  g.position.set(Math.cos(angle) * 52, 0, Math.sin(angle) * 46);
  g.lookAt(0, 3, 0);
  scene.add(g);
}
for (let i = 0; i < 8; i++) stand((i / 8) * Math.PI * 2 + 0.2, 16);

const crowdGeo = new THREE.BoxGeometry(0.38, 0.85, 0.28);
const crowdMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 });
const crowdCount = phone ? 220 : 520;
const crowd = new THREE.InstancedMesh(crowdGeo, crowdMat, crowdCount);
const dummy = new THREE.Object3D();
const colors = [0xff4d1c, 0xf4efe6, 0x3ad1ff, 0xffc14a, 0x7d8cff, 0x222833];
const colorAttr = new THREE.InstancedBufferAttribute(new Float32Array(crowdCount * 3), 3);
for (let i = 0; i < crowdCount; i++) {
  const a = (i * 0.37) % (Math.PI * 2);
  const row = i % (phone ? 4 : 6);
  const r = 49 + row * 1.15;
  dummy.position.set(Math.cos(a) * r, 2.4 + row * 0.72, Math.sin(a) * r * 0.9);
  dummy.lookAt(0, 2, 0);
  dummy.updateMatrix();
  crowd.setMatrixAt(i, dummy.matrix);
  const col = new THREE.Color(colors[i % colors.length]);
  colorAttr.setXYZ(i, col.r, col.g, col.b);
}
crowd.instanceColor = colorAttr;
scene.add(crowd);

function lamp(x, z) {
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 14, 8), new THREE.MeshStandardMaterial({ color: 0x22262e, metalness: 0.6, roughness: 0.35 }));
  pole.position.set(x, 7, z);
  scene.add(pole);
  const head = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.35, 0.6), new THREE.MeshStandardMaterial({ color: 0xfff1c9, emissive: 0xfff1c9, emissiveIntensity: 2.4 }));
  head.position.set(x, 14.1, z);
  scene.add(head);
  const spot = new THREE.SpotLight(0xfff4dd, phone ? 30 : 60, 90, 0.7, 0.4, 1);
  spot.position.set(x, 13.6, z);
  spot.target.position.set(0, 0, 0);
  scene.add(spot, spot.target);
  const flareTex = flareTexture();
  const flare = new THREE.Sprite(new THREE.SpriteMaterial({ map: flareTex, color: 0xfff6d8, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  flare.position.set(x, 14.2, z);
  flare.scale.set(7, 1.4, 1);
  scene.add(flare);
}
const flareCanvas = document.createElement('canvas');
flareCanvas.width = 128;
flareCanvas.height = 32;
{
  const g = flareCanvas.getContext('2d');
  const grd = g.createLinearGradient(0, 0, 128, 0);
  grd.addColorStop(0, 'rgba(255,255,255,0)');
  grd.addColorStop(0.5, 'rgba(255,244,210,0.95)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 8, 128, 16);
}
function flareTexture() {
  const tex = new THREE.CanvasTexture(flareCanvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
[[-40, 30], [40, 32], [48, -10], [-46, -18], [10, -40], [-8, 40], [30, 18], [-20, -36]].forEach(([x, z]) => lamp(x, z));

const beamMat = new THREE.MeshBasicMaterial({ color: 0x9ad8ff, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide });
for (let i = 0; i < (phone ? 4 : 8); i++) {
  const beam = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 36), beamMat);
  const a = (i / 8) * Math.PI * 2;
  beam.position.set(Math.cos(a) * 20, 16, Math.sin(a) * 16);
  beam.lookAt(0, 4, 0);
  scene.add(beam);
}

function soft(color) {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 2, 32, 32, 30);
  grd.addColorStop(0, color);
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
const flameMap = soft('rgba(255,170,60,0.95)');
const smokeMap = soft('rgba(180,180,180,0.45)');
const pyro = [];
[[-18, 8], [-18, -8], [-8, 14], [4, -12], [2, 16]].forEach(([x, z], i) => {
  const jet = new THREE.Sprite(new THREE.SpriteMaterial({ map: flameMap, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, color: i % 2 ? 0xfff1c4 : 0xff6a2a }));
  jet.position.set(x, 1.2, z);
  scene.add(jet);
  pyro.push(jet);
});
const smokes = [];
for (let i = 0; i < (phone ? 12 : 28); i++) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: smokeMap, transparent: true, depthWrite: false, opacity: 0.35 }));
  s.position.set(-20 + (i % 7), 0.4, ((i % 5) - 2));
  s.scale.set(1.2, 1.2, 1);
  scene.add(s);
  smokes.push(s);
}
const sparks = [];
for (let i = 0; i < (phone ? 20 : 48); i++) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: flameMap, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  s.visible = false;
  scene.add(s);
  sparks.push({ sprite: s, seed: i });
}

const gate = new THREE.Group();
scene.add(gate);
const steel = new THREE.MeshStandardMaterial({ color: 0xd5d8de, metalness: 0.75, roughness: 0.28 });
const rail = new THREE.Mesh(new THREE.BoxGeometry(14, 0.18, 0.18), steel);
rail.position.set(-22, 1.35, 0);
gate.add(rail);
const bars = [];
for (let i = 0; i < 12; i++) {
  const z = -5.4 + i * 0.98;
  const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.3, 0.12), steel);
  post.position.set(-22, 0.65, z);
  gate.add(post);
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 0.08), steel);
  bar.position.set(-21.6, 0.95, z);
  bar.geometry.translate(0.45, 0, 0);
  gate.add(bar);
  bars.push(bar);
}

const plastics = [0xff3b1f, 0x1d6bff, 0xf4f4f4, 0xffc14a, 0x19b37a, 0xc01528, 0x222222, 0x7a4bff];
const bikes = [];
function makeBike(i) {
  const g = new THREE.Group();
  const body = new THREE.MeshStandardMaterial({ color: plastics[i % plastics.length], roughness: 0.45, metalness: 0.15 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.7 });
  const tank = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.28, 0.28), body);
  tank.position.set(0.05, 0.72, 0);
  g.add(tank);
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.1, 0.22), dark);
  seat.position.set(-0.25, 0.78, 0);
  g.add(seat);
  const wheelGeo = new THREE.TorusGeometry(0.28, 0.06, 8, 14);
  const front = new THREE.Mesh(wheelGeo, dark);
  front.position.set(0.62, 0.28, 0);
  front.rotation.y = Math.PI / 2;
  const rear = front.clone();
  rear.position.x = -0.48;
  g.add(front, rear);
  const rider = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.42, 4, 8), new THREE.MeshStandardMaterial({ color: i % 3 ? 0xf2f2f2 : 0xffb020, roughness: 0.6 }));
  rider.position.set(-0.05, 1.15, 0);
  rider.rotation.z = 0.5;
  g.add(rider);
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), new THREE.MeshStandardMaterial({ color: plastics[(i + 3) % plastics.length], roughness: 0.3 }));
  helmet.position.set(0.12, 1.42, 0);
  g.add(helmet);
  g.scale.setScalar(2.1);
  g.traverse((obj) => { obj.castShadow = !phone; });
  scene.add(g);
  bikes.push({ group: g, lane: -5.2 + i * 0.95, delay: i * 0.012 });
}
for (let i = 0; i < 12; i++) makeBike(i);

function figure(color) {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.6 });
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.45, 4, 8), mat);
  torso.position.y = 1.05;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), new THREE.MeshStandardMaterial({ color: 0xf0c7a4 }));
  head.position.y = 1.55;
  const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.35, 3, 6), mat);
  arm.position.set(0.28, 1.25, 0);
  const pom = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), new THREE.MeshStandardMaterial({ color: 0xfff6d8 }));
  pom.position.set(0.28, 1.55, 0);
  g.add(torso, head, arm, pom);
  return g;
}
const cheer = [];
for (let i = 0; i < 8; i++) {
  const person = figure(i % 2 ? 0xff4d1c : 0xf6f1e7);
  person.position.set(-4 + (i % 4) * 0.7, 0.4, 11.5 + Math.floor(i / 4) * 0.7);
  scene.add(person);
  cheer.push(person);
}
const podium = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.4, 2.2), new THREE.MeshStandardMaterial({ color: 0x2a3142 }));
podium.position.set(-3, 0.2, 12);
scene.add(podium);

const boardCanvas = document.createElement('canvas');
boardCanvas.width = boardCanvas.height = 256;
const boardTex = new THREE.CanvasTexture(boardCanvas);
boardTex.colorSpace = THREE.SRGBColorSpace;
function paintBoard(label) {
  const g = boardCanvas.getContext('2d');
  g.fillStyle = '#f7f4ee';
  g.fillRect(0, 0, 256, 256);
  g.fillStyle = '#161616';
  g.font = '900 120px sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(label, 128, 136);
  boardTex.needsUpdate = true;
}
paintBoard('30');
const board = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), new THREE.MeshBasicMaterial({ map: boardTex }));
const official = figure(0xfff6e8);
official.position.set(-20.5, 0, 6.4);
official.add(board);
board.position.set(0.15, 1.7, 0.2);
scene.add(official);

const pits = new THREE.Group();
scene.add(pits);
for (let i = 0; i < 4; i++) {
  const tent = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.6, 2), new THREE.MeshStandardMaterial({ color: i % 2 ? 0xff4d1c : 0x1d6bff, roughness: 0.7 }));
  tent.position.set(-40, 0.8, 8 + i * 2.6);
  pits.add(tent);
  const mech = figure(0x22262e);
  mech.position.set(-37.5, 0, 8 + i * 2.6);
  pits.add(mech);
}

function bezier(a, b, c, d, u, target) {
  const k = 1 - u;
  target.set(0, 0, 0);
  target.addScaledVector(a, k * k * k);
  target.addScaledVector(b, 3 * k * k * u);
  target.addScaledVector(c, 3 * k * u * u);
  target.addScaledVector(d, u * u * u);
  return target;
}
const pA = new THREE.Vector3();
const pB = new THREE.Vector3();
const pC = new THREE.Vector3();
const pD = new THREE.Vector3();
const point = new THREE.Vector3();
const ahead = new THREE.Vector3();

function launchU(t, delay) {
  if (t < 74) return 0;
  const local = t - 74 - delay * 40;
  if (local <= 0) return 0;
  if (local < 8) return local * 0.04;
  return Math.min(1, 0.32 + (local - 8) * 0.05);
}

const GradeShader = {
  uniforms: { tDiffuse: { value: null }, time: { value: 0 }, grain: { value: phone ? 0.04 : 0.07 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float grain;
    varying vec2 vUv;
    vec3 aces(vec3 x){ return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14), 0.0, 1.0); }
    void main(){
      vec4 tex = texture2D(tDiffuse, vUv);
      vec3 col = aces(tex.rgb);
      col = mix(vec3(dot(col, vec3(0.299,0.587,0.114))), col, 1.18);
      col = vec3(col.r * 1.05, col.g * 0.98, col.b * 0.92);
      float n = fract(sin(dot(vUv * vec2(180.0, 90.0) + time, vec2(12.9898,78.233))) * 43758.5453);
      col += (n - 0.5) * grain;
      float v = smoothstep(0.35, 0.95, length(vUv - 0.5));
      col *= mix(1.0, 0.82, v);
      if (vUv.y < 0.08 || vUv.y > 0.92) col = vec3(0.0);
      gl_FragColor = vec4(pow(max(col, 0.0), vec3(0.4545)), 1.0);
    }
  `
};

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
let bokeh = null;
let after = null;
if (!phone) {
  bokeh = new BokehPass(scene, camera, { focus: 12, aperture: 0.00012, maxblur: 0.012 });
  composer.addPass(bokeh);
}
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), phone ? 0.28 : 0.4, 0.35, 0.86);
composer.addPass(bloom);
if (!phone) {
  after = new AfterimagePass(0.82);
  composer.addPass(after);
}
const grade = new ShaderPass(GradeShader);
composer.addPass(grade);

const keys = [
  { t: 0, pos: [0, 42, 62], look: [0, 2, 0], fov: 48, focus: 40, shake: 0 },
  { t: 16, pos: [28, 16, 24], look: [-4, 2, 8], fov: 38, focus: 18, shake: 0 },
  { t: 28, pos: [-36, 2.2, 14], look: [-39, 1.2, 12], fov: 36, focus: 6, shake: 0 },
  { t: 40, pos: [-14, 2.4, 9], look: [-22, 1.1, 0], fov: 32, focus: 8, shake: 0.01 },
  { t: 52, pos: [-19.2, 2.05, 5.2], look: [-20.4, 1.7, 6.5], fov: 28, focus: 2.4, shake: 0 },
  { t: 64, pos: [-14, 4.5, 12], look: [-18, 1.6, 2], fov: 38, focus: 8, shake: 0.06 },
  { t: 74, pos: [-30, 2.6, 7], look: [-18, 1.1, 0], fov: 36, focus: 8, shake: 0.08 },
  { t: 86, pos: [-10, 2.2, 6], look: [6, 1.2, -8], fov: 42, focus: 9, shake: 0.05 },
  { t: 104, pos: [6, 18, 22], look: [0, 4, -4], fov: 50, focus: 24, shake: 0.02 },
  { t: 114, pos: [0, 28, 40], look: [0, 3, 0], fov: 46, focus: 30, shake: 0 }
];

function lerp(a, b, u) { return a + (b - a) * u; }
function smooth(u) { return u * u * (3 - 2 * u); }
function sampleCam(t) {
  let i = 0;
  while (i < keys.length - 2 && t > keys[i + 1].t) i++;
  const a = keys[i];
  const b = keys[Math.min(keys.length - 1, i + 1)];
  const u = smooth(Math.min(1, Math.max(0, (t - a.t) / Math.max(0.001, b.t - a.t))));
  return {
    pos: a.pos.map((v, n) => lerp(v, b.pos[n], u)),
    look: a.look.map((v, n) => lerp(v, b.look[n], u)),
    fov: lerp(a.fov, b.fov, u),
    focus: lerp(a.focus, b.focus, u),
    shake: lerp(a.shake, b.shake, u)
  };
}

const lowerBeats = [
  [0, 'ANGEL STADIUM', 'Saturday night in Anaheim'],
  [16, 'THE BOWL', 'They already know the words'],
  [28, 'PITS', 'Helmets on. Nobody is chatting.'],
  [40, 'THE LINE', 'Twelve generic bikes. One rut.'],
  [52, 'THIRTY SECONDS', 'Then the board goes sideways'],
  [64, 'LIGHT IT', 'Flames, then the drop'],
  [74, 'GATE', 'This is the holeshot'],
  [86, 'TURN ONE', 'Left-hander. Elbows in.'],
  [104, 'THE NIGHT', 'Hold that thought']
];

let cinematic = 0;
let playing = false;
let audio = null;
let muted = false;

function paintBoardFor(t) {
  paintBoard(t < 58 ? '30' : t < 64 ? '5' : '');
  const spin = t < 52 ? 0 : t < 64 ? Math.min(1.15, (t - 56) * 0.4) : 1.2;
  board.rotation.z = spin;
}

function updateWorld(t) {
  const cam = sampleCam(Math.min(t, END));
  const shake = cam.shake * Math.sin(t * 48);
  camera.position.set(cam.pos[0] + shake, cam.pos[1] + shake * 0.4, cam.pos[2]);
  camera.lookAt(cam.look[0], cam.look[1], cam.look[2]);
  camera.fov = cam.fov;
  camera.updateProjectionMatrix();
  if (bokeh) {
    bokeh.uniforms.focus.value = cam.focus;
    bokeh.uniforms.aperture.value = t > 50 && t < 66 ? 0.00022 : 0.0001;
  }
  grade.uniforms.time.value = t;
  bars.forEach((bar, i) => {
    const drop = t >= 74 && t < 76;
    bar.rotation.x = drop ? -1.15 : (t >= 76 ? -1.25 : 0);
  });
  paintBoardFor(t);
  bikes.forEach((bike) => {
    const u = launchU(t, bike.delay);
    const z = bike.lane;
    pA.set(-22, 0.2, z);
    pB.set(-6, 0.35, z * 0.7);
    pC.set(8, 1.1, z * 0.15 - 2);
    pD.set(6, 0.45, -15 - z * 0.08);
    bezier(pA, pB, pC, pD, u, point);
    bezier(pA, pB, pC, pD, Math.min(0.98, u + 0.05), ahead);
    if (ahead.distanceToSquared(point) < 0.04) ahead.copy(point).add(new THREE.Vector3(1, 0, 0));
    const hop = u > 0.28 && u < 0.48 ? Math.sin((u - 0.28) / 0.2 * Math.PI) * 0.85 : 0;
    bike.group.position.copy(point);
    bike.group.position.y += hop;
    bike.group.lookAt(ahead.x, point.y + hop, ahead.z);
  });
  pyro.forEach((jet, i) => {
    const burst = (t > 64 && t < 78) || t > 104 ? 3.4 : 1.1;
    const s = (1.2 + Math.sin(t * 18 + i) * 0.45) * burst;
    jet.scale.set(s, s * 1.8, 1);
    jet.material.opacity = t > 20 ? 0.9 : 0.25;
  });
  smokes.forEach((puff, i) => {
    const moving = t > 76;
    puff.position.x = -18 + (i % 8) * 1.4 + (moving ? ((t * 3 + i) % 12) : 0);
    puff.position.y = 0.5 + ((t * 0.3 + i) % 2);
    puff.material.opacity = moving ? 0.34 : 0.05;
  });
  sparks.forEach((item) => {
    const show = t > 100;
    item.sprite.visible = show;
    if (!show) return;
    const age = (t - 100 + item.seed * 0.17) % 2.4;
    const a = item.seed * 0.7;
    item.sprite.position.set(Math.cos(a) * 8 + Math.sin(age * 4 + item.seed), 8 + age * 10 - age * age * 2.2, Math.sin(a) * 8);
    item.sprite.scale.setScalar(0.4 + age);
    item.sprite.material.opacity = Math.max(0, 1 - age / 2.4);
  });
  cheer.forEach((person, i) => {
    person.rotation.z = Math.sin(t * 6 + i) * 0.08;
    person.position.y = 0.4 + Math.abs(Math.sin(t * 6 + i)) * 0.12;
  });
  const beat = lowerBeats.filter((row) => t >= row[0]).pop();
  const lower = $('lower');
  const card = $('titlecard');
  if (t >= 114) {
    lower.hidden = true;
    card.hidden = false;
  } else if (playing || t > 0) {
    card.hidden = true;
    lower.hidden = false;
    $('lower-k').textContent = beat[1];
    $('lower-l').textContent = beat[2];
  }
}

function resize() {
  const w = innerWidth;
  const h = innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);
  composer.setSize(w, h);
}
addEventListener('resize', resize);

let audioOn = false;
function startScore() {
  if (audio) return;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  const ctx = new Ctx();
  const master = ctx.createGain();
  master.gain.value = 0.9;
  master.connect(ctx.destination);
  const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = noiseBuf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const crowdSrc = ctx.createBufferSource();
  crowdSrc.buffer = noiseBuf;
  crowdSrc.loop = true;
  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 900;
  const crowdGain = ctx.createGain();
  crowdGain.gain.value = 0.07;
  crowdSrc.connect(band).connect(crowdGain).connect(master);
  crowdSrc.start();
  const bpm = 132;
  const step = 60 / bpm / 2;
  let next = ctx.currentTime + 0.06;
  function hit(time, freq, dur, type, gainValue) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);
    if (type === 'sine') osc.frequency.exponentialRampToValueAtTime(48, time + dur);
    gain.gain.setValueAtTime(gainValue, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
    osc.connect(gain).connect(master);
    osc.start(time);
    osc.stop(time + dur + 0.02);
  }
  function noiseHit(time, dur, gainValue, freq) {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(gainValue, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
    src.connect(filter).connect(gain).connect(master);
    src.start(time);
    src.stop(time + dur);
  }
  const roots = [65.4, 98, 87.3, 73.4];
  const timer = setInterval(() => {
    if (!playing) return;
    while (next < ctx.currentTime + 0.2) {
      const index = Math.floor(next / step);
      if (index % 2 === 0) hit(next, 150, 0.12, 'sine', 0.45);
      if (index % 4 === 2) noiseHit(next, 0.12, 0.18, 1800);
      if (index % 2 === 1) noiseHit(next, 0.04, 0.05, 6000);
      if (index % 4 === 0) hit(next, roots[(Math.floor(index / 8)) % roots.length], 0.22, 'sawtooth', 0.08);
      next += step;
    }
  }, 60);
  audio = { ctx, master, timer, crowdSrc };
}
function applyMute() {
  if (!audio) return;
  audio.master.gain.value = muted ? 0 : 0.9;
}

function render() {
  try {
    composer.render();
  } catch (err) {
    renderer.render(scene, camera);
    if (!render.warned) {
      console.error(err);
      render.warned = true;
    }
  }
}

let last = 0;
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000 || 0);
  last = now;
  if (playing && cinematic < END) cinematic += dt;
  updateWorld(cinematic);
  render();
  if (playing && cinematic >= END) openPanel(true);
  requestAnimationFrame(frame);
}

const tabs = $('tabs');
const sheet = $('sheet');
let current = DATA.series[0].id;
function scoreOf(series, rider) {
  let acc = 0;
  let weight = 0;
  series.weights.forEach((factor, i) => {
    acc += factor.weight * rider.scores[i];
    weight += factor.weight;
  });
  return Math.round((acc / weight) * 10) / 10;
}
function countdown(iso) {
  const ms = new Date(iso).getTime() - Date.now();
  if (Number.isNaN(ms)) return 'Time not available.';
  if (ms <= 0) return 'That marker has passed.';
  const total = Math.floor(ms / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const mins = Math.floor((total % 3600) / 60);
  return days + 'd ' + hours + 'h ' + mins + 'm';
}
function drawSheet() {
  const series = DATA.series.find((item) => item.id === current);
  const rows = series.riders.map((rider) => ({ rider, score: scoreOf(series, rider) })).sort((a, b) => b.score - a.score);
  sheet.innerHTML = `
    <p class="kicker">${series.kicker}</p>
    <div class="block"><h3>${series.title}</h3><p>As of ${DATA.asOf}. Results below are from the linked pages. Anything marked opinion is not a result.</p></div>
    <div class="block"><h3>Recent</h3><p><strong>${series.recentTitle}</strong></p><p>${series.recentNote}</p>
      ${series.results.map((row) => `<div class="result"><b>${row.pos}</b><div>${row.name}<br><span>${row.detail}</span></div></div>`).join('')}
      <p>${series.season}</p></div>
    <div class="block"><h3>Next</h3><p><strong>${series.next.name}</strong><br>${series.next.when}<br>${series.next.venue}</p>
      <div class="clock" data-iso="${series.next.iso}">${countdown(series.next.iso)}</div>
      <p>${series.next.clockNote}</p></div>
    <div class="block"><h3>Watch from Australia</h3><p>${series.watch}</p></div>
    <div class="block opinion"><h3>${series.cheerTitle}</h3><p>${series.cheer}</p></div>
    <div class="block opinion"><h3>${series.outlookTitle}</h3><p>${series.outlook}</p></div>
    <div class="block"><h3>Weighting</h3>
      <table><thead><tr><th>Factor</th><th>Weight</th><th></th></tr></thead><tbody>
      ${series.weights.map((factor) => `<tr><td>${factor.factor}</td><td>${factor.weight}</td><td>${factor.note}</td></tr>`).join('')}
      </tbody></table>
      <table><thead><tr><th>Rider</th><th>Opinion index</th><th>Why this number</th></tr></thead><tbody>
      ${rows.map(({ rider, score }) => `<tr><td>${rider.name}${rider.cheer ? '<span class="cheer">CHEER</span>' : ''}</td><td>${score}</td><td>${rider.why}</td></tr>`).join('')}
      </tbody></table>
      <p>The index is the weighted average of the 0–10 notes in this file. It is an opinion. It is not a result, a ranking from a series, or anything you can put money on.</p>
      ${series.also ? `<p>${series.also}</p>` : ''}
    </div>
    <div class="block"><h3>Sources</h3><ul>${series.sources.map((source) => `<li><a href="${source.url}" target="_blank" rel="noreferrer">${source.title}</a></li>`).join('')}</ul>
      <p>Track model sources: ${DATA.track.sources.map((source) => `<a href="${source.url}" target="_blank" rel="noreferrer">${source.title}</a>`).join(' · ')}</p>
      <p>Pictures: none shipped. Music: original Web Audio drums, bass and crowd noise written for this page. 3D engine: three.js, MIT, vendored in this folder.</p>
    </div>`;
}
function drawTabs() {
  tabs.innerHTML = '';
  DATA.series.forEach((series) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('role', 'tab');
    btn.dataset.tab = series.id;
    btn.textContent = series.label;
    btn.setAttribute('aria-selected', String(series.id === current));
    btn.onclick = () => { current = series.id; drawTabs(); drawSheet(); };
    tabs.appendChild(btn);
  });
}
$('asof').textContent = DATA.asOf;
drawTabs();
drawSheet();
setInterval(() => {
  document.querySelectorAll('.clock').forEach((node) => { node.textContent = countdown(node.dataset.iso); });
}, 30000);

function openPanel(open) {
  const panel = $('panel');
  panel.classList.toggle('shown', open);
  panel.style.transform = open ? 'none' : '';
  $('races').setAttribute('aria-expanded', String(open));
}
$('races').onclick = () => openPanel(!$('panel').classList.contains('open'));
$('close-panel').onclick = () => openPanel(false);

function begin() {
  $('splash').hidden = true;
  playing = true;
  if (cinematic >= END) cinematic = 0;
  startScore();
  if (audio) audio.ctx.resume();
  applyMute();
}
$('play').onclick = begin;
$('replay').onclick = () => { cinematic = 0; $('titlecard').hidden = true; begin(); };
$('skip').onclick = () => { cinematic = END; playing = true; $('splash').hidden = true; updateWorld(cinematic); openPanel(true); };
$('mute').onclick = () => {
  muted = !muted;
  $('mute').setAttribute('aria-pressed', String(muted));
  $('mute').textContent = muted ? 'Sound off' : 'Sound on';
  if (!audio) startScore();
  applyMute();
};

window.SXDemo = {
  timeline: END,
  seek(t) { cinematic = t; playing = false; $('splash').hidden = true; updateWorld(t); render(); },
  play: begin,
  openPanel,
  showTab(id) { current = id; drawTabs(); drawSheet(); },
  get time() { return cinematic; }
};

updateWorld(0);
resize();
requestAnimationFrame(frame);
