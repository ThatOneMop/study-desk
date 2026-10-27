import assert from 'node:assert/strict';import fs from 'node:fs';
import {stackLayout,landingOffset,queueLandings,burstVelocities,PER_JAR,MAX_JARS,MAX_BAGS,LAND_TIME,STAGGER,BURST} from '../dist/pack-feel.mjs';
// Stack: whole jars of four first, loose baggies for the remainder, capped, rest counted as hidden.
let l=stackLayout(0);assert.equal(l.jars.length+l.bags.length,0);
l=stackLayout(3);assert.equal(l.bags.length,3);assert.equal(l.jars.length,0);
l=stackLayout(9,{x:1,y:2,z:3});assert.equal(l.jars.length,2);assert.equal(l.bags.length,1);assert.ok(l.bags[0].y>2&&l.jars[0].y>2);
l=stackLayout(100);assert.equal(l.jars.length,MAX_JARS);assert.ok(l.bags.length<=MAX_BAGS);assert.equal(l.hidden,100-MAX_JARS*PER_JAR-l.bags.length);
for(const b of stackLayout(3).bags.slice(1))assert.ok(b.y>stackLayout(3).bags[0].y,'baggies pile up');
// Landing: falls from above, ends exactly on the stack.
assert.ok(landingOffset(0)>.2);assert.equal(landingOffset(LAND_TIME),0);assert.ok(landingOffset(LAND_TIME*.3)<landingOffset(0));
// Batch of four lands one by one; a single pack lands immediately.
const q=queueLandings(2,6,10);assert.equal(q.length,4);assert.equal(q[0].at,10);assert.ok(Math.abs(q[3].at-(10+3*STAGGER))<1e-9);
assert.equal(queueLandings(5,5,1).length,0);assert.equal(queueLandings(5,4,1).length,0);
const v=burstVelocities(7);assert.equal(v.length,BURST);assert.ok(v.every(p=>p.y>0));assert.deepEqual(v,burstVelocities(7));
const game=fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8');
assert.match(game,/pack-feel\.mjs\?v=173/);assert.match(game,/createPackStack\(THREE,scene\)/);assert.match(game,/playBenchCue\(audioContext,/);assert.match(game,/packqa=1/);
console.log('PASS v173 pack feel: packs land as a stack of baggies and jars of four, one by one, with sparkle and sound');
