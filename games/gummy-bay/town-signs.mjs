// v131 town signage. Every business sign is painted into one shared atlas at
// boot (no font or image downloads). Boards glow softly like light boxes at
// night; neon signs and rooftop letters glow hard. Rooftop letters are cut out
// and doubled to read as extruded, Hyland-style roof signs.
import * as THREE from './vendor/three.module.min.js';

// Original joke names. Types match building-kit archetypes.
export const NAMED_BUSINESSES=Object.freeze([
 {key:'arcade',name:'LUCKY PIER',sub:'PRIZE ARCADE · TICKETS ONLY',type:'arcade',style:'letters',fg:'#ffd84a',glow:'#ff4fb0',bg:'#2b1438'},
 {key:'taco',name:'TACO TANTRUM',sub:'SCREAMINGLY GOOD TACOS',type:'diner',style:'letters',fg:'#ffb13b',glow:'#ff6a2a',bg:'#3a1d12'},
 {key:'burger',name:'BUN INTENDED',sub:'BURGERS · SHAKES',type:'diner',style:'neon',fg:'#ffe36e',glow:'#ff3d3d',bg:'#1d1414'},
 {key:'noodle',name:'WOK THIS WAY',sub:'NOODLES · DUMPLINGS',type:'terrace',style:'neon',fg:'#ff5d5d',glow:'#ff2a4a',bg:'#1b0f0f'},
 {key:'laundry',name:'SPIN DOCTORS',sub:'LAUNDROMAT · OPEN LATE',type:'laundromat',style:'board',fg:'#1f4e79',bg:'#e9f1f5',edge:'#4a8bbd'},
 {key:'motel',name:'MOTEL',sub:'DRIFTWOOD · VACANCY',type:'motel',style:'neon',fg:'#ff4a4a',glow:'#ff2020',bg:'#141414'},
 {key:'pawn',name:'PAWN AGAIN',sub:'WE BUY · WE SELL · NO QUESTIONS*',type:'pawn',style:'board',fg:'#f6d24a',bg:'#232323',edge:'#f6d24a'},
 {key:'carwash',name:'SCRUB-A-DUB',sub:'CAR WASH · $5',type:'carwash',style:'neon',fg:'#62d8ff',glow:'#1aa8ff',bg:'#10202a'},
 {key:'mart',name:'QUIK-ISH MART',sub:'MOSTLY OPEN',type:'shop',style:'board',fg:'#ffffff',bg:'#c8322b',edge:'#ffd34a'},
 {key:'donut',name:'HOLE LOTTA DONUTS',sub:'COPS EAT FREE (NOT REALLY)',type:'shop',style:'neon',fg:'#ff9ad5',glow:'#ff4fb0',bg:'#2a1424'},
 {key:'chicken',name:'FOWL PLAY',sub:'FRIED CHICKEN',type:'shop',style:'board',fg:'#7a1d12',bg:'#f3c33c',edge:'#7a1d12'},
 {key:'coffee',name:'GRINDHOUSE',sub:'COFFEE · TOASTIES',type:'shop',style:'board',fg:'#f2e6cf',bg:'#3b2a20',edge:'#c79a5a'},
 {key:'pretzel',name:'THE SOGGY PRETZEL',sub:'DINER · ALL DAY BREAKFAST',type:'diner',style:'neon',fg:'#9dff7a',glow:'#3dff6a',bg:'#102012'},
 {key:'tackle',name:'BAIT & SWITCH',sub:'TACKLE · BAIT · ICE',type:'container',style:'board',fg:'#ffffff',bg:'#2f6d8c',edge:'#ffffff'},
 {key:'open',name:'OPEN-ISH 24/7',sub:'CONVENIENCE',type:'shop',style:'neon',fg:'#7dffb0',glow:'#20e080',bg:'#0f1d16'},
 {key:'flats',name:'SEAGULL COURT',sub:'FLATS',type:'flats',style:'board',fg:'#2d2d2d',bg:'#e8e0c8',edge:'#2d2d2d'}
]);
export const GENERIC_SIGNS=Object.freeze([
 {name:'FOR LEASE',style:'board',fg:'#c8322b',bg:'#f4f1e8',edge:'#c8322b'},
 {name:'NAILS',style:'neon',fg:'#ff8ad8',glow:'#ff40c0',bg:'#1b1020'},
 {name:'DRY CLEANING',style:'board',fg:'#2b4e8c',bg:'#e9eef4',edge:'#2b4e8c'},
 {name:'PHONE REPAIR',style:'board',fg:'#ffffff',bg:'#2b6e4a',edge:'#ffffff'},
 {name:'KEYS CUT',style:'board',fg:'#1d1d1d',bg:'#f5c842',edge:'#1d1d1d'},
 {name:'BARBER',style:'board',fg:'#ffffff',bg:'#a32a2a',edge:'#ffffff'},
 {name:'DISCOUNT $2',style:'board',fg:'#ffeb3b',bg:'#3049a8',edge:'#ffeb3b'},
 {name:'OPEN',style:'neon',fg:'#ff5a5a',glow:'#ff2020',bg:'#140c0c'},
 {name:'BAKERY',style:'board',fg:'#6a3b1f',bg:'#f5e3c4',edge:'#6a3b1f'},
 {name:'TAX HELP',style:'board',fg:'#ffffff',bg:'#55606a',edge:'#ffffff'},
 {name:'VIDEO GAMES',style:'neon',fg:'#8affff',glow:'#20c8ff',bg:'#0c1620'},
 {name:'SHOES',style:'board',fg:'#2d2d2d',bg:'#d8e8d0',edge:'#2d2d2d'}
]);
export const HIGHWAY_SIGNS=Object.freeze([
 {name:'GUMMY BAY EXPWY',sub:'EXIT 1 · DRIFTWOOD · MAIN DRAG',style:'highway',fg:'#ffffff',bg:'#1f6a3f',edge:'#ffffff'},
 {name:'MAINLAND ← 12',sub:'SUGAR-FREE ZONE AHEAD',style:'highway',fg:'#ffffff',bg:'#1f6a3f',edge:'#ffffff'}
]);
export const SIGN_SPECS=Object.freeze([...NAMED_BUSINESSES,...GENERIC_SIGNS,...HIGHWAY_SIGNS]);
const COLS=2,ROWS=16,CW=512,CH=128;
export const SIGN_CELLS=COLS*ROWS;

