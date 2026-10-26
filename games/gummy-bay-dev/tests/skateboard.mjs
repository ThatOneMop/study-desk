import assert from 'node:assert/strict';
import {BOARDS,boardById,PUSH_IMPULSE,KERB_LIMIT,BAIL_TIME,createRide,stepRide,flatTopSpeed,kerbOutcome,turnRate,skateFov,FOV_KICK,ollieHeight,normalizeSkate,buyBoard,kickflipShopHTML,skateSpotHeight,SKATE_SPOT,KICKFLIP_SITE,KICKFLIP_COLLIDERS,rideCamera} from '../dist/skateboard.mjs';
import {HOTBAR_SLOTS,hotbarSlot,hotbarCounts,hotbarHTML,HUD_ICONS} from '../dist/hud-s1.mjs';

// Six original boards, $75 to $1,500, matching the research table (P1-5).
assert.equal(BOARDS.length,6);
assert.equal(new Set(BOARDS.map(b=>b.name)).size,6,'board names are unique');
assert.equal(Math.min(...BOARDS.map(b=>b.price)),75);assert.equal(Math.max(...BOARDS.map(b=>b.price)),1500);
for(const b of BOARDS)assert.doesNotMatch(b.name,/schedule|skateboard\b/i,'original names, not lifted ones');

// Acceptance: top speed within ±5% of the research table, on flat ground holding W.
const TABLE={plank:5.5,street:6.7,feather:7.3,cruiser:8,dirt:8.5,gold:11};
for(const b of BOARDS){
 const top=flatTopSpeed(b);
 assert.ok(Math.abs(top-TABLE[b.id])/TABLE[b.id]<=.05,b.id+' reaches '+top.toFixed(2)+' m/s, table says '+TABLE[b.id]);
}
// Same check by stepping a ride for 12 s on a flat street.
const flat={floorAt:()=>0,blocked:()=>false,rough:()=>false};
for(const b of BOARDS){const r=createRide(b);let pushes=0;for(let i=0;i<720;i++){stepRide(r,{push:true},1/60,flat);pushes+=r.events.filter(e=>e==='push').length;}assert.ok(Math.abs(r.speed-TABLE[b.id])/TABLE[b.id]<=.05,b.id+' stepped top '+r.speed.toFixed(2));assert.ok(pushes>=10,'pushing repeats while W is held');}

// Push impulse ~1.6 m/s from a standstill.
assert.equal(PUSH_IMPULSE,1.6);
{const r=createRide(boardById('street'));stepRide(r,{push:true},1/60,flat);assert.ok(r.events.includes('push'));assert.ok(Math.abs(r.speed-1.6)<.05,'one push adds 1.6 m/s, got '+r.speed);}

// Coasting slows down and braking stops faster.
{const a=createRide(boardById('street'),{speed:5}),b=createRide(boardById('street'),{speed:5});for(let i=0;i<60;i++){stepRide(a,{},1/60,flat);stepRide(b,{brake:true},1/60,flat);}assert.ok(a.speed<5&&a.speed>4,'rolling drag is gentle');assert.ok(b.speed<a.speed-2,'S brakes hard');}

