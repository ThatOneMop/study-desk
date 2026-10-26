// Shared look for Gummy Bay people (v146). Stylised, rounded low-poly humans:
// soft tapered limbs and torsos, a slightly big 1.12x head with nose and ears,
// 13 hair styles, hats, beards, eyewear, outfit palettes, uniforms, body shapes
// and a painted expressive face atlas. Original shapes and art, built in code.
// Cost: three instanced draws per crowd (details box, rounded body, face plane).
import * as THREE from './vendor/three.module.min.js';

export const PEOPLE_FACE_STYLES=8;
export const PEOPLE_EYEWEAR=Object.freeze(['none','specs','shades']);
export const PEOPLE_FACE_COLS=PEOPLE_FACE_STYLES*3,PEOPLE_FACE_ROWS=3;
export const PEOPLE_FACE_STATES=Object.freeze({open:0,blink:1,talk:2});
export const PEOPLE_FACE_MOODS=Object.freeze(['friendly','wide','smirk','grumpy','sleepy','cheery','worried','stern']);
export const PEOPLE_SKINS=Object.freeze([0xf6d6b8,0xf1cba6,0xeac0a0,0xe2b088,0xcf9a6c,0xb77d52,0x9a623c,0x7c4d2e,0x5e3a24,0x46291a]);
export const PEOPLE_HAIR=Object.freeze([0x2a231d,0x45311f,0x6b4a2c,0x9a7040,0x1d1f22,0x5a3b28,0xb9b2a6,0xc8863e,0xe3c47c,0x9c3f26,0xe8e3da]);
// Street clothes in muted, slightly grubby tones.
export const PEOPLE_TOPS=Object.freeze([0x4d6b8a,0xa8473c,0x5f7a4a,0xc2a25a,0x6e5a86,0x3d4a55,0xb8673a,0x2f6f6a,0x8c8c88,0x9a3f5c,0xd9cfb8,0x56483e]);
export const PEOPLE_PANTS=Object.freeze([0x33496a,0x2b3a55,0x3b3530,0x23262b,0x5d5444,0x41506a,0x6b6250]);
export const PEOPLE_SHOES=Object.freeze([0x1f1f22,0xe8e4dc,0x5a3a24,0x2c3440,0x8a2c2c,0x3f6a8a]);
export const PEOPLE_SHOE_STYLES=Object.freeze(['sneaker','boot','loafer']);
export const PEOPLE_TOP_STYLES=Object.freeze(['hoodie','jacket','tee','flannel','puffer','overalls','polo']);
export const PEOPLE_UNIFORMS=Object.freeze(['uniform','track','apron']);
export const PEOPLE_HAIR_STYLES=Object.freeze(['short','long','buzz','bald','bun','afro','mohawk','ponytail','curly','bob','fringe','spiky','combover']);
export const PEOPLE_HATS=Object.freeze(['none','cap','beanie','bucket','flatcap','police']);
export const PEOPLE_BEARDS=Object.freeze(['none','full','goatee','moustache']);
export const PEOPLE_HEAD_SCALE=1.12;
export const PEOPLE_HEIGHT=Object.freeze([.92,1.08]),PEOPLE_BUILD=Object.freeze([.88,1.22]);
export const POLICE_LOOK=Object.freeze({top:0x1f2f4d,inner:0x16223a,pants:0x18233a,shoes:0x111318,cap:0x18243c,brim:0x0e1320,badge:0xd8b25a,belt:0x15161a,band:0xe0bf3a});
// Coordinated outfits: top, inner layer, pants, shoes, hat colour.
export const PEOPLE_OUTFITS=Object.freeze([
 [0x4d6b8a,0xe6e0d2,0x2b3a55,0xe8e4dc,0xa33a2e],[0xa8473c,0x2a2a2e,0x33496a,0x1f1f22,0x2f2f33],
 [0x5f7a4a,0xd9cfb8,0x3b3530,0x5a3a24,0x4f6b3a],[0xc2a25a,0x56483e,0x23262b,0x2c3440,0x56483e],
 [0x6e5a86,0xe6e0d2,0x41506a,0xe8e4dc,0x3d4a55],[0x3d4a55,0xc9b48a,0x5d5444,0x5a3a24,0xb8673a],
 [0xb8673a,0x2a2a2e,0x2b3a55,0x1f1f22,0x2a3d66],[0x2f6f6a,0xe6e0d2,0x6b6250,0x8a2c2c,0xc2a25a],
 [0x8c8c88,0x9fb0c2,0x23262b,0x3f6a8a,0x9a3f5c],[0x9a3f5c,0xd9cfb8,0x33496a,0xe8e4dc,0x2f2f33],
 [0xd9cfb8,0x4d6b8a,0x3b3530,0x5a3a24,0x2f6f6a],[0x56483e,0xc2a25a,0x2b3a55,0x2c3440,0xa8473c]
]);

const finite=value=>Number.isFinite(value)?value:0;
const pick=(list,n)=>list[((n%list.length)+list.length)%list.length];
const hash=n=>{let x=(Math.abs(Math.trunc(finite(n)))+1)*2654435761>>>0;x^=x>>>15;x=Math.imul(x,2246822519)>>>0;x^=x>>>13;return x>>>0;};
const hash2=n=>hash(hash(n)^0x9e3779b9);
const shadeCache=new Map();
function shade(hex,amount){const key=hex*7+amount;let v=shadeCache.get(key);if(v===undefined){const c=new THREE.Color(hex);c.offsetHSL(0,0,amount);v=c.getHex();if(shadeCache.size<4096)shadeCache.set(key,v);}return v;}

