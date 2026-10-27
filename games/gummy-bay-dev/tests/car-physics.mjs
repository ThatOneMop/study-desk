import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {LOT_CARS,createCar,stepCar,handlingFor,lotRequest,lotOwned,moveTrunk,seizeTrunk,trunkCount,resolveMove,chaseCamera} from '../dist/car-physics.mjs';
import {createLotModels,buildLotGeometry,lotColliders,createSkidMarks,createEngineAudio} from '../dist/car-kit.mjs';
import {cruiserSpawn,createCruiser,stepCruisers,cruisersWanted,cruiserCount,CRUISER_SPEC} from '../dist/police-cruisers.mjs';
import {VEHICLE_ROADS} from '../dist/road-zones.mjs';
const run=(spec,input,seconds,car=createCar())=>{for(let t=0;t<seconds*60;t++)stepCar(car,typeof input==='function'?input(t/60,car):input,spec,1/60);return car;};
// Top speed is bounded and reached; reverse is bounded.
for(const spec of LOT_CARS){const c=run(spec,{throttle:1},25);assert(c.long<=spec.top+1e-9&&c.long>spec.top*.85,spec.id+' reaches but never exceeds top speed');assert(c.gear===5&&c.rpm>900&&c.rpm<=6100,spec.id+' gears and rpm are sane');
 const r=run(spec,{throttle:-1},10);assert(r.long>=-spec.reverse-1e-9&&r.long<-1,spec.id+' reverse is bounded');}
