// v179 world dressing. Kenney CC0 cars, trees and props (see CREDITS.md) stand in
// for the box trees and box clutter: one instanced mesh per prop, one sign atlas,
// and a camera LOD that drops far instances. Low keeps this layer to a handful of
// draw calls so the street stays under the 250-call budget.
import * as THREE from './vendor/three.module.min.js';

export const DRESS_URL = './assets/kenney/dressing-kit.glb';
export const DRESS_KINDS = Object.freeze(['hatchback','van','tree','crooked','grass','crate','barrel','apple','can','stall','litter']);
const PROP_KINDS = new Set(['crate','barrel','apple','can','stall']);

export const TRADES = Object.freeze([
 {id:'motel', sign:'VACANCY', sells:'rooms for the night', awning:0x6a4038, display:['can','apple'], stock:['crate','barrel']},
 {id:'workshop', sign:'JARS & SUGAR', sells:'jars, sugar and gear', awning:0x8a6a48, display:['can','barrel'], stock:['crate','barrel']},
 {id:'garden', sign:'SEEDS & SOIL', sells:'seeds, pots and soil', awning:0x3f5a3a, display:['apple','can'], stock:['crate','apple']},
 {id:'hardware', sign:'TOOLS & TENTS', sells:'tools, tents and crates', awning:0x2f4a44, display:['can','crate'], stock:['crate','barrel']},
 {id:'packaging', sign:'BAGS & BOXES', sells:'bags, boxes and wrappers', awning:0x8c2f2a, display:['can','apple'], stock:['crate','barrel']},
 {id:'laundry', sign:'WASH & FOLD', sells:'soap and laundry', awning:0x1f4e79, display:['can','barrel'], stock:['barrel','crate']},
 {id:'lettings', sign:'TO LET', sells:'homes to rent', awning:0x5a4632, display:['apple','can'], stock:['crate','apple']},
 {id:'staff', sign:'HELP WANTED', sells:'a hand for hire', awning:0x4b3f63, display:['can','apple'], stock:['crate','barrel']},
 {id:'house', sign:'HOME', sells:'a lived-in house', awning:0x5a5344, display:['apple','can'], stock:['crate','apple']},
 {id:'harbor', sign:'BAIT & ROPE', sells:'bait, rope and tackle', awning:0x2f5d78, display:['can','barrel'], stock:['barrel','crate']},
 {id:'servo', sign:'FUEL & SNACKS', sells:'cans and snacks', awning:0x7a3a2a, display:['can','apple'], stock:['crate','can']},
 {id:'diner', sign:'EATS', sells:'bread, snacks and bottles', awning:0x7a1d12, display:['apple','can'], stock:['crate','barrel']},
 {id:'coffee', sign:'COFFEE', sells:'coffee and toasties', awning:0x3b2a20, display:['can','apple'], stock:['barrel','crate']},
 {id:'pawn', sign:'WE BUY', sells:'odds and ends', awning:0x3a3428, display:['can','barrel'], stock:['crate','barrel']},
 {id:'arcade', sign:'TICKETS', sells:'prize tickets', awning:0x3a2448, display:['can','apple'], stock:['crate','can']},
 {id:'bakery', sign:'BAKERY', sells:'bread and buns', awning:0x6a3b1f, display:['apple','can'], stock:['crate','apple']},
 {id:'mart', sign:'OPEN LATE', sells:'snacks and cans', awning:0x6e2e2a, display:['can','apple'], stock:['crate','can']},
 {id:'barber', sign:'BARBER', sells:'a cut and a chat', awning:0x6a3030, display:['can','barrel'], stock:['crate','barrel']},
 {id:'shoes', sign:'SHOES', sells:'shoes and laces', awning:0x2d4a32, display:['can','apple'], stock:['crate','barrel']},
 {id:'flats', sign:'FLATS', sells:'rooms upstairs', awning:0x4e5148, display:['apple','can'], stock:['crate','barrel']}
]);
const TRADE = Object.fromEntries(TRADES.map(t=>[t.id,t]));
const POOLS = Object.freeze({
 'Old Town':['garden','hardware','packaging','laundry','coffee','mart'],
 Westside:['pawn','laundry','hardware','diner','barber'],
 'East Market':['packaging','mart','bakery','shoes','coffee'],
 'North Heights':['hardware','flats','coffee','house','garden'],
 'East Coast':['servo','harbor','motel','mart','diner'],
 'West Harbor':['harbor','workshop','pawn','hardware','diner'],
 Northgate:['mart','bakery','barber','flats','coffee']
});
const KEY_TRADE = Object.freeze({
 arcade:'arcade', taco:'diner', noodle:'diner', burger:'diner', pawn:'pawn', coffee:'coffee', donut:'bakery',
 laundry:'laundry', chicken:'diner', pretzel:'diner', mart:'mart', open:'mart', motel:'motel', carwash:'servo', tackle:'harbor', flats:'flats'
});
const TYPE_TRADE = Object.freeze({
 house:'house', warehouse:'hardware', terrace:'mart', shop:'mart', flats:'flats', diner:'diner', pawn:'pawn',
 laundromat:'laundry', motel:'motel', carwash:'servo', arcade:'arcade', container:'harbor'
});
export const BOROUGHS = Object.freeze([
 {name:'Old Town',x:-11,z:-5},{name:'Westside',x:-108,z:-160},{name:'East Market',x:108,z:-160},
 {name:'North Heights',x:-3,z:-300},{name:'East Coast',x:185,z:-3},{name:'West Harbor',x:-185,z:-3},{name:'Northgate',x:-3,z:-435}
]);
// Walk-in shops. x/z is the middle of the front wall (the street side), facing +z.
export const OLD_SHOPS = Object.freeze([
 {id:'palm-court', name:'PALM COURT', sells:'rooms for the night', trade:'motel', x:-25, z:25.5, w:18, rot:0},
 {id:'workshop', name:'ROOM 04', sells:'jars, sugar and gear', trade:'workshop', x:-25, z:48.5, w:18, rot:0},
 {id:'milo', name:'MILO’S GARDEN', sells:'seeds, pots and soil', trade:'garden', x:25, z:30.5, w:18, rot:0},
 {id:'hank', name:'HANK’S HARDWARE', sells:'tools, tents and crates', trade:'hardware', x:-24, z:-14.5, w:20, rot:0},
 {id:'corner', name:'CORNER STORE', sells:'bags, boxes and wrappers', trade:'packaging', x:24, z:-16, w:20, rot:0},
 {id:'suds', name:'SUDS LAUNDRY', sells:'soap and laundry', trade:'laundry', x:53, z:30.5, w:19, rot:0},
 {id:'cedar', name:'CEDAR BAY', sells:'homes to rent', trade:'lettings', x:54, z:-15.5, w:21, rot:0},
 {id:'helping', name:'HELPING HAND', sells:'a hand for hire', trade:'staff', x:-53, z:-16, w:18, rot:0},
 {id:'hillside', name:'HILLSIDE HOUSE', sells:'a lived-in house', trade:'house', x:54, z:62, w:27, rot:0},
 {id:'harbor-shop', name:'HARBOR WORKS', sells:'bait, rope and tackle', trade:'harbor', x:-54, z:65, w:24, rot:0},
 {id:'servo', name:'COASTWAY SERVO', sells:'cans and snacks', trade:'servo', x:-77, z:-28, w:17, rot:0}
]);

