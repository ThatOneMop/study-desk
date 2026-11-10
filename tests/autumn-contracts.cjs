/* Autumn Drift lift v3: day cycle, weather/wind physics, dusk contracts, save compat. */
const assert = require('node:assert/strict');
const fs = require('fs');
const { JSDOM } = require('jsdom');
const root = __dirname + '/../';
const html = fs.readFileSync(root + 'games/autumn-drift/index.html', 'utf8');
const S = require(root + 'games/autumn-drift/save-store.js');

function boot(raw = null) {
  const dom = new JSDOM(html, { url: 'https://example.test/games/autumn-drift/', runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window, d = w.document;
  w.requestAnimationFrame = () => 1;
  w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, { get: (_, k) => k === 'createLinearGradient' ? () => ({ addColorStop() {} }) : () => {} });
  if (raw !== null) w.localStorage.setItem(S.KEY, raw);
  w.eval(fs.readFileSync(root + 'games/autumn-drift/save-store.js', 'utf8'));
  w.eval(fs.readFileSync(root + 'games/autumn-drift/recovery.js', 'utf8'));
  w.eval(fs.readFileSync(root + 'games/autumn-drift/game.js', 'utf8') + `
    window.ct = {
      get save(){return save}, get contract(){return contract}, get dusk(){return dusk}, get leaves(){return leaves},
      get weather(){return save.weather}, palette, leafType, contractFor, advanceDay, windVector, weatherName,
      stepLeaves, loadGarden, persist, currentGarden, take(l,how){collectLeaf(l,how)},
      setWeather(v){save.weather=v}, setDusk(v){dusk=v}, runRender(t){render(t)},
      setDown(v){down=v}, setMode(v){mode=v}, setPointer(x,y){pointer={x,y}},
      get running(){return running},
      fixture(list){leaves=list;total=list.length;collected=0;completed=false}
    };`);
  d.getElementById('start').click();
  return { w, d, g: w.ct, close: () => w.close() };
}
const leaf = (id, c, extra = {}) => ({ id, x: 400, y: 400, a: 0, s: 10, c, hp: 1, max: 1, rare: false, rooted: false, ...extra });

// 1. Leaf-type mapping is deterministic and covers the palette.
{
  const p = boot(); const g = p.g;
  const types = [...g.palette.map(c => g.leafType({ c }))];
  assert.deepEqual(types, [0, 1, 2, 3, 0, 1, 2], 'palette maps onto four leaf types');
  assert.equal(g.leafType({ c: '#000000' }), 0, 'unknown colour falls back to type 0');
  p.close();
}

// 2. Contract generation is deterministic and demands a real order (>=4 at area 0).
{
  const p = boot(); const g = p.g;
  const a = g.contractFor(0, 0), b = g.contractFor(0, 0);
  assert.deepEqual(JSON.parse(JSON.stringify(a)), JSON.parse(JSON.stringify(b)), 'same area+day yields the same order');
  assert.ok(a.need >= 4 && a.type >= 0 && a.type <= 3 && a.reward > 0 && a.done === false, 'sane order shape');
  assert.notDeepEqual(JSON.parse(JSON.stringify(g.contractFor(0, 1))), JSON.parse(JSON.stringify(g.contractFor(5, 0))), 'orders vary with area and day');
  p.close();
}

// 3. Filling the order pays acorns once, marks it done, and counts it.
{
  const p = boot(); const g = p.g;
  const ct = g.contract;
  const list = [];
  for (let i = 0; i < ct.need; i++) list.push(leaf(900 + i, g.palette[ct.type]));
  g.fixture(list);
  const purse = g.save.money;
  for (let i = 0; i < ct.need; i++) g.take(g.leaves[0], 'pick');
  assert.equal(g.contract.got, ct.need, 'every matching leaf counts toward the order');
  assert.equal(g.contract.done, true, 'order completes at the required count');
  assert.equal(g.save.contracts, 1, 'completed orders are tallied');
  assert.ok(g.save.money >= purse + ct.reward, 'order reward paid on top of leaf value');
  const after = g.save.money;
  g.fixture([leaf(999, g.palette[ct.type])]);
  g.take(g.leaves[0], 'pick');
  assert.equal(g.save.money > after, true, 'further leaves still sell; reward is not re-paid');
  assert.equal(g.save.contracts, 1, 'a filled order does not pay twice');
  p.close();
}

// 4. Weather drives wind; wind pushes loose leaves (physics feel).
{
  const p = boot(); const g = p.g;
  g.setWeather(0); const calm = g.windVector().s;
  g.setWeather(3); const gale = g.windVector().s;
  assert.equal(calm, 0, 'calm weather is windless');
  assert.ok(gale > calm, 'gale weather blows harder than calm');
  const loose = leaf(1, '#d48b37'); loose.vx = 1; loose.vy = 0.5;
  g.fixture([loose]);
  for (let i = 0; i < 12; i++) g.stepLeaves(0.016);
  assert.ok(loose.x > 400, 'the wind carries a loose leaf downwind');
  p.close();
}

// 5. Dusk advances the day: new weather, fresh order, timer reset.
{
  const p = boot(); const g = p.g;
  const before = { day: g.save.day, weather: g.save.weather };
  g.setDusk(0.01);
  g.runRender(5000);
  assert.equal(g.save.day, before.day + 1, 'dusk advances the day counter');
  assert.equal(g.dusk > 1, true, 'the dusk timer is reset for the new day');
  assert.ok(g.contract && g.contract.done === false, 'a fresh order is issued at dawn');
  assert.ok(g.weather >= 0 && g.weather <= 3, 'weather is a valid index after the day rolls');
  p.close();
}

// 6. Running render path (rake sweep + rings + weather fx) does not throw.
{
  const p = boot(); const g = p.g;
  assert.equal(g.running, true, 'started garden is running');
  g.save.ranks[2] = 5; g.setMode('best'); g.setDown(true); g.setPointer(600, 400);
  g.setWeather(3);
  g.fixture([leaf(1, '#d48b37', { vx: 40, vy: 20 }), leaf(2, '#e8b64b')]);
  assert.doesNotThrow(() => { for (let i = 1; i <= 30; i++) g.runRender(i * 16.67); }, 'dense running frames (sweep arcs, rings, wind fx) render cleanly');
  p.close();
}

// 7. Save compatibility: new fields persist and old saves migrate without loss.
{
  const p = boot(); const g = p.g;
  const ct = g.contract;
  g.fixture([leaf(1, g.palette[ct.type]), leaf(2, '#d56932')]);
  g.take(g.leaves[0], 'pick');
  g.persist();
  const stored = JSON.parse(p.w.localStorage.getItem(S.KEY));
  assert.ok(Number.isInteger(stored.day) && Number.isInteger(stored.weather), 'day cycle persists');
  assert.ok(stored.garden.contract && stored.garden.contract.need === ct.need, 'order persists inside the garden');
  assert.doesNotThrow(() => S.validate(stored), 'the stored snapshot validates');
  const again = boot(JSON.stringify(stored));
  assert.equal(again.g.contract.got, g.contract.got, 'order progress restores');
  again.close();
  p.close();
}
{
  const legacy = JSON.stringify({ area: 4, unlocked: 4, money: 500, ranks: [1, 1, 5, 0], picked: 40, clears: 1, garden: { area: 4, total: 20, collected: 18, completed: false, leaves: [leaf(0, '#d48b37'), leaf(1, '#e8b64b')] } });
  const p = boot(legacy); const g = p.g;
  assert.equal(g.save.money, 500, 'legacy acorns preserved');
  assert.equal(g.save.day, 0, 'missing day defaults to 0');
  assert.equal(g.save.weather, 1, 'missing weather defaults to breeze');
  assert.ok(g.contract && g.contract.need >= 1, 'a fresh order is issued for a legacy garden');
  assert.doesNotThrow(() => S.validate(JSON.parse(JSON.stringify(g.currentGarden()))), 'legacy garden re-validates with a contract');
  p.close();
}
// schema rejects malformed cycle/contract fields
for (const bad of [{ day: -1 }, { weather: 9 }, { contracts: -3 }]) {
  assert.throws(() => S.validate({ ...S.initial(), ...bad }), 'rejects invalid ' + Object.keys(bad)[0]);
}
assert.throws(() => S.validate({ ...S.initial(), garden: { area: 0, total: 2, collected: 1, completed: false, leaves: [leaf(0, '#d48b37')], contract: { type: 0, need: 2, got: 5, reward: 3, done: false } } }), 'rejects got > need');
assert.throws(() => S.validate({ ...S.initial(), garden: { area: 0, total: 2, collected: 1, completed: false, leaves: [leaf(0, '#d48b37')], contract: { type: 9, need: 2, got: 0, reward: 3, done: false } } }), 'rejects bad contract type');

console.log('PASS Autumn lift: leaf types, deterministic dusk contracts, order payout once, weather-driven wind physics, day rollover, save persistence + legacy migration, schema guards');