// Acceptance: a kerb above 0.12 m without an ollie is a bail.
assert.equal(KERB_LIMIT,.12);
assert.equal(kerbOutcome(.15,0),'bail');assert.equal(kerbOutcome(.11,0),'roll');assert.equal(kerbOutcome(.15,.3),'clear');
const kerbAt=h=>({floorAt:(x,z)=>z<-2?h:0,blocked:()=>false,rough:()=>false});
function runAtKerb(h,ollie){const r=createRide(boardById('street'),{speed:5});const seen=new Set();for(let t=0;t<1.5;t+=1/60){stepRide(r,{ollieHeld:ollie&&t<.18},1/60,kerbAt(h));r.events.forEach(e=>seen.add(e));}return {r,seen};}
{const {r,seen}=runAtKerb(.15,false);assert.ok(seen.has('bail'),'0.15 m kerb without ollie bails');assert.equal(r.bailReason,'kerb');assert.ok(r.speed<1,'a bail drops the speed');}
{const {r,seen}=runAtKerb(.15,true);assert.ok(!seen.has('bail'),'the same kerb with an ollie clears');assert.ok(seen.has('ollie')&&seen.has('land'));assert.ok(Math.abs(r.y-.15)<1e-6,'lands on top of the kerb');}
{const {seen}=runAtKerb(.1,false);assert.ok(!seen.has('bail'),'a 10 cm kerb rolls up');}
{const {seen}=runAtKerb(.18,false);assert.ok(seen.has('bail'),'a town step (0.18 m) bails without an ollie');}
// Bails recover after BAIL_TIME.
{const {r,seen}=runAtKerb(.15,false);for(let t=0;t<BAIL_TIME+.1;t+=1/60){stepRide(r,{},1/60,kerbAt(.15));r.events.forEach(e=>seen.add(e));}assert.ok(seen.has('recovered'));}
// Hitting a wall fast bails, slowly just stops.
{const wall={floorAt:()=>0,blocked:(x,z)=>z<-1,rough:()=>false};const fast=createRide(boardById('gold'),{speed:8}),slow=createRide(boardById('gold'),{speed:1.5});let fb=false,sb=false;for(let i=0;i<60;i++){stepRide(fast,{},1/60,wall);stepRide(slow,{},1/60,wall);fb||=fast.events.includes('bail');sb||=slow.events.includes('bail');}assert.ok(fb,'fast into a wall bails');assert.ok(!sb,'slow into a wall stops');assert.ok(slow.z>-1.05,'never passes through');}

// Ollie: a tap pops lower than a full charge; better boards pop higher.
assert.ok(ollieHeight(boardById('feather'),0)<ollieHeight(boardById('feather'),1));
assert.ok(ollieHeight(boardById('feather'),1)>ollieHeight(boardById('plank'),1));
assert.ok(ollieHeight(boardById('plank'),1)>KERB_LIMIT+.15,'even the cheapest board can ollie a kerb');

// Carving: turn rate falls with speed.
assert.ok(turnRate(0)>turnRate(4)&&turnRate(4)>turnRate(10));
{const r=createRide(boardById('street'),{speed:4});for(let i=0;i<30;i++)stepRide(r,{left:true},1/60,flat);assert.ok(r.heading>.3,'A carves left');assert.ok(r.lean<0||r.lean>0,'the deck leans into the carve');}
// Rough ground caps speed unless it is the Dirt Deck.
{const rough={floorAt:()=>0,blocked:()=>false,rough:()=>true};const a=createRide(boardById('street')),d=createRide(boardById('dirt'));for(let i=0;i<720;i++){stepRide(a,{push:true},1/60,rough);stepRide(d,{push:true},1/60,rough);}assert.ok(a.speed<6.7*.85,'street wheels drag on dirt');assert.ok(d.speed>8.5*.95,'dirt deck keeps its pace off-road');}

// FOV kick at speed.
assert.equal(skateFov(75,0),75);assert.ok(skateFov(75,5)>75);assert.equal(skateFov(75,99),75+FOV_KICK);

// Chase camera sits behind and above the rider and pulls in near walls.
{const r=createRide(boardById('street'),{x:0,z:0});const c=rideCamera(r,0,0);assert.ok(c.z>2&&c.y>1.2,'behind and above');const tight=rideCamera(r,0,0,{blocked:(x,z)=>z>1.5});assert.ok(tight.z<=1.5,'pulls in instead of clipping');}