const hash=n=>{n=(Math.imul(n>>>0,0x9E3779B1)+0x6D2B79F5)>>>0;let x=Math.imul(n^n>>>15,n|1);x^=x+Math.imul(x^x>>>7,x|61);return (x^x>>>14)>>>0;};
export function boroughAt(x,z,boroughs=BOROUGHS){
 let best=boroughs[0],d=Infinity;
 for(const b of boroughs){const dd=(x-b.x)**2+(z-b.z)**2;if(dd<d){d=dd;best=b;}}
 return best?.name||'Gummy Bay';
}
export function outward(rot){return [Math.sin(rot),Math.cos(rot)];}
export function alongOf(rot){return [Math.cos(rot),-Math.sin(rot)];}
function tradeById(id){return TRADE[id]||TRADES[0];}
function lotTrade(lot,district){
 if(lot.trade&&TRADE[lot.trade])return TRADE[lot.trade];
 if(lot.key&&KEY_TRADE[lot.key])return TRADE[KEY_TRADE[lot.key]];
 const pool=POOLS[district]||POOLS['Old Town'];
 if(lot.type&&TYPE_TRADE[lot.type]&&hash(lot.seed||1)%5!==0)return TRADE[TYPE_TRADE[lot.type]];
 return TRADE[pool[hash((lot.seed||1)^(lot.x*13|0)^(lot.z*29|0))%pool.length]];
}
function lotDoor(lot){
 const rot=lot.rot||0,c=Math.cos(rot),s=Math.sin(rot),lz=(lot.d||lot.cd||8)/2+0.35;
 return {x:lot.x+lz*s,z:lot.z+lz*c,rot,w:lot.w||8};
}
function siteDoor(site){
 const f=site.front;if(!f||(f.axis!=='x'&&f.axis!=='z'))return null;
 const span=f.axis==='z'?site.w:site.d;
 if(f.axis==='z')return {x:site.x,z:site.z+f.sign*(site.d/2+0.45),rot:f.sign>0?0:Math.PI,w:span};
 return {x:site.x+f.sign*(site.w/2+0.45),z:site.z,rot:f.sign>0?Math.PI/2:-Math.PI/2,w:span};
}

