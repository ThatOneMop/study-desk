// v173: districts beyond the old city. Narrow winding roads (the v166 laneway idea),
// alleys, and buildings whose fronts show what they sell. Chunks stream in around
// the camera; far districts collapse to one impostor. A registry of id, name,
// bounds and a locked flag is what another system can hook for level unlocks.
// No new third-party assets. Saves are not touched.
import * as THREE from './vendor/three.module.min.js';
import {sampleLane} from './winding-lanes.mjs?v=166';

const ROAD_HALF=2.5,PATH=1.45,EDGE=ROAD_HALF+PATH;
const CHUNK=64;
const KEEP={minX:-296,maxX:296,minZ:-456,maxZ:100}; // leave the existing city, including its beach edge, alone
const rng=seed=>{let a=seed>>>0||1;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};};

export const DISTRICT_DEFS=Object.freeze([
 {id:'salt-docks',name:'Salt Docks',mood:'docks',locked:false,bounds:Object.freeze({minX:300,maxX:540,minZ:-70,maxZ:52})},
 {id:'tin-terrace',name:'Tin Terrace',mood:'suburb',locked:false,bounds:Object.freeze({minX:-570,maxX:-324,minZ:-170,maxZ:48})},
 {id:'hillcrest',name:'Hillcrest',mood:'hill',locked:false,bounds:Object.freeze({minX:-110,maxX:160,minZ:-780,maxZ:-490})},
 {id:'neon-row',name:'Neon Row',mood:'neon',locked:false,bounds:Object.freeze({minX:304,maxX:540,minZ:-270,maxZ:-140})}
]);

// Live lock state. Defaults match DISTRICT_DEFS so old saves (which have no district field) stay open.
const locked=new Map(DISTRICT_DEFS.map(d=>[d.id,!!d.locked]));
const boundsOf=d=>d.bounds;
export function districtRegistry(){
 return DISTRICT_DEFS.map(d=>({id:d.id,name:d.name,bounds:{minX:d.bounds.minX,maxX:d.bounds.maxX,minZ:d.bounds.minZ,maxZ:d.bounds.maxZ},locked:!!locked.get(d.id)}));
}
export function setDistrictLocked(id,value){if(!locked.has(id))return false;locked.set(id,!!value);return true;}
export function isDistrictLocked(id){return !!locked.get(id);}
function contains(b,x,z){return x>=b.minX&&x<=b.maxX&&z>=b.minZ&&z<=b.maxZ;}
export function inKeptCity(x,z){return x>KEEP.minX&&x<KEEP.maxX&&z>KEEP.minZ&&z<KEEP.maxZ;}

// Control points leave an existing road end and then twist. Narrow, not a grid.
export const OUTER_ROADS=Object.freeze([
 {id:'wharf-road',district:'salt-docks',pts:[[262,4],[292,-2],[318,-16],[348,-6],[378,-24],[412,-8],[448,-22],[486,-4],[518,12]]},
 {id:'pier-lane',district:'salt-docks',pts:[[412,-8],[404,10],[418,28],[446,34],[470,18]]},
 {id:'rust-road',district:'tin-terrace',pts:[[-262,2],[-296,8],[-332,-6],[-368,-22],[-408,-8],[-452,-26],[-498,-8],[-540,-16]]},
 {id:'back-lane',district:'tin-terrace',pts:[[-408,-8],[-400,-40],[-436,-62],[-478,-48],[-510,-70]]},
 {id:'crest-road',district:'hillcrest',pts:[[4,-436],[14,-478],[36,-520],[-8,-568],[28,-620],[64,-668],[28,-720],[78,-758]]},
 {id:'garden-lane',district:'hillcrest',pts:[[28,-620],[62,-632],[96,-608],[128,-648],[110,-700]]},
 {id:'neon-street',district:'neon-row',pts:[[266,-160],[304,-172],[338,-196],[374,-174],[412,-206],[452,-184],[492,-210],[524,-188]]},
 {id:'club-alley',district:'neon-row',pts:[[374,-174],[392,-214],[368,-242],[414,-258],[450,-236]]}
]);

