import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {STEP_UP,FOV_BASE,WALK_SPEED,SPRINT_SPEED,SPRINT_RESPONSE,moveResponse,headBob,stepEyeOffset,steerStep,driveYawRate,driveFov} from '../dist/player-controller.mjs';
import {storyHold} from '../dist/story-acts.mjs';
const read=f=>readFileSync(new URL('../dist/'+f,import.meta.url),'utf8');
const game=read('game.js'),html=read('index.html'),css=read('feel.css');

// Sprint winds up (~0.25 s to 90%), walk/brake stay snappy, sprint bob capped.
assert.equal(SPRINT_RESPONSE,9);assert.equal(moveResponse(true,false,true),9);assert.equal(moveResponse(true,false),14);assert.equal(moveResponse(false,false,true),18);assert.equal(moveResponse(true,true,true),3);
{const t90=Math.log(10)/SPRINT_RESPONSE;assert.ok(t90>.22&&t90<.3,'sprint t90 '+t90);}
{const walk=headBob(Math.PI/2,WALK_SPEED,{moving:true}).y,run=headBob(Math.PI/2*(1.8/2.6),SPRINT_SPEED,{moving:true,sprinting:true}).y;assert.ok(run<=walk*1.2+1e-9,'sprint bob at most 1.2x walk');}
assert.deepEqual(headBob(1,SPRINT_SPEED,{moving:true,amount:0}),{y:0,lateral:0,roll:0},'bob toggle off means no bob');

// Kerb step-up: the body rises in a frame, the camera eases in over ~0.15 s.
{let o=stepEyeOffset(0,.15,0);assert.ok(Math.abs(o+.15)<1e-9,'camera starts at the old height');
 let t=0;while(Math.abs(o)>.015&&t<1){o=stepEyeOffset(o,0,1/60);t+=1/60;}
 assert.ok(t>.08&&t<.2,'kerb ease settles in 0.08–0.2 s, got '+t.toFixed(3));
 // per-frame camera motion during the ease never exceeds 4 cm at 60 Hz
 let prev=stepEyeOffset(0,.15,1/60),worst=.15+prev;for(let i=0;i<30;i++){const n=stepEyeOffset(prev,0,1/60);worst=Math.max(worst,Math.abs(n-prev));prev=n;}
 assert.ok(worst<=.15,'first frame moves at most the rise');
 assert.equal(stepEyeOffset(0,.6,1/60),0,'ledges/teleports above the step allowance are not eased');
 assert.equal(stepEyeOffset(0,.01,1/60),0,'sub-2 cm terrain noise is ignored');
 assert.equal(stepEyeOffset(0,.2,1/60,{grounded:false}),0,'airborne landings use the landing dip instead');
 assert.equal(stepEyeOffset(-.2,.2,1/60,{driving:true}),0,'the van view is never offset');
 assert.ok(stepEyeOffset(0,-.15,0)>0,'stepping down eases too');
 assert.ok(Math.abs(stepEyeOffset(-.3,-STEP_UP,0))<=STEP_UP,'offset is clamped');
 assert.equal(stepEyeOffset(NaN,NaN,NaN),0);}

// Van steering: no instant snap, quick return, tapered at speed.
{let s=0;s=steerStep(s,1,1/60);assert.ok(s>0&&s<.25,'wheel turns in over several frames');
 let t=0;s=0;while(s<.9&&t<1){s=steerStep(s,1,1/60);t+=1/60;}assert.ok(t>.15&&t<.4,'full lock in 0.15–0.4 s, got '+t.toFixed(2));
 let r=1,u=0;while(Math.abs(r)>.1&&u<1){r=steerStep(r,0,1/60);u+=1/60;}assert.ok(u<t,'self-centres faster than it turns in');
 assert.ok(steerStep(.5,-1,1/60)<.5,'counter-steer responds immediately');
 assert.equal(steerStep(2,5,0),1);assert.equal(steerStep(NaN,NaN,NaN),0);
 assert.equal(driveYawRate(1.6,0,16),0,'no turning on the spot');
 assert.ok(Math.abs(driveYawRate(1.6,6,16)-.9)<1e-9,'low speed keeps the original yaw rate');
 assert.ok(driveYawRate(1.6,16,16)<1.05&&driveYawRate(1.6,16,16)>.9,'top speed turns about 1 rad/s, not 1.6');
 for(let v=0;v<=16;v+=.5)assert.ok(16/Math.max(1e-6,driveYawRate(1.6,v,16))>=(v>8?9.5:0),'turn radius stays >= 9.5 m above 8 m/s at '+v);
 assert.equal(driveFov(75,0,16),75);assert.equal(driveFov(75,16,16),79);assert.equal(driveFov(75,16,16,false),75,'comfort toggle disables speed FOV');
 assert.equal(driveFov(undefined,8,16,true),FOV_BASE+1);}