function makeFront(base,trade,district){
 const t=tradeById(trade.id||trade);
 return {
  id:base.id, name:base.name||t.sign, district, trade:t.id, sign:base.sign||base.name||t.sign, sells:base.sells||t.sells,
  awning:t.awning, display:t.display, stock:t.stock, x:base.x, z:base.z, rot:base.rot||0, w:base.w||8
 };
}

// One storefront per walk-in shop, city lot, lane lot and any district shell that
// is not already covered by a lot. `extra` is for districts that are not in this build.
export function planStorefronts({shops=OLD_SHOPS,lots=[],lanes=[],sites=[],extra=[]}={}){
 const fronts=[];
 const covered=(x,z,r)=>fronts.some(f=>(f.x-x)**2+(f.z-z)**2<r*r);
 for(const shop of shops){
  const district=boroughAt(shop.x,shop.z);
  fronts.push(makeFront({...shop,sign:shop.name},tradeById(shop.trade),district));
 }
 const addLot=(lot,tag)=>{
  if(!lot||!Number.isFinite(lot.x)||!Number.isFinite(lot.z))return;
  const door=lotDoor(lot);
  if(shops.some(s=>(s.x-door.x)**2+(s.z-door.z)**2<8*8))return;
  const district=boroughAt(door.x,door.z);
  const trade=lotTrade(lot,district);
  const named=lot.name||lot.key;
  fronts.push(makeFront({id:(lot.id||tag+fronts.length),name:named?String(lot.name||trade.sign):trade.sign,sign:named?String(lot.name):trade.sign,x:door.x,z:door.z,rot:door.rot,w:Math.max(door.w,4),sells:trade.sells},trade,district));
 };
 for(const lot of lots)addLot(lot,'lot');
 for(const lot of lanes)addLot(lot,'lane');
 for(const site of sites){
  const door=siteDoor(site);if(!door)continue;
  if(covered(door.x,door.z,9))continue;
  const district=site.district||boroughAt(door.x,door.z);
  const pool=POOLS[district]||POOLS['Northgate'];
  const trade=TRADE[pool[hash(site.index||fronts.length)%pool.length]];
  fronts.push(makeFront({id:site.id||'site-'+fronts.length,x:door.x,z:door.z,rot:door.rot,w:door.w},trade,district));
 }
 for(const item of extra){
  if(!item||!Number.isFinite(item.x))continue;
  if(covered(item.x,item.z,6))continue;
  const district=item.district||boroughAt(item.x,item.z);
  const trade=tradeById(item.trade||(POOLS[district]||POOLS['Old Town'])[0]);
  fronts.push(makeFront({...item,id:item.id||'extra-'+fronts.length},trade,district));
 }
 return fronts;
}

