// v133 City expansion, phase 1 (P1-3). Fills the empty frontages of Gummy Bay
// with compact, Hyland Point-style filler: terraced brick shops, stucco corner
// stores, weatherboard houses, tin warehouses, flats with fire escapes, a motel,
// a car wash and the Lucky Pier prize arcade, plus the elevated expressway,
// alleys, dumpsters, power lines and graffiti. Layout is planned
// deterministically around every existing collider, gameplay point and access
// corridor, so shops, homes and stations stay reachable.
import * as THREE from './vendor/three.module.min.js';
import {CityBatch,TILE,TAGS,ARCHETYPES,buildLot,createCityMaterials,rng} from './building-kit.mjs?v=155';
import {NAMED_BUSINESSES,GENERIC_SIGNS,HIGHWAY_SIGNS,SIGN_SPECS,SignBatch,createSignMaterial} from './town-signs.mjs?v=133';

export const CITY_BOUNDS=Object.freeze({minX:-284,maxX:284,minZ:-449,maxZ:92});
const ROAD_Z=[0,-90,-160,-230,-300,-370,-435],ROAD_X=[-270,-105,105,270];
export const CITY_ROADS=Object.freeze({z:ROAD_Z,x:ROAD_X});
// v163: fronts sit about a metre off the pavement edge (pavement ends 10.1 m from the road centre; the planner grid is 1 m).
export const FRONT_OFFSET=11;
export const OVERPASS=Object.freeze({z:-90,y:7.6,halfWidth:8.6,pillarOffset:10.55,x0:-430,x1:430,spacing:22});
// Areas that stay open: Old Town's crowd, campsite and pier; the loading flyover's
// campsite glide; Gumdrop Terrace ramps; hill tops.
export const CITY_RESERVED=Object.freeze([
 {x0:-80,x1:80,z0:-40,z1:53,why:'Old Town crowd, shops and campsite'},
 {x0:-112,x1:-60,z0:22,z1:64,why:'Loading flyover campsite glide'},
 {x0:-61,x1:-45,z0:-82,z1:-42,why:'Gumdrop Terrace ramps'},
 {x0:-16,x1:16,z0:50,z1:95,why:'Pier walk'},
 {x0:-210,x1:-170,z0:-84,z1:-44,why:'West hillside'},{x0:170,x1:210,z0:-84,z1:-44,why:'East hillside'}
]);
const NAMED_MAIN=['arcade','taco','noodle','burger','pawn','coffee','donut','laundry','chicken','pretzel','mart','open','motel','carwash','tackle','flats'];
const GENERIC_MIX=[['house',22],['terrace',22],['shop',16],['flats',11],['warehouse',9],['container',3],['laundromat',4],['pawn',4],['diner',4],['carwash',1.5]];
const INFILL_MIX=[['warehouse',22],['house',24],['flats',14],['terrace',14],['container',10],['shop',8],['laundromat',4],['pawn',4]];
const COMMERCIAL_MIX=[['terrace',34],['shop',30],['flats',12],['diner',8],['pawn',6],['laundromat',6],['container',4]];

/* ---------- occupancy grid ---------- */
class Grid{
 constructor(b=CITY_BOUNDS){this.b=b;this.w=Math.ceil(b.maxX-b.minX)+1;this.h=Math.ceil(b.maxZ-b.minZ)+1;this.cells=new Uint8Array(this.w*this.h);}
 _r(x0,x1,z0,z1){const b=this.b;return [Math.max(0,Math.floor(x0-b.minX)),Math.min(this.w-1,Math.ceil(x1-b.minX)-1),Math.max(0,Math.floor(z0-b.minZ)),Math.min(this.h-1,Math.ceil(z1-b.minZ)-1)];}
 mark(x0,x1,z0,z1,v=1){const [a,b,c,d]=this._r(x0,x1,z0,z1);for(let z=c;z<=d;z++)this.cells.fill(v,z*this.w+a,z*this.w+b+1);}
 free(x0,x1,z0,z1){const B=this.b;if(x0<B.minX||x1>B.maxX||z0<B.minZ||z1>B.maxZ)return false;const [a,b,c,d]=this._r(x0,x1,z0,z1);for(let z=c;z<=d;z++){const row=z*this.w;for(let x=a;x<=b;x++)if(this.cells[row+x])return false;}return true;}
}
const rect=(x,z,w,d)=>({x0:x-w/2,x1:x+w/2,z0:z-d/2,z1:z+d/2});
function nearestRoad(x,z){
 let best=null;
 for(const r of ROAD_Z){const dd=Math.abs(z-r);if(!best||dd<best.d)best={axis:'z',at:r,d:dd};}
 for(const r of ROAD_X){if(z>-7)continue;const dd=Math.abs(x-r);if(dd<best.d)best={axis:'x',at:r,d:dd};}
 const dx=Math.abs(x);if(dx<best.d)best={axis:'x',at:0,d:dx};
 return best;
}
function corridor(grid,x,z,width=5,reach=46){
 const road=nearestRoad(x,z);if(!road||road.d>reach)return;
 if(road.axis==='z')grid.mark(x-width/2,x+width/2,Math.min(z,road.at),Math.max(z,road.at),1);
 else grid.mark(Math.min(x,road.at),Math.max(x,road.at),z-width/2,z+width/2,1);
}

