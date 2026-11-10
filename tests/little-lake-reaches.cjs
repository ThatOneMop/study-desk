/* Little Lake stretch mastery: lucky catches cannot buy later water, and old saves stay open. */
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const L = require('../games/little-lake/progression.js');
const root = path.resolve(__dirname, '..');

function legacyPrefix(n) {
  if (n <= 0) return 0;
  const k = Math.floor(Math.sqrt(n));
  const roots = (k - 1) * k * (4 * k + 1) / 6 + k * (n - k * k + 1);
  return 120 * n + 10 * roots + (n >= 1 ? 120 : 0) + (n >= 2 ? 570 : 0);
}
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function fresh() {
  return L.adopt({ waters: 0 });
}
function apply(save, step) {
  assert.equal(step.ok, true);
  assert.ok(step.gained.length <= 1, 'one stretch at a time');
  save.waters = step.waters;
  save.paidThrough = step.paidThrough;
  save.mastery = step.mastery;
  save.money += step.reward;
  return step;
}

{
  let previous = L.stretchAt(0);
  assert.equal(previous.from, 0);
  assert.deepEqual(previous, { index: 0, name: 'The Shallows', from: 0, to: 0 });
  for (let i = 1; i < 12; i++) {
    const stretch = L.stretchAt(i);
    assert.equal(stretch.from, previous.to + 1);
    assert.equal(L.stretchOf(stretch.from).index, i);
    assert.equal(L.stretchOf(stretch.to).index, i);
    previous = stretch;
  }
  assert.equal(L.stretchAt(2).name, 'Moonwater Coast');
  assert.equal(L.stretchAt(8).name, 'Far Shores');
  assert.equal(L.stretchOf(L.AREA_MAX - 1).to, L.AREA_MAX - 1);
  const early = [0, 1, 2, 6, 12, 20, 32, 48, 72];
  early.forEach((end, index) => assert.equal(L.stretchAt(index).to, end));
}

{
  const save = Object.assign({ money: 0 }, fresh());
  for (let i = 0; i < 2; i++) {
    const noted = L.noteCatch(save, 0, 5, true);
    assert.equal(noted.counted, true);
    save.mastery = noted.mastery;
  }
  assert.equal(L.noteCatch(save, 0, 80, true).counted, false, 'a later species does not count in the Shallows');
  assert.equal(L.gateView(save, 0).ready, false);
  save.money = 10000000;
  const blocked = L.advance(save);
  assert.equal(blocked.ok, false);
  assert.equal(blocked.waters, 0);
  function maxWeight(id) {
    let n = id + 3;
    n = Math.imul(n ^ (n >>> 16), 0x45d9f3b);
    n = Math.imul(n ^ (n >>> 16), 0x45d9f3b);
    return 0.3 + (0.5 + ((n ^ (n >>> 16)) >>> 0) / 4294967296 * 18);
  }
  const shallowsHaul = L.catchValue(130, maxWeight(5), 0, true) * 2;
  assert.ok(shallowsHaul > legacyPrefix(1), 'two best Shallows fish used to buy the next area: ' + shallowsHaul);
  const kingHaul = L.catchValue(750, maxWeight(17), 2, true) * 2;
  const oldSkip = legacyPrefix(20) - legacyPrefix(2);
  assert.ok(kingHaul > oldSkip, 'two Moonwater kings used to skip into later regions: ' + kingHaul + ' > ' + oldSkip);
  const coast = Object.assign({ money: kingHaul }, L.adopt({ waters: 2 }));
  assert.equal(L.advance(coast).ok, false);
  const coastNeed = L.needs(2);
  for (let n = 0; n < coastNeed.catches; n++) coast.mastery = L.noteCatch(coast, 2, 12 + (n % 6), n < coastNeed.perfects).mastery;
  const opened = apply(coast, L.advance(coast));
  assert.equal(opened.waters, 6, 'a finished coast opens Reed Marsh only');
  assert.ok(opened.waters < 20);
}

