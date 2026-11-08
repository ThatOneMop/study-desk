/* Autumn Drift gates: acorns and a swept lawn cannot skip rooted leaves or the basket. */
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '..');

function boot(raw) {
  const html = fs.readFileSync(path.join(root, 'games/autumn-drift/index.html'), 'utf8');
  const dom = new JSDOM(html, { url: 'https://example.test/games/autumn-drift/', runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.requestAnimationFrame = () => 1;
  w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, { get: (_, key) => key === 'createLinearGradient' ? () => ({ addColorStop() {} }) : () => {} });
  if (raw !== undefined) w.localStorage.setItem('autumn-drift-v2', raw);
  for (const name of ['save-store.js', 'recovery.js']) w.eval(fs.readFileSync(path.join(root, 'games/autumn-drift', name), 'utf8'));
  w.eval(fs.readFileSync(path.join(root, 'games/autumn-drift/game.js'), 'utf8') + `\nwindow.garden={
    get save(){return save}, get leaves(){return leaves}, get collected(){return collected}, get total(){return total},
    get basket(){return basket}, get rootedGot(){return rootedGot}, get legacy(){return legacyGate},
    gate:gateView, can:canUnlock, unlock, fee, blow(dt){blow(stats(), dt)}, stats, buy, load:loadGarden,
    take(leaf, how){const taps=Math.ceil(leaf.hp/Math.max(1,stats().power)); collectLeaf(leaf, how); return taps}
  };`);
  w.document.getElementById('start').click();
  return { w, g: w.garden, close: () => w.close() };
}
function leaf(id) {
  return { id, x: 400, y: 400, a: 0, s: 10, c: '#d48b37', hp: 1, max: 1, rare: false, rooted: false };
}

{
  const page = boot();
  const g = page.g;
  assert.equal(g.save.area, 0);
  assert.equal(g.leaves.filter(item => item.rooted).length, 0, 'the first garden has no rooted leaves');
  assert.equal(g.can(), false);
  g.save.money = 10000000;
  assert.equal(g.can(), false, 'a full purse does not open the first gate');
  let taps = 0;
  while (g.collected < Math.ceil(g.total * 0.85)) taps += g.take(g.leaves[0], 'pick');
  assert.equal(g.can(), true, 'the first garden still opens at 85% plus the fee');
  const before = g.save.money;
  const price = g.fee(0);
  assert.equal(g.unlock(), true);
  assert.equal(g.save.area, 1);
  assert.equal(g.save.unlocked, 1);
  assert.equal(g.save.money, before - price);
  assert.equal(g.unlock(), false, 'one opening does not skip Amber Orchard');
  page.close();
}

{
  const page = boot();
  const g = page.g;
  g.save.money = 10000000;
  g.save.ranks[2] = 5;
  g.save.area = 0;
  g.save.unlocked = 0;
  while (g.collected < Math.ceil(g.total * 0.85)) g.take(g.leaves[0], 'blow');
  assert.equal(g.unlock(), true);
  assert.equal(g.save.area, 1);
  const rooted = g.leaves.filter(item => item.rooted);
  assert.equal(rooted.length, 1);
  const stuck = rooted[0];
  g.blow(1);
  assert.equal(stuck.vx, undefined, 'wind does not take a rooted leaf');
  while (g.collected < Math.ceil(g.total * 0.85)) {
    const next = g.leaves.find(item => !item.rooted);
    g.take(next, 'blow');
  }
  assert.equal(g.can(), false, 'Amber Orchard stays sealed if the rooted leaf is left behind');
  assert.match(page.w.document.getElementById('gardenGoal').textContent, /Rooted 0\/1/);
  g.take(g.leaves.find(item => item.rooted), 'pick');
  assert.equal(g.can(), true);
  assert.equal(g.unlock(), true);
  assert.equal(g.save.area, 2);
  page.close();
}

{
  const page = boot();
  const g = page.g;
  g.save.area = 3;
  g.save.unlocked = 3;
  g.save.ranks = [0, 0, 5, 0];
  g.save.money = 10000000;
  g.load();
  assert.equal(g.legacy, false);
  assert.ok(g.leaves.filter(item => item.rooted).length >= 3);
  const goal = g.gate().lines.find(line => line.text.startsWith('Basket'));
  assert.equal(goal.text, 'Basket 0/3');
  while (g.collected < Math.ceil(g.total * 0.85)) {
    const next = g.leaves.find(item => !item.rooted);
    g.take(next, 'blow');
  }
  for (const item of g.leaves.filter(item => item.rooted)) g.take(item, 'pick');
  assert.equal(g.can(), false, 'later gates still want the basket');
  while (!g.gate().lines.find(line => line.text.startsWith('Basket')).done) g.take(g.leaves[0], 'basket');
  const purse = g.save.money;
  assert.equal(g.unlock(), true);
  assert.equal(g.save.unlocked, 4);
  assert.equal(g.save.money, purse - g.fee(3));
  assert.equal(g.can(), false);
  page.close();
}

{
  const marks = [];
  const page = boot();
  const g = page.g;
  let taps = 0;
  while (g.save.area < 12) {
    const area = g.save.area;
    const before = taps;
    const rooted = () => g.leaves.filter(item => item.rooted);
    while (rooted().length) taps += g.take(rooted()[0], 'pick');
    const basketLine = () => g.gate().lines.find(line => line.text.startsWith('Basket'));
    while (basketLine() && !basketLine().done) taps += g.take(g.leaves.find(item => item && !item.rooted) || g.leaves[0], 'basket');
    while (g.collected < Math.ceil(g.total * 0.85)) taps += g.take(g.leaves[0], 'pick');
    assert.equal(g.can(), true, 'area ' + area + ' ' + g.gate().summary);
    assert.equal(g.unlock(), true);
    assert.equal(g.save.area, area + 1);
    while (g.save.ranks[2] < 5 && g.buy(2)) {}
    while (g.stats().power < g.leaves[0].max && g.buy(0)) {}
    marks.push(area + ':' + (taps - before));
  }
  assert.equal(g.save.unlocked, 12);
  assert.ok(taps < 900, 'twelve gardens took ' + taps + ' taps');
  page.close();
  console.log('PASS Autumn gates: ' + marks.join(' ') + ' total ' + taps);
}

{
  const leaves = [leaf(0), leaf(1)];
  const old = {
    area: 12, unlocked: 12, money: 8000, ranks: [15, 10, 20, 8], picked: 400, clears: 2,
    garden: { area: 12, total: 20, collected: 18, completed: false, leaves }
  };
  const page = boot(JSON.stringify(old));
  const g = page.g;
  assert.equal(g.save.money, 8000);
  assert.equal(g.save.unlocked, 12);
  assert.equal(g.save.ranks[2], 20);
  assert.equal(g.legacy, true, 'a garden saved before the checklist keeps its old gate');
  assert.equal(g.can(), true);
  const price = g.fee(12);
  assert.equal(g.unlock(), true);
  assert.equal(g.save.unlocked, 13);
  assert.equal(g.save.money, 8000 - price);
  assert.equal(g.legacy, false);
  assert.equal(g.can(), false, 'the newly opened garden uses the checklist');
  const stored = JSON.parse(page.w.localStorage.getItem('autumn-drift-v2'));
  const again = boot(JSON.stringify(stored));
  assert.equal(again.g.save.money, 8000 - price);
  assert.equal(again.g.save.unlocked, 13);
  assert.equal(again.g.can(), false);
  again.close();
  page.close();
}
