// v163 dodgy dressing. Makes the Kenney blocks and the alleys between them read
// cramped and run-down: wall AC units, downpipes, roller shutters, fire escapes,
// boarded windows, rust and rain streaks, family-friendly spray tags, wheelie bins,
// crates, puddles, litter and dim alley lamps. Everything is generated in code
// (no downloads) and baked into two merged meshes: solid props, and alpha decals
// that also carry the rooftop shop signs and alley lamp bulbs (lit at night).
import * as THREE from './vendor/three.module.min.js';

const rngFor=seed=>{let t=(seed>>>0)||1;return ()=>{t=(t+0x6D2B79F5)>>>0;let x=Math.imul(t^t>>>15,t|1);x^=x+Math.imul(x^x>>>7,x|61);return ((x^x>>>14)>>>0)/4294967296;};};
// Decal atlas: 4x4 tiles of 256 px.
export const DECAL_TILES=Object.freeze({streak:0,rust:1,damp:2,puddle:3,litter:4,shutter:5,tag0:6,tag1:7,tag2:8,tag3:9,tag4:10,tag5:11,boards:12,posters:13,oil:14,cracks:15});
// Spray tags stay family friendly.
export const TAGS=Object.freeze(['GUMZ','STICKY','BAY BOYZ','WAZ ERE','SK8','NO PARKING?']);
const GLOW_ROWS=8;