// Deterministic look for one person. Role picks uniforms; everyone else mixes outfits.
export function personLook(id=0,role='townsfolk',palette={}){
 const n=Math.abs(Math.trunc(finite(id))),h=hash(n),g=hash2(n);
 const skin=Number.isFinite(palette.skin)?palette.skin:pick(PEOPLE_SKINS,h);
 const hair=Number.isFinite(palette.hair)?palette.hair:pick(PEOPLE_HAIR,h>>>3);
 const police=role==='police',outfit=pick(PEOPLE_OUTFITS,g>>>2);
 let topStyle=pick(PEOPLE_TOP_STYLES,h>>>6),hairStyle=pick(PEOPLE_HAIR_STYLES,h>>>9),hat=(g>>>7)%4===0?pick(['cap','beanie','bucket','flatcap'],g>>>10):'none';
 if(role==='worker'){topStyle='jacket';hat=(g>>>7)%2?'beanie':'none';}
 if(role==='seller')topStyle='apron';
 if(role==='dealer'){topStyle='track';hat=(g>>>7)%3===0?'none':(g>>>9)%2?'cap':'beanie';}
 if(police){topStyle='uniform';hairStyle='police';hat='police';}
 const top=police?POLICE_LOOK.top:role==='worker'?0xd98a2b:role==='seller'?0xc47b45:Number.isFinite(palette.color)?palette.color:outfit[0];
 const inner=police?POLICE_LOOK.inner:topStyle==='overalls'?outfit[1]:topStyle==='jacket'||topStyle==='flannel'||topStyle==='puffer'||topStyle==='track'?outfit[1]:shade(top,-.06);
 const beardRoll=(g>>>13)%7;
 const beard=police?((g>>>13)%4===0?'moustache':'none'):beardRoll===0?'full':beardRoll===1?'goatee':beardRoll===2?'moustache':'none';
 const eyeRoll=(h>>>27)%9;
 const eyewear=police?((g>>>16)%5===0?2:0):eyeRoll===0||eyeRoll===1?1:eyeRoll===2?2:0;
 const shoeStyle=police||role==='worker'?'boot':pick(PEOPLE_SHOE_STYLES,g>>>18);
 const shoes=police?POLICE_LOOK.shoes:role==='worker'?0x5a3a24:outfit[3];
 return Object.freeze({
  id:n,role,skin,hair,hairStyle,topStyle,top,inner,
  sleeve:topStyle==='tee'||topStyle==='polo'||topStyle==='overalls'?skin:top,
  arm:topStyle==='overalls'?inner:top,
  pants:police?POLICE_LOOK.pants:role==='worker'?0x2f3d52:topStyle==='overalls'?pick([0x3b5a85,0x5d6f3e,0x8a4a3a],g>>>20):pick(PEOPLE_PANTS,h>>>18),
  shoes,shoeStyle,sole:shoeStyle==='sneaker'?0xf2efe8:0x1d1a18,
  hood:topStyle==='hoodie'?shade(top,-.05):top,
  hat,cap:police?POLICE_LOOK.cap:outfit[4],
  brim:police?POLICE_LOOK.brim:shade(outfit[4],-.08),band:police?POLICE_LOOK.band:shade(outfit[4],-.1),
  badge:POLICE_LOOK.badge,belt:police?POLICE_LOOK.belt:0x2a2420,
  accent:role==='worker'?0xd8e04a:topStyle==='track'?0xf2efe8:shade(top,.12),
  apron:role==='seller'?pick([0xe9e2cf,0x2f6f6a,0x8a2c2c],g>>>22):0xe9e2cf,
  glasses:eyewear>0,eyewear,
  faceStyle:police?((g>>>24)%2?7:0):(h>>>4)%PEOPLE_FACE_STYLES,
  beard,beardColor:hair,
  height:+(PEOPLE_HEIGHT[0]+((g>>>3)%17)/16*(PEOPLE_HEIGHT[1]-PEOPLE_HEIGHT[0])).toFixed(3),
  build:+(.9+((g>>>26)%9)/8*.26).toFixed(3),
  hatYaw:0,
  hoodUp:topStyle==='hoodie'&&(h>>>28)%3===0
 });
}
// Hand-authored looks for the story cast, contacts and dealers. They match the
// cutscene name cards: Marge's bun and specs, Larry's sideways green cap, Hank's
// banded navy cap and moustache, Gramps Gus's white combover and beard.
export const NAMED_LOOKS=Object.freeze({
 'marge':{skin:0xf0c9a5,hair:0xe8e3da,hairStyle:'bun',hat:'none',eyewear:1,topStyle:'jacket',top:0xe0b13a,inner:0xf1e7cf,pants:0x5d5444,shoes:0x8a2c2c,shoeStyle:'loafer',faceStyle:0,beard:'none',height:.93,build:1.12},
 'lemon larry':{skin:0xf6e05a,hair:0x6b4a2c,hairStyle:'short',hat:'cap',cap:0x6fb52c,brim:0x5a9a22,hatYaw:Math.PI/2,topStyle:'hoodie',top:0x3c4a24,hood:0x34401f,pants:0x2b3a55,shoes:0xe8e4dc,shoeStyle:'sneaker',faceStyle:3,eyewear:0,beard:'none',height:1.0,build:.95},
 'hank hardtack':{role:'police',skin:0xe7bf98,hair:0x6b4a2e,hairStyle:'police',hat:'police',cap:0x1d2a4a,band:0xf2c230,brim:0x121a30,topStyle:'uniform',top:0x8a8f96,inner:0x5d636b,pants:0x2b3340,beard:'moustache',beardColor:0x6b4a2e,mustache:1.5,faceStyle:7,eyewear:0,height:1.06,build:1.15},
 'gramps':{skin:0xe9c3a0,hair:0xf4f1ea,hairStyle:'combover',hat:'none',beard:'full',beardColor:0xf4f1ea,beardSize:1.25,topStyle:'flannel',top:0xb84a3a,inner:0xf1e7cf,pants:0x5d5444,shoes:0x5a3a24,shoeStyle:'loafer',faceStyle:0,eyewear:0,height:.94,build:1.1},
 'mayor prudence':{skin:0xeac0a0,hair:0x45311f,hairStyle:'bob',hat:'none',topStyle:'jacket',top:0x7a3f74,inner:0xf2efe8,pants:0x3b2a3a,shoes:0x1f1f22,shoeStyle:'loafer',faceStyle:2,eyewear:1,beard:'none',height:1.02,build:1.0},
 'tilly':{skin:0xf1cba6,hair:0xc8863e,hairStyle:'ponytail',hat:'none',topStyle:'overalls',top:0xf2efe8,inner:0xf2efe8,pants:0x2f8a8a,shoes:0xe8e4dc,shoeStyle:'sneaker',faceStyle:5,eyewear:0,beard:'none',height:.95,build:.94},
 'benny boardwalk':{hairStyle:'short',hat:'cap',cap:0x4f8fbf,hatYaw:Math.PI,topStyle:'track',top:0x4f8fbf,accent:0xf2efe8,faceStyle:2,beard:'goatee'},
 'mo marmalade':{hairStyle:'buzz',hat:'beanie',cap:0xd9822b,topStyle:'puffer',top:0xd9822b,faceStyle:5,beard:'full',build:1.18},
 'cleo caramel':{hairStyle:'afro',hat:'none',topStyle:'track',top:0xb0572f,accent:0xf3d7a2,faceStyle:1,eyewear:2,beard:'none'},
 'dex dimple':{hairStyle:'fringe',hat:'none',topStyle:'jacket',top:0x7b5fb5,scarf:0xe0b13a,faceStyle:4,eyewear:1,beard:'none',build:.92},
 'jules':{hairStyle:'ponytail',hat:'none',topStyle:'polo',faceStyle:4,eyewear:0,beard:'none'},
 'benji':{hairStyle:'curly',hat:'none',topStyle:'hoodie',faceStyle:0,eyewear:1,beard:'none',build:1.05},
 'nina':{hairStyle:'bob',hat:'none',topStyle:'jacket',faceStyle:2,eyewear:2,beard:'none'},
 'oz':{hairStyle:'mohawk',hat:'none',topStyle:'puffer',faceStyle:3,eyewear:0,beard:'goatee'},
 'frankie':{hairStyle:'spiky',hat:'bucket',topStyle:'overalls',faceStyle:5,eyewear:0,beard:'none'},
 'hank ·':{hairStyle:'short',hat:'flatcap',cap:0x56483e,topStyle:'overalls',top:0xe6e0d2,pants:0x5d6f3e,beard:'full',faceStyle:0,build:1.15}
});
// 'Benny Boardwalk · Old Town dealer' → 'benny boardwalk'. Longest key wins.
export function namedLookKey(label){
 const text=String(label||'').toLowerCase().trim();if(!text)return null;
 let best=null;
 for(const key of Object.keys(NAMED_LOOKS))if((text===key||text.startsWith(key+' ')||text.startsWith(key)&&key.endsWith('·'))&&(!best||key.length>best.length))best=key;
 return best;
}
export function namedLook(label,base=null,id=0){
 const key=namedLookKey(label);if(!key)return base;
 const over=NAMED_LOOKS[key],from=base||personLook(id,over.role||'townsfolk');
 const look={...from,...over,named:key};
 if(over.role==='police'&&from.role!=='police')look.role='police';
 if(over.skin!==undefined&&over.sleeve===undefined)look.sleeve=look.topStyle==='tee'||look.topStyle==='polo'||look.topStyle==='overalls'?look.skin:look.top;
 else if(over.top!==undefined&&over.sleeve===undefined)look.sleeve=look.topStyle==='tee'||look.topStyle==='polo'||look.topStyle==='overalls'?look.skin:look.top;
 if(over.arm===undefined)look.arm=look.topStyle==='overalls'?look.inner:look.top;
 if(over.hood===undefined)look.hood=look.topStyle==='hoodie'?shade(look.top,-.05):look.top;
 if(over.accent===undefined&&look.topStyle==='track')look.accent=0xf2efe8;
 if(over.beardColor===undefined)look.beardColor=look.hair;
 if(over.cap!==undefined&&over.band===undefined&&look.role!=='police')look.band=shade(look.cap,-.1);
 if(over.cap!==undefined&&over.brim===undefined)look.brim=shade(look.cap,-.08);
 look.glasses=(look.eyewear||0)>0;look.hoodUp=false;
 if(look.topStyle!=='overalls'&&over.inner===undefined&&from.topStyle==='overalls')look.inner=shade(look.top,-.06);
 return Object.freeze(look);
}
export function faceCell(look,state='open'){
 const style=Math.max(0,Math.min(PEOPLE_FACE_STYLES-1,Math.trunc(finite(look?.faceStyle))));
 const eyewear=Math.max(0,Math.min(2,Math.trunc(finite(look?.eyewear??(look?.glasses?1:0)))));
 const col=style+eyewear*PEOPLE_FACE_STYLES,row=PEOPLE_FACE_STATES[state]??0;
 return row*PEOPLE_FACE_COLS+col;
}

