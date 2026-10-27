import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from '../dist/vendor/three.module.min.js';
import {DISTRICT_DEFS,districtRegistry,setDistrictLocked,isDistrictLocked,outerPlayable,outerBlocked,outerGround,outerRoadKind,districtAt,planOuterLots,createOuterDistricts,outerRoadSamples} from '../dist/outer-districts.mjs';

const ids=['salt-docks','tin-terrace','hillcrest','neon-row'];
const list=districtRegistry();
assert.deepEqual(list.map(d=>d.id),ids);
for(const d of list){
 assert.equal(typeof d.name,'string');assert.ok(d.name.length>2);
 assert.ok(d.bounds.maxX>d.bounds.minX&&d.bounds.maxZ>d.bounds.minZ);
 assert.equal(d.locked,false);
 assert.ok(d.bounds.minX<-280||d.bounds.maxX>280||d.bounds.minZ<-449||d.bounds.maxZ>95,'district sits beyond the old city');
}
assert.equal(setDistrictLocked('neon-row',true),true);
assert.equal(isDistrictLocked('neon-row'),true);
assert.equal(districtRegistry().find(d=>d.id==='neon-row').locked,true);
assert.equal(setDistrictLocked('missing',true),false);
assert.equal(outerBlocked(0,0),false,'a lock never closes the old town');
assert.equal(outerBlocked(270,0),false);
assert.equal(outerBlocked(420,-200),true,'locked Neon Row stops you');
setDistrictLocked('neon-row',false);
assert.equal(outerBlocked(420,-200),false);

assert.equal(outerPlayable(420,-10),true);
assert.equal(outerPlayable(0,0),false);
assert.equal(outerPlayable(20,80),false,'the beach edge is not a new district');
assert.equal(districtAt(420,-10).name,'Salt Docks');
assert.equal(districtAt(420,-10).outer,true);
assert.equal(outerRoadKind(420,-10),'road');
const beside=outerRoadSamples('wharf-road')[30];
assert.equal(outerRoadKind(beside.x-beside.tz*3.4,beside.z+beside.tx*3.4),'pavement');
const samples=outerRoadSamples('wharf-road');
const zs=samples.map(p=>p.z);
assert.ok(Math.max(...zs)-Math.min(...zs)>12,'the wharf road bends');
assert.ok(outerGround(-302,4)>2,'west lane arches over the river');
assert.equal(outerGround(0,0),0);

const lots=planOuterLots();
for(const id of ids)assert.ok(lots.filter(l=>l.district===id).length>=20,id+' has buildings');
for(const trade of ['bait','chandlery','pawn','villa','arcade','club'])assert.ok(lots.some(l=>l.trade===trade),trade);
const scene=new THREE.Scene();
const built=createOuterDistricts({scene,quality:'performance'});
built.update({position:{x:0,y:2,z:10}});
const originCalls=built.drawCalls();
assert.ok(originCalls<=6,'Low view of the old town adds '+originCalls+' outer draw calls');
assert.equal(built.meshes.filter(m=>m.visible).length,0);
built.update({position:{x:420,y:3,z:-8}});
const dockCalls=built.drawCalls();
assert.ok(dockCalls>0&&dockCalls<=20,'Low view inside Salt Docks is '+dockCalls+' draw calls');
built.setQuality('high');
built.update({position:{x:420,y:3,z:-8}});
assert.ok(built.drawCalls()>=dockCalls);

const game=fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8');
assert.match(game,/outer-districts\.mjs\?v=175/);
assert.match(game,/window\.GUMMY_DISTRICTS=/);
assert.match(game,/outerPlayable/);
assert.doesNotMatch(game,/s\.districts\s*=/);
const html=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
assert.match(html,/game\.js\?v=175/);
const world=game.match(/const WORLD=\{minX:(-?\d+),maxX:(-?\d+)/);
assert.equal(world[1],'-280');assert.equal(world[2],'280');
assert.equal(DISTRICT_DEFS.length,4);
console.log('PASS v175 districts: '+lots.length+' lots, Low draw calls '+originCalls+' at the old town and '+dockCalls+' in Salt Docks');
