import assert from 'node:assert/strict';
import {EASE,catmullRomSegment,createPath,createTimeline,blendPose,activeBeats,createCineOverlay} from '../dist/cinematics.mjs';
import {FLYOVER,FLYOVER_SHOTS,FLYOVER_MINUTES,flyoverAt} from '../dist/loading-flyover.mjs';
import {HINTS,HINT_SECONDS,hintAt} from '../dist/hints.mjs';
import {cloudLayout,wrapAround,cloudFade,CLOUD_TILE,CLOUD_FADE,createSkyClouds} from '../dist/sky-clouds.mjs';
const finite=p=>['x','y','z','lookX','lookY','lookZ','fov'].every(k=>Number.isFinite(p[k]));
// Easing and splines.
for(const [name,f] of Object.entries(EASE)){assert.ok(Math.abs(f(0))<1e-9&&Math.abs(f(1)-1)<1e-9,name+' runs 0..1');}
const a=[0,0,0],b=[1,0,0],c=[2,1,0],d=[3,1,0];
assert.deepEqual(catmullRomSegment(a,b,c,d,0).map(v=>+v.toFixed(6)),b);
assert.deepEqual(catmullRomSegment(a,b,c,d,1).map(v=>+v.toFixed(6)),c);
const path=createPath([[0,0,0],[10,0,0],[10,0,10],[0,5,10]]);
assert.deepEqual(path.at(0).map(v=>+v.toFixed(5)),[0,0,0]);
assert.deepEqual(path.at(1).map(v=>+v.toFixed(5)),[0,5,10]);
// Arc-length parameterisation keeps speed close to constant.
const steps=[];for(let i=0;i<20;i++){const p=path.at(i/20),q=path.at((i+1)/20);steps.push(Math.hypot(q[0]-p[0],q[1]-p[1],q[2]-p[2]));}
assert.ok(Math.max(...steps)/Math.min(...steps)<1.25,'even camera speed along the path');
// Timeline fades and looping.
const tl=createTimeline([{duration:2,cam:[[0,0,0],[1,0,0]],look:[[0,0,-1],[1,0,-1]],fov:50,fadeIn:.5},{duration:2,cam:[[5,0,0],[6,0,0]],look:[[5,0,-1],[6,0,-1]],fov:[40,44],fadeOut:.5}]);
assert.equal(tl.duration,4);assert.equal(tl.at(0).fade,1);assert.equal(tl.at(1).fade,0);assert.equal(tl.at(3.99).index,1);assert.ok(tl.at(3.99).fade>.95);assert.equal(tl.at(9).done,true);
assert.ok(finite(tl.at(2.5).pose));
const mid=blendPose({x:0,y:0,z:0,lookX:0,lookY:0,lookZ:1,fov:40},{x:10,y:2,z:0,lookX:0,lookY:0,lookZ:1,fov:60},.5);
assert.equal(mid.x,5);assert.equal(mid.fov,50);
assert.deepEqual(activeBeats([{at:1,end:2,id:'a'},{at:3,id:'b'}],1.5).map(x=>x.id),['a']);
assert.doesNotThrow(()=>{const o=createCineOverlay(null);o.fade(.5);o.subtitle('A','b');o.caption('x','y');o.bars(true);o.chyron('');});
// Flyover: six shots, finite in-world poses, three different districts at 0/8/16 s.
assert.equal(FLYOVER_SHOTS.length,6);assert.equal(FLYOVER.duration,36);assert.ok(FLYOVER.loop);
assert.ok(FLYOVER_MINUTES>=16*60&&FLYOVER_MINUTES<=19*60,'golden-hour clock');
for(let t=0;t<FLYOVER.duration*2;t+=.25){const at=flyoverAt(t);assert.ok(finite(at.pose),'finite pose at '+t);
 assert.ok(at.pose.x>-280&&at.pose.x<280&&at.pose.z>-448&&at.pose.z<160&&at.pose.y>2.5&&at.pose.y<60,'camera in the world at '+t);
 assert.ok(at.fade>=0&&at.fade<=1);}
assert.equal(new Set([0.5,8,16].map(t=>flyoverAt(t).district)).size,3,'0/8/16 s show three different places');
assert.equal(flyoverAt(36+8).district,flyoverAt(8).district,'the tour loops');
for(const s of FLYOVER_SHOTS)assert.ok(s.district&&s.line&&s.line.length<48);
// Hints: original, short, family friendly, rotating.
assert.ok(HINTS.length>=20);assert.equal(HINT_SECONDS,6);
assert.equal(new Set(HINTS).size,HINTS.length,'no duplicate hints');
for(const h of HINTS){assert.ok(h.length>12&&h.length<=110,h);assert.ok(!/\b(gun|guns|blood|kill|drug|weed|cocaine|bet|casino)\b/i.test(h),h);}
assert.notEqual(hintAt(0).text,hintAt(6).text);assert.equal(hintAt(0).text,hintAt(HINTS.length*6).text);
// Clouds: soft billboards high in the sky that wrap around the camera and fade out before the far plane.
const layout=cloudLayout();assert.equal(layout.length,30);
for(const c of layout){assert.ok(c.y>=60&&c.y<=100&&c.w>=60&&c.h<c.w&&c.alpha>0&&c.alpha<1);}
for(const v of [-1000,-321,0,319,999]){const w=wrapAround(v,40);assert.ok(w>=40-CLOUD_TILE/2&&w<40+CLOUD_TILE/2);}
assert.equal(cloudFade(0),1);assert.equal(cloudFade(CLOUD_FADE.end+1),0);assert.ok(cloudFade(250)>0&&cloudFade(250)<1);
assert.ok(CLOUD_FADE.end<=330,'clouds fade before the camera far plane');
assert.equal(createSkyClouds({add(){}}).sprites.length,0,'no DOM, no clouds, no throw');
console.log('PASS: cinematic easing, arc-length Catmull-Rom paths, timeline fades/loops, 36 s golden-hour flyover inside the world, 30 rotating family-friendly hints and soft wrapping sky clouds. Rendering checked separately by screenshots.');
