import assert from 'node:assert/strict';
import {journeyProgress,journeySummary} from '../dist/journey-progress.mjs';

let flags=Array(14).fill(false),progress=journeyProgress(flags,0);assert.deepEqual({...progress,flags:[...progress.flags]},{total:14,completed:0,chapter:0,next:0,complete:false,changed:false,stored:0,flags});
flags[0]=flags[1]=true;progress=journeyProgress(flags,13);assert.equal(progress.chapter,2);assert.equal(progress.completed,2);assert(progress.changed,'stale advanced chapter is repaired from actual milestones');
flags[7]=true;progress=journeyProgress(flags,2);assert.equal(progress.chapter,2);assert.equal(progress.completed,3,'out-of-order real achievement remains visible without skipping the first gap');
flags=Array(14).fill(true);progress=journeyProgress(flags,0);assert.equal(progress.chapter,14);assert.equal(progress.next,null);assert(progress.complete);assert(progress.changed);
assert.equal(journeySummary(progress,[]).label,'14 / 14 milestones');assert.match(journeySummary(progress,[]).next,/same save/);
flags=Array(14).fill(false);flags[0]=true;progress=journeyProgress(flags,'13');const summary=journeySummary(progress,['First','Second']);assert.equal(progress.stored,0);assert.equal(progress.chapter,1);assert.equal(summary.next,'Next: Second');
const hostile=journeyProgress([true,1,'true',false,{},null],Infinity);assert.deepEqual([...hostile.flags],[true,false,false,false,false,false]);assert.equal(hostile.chapter,1);assert.equal(hostile.completed,1);
const source=[true,false,true],before=JSON.stringify(source);journeyProgress(source,0);assert.equal(JSON.stringify(source),before);assert(Object.isFrozen(progress)&&Object.isFrozen(progress.flags));
assert.equal(journeyProgress(null,-1).total,0);assert.match(journeySummary(null).label,/unavailable/);
console.log('PASS: derived milestone totals, first-gap resume, stale/hostile chapter repair, out-of-order achievements, completion, immutable inputs and bounded summary copy.');