// Props in front of a shop. Ground stock stays off the door; the stall sits to one side.
export function frontLayout(front){
 const o=outward(front.rot),a=alongOf(front.rot),w=Math.max(4,front.w||8);
 const at=(along,out,y)=>({x:+(front.x+a[0]*along+o[0]*out).toFixed(3),y,z:+(front.z+a[1]*along+o[1]*out).toFixed(3),rot:front.rot});
 const scale=Math.min(1,Math.max(0.48,(w-1.8)/4.2));
 const half=1.7*scale;
 const side=Math.max(half+0.9,Math.min(w*0.4,w/2-0.4));
 const items=[];
 items.push({kind:'stall',role:'awning',...at(side,0.15,0),scale,color:front.awning});
 items.push({kind:front.stock[0],role:'stock',...at(-side,0.55,0),scale:1,color:0xffffff});
 items.push({kind:front.stock[1]||front.stock[0],role:'stock',...at(-side*0.55,0.85,0),scale:.85,color:0xffffff});
 items.push({kind:front.display[0],role:'display',...at(w*0.16,0.42,1.28),scale:1.35,color:0xffffff});
 items.push({kind:front.display[1]||front.display[0],role:'display',...at(-w*0.14,0.4,1.42),scale:1.15,color:0xffffff});
 items.push({kind:'sign',role:'sign',...at(0,0.72,2.72),scale:1,w:Math.min(3.4,w*0.46),h:.62,text:front.sign,sub:front.sells,color:front.awning});
 return items;
}
export function doorClear(front,min=0.85){
 return frontLayout(front).filter(p=>p.role==='stock'||p.role==='awning').every(p=>{
  const reach=p.role==='awning'?1.7*(p.scale||1):0.4;
  return Math.hypot(p.x-front.x,p.z-front.z)-reach>=min*.35;
 });
}