const SAMPLED=OUTER_ROADS.map(r=>({...r,samples:sampleLane(r.pts,2)}));
export function outerRoadSamples(id){return (SAMPLED.find(r=>r.id===id)||{}).samples||[];}
export function outerRoadDistance(x,z){
 let best={d:Infinity,road:null,district:null,y:0,p:null};
 if(!Number.isFinite(x)||!Number.isFinite(z))return best;
 for(const r of SAMPLED){const S=r.samples;for(let i=0;i<S.length-1;i++){const a=S[i],b=S[i+1],vx=b.x-a.x,vz=b.z-a.z,ll=vx*vx+vz*vz||1,t=Math.max(0,Math.min(1,((x-a.x)*vx+(z-a.z)*vz)/ll));
  const px=a.x+vx*t,pz=a.z+vz*t,d=Math.hypot(x-px,z-pz);if(d<best.d)best={d,road:r.id,district:r.district,y:0,p:{x:px,z:pz,tx:b.tx||0,tz:b.tz||0}};}}
 return best;
}
export function outerRoadKind(x,z){
 if(!Number.isFinite(x)||!Number.isFinite(z))return null;
 // Downtown driving never sits on an outer lane, so skip the curve search.
 if(x>-250&&x<250&&z>-420&&z<60)return null;
 const {d}=outerRoadDistance(x,z);if(!(d<=EDGE+.4))return null;return d<=ROAD_HALF?'road':'pavement';
}
export function outerPlayable(x,z){
 if(!Number.isFinite(x)||!Number.isFinite(z))return false;
 if(DISTRICT_DEFS.some(d=>contains(d.bounds,x,z)))return true;
 return outerRoadDistance(x,z).d<=EDGE+2.2;
}
export function districtAt(x,z){
 let best=null,area=Infinity;
 for(const d of DISTRICT_DEFS){const b=boundsOf(d);if(!contains(b,x,z))continue;const a=(b.maxX-b.minX)*(b.maxZ-b.minZ);if(a<area){area=a;best=d;}}
 if(!best){const near=outerRoadDistance(x,z);if(near.d<=EDGE+2.2)best=DISTRICT_DEFS.find(d=>d.id===near.district)||null;}
 if(!best)return null;
 return {id:best.id,name:best.name,bounds:{...best.bounds},locked:!!locked.get(best.id),outer:true};
}

// West connector crosses the river at x≈-302. A low arch keeps the road above the banks.
export function outerHeight(x,z){
 if(!Number.isFinite(x)||!Number.isFinite(z))return 0;
 const dx=x+302,dz=z-4,t=Math.max(0,1-Math.hypot(dx/42,dz/16));
 return t>0?2.7*t*t:0;
}
let groundFn=outerHeight;
export function outerGround(x,z){
 if(!Number.isFinite(x)||!Number.isFinite(z))return 0;
 if(x>-266&&x<266&&z>-424&&z<72)return 0;
 if(!outerPlayable(x,z))return 0;
 return groundFn(x,z)||0;
}

const GATES=[];
function placeGates(){
 GATES.length=0;
 for(const r of SAMPLED){
  const S=r.samples,p=S.find(q=>!inKeptCity(q.x,q.z));if(!p)continue;
  GATES.push({district:r.id?r.district:r.district,road:r.id,x:p.x,z:p.z,w:9,d:9,closed:false});
 }
}
placeGates();
export function districtGates(){return GATES.map(g=>({...g,closed:!!locked.get(g.district)}));}
// A locked district, and the lane that leads into it, stops you once you leave the old city.
// The kept city itself is never closed, so a lock cannot wall off an existing street.
export function outerBlocked(x,z){
 if(!Number.isFinite(x)||!Number.isFinite(z)||inKeptCity(x,z))return false;
 const here=districtAt(x,z);
 return !!here?.locked;
}

