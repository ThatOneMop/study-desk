import assert from 'node:assert/strict';
import {LEVEL_XP,MAX_LEVEL,levelOf,levelProgress,migrateXp,XP_CURVE} from '../dist/xp-curve.mjs';
// Each level costs at least as much as the one before, so ranks slow down gently.
for(let i=2;i<LEVEL_XP.length;i++)assert.ok(LEVEL_XP[i]-LEVEL_XP[i-1]>=LEVEL_XP[i-1]-LEVEL_XP[i-2],'step '+i);
assert.equal(levelOf(0),1);assert.equal(levelOf(99),1);assert.equal(levelOf(100),2);assert.equal(levelOf(-5),1);assert.equal(levelOf(NaN),1);
assert.equal(levelOf(9139),MAX_LEVEL-1);assert.equal(levelOf(9140),MAX_LEVEL);assert.equal(levelOf(99999),MAX_LEVEL);
assert.deepEqual({...levelProgress(160)},{level:2,into:60,need:120,ratio:.5});
assert.equal(levelProgress(99999).ratio,1);assert.equal(levelProgress(99999).need,0);
assert.equal(XP_CURVE,2);
assert.equal(migrateXp(0).xp,0);assert.equal(levelOf(migrateXp(0).xp),1);
assert.equal(migrateXp(30).xp,100);assert.equal(levelOf(migrateXp(30).xp),2);
assert.equal(migrateXp(45).xp,160);assert.equal(levelOf(migrateXp(45).xp),2);
assert.equal(migrateXp(510).xp,1180);assert.equal(levelOf(migrateXp(510).xp),8);
assert.equal(migrateXp(160,2).xp,160);assert.equal(migrateXp(160,2).curve,2);
console.log('PASS: xp curve is monotonic and slower at higher ranks');