export function planParked({roadsZ=[],roadsX=[],doors=[],avoid=[],max=42,seed=179}={}){
 const cars=[],blocked=(x,z)=>doors.some(d=>(d.x-x)**2+(d.z-z)**2<7.5*7.5)||avoid.some(p=>Number.isFinite(p?.x)&&((p.x-x)**2+(p.z-z)**2<3.2*3.2));
 const push=(x,z,rot,i)=>{
  if(cars.length>=max||blocked(x,z))return;
  if(cars.some(c=>(c.x-x)**2+(c.z-z)**2<12*12))return;
  cars.push({kind:i%3===0?'van':'hatchback',x:+x.toFixed(2),z:+z.toFixed(2),rot,scale:1,color:[0xffffff,0xd5d2cc,0xc4ccc4,0xe4ddd2,0xb7b3aa][i%5]});
 };
 let i=seed;
 for(const rz of roadsZ)for(let x=-268;x<=268;x+=22){
  if(roadsX.some(rx=>Math.abs(x-rx)<16))continue;
  const side=((i++)%2?1:-1);
  push(x,rz+side*3.7,side>0?Math.PI/2:-Math.PI/2,i);
 }
 for(const rx of roadsX)for(let z=-430;z<=-16;z+=24){
  if(roadsZ.some(rz=>Math.abs(z-rz)<16))continue;
  const side=((i++)%2?1:-1);
  push(rx+side*3.7,z,side>0?0:Math.PI,i);
 }
 return cars;
}
export function planMoving({roadsZ=[],roadsX=[],count=6}={}){
 const routes=[];
 const lines=[...roadsZ.map(at=>({axis:'z',at})),...roadsX.map(at=>({axis:'x',at}))];
 for(let i=0;i<count;i++){
  const line=lines[i%Math.max(1,lines.length)]||{axis:'z',at:-160};
  const lane=(i%2?1:-1)*2.15;
  routes.push({
   kind:i%2?'van':'hatchback',axis:line.axis,at:line.at,lane,
   from:line.axis==='z'?-260: -420,to:line.axis==='z'?260:-20,
   speed:6.5+ (i%3)*1.4,t:(i*47)%100/100,color:i%2?0xc8c4bc:0xd8d4cc
  });
 }
 return routes;
}
export function planGreenery({trees=[],planters=[],doors=[]}={}){
 const out=[],blocked=(x,z)=>doors.some(d=>(d.x-x)**2+(d.z-z)**2<4.5*4.5);
 for(const t of trees){
  if(!Number.isFinite(t?.x)||blocked(t.x,t.z))continue;
  const crooked=((t.x*3+t.z)|0)%5===0;
  out.push({kind:crooked?'crooked':'tree',x:t.x,z:t.z,rot:((t.x*13)|0)%6,scale:.82+((hash(t.x*10+t.z*3)%28)/100),color:crooked?0x9aaa90:0xffffff});
  if(((t.x+t.z)|0)%2===0){
   const g={kind:'grass',x:+(t.x+1.35).toFixed(2),z:+(t.z-0.8).toFixed(2),rot:1.2,scale:.7+((hash(t.z)|0)%20)/80,color:0x8f9a80};
   if(!blocked(g.x,g.z))out.push(g);
  }
 }
 for(const p of planters){
  if(!Number.isFinite(p?.x)||blocked(p.x,p.z))continue;
  out.push({kind:'grass',x:p.x,z:p.z,rot:p.hue||0,scale:1.05,color:0x7f8a70});
 }
 return out;
}
export function planLitter({greenery=[],roadsZ=[],doors=[],max=90,seed=19}={}){
 const out=[],blocked=(x,z)=>doors.some(d=>(d.x-x)**2+(d.z-z)**2<3.4*3.4);
 let n=seed;
 for(const g of greenery){
  if(out.length>=max||g.kind==='grass')continue;
  if(((n++)%4)!==0)continue;
  const x=+(g.x+1.8).toFixed(2),z=+(g.z+1.1).toFixed(2);
  if(blocked(x,z))continue;
  out.push({kind:'litter',x,z,rot:(n%7),scale:.75+(n%5)*.12,color:0xffffff});
 }
 for(const rz of roadsZ){
  for(let x=-250;x<=250&&out.length<max;x+=36){
   const z=rz+((n++)%2?1:-1)*6.4;
   if(blocked(x,z))continue;
   out.push({kind:'litter',x,z,rot:n%6,scale:.8,color:0xffffff});
  }
 }
 return out;
}

export function dressDrawCalls(quality='performance'){
 // One instanced mesh per kind that this quality keeps, plus the shared sign atlas.
 const hidden=quality==='performance'?[]:[];
 const kinds=DRESS_KINDS.filter(k=>!hidden.includes(k));
 return kinds.length+1;
}
export function lodRadius(quality){return quality==='performance'?82:quality==='high'?230:150;}
export function lodCaps(quality){
 if(quality==='performance')return {radius:82,fronts:80,trees:90,grass:50,litter:36,parked:16,moving:4};
 if(quality==='high')return {radius:230,fronts:520,trees:240,grass:180,litter:120,parked:48,moving:8};
 return {radius:155,fronts:240,trees:160,grass:110,litter:80,parked:32,moving:6};
}