// Frontage runs: lines just behind each pavement. `rot` is the facing angle
// (0 → building front faces +z).
export function frontageRuns(){
 const runs=[];
 for(const r of ROAD_Z)for(const s of [-1,1]){
  if(r===0){for(const [a,b] of [[-284,-60],[60,284]])runs.push({axis:'x',from:a,to:b,line:r+s*FRONT_OFFSET,grow:s,rot:s>0?Math.PI:0,road:r});}
  else runs.push({axis:'x',from:-284,to:284,line:r+s*FRONT_OFFSET,grow:s,rot:s>0?Math.PI:0,road:r});
 }
 for(const r of ROAD_X)for(const s of [-1,1])runs.push({axis:'z',from:-449,to:-7,line:r+s*FRONT_OFFSET,grow:s,rot:s>0?-Math.PI/2:Math.PI/2,road:r});
 for(const s of [-1,1]){
  runs.push({axis:'z',from:-449,to:-79,line:s*FRONT_OFFSET,grow:s,rot:s>0?-Math.PI/2:Math.PI/2,road:0});
  // Main Drag: the old avenue north of the shops; west front is set back for the beat-cop route.
  runs.push({axis:'z',from:-80,to:-40,line:s>0?FRONT_OFFSET:-13.6,grow:s,rot:s>0?-Math.PI/2:Math.PI/2,road:0,main:true});
  // Driftwood waterfront along the pier road.
  runs.push({axis:'z',from:53,to:90,line:s*FRONT_OFFSET,grow:s,rot:s>0?-Math.PI/2:Math.PI/2,road:0,south:true});
 }
 return runs;
}
const runScore=run=>{const mx=run.axis==='x'?0:run.line,mz=run.axis==='x'?run.line:(run.from+run.to)/2;return (run.main?-1000:0)+Math.hypot(mx,(mz+60)*1.4)+(run.road===-90?-60:0);};

function weighted(r,list){const total=list.reduce((n,[,w])=>n+w,0);let t=r()*total;for(const [k,w] of list){if((t-=w)<=0)return k;}return list[0][0];}
const between=(r,[a,b])=>a+(b-a)*r();

