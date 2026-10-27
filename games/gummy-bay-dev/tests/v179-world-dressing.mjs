import assert from 'node:assert/strict';
import fs from 'node:fs';
import {OLD_SHOPS,TRADES,BOROUGHS,DRESS_KINDS,planStorefronts,frontLayout,planParked,planMoving,planGreenery,planLitter,dressDrawCalls,lodCaps,boroughAt} from '../dist/world-dressing.mjs';
import {DISTRICT_BUILDING_SITES,districtArchitectureProfile} from '../dist/district-architecture.mjs';
import {planCity} from '../dist/city-expansion.mjs';

const sites=DISTRICT_BUILDING_SITES.map(districtArchitectureProfile).filter(Boolean);
const city=planCity({obstacles:[],points:[]});
const fronts=planStorefronts({lots:city.lots,lanes:[],sites,extra:[{id:'salt-docks-shed',name:'NET MEND',district:'Salt Docks',trade:'harbor',x:400,z:-20,rot:0,w:10}]});
const byId=new Map(fronts.map(f=>[f.id,f]));
assert.equal(OLD_SHOPS.length,11);
const signs=new Set();
for(const shop of OLD_SHOPS){
 const front=byId.get(shop.id);
 assert.ok(front,shop.id);
 assert.equal(front.sign,shop.name);
 assert.match(front.sells,/\w/);
 signs.add(front.sign);
 const layout=frontLayout(front);
 for(const role of ['awning','stock','display','sign'])assert.ok(layout.some(p=>p.role===role),shop.id+' '+role);
 const sign=layout.find(p=>p.role==='sign');
 assert.equal(sign.text,shop.name);assert.equal(sign.sub,shop.sells);
 for(const prop of layout.filter(p=>p.role==='stock'||p.role==='awning')){
  const reach=prop.role==='awning'?1.7*(prop.scale||1):0.35;
  assert.ok(Math.hypot(prop.x-front.x,prop.z-front.z)-reach>=0.7,shop.id+' leaves the door');
 }
}
assert.equal(signs.size,OLD_SHOPS.length,'every walk-in shop has its own sign');
for(const lot of city.lots){
 const own=fronts.some(f=>f.id===lot.id);
 const shop=OLD_SHOPS.some(s=>Math.hypot(s.x-lot.x,s.z-lot.z)<12);
 assert.ok(own||shop,lot.id);
}
for(const site of sites){
 const door=site.front.axis==='z'
  ?{x:site.x,z:site.z+site.front.sign*(site.d/2+.45)}
  :{x:site.x+site.front.sign*(site.w/2+.45),z:site.z};
 const own=byId.get(site.id);
 const near=fronts.some(f=>(f.x-door.x)**2+(f.z-door.z)**2<9*9);
 assert.ok(own||near,site.id);
}
for(const borough of BOROUGHS){
 const here=fronts.filter(f=>f.district===borough.name);
 assert.ok(here.length>=3,borough.name);
 assert.ok(new Set(here.map(f=>f.trade)).size>=3,borough.name+' trades');
}
assert.ok(byId.get('salt-docks-shed'),'extra district fronts are dressed too');
assert.equal(boroughAt(108,-160),'East Market');
const copy=fronts.map(f=>f.sign+' '+f.sells).join(' ');
assert.doesNotMatch(copy,/drug|stash|weed|cocaine|heroin/i);
const doors=fronts.map(f=>({x:f.x,z:f.z}));
const parked=planParked({roadsZ:[0,-90,-160,-230],roadsX:[-105,105,270],doors,max:48});
assert.ok(parked.length>=8);
assert.ok(parked.some(c=>c.kind==='van')&&parked.some(c=>c.kind==='hatchback'));
assert.ok(parked.every(c=>c.kind==='van'||c.kind==='hatchback'));
assert.equal(parked.filter(c=>doors.some(d=>Math.hypot(d.x-c.x,d.z-c.z)<7)).length,0);
const moving=planMoving({roadsZ:[0,-160],roadsX:[105],count:6});
assert.equal(moving.length,6);
assert.ok(moving.some(m=>m.kind==='van')&&moving.some(m=>m.kind==='hatchback'));
const green=planGreenery({trees:[{x:12,z:-40},{x:30,z:-100},{x:80,z:-200}],planters:[{x:14,z:-42}],doors:[]});
assert.ok(green.some(g=>g.kind==='tree'||g.kind==='crooked'));
assert.ok(green.some(g=>g.kind==='grass'));
assert.ok(planLitter({greenery:green,roadsZ:[-160],doors:[]}).some(g=>g.kind==='litter'));
assert.ok(dressDrawCalls('performance')<=14);
assert.ok(lodCaps('performance').moving<=4);
assert.ok(DRESS_KINDS.includes('hatchback')&&DRESS_KINDS.includes('van')&&DRESS_KINDS.includes('tree'));
assert.ok(TRADES.length>=12);

const glb=fs.readFileSync(new URL('../dist/assets/kenney/dressing-kit.glb',import.meta.url));
const jsonLen=glb.readUInt32LE(12);
const json=JSON.parse(glb.subarray(20,20+jsonLen).toString());
const names=json.nodes.map(n=>n.name);
for(const kind of DRESS_KINDS)assert.ok(names.includes(kind),kind);
assert.equal(json.asset.copyright.includes('Kenney'),true);
const credits=fs.readFileSync(new URL('../dist/CREDITS.md',import.meta.url),'utf8');
for(const line of ['Car Kit 3.1','Survival Kit 2.0','Fantasy Town Kit 2.0','Food Kit 2.0','CC0'])assert.ok(credits.includes(line),line);
const game=fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8');
assert.match(game,/world-dressing\.mjs\?v=179/);
assert.match(game,/createWorldDressing\(/);
const idx=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
assert.match(idx,/game\.js\?v=179/);
console.log('v179 world dressing ok',fronts.length,'fronts',parked.length,'parked');