function paintSigns(fronts){
 const doc=globalThis.document;if(!doc?.createElement)return null;
 const texts=[];
 for(const f of fronts){const key=f.sign+'|'+f.sells;if(!texts.some(t=>t.key===key))texts.push({key,sign:f.sign,sub:f.sells,bg:f.awning});}
 if(!texts.length)return null;
 const cw=512,ch=96,cols=1,rows=texts.length;
 const canvas=doc.createElement('canvas');canvas.width=cw*cols;canvas.height=ch*rows;
 const g=canvas.getContext('2d');if(!g)return null;
 texts.forEach((t,i)=>{
  const y=i*ch,bg='#'+t.bg.toString(16).padStart(6,'0');
  g.fillStyle=bg;g.fillRect(0,y,cw,ch);
  g.strokeStyle='#e6d7b0';g.lineWidth=6;g.strokeRect(8,y+6,cw-16,ch-12);
  g.fillStyle='#f4ecd4';g.textAlign='center';g.textBaseline='middle';
  g.font='700 40px sans-serif';g.fillText(t.sign,cw/2,y+(t.sub?36:48),cw-36);
  if(t.sub){g.font='600 22px sans-serif';g.fillStyle='#f7f1df';g.fillText(t.sub,cw/2,y+70,cw-40);}
 });
 const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;map.needsUpdate=true;
 return {map,texts,cw,ch,cols};
}

function signGeometry(fronts,atlas){
 const pos=[],nor=[],uv=[],idx=[];
 const o=new THREE.Vector3(),r=new THREE.Vector3(),u=new THREE.Vector3(0,1,0);
 for(const f of fronts){
  const cell=atlas.texts.findIndex(t=>t.key===f.sign+'|'+f.sells);if(cell<0)continue;
  const layout=frontLayout(f).find(p=>p.role==='sign');
  const hw=(layout.w||2.4)/2,hh=(layout.h||.62)/2;
  const [ox,oz]=outward(f.rot),[ax,az]=alongOf(f.rot);
  o.set(layout.x,layout.y,layout.z);r.set(ax,0,az);
  const n=pos.length/3;
  const corners=[[-1,-1],[1,-1],[1,1],[-1,1]];
  for(const [sx,sy] of corners){
   pos.push(o.x+r.x*hw*sx,o.y+u.y*hh*sy,o.z+r.z*hw*sx);
   nor.push(ox,0,oz);
   uv.push((sx+1)/2,1-(cell+(1-sy)/2)/atlas.texts.length);
  }
  idx.push(n,n+1,n+2,n,n+2,n+3);
 }
 const geo=new THREE.BufferGeometry();
 geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
 geo.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));
 geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
 geo.setIndex(idx);geo.computeBoundingSphere();
 return geo;
}

function placeMatrix(dummy,item,height){
 const y=(item.y||0)+(typeof height==='function'?height(item.x,item.z)||0:0);
 dummy.position.set(item.x,y,item.z);
 dummy.rotation.set(0,item.rot||0,0);
 const s=item.scale||1;
 dummy.scale.set(s,s,s);
 dummy.updateMatrix();
}