// Save fields are additive and safe for old saves.
{const old={cash:100};normalizeSkate(old);assert.deepEqual(old.boards,[]);assert.equal(old.boardSel,null);
 const junk={boards:['gold','nope','gold'],boardSel:'nope'};normalizeSkate(junk);assert.deepEqual(junk.boards,['gold']);assert.equal(junk.boardSel,'gold');}
{const s={cash:300};const spend=n=>{if(s.cash<n)return false;s.cash-=n;return true;};
 assert.equal(buyBoard(s,'feather',spend).ok,false,'cannot afford $500');assert.equal(s.cash,300);assert.deepEqual(s.boards,[]);
 const r=buyBoard(s,'street',spend);assert.ok(r.ok&&r.bought);assert.equal(s.cash,50);assert.deepEqual(s.boards,['street']);assert.equal(s.boardSel,'street');
 const again=buyBoard(s,'street',spend);assert.ok(again.ok&&!again.bought);assert.equal(s.cash,50,'owning a board never charges twice');}

// Acceptance: the board occupies a hotbar slot.
assert.equal(hotbarSlot('9').target,'board');assert.equal(hotbarSlot('9').act,'equip');
assert.ok(HOTBAR_SLOTS.some(s=>s.id==='board'));assert.match(HUD_ICONS.board,/^<svg/);
assert.ok(hotbarHTML().includes('id="equipBoard"'));
assert.equal(hotbarCounts({boards:['plank','gold']},{}).board,2);assert.equal(hotbarCounts({},{}).board,0);

// Shop lists every board with a buy button and marks owned ones.
{const html=kickflipShopHTML({boards:['plank'],boardSel:'plank',cash:600},{available:600});
 for(const b of BOARDS){assert.ok(html.includes(b.name),b.name+' listed');assert.ok(html.includes("action('buyBoard','"+b.id+"')"));}
 assert.match(html,/Kickflip Container/i);}

// The skate spot: a kerb over the limit, a kicker that rises smoothly, and nothing inside the container footprint.
assert.ok(SKATE_SPOT.kerb.h>KERB_LIMIT);
{const k=SKATE_SPOT.kicker;const low=skateSpotHeight(k.x+k.len/2-.01,k.z),mid=skateSpotHeight(k.x,k.z),high=skateSpotHeight(k.x-k.len/2+.01,k.z);assert.ok(low<.02&&mid>low&&high>mid&&Math.abs(high-k.h)<.02);}
assert.equal(skateSpotHeight(KICKFLIP_SITE.x,KICKFLIP_SITE.z),0);
assert.ok(KICKFLIP_COLLIDERS.length>=1);
// Perf: the container shell opts into static batching; rack decks + stickers are real models behind a close-up LOD; no transmission (extra scene pass).
{const THREE=await import('../dist/vendor/three.module.min.js');const {groupCandidate}=await import('../dist/static-batch.mjs');const {createKickflipContainer,createBoardModel}=await import('../dist/skateboard.mjs');
 const s=new THREE.Scene();createKickflipContainer(s);const g=s.children.find(o=>o.name==='Kickflip Container');assert.ok(g.userData.batchStatic);
 let n=0,c=0;g.traverse(o=>{if(o.isMesh){n++;if(groupCandidate(o,s))c++;}});assert.ok(c>=50&&n-c<=150,'most of the shell batches');
 const lod=g.getObjectByName('Kickflip rack LOD');assert.ok(lod?.isLOD&&lod.userData.noBatch&&lod.levels.length===2&&lod.levels[1].distance<=20);
 let decks=0;lod.levels[0].object.traverse(o=>{if(/^Skateboard /.test(o.name))decks++;});assert.equal(decks,BOARDS.length);
 for(const b of BOARDS)createBoardModel(b).traverse(o=>{const m=o.material;if(m&&!Array.isArray(m))assert.ok(!m.transmission,'no transmission on '+b.id);});}
console.log('PASS: six original boards ($75–$1,500) hit table top speeds within ±5%, push 1.6 m/s, carve slower at speed, ollie kerbs, bail on >0.12 m kerbs without an ollie, kick FOV, save additively and live in hotbar slot 9. Pure logic; no rendered feel claim.');