const LOOK={
 docks:{ground:0x3c4036,wall:[0x4a524c,0x5c564c,0x3e4744],roof:[0x3a342e,0x4e443c],trim:0x6b5344,sign:0xc4b48a,asphalt:0x343532,path:0x6a655c},
 suburb:{ground:0x463f36,wall:[0x6d5a4a,0x5a5048,0x7a6856],roof:[0x5c4034,0x3a342e],trim:0x2e2a26,sign:0xd8c8a4,asphalt:0x3a3832,path:0x6e675c},
 hill:{ground:0x4a4e42,wall:[0x8a8478,0x968e82,0x6e6a62],roof:[0x6a5a4c,0x4a4038],trim:0x3c4a40,sign:0xf0e6d0,asphalt:0x3c3d3a,path:0x7c776e},
 neon:{ground:0x2c282a,wall:[0x3a3438,0x2a3034,0x4a3c40],roof:[0x221e22,0x1a1e22],trim:0xc45a62,sign:0xe0b45a,asphalt:0x2c2c2e,path:0x3e3c3a}
};
const TRADES={
 docks:['bait','chandlery','diesel','smokehouse','boatyard','warehouse','nets'],
 suburb:['corner','laundrette','pawn','garage','grocer','boarded','club'],
 hill:['cafe','florist','tailor','villa','gallery','lookout'],
 neon:['arcade','diner','club','noodle','hotel','pawn']
};
// Storefront props in local metres: x across the front, y up, z out from the wall. Each shows the trade.
const DISPLAY={
 bait:[[0,.15,.3,1.3,.45,.7,0x6a5038],[.9,.7,.2,.35,.7,.35,0xc45a3a],[-.8,.4,.25,.5,.3,.4,0x4a6a58]],
 chandlery:[[-.4,.2,.3,1.1,.4,.6,0x5a5044],[.7,1.1,.15,.2,1.3,.2,0xc4b06a],[.7,1.7,.15,.45,.12,.45,0xe6d7a4]],
 diesel:[[-.6,.35,.4,.7,.7,.7,0x8a3a32],[.5,.35,.4,.7,.7,.7,0x3a3e36],[0,.9,.5,.35,.5,.35,0x2a2c28]],
 smokehouse:[[0,2.4,-.2,.6,1.6,.6,0x4a4038],[.8,.3,.3,.9,.4,.5,0x8a6a48],[-.7,.5,.25,.4,.8,.3,0x6a5040]],
 boatyard:[[.2,.45,.6,2.2,.5,1.1,0x8a5a3a],[0,1.3,-.4,.15,2.2,.15,0x3a3e40],[-1,.7,.2,.4,.3,.8,0x4a4038]],
 warehouse:[[0,.9,.15,2.4,1.8,.2,0x3a403c],[.9,.3,.5,.7,.5,.7,0x6a5840],[-.9,.3,.5,.7,.5,.7,0x6a5840]],
 nets:[[-.6,1,.2,.08,1.6,.08,0x5a5048],[.6,1,.2,.08,1.6,.08,0x5a5048],[0,1.5,.2,1.5,.08,.08,0x3e6a58]],
 corner:[[0,2.2,.15,2.2,.18,.7,0x8a4038],[-.5,.3,.4,.6,.4,.5,0x6a8a48],[.6,.25,.4,.5,.35,.5,0xc4a05a]],
 laundrette:[[-.5,.8,.2,.7,.9,.15,0xd8d2c4],[.5,.8,.2,.7,.9,.15,0xb9c4c8],[0,1.8,.2,.4,.5,.2,0x8aa0a4]],
 pawn:[[0,1.6,.2,1.4,.5,.15,0xc4b06a],[-.8,.6,.2,.35,.7,.12,0x2a2622],[.8,.6,.2,.35,.7,.12,0x2a2622]],
 garage:[[.3,.7,.8,2,.7,1.2,0x3a6a8a],[0,1.6,-.3,.12,1.4,.12,0x2a2c28],[.9,.3,.2,.4,.4,.4,0x6a4034]],
 grocer:[[-.7,.3,.4,.7,.45,.6,0x6a8a44],[0,.55,.45,.7,.4,.55,0xc45a3a],[.75,.25,.4,.6,.35,.5,0xd8c07a]],
 boarded:[[-.6,.9,.12,.7,.8,.08,0x4a4034],[.5,1,.12,.8,.7,.08,0x3a342c],[0,.25,.4,.8,.3,.5,0x2e2a26]],
 club:[[0,1.7,.2,1.6,.35,.12,0x8a3040],[-.8,.4,.3,.4,.5,.4,0x2a2628],[.8,.4,.3,.4,.5,.4,0x2a2628]],
 cafe:[[-.6,.45,.6,.7,.7,.7,0xf0e6d4],[.7,.45,.6,.7,.7,.7,0xf0e6d4],[0,2.15,.2,2,.16,.8,0x6a4038]],
 florist:[[-.6,.3,.4,.8,.4,.6,0x3e6a40],[0,.55,.45,.7,.35,.5,0xc45a6a],[.7,.4,.4,.6,.5,.5,0xe6d26a]],
 tailor:[[0,.8,.3,.5,1.5,.4,0xd8c8b0],[0,1.55,.3,.35,.2,.35,0x4a4038],[.8,1.2,.2,.7,.9,.08,0x6a4038]],
 villa:[[-.8,.4,.5,1.2,.35,.4,0x3e5a40],[.8,.4,.5,1.2,.35,.4,0x3e5a40],[0,2.4,-.2,.8,.5,.5,0x8a8478]],
 gallery:[[0,1.2,.12,2,1.6,.1,0xd8d2c6],[.9,.5,.4,.4,.7,.4,0x8a8478]],
 lookout:[[-1.1,.5,.2,.1,.9,.1,0x4a4038],[1.1,.5,.2,.1,.9,.1,0x4a4038],[0,.95,.2,2.3,.08,.08,0x4a4038]],
 arcade:[[0,2.3,.2,2.2,.4,.15,0xe0b45a],[-.6,.7,.2,.5,.8,.12,0x3a8a9a],[.6,.7,.2,.5,.8,.12,0xc45a6a]],
 diner:[[-.8,.45,.55,.5,.7,.5,0xc45a4a],[0,.45,.55,.5,.7,.5,0xe6dcc8],[.8,.45,.55,.5,.7,.5,0xc45a4a],[0,2.2,.2,2,.2,.5,0xe0b45a]],
 noodle:[[0,2.1,.2,1.8,.28,.6,0xc45a3a],[-.4,.3,.4,.6,.4,.5,0xe6d2a8],[.5,.35,.4,.5,.45,.5,0x6a8a48]],
 hotel:[[0,2.6,-.3,.5,1.2,.5,0x8a8478],[-.7,1,.2,.4,.6,.1,0xe0b45a],[.7,1,.2,.4,.6,.1,0xe0b45a]]
};

