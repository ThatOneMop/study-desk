const assert=require('node:assert/strict');
(async()=>{const {curfewCue}=await import('../games/gummy-bay/hud-readout.mjs');
assert.equal(curfewCue(1,1229),null);
assert.equal(curfewCue(1,1230).id,'curfew-warning');
assert.equal(curfewCue(1,1259).id,'curfew-warning');
assert.equal(curfewCue(1,1260).id,'curfew');
assert.match(curfewCue(1,1300).text,/05:00/);
assert.equal(curfewCue(2,300),null);
console.log('Curfew cues match 21:00 patrol rules and survive skipped minutes');})();
