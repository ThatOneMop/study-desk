import assert from 'node:assert/strict';
import {searchPenalty,penaltyTier,penaltyMessage} from '../dist/police-penalty.mjs';
// Day 1 is protected: the play-test run lost $92 of $116 at curfew to a search on day 1.
assert.equal(penaltyTier(1),'warning');assert.equal(penaltyTier(2),'gentle');assert.equal(penaltyTier(3),'gentle');assert.equal(penaltyTier(4),'full');
let r=searchPenalty({day:1,cash:116,packs:[4,0],gummies:[2],raw:[1]});
assert.deepEqual([r.seized,r.fine,r.packs,r.gummies,r.raw],[0,0,[4,0],[2],[1]],'day 1 search is a warning only');
assert.match(penaltyMessage(r),/warning/i);
assert.equal(searchPenalty({day:1,cash:116,fled:true}).fine,0,'running on day 1 is not fined either');
// Early game: half of each carried stack (rounded down) at most, never the starter batch wholesale.
r=searchPenalty({day:2,cash:116,packs:[4,1],gummies:[3]});
assert.deepEqual([r.packs,r.gummies,r.seized],[[2,1],[2],3]);
assert.equal(r.fine,35,'30% of $116, rounded');
r=searchPenalty({day:3,cash:40,packs:[2]});assert.equal(r.fine,20,'$20 minimum');
r=searchPenalty({day:3,cash:12,packs:[2]});assert.equal(r.fine,12,'never more than cash in hand');
r=searchPenalty({day:2,cash:100,packs:[1]});assert.deepEqual([r.seized,r.fine],[0,0],'a single pack is not worth a fine');
// Later days: full seizure minus the slipped stack.
r=searchPenalty({day:6,cash:400,packs:[5,2],raw:[3],spared:{key:'packs',index:0,qty:2}});
assert.deepEqual([r.packs,r.raw,r.seized,r.fine],[[2,0],[0],8,120]);
r=searchPenalty({day:6,cash:400});assert.deepEqual([r.seized,r.fine],[0,0],'clean compliant search costs nothing');
assert.equal(searchPenalty({day:6,cash:25,fled:true}).fine,20,'running is fined at the floor');
r=searchPenalty({day:2,cash:100,packs:[3],spared:{key:'packs',index:0,qty:3}});assert.deepEqual([r.packs,r.seized],[[3],0],'gentle tier still honours a slipped stack');
console.log('PASS: police penalties: day-1 warning, gentle half-seizure days 2-3, full seizure from day 4, 30%/$20 fine capped at cash');