// Rounded box: a subdivided cube pulled toward a sphere, with sphere-blended
// normals. v154: 108 triangles at 3 segments and a rounder pull, so heads and
// limbs read as soft pebbles instead of boxes; per-instance taper shapes it into
// waists, jaws, calves and forearms in the vertex shader.
export function createRoundedBoxGeometry(segments=3,round=.95){
 const geometry=new THREE.BoxGeometry(1,1,1,segments,segments,segments),position=geometry.attributes.position,v=new THREE.Vector3(),s=new THREE.Vector3();
 for(let i=0;i<position.count;i++){
  v.fromBufferAttribute(position,i);s.copy(v).normalize().multiplyScalar(.5);
  // Keep face centres at 0.5 so features sit flush; pull edges and corners in.
  v.lerp(s,round*Math.min(1,(v.length()-.5)/.366));
  position.setXYZ(i,v.x,v.y,v.z);
 }
 const normal=geometry.attributes.normal,n=new THREE.Vector3(),f=new THREE.Vector3();
 for(let i=0;i<position.count;i++){v.fromBufferAttribute(position,i).normalize();f.fromBufferAttribute(normal,i);n.copy(v).lerp(f,.08).normalize();normal.setXYZ(i,n.x,n.y,n.z);}
 normal.needsUpdate=true;
 return geometry;
}
export const PEOPLE_ROUND_GEOMETRY=createRoundedBoxGeometry();
export const PEOPLE_BOX_GEOMETRY=new THREE.BoxGeometry(1,1,1);
// Each batch gets its own light wrapper so its per-instance taper attribute is private,
// while the vertex/index buffers stay shared with every other crowd.
export function createBodyGeometry(capacity){
 const geometry=new THREE.BufferGeometry();
 geometry.setIndex(PEOPLE_ROUND_GEOMETRY.index);
 for(const name of ['position','normal','uv'])geometry.setAttribute(name,PEOPLE_ROUND_GEOMETRY.getAttribute(name));
 const taper=new THREE.InstancedBufferAttribute(new Float32Array(Math.max(1,capacity)*2).fill(1),2);taper.setUsage(THREE.DynamicDrawUsage);
 geometry.setAttribute('aTaper',taper);
 return geometry;
}