function fitFont(g,text,maxW,maxH,weight=900,family='"Arial Black","Helvetica Neue",Arial,sans-serif'){
 let size=Math.floor(maxH);g.font=`${weight} ${size}px ${family}`;
 const w=g.measureText(text).width||text.length*size*.6;if(w>maxW)size=Math.max(10,Math.floor(size*maxW/w));g.font=`${weight} ${size}px ${family}`;return size;
}
function paintSign(g,e,x,y,s){
 const cx=x+CW/2;g.save();e.save();g.textAlign=e.textAlign='center';g.textBaseline=e.textBaseline='middle';
 const hasSub=!!s.sub,mainY=y+(hasSub?CH*.4:CH*.52),subY=y+CH*.82;
 if(s.style==='letters'){
  // cut-out letters: transparent background, thick outline
  g.clearRect(x,y,CW,CH);e.fillStyle='#000';e.fillRect(x,y,CW,CH);
  fitFont(g,s.name,CW*.94,CH*.62);g.lineJoin='round';g.lineWidth=10;g.strokeStyle=s.bg;g.strokeText(s.name,cx,mainY);g.fillStyle=s.fg;g.fillText(s.name,cx,mainY);
  e.font=g.font;e.lineJoin='round';e.lineWidth=6;e.strokeStyle=s.glow;e.strokeText(s.name,cx,mainY);e.fillStyle=s.fg;e.fillText(s.name,cx,mainY);
  if(hasSub){fitFont(g,s.sub,CW*.8,CH*.22,800);g.lineWidth=6;g.strokeStyle=s.bg;g.strokeText(s.sub,cx,subY);g.fillStyle='#ffffff';g.fillText(s.sub,cx,subY);e.font=g.font;e.fillStyle=s.glow;e.fillText(s.sub,cx,subY);}
 }else if(s.style==='neon'){
  g.fillStyle=s.bg;g.fillRect(x,y,CW,CH);g.strokeStyle='#3b3b3b';g.lineWidth=8;g.strokeRect(x+4,y+4,CW-8,CH-8);
  e.fillStyle='#000';e.fillRect(x,y,CW,CH);
  fitFont(g,s.name,CW*.88,CH*(hasSub?.5:.66),800,'"Trebuchet MS","Helvetica Neue",Arial,sans-serif');
  for(const [ctx,glow] of [[g,.9],[e,1]]){ctx.font=g.font;ctx.shadowColor=s.glow;ctx.shadowBlur=18;ctx.lineWidth=7;ctx.strokeStyle=s.glow;ctx.strokeText(s.name,cx,mainY);ctx.shadowBlur=0;ctx.lineWidth=2.5;ctx.strokeStyle=s.fg;ctx.strokeText(s.name,cx,mainY);ctx.fillStyle=ctx===g?'rgba(255,255,255,.18)':'rgba(255,255,255,.35)';ctx.fillText(s.name,cx,mainY);}
  if(hasSub){fitFont(g,s.sub,CW*.8,CH*.2,700);g.fillStyle=s.fg;g.fillText(s.sub,cx,subY);e.font=g.font;e.fillStyle=s.glow;e.fillText(s.sub,cx,subY);}
  // border tube
  e.strokeStyle=s.glow;e.lineWidth=4;e.strokeRect(x+10,y+10,CW-20,CH-20);g.strokeStyle=s.glow;g.lineWidth=3;g.strokeRect(x+10,y+10,CW-20,CH-20);
 }else{
  // painted light-box board (highway signs reuse this with reflective text)
  g.fillStyle=s.bg;g.fillRect(x,y,CW,CH);g.strokeStyle=s.edge||s.fg;g.lineWidth=s.style==='highway'?5:7;g.strokeRect(x+8,y+8,CW-16,CH-16);
  fitFont(g,s.name,CW*.88,CH*(hasSub?.48:.6),900);g.fillStyle=s.fg;g.fillText(s.name,cx,mainY);
  if(hasSub){fitFont(g,s.sub,CW*.84,CH*.2,700);g.fillText(s.sub,cx,subY);}
  // grime on boards
  g.fillStyle='rgba(40,30,20,.12)';for(let i=0;i<10;i++)g.fillRect(x+Math.random()*CW,y+CH*.6+Math.random()*CH*.35,20+Math.random()*60,3);
  e.globalAlpha=s.style==='highway'?.06:.28;e.drawImage(g.canvas,x,y,CW,CH,x,y,CW,CH);e.globalAlpha=1;
 }
 g.restore();e.restore();
}
let signAtlas=null;
export function townSignAtlas(){
 if(signAtlas)return signAtlas;
 const doc=globalThis.document;let map=null,emissive=null;
 try{if(doc?.createElement){const a=doc.createElement('canvas'),b=doc.createElement('canvas');a.width=b.width=CW*COLS;a.height=b.height=CH*ROWS;const g=a.getContext('2d'),e=b.getContext('2d');
  if(g&&e){e.fillStyle='#000';e.fillRect(0,0,CW*COLS,CH*ROWS);SIGN_SPECS.forEach((s,i)=>paintSign(g,e,(i%COLS)*CW,Math.floor(i/COLS)*CH,s));
   // last cell: plain dark metal for sign edges and frames
   const lx=(COLS-1)*CW,ly=(ROWS-1)*CH;g.fillStyle='#3a3d3c';g.fillRect(lx,ly,CW,CH);e.fillStyle='#000';e.fillRect(lx,ly,CW,CH);
   map=new THREE.CanvasTexture(a);emissive=new THREE.CanvasTexture(b);for(const t of [map,emissive]){t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;}}}}
 catch{map=null;emissive=null;}
 signAtlas={map,emissive};return signAtlas;
}
export function signCellUV(index){const i=Math.max(0,Math.min(SIGN_CELLS-1,index|0)),c=i%COLS,r=Math.floor(i/COLS);
 // CanvasTexture flips Y: canvas row 0 is v=1.
 return {u0:c/COLS+.002,u1:(c+1)/COLS-.002,v0:1-(r+1)/ROWS+.002,v1:1-r/ROWS-.002};}
