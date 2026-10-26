import assert from 'node:assert/strict';
import {PANTRY,LEGACY_SLOTS,mixedStrainIndex,mixedSlots,applyPantryMix} from '../dist/mix-pantry.mjs';
import {INGREDIENTS,EFFECTS,applyMix} from '../dist/mix-core.mjs';
assert.equal(PANTRY.length,12);assert.equal(LEGACY_SLOTS,4);
assert.deepEqual(PANTRY.slice(0,4).map(p=>p.id),INGREDIENTS.slice(0,4).map(i=>i.id),'the first four keep the original order');
assert.equal(PANTRY.slice(4).length,8,'eight new ingredients');
const ids=new Set(EFFECTS.map(e=>e.id).concat(['wary','pungent','woozy','bitter','restless','jittery','scattered','volatile','?']));
for(const p of PANTRY){assert.ok(ids.has(p.adds),p.id);for(const [a,b] of Object.entries(p.transforms||{}))assert.ok(ids.has(a)&&ids.has(b),p.id+' '+a+'>'+b);
 assert.ok(p.name&&p.blurb&&p.tag&&p.unlockLevel>=1&&p.price>0);}
assert.ok(PANTRY.some(p=>p.risks.length&&p.instability>=.4),'there are risky ingredients');
// Old saves: the first 6x4 block matches the original layout exactly.
for(let b=0;b<6;b++)for(let i=0;i<4;i++)assert.equal(mixedStrainIndex(b,i),6+b*4+i);
const slots=mixedSlots();assert.equal(slots.length,72);slots.forEach((slot,n)=>assert.equal(mixedStrainIndex(slot.base,slot.ingredient),6+n));
assert.equal(new Set(slots.map(s=>s.base+':'+s.ingredient)).size,72);
// The pantry mix rule matches mix-core for the legacy four.
for(let i=0;i<4;i++)assert.deepEqual(applyPantryMix(['sunny'],PANTRY[i]),applyMix(['sunny'],INGREDIENTS[i].id));
console.log('PASS: 12-item pantry (8 new), legacy strain indices 6..29 unchanged, 72 contiguous mixed slots, mix-core rule preserved.');