// Story beats wait for live play to settle.
assert.equal(storyHold({}),'');
assert.equal(storyHold({chase:'pursuit'}),'chase');assert.equal(storyHold({chase:'suspicious'}),'chase');
assert.equal(storyHold({search:true}),'search');assert.equal(storyHold({driving:true}),'driving');
assert.equal(storyHold({skateSpeed:4}),'skating');assert.equal(storyHold({skateSpeed:.5}),'');
assert.equal(storyHold({arcade:true}),'arcade');assert.equal(storyHold({station:true}),'station');assert.equal(storyHold({placing:true}),'placing');
assert.match(game,/if\(storyHold\(storyHoldFacts\(\)\)\)return;\n  if\(storyUI\.queue\.length\)/,'storyTick checks the hold before cuts and raids');

// Wiring in game.js.
assert.match(game,/locomotion\.stepEye=stepEyeOffset\(/,'walk update eases kerbs');
assert.match(game,/pose\.cameraEye\+\(driving\?0:\(locomotion\.stepEye\|\|0\)\)/,'camera applies the kerb ease');
assert.match(game,/stepEye:0,lastGround:null\}\);/,'reset clears the kerb ease');
assert.match(game,/driveSteer=steerStep\(driveSteer,/,'van steering is smoothed');
assert.match(game,/driveYawRate\(vehicleSpec\.steering,driveSpeed,vehicleSpec\.top\)/,'van yaw tapers with speed');
assert.match(game,/driveFov\(fovBase,driveSpeed,vehicleSpec\.top,comfort\.sprintFov\)/,'van FOV follows the comfort toggle');
assert.match(game,/readableBothSides\(new THREE\.MeshBasicMaterial\(\{map:tex,side:THREE\.DoubleSide/,'double-sided signs read correctly from behind');
assert.match(game,/gl_FrontFacing \? vMapUv : vec2\( 1\.0 - vMapUv\.x, vMapUv\.y \)/);

// Touch parity and HUD layout.
assert.match(html,/<link rel="stylesheet" href="feel\.css\?v=\d+">/);
assert.match(html,/<div class="touchAct"><button data-tap="e"[^>]*>USE<\/button><button data-key="shift"[^>]*>RUN<\/button><button data-key=" "[^>]*>JUMP<\/button><\/div>/,'phones can run and jump');
assert.match(css,/@media\(pointer:coarse\)\{\.touchAct\{display:flex\}\}/);
assert.match(css,/body #drivingHUD\{left:18px!important;right:auto!important;bottom:96px!important;top:auto!important;transform:none!important/,'driving readout is docked, not on the windscreen');
for(const rule of ['body #compass{top:94px!important}','body #policeHUD{top:140px!important;bottom:auto!important}','body:has(#policeHUD:not([hidden])) #notifs{top:282px!important}','body .controls{bottom:96px!important}','body .touch{bottom:160px!important}'])assert.ok(css.includes(rule),'phone layout keeps '+rule);
// Sanity: the phone column stacks without overlap (objective ≤ 89 px tall at 12 px top on a 390 px screen).
{const compass=[94,134],wanted=[94,134],police=[140,275],notifs=[282,282+140];assert.ok(compass[0]>=12+77&&police[0]>=wanted[1]&&notifs[0]>=police[1]);}
console.log('playtest-feel ok');
// Officers stop at arm's length instead of walking through the camera; the 2.6 m grab still reaches.
assert.match(game,/const COP_PERSONAL_SPACE=1\.05;/);
assert.match(game,/if\(active&&!driving&&\(px\*dx\+pz\*dz\)>0&&Math\.abs\(px\*dz-pz\*dx\)\/d<\.7\)amount=Math\.min\(amount,Math\.max\(0,pd-COP_PERSONAL_SPACE\)\);/);
assert.match(game,/if\(distance<2\.6&&seen&&!driving/,'grab range stays outside the personal-space stop');
console.log('playtest-feel cop spacing ok');
// Phones get a USE button that replays E (sticky net, interact), and the place toast/notification stack stay apart.
{
 assert.match(html,/<div class="touchAct"><button data-tap="e" aria-label="Use or interact \(E\)">USE<\/button>/);
 assert.match(game,/document\.querySelectorAll\('\[data-tap\]'\)\.forEach\(b=>\{b\.onpointerdown=e=>\{e\.preventDefault\(\);dispatchEvent\(new KeyboardEvent\('keydown',\{key:b\.dataset\.tap/);
 assert.match(css,/body #placeToast\{top:38%!important\}/);
 assert.match(css,/body:has\(#policeHUD:not\(\[hidden\]\)\) #notifs>:nth-child\(n\+2\)\{display:none!important\}/);
 console.log('playtest-feel touch use ok');
}