// Weight: the heavier car accelerates slower over the first two seconds.
const by=id=>LOT_CARS.find(c=>c.id===id);
assert(run(by('limo'),{throttle:1},2).long<run(by('rustwagon'),{throttle:1},2).long,'the heavy limo accelerates slower than the rustwagon');
assert(run(by('icecream'),{throttle:1},2).long<run(by('sprinter'),{throttle:1},2).long,'ice-cream van slower off the line than the sprinter');
// Braking stops the car; coasting slows it.
{const c=run(by('rustwagon'),{throttle:1},4),v0=c.long;let t=0;while(c.long>.3&&t<5){stepCar(c,{throttle:-1},by('rustwagon'),1/60);t+=1/60;}assert(v0>12&&t<2,'braking from '+v0.toFixed(1)+' m/s stops the car within 2 s ('+t.toFixed(2)+' s)');const h=run(by('rustwagon'),{throttle:1},4);for(let i=0;i<120;i++)stepCar(h,{handbrake:true},by('rustwagon'),1/60);assert(h.long<v0*.5,'the handbrake alone bleeds speed');}
const coast=run(by('rustwagon'),t=>t<4?{throttle:1}:{},9);assert(coast.long<run(by('rustwagon'),{throttle:1},4).long*.75,'coasting bleeds speed');
// No steering at a standstill; turning needs speed.
const still=run(by('tuktuk'),{steer:1},3);assert.equal(still.angle,0,'no turning at a standstill');assert.equal(still.speed,0);
// Handbrake turn slides: slip and skid build, drifting flag sets, then grip returns.
const drift=run(by('rustwagon'),t=>t<4?{throttle:1}:t<4.8?{throttle:.6,steer:1,handbrake:true}:{throttle:.6,steer:1},5.2);
assert(drift.drifting&&drift.slip>.3&&drift.skid>.3,'handbrake turn starts a drift with skid');
const plain=run(by('rustwagon'),t=>t<4?{throttle:1}:{throttle:.6,steer:1},5.2);assert(plain.slip<drift.slip,'a plain turn slips less than a handbrake turn');
const recover=run(by('rustwagon'),t=>t<4.8?{throttle:1,steer:t>4?1:0,handbrake:t>4}:{throttle:.4},8);assert(!recover.drifting&&recover.slip<.12,'grip returns after the drift');
// Junk input never yields NaN.
const junk=createCar(NaN,Infinity,undefined);for(const inp of [{throttle:NaN,steer:'x'},null,{throttle:1e9,steer:-1e9,handbrake:1}])stepCar(junk,inp,{id:'nope'},1/60);stepCar(junk,{throttle:1},by('pickup'),NaN);
assert(['x','z','angle','vx','vz','speed','rpm','slip'].every(k=>Number.isFinite(junk[k])),'junk input stays finite');
// Fleet profiles map to handling; collisions slide or bounce.
assert.equal(handlingFor({id:'van',top:12,acceleration:6,reverse:4,steering:1.4}).top,12);
const wallCar=createCar(0,.5,0);wallCar.vz=10;resolveMove(wallCar,{x:0,z:0,angle:0},(x,z)=>z<.2);assert(wallCar.vz<0&&wallCar.z===0,'head-on wall stops and pushes back a little');
const corner=createCar(.5,.5,0);corner.vx=5;corner.vz=5;assert.equal(resolveMove(corner,{x:0,z:0,angle:0},(x,z)=>x<.2&&z<.2),'bounce');assert(corner.x===0&&corner.z===0&&corner.vx<0,'corner bounce');
const slide=createCar(.5,.5,0);slide.vx=5;slide.vz=5;assert.equal(resolveMove(slide,{x:0,z:0,angle:0},(x,z)=>z<.2),'slide');assert(slide.x===.5&&slide.z===0,'slides along a wall');
// Chase camera leans into turns and pulls in at walls.
const turning=run(by('sprinter'),t=>t<3?{throttle:1}:{throttle:1,steer:1},3.6);let cam=null;for(let i=0;i<30;i++)cam=chaseCamera(turning,cam,1/60);assert(Math.abs(cam.roll)>.02&&Math.sign(cam.roll)===Math.sign(turning.lean),'camera roll follows the lean');
const free=chaseCamera(createCar(0,0,0),null,1/60),walled=chaseCamera(createCar(0,0,0),null,1/60,{blocked:(x,z)=>z<-2});assert(free.z<-5&&walled.z>-2.1,'camera pulls in front of a wall');
// Lot: registration, level and money gates; trunk maths.
const base={vehicleOwned:true,xp:1200,cash:9000,bank:0,payment:'cash'};
assert(!lotRequest({...base,vehicleOwned:false},'tuktuk').ok,'lot needs a registered driver');assert(!lotRequest({...base,xp:0},'limo').ok,'level gate');assert(!lotRequest({...base,cash:10},'tuktuk').ok,'money gate');
assert(lotRequest(base,'sprinter').ok);assert(!lotRequest(base,'__proto__').ok);assert(!lotRequest({...base,lotCars:['tuktuk']},'tuktuk').ok,'no double purchase');assert(lotRequest({...base,lotCars:['tuktuk']},'tuktuk',true).ok&&lotOwned({lotCars:['tuktuk']},'tuktuk'));
const packs=[5,0,2],load=moveTrunk(packs,{},{type:0,qty:9,toTrunk:true,capacity:4});assert.deepEqual(load.packs,[1,0,2]);assert.equal(load.trunk[0],4);assert.equal(load.moved,4);assert(Array.isArray(load.packs)&&packs[0]===5,'trunk moves are pure and keep arrays');
const back=moveTrunk(load.packs,load.trunk,{type:0,qty:2,toTrunk:false});assert.deepEqual(back.packs,[3,0,2]);assert.equal(trunkCount(back.trunk),2);
const seized=seizeTrunk({0:5,2:1});assert.equal(seized.seized,4);assert.deepEqual(seized.trunk,{0:2});
// Models: one merged mesh per car, unique names, lot is one geometry; skid pool bounded.
const models=createLotModels();assert.equal(models.models.size,LOT_CARS.length);let meshes=0;models.group.traverse(o=>{if(o.isMesh)meshes++;});assert.equal(meshes,LOT_CARS.length,'one draw call per car body');
assert(models.select('limo')&&models.models.get('limo').visible&&!models.select('')&&!models.group.visible);
assert(buildLotGeometry().attributes.position.count>buildLotGeometry(['tuktuk']).attributes.position.count,'sold cars leave the lot');assert(lotColliders(['tuktuk']).length===5);
const scene=new THREE.Scene(),skids=createSkidMarks(scene,10);for(let i=0;i<25;i++)skids.add(i,0,0,0);assert.equal(skids.mesh.count,10);skids.update(30);assert.equal(skids.live,0,'old skid marks fade out');
assert.equal(createEngineAudio(null).live,false,'engine audio is inert without a context');
// Cruisers: spawn on roads out of reach, chase, can be outrun, and pull over a stopped car.
let seed=7;const rand=()=>(seed=(seed*16807)%2147483647)/2147483647;
const spot=cruiserSpawn({x:0,z:0},VEHICLE_ROADS,{rand,heading:0});assert(spot&&Math.hypot(spot.x,spot.z)>=48,'cruisers spawn out of view');
const st={},list=[createCruiser(spot,0)];let res;for(let i=0;i<60*20&&!res?.pulled;i++)res=stepCruisers(list,{player:{x:0,z:0,vx:0,vz:0},dt:1/60,state:st,playerSpeed:0});assert(res.pulled,'a stopped driver gets boxed in and pulled over');
const runner={x:0,z:0,vx:24,vz:0},chasers=[createCruiser({x:-30,z:0,angle:Math.PI/2},0)];for(let i=0;i<600;i++){runner.x+=24/60;res=stepCruisers(chasers,{player:runner,dt:1/60,state:{},playerSpeed:24});}assert(res.nearest>CRUISER_SPEC.top&&!res.pulled,'a fast getaway outruns the cruiser');
const hidden=stepCruisers([createCruiser({x:0,z:20,angle:0},0)],{player:{x:0,z:0},dt:1/60,sight:()=>false});assert(!hidden.seen,'no line of sight, no sighting');
assert(cruisersWanted('pursuit',true)&&!cruisersWanted('pursuit',false)&&!cruisersWanted('suspicious',true));assert(cruiserCount('all-units','low')<=2);
{const d=run(by('rustwagon'),{throttle:1},3);for(let i=0;i<40;i++)stepCar(d,{throttle:1,steer:1,handbrake:true},by('rustwagon'),1/60);for(let i=0;i<300;i++)stepCar(d,{throttle:-1},by('rustwagon'),1/60);for(let i=0;i<240;i++)stepCar(d,{},by('rustwagon'),1/60);assert(!d.drifting&&d.speed<1,'a drift never latches once the car slows: '+JSON.stringify({s:d.speed,lat:d.lat,dr:d.drifting}));}
console.log('PASS: car physics sanity (top speed, reverse, weight, braking, standstill steering, handbrake drift and recovery, NaN safety, wall slide/bounce, leaning chase camera), lot gates, trunk maths, merged models, skid pool, cruiser spawn/pull-over/outrun/sight. CPU only.');