{
  const save = Object.assign({ money: 500 }, fresh());
  const slots = [0, 1, 0, 2, 1, 2];
  slots.forEach((slot, index) => {
    const noted = L.noteCatch(save, 0, slot, index < 2);
    save.mastery = noted.mastery;
  });
  assert.equal(L.gateView(save, 0).ready, true);
  const step = apply(save, L.advance(save));
  assert.deepEqual(step.gained, [1]);
  assert.equal(save.waters, 1);
  assert.equal(L.advance(save).ok, false, 'the next stretch needs its own fish');
  assert.equal(L.rewardFor(1), step.reward);
  const again = L.advance(JSON.parse(JSON.stringify(save)));
  assert.equal(again.ok, false);
  assert.equal(again.reward, 0);
}

{
  const save = fresh();
  for (let i = 0; i < 40; i++) save.mastery = L.noteCatch(save, 0, 0, false).mastery;
  assert.equal(save.mastery.species.length, 1);
  assert.equal(L.advance(save).ok, false);
  assert.match(L.gateView(save, 0).summary, /Willow River is sealed/);
  assert.match(L.gateView(save, 0).summary, /fish 1\/3/);
}

{
  const save = L.adopt({ waters: 6, money: 900, rod: 2 });
  for (let n = 0; n < 20; n++) {
    const slot = 3 + (n % 3);
    save.mastery = L.noteCatch(save, 6, 6 * 6 + slot, true).mastery;
  }
  assert.ok(save.mastery.species.length <= 3);
  assert.equal(L.advance(save).ok, false, 'the deep spoon alone cannot finish a later stretch');
}

{
  const old = {
    money: 4200, rod: 3, bagLevel: 2, waters: 10, area: 10, seen: [1, 17, 40],
    caught: 80, lure: 'deep', bag: [{ id: 5, weight: 1.2, value: 90 }]
  };
  const kept = L.adopt(old);
  assert.equal(kept.waters, 10, 'a bought frontier stays open');
  assert.equal(kept.paidThrough, 3);
  assert.equal(L.advance(Object.assign({ money: old.money }, kept)).ok, false);
  const save = Object.assign({ money: old.money, rod: old.rod, seen: old.seen.slice() }, kept);
  const need = L.needs(L.stretchOf(10).index);
  for (let n = 0; n < need.catches; n++) {
    save.mastery = L.noteCatch(save, 10, 10 * 6 + (n % 6), n < need.perfects).mastery;
  }
  const before = save.money;
  const step = apply(save, L.advance(save));
  assert.equal(save.waters, 12);
  assert.deepEqual(step.gained, [4]);
  assert.equal(save.money, before + L.rewardFor(4));
  assert.equal(L.advance(save).reward || 0, 0);
  const healed = L.adopt({ waters: 72, paidThrough: 0, money: 10 });
  assert.equal(healed.paidThrough, 8);
  assert.equal(L.advance(healed).ok, false);
}

function dom(storage) {
  const html = fs.readFileSync(path.join(root, 'games/little-lake/index.html'), 'utf8');
  const domWindow = new JSDOM(html, { url: 'https://test.example/games/little-lake/', runScripts: 'outside-only', pretendToBeVisual: true }).window;
  domWindow.requestAnimationFrame = () => 1;
  domWindow.scrollTo = () => {};
  domWindow.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, { get: (_, key) => key === 'createLinearGradient' || key === 'createRadialGradient' ? () => ({ addColorStop() {} }) : () => {} });
  if (storage) domWindow.localStorage.setItem('littleLakeV1', JSON.stringify(storage));
  domWindow.eval(fs.readFileSync(path.join(root, 'games/little-lake/progression.js'), 'utf8'));
  domWindow.eval(fs.readFileSync(path.join(root, 'games/little-lake/research.js'), 'utf8'));
  const inline = [...domWindow.document.querySelectorAll('script:not([src])')].map(script => script.textContent).join('\n');
  domWindow.eval(inline + '\nwindow.__lake={get save(){return save},get zone(){return zone},hintText,fish,speciesDetails};');
  return domWindow;
}