// Pure layout. obstacles: collider boxes; points: gameplay points.
export function planCity({obstacles=[],points=[],routes=[],reserved=CITY_RESERVED,seed=131}={}){
 const grid=new Grid(),r=rng(seed);
 // roads and pavements
 for(const z of ROAD_Z)grid.mark(-400,400,z-10.3,z+10.3);
 for(const x of ROAD_X)grid.mark(x-10.3,x+10.3,-460,-7+10.3);
 grid.mark(-10.3,10.3,-460,-72);grid.mark(-12.9,11.4,-90,0);grid.mark(-10.3,10.3,0,100);
 for(const q of reserved)grid.mark(q.x0,q.x1,q.z0,q.z1);
 for(const o of obstacles){if(!(o?.w>0&&o?.d>0))continue;const big=o.w*o.d>=30,m=big?2:1.1;grid.mark(o.x-o.w/2-m,o.x+o.w/2+m,o.z-o.d/2-m,o.z+o.d/2+m);
  if(o.w*o.d>=100){for(const s of [-1,1]){const road=ROAD_Z.reduce((a,b)=>Math.abs(o.z+s*o.d/2-b)<Math.abs(o.z+s*o.d/2-a)?b:a);if(Math.sign(road-o.z)===s&&Math.abs(road-o.z)<o.d/2+34)grid.mark(o.x-2.6,o.x+2.6,Math.min(o.z,road),Math.max(o.z,road));}}}
 for(const p of points){if(!Number.isFinite(p?.x)||!Number.isFinite(p?.z))continue;const minor=p.type==='litter'||p.type==='prop',rad=minor?1.5:5.5;grid.mark(p.x-rad,p.x+rad,p.z-rad,p.z+rad);if(!minor)corridor(grid,p.x,p.z,5);}
 // patrol and walk routes keep a 2.4 m clear lane either side
 for(const r of routes)for(let k=0;k<r.length;k++){const a=r[k],b=r[(k+1)%r.length];grid.mark(Math.min(a[0],b[0])-2.4,Math.max(a[0],b[0])+2.4,Math.min(a[1],b[1])-2.4,Math.max(a[1],b[1])+2.4);}
 // overpass pillars keep their pavement edge
 const lots=[],named=[...NAMED_MAIN],alleys=[];
 const runs=frontageRuns().sort((a,b)=>runScore(a)-runScore(b));
 for(const run of runs){
  const commercial=run.main||run.south||run.road===-90||(run.axis==='z'&&run.road===0&&run.from>-300);
  let pos=run.from,sinceAlley=0;
  while(pos<run.to-5){
   // named business first if it fits here
   let choice=null;
   for(let i=0;i<named.length&&!choice;i++){const spec=NAMED_BUSINESSES.find(b=>b.key===named[i]);const a=ARCHETYPES[spec.type];
    if(spec.key==='motel'&&!(run.south||run.road===-90||run.road===0))continue;
    for(const w of [a.w[1],(a.w[0]+a.w[1])/2,a.w[0]]){if(pos+w>run.to)continue;for(const d of [a.d[1],a.d[0]]){const fp=footprint(run,pos,w,d);if(grid.free(fp.x0,fp.x1,fp.z0,fp.z1)){choice={spec,type:spec.type,w,d,fp,named:i};break;}}if(choice)break;}
    if(!choice&&!run.main&&runScore(run)>200)break; // only near the centre
   }
   if(!choice){
    const type=weighted(r,commercial?COMMERCIAL_MIX:GENERIC_MIX),a=ARCHETYPES[type];const w0=between(r,a.w);
    for(const w of [w0,Math.max(a.w[0],w0-2),a.w[0]]){if(pos+w>run.to)continue;for(const d of [between(r,a.d),a.d[0]]){const fp=footprint(run,pos,w,d);if(grid.free(fp.x0,fp.x1,fp.z0,fp.z1)){choice={type,w,d,fp};break;}}if(choice)break;}
   }
   if(!choice){pos+=1;sinceAlley=0;continue;}
   const detached=['house','warehouse','motel','carwash','container','arcade'].includes(choice.type);
   const a=ARCHETYPES[choice.type];
   const floors=choice.spec?.key==='noodle'?3:Math.round(between(r,a.floors));
   const lot={id:'city-'+lots.length,x:(choice.fp.x0+choice.fp.x1)/2,z:(choice.fp.z0+choice.fp.z1)/2,w:choice.w,d:choice.d,rot:run.rot,type:choice.type,floors,seed:Math.floor(r()*1e9),
    cw:choice.fp.x1-choice.fp.x0,cd:choice.fp.z1-choice.fp.z0,main:!!run.main,commercial};
   if(choice.spec){lot.name=choice.spec.name;lot.key=choice.spec.key;named.splice(choice.named,1);}
   lots.push(lot);grid.mark(choice.fp.x0,choice.fp.x1,choice.fp.z0,choice.fp.z1,2);
   pos+=choice.w;sinceAlley++;
   const alley=detached||sinceAlley>=2+Math.floor(r()*2)||r()<.22;
   if(alley){const g=detached?1.2+r()*1.0:2.6+r()*.8;/* v163: tight, cramped gaps */if(!detached&&pos+g<run.to)alleys.push({run,at:pos,width:g,lot});pos+=g;sinceAlley=0;}
  }
 }
 // Back-lot infill: fills the interior fields behind the frontage with detached
 // sheds, flats and warehouses, each with a walkable alley all round.
 for(let z=CITY_BOUNDS.minZ+6;z<66;z+=2)for(let x=CITY_BOUNDS.minX+6;x<CITY_BOUNDS.maxX-6;x+=2){
  if(!grid.free(x-3,x+3,z-3,z+3))continue;
  const road=nearestRoad(x,z);if(!road||road.d>60)continue;
  const type=weighted(r,INFILL_MIX),a=ARCHETYPES[type];
  for(const [w,d] of [[between(r,a.w),between(r,a.d)],[a.w[0],a.d[0]]]){
   const rot=road.axis==='z'?(z>road.at?Math.PI:0):(x>road.at?-Math.PI/2:Math.PI/2);
   const cw=road.axis==='z'?w:d,cd=road.axis==='z'?d:w,x0=x-3,z0=z-3,fp={x0,x1:x0+cw,z0,z1:z0+cd};
   if(!grid.free(fp.x0-1.5,fp.x1+1.5,fp.z0-1.5,fp.z1+1.5))continue;
   const lot={id:'city-'+lots.length,x:(fp.x0+fp.x1)/2,z:(fp.z0+fp.z1)/2,w,d,rot,type,floors:Math.round(between(r,a.floors)),seed:Math.floor(r()*1e9),cw,cd,infill:true};
   lots.push(lot);grid.mark(fp.x0-1.2,fp.x1+1.2,fp.z0-1.2,fp.z1+1.2,2);break;
  }
 }
 return {lots,alleys,grid,unplaced:named};
}
function footprint(run,pos,w,d){
 if(run.axis==='x'){const z0=run.grow>0?run.line:run.line-d,z1=run.grow>0?run.line+d:run.line;return {x0:pos,x1:pos+w,z0,z1};}
 const x0=run.grow>0?run.line:run.line-d,x1=run.grow>0?run.line+d:run.line;return {x0,x1,z0:pos,z1:pos+w};
}
export function lotCollider(lot){return {x:lot.x,z:lot.z,w:lot.cw+.6,d:lot.cd+.6,cityLot:lot.id};}

