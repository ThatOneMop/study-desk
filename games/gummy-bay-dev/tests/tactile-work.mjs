import assert from 'node:assert/strict';
import {gestureCredit,sealPosition,sealReady,workSurfaceMotion} from '../dist/tactile-work.mjs';
assert.equal(gestureCredit('pack',-30,0),0);
assert.equal(gestureCredit('pack',0,30),0);
assert.equal(gestureCredit('pack',30,0),30);
assert.equal(gestureCredit('make',0,30),0);
assert.equal(gestureCredit('make',-30,0),30);
const straight={};let credit=0;for(let i=0;i<100;i++)credit+=gestureCredit('mix',30,0,straight);assert.equal(credit,60);
const scrub={};let scrubbed=0;for(let i=0;i<100;i++)scrubbed+=gestureCredit('mix',i%2?30:-30,0,scrub);assert.equal(scrubbed,60);
const circle={};let stirred=0;for(let i=0;i<4;i++)for(const [dx,dy] of [[30,0],[0,30],[-30,0],[0,-30]])stirred+=gestureCredit('mix',dx,dy,circle);assert(stirred>=300);
assert.equal(gestureCredit('pack',NaN,20),0);
assert.equal(sealReady(0),false);assert.equal(sealReady(1/2.2),true);
for(let i=0;i<100;i++){assert(sealPosition(i/10)>=0);assert(sealPosition(i/10)<=1);}
console.log('PASS: directional packing/shaping, bounded circular stirring, finite input and forgiving seal window.');

let previous=workSurfaceMotion({clientX:700,clientY:400},null,true).point;
let motion=workSurfaceMotion({clientX:700,clientY:400,movementX:30,movementY:-10},previous,true);
assert.equal(motion.dx,30);assert.equal(motion.dy,-10);
previous=motion.point;
motion=workSurfaceMotion({clientX:800,clientY:500,movementX:999},previous,false);
assert.equal(motion.dx,0);assert.equal(motion.dy,0); // mode switch re-baselines
motion=workSurfaceMotion({clientX:810,clientY:490,movementX:999},motion.point,false);
assert.equal(motion.dx,10);assert.equal(motion.dy,-10); // ignore noisy movement in free mode
assert.equal(workSurfaceMotion({movementX:Infinity,movementY:NaN},previous,true).dx,0);
assert.equal(workSurfaceMotion({clientX:NaN,clientY:10},motion.point,false).dx,0);
console.log('PASS: locked relative motion, unlocked position deltas, lock transitions and malformed event inputs.');