function obb(o){const c=Math.cos(o.rot),s=Math.sin(o.rot),hw=o.w/2,hd=o.d/2;return [[-hw,-hd],[hw,-hd],[hw,hd],[-hw,hd]].map(([a,b])=>[o.x+a*c+b*s,o.z-a*s+b*c]);}
function overlap(a,b,pad=0.4){
 const ca=obb(a),cb=obb(b);
 for(const C of [ca,cb])for(let i=0;i<4;i++){const p=C[i],q=C[(i+1)%4],nx=q[1]-p[1],nz=p[0]-q[0],l=Math.hypot(nx,nz)||1;
  const pa=ca.map(v=>v[0]*nx+v[1]*nz),pb=cb.map(v=>v[0]*nx+v[1]*nz);
  if(Math.max(...pa)+pad*l<Math.min(...pb)||Math.max(...pb)+pad*l<Math.min(...pa))return false;}
 return true;
}
export function planOuterLots(seed=173){
 const r=rng(seed),lots=[];
 for(const road of SAMPLED){const S=road.samples;if(S.length<4)continue;const total=S[S.length-1].s;const mood=DISTRICT_DEFS.find(d=>d.id===road.district).mood;const trades=TRADES[mood];
  for(const side of [-1,1]){let s=7+r()*3,n=0;
   while(s<total-6){const w=5.2+r()*3.4,d=6.2+r()*2.6,mid=s+w/2;let i=S.findIndex(p=>p.s>=mid);if(i<0)break;const p=S[i];
    const nx=-p.tz*side,nz=p.tx*side,rot=Math.atan2(-nx,-nz);
    let placed=false;
    for(let push=0;push<=3&&!placed;push+=.6){const lot={id:road.id+'-'+lots.length,district:road.district,mood,trade:trades[n%trades.length],x:p.x+nx*(EDGE+.6+d/2+push),z:p.z+nz*(EDGE+.6+d/2+push),w,d,rot,floors:mood==='hill'?2+Math.floor(r()*2):1+Math.floor(r()*3),seed:Math.floor(r()*1e9)};
     const cs=obb(lot);const onRoad=cs.some(c=>outerRoadDistance(c[0],c[1]).d<EDGE-.1);
     if(onRoad||inKeptCity(lot.x,lot.z)||!contains(DISTRICT_DEFS.find(d=>d.id===road.district).bounds,lot.x,lot.z))continue;
     if(lots.some(o=>o.district===lot.district&&overlap(o,lot)))continue;
     lot.bb={x0:Math.min(...cs.map(c=>c[0])),x1:Math.max(...cs.map(c=>c[0])),z0:Math.min(...cs.map(c=>c[1])),z1:Math.max(...cs.map(c=>c[1]))};
     lots.push(lot);n++;s+=w+1.15+r()*1.15;placed=true;}
    if(!placed)s+=2;
   }
  }
 }
 return lots;
}

