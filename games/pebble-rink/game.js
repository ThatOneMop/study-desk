'use strict';
const E = PebbleRink, $ = id => document.getElementById(id), ctx = $('rink').getContext('2d');
// The engine samples every three 60 Hz simulation ticks. Playback follows time,
// not the number of requestAnimationFrame callbacks (which varies by display).
const FRAME_MS = 50;
let state = E.create(), paused = false, blocked = false, pending = null;
let forecasting = false, forecast = null;
let frames = [], frame = 0, elapsed = 0, lastTime = null, replaying = false;
try { const raw = localStorage.getItem(E.KEY); if (raw) state = E.decode(raw); } catch { blocked = true; }
const busy = () => paused || frames.length > 0 || $('guide').open || $('confirm').open;
function btn(t, f) { const b = document.createElement('button'); b.textContent = t; b.onclick = f; return b; }
function save() {
  if (blocked) { $('save').textContent = 'Unreadable save preserved until confirmed recovery.'; return; }
  try { localStorage.setItem(E.KEY, JSON.stringify(state)); $('save').textContent = 'Shot journal saved on this device.'; }
  catch { $('save').textContent = 'Storage unavailable; this session is temporary.'; }
}
function sync() { for (const k of ['angle', 'power', 'spin']) $(k).value = state.setup[k]; }
function ask(t, f) { pending = f; lastTime = null; $('question').textContent = t; $('confirm').showModal(); render(); }
function clearFilm() { frames = []; frame = 0; elapsed = 0; lastTime = null; replaying = false; }
function startFilm(film, replay = false) {
  frames = film; frame = 0; elapsed = 0; lastTime = null; replaying = replay; render();
}
function draw(stones) {
  ctx.fillStyle = '#c9e6df'; ctx.fillRect(0, 0, 640, 400);
  ctx.strokeStyle = '#a7cfc9'; ctx.lineWidth = 1;
  for (let x = 0; x < 640; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 400); ctx.stroke(); }
  for (const [r, c] of [[82, '#45777f'], [50, '#e9e2bb'], [23, '#bf775d']]) {
    ctx.beginPath(); ctx.arc(500, 200, r, 0, Math.PI * 2); ctx.fillStyle = c; ctx.fill();
  }
  ctx.strokeStyle = '#729d9a'; ctx.lineWidth = 10; ctx.strokeRect(5, 5, 630, 390);
  for (const [x, y, r] of E.COURSES[state.level].bumpers) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = '#5d7770'; ctx.fill();
    ctx.strokeStyle = '#9eafa0'; ctx.lineWidth = 4; ctx.stroke();
  }
  if (!frames.length && E.run(state).phase === 'aiming') {
    const a = state.setup.angle * Math.PI / 180; ctx.beginPath(); ctx.moveTo(65, 200);
    ctx.lineTo(65 + Math.cos(a) * state.setup.power * 2, 200 + Math.sin(a) * state.setup.power * 2);
    ctx.strokeStyle = '#365e71'; ctx.lineWidth = 3; ctx.setLineDash([8, 6]); ctx.stroke(); ctx.setLineDash([]);
  }
  if (forecast && !frames.length) {
    forecast.stones.forEach((p, i) => {
      ctx.strokeStyle = ['#93432f', '#8a6412', '#314d89'][i]; ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]); ctx.beginPath();
      forecast.frames.forEach((f, n) => { if (n === 0) ctx.moveTo(f[i].x, f[i].y); else ctx.lineTo(f[i].x, f[i].y); });
      ctx.stroke(); ctx.beginPath(); ctx.arc(p.x, p.y, 14, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    });
  }
  stones.forEach((p, i) => {
    ctx.beginPath(); ctx.arc(p.x, p.y, 10, 0, Math.PI * 2); ctx.fillStyle = ['#bc634d', '#e3b34f', '#4964a1'][i]; ctx.fill();
    ctx.strokeStyle = '#fff4d6'; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = '#fff'; ctx.font = 'bold 11px system-ui';
    ctx.textAlign = 'center'; ctx.fillText(i + 1, p.x, p.y + 4);
  });
}
function render() {
  const r = E.run(state);
  forecast = forecasting && !frames.length && r.phase === 'aiming' ? E.simulate(r.stones, state.setup, state.level, true) : null;
  $('forecast').disabled = busy() || r.phase !== 'aiming';
  $('forecast').setAttribute('aria-pressed', String(forecasting));
  $('forecast').textContent = forecasting ? 'Hide shot forecast' : 'Forecast this shot';
  $('forecast-note').textContent = forecast
    ? 'Forecast only · total ' + r.score + ' → ' + E.score(forecast.stones) + '. ' + forecast.stones.map((p,i) => 'Stone ' + (i+1) + ': ' + (r.stones[i] ? E.points(r.stones[i]) : 0) + ' → ' + E.points(p) + ' points').join(' · ') + '. Dashed paths and hollow circles are predicted; solid stones stay saved. Adjust angle, weight or curl to compare. Release commits the shot.'
    : 'Optional forecast shows curl, bank rebounds and displaced stones without spending a shot.';
  $('title').textContent = E.COURSES[state.level].name;
  $('status').textContent = paused ? 'Paused.' : frames.length ? (replaying ? 'Replay · your saved end is unchanged.' : 'Stone in motion…')
    : r.phase === 'won' ? 'Club card earned! ' + r.score + ' points.'
    : r.phase === 'lost' ? 'End finished: ' + r.score + ' points. Undo or retry to reach ' + E.COURSES[state.level].goal + '.'
    : (3 - state.shots.length) + ' stones left · ' + r.score + ' points · target ' + E.COURSES[state.level].goal;
  $('throw').disabled = busy() || r.phase !== 'aiming';
  $('undo').disabled = $('review').disabled = busy() || !state.shots.length;
  $('pause').textContent = paused ? 'Resume' : 'Pause';
  for (const k of ['angle', 'power', 'spin']) $(k).disabled = busy();
  $('angle-value').textContent = state.setup.angle + '°'; $('power-value').textContent = state.setup.power;
  const focusedCourse = [...$('courses').children].indexOf(document.activeElement);
  $('courses').replaceChildren(...E.COURSES.map((c, i) => {
    const b = btn(c.name, () => ask('Change rink? Current stones reset; club cards stay.', () => go(i)));
    b.disabled = i > E.unlocked(state) || frames.length > 0; b.setAttribute('aria-current', String(i === state.level)); return b;
  }));
  if (focusedCourse >= 0) $('courses').children[focusedCourse]?.focus();
  $('records').replaceChildren(...E.COURSES.map((c, i) => {
    const p = document.createElement('p'); p.textContent = c.name + ': ' + (state.records[i] === null ? 'unearned' : state.records[i] + ' points'); return p;
  }));
  $('stones').textContent = frames.length ? 'Positions update when the shot settles.' : r.stones.map((p, i) => 'Stone ' + (i + 1) + ': ' + E.points(p) + ' points').join(' · ');
  const review = !frames.length && E.review(state);
  $('last-shot').textContent = review ? `Last release: ${review.shot.angle}° · weight ${review.shot.power} · ${['left curl', 'straight', 'right curl'][review.shot.spin + 1]}. Total ${review.scoreBefore} → ${review.scoreAfter}.` : '';
  $('shot-changes').replaceChildren(...(review ? review.changes.map(c => {
    const li = document.createElement('li'), delta = c.after - c.before;
    li.textContent = `Stone ${c.stone}: ${c.before} → ${c.after} points (${delta > 0 ? '+' : ''}${delta}).`; return li;
  }) : []));
  $('recover').hidden = !blocked; draw(frames.length ? frames[frame] : r.stones);
}
function go(a) {
  if (busy()) return;
  const t = E.act(state, a);
  if (t.ok) { state = t.state; sync(); save(); render(); }
}
function release() {
  if (busy() || state.shots.length >= 3) return;
  const film = E.simulate(E.run(state).stones, state.setup, state.level, true), t = E.act(state, state.setup);
  if (t.ok) { state = t.state; save(); startFilm(film.frames); }
}
function tick(time) {
  if (frames.length && !paused && !$('guide').open && !$('confirm').open) {
    // A stalled/background tab must never skip a whole shot on return.
    if (lastTime !== null) elapsed += Math.min(100, Math.max(0, time - lastTime));
    lastTime = time;
    const next = Math.floor((elapsed + .0001) / FRAME_MS);
    if (next >= frames.length) { clearFilm(); render(); }
    else if (next !== frame) { frame = next; draw(frames[frame]); }
  } else lastTime = null;
  requestAnimationFrame(tick);
}
for (const k of ['angle', 'power', 'spin']) $(k).oninput = () => {
  if (busy()) return; state.setup[k] = Number($(k).value); save(); render();
};
$('rink').onclick = e => {
  if (busy()) return;
  const b = $('rink').getBoundingClientRect(), x = (e.clientX - b.left) * 640 / b.width, y = (e.clientY - b.top) * 400 / b.height;
  state.setup.angle = Math.round(Math.max(-45, Math.min(45, Math.atan2(y - 200, x - 65) * 180 / Math.PI)));
  $('rink').focus({ preventScroll: true }); sync(); save(); render();
};
$('forecast').onclick = () => { if (!busy()) { forecasting = !forecasting; render(); } };
$('throw').onclick = release;
$('review').onclick = () => { if (!busy()) { const review = E.review(state); if (review) startFilm(review.frames, true); } };
$('undo').onclick = () => go('undo');
$('retry').onclick = () => ask('Retry this rink? Club cards stay.', () => { clearFilm(); go('retry'); });
$('pause').onclick = () => { paused = !paused; lastTime = null; render(); };
$('help').onclick = () => { lastTime = null; $('guide').showModal(); render(); };
$('close').onclick = () => { $('guide').close(); lastTime = null; render(); };
$('guide').addEventListener('cancel', () => { lastTime = null; queueMicrotask(render); });
$('cancel').onclick = () => { pending = null; $('confirm').close(); lastTime = null; render(); };
$('confirm').addEventListener('cancel', () => { pending = null; lastTime = null; queueMicrotask(render); });
$('accept').onclick = () => { const fn = pending; pending = null; $('confirm').close(); paused = false; lastTime = null; fn?.(); };
$('reset').onclick = () => ask('Clear only Pebble Rink progress?', () => { clearFilm(); state = E.create(); blocked = false; sync(); save(); render(); });
$('recover').onclick = () => ask('Replace only the unreadable Pebble Rink save?', () => { blocked = false; save(); render(); });
window.addEventListener('keydown', e => {
  // Preserve native Space/arrow behavior for focused controls and navigation.
  if (e.repeat || e.ctrlKey || e.altKey || e.metaKey || busy() || e.target.closest?.('input,select,textarea,button,a,summary,[role="button"],[contenteditable]:not([contenteditable="false"])')) return;
  if (e.key === ' ') { e.preventDefault(); release(); }
  else if (e.key.startsWith('Arrow')) {
    e.preventDefault();
    if (e.key === 'ArrowLeft') state.setup.angle = Math.max(-45, state.setup.angle - 1);
    if (e.key === 'ArrowRight') state.setup.angle = Math.min(45, state.setup.angle + 1);
    if (e.key === 'ArrowUp') state.setup.power = Math.min(100, state.setup.power + 1);
    if (e.key === 'ArrowDown') state.setup.power = Math.max(40, state.setup.power - 1);
    sync(); save(); render();
  }
});
document.addEventListener('visibilitychange', () => { if (document.hidden) { paused = true; lastTime = null; render(); } });
window.addEventListener('message', e => {
  if (e.source === parent && e.origin === location.origin && e.data?.type === 'study-visibility' && !e.data.visible) { paused = true; lastTime = null; render(); }
});
sync(); save(); render(); requestAnimationFrame(tick);