export const FRAME_CELL=SIGN_CELLS-1;

export function createSignMaterial(){
 const {map,emissive}=townSignAtlas();
 const m=new THREE.MeshStandardMaterial({color:0xffffff,vertexColors:true,map,emissiveMap:emissive,emissive:emissive?0xffffff:0x000000,emissiveIntensity:0,roughness:.6,alphaTest:.4,side:THREE.DoubleSide});
 m.name='Town sign atlas';return m;
}
// Simple quad batch with explicit UVs.
export class SignBatch{
 constructor(){this.pos=[];this.uv=[];this.col=[];this.nor=[];this.idx=[];this.count=0;}
 // Sign centred at (x,y,z) facing angle `rot` (0 = +z), w×h, optional extrusion depth.
 sign(x,y,z,rot,w,h,cell,{depth=.18,letters=false}={}){
  const c=Math.cos(rot),s=Math.sin(rot),P=(lx,ly,lz)=>[x+lx*c+lz*s,y+ly,z-lx*s+lz*c],N=(nx,nz)=>[nx*c+nz*s,0,-nx*s+nz*c];
  const uv=signCellUV(cell),fr=signCellUV(FRAME_CELL);
  const quad=(a,b,cc,d,n,u,shade=1)=>{const base=this.pos.length/3;for(const p of [a,b,cc,d]){this.pos.push(...p);this.nor.push(...n);this.col.push(shade,shade,shade);}this.uv.push(u.u0,u.v0,u.u1,u.v0,u.u1,u.v1,u.u0,u.v1);this.idx.push(base,base+1,base+2,base,base+2,base+3);};
  const hw=w/2,hh=h/2;
  if(letters){
   // two layers: dark back plate letters and bright face → reads as extruded
   quad(P(-hw,-hh,-depth),P(hw,-hh,-depth),P(hw,hh,-depth),P(-hw,hh,-depth),N(0,1),uv,.35);
   quad(P(-hw,-hh,0),P(hw,-hh,0),P(hw,hh,0),P(-hw,hh,0),N(0,1),uv,1);
   // back face so the sign reads from behind as dark letters
   quad(P(hw,-hh,-depth-.02),P(-hw,-hh,-depth-.02),P(-hw,hh,-depth-.02),P(hw,hh,-depth-.02),N(0,-1),uv,.25);
  }else{
   quad(P(-hw,-hh,0),P(hw,-hh,0),P(hw,hh,0),P(-hw,hh,0),N(0,1),uv,1);
   quad(P(hw,-hh,-depth),P(-hw,-hh,-depth),P(-hw,hh,-depth),P(hw,hh,-depth),N(0,-1),fr,1);
   quad(P(-hw,hh,0),P(hw,hh,0),P(hw,hh,-depth),P(-hw,hh,-depth),[0,1,0],fr,1);
   quad(P(-hw,-hh,-depth),P(hw,-hh,-depth),P(hw,-hh,0),P(-hw,-hh,0),[0,-1,0],fr,1);
   quad(P(hw,-hh,0),P(hw,-hh,-depth),P(hw,hh,-depth),P(hw,hh,0),N(1,0),fr,1);
   quad(P(-hw,-hh,-depth),P(-hw,-hh,0),P(-hw,hh,0),P(-hw,hh,-depth),N(-1,0),fr,1);
  }
  this.count++;
 }
 toGeometry(){if(!this.idx.length)return null;const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(this.pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(this.nor,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(this.uv,2));g.setAttribute('color',new THREE.Float32BufferAttribute(this.col,3));g.setIndex(this.idx);g.computeBoundingSphere();return g;}
}