const RADII={performance:{near:100,far:480},balanced:{near:160,far:680},high:{near:220,far:860}};
function chunkKey(x,z){return Math.floor(x/CHUNK)+','+Math.floor(z/CHUNK);}
function inCityCore(x,z){return x>-248&&x<248&&z>-400&&z<55;}

export function createOuterDistricts({scene,quality='balanced',height=outerHeight}={}){
 groundFn=typeof height==='function'?height:outerHeight;
 const lots=planOuterLots(),lookups=new Map(DISTRICT_DEFS.map(d=>[d.id,d]));
 const chunks=new Map(),lamps=[];
 const geos=new Map(); // key -> {pos,col,idx}
 const grab=key=>{let g=geos.get(key);if(!g){g={pos:[],col:[],idx:[]};geos.set(key,g);}return g;};
 const C=new THREE.Color();
 const put=(key,verts,hex)=>{const g=grab(key),base=g.pos.length/3;C.setHex(hex);for(const v of verts){g.pos.push(v[0],v[1],v[2]);g.col.push(C.r,C.g,C.b);}g.idx.push(base,base+1,base+2,base,base+2,base+3);};
 const quad=(x,z,y,w,d,hex)=>{const k=chunkKey(x,z);put(k,[[x-w/2,y,z-d/2],[x+w/2,y,z-d/2],[x+w/2,y,z+d/2],[x-w/2,y,z+d/2]],hex);};
 const box=(x,y,z,w,h,d,rot,hex,key)=>{const c=Math.cos(rot),s=Math.sin(rot),P=(a,b,e)=>[x+a*c+e*s,y+b,z-a*s+e*c],hw=w/2,hd=d/2;
  const v=[P(-hw,0,-hd),P(hw,0,-hd),P(hw,0,hd),P(-hw,0,hd),P(-hw,h,-hd),P(hw,h,-hd),P(hw,h,hd),P(-hw,h,hd)];
  const k=key||chunkKey(x,z);
  put(k,[v[4],v[7],v[6],v[5]],hex);put(k,[v[0],v[1],v[5],v[4]],hex);put(k,[v[1],v[2],v[6],v[5]],hex);put(k,[v[2],v[3],v[7],v[6]],hex);put(k,[v[3],v[0],v[4],v[7]],hex);
 };
 // Dirt under each district, one quad per chunk, below the road so the ocean does not show through.
 for(const d of DISTRICT_DEFS){const L=LOOK[d.mood],b=d.bounds;
  for(let x=Math.floor(b.minX/CHUNK)*CHUNK;x<b.maxX;x+=CHUNK)for(let z=Math.floor(b.minZ/CHUNK)*CHUNK;z<b.maxZ;z+=CHUNK){
   const x0=Math.max(b.minX,x),x1=Math.min(b.maxX,x+CHUNK),z0=Math.max(b.minZ,z),z1=Math.min(b.maxZ,z+CHUNK);
   const cx=(x0+x1)/2,cz=(z0+z1)/2,y=groundFn(cx,cz)-.02;
   put(chunkKey(x+.1,z+.1),[[x0,y,z0],[x1,y,z0],[x1,y,z1],[x0,y,z1]],L.ground);
  }
 }
 // Dirt skirt and narrow road along every outer curve. Segments buried in the old town are skipped.
 for(const road of SAMPLED){const S=road.samples,mood=lookups.get(road.district).mood,L=LOOK[mood];
  for(let i=0;i<S.length-1;i++){const a=S[i],b=S[i+1];if(inCityCore(a.x,a.z)&&inCityCore(b.x,b.z))continue;const ya=groundFn(a.x,a.z),yb=groundFn(b.x,b.z);
   const off=(p,y,o,h)=>[p.x-p.tz*o,y+h,p.z+p.tx*o];
   const k=chunkKey((a.x+b.x)/2,(a.z+b.z)/2);
   const skirt=EDGE+1.15;
   put(k,[off(a,ya,-skirt,.0),off(a,ya,skirt,.0),off(b,yb,skirt,.0),off(b,yb,-skirt,.0)],L.ground);
   put(k,[off(a,ya,-ROAD_HALF,.04),off(a,ya,ROAD_HALF,.04),off(b,yb,ROAD_HALF,.04),off(b,yb,-ROAD_HALF,.04)],L.asphalt);
   for(const side of [-1,1]){const o0=side*ROAD_HALF,o1=side*EDGE;
    put(k,[off(a,ya,o0,.08),off(a,ya,o1,.16),off(b,yb,o1,.16),off(b,yb,o0,.08)],L.path);
   }
   if(i%8===0){const side=i%16?1:-1,o=side*(EDGE-.3);lamps.push({x:a.x-a.tz*o,y:groundFn(a.x,a.z),z:a.z+a.tx*o,mood});}
  }
 }
 const colliders=[];
 for(const lot of lots){const L=LOOK[lot.mood],r=rng(lot.seed),wall=L.wall[Math.floor(r()*L.wall.length)],roof=L.roof[Math.floor(r()*L.roof.length)],wallH=2.6+lot.floors*1.15+r()*0.4;
  let y=groundFn(lot.x,lot.z);for(const [a,b] of [[lot.w/2,0],[-lot.w/2,0],[0,lot.d/2],[0,-lot.d/2]])y=Math.min(y,groundFn(lot.x+a,lot.z+b));
  const crown=groundFn(lot.x,lot.z),h=wallH+(crown-y),key=chunkKey(lot.x,lot.z);
  box(lot.x,y,lot.z,lot.w,h,lot.d,lot.rot,wall,key);
  box(lot.x,y+h,lot.z,lot.w+.3,.28,lot.d+.2,lot.rot,roof,key);
  // Uneven roof cap and a lean-to so the block is not a plain box.
  if(r()>.4)box(lot.x+Math.cos(lot.rot)*(lot.w*.2),y+h+.28,lot.z-Math.sin(lot.rot)*(lot.w*.2),lot.w*.45,.5+r()*.8,lot.d*.4,lot.rot,roof,key);
  if(r()>.55){const ox=Math.cos(lot.rot+1.2)*lot.w*.35,oz=-Math.sin(lot.rot+1.2)*lot.w*.35;box(lot.x+ox,y,lot.z+oz,lot.w*.35,h*.55,lot.d*.4,lot.rot+r()*.2,L.trim,key);}
  const near=outerRoadDistance(lot.x,lot.z).p;const dx=near?near.x-lot.x:Math.sin(lot.rot),dz=near?near.z-lot.z:Math.cos(lot.rot),len=Math.hypot(dx,dz)||1,ux=dx/len,uz=dz/len;
  const px=lot.x+ux*(lot.d/2+.15),pz=lot.z+uz*(lot.d/2+.15),face=Math.atan2(ux,uz),rx=-uz,rz=ux,fy=groundFn(px,pz);
  const show=DISPLAY[lot.trade]||DISPLAY.corner;
  box(px,fy+2.15,pz,Math.min(lot.w*.8,3.2),.12,.9,face,L.trim,key);
  box(px,fy+2.45,pz,Math.min(lot.w*.7,2.6),.55,.12,face,L.sign,key);
  for(const [lx,ly,lz,w,hh,dd,col] of show)box(px+rx*lx+ux*lz,fy+ly,pz+rz*lx+uz*lz,w,hh,dd,face,col,key);
  if(r()>.5){const sx=px-uz*1.3,sz=pz+ux*1.3;box(sx,y,sz,.55,.9,.5,face,r()>.5?0x2e4a38:0x3a3e44,key);if(r()>.6)box(sx+ux*.8,y,sz+uz*.8,.7,.35,.6,face,0x5a5044,key);}
  const bw=Math.max(1.4,(lot.bb.x1-lot.bb.x0)-.4),bd=Math.max(1.4,(lot.bb.z1-lot.bb.z0)-.4);
  colliders.push({x:(lot.bb.x0+lot.bb.x1)/2,z:(lot.bb.z0+lot.bb.z1)/2,w:bw,d:bd,outerLot:lot.id});
 }
 // Windows: a darker inset on the front, varied per seed, still inside the chunk mesh.
 for(const lot of lots){const r=rng(lot.seed^99),L=LOOK[lot.mood],y=groundFn(lot.x,lot.z),near=outerRoadDistance(lot.x,lot.z).p;
  const dx=(near?.x??lot.x)-lot.x,dz=(near?.z??lot.z)-lot.z,len=Math.hypot(dx,dz)||1,ux=dx/len,uz=dz/len,face=Math.atan2(ux,uz),key=chunkKey(lot.x,lot.z);
  const cols=1+Math.floor(r()*3),dark=r()>.7;
  for(let k=0;k<cols;k++){const lx=(k-(cols-1)/2)*1.05;box(lot.x+ux*(lot.d/2-.05)-uz*lx,y+1.15+(lot.floors>2?.4:0),lot.z+uz*(lot.d/2-.05)+ux*lx,.55,.7,.08,face,dark?0x2a2622:(lot.mood==='neon'?0x6a8a90:0x8aa0a4),key);}
  if(lot.mood==='suburb'&&r()>.45)box(lot.x+ux*(lot.d/2+.02),y+1.2,lot.z+uz*(lot.d/2+.02),.9,.75,.06,Math.atan2(ux,uz),0x4a4034,key);
 }
 const mat=new THREE.MeshLambertMaterial({vertexColors:true});
 const meshes=[];
 for(const [key,g] of geos){const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(g.pos,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(g.col,3));geo.setIndex(g.idx);geo.computeVertexNormals();geo.computeBoundingSphere();
  const mesh=new THREE.Mesh(geo,mat);mesh.name='Outer district chunk';mesh.visible=false;mesh.matrixAutoUpdate=false;mesh.updateMatrix();const [ix,iz]=key.split(',').map(Number);mesh.userData.cx=(ix+.5)*CHUNK;mesh.userData.cz=(iz+.5)*CHUNK;mesh.userData.key=key;scene?.add(mesh);meshes.push(mesh);}
 // One instanced lamp for the whole outer town. Hidden until a chunk is near.
 const lampGeo=new THREE.BoxGeometry(.16,3.1,.16);lampGeo.translate(0,1.55,0);
 const lampMat=new THREE.MeshLambertMaterial({color:0x6a655c});
 const lampMesh=new THREE.InstancedMesh(lampGeo,lampMat,Math.max(1,lamps.length));lampMesh.name='Outer district lamps';lampMesh.count=lamps.length;
 const M=new THREE.Matrix4(),Q=new THREE.Quaternion(),S=new THREE.Vector3(1,1,1),P=new THREE.Vector3();
 lamps.forEach((l,i)=>{P.set(l.x,l.y,l.z);M.compose(P,Q,S);lampMesh.setMatrixAt(i,M);});lampMesh.instanceMatrix.needsUpdate=true;lampMesh.visible=false;scene?.add(lampMesh);
 // Far LOD: one box cluster per district.
 const impostors=[];
 for(const d of DISTRICT_DEFS){const L=LOOK[d.mood],b=d.bounds,cx=(b.minX+b.maxX)/2,cz=(b.minZ+b.maxZ)/2,pos=[],col=[],idx=[];
  const add=(x,y,z,w,h,dd,hex)=>{const base=pos.length/3;C.setHex(hex);const vs=[[-w/2,0,-dd/2],[w/2,0,-dd/2],[w/2,0,dd/2],[-w/2,0,dd/2],[-w/2,h,-dd/2],[w/2,h,-dd/2],[w/2,h,dd/2],[-w/2,h,dd/2]];
   for(const v of [vs[4],vs[7],vs[6],vs[5]]){pos.push(x+v[0],y+v[1],z+v[2]);col.push(C.r,C.g,C.b);}idx.push(base,base+1,base+2,base,base+2,base+3);};
  const mine=lots.filter(l=>l.district===d.id).slice(0,8);
  for(const lot of mine)add(lot.x,groundFn(lot.x,lot.z),lot.z,lot.w,6+lot.floors*2,lot.d,L.wall[0]);
  if(!mine.length)add(cx,0,cz,18,8,12,L.wall[0]);
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(col,3));geo.setIndex(idx);geo.computeVertexNormals();geo.computeBoundingSphere();
  const mesh=new THREE.Mesh(geo,mat);mesh.name='Outer district impostor';mesh.visible=false;scene?.add(mesh);impostors.push({id:d.id,mesh,x:cx,z:cz});
 }
 let mode=quality;
 function update(camera){
  const q=RADII[mode]||RADII.balanced,cx=camera?.position?.x??0,cz=camera?.position?.z??0;let near=false;
  for(const mesh of meshes){const d=Math.hypot(mesh.userData.cx-cx,mesh.userData.cz-cz);mesh.visible=d<q.near;if(mesh.visible)near=true;}
  lampMesh.visible=near&&mode!=='performance';
  for(const imp of impostors){const own=meshes.some(m=>m.visible&&lots.some(l=>l.district===imp.id&&chunkKey(l.x,l.z)===m.userData.key));
   const d=Math.hypot(imp.x-cx,imp.z-cz);imp.mesh.visible=!own&&d<q.far&&d>q.near*.45;}
 }
 function drawCalls(){return meshes.filter(m=>m.visible).length+impostors.filter(i=>i.mesh.visible).length+(lampMesh.visible?1:0);}
 function setQuality(q){mode=q||mode;}
 const triangles=meshes.reduce((n,m)=>n+(m.geometry.index?.count||0)/3,0);
 return {lots,colliders,meshes,impostors,lampMesh,update,setQuality,drawCalls,triangles,gates:districtGates};
}

export function outerMapRoads(){return SAMPLED.map(r=>r.samples.map(p=>[p.x,p.z]));}
export function outerMapLots(lots){return (lots||[]).map(l=>({x:l.x,z:l.z,w:l.w,d:l.d,district:l.district}));}