let faceTexture=null;
const INK='#1d1612',BROW='#2a1d14';
function eye(ctx,ex,ey,r,{lid=0,wide=false,lashes=false,look=0}){
 // Sclera, iris, pupil and a catch-light; the upper lid trims the top.
 ctx.save();ctx.beginPath();ctx.ellipse(ex,ey,r*1.05,r*1.3,0,0,Math.PI*2);ctx.clip();
 ctx.fillStyle='#fbf8f2';ctx.fillRect(ex-r*2,ey-r*2,r*4,r*4);
 ctx.fillStyle='#3e2814';ctx.beginPath();ctx.arc(ex+look*r*.25,ey+r*.15,r*.76,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#6e4a2a';ctx.beginPath();ctx.arc(ex+look*r*.25,ey+r*.2,r*.6,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#120d0a';ctx.beginPath();ctx.arc(ex+look*r*.25,ey+r*.15,r*.36,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(ex+look*r*.25+r*.26,ey-r*.2,r*.24,0,Math.PI*2);ctx.fill();
 ctx.beginPath();ctx.arc(ex+look*r*.25-r*.24,ey+r*.42,r*.11,0,Math.PI*2);ctx.fill();
 if(lid>0)ctx.clearRect(ex-r*2,ey-r*1.4,r*4,r*2.7*lid);
 ctx.restore();
 ctx.strokeStyle=INK;ctx.lineWidth=r*.32;ctx.beginPath();
 const top=ey-r*1.3+r*2.6*lid;
 ctx.moveTo(ex-r*1.1,lid>0?top:ey-r*.2);ctx.quadraticCurveTo(ex,lid>0?top-r*.25:ey-r*1.55,ex+r*1.1,lid>0?top:ey-r*.2);ctx.stroke();
 if(lashes){ctx.lineWidth=r*.22;for(const k of [-1,1]){ctx.beginPath();ctx.moveTo(ex+k*r*1.05,ey-r*.45);ctx.lineTo(ex+k*r*1.5,ey-r*.85);ctx.stroke();}}
 if(wide){ctx.lineWidth=r*.18;ctx.beginPath();ctx.ellipse(ex,ey,r*1.05,r*1.3,0,0,Math.PI*2);ctx.stroke();}
}
// Eight moods x three eyewear x open/blink/talk. Pixels are opaque or clear (alphaTest).
function drawFace(ctx,x,y,size,style,eyewear,state){
 const cx=x+size/2,eyeY=y+size*.46,gap=size*.165,r=size*(style===1?.085:.074);
 ctx.lineCap='round';ctx.lineJoin='round';
 // Brows by mood: [outer y, inner y] offsets (negative is up).
 const B=[[-.02,-.02],[-.07,-.05],[-.05,.0],[-.03,.035],[.0,.0],[-.04,-.04],[.0,-.05],[.0,.015]][style];
 ctx.strokeStyle=BROW;ctx.lineWidth=size*(style===7||style===3?.06:.05);
 for(const side of [-1,1]){
  const by=eyeY-size*.13,b=style===2&&side>0?[-.07,-.05]:B;
  ctx.beginPath();ctx.moveTo(cx+side*(gap+size*.075),by+b[0]*size);ctx.quadraticCurveTo(cx+side*gap,by+Math.min(b[0],b[1])*size-size*.015,cx+side*(gap-size*.07),by+b[1]*size);ctx.stroke();
 }
 if(eyewear===2){
  // Shades cover the eyes in every state.
  ctx.fillStyle='#15171c';ctx.strokeStyle='#0c0d10';ctx.lineWidth=size*.02;
  for(const side of [-1,1]){ctx.beginPath();ctx.roundRect?ctx.roundRect(cx+side*gap-size*.1,eyeY-size*.065,size*.2,size*.13,size*.04):ctx.rect(cx+side*gap-size*.1,eyeY-size*.065,size*.2,size*.13);ctx.fill();}
  ctx.fillStyle='#4a5260';for(const side of [-1,1])ctx.fillRect(cx+side*gap-size*.07,eyeY-size*.045,size*.04,size*.02);
  ctx.beginPath();ctx.moveTo(cx-gap+size*.1,eyeY-size*.02);ctx.lineTo(cx+gap-size*.1,eyeY-size*.02);ctx.stroke();
 }else for(const side of [-1,1]){
  const ex=cx+side*gap;
  if(state==='blink'){ctx.strokeStyle=INK;ctx.lineWidth=size*.032;ctx.beginPath();ctx.moveTo(ex-r*1.2,eyeY);ctx.quadraticCurveTo(ex,eyeY+r*.9,ex+r*1.2,eyeY);ctx.stroke();}
  else if(style===5){ctx.strokeStyle=INK;ctx.lineWidth=size*.035;ctx.beginPath();ctx.moveTo(ex-r*1.15,eyeY+r*.3);ctx.quadraticCurveTo(ex,eyeY-r*1.2,ex+r*1.15,eyeY+r*.3);ctx.stroke();}
  else eye(ctx,ex,eyeY,r,{lid:style===4?.5:style===7||style===3?.28:style===0?.12:0,wide:style===1,lashes:style===1||style===6,look:style===2?.6:0});
 }
 if(eyewear===1){ctx.lineWidth=size*.024;ctx.strokeStyle='#2a2d33';for(const side of [-1,1]){ctx.beginPath();ctx.arc(cx+side*gap,eyeY,size*.085,0,Math.PI*2);ctx.stroke();}ctx.beginPath();ctx.moveTo(cx-gap+size*.085,eyeY-size*.01);ctx.quadraticCurveTo(cx,eyeY-size*.04,cx+gap-size*.085,eyeY-size*.01);ctx.stroke();}
 // Freckles for the cheery mood.
 if(style===5){ctx.fillStyle='#9a5a3a';for(const side of [-1,1])for(const [fx,fy] of [[.2,.1],[.25,.13],[.17,.14],[.23,.08]]){ctx.beginPath();ctx.arc(cx+side*size*fx,eyeY+size*fy,size*.009,0,Math.PI*2);ctx.fill();}}
 const mouthY=y+size*.74,w=size*.085;
 ctx.strokeStyle='#4a2420';ctx.fillStyle='#5a2226';ctx.lineWidth=size*.04;
 if(state==='talk'){
  ctx.beginPath();ctx.ellipse(cx,mouthY,size*.07,size*.055,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#d9656a';ctx.beginPath();ctx.ellipse(cx,mouthY+size*.03,size*.045,size*.022,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fbf8f2';ctx.fillRect(cx-size*.045,mouthY-size*.05,size*.09,size*.018);
  return;
 }
 ctx.beginPath();
 switch(style){
  case 0:ctx.moveTo(cx-w,mouthY-size*.015);ctx.quadraticCurveTo(cx,mouthY+size*.05,cx+w,mouthY-size*.015);ctx.stroke();break;
  case 1:ctx.ellipse(cx,mouthY,size*.035,size*.04,0,0,Math.PI*2);ctx.fill();break;
  case 2:ctx.moveTo(cx-w*.8,mouthY+size*.01);ctx.quadraticCurveTo(cx+w*.2,mouthY+size*.02,cx+w,mouthY-size*.03);ctx.stroke();break;
  case 3:ctx.moveTo(cx-w,mouthY+size*.025);ctx.quadraticCurveTo(cx,mouthY-size*.04,cx+w,mouthY+size*.025);ctx.stroke();break;
  case 4:ctx.moveTo(cx-w*.7,mouthY);ctx.lineTo(cx+w*.7,mouthY+size*.008);ctx.stroke();break;
  case 5:ctx.moveTo(cx-w*1.15,mouthY-size*.025);ctx.quadraticCurveTo(cx,mouthY+size*.11,cx+w*1.15,mouthY-size*.025);ctx.closePath();ctx.fill();
   ctx.fillStyle='#fbf8f2';ctx.fillRect(cx-w*.8,mouthY-size*.018,w*1.6,size*.022);break;
  case 6:ctx.moveTo(cx-w,mouthY+size*.01);ctx.quadraticCurveTo(cx-w*.5,mouthY-size*.025,cx,mouthY+size*.005);ctx.quadraticCurveTo(cx+w*.5,mouthY+size*.03,cx+w,mouthY-size*.005);ctx.stroke();break;
  default:ctx.moveTo(cx-w,mouthY+size*.004);ctx.lineTo(cx+w,mouthY+size*.004);ctx.stroke();
 }
}
export function peopleFaceTexture(){
 if(faceTexture)return faceTexture;
 if(typeof document==='undefined'||typeof document.createElement!=='function')return null;
 const cell=128,canvas=document.createElement('canvas');canvas.width=cell*PEOPLE_FACE_COLS;canvas.height=cell*PEOPLE_FACE_ROWS;
 const ctx=canvas.getContext?.('2d');if(!ctx)return null;
 const states=['open','blink','talk'];
 for(let row=0;row<PEOPLE_FACE_ROWS;row++)for(let col=0;col<PEOPLE_FACE_COLS;col++){
  // Row 0 sits at the bottom of the texture (v=0) because canvas textures flip Y.
  drawFace(ctx,col*cell,(PEOPLE_FACE_ROWS-1-row)*cell,cell,col%PEOPLE_FACE_STYLES,Math.floor(col/PEOPLE_FACE_STYLES),states[row]);
 }
 faceTexture=new THREE.CanvasTexture(canvas);faceTexture.colorSpace=THREE.SRGBColorSpace;faceTexture.anisotropy=2;faceTexture.generateMipmaps=true;faceTexture.minFilter=THREE.LinearMipmapLinearFilter;
 return faceTexture;
}
// One face material per batch: per-instance aFace picks the atlas cell in the vertex shader.
export function createFaceMaterial(){
 const map=peopleFaceTexture();
 const material=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.85,metalness:0,map,alphaTest:.5,transparent:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
 material.onBeforeCompile=shader=>{
  shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nattribute float aFace;').replace('#include <uv_vertex>',`#include <uv_vertex>\n#ifdef USE_MAP\n vMapUv=(uv+vec2(mod(aFace,${PEOPLE_FACE_COLS}.0),floor(aFace/${PEOPLE_FACE_COLS}.0)))/vec2(${PEOPLE_FACE_COLS}.0,${PEOPLE_FACE_ROWS}.0);\n#endif`);
 };
 material.customProgramCacheKey=()=>'gummy-people-face-v146';
 return material;
}
export function createFaceGeometry(capacity){
 const geometry=new THREE.PlaneGeometry(1,1);
 const attribute=new THREE.InstancedBufferAttribute(new Float32Array(Math.max(1,capacity)),1);attribute.setUsage(THREE.DynamicDrawUsage);
 geometry.setAttribute('aFace',attribute);
 return geometry;
}
export function createPeopleMaterial(flat=true){return new THREE.MeshStandardMaterial({color:0xffffff,roughness:.88,metalness:0,flatShading:flat});}
// v154 soft shading for people: a two-tone light/shadow band (clothes read as
// painted, not plastic), a soft AO toward the bottom of every part (under the chin,
// armpits, cuffs) and a faint rim so silhouettes pop against the street.
export const PEOPLE_SHADE_LIGHTS=`#include <lights_fragment_end>
#if NUM_DIR_LIGHTS > 0
 { float gBand=smoothstep(-.04,.2,dot(normal,directionalLights[0].direction)); reflectedLight.directDiffuse*=mix(.5,1.04,gBand); }
#endif
 { float gAo=mix(.7,1.0,smoothstep(-.5,.18,vPartY)); reflectedLight.indirectDiffuse*=gAo; reflectedLight.directDiffuse*=mix(.86,1.0,gAo); }`;
export const PEOPLE_SHADE_RIM=`{ float gRim=pow(1.0-clamp(dot(normal,normalize(vViewPosition)),0.0,1.0),3.0); outgoingLight+=diffuseColor.rgb*gRim*.2+vec3(.035)*gRim; }
#include <opaque_fragment>`;
// Soft body material: aTaper narrows the bottom (<1) or flares it (>1) per instance.
export function createBodyMaterial(){
 const material=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.82,metalness:0,flatShading:false});
 material.onBeforeCompile=shader=>{
  shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nattribute vec2 aTaper;\nvarying float vPartY;').replace('#include <begin_vertex>','#include <begin_vertex>\n vPartY=position.y;\n transformed.xz*=mix(aTaper,vec2(1.0),clamp(position.y+.5,0.0,1.0));');
  shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying float vPartY;')
   .replace('#include <lights_fragment_end>',PEOPLE_SHADE_LIGHTS)
   .replace('#include <opaque_fragment>',PEOPLE_SHADE_RIM);
 };
 material.customProgramCacheKey=()=>'gummy-people-body-v154';
 return material;
}