export function createWorldDressing({scene,Loader,quality='balanced',url=DRESS_URL,shops,lots=[],lanes=[],sites=[],extra=[],trees=[],planters=[],roadsZ=[],roadsX=[],avoid=[],height=()=>0}={}){
 if(!scene)throw new TypeError('World dressing needs a scene.');
 const fronts=planStorefronts({shops,lots,lanes,sites,extra});
 const doors=fronts.map(f=>({x:f.x,z:f.z}));
 const parked=planParked({roadsZ,roadsX,doors,avoid});
 const moving=planMoving({roadsZ,roadsX,count:8});
 const greenery=planGreenery({trees,planters,doors});
 const litter=planLitter({greenery,roadsZ,doors});
 const buckets={hatchback:[],van:[],tree:[],crooked:[],grass:[],crate:[],barrel:[],apple:[],can:[],stall:[],litter:[]};
 for(const f of fronts)for(const p of frontLayout(f))if(PROP_KINDS.has(p.kind))buckets[p.kind].push({...p,frontId:f.id});
 for(const c of parked)buckets[c.kind].push(c);
 for(const c of moving){
  c.moving=true;c.y=0;c.scale=1;
  c.x=c.axis==='z'?c.from:c.at+c.lane;c.z=c.axis==='z'?c.at+c.lane:c.from;c.rot=c.axis==='z'?Math.PI/2:0;
  buckets[c.kind].push(c);
 }
 for(const g of greenery)buckets[g.kind].push(g);
 for(const g of litter)buckets.litter.push(g);
 const root=new THREE.Group();root.name='World dressing';root.userData.noBatch=true;scene.add(root);
 const material=new THREE.MeshLambertMaterial({vertexColors:true});
 const meshes={};const records={};
 const dummy=new THREE.Object3D();const color=new THREE.Color();
 const state={ready:false,failed:null,quality,night:0,anchor:new THREE.Vector3(1e9,0,0),movingT:moving.map(m=>m.t)};
 let signMesh=null;
 function build(geos){
  for(const kind of DRESS_KINDS){
   const items=buckets[kind];const geo=geos[kind];
   if(!items?.length||!geo)continue;
   const mesh=new THREE.InstancedMesh(geo,material,items.length);
   mesh.name='Dressing '+kind;mesh.userData.noBatch=true;mesh.castShadow=false;mesh.receiveShadow=false;mesh.frustumCulled=false;mesh.count=0;
   mesh.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(items.length*3),3);
   root.add(mesh);meshes[kind]=mesh;records[kind]=items;
  }
  const atlas=paintSigns(fronts);
  if(atlas){
   signMesh=new THREE.Mesh(signGeometry(fronts,atlas),new THREE.MeshLambertMaterial({map:atlas.map,emissive:0xffe2b0,emissiveIntensity:.08}));
   signMesh.name='Dressing signs';signMesh.userData.noBatch=true;signMesh.frustumCulled=false;root.add(signMesh);
  }
  state.ready=true;applyLod(true);
 }
 function write(mesh,items,list){
  for(let i=0;i<list.length;i++){
   const item=list[i];placeMatrix(dummy,item,item.kind==='stall'||item.y?height:height);mesh.setMatrixAt(i,dummy.matrix);
   color.setHex(item.color||0xffffff);mesh.setColorAt(i,color);
  }
  mesh.count=list.length;mesh.visible=list.length>0;mesh.instanceMatrix.needsUpdate=true;
  if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
 }
 function nearest(items,cap,radius,camera){
  const cx=camera?.position?.x||0,cz=camera?.position?.z||0,r2=radius*radius;
  const hit=[];
  for(const item of items){const d=(item.x-cx)**2+(item.z-cz)**2;if(d<=r2)hit.push(item);}
  if(hit.length>cap){hit.sort((a,b)=>((a.x-cx)**2+(a.z-cz)**2)-((b.x-cx)**2+(b.z-cz)**2));hit.length=cap;}
  return hit;
 }
 function applyLod(force=false){
  const camera=state.camera,cap=lodCaps(state.quality);
  if(!force&&camera&&camera.position.distanceToSquared(state.anchor)<64)return;
  if(camera)state.anchor.copy(camera.position);
  const frontsNear=new Set(nearest(fronts,cap.fronts,cap.radius,camera).map(f=>f.id));
  for(const kind of DRESS_KINDS){
   const mesh=meshes[kind];if(!mesh)continue;
   let items=records[kind];
   if(kind==='stall'||kind==='crate'||kind==='barrel'||kind==='apple'||kind==='can')items=items.filter(p=>frontsNear.has(p.frontId));
   if(kind==='tree'||kind==='crooked')items=nearest(items,cap.trees,cap.radius+40,camera);
   else if(kind==='grass')items=nearest(items,cap.grass,cap.radius,camera);
   else if(kind==='litter')items=nearest(items,cap.litter,cap.radius,camera);
   else if(kind==='hatchback'||kind==='van')items=nearest(items.filter(p=>!p.moving),cap.parked,cap.radius+30,camera).concat(items.filter(p=>p.moving&&p.scale>0));
   write(mesh,records[kind],items);
  }
  if(signMesh){
   // Signs stay one draw. Far ones are still in the mesh; the instanced props carry the LOD.
   signMesh.visible=state.quality!=='off';
  }
 }
 function stepMoving(dt){
  const cap=lodCaps(state.quality).moving;
  for(let i=0;i<moving.length;i++){
   const route=moving[i],span=route.to-route.from||1;
   state.movingT[i]=(state.movingT[i]+(dt||0)*route.speed/Math.abs(span))%1;
   const along=route.from+(route.to-route.from)*state.movingT[i];
   if(route.axis==='z'){route.x=along;route.z=route.at+route.lane;route.rot=Math.PI/2;}
   else{route.x=route.at+route.lane;route.z=along;route.rot=0;}
   route.scale=i<cap?1:0;route.y=0;
  }
 }
 function update({quality:q,camera,night=0,dt}={}){
  if(q)state.quality=q;if(camera)state.camera=camera;state.night=night;
  const now=typeof performance!=='undefined'?performance.now():0;
  if(state.then==null)state.then=now;
  dt=Math.min(.05,Math.max(0,(now-state.then)/1000));state.then=now;if(!dt)dt=.016;
  if(signMesh?.material)signMesh.material.emissiveIntensity=.05+Math.max(0,Math.min(1,night))*0.85;
  if(!state.ready)return;
  stepMoving(dt||.016);
  const moved=camera&&camera.position.distanceToSquared(state.anchor)>=64;
  if(moved||!state.lodDone){applyLod(true);state.lodDone=true;}
  else for(const kind of ['hatchback','van']){
   const mesh=meshes[kind];if(!mesh)continue;
   const cap=lodCaps(state.quality);
   const parkedItems=nearest(records[kind].filter(p=>!p.moving),cap.parked,cap.radius+30,camera);
   write(mesh,records[kind],parkedItems.concat(records[kind].filter(p=>p.moving&&p.scale>0)));
  }
 }
 if(Loader){
  try{new Loader().load(url,gltf=>{
   const geos={};gltf.scene.updateMatrixWorld(true);
   gltf.scene.traverse(o=>{if(!o.isMesh)return;const g=o.geometry.index?o.geometry:o.geometry;geos[o.name]=g;});
   build(geos);
  },undefined,err=>{state.failed=String(err?.message||err);});}
  catch(err){state.failed=String(err?.message||err);}
 }
 function stats(){
  const calls=Object.values(meshes).filter(m=>m.visible&&m.count>0).length+(signMesh?.visible?1:0);
  return {
   ready:state.ready,failed:state.failed,fronts:fronts.length,parked:parked.length,moving:moving.length,
   trees:greenery.filter(g=>g.kind==='tree'||g.kind==='crooked').length,grass:greenery.filter(g=>g.kind==='grass').length,
   litter:litter.length,shops:OLD_SHOPS.map(s=>s.id),districts:[...new Set(fronts.map(f=>f.district))],
   trades:[...new Set(fronts.map(f=>f.trade))],calls,budget:dressDrawCalls(state.quality),quality:state.quality
  };
 }
 return {root,fronts,parked,moving,greenery,litter,update,setQuality(q){state.quality=q;state.anchor.set(1e9,0,0);applyLod(true);},stats};
}