/* ---------- world assembly ---------- */
const CHUNK=140;
const chunkKey=(x,z)=>Math.floor((x+300)/CHUNK)+','+Math.floor((z+460)/CHUNK);
function worldOf(lot,lx,ly,lz){const c=Math.cos(lot.rot),s=Math.sin(lot.rot);return [lot.x+lx*c+lz*s,ly,lot.z-lx*s+lz*c];}

// v162: generic terraces, shops and flats can be handed to the Kenney City Kit
// (CC0) layer instead of the painted box kit. Named businesses keep their fronts.
export const KENNEY_LOT_TYPES=Object.freeze(['terrace','shop','flats','house']);
export function createCityExpansion({scene,obstacles=[],points=[],routes=[],quality='balanced',height=()=>0,kenney=false}={}){
 if(!scene)throw new TypeError('City expansion needs a scene.');
 const plan=planCity({obstacles,points,routes});
 const materials=createCityMaterials(),signMaterial=createSignMaterial();
 const chunks=new Map(),colliders=[],root=new THREE.Group();root.name='City expansion v133';scene.add(root);
 const chunk=(x,z)=>{const k=chunkKey(x,z);if(!chunks.has(k))chunks.set(k,{key:k,solid:new CityBatch(),detail:new CityBatch(),cutout:new CityBatch(),signs:new SignBatch(),min:[x,z],max:[x,z],meshes:{}});const c=chunks.get(k);c.min=[Math.min(c.min[0],x),Math.min(c.min[1],z)];c.max=[Math.max(c.max[0],x),Math.max(c.max[1],z)];return c;};
 const r=rng(4242),genericCells=GENERIC_SIGNS.map((_,i)=>NAMED_BUSINESSES.length+i);
 const businesses=[],kenneyLots=[];
 for(const lot of plan.lots){
  const c=chunk(lot.x,lot.z);lot.y=Math.min(0,height(lot.x,lot.z));
  if(kenney&&!lot.key&&KENNEY_LOT_TYPES.includes(lot.type)){lot.kenney=true;lot.height=lot.floors*3.2;kenneyLots.push(lot);colliders.push(lotCollider(lot));continue;}
  const out=buildLot(lot,c);lot.height=out.height;
  colliders.push(lotCollider(lot));
  // signs
  const cell=lot.key?SIGN_SPECS.findIndex(s=>s.key===lot.key):(lot.commercial||r()<.5)&&out.signs.length?genericCells[Math.floor(r()*genericCells.length)]:-1;
  if(cell<0)continue;
  const spec=SIGN_SPECS[cell];
  for(const slot of lot.key?out.signs:out.signs.slice(0,1)){
   const [wx,wy,wz]=worldOf(lot,slot.x,slot.y,slot.z);
   const letters=spec.style==='letters'&&slot.face==='roof';
   const h=slot.h,w=Math.min(slot.w,slot.face==='front'?h*5:h*4.6);
   if(slot.face==='pole'){c.signs.sign(wx,wy,wz,lot.rot+Math.PI/2,w,h,cell,{depth:.3});}
   else c.signs.sign(wx,wy+(lot.y||0),wz,lot.rot,w,h,cell,{depth:letters?.16:.16,letters});
   if(slot.face==='roof'){ // scaffold legs behind roof signs
    for(const lx of [-w*.35,w*.35]){const [px,,pz]=worldOf(lot,slot.x+lx,0,slot.z-.3);c.detail.place(px,0,pz,lot.rot).box(0,wy-h/2-1.1,0,.12,1.2,.12,TILE.PLAIN,null,0x3a3d3c);}
   }
  }
  if(lot.key){const [dx,,dz]=worldOf(lot,0,0,(lot.cd||lot.d)/2+1.8);businesses.push({key:lot.key,name:lot.name,x:lot.x,z:lot.z,type:lot.type,rot:lot.rot,door:{x:+dx.toFixed(2),z:+dz.toFixed(2)}});}
 }
 // Alleys: dumpsters, bins, crates and the odd tag.
 for(const alley of plan.alleys){
  const run=alley.run,mid=alley.at+alley.width/2,depth=alley.lot.d;
  if(alley.width<2.6)continue;
  const back=run.line+run.grow*(depth-2.2),front=run.line+run.grow*2.5;
  const at=(along,across)=>run.axis==='x'?[along,across]:[across,along];
  const [dx,dz]=at(mid,back);const c=chunk(dx,dz);
  const rot=run.axis==='x'?0:Math.PI/2;
  if(r()<.8){c.detail.place(dx,0,dz,rot).box(0,0,0,1.0,1.25,1.8,TILE.CORRUGATED,TILE.PLAIN,[0x3f6b4f,0x35577a,0x6b4a2f][Math.floor(r()*3)],[1.2,1.2],{grime:true});c.detail.box(0,1.25,0,1.1,.12,1.9,TILE.PLAIN,TILE.PLAIN,0x2b2f2d);colliders.push({x:dx,z:dz,w:(run.axis==='x'?1.0:1.8)+.4,d:(run.axis==='x'?1.8:1.0)+.4,cityProp:'dumpster'});}
  const [bx,bz]=at(mid+(r()-.5)*1.2,(back+front)/2);
  if(r()<.6){c.detail.place(bx,0,bz,0).prism(0,0,0,.32,.95,TILE.PLAIN,0x55605a);}
  if(r()<.4){const [cx2,cz2]=at(mid-.7,front+run.grow*1.5);c.detail.place(cx2,0,cz2,r()).box(0,0,0,.9,.6,.9,TILE.WEATHERBOARD,TILE.WEATHERBOARD,0xa88a5f);}
  // overhead cables strung across the alley
  if(r()<.5){const [ox,oz]=at(mid,(back+front)/2);c.cutout.place(ox,0,oz,run.axis==='x'?0:Math.PI/2).quad([-alley.width/2,4.5,0],[alley.width/2,4.5,0],[alley.width/2,5.5,0],[-alley.width/2,5.5,0],[0,0,1],TILE.WIRES,1,1,0xffffff);}
 }
 // Elevated expressway along the -90 avenue with pillars on both kerbs.
 const op=OVERPASS,deck=new CityBatch();
 const opChunk={key:'overpass',solid:deck,detail:new CityBatch(),cutout:new CityBatch(),signs:new SignBatch(),min:[op.x0,op.z-10],max:[op.x1,op.z+10],meshes:{},always:true};
 const z0=op.z-op.halfWidth,z1=op.z+op.halfWidth,y=op.y;
 deck.place(0,0,0,0);
 // deck slab, underside and edges
 for(let x=op.x0;x<op.x1;x+=40){const x1=Math.min(op.x1,x+40);
  deck.roof(x,x1,z0,z1,y+1.1,TILE.ROOF,4,0x8a8d88);
  deck.quad([x,y,z0],[x1,y,z0],[x1,y,z1],[x,y,z1],[0,-1,0],TILE.CONCRETE,(x1-x)/3,(z1-z0)/3,0xb6b0a2);
  deck.wallZ(x,x1,y,y+1.1,z1,1,TILE.CONCRETE,[3,1.1],0xb8b4a8);deck.wallZ(x,x1,y,y+1.1,z0,-1,TILE.CONCRETE,[3,1.1],0xb8b4a8);
  for(const zz of [z0+.3,z1-.3])deck.box((x+x1)/2,y+1.1,zz,x1-x,.95,.45,TILE.CONCRETE,TILE.CONCRETE,0xcfcbbf,[3,.95]);
  for(let m=x;m<x1;m+=9)deck.roof(m,m+4,op.z-.06,op.z+.06,y+1.115,TILE.PLAIN,1,0xe9e1b8);
 }
 const pillarAt=[];
 for(let x=op.x0+12;x<op.x1;x+=op.spacing){
  if([-270,-105,0,105,270].some(rx=>Math.abs(x-rx)<12))continue;
  const onLand=x>-284&&x<284,pillars=[];
  for(const s of [-1,1]){const pz=op.z+s*op.pillarOffset;
   if(onLand&&(points.some(p=>Math.abs(p.x-x)<2.2&&Math.abs(p.z-pz)<2.2)||obstacles.some(o=>Math.abs(o.x-x)<o.w/2+.8&&Math.abs(o.z-pz)<o.d/2+.8)))continue;
   pillars.push(pz);}
  if(pillars.length<2&&onLand)continue;
  for(const pz of pillars){deck.box(x,-2,pz,1.1,y+2,1.1,TILE.CONCRETE,null,0xc4c0b4,[2,2.4],{grime:true});if(onLand)colliders.push({x,z:pz,w:1.5,d:1.5,cityProp:'overpass-pillar'});pillarAt.push([x,pz]);
   if(onLand&&r()<.45)opChunk.cutout.place(x,0,pz,pz<op.z?Math.PI:0).quad([-.56,.6,.56],[.56,.6,.56],[.56,2.2,.56],[-.56,2.2,.56],[0,0,1],TAGS[Math.floor(r()*TAGS.length)],1,1,0xffffff);}
  deck.box(x,y-.9,op.z,1.3,.9,op.pillarOffset*2+1.4,TILE.CONCRETE,null,0xb9b5a9,[2,1]);
 }
 // lamp posts on the deck and two gantry signs
 for(let x=op.x0+20;x<op.x1;x+=36){const zz=z0+.5;opChunk.detail.place(x,0,zz,0).box(0,y+1.1,0,.16,4,.16,TILE.PLAIN,null,0x5b605d);opChunk.detail.box(0,y+5,.6,.2,.12,1.4,TILE.PLAIN,null,0x5b605d);opChunk.solid.place(x,0,zz+1.2,0).quad([-.3,y+4.98,-.2],[.3,y+4.98,-.2],[.3,y+4.98,.2],[-.3,y+4.98,.2],[0,-1,0],TILE.BULBS,1,1,0xffffff);}
 HIGHWAY_SIGNS.forEach((spec,i)=>{const gx=i?118:-122,cell=SIGN_SPECS.indexOf(spec);for(const s of [-1,1])opChunk.detail.place(gx,0,op.z+s*(op.halfWidth-.4),0).box(0,y+1.1,0,.25,5.2,.25,TILE.PLAIN,null,0x6a706c);opChunk.detail.place(gx,0,op.z,0).box(0,y+5.8,0,.3,.3,op.halfWidth*2,TILE.PLAIN,null,0x6a706c);
  opChunk.signs.sign(gx+.2,y+4.6,op.z,Math.PI/2,7.5,1.9,cell,{depth:.12});opChunk.signs.sign(gx-.2,y+4.6,op.z,-Math.PI/2,7.5,1.9,cell,{depth:.12});});
 chunks.set('overpass',opChunk);
 // Power poles with sagging lines along the side streets.
 const wire=[],poles=new CityBatch();
 for(const rz of [-160,-230,-300,-370]){let prev=null;for(let x=-262;x<=262;x+=30){if(ROAD_X.concat([0]).some(rx=>Math.abs(x-rx)<13)){prev=null;continue;}const pz=rz-9.7;
  if(points.some(p=>Math.hypot(p.x-x,p.z-pz)<2.5)||obstacles.some(o=>Math.abs(o.x-x)<o.w/2+.4&&Math.abs(o.z-pz)<o.d/2+.4)){prev=null;continue;}
  const c=chunk(x,pz);c.detail.place(x,0,pz,0).box(0,0,0,.26,8.4,.26,TILE.WEATHERBOARD,TILE.PLAIN,0x6b5643,[.3,2]);c.detail.box(0,7.6,0,.14,.14,2.2,TILE.PLAIN,null,0x4f4135);colliders.push({x,z:pz,w:.6,d:.6,cityProp:'power-pole'});
  if(prev)for(const o of [-.9,0,.9]){const n=6;for(let i=0;i<n;i++){const t0=i/n,t1=(i+1)/n,sag=t=>-1.1*4*t*(1-t);wire.push(prev+(x-prev)*t0,7.7+sag(t0),pz+o,prev+(x-prev)*t1,7.7+sag(t1),pz+o);}}
  prev=x;}}
 const wireGeo=new THREE.BufferGeometry();wireGeo.setAttribute('position',new THREE.Float32BufferAttribute(wire,3));
 const wires=new THREE.LineSegments(wireGeo,new THREE.LineBasicMaterial({color:0x1d201f}));wires.name='City power lines';root.add(wires);
 // Bake chunks into meshes.
 let triangles=0;
 for(const c of chunks.values()){
  for(const [k,batch,mat] of [['solid',c.solid,materials.solid],['detail',c.detail,materials.solid],['cutout',c.cutout,materials.cutout],['signs',c.signs,signMaterial]]){
   const g=batch.toGeometry();if(!g)continue;triangles+=g.index.count/3;
   const m=new THREE.Mesh(g,mat);m.name='City '+k+' '+c.key;m.matrixAutoUpdate=false;m.updateMatrix();
   m.castShadow=k==='solid';m.receiveShadow=k!=='signs';root.add(m);c.meshes[k]=m;
  }
  c.cx=(c.min[0]+c.max[0])/2;c.cz=(c.min[1]+c.max[1])/2;c.r=Math.hypot(c.max[0]-c.min[0],c.max[1]-c.min[1])/2+20;
 }
 let night=0,q=quality;
 const ranges=()=>q==='performance'?{solid:250,detail:70,cutout:55,signs:150}:q==='high'?{solid:320,detail:170,cutout:150,signs:260}:{solid:290,detail:120,cutout:100,signs:210};
 function update({night:n=night,quality:qq=q,camera}={}){
  night=Math.max(0,Math.min(1,Number.isFinite(n)?n:0));q=qq;
  materials.solid.emissiveIntensity=night*1.15;
  signMaterial.emissiveIntensity=.12+night*1.9;
  if(!camera)return;const R=ranges(),cx=camera.position.x,cz=camera.position.z;
  for(const c of chunks.values()){
   const dist=c.always?Math.max(0,Math.abs(cz-c.cz)-12):Math.max(0,Math.hypot(cx-c.cx,cz-c.cz)-c.r);
   for(const k of ['solid','detail','cutout','signs'])if(c.meshes[k])c.meshes[k].visible=dist<R[k]+(c.always&&k==='solid'?400:0);
  }
  wires.visible=q!=='performance';
 }
 update({night:0,quality});
 const sites=plan.lots.map(l=>({id:l.id,x:l.x,z:l.z,w:l.cw,d:l.cd,cityLot:true,name:l.name||null,type:l.type}));
 return {root,plan,colliders,sites,businesses,kenneyLots,chunks,materials,signMaterial,triangles,update,setQuality(v){q=v;},
  stats:()=>({lots:plan.lots.length,named:businesses.length,alleys:plan.alleys.length,meshes:root.children.length,triangles,unplaced:plan.unplaced})};
}