// ---- Rigid-part rig shared by the street crowd (procedural joints) and the
// animated cast (joints read from bones without their stretch). Units: metres.
// Joint frames are upright: +y up the body, +z forward; limbs hang along -y.
// 'box' parts are flat clothing details, 'round' parts are the soft body, head and hair.
const P=(name,mesh,joint,x,y,z,w,h,d,slot,when='always',far=false,tx=1,tz=1)=>Object.freeze({name,mesh,joint,x,y,z,w,h,d,slot,when,far,taper:Object.freeze([tx,tz])});
export const PERSON_PARTS=Object.freeze([
 P('front','box','chest',0,.15,.133,.11,.36,.014,'inner','open'),
 P('pocket','box','chest',0,.02,.133,.24,.10,.014,'hood','hoodie'),
 P('badge','box','chest',.1,.22,.136,.05,.06,.014,'badge','police'),
 P('belt','box','hips',0,.115,0,.35,.05,.24,'belt','belt'),
 P('collar','box','chest',0,.385,0,.25,.05,.21,'collar','collar'),
 P('bib','box','chest',0,.03,.134,.24,.26,.014,'bib','bib'),
 P('strapL','box','chest',-.09,.25,.125,.045,.22,.03,'bib','bib'),
 P('strapR','box','chest',.09,.25,.125,.045,.22,.03,'bib','bib'),
 P('stripeL','box','armL',-.058,-.16,0,.014,.34,.04,'accent','stripes'),
 P('stripeR','box','armR',.058,-.16,0,.014,.34,.04,'accent','stripes'),
 P('soleL','box','shinL',0,-.42,.045,.135,.03,.27,'sole','sole'),
 P('soleR','box','shinR',0,-.42,.045,.135,.03,.27,'sole','sole'),
 P('brim','box','head',0,.30,.17,.26,.022,.13,'brim','brim'),
 P('band','box','head',0,.30,0,.316,.035,.326,'band','band'),
 P('pelvis','round','hips',0,.04,0,.34,.20,.23,'pants','always',true,.95,1),
 P('torso','round','chest',0,.15,0,.40,.50,.26,'top','always',true,.8,1),
 P('neck','round','head',0,.03,0,.10,.12,.10,'skin'),
 P('upperL','round','armL',0,-.16,0,.11,.36,.12,'arm','always',true,.82,.82),
 P('upperR','round','armR',0,-.16,0,.11,.36,.12,'arm','always',true,.82,.82),
 P('foreL','round','foreL',0,-.13,0,.095,.28,.10,'sleeve','always',true,.8,.85),
 P('foreR','round','foreR',0,-.13,0,.095,.28,.10,'sleeve','always',true,.8,.85),
 P('thighL','round','thighL',0,-.18,0,.145,.40,.155,'pants','always',true,.8,.85),
 P('thighR','round','thighR',0,-.18,0,.145,.40,.155,'pants','always',true,.8,.85),
 P('shinL','round','shinL',0,-.17,0,.12,.38,.13,'pants','always',true,.76,.8),
 P('shinR','round','shinR',0,-.17,0,.12,.38,.13,'pants','always',true,.76,.8),
 P('shoeL','round','shinL',0,-.375,.04,.13,.10,.26,'shoes','always',true),
 P('shoeR','round','shinR',0,-.375,.04,.13,.10,.26,'shoes','always',true),
 P('head','round','head',0,.19,0,.29,.31,.29,'skin','always',true,.84,.95),
 P('nose','round','head',0,.15,.148,.055,.07,.06,'nose'),
 P('earL','round','head',-.152,.18,0,.045,.085,.07,'skin','ears'),
 P('earR','round','head',.152,.18,0,.045,.085,.07,'skin','ears'),
 P('hairTop','round','head',0,.31,-.012,.31,.11,.32,'hair','hairTop',true,1.05,1.05),
 P('hairBack','round','head',0,.23,-.10,.30,.16,.11,'hair','hairBack',true),
 P('hairExtra','round','head',0,.375,-.07,.13,.12,.12,'hair','hairExtra'),
 P('hat','round','head',0,.33,0,.31,.10,.32,'cap','hat',true),
 P('hoodUp','round','head',0,.2,-.035,.335,.37,.325,'hood','hoodUp',true),
 P('hoodDown','round','chest',0,.41,-.12,.30,.12,.12,'hood','hoodDown'),
 P('handL','round','foreL',0,-.3,.005,.095,.12,.09,'skin'),
 P('handR','round','foreR',0,-.3,.005,.095,.12,.09,'skin'),
 P('thumbL','round','foreL',.04,-.285,.04,.035,.075,.04,'skin'),
 P('thumbR','round','foreR',-.04,-.285,.04,.035,.075,.04,'skin'),
 P('cuffL','round','foreL',0,-.245,0,.098,.04,.104,'cuff','cuff'),
 P('cuffR','round','foreR',0,-.245,0,.098,.04,.104,'cuff','cuff'),
 P('toeL','round','shinL',0,-.39,.135,.128,.075,.09,'sole','toe'),
 P('toeR','round','shinR',0,-.39,.135,.128,.075,.09,'sole','toe'),
 P('hem','round','chest',0,-.085,0,.335,.05,.25,'hem','hem'),
 P('beard','round','head',0,.045,.07,.28,.12,.22,'beard','beard',false,.75,.9),
 P('mustache','round','head',0,.137,.155,.15,.04,.04,'beard','mustache'),
 P('face','face','head',0,.175,.152,.25,.25,1,'face')
]);
export const PERSON_MESH_PARTS=Object.freeze({
 box:Object.freeze(PERSON_PARTS.filter(p=>p.mesh==='box')),
 round:Object.freeze(PERSON_PARTS.filter(p=>p.mesh==='round')),
 face:Object.freeze(PERSON_PARTS.filter(p=>p.mesh==='face'))
});
export const PERSON_SLOT=Object.freeze(Object.fromEntries(Object.values(PERSON_MESH_PARTS).flatMap(list=>list.map((part,index)=>[part.name,index]))));
export const PERSON_TRIANGLES=Object.freeze({box:12,round:PEOPLE_ROUND_GEOMETRY.index.count/3,face:2});
export function personTriangles(far=false){
 const count=list=>list.filter(p=>!far||p.far).length;
 return count(PERSON_MESH_PARTS.box)*PERSON_TRIANGLES.box+count(PERSON_MESH_PARTS.round)*PERSON_TRIANGLES.round+(far?0:count(PERSON_MESH_PARTS.face)*PERSON_TRIANGLES.face);
}
// Legacy styles: hairStyle 'cap' meant short hair under a cap; 'police' a uniform cap.
export function hatOf(look){
 const s=look?.hairStyle;
 if(s==='cap')return 'cap';
 if(s==='police')return look?.hat&&look.hat!=='none'?look.hat:'police';
 return look?.hat||(look?.role==='police'?'police':'none');
}
export function hairOf(look){const s=look?.hairStyle||'short';return s==='cap'||s==='police'?'short':s;}
const OPEN_TOPS=new Set(['jacket','flannel','puffer','uniform','track']);
const HIDE_EARS=new Set(['long','bob','afro','curly']);
const SHAPE={x:0,y:0,z:0,w:1,h:1,d:1,tx:1,tz:1,ry:0};
const set=(o,x,y,z,w,h,d,tx=1,tz=1)=>{o.x=x;o.y=y;o.z=z;o.w=w;o.h=h;o.d=d;o.tx=tx;o.tz=tz;return true;};
// Resolves one part for a look: false when hidden, otherwise SHAPE holds its box.
function shapePart(part,look,detail,o=SHAPE){
 if(!detail&&!part.far)return false;
 o.x=part.x;o.y=part.y;o.z=part.z;o.w=part.w;o.h=part.h;o.d=part.d;o.tx=part.taper[0];o.tz=part.taper[1];o.ry=0;
 const top=look?.topStyle,police=look?.role==='police',hood=!!look?.hoodUp,hat=hatOf(look),hair=hairOf(look);
 const build=Number.isFinite(look?.build)?look.build:1,bw=1+(build-1)*.85,bl=1+(build-1)*.5;
 const hatted=hat!=='none'&&!hood;
 // v154: chest-front details ride on the (rounder, build-scaled) torso surface instead of sinking into it.
 if(part.mesh==='box'&&part.joint==='chest'&&part.z>.1)o.z=part.z*(1+(build-1)*1.1)*(top==='puffer'?1.14:1)+.01;
 switch(part.when){
  case 'always':break;
  case 'open':return OPEN_TOPS.has(top)||police;
  case 'hoodie':return top==='hoodie';
  case 'police':return police;
  case 'belt':o.w*=bw;o.d*=1+(build-1)*.8;return police||top==='tee'||top==='polo'||top==='flannel';
  case 'collar':if(Number.isFinite(look?.scarf))return set(o,0,.385,.005,.27,.075,.24);return police||top==='polo'||top==='flannel'||top==='jacket'||top==='puffer';
  case 'bib':
   if(top==='overalls')return true;
   if(top==='apron'){if(part.name==='bib')return set(o,0,-.03,.136,.30,.42,.014);return true;}
   return false;
  case 'stripes':return top==='track'||look?.role==='worker';
  case 'sole':return look?.shoeStyle!=='loafer';
  case 'toe':return (look?.shoeStyle||'sneaker')==='sneaker';
  case 'cuff':return look?.topStyle!=='tee'&&look?.topStyle!=='polo'&&look?.topStyle!=='overalls'&&look?.sleeve!==look?.skin;
  case 'hem':if(look?.topStyle==='overalls'||look?.topStyle==='apron')return false;o.w*=1+((Number.isFinite(look?.build)?look.build:1)-1)*.85*(look?.topStyle==='puffer'?1.1:1);o.d*=(1+((Number.isFinite(look?.build)?look.build:1)-1)*1.1)*(look?.topStyle==='puffer'?1.14:1);return true;
  case 'brim':
   if(!hatted)return false;o.ry=finite(look?.hatYaw);
   if(hat==='cap'||hat==='police')return true;
   if(hat==='bucket')return set(o,0,.29,0,.42,.025,.42);
   if(hat==='flatcap')return set(o,0,.30,.155,.28,.025,.1);
   return false;
  case 'band':
   if(!hatted)return false;
   if(hat==='police')return true;
   if(hat==='beanie')return set(o,0,.28,0,.325,.05,.335);
   return false;
  case 'hat':
   if(!hatted)return false;
   if(hat==='beanie')return set(o,0,.335,-.005,.32,.17,.33,1.04,1.04);
   if(hat==='bucket')return set(o,0,.335,0,.30,.12,.31,1.12,1.12);
   if(hat==='flatcap')return set(o,0,.32,-.01,.32,.08,.33);
   if(hat==='police')return set(o,0,.335,0,.31,.10,.32);
   return true;
  case 'hoodUp':return hood;
  case 'hoodDown':return top==='hoodie'&&!hood;
  case 'ears':return !hood&&!HIDE_EARS.has(hair);
  case 'hairTop':
   if(hood||hatted||hair==='bald'||hair==='mohawk'||hair==='combover')return false;
   if(hair==='buzz')return set(o,0,.30,-.006,.30,.075,.305);
   if(hair==='afro')return set(o,0,.35,-.05,.42,.22,.40);
   if(hair==='curly')return set(o,0,.32,-.03,.35,.15,.34,1.08,1.08);
   if(hair==='bob')return set(o,0,.31,-.02,.32,.11,.33);
   if(hair==='spiky')return set(o,0,.325,-.012,.30,.13,.31,1.1,1.1);
   return true;
  case 'hairBack':
   if(hood||hair==='bald'||hair==='buzz')return false;
   if(hair==='long')return set(o,0,.12,-.105,.31,.36,.12);
   if(hair==='bob')return set(o,0,.19,-.045,.34,.25,.25,1.05,1);
   if(hair==='afro')return hatted?set(o,0,.22,-.06,.36,.2,.26):set(o,0,.2,-.09,.38,.2,.18);
   if(hair==='curly')return set(o,0,.22,-.09,.34,.22,.14);
   if(hair==='combover')return set(o,0,.22,-.075,.31,.14,.17);
   return true;
  case 'hairExtra':
   if(hood)return false;
   if(hair==='ponytail')return set(o,0,.2,-.19,.085,.24,.085,.7,.7);
   if(hatted)return false;
   if(hair==='bun')return true;
   if(hair==='mohawk')return set(o,0,.365,-.01,.065,.13,.32);
   if(hair==='fringe')return set(o,0,.29,.125,.27,.06,.07);
   if(hair==='spiky')return set(o,0,.385,0,.2,.08,.22);
   if(hair==='combover')return set(o,.01,.343,-.005,.27,.03,.24);
   return false;
  case 'beard':{
   const b=look?.beard,k=Number.isFinite(look?.beardSize)?look.beardSize:1;
   if(b==='full')return set(o,0,.045,.07,.28*Math.min(1.15,k),.12*k,.22*Math.min(1.1,k),.75,.9);
   if(b==='goatee')return set(o,0,.055,.135,.09,.08,.06);
   return false;}
  case 'mustache':{
   const b=look?.beard,k=Number.isFinite(look?.mustache)?look.mustache:1;
   if(b!=='full'&&b!=='moustache')return false;
   return set(o,0,.137,.155,.15*k,.04*Math.sqrt(k),.04*k);}
  default:return false;
 }
 // Body shape: build widens torso, hips and upper limbs; puffers bulk up.
 switch(part.name){
  case 'torso':o.w*=bw*(top==='puffer'?1.1:1);o.d*=(1+(build-1)*1.1)*(top==='puffer'?1.14:1);o.tx=build>1.1?1.0:build<.95?.74:.8;break;
  case 'pelvis':o.w*=bw;o.d*=1+(build-1)*.8;break;
  case 'upperL':case 'upperR':{const k=bl*(top==='puffer'?1.16:1);o.w*=k;o.d*=k;break;}
  case 'thighL':case 'thighR':o.w*=bl;o.d*=bl;break;
  case 'shoeL':case 'shoeR':if(look?.shoeStyle==='boot'){o.h*=1.5;o.y+=.02;o.tx=.92;}else if(look?.shoeStyle==='loafer'){o.h*=.85;o.y-=.01;}break;
 }
 return true;
}
export function personPartEnabled(part,look,detail=true){return shapePart(part,look,detail);}
export function personSlotColor(look,slot){
 switch(slot){
  case 'band':return Number.isFinite(look.band)?look.band:0xe0bf3a;
  case 'sleeve':return look.sleeve;
  case 'cuff':return shade(Number.isFinite(look.sleeve)?look.sleeve:look.top,-.14);
  case 'hem':return shade(look.top,-.13);
  case 'arm':return Number.isFinite(look.arm)?look.arm:look.top;
  case 'nose':return shade(look.skin,-.035);
  case 'beard':return Number.isFinite(look.beardColor)?look.beardColor:look.hair;
  case 'sole':return Number.isFinite(look.sole)?look.sole:0x1d1a18;
  case 'accent':return Number.isFinite(look.accent)?look.accent:0xf2efe8;
  case 'collar':return Number.isFinite(look.scarf)?look.scarf:look.role==='police'?look.inner:look.topStyle==='flannel'?look.inner:shade(look.top,-.08);
  case 'bib':return look.topStyle==='apron'?(Number.isFinite(look.apron)?look.apron:0xe9e2cf):look.pants;
  case 'badge':return Number.isFinite(look.badge)?look.badge:POLICE_LOOK.badge;
  case 'belt':return Number.isFinite(look.belt)?look.belt:0x2a2420;
  case 'brim':return Number.isFinite(look.brim)?look.brim:0x1c1c20;
  default:return look[slot]??look.top;
 }
}
// Pose → joint matrices for a free-standing person. root already holds position and yaw.
const m1=new THREE.Matrix4(),m2=new THREE.Matrix4(),rx=new THREE.Matrix4(),rz=new THREE.Matrix4(),ry=new THREE.Matrix4();
function jointAt(out,parent,x,y,z,angleX=0,angleZ=0,angleY=0){
 m1.makeTranslation(x,y,z);rx.makeRotationX(angleX);rz.makeRotationZ(angleZ);
 out.multiplyMatrices(parent,m1);
 if(angleY)out.multiply(ry.makeRotationY(angleY));
 return out.multiply(rx).multiply(rz);
}
export function createJointSet(){return {hips:new THREE.Matrix4(),chest:new THREE.Matrix4(),head:new THREE.Matrix4(),armL:new THREE.Matrix4(),armR:new THREE.Matrix4(),foreL:new THREE.Matrix4(),foreR:new THREE.Matrix4(),thighL:new THREE.Matrix4(),thighR:new THREE.Matrix4(),shinL:new THREE.Matrix4(),shinR:new THREE.Matrix4()};}
// Slow idle breathing in [-1,1]; ids desync so a crowd never breathes in step.
export function breathe(now=0,id=0){return Math.sin(finite(now)*1.55+finite(id)*1.37);}
// v146 walk: fuller arm swing with elbow bend, hips/chest counter-twist, knee lift
// and a head that stays level. pose.breath adds a chest rise while standing.
export const WALK_ARM_SWING=.6,WALK_LEG_SWING=.5;
export function proceduralJoints(joints,root,pose={}){
 const swing=finite(pose.swing),sit=!!pose.sit,bob=finite(pose.bob),raise=finite(pose.raise),sway=finite(pose.sway),crouch=sit?0:finite(pose.crouch),breath=finite(pose.breath);
 const hipY=sit?.50:.80+bob-crouch,twist=sit?0:swing*.09;
 jointAt(joints.hips,root,0,hipY,0,0,sway*.3,twist);
 jointAt(joints.chest,joints.hips,0,.17+breath*.006,0,(sit?-.05:crouch*.9)+Math.abs(swing)*.04-breath*.015,sway,-twist*2.2);
 jointAt(joints.head,joints.chest,0,.41,0,finite(pose.nod)+breath*.012,-sway*.5,twist*1.2);
 if(pose.turn)joints.head.multiply(ry.makeRotationY(finite(pose.turn)));
 for(const [side,sign] of [['L',-1],['R',1]]){
  const arm=sit?-.35:swing*-sign*WALK_ARM_SWING+(side==='R'?raise:0);
  jointAt(joints['arm'+side],joints.chest,sign*.235,.36+breath*.004,0,arm,sign*(.08+breath*.015));
  jointAt(joints['fore'+side],joints['arm'+side],0,-.32,0,sit?-.5:(side==='R'&&raise?-.6:-.2-Math.max(0,swing*sign)*.38),0);
  const thigh=sit?-1.5:swing*sign*WALK_LEG_SWING-crouch*3.2;
  jointAt(joints['thigh'+side],joints.hips,sign*.09,0,0,thigh,0);
  jointAt(joints['shin'+side],joints['thigh'+side],0,-.36,0,sit?1.5:Math.max(0,-swing*sign)*.85+(swing?.06:0)+crouch*6,0);
 }
 poseArms(joints,pose);
 return joints;
}
// Breathing for bone-driven people: lifts the chest and shoulders a few millimetres.
const bm=new THREE.Matrix4();
export function breatheJoints(joints,b=0){
 const v=finite(b);if(!v||!joints?.chest)return joints;
 joints.chest.multiply(bm.makeTranslation(0,v*.005,0));joints.chest.multiply(bm.makeRotationX(-v*.015));
 for(const [side,sign] of [['L',-1],['R',1]])if(joints['arm'+side])joints['arm'+side].multiply(bm.makeRotationZ(sign*v*.012));
 return joints;
}
// Height for bone-driven people: scales every joint about the feet (x,y,z).
const sAbout=new THREE.Matrix4(),tA=new THREE.Matrix4(),tB=new THREE.Matrix4();
export function scaleJointsAbout(joints,x,y,z,s){
 if(!Number.isFinite(s)||Math.abs(s-1)<1e-4)return joints;
 sAbout.copy(tA.makeTranslation(x,y,z)).multiply(tB.makeScale(s,s,s)).multiply(tA.makeTranslation(-x,-y,-z));
 for(const key of Object.keys(joints))joints[key].premultiply(sAbout);
 return joints;
}
// Reaction arms (wave, point, cower, phone): {x,z,fore} radians at the shoulder and elbow.
// Rebuilds the arm from the chest joint, so it also works on bone-driven people.
export function poseArms(joints,pose={}){
 for(const [side,sign] of [['L',-1],['R',1]]){
  const arm=pose['arm'+side];if(!arm||!joints.chest)continue;
  jointAt(joints['arm'+side],joints.chest,sign*.235,.36,0,finite(arm.x),sign*Math.abs(finite(arm.z))+sign*.07);
  jointAt(joints['fore'+side],joints['arm'+side],0,-.32,0,finite(arm.fore),0);
 }
 return joints;
}
const partMatrix=new THREE.Matrix4(),partLocal=new THREE.Matrix4(),ZERO=new THREE.Matrix4().makeScale(0,0,0),headJoint=new THREE.Matrix4(),headScale=new THREE.Matrix4().makeScale(PEOPLE_HEAD_SCALE,PEOPLE_HEAD_SCALE,PEOPLE_HEAD_SCALE);
// Writes one person into the instanced meshes at slot `person`. Disabled parts collapse to zero.
export function writePerson(meshes,person,joints,look,{detail=true,face='open',active=true,tint=null}={}){
 if(joints?.head)headJoint.multiplyMatrices(joints.head,headScale);
 for(const kind of ['box','round','face']){
  const mesh=meshes[kind];if(!mesh)continue;
  const list=PERSON_MESH_PARTS[kind],base=person*list.length,taper=kind==='round'?mesh.geometry.getAttribute('aTaper'):null;
  for(let i=0;i<list.length;i++){
   const part=list[i],on=active&&!!look&&!!joints[part.joint]&&shapePart(part,look,detail,SHAPE);
   if(on){
    const o=SHAPE;
    if(o.ry){const c=Math.cos(o.ry),s=Math.sin(o.ry);partLocal.makeRotationY(o.ry).setPosition(o.x*c+o.z*s,o.y,-o.x*s+o.z*c);}
    else partLocal.makeTranslation(o.x,o.y,o.z);
    m2.makeScale(o.w,o.h,o.d);partLocal.multiply(m2);
    partMatrix.multiplyMatrices(part.joint==='head'?headJoint:joints[part.joint],partLocal);mesh.setMatrixAt(base+i,partMatrix);
    if(taper)taper.setXY(base+i,o.tx,o.tz);
   }
   else mesh.setMatrixAt(base+i,ZERO);
   if(kind==='face'){const attr=mesh.geometry.getAttribute('aFace');if(attr)attr.setX(base+i,faceCell(look,face));}
   else if(on||!active){scratchColor.setHex(look?personSlotColor(look,part.slot):0xffffff);if(tint&&tint.amount>0)scratchColor.lerp(tintColor.setHex(tint.color),Math.min(1,tint.amount));mesh.setColorAt(base+i,scratchColor);}
  }
 }
}
const scratchColor=new THREE.Color(),tintColor=new THREE.Color();
export function createPeopleMeshes(three,scene,capacity,name){
 const material=createPeopleMaterial();
 const parts={box:PERSON_MESH_PARTS.box.length,round:PERSON_MESH_PARTS.round.length,face:PERSON_MESH_PARTS.face.length};
 const box=new three.InstancedMesh(PEOPLE_BOX_GEOMETRY,material,capacity*parts.box);
 const round=new three.InstancedMesh(createBodyGeometry(capacity*parts.round),createBodyMaterial(),capacity*parts.round);
 const face=new three.InstancedMesh(createFaceGeometry(capacity*parts.face),createFaceMaterial(),capacity*parts.face);
 box.name=name;round.name=name+' heads';face.name=name+' faces';
 for(const mesh of [box,round,face]){mesh.frustumCulled=false;mesh.castShadow=false;mesh.receiveShadow=true;mesh.instanceMatrix.setUsage(three.DynamicDrawUsage);scene.add(mesh);}
 face.receiveShadow=false;
 // Allocate instanceColor up front so the first frame is never black.
 for(const mesh of [box,round]){for(let i=0;i<mesh.count;i++)mesh.setColorAt(i,scratchColor.setHex(0xffffff));}
 return {box,round,face,material,capacity,parts};
}
// `used` trims the draw to the people actually written this frame, so spare
// capacity costs no vertex work.
export function flushPeopleMeshes(meshes,visible=true,used=null){
 for(const kind of ['box','round','face']){
  const mesh=meshes[kind];if(!mesh)continue;
  if(meshes.parts&&Number.isFinite(meshes.capacity)){
   const people=Number.isFinite(used)?Math.max(0,Math.min(meshes.capacity,Math.trunc(used))):meshes.capacity;
   mesh.count=people*meshes.parts[kind];
  }
  mesh.visible=visible&&mesh.count>0;mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
  for(const name of ['aFace','aTaper']){const attr=mesh.geometry.getAttribute(name);if(attr)attr.needsUpdate=true;}
 }
}