{
  const old = {
    money: 4200, rod: 3, bagLevel: 2, waters: 48, area: 40,
    seen: [1, 17, 80], caught: 90, lure: 'balanced', records: { 17: 8.5 },
    best: { id: 17, weight: 8.5, value: 2000 }, bag: []
  };
  const w = dom(old);
  const live = w.__lake;
  assert.equal(live.save.money, 4200);
  assert.equal(live.save.rod, 3);
  assert.equal(live.save.bagLevel, 2);
  assert.equal(live.save.waters, 48);
  assert.equal(live.save.seen.includes(17), true);
  assert.equal(live.zone, 40);
  assert.match(live.hintText(), /Far Shores is sealed/);
  assert.doesNotMatch(w.document.body.innerHTML, /unlockBatch/);
  const stored = JSON.parse(w.localStorage.getItem('littleLakeV1'));
  assert.equal(stored.money, 4200);
  assert.equal(stored.waters, 48);
  w.close();
}

{
  const marks = [];
  const seeds = [1, 2, 3, 7, 11, 19];
  const page = dom();
  const fish = page.__lake.fish;
  const speciesDetails = page.__lake.speciesDetails;
  function run(seed, mode) {
    const rng = mulberry32(seed);
    const save = Object.assign({ money: 0, rod: 0, bagLevel: 0, bag: [] }, fresh());
    let catches = 0;
    const opened = [];
    const limit = mode === 'unlucky' ? 30 : 700;
    while (catches < limit && save.waters < 72) {
      const area = save.waters;
      let slot;
      let perfect;
      if (mode === 'lucky' && catches < 2) {
        slot = 5;
        perfect = true;
      } else if (mode === 'unlucky') {
        slot = 0;
        perfect = false;
      } else {
        const bonus = save.rod * 0.035 + (rng() < 0.55 ? 0.16 : 0);
        slot = L.roll('balanced', rng(), bonus);
        perfect = rng() < 0.42;
      }
      const id = (area * 6 + slot) % 7000;
      save.mastery = L.noteCatch(save, area, id, perfect).mastery;
      const weight = 0.3 + rng() * speciesDetails(id).weight;
      save.bag.push(L.catchValue(fish[id][1], weight, area, perfect));
      const capacity = 8 + save.bagLevel * 6;
      if (save.bag.length >= capacity || L.gateView(save, area).ready) {
        save.money += save.bag.reduce((sum, value) => sum + value, 0);
        save.bag = [];
        let bought = true;
        while (bought) {
          bought = false;
          const rodCost = 80 * (save.rod + 1) ** 2;
          const bagCost = 65 * (save.bagLevel + 1) ** 2;
          if (save.rod < 4 && save.money >= rodCost && (save.bagLevel >= 4 || rodCost <= bagCost)) {
            save.money -= rodCost;
            save.rod++;
            bought = true;
          } else if (save.bagLevel < 4 && save.money >= bagCost) {
            save.money -= bagCost;
            save.bagLevel++;
            bought = true;
          }
        }
      }
      catches++;
      if (!L.gateView(save, area).ready) continue;
      const step = L.advance(save);
      assert.equal(step.ok, true, mode + ' seed ' + seed);
      assert.equal(step.gained.length, 1);
      const reward = step.reward;
      apply(save, step);
      assert.equal(L.advance(save).ok, false);
      opened.push(save.waters + ':' + catches + ':' + reward);
      if (mode === 'lucky' && opened.length === 1) {
        assert.equal(save.waters, 1);
        assert.ok(catches >= 6);
      }
    }
    return { catches, waters: save.waters, opened, rod: save.rod, money: save.money };
  }
  for (const seed of seeds) {
    const lucky = run(seed, 'lucky');
    const steady = run(seed + 100, 'steady');
    assert.equal(lucky.waters, 72, 'lucky seed ' + seed + ' stopped at ' + lucky.waters + ' after ' + lucky.catches);
    assert.equal(steady.waters, 72, 'steady seed ' + seed);
    for (const result of [lucky, steady]) {
      const ends = result.opened.map(row => Number(row.split(':')[0]));
      assert.deepEqual(ends, [1, 2, 6, 12, 20, 32, 48, 72]);
    }
    marks.push(seed + ' lucky ' + lucky.opened.map(row => row.split(':')[1]).join('/') + ' steady ' + steady.opened.map(row => row.split(':')[1]).join('/') + ' rod' + steady.rod);
  }
  const unlucky = run(4, 'unlucky');
  assert.equal(unlucky.waters, 0);
  assert.equal(unlucky.opened.length, 0);
  page.close();
  console.log('PASS Little Lake reaches: ' + marks.join(' | '));
}
