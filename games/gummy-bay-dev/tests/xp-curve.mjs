import assert from 'node:assert/strict';
import {LEVEL_XP,MAX_LEVEL,levelOf,levelProgress} from '../dist/xp-curve.mjs';
// Each level costs at least as much as the one before, so ranks slow down gently.
for(let i=2;i<LEVEL_XP.length;i++)assert.ok(LEVEL_XP[i]-LEVEL_XP[i-1]>=LEVEL_XP[i-1]-LEVEL_XP[i-2],'step '+i);
assert.equal(levelOf(0),1);assert.equal(levelOf(29),1);assert.equal(levelOf(30),2);assert.equal(levelOf(-5),1);assert.equal(levelOf(NaN),1);
assert.equal(levelOf(509),MAX_LEVEL-1);assert.equal(levelOf(510),MAX_LEVEL);assert.equal(levelOf(99999),MAX_LEVEL);
assert.deepEqual({...levelProgress(45)},{level:2,into:15,need:30,ratio:.5});
assert.equal(levelProgress(600).ratio,1);assert.equal(levelProgress(600).need,0);
console.log('PASS: xp curve is monotonic and slower at higher ranks');