/* ---------- tiny geometry builder ---------- */
class Builder{
 constructor(){this.p=[];this.n=[];this.u=[];this.c=[];this.i=[];}
 get count(){return this.p.length/3;}
 // quad from centre, right (rx,ry,rz)*hw, up (ux,uy,uz)*hh, normal
 quad(cx,cy,cz,R,U,N,hw,hh,uv,col=[1,1,1]){const b=this.count,[u0,v0,u1,v1]=uv;
  const pts=[[-1,-1,u0,v0],[1,-1,u1,v0],[1,1,u1,v1],[-1,1,u0,v1]];
  for(const [a,bb,uu,vv] of pts){this.p.push(cx+R[0]*hw*a+U[0]*hh*bb,cy+R[1]*hw*a+U[1]*hh*bb,cz+R[2]*hw*a+U[2]*hh*bb);this.n.push(...N);this.u.push(uu,vv);this.c.push(...col);}
  this.i.push(b,b+1,b+2,b,b+2,b+3);}
 // axis-aligned box rotated by yaw around its own centre
 box(x,y,z,w,h,d,yaw,col,uv=[0,0,0,0]){const c=Math.cos(yaw),s=Math.sin(yaw),R=[c,0,-s],F=[s,0,c],Up=[0,1,0],shade=k=>col.map(v=>v*k);
  const faces=[[F,R,Up,d/2,w/2,h/2,1],[F.map(v=>-v),R.map(v=>-v),Up,d/2,w/2,h/2,.92],[R,F.map(v=>-v),Up,w/2,d/2,h/2,.84],[R.map(v=>-v),F,Up,w/2,d/2,h/2,.84],[Up,R,F.map(v=>-v),h/2,w/2,d/2,1.06]];
  for(const [N,RR,UU,off,hw,hh,k] of faces)this.quad(x+N[0]*off,y+N[1]*off,z+N[2]*off,RR,UU,N,hw,hh,uv,shade(k));}
 geometry(){if(!this.i.length)return null;const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(this.p,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(this.n,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(this.u,2));g.setAttribute('color',new THREE.Float32BufferAttribute(this.c,3));g.setIndex(this.i.length>65535?new THREE.Uint32BufferAttribute(this.i,1):new THREE.Uint16BufferAttribute(this.i,1));g.computeBoundingSphere();return g;}
}
// One 1024x2048 atlas: decal tiles on top, sign rows (128 px each) below.
const tileUV=(k,inset=.004)=>{const x=k%4,y=Math.floor(k/4);return [x/4+inset,1-(y+1)/8+inset/2,(x+1)/4-inset,1-y/8-inset/2];};
const rowUV=i=>[0,1-(8+i+1)/16+.003,1,1-(8+i)/16-.003],LAMP_UV=[.01,.002,.05,.03];
const hex=h=>[(h>>16&255)/255,(h>>8&255)/255,(h&255)/255];

/* ---------- textures (browser only) ---------- */
function drawAtlas(signs=[]){
 if(typeof document==='undefined')return {map:null,emissive:null};const cv=document.createElement('canvas');cv.width=1024;cv.height=2048;const x=cv.getContext('2d'),r=rngFor(77);
 const tile=(k,fn)=>{x.save();x.translate((k%4)*256,Math.floor(k/4)*256);x.beginPath();x.rect(0,0,256,256);x.clip();fn(x);x.restore();};
 tile(0,g=>{for(let i=0;i<26;i++){const px=r()*256,w=3+r()*14,y0=r()*40,len=60+r()*170,gr=g.createLinearGradient(0,y0,0,y0+len);gr.addColorStop(0,'rgba(40,30,20,0)');gr.addColorStop(.15,'rgba(40,30,20,.42)');gr.addColorStop(1,'rgba(40,30,20,0)');g.fillStyle=gr;g.fillRect(px,y0,w,len);}});
 tile(1,g=>{for(let i=0;i<40;i++){const px=128+(r()-.5)*150,py=70+r()*120,rad=6+r()*30;const gr=g.createRadialGradient(px,py,0,px,py,rad);gr.addColorStop(0,'rgba(140,70,25,.55)');gr.addColorStop(1,'rgba(140,70,25,0)');g.fillStyle=gr;g.fillRect(0,0,256,256);}
  for(let i=0;i<14;i++){const px=128+(r()-.5)*120,gr=g.createLinearGradient(0,120,0,256);gr.addColorStop(0,'rgba(120,60,20,.45)');gr.addColorStop(1,'rgba(120,60,20,0)');g.fillStyle=gr;g.fillRect(px,120,2+r()*5,136);}});
 tile(2,g=>{for(let i=0;i<30;i++){const px=r()*256,py=140+r()*116,rad=20+r()*60;const gr=g.createRadialGradient(px,py,0,px,py,rad);gr.addColorStop(0,'rgba(30,34,26,.35)');gr.addColorStop(1,'rgba(30,34,26,0)');g.fillStyle=gr;g.fillRect(0,0,256,256);}});
 tile(3,g=>{g.fillStyle='rgba(32,38,44,.78)';g.beginPath();g.ellipse(128,128,118,84,0,0,7);g.fill();g.fillStyle='rgba(160,180,200,.35)';g.beginPath();g.ellipse(100,104,44,14,-.3,0,7);g.fill();});
 tile(4,g=>{for(let i=0;i<34;i++){g.save();g.translate(20+r()*216,20+r()*216);g.rotate(r()*6);g.fillStyle=['#e8e2d0','#c94a3a','#3a6fb0','#f2c94c','#8a7a60','#ffffff'][Math.floor(r()*6)];g.fillRect(-6,-4,8+r()*12,5+r()*8);g.restore();}});
 tile(5,g=>{g.fillStyle='#8d9290';g.fillRect(0,0,256,256);for(let y=0;y<256;y+=9){g.fillStyle='#6f7472';g.fillRect(0,y,256,2);g.fillStyle='#a9aeab';g.fillRect(0,y+3,256,1);}
  for(let i=0;i<10;i++){const gr=g.createLinearGradient(0,0,0,256);gr.addColorStop(0,'rgba(60,40,20,0)');gr.addColorStop(1,'rgba(60,40,20,.5)');g.fillStyle=gr;g.fillRect(r()*256,0,10+r()*30,256);}
  g.fillStyle='#4a4e4c';g.fillRect(0,240,256,16);});
 TAGS.forEach((t,i)=>tile(6+i,g=>{const col=['#ff4fb0','#34d1ff','#ffd23f','#7dff6a','#ff7a2f','#c38bff'][i];g.translate(128,128);g.rotate((r()-.5)*.35);g.font='900 '+(t.length>6?44:64)+'px Impact, Arial Black, sans-serif';g.textAlign='center';g.textBaseline='middle';
  g.lineJoin='round';g.lineWidth=14;g.strokeStyle='#141414';g.strokeText(t,0,0);g.lineWidth=6;g.strokeStyle='#ffffff';g.strokeText(t,0,0);g.fillStyle=col;g.fillText(t,0,0);
  g.fillStyle=col;for(let k=0;k<6;k++)g.fillRect(-90+r()*180,24+r()*10,3,10+r()*30);}));
 tile(12,g=>{g.fillStyle='#2b241c';g.fillRect(0,0,256,256);for(let k=0;k<5;k++){g.save();g.translate(128,30+k*50);g.rotate((r()-.5)*.18);g.fillStyle=['#a8875e','#9b7a52','#b4946a'][k%3];g.fillRect(-140,-20,280,40);g.fillStyle='#5a4630';for(const sx of [-100,100])g.fillRect(sx,-4,6,6);g.restore();}});
 tile(13,g=>{for(let k=0;k<7;k++){g.save();g.translate(30+r()*196,40+r()*176);g.rotate((r()-.5)*.3);g.fillStyle=['#f4efe2','#ffd23f','#ff6f61','#7fc8f8','#e8e2d0'][k%5];g.fillRect(-36,-48,72,96);g.fillStyle='rgba(0,0,0,.55)';g.fillRect(-26,-36,52,8);g.fillRect(-26,-20,40,5);g.fillRect(-26,-10,46,5);g.restore();}});
 tile(14,g=>{for(let i=0;i<8;i++){const px=128+(r()-.5)*90,py=128+(r()-.5)*90,rad=30+r()*50;const gr=g.createRadialGradient(px,py,0,px,py,rad);gr.addColorStop(0,'rgba(18,16,14,.5)');gr.addColorStop(1,'rgba(18,16,14,0)');g.fillStyle=gr;g.fillRect(0,0,256,256);}});
 tile(15,g=>{g.strokeStyle='rgba(50,40,30,.6)';g.lineWidth=2;for(let k=0;k<5;k++){g.beginPath();let px=r()*256,py=r()*256;g.moveTo(px,py);for(let s=0;s<6;s++){px+=(r()-.5)*70;py+=(r()-.3)*50;g.lineTo(px,py);}g.stroke();}
  g.fillStyle='rgba(170,150,120,.7)';g.beginPath();g.ellipse(150,170,50,30,.3,0,7);g.fill();});
 // sign rows and the lamp swatch, plus a matching emissive mask
 const em=document.createElement('canvas');em.width=1024;em.height=2048;const e=em.getContext('2d');e.fillStyle='#000';e.fillRect(0,0,1024,2048);
 x.fillStyle='#fff3d0';x.fillRect(0,1024,1024,1024);
 signs.slice(0,GLOW_ROWS-1).forEach((sg,i)=>{const y=1024+i*128;x.fillStyle=sg.bg||'#2c3a33';x.fillRect(0,y,1024,128);x.strokeStyle=sg.edge||'#e9dcb6';x.lineWidth=8;x.strokeRect(8,y+8,1008,112);
  x.fillStyle=sg.fg||'#ffe9b0';x.font='900 '+(sg.text.length>12?62:76)+'px Arial Black, Impact, sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(sg.text,512,y+66,980);});
 e.drawImage(cv,0,1024,1024,1024,0,1024,1024,1024);
 const mk=c=>{const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t;};
 return {map:mk(cv),emissive:mk(em)};
}

/* ---------- layout ---------- */
// fronts: [{x,z,rot,w,d,height,base,kind}] Kenney placements (front normal = (-sin rot,-cos rot)).
// alleys: [{x,z,along:'x'|'z',width,len}]. roofSigns: [{text,x,y,z,w,yaw,bg,fg,edge}].
export function planDressing({fronts=[],alleys=[],roofSigns=[],seed=163}={}){
 const r=rngFor(seed),props=new Builder(),decals=new Builder(),glow=decals,colliders=[];const counts={ac:0,pipes:0,shutters:0,escapes:0,boards:0,tags:0,stains:0,bins:0,crates:0,puddles:0,lamps:0,signs:0};
 const foot=f=>{const c=Math.cos(f.rot),s=Math.sin(f.rot);return {c,s,N:[-s,0,-c],R:[-c,0,s]};};
 // side neighbours: skip a side wall if another block is flush against it
 const near=(x,z,self)=>fronts.some(o=>o!==self&&Math.abs(o.x-x)<o.wx/2+.8&&Math.abs(o.z-z)<o.wz/2+.8);
 for(const f of fronts){const {c,s}=foot(f);f.wx=Math.abs(f.w*c)+Math.abs(f.d*s);f.wz=Math.abs(f.w*s)+Math.abs(f.d*c);}
 for(const f of fronts){
  const {N,R}=foot(f),hw=f.w/2,hd=f.d/2,base=f.base||0,top=f.height,storey=f.storey||3.2,fx=f.x+N[0]*hd,fz=f.z+N[2]*hd,yaw=Math.atan2(N[0],N[2]);
  const onFront=(along,y,out=.05)=>[fx+R[0]*along+N[0]*out,y,fz+R[2]*along+N[2]*out];
  const decal=(tile,along,y,w,h,out=.06)=>{const [x,yy,z]=onFront(along,y,out);decals.quad(x,yy,z,R,[0,1,0],N,w/2,h/2,tileUV(tile));};
  // rain streaks under the roofline and rust under a storey band
  for(let k=0;k<1+Math.floor(r()*3);k++){decal(DECAL_TILES.streak,(r()-.5)*(f.w-2),top-2.1-r()*.8,1.6+r()*1.6,3,.07+k*.005);counts.stains++;}
  if(r()<.55){decal(DECAL_TILES.rust,(r()-.5)*(f.w-2),Math.max(base+1.6,top-storey*(1+Math.floor(r()*2))),1.6,1.8,.075);counts.stains++;}
  if(r()<.5&&!f.upper){decal(DECAL_TILES.damp,(r()-.5)*(f.w-2),1,2.6+r()*2,2,.08);counts.stains++;}
  // ground floor: shutters, tags, posters (only where the ground floor is Kenney's)
  if(!f.upper){
   if(r()<.42&&f.w>5&&!f.house){const sw=Math.min(3.4,f.w*.32),al=(r()<.5?-1:1)*(f.w/2-sw/2-.6);decal(DECAL_TILES.shutter,al,1.25,sw,2.5,.1);const [x,y,z]=onFront(al,2.65,.22);props.box(x,y,z,sw+.2,.32,.34,yaw,hex(0x5b605d));counts.shutters++;}
   if(r()<.62){decal(DECAL_TILES.tag0+Math.floor(r()*TAGS.length),(r()-.5)*(f.w-2.5),.9+r()*.6,2.4,1.2,.09);counts.tags++;}
   if(r()<.35){decal(DECAL_TILES.posters,(r()-.5)*(f.w-2),1.3,1.6,1.3,.085);}
  }
  // upper floors: AC units, boarded windows, a downpipe
  const storeys=Math.max(1,Math.round((top-base)/storey));
  for(let k=0;k<storeys;k++){const y=base+(k+.35)*storey+(f.upper?0:storey*0);if(y<2.4||y>top-.8)continue;
   if(r()<.45){const al=(r()-.5)*(f.w-2.2),[x,yy,z]=onFront(al,y,.32);props.box(x,yy,z,.95,.62,.55,yaw,hex(r()<.5?0xb9bcb6:0xa3a69e));const [x2,y2,z2]=onFront(al,y-.42,.42);props.box(x2,y2,z2,.7,.05,.32,yaw,hex(0x56605a));
    decal(DECAL_TILES.streak,al,y-1.4,.5,2.2,.07);counts.ac++;}
   if(r()<.14){decal(DECAL_TILES.boards,(r()-.5)*(f.w-2.4),y+.4,1.3,1.4,.11);counts.boards++;}
  }
  if(r()<.7){const al=(r()<.5?-1:1)*(hw-.25),[x,,z]=onFront(al,0,.12);props.box(x,top/2,z,.14,top,.14,yaw,hex(0x6d6a63));counts.pipes++;}
  // fire escape on a free side wall of taller blocks
  if(!f.house&&top-base>7&&r()<.55){for(const side of [1,-1]){const sx=f.x+R[0]*side*(hw+.6),sz=f.z+R[2]*side*(hw+.6);if(near(sx,sz,f))continue;
    const sideN=R.map(v=>v*side),syaw=Math.atan2(sideN[0],sideN[2]),fl=Math.max(2,Math.floor((top-base)/storey));
    for(let k=1;k<fl;k++){const y=base+k*storey-.15,x=f.x+sideN[0]*(hw+.55)-N[0]*hd*.2,z=f.z+sideN[2]*(hw+.55)-N[2]*hd*.2;
     props.box(x,y,z,2.6,.08,1.0,syaw,hex(0x2e3230));props.box(x+sideN[0]*.48,y+.5,z+sideN[2]*.48,2.6,.05,.05,syaw,hex(0x2e3230));
     for(const e of [-1.27,1.27]){const ex=x+Math.cos(syaw)*e,ez=z-Math.sin(syaw)*e;props.box(ex+sideN[0]*.48,y+.25,ez+sideN[2]*.48,.05,.55,.05,syaw,hex(0x2e3230));}
     props.box(x,y-storey/2,z,.08,storey,.08,syaw,hex(0x3a3e3b));}
    counts.escapes++;break;}}
 }
 // alleys: bins, crates, puddles, litter, oil, a dim lamp
 for(const a of alleys){
  const along=a.along==='x',len=a.len,yaw=along?0:Math.PI/2,ax=along?[1,0,0]:[0,0,1],ac=along?[0,0,1]:[1,0,0];
  const at=(u,v)=>[a.x+ax[0]*v+ac[0]*u,a.z+ax[2]*v+ac[2]*u]; // u: across alley, v: along alley depth
  const ground=(tile,u,v,w,d,y=.025)=>{const [x,z]=at(u,v);decals.quad(x,y,z,along?[0,0,1]:[-1,0,0],ax,[0,1,0],w/2,d/2,tileUV(tile));};
  ground(DECAL_TILES.puddle,(r()-.5)*a.width*.2,(r()-.5)*len*.5,Math.min(a.width*.8,1+r()*.8),1.4+r(),.022);counts.puddles++;
  ground(DECAL_TILES.litter,(r()-.5)*a.width*.2,(r()-.5)*len*.6,a.width*.75,2.4,.026);
  if(r()<.6)ground(DECAL_TILES.oil,0,(r()-.5)*len*.5,a.width*.7,2,.024);
  const wall=a.width/2-.45,side=r()<.5?-1:1;
  if(a.width>=2.8){for(let k=0;k<1+Math.floor(r()*2);k++){const [x,z]=at(side*wall,-len*.3+k*.9);const col=hex([0x2f6b3f,0x8c2f2a,0x2b4f7a,0x3c3f3e][Math.floor(r()*4)]);props.box(x,.55,z,.62,1.1,.7,yaw,col);props.box(x,1.13,z,.7,.07,.78,yaw,col.map(v=>v*.8));colliders.push({x,z,w:.9,d:.9,cityProp:'bin'});counts.bins++;}
   if(r()<.7){const [x,z]=at(-side*wall,len*.2);props.box(x,.3,z,.75,.6,.75,yaw+r()*.3,hex(0x9a7b52));if(r()<.6)props.box(x,.85,z,.6,.5,.6,yaw+r()*.5,hex(0xa88a5f));colliders.push({x,z,w:1,d:1,cityProp:'crate'});counts.crates++;}}
  // wall pipe and a dim caged lamp above head height
  {const [x,z]=at(-a.width/2+.12,0);props.box(x,2.6,z,.12,5.2,.12,yaw,hex(0x5d5a52));const [x2,z2]=at(-a.width/2+.12,len*.25);props.box(x2,.15,z2,.12,.3,len*.5,yaw,hex(0x5d5a52));counts.pipes++;}
  {const [x,z]=at(a.width/2-.25,(r()-.5)*len*.3);props.box(x,3.4,z,.18,.12,.4,yaw,hex(0x2b2d2c));glow.box(x,3.27,z,.26,.12,.26,yaw,[1,1,1],LAMP_UV);counts.lamps++;}
 }
 // rooftop shop signs with two legs
 roofSigns.slice(0,GLOW_ROWS-1).forEach((sg,i)=>{const c=Math.cos(sg.yaw),s=Math.sin(sg.yaw),R=[c,0,-s],N=[s,0,c],h=sg.w/16;
  glow.quad(sg.x,sg.y,sg.z,R,[0,1,0],N,sg.w/2,h,rowUV(i));props.box(sg.x-N[0]*.1,sg.y,sg.z-N[2]*.1,sg.w+.1,h*2+.1,.12,sg.yaw,hex(0x2a2d2b));
  for(const e of [-.36,.36]){const x=sg.x+R[0]*sg.w*e-N[0]*.2,z=sg.z+R[2]*sg.w*e-N[2]*.2;props.box(x,sg.y-h-.55,z,.14,1.3,.14,sg.yaw,hex(0x2f3331));}
  counts.signs++;});
 return {props,decals,colliders,counts};
}

export function createDodgyDressing({scene,fronts=[],alleys=[],roofSigns=[],seed=163}={}){
 const root=new THREE.Group();root.name='Dodgy dressing v163';if(scene)scene.add(root);
 const plan=planDressing({fronts,alleys,roofSigns,seed});
 const propMat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.85,metalness:.08});
 const atlas=drawAtlas(roofSigns);
 // decals, rooftop signs and alley lamp bulbs share one atlas and one draw call; the emissive mask lights only signs and bulbs
 const decalMat=new THREE.MeshStandardMaterial({map:atlas.map,emissive:0xffffff,emissiveMap:atlas.emissive,emissiveIntensity:.15,transparent:true,depthWrite:false,roughness:.9,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
 const meshes={};
 for(const [k,b,m] of [['props',plan.props,propMat],['decals',plan.decals,decalMat]]){const g=b.geometry();if(!g)continue;const mesh=new THREE.Mesh(g,m);mesh.name='Dodgy '+k;mesh.matrixAutoUpdate=false;mesh.castShadow=false;mesh.receiveShadow=true;if(k==='decals')mesh.renderOrder=2;root.add(mesh);meshes[k]=mesh;}
 let triangles=0;for(const m of Object.values(meshes))triangles+=m.geometry.index.count/3;
 function update({night=0}={}){const n=Math.max(0,Math.min(1,night));decalMat.emissiveIntensity=.15+n*1.6;}
 return {root,meshes,colliders:plan.colliders,counts:plan.counts,triangles,update,materials:{propMat,decalMat}};
}
