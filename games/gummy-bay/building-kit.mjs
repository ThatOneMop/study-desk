// v133 city kit. Compact Hyland-style filler buildings drawn from one painted
// atlas. Every wall, window, awning and roof is a quad in a merged batch, so a
// whole district costs a handful of draw calls. All art is painted here at
// boot: no downloaded textures, fonts or models.
import * as THREE from './vendor/three.module.min.js';

export const ATLAS_GRID=8;
const T=(x,y)=>Object.freeze([x,y]);
export const TILE=Object.freeze({
 BRICK:T(0,0),BRICK_DARK:T(1,0),STUCCO:T(2,0),WEATHERBOARD:T(3,0),CORRUGATED:T(4,0),CONCRETE:T(5,0),ROOF:T(6,0),ROOF_METAL:T(7,0),
 WINDOW:T(0,1),WINDOW_LIT:T(1,1),SHOP:T(2,1),SHOP_LIT:T(3,1),ROLLER:T(4,1),DOOR:T(5,1),AWNING:T(6,1),PLAIN:T(7,1),
 WINDOW_B:T(0,2),WINDOW_B_LIT:T(1,2),POSTERS:T(2,2),VENT:T(3,2),TILES:T(4,2),SIDING:T(5,2),DOOR_GLASS:T(6,2),BULBS:T(7,2),
 // Row 3 and 4 carry alpha and only draw in the cut-out batch.
 CHAINLINK:T(0,3),GRATE:T(1,3),RAILING:T(2,3),GRILLE:T(3,3),TAG0:T(4,3),TAG1:T(5,3),TAG2:T(6,3),TAG3:T(7,3),
 TAG4:T(0,4),TAG5:T(1,4),STAIN:T(2,4),WIRES:T(3,4)
});
export const TAGS=Object.freeze([TILE.TAG0,TILE.TAG1,TILE.TAG2,TILE.TAG3,TILE.TAG4,TILE.TAG5]);
export const LIT_TILES=Object.freeze(['WINDOW_LIT','SHOP_LIT','WINDOW_B_LIT','BULBS']);

// Deterministic hash so the town is identical for every player and test.
export function rng(seed){let s=(Math.imul(seed|0,2654435761)^0x9e3779b9)>>>0;return ()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};}

/* ---------- atlas painting ---------- */
const PX=128;
function noise(g,x,y,w,h,amount,r){for(let i=0;i<w*h/22;i++){const v=Math.floor(r()*amount);g.fillStyle=r()<.5?`rgba(0,0,0,${v/255})`:`rgba(255,255,255,${v/255})`;g.fillRect(x+Math.floor(r()*w),y+Math.floor(r()*h),1+Math.floor(r()*2),1+Math.floor(r()*2));}}
function paintTiles(g,e){
 const r=rng(77),at=t=>[t[0]*PX,t[1]*PX];
 const fill=(t,c)=>{const [x,y]=at(t);g.fillStyle=c;g.fillRect(x,y,PX,PX);return [x,y];};
 // Bricks: 12 courses of four, light mortar, per-brick jitter; tiles seamlessly.
 for(const [t,base] of [[TILE.BRICK,[150,74,56]],[TILE.BRICK_DARK,[104,70,58]]]){
  const [x,y]=fill(t,'#c9bba6');
  for(let row=0;row<12;row++)for(let col=-1;col<4;col++){const off=row%2?16:0,j=(r()-.5)*34,bx=x+col*32+off,by=y+row*PX/12;const w=30;
   g.fillStyle=`rgb(${base[0]+j|0},${base[1]+j*.6|0},${base[2]+j*.5|0})`;const x0=Math.max(x,bx+1),x1=Math.min(x+PX,bx+w+1);if(x1>x0)g.fillRect(x0,by+1,x1-x0,PX/12-2);}
  noise(g,x,y,PX,PX,40,r);
 }
 {const [x,y]=fill(TILE.STUCCO,'#e4e0d6');noise(g,x,y,PX,PX,46,r);g.strokeStyle='rgba(60,50,40,.25)';g.lineWidth=1;g.beginPath();g.moveTo(x+30,y+60);g.lineTo(x+44,y+72);g.lineTo(x+41,y+90);g.stroke();}
 {const [x,y]=fill(TILE.WEATHERBOARD,'#e8e4da');for(let i=0;i<8;i++){g.fillStyle='rgba(0,0,0,.22)';g.fillRect(x,y+i*16+13,PX,3);g.fillStyle='rgba(255,255,255,.35)';g.fillRect(x,y+i*16,PX,2);}noise(g,x,y,PX,PX,30,r);}
 {const [x,y]=fill(TILE.CORRUGATED,'#dad9d4');for(let i=0;i<PX;i++){const v=Math.sin(i/PX*Math.PI*2*8);g.fillStyle=`rgba(${v>0?255:0},${v>0?255:0},${v>0?255:0},${Math.abs(v)*.22})`;g.fillRect(x+i,y,1,PX);}g.fillStyle='rgba(120,70,40,.25)';for(let i=0;i<14;i++)g.fillRect(x+r()*PX,y+PX-r()*30,2,20+r()*20);}
 {const [x,y]=fill(TILE.CONCRETE,'#cfccc4');noise(g,x,y,PX,PX,40,r);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x,y+63,PX,2);g.fillRect(x+63,y,2,PX);}
 {const [x,y]=fill(TILE.ROOF,'#5d5f5c');noise(g,x,y,PX,PX,70,r);}
 {const [x,y]=fill(TILE.ROOF_METAL,'#b9bcb8');for(let i=0;i<8;i++){g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x+i*16,y,3,PX);}}
 // Windows: the map is the same glass lit or not; the emissive atlas lights only *_LIT.
 const windowTile=(t,blinds)=>{const [x,y]=fill(t,'#e9e5da');g.fillStyle='#3d4a4e';g.fillRect(x+12,y+10,104,108);const gr=g.createLinearGradient(x,y,x+PX,y+PX);gr.addColorStop(0,'#5d7680');gr.addColorStop(.5,'#2c3a40');gr.addColorStop(1,'#465c63');g.fillStyle=gr;g.fillRect(x+18,y+16,92,96);g.fillStyle='rgba(255,255,255,.16)';g.beginPath();g.moveTo(x+30,y+16);g.lineTo(x+60,y+16);g.lineTo(x+18,y+70);g.lineTo(x+18,y+40);g.fill();g.fillStyle='#e9e5da';g.fillRect(x+62,y+16,4,96);if(blinds){g.fillStyle='#cfc6ad';g.fillRect(x+18,y+16,92,40);g.fillStyle='rgba(0,0,0,.18)';for(let i=0;i<8;i++)g.fillRect(x+18,y+18+i*5,92,1);}g.fillStyle='#bdb6a5';g.fillRect(x+8,y+114,112,8);};
 windowTile(TILE.WINDOW,false);windowTile(TILE.WINDOW_LIT,false);windowTile(TILE.WINDOW_B,true);windowTile(TILE.WINDOW_B_LIT,true);
 const shopTile=t=>{const [x,y]=fill(t,'#2a2e2e');g.fillStyle='#1b2324';g.fillRect(x+6,y+8,116,92);for(let i=0;i<4;i++){g.fillStyle=['#7b5b3c','#5d6b47','#7a4a48','#4b5d73'][i];g.fillRect(x+12,y+30+i*16,104,6);}g.fillStyle='rgba(255,255,255,.12)';g.beginPath();g.moveTo(x+20,y+8);g.lineTo(x+50,y+8);g.lineTo(x+6,y+70);g.lineTo(x+6,y+40);g.fill();g.fillStyle='#3a3f3f';g.fillRect(x,y+100,PX,28);g.fillRect(x+62,y+8,4,92);};
 shopTile(TILE.SHOP);shopTile(TILE.SHOP_LIT);
 {const [x,y]=fill(TILE.ROLLER,'#a8aaa6');for(let i=0;i<16;i++){g.fillStyle='rgba(0,0,0,.28)';g.fillRect(x,y+i*8+6,PX,2);}noise(g,x,y,PX,PX,30,r);g.fillStyle='#6a6c68';g.fillRect(x,y+120,PX,8);}
 {const [x,y]=fill(TILE.DOOR,'#e9e5da');g.fillStyle='#6b4a37';g.fillRect(x+24,y+6,80,122);g.fillStyle='rgba(0,0,0,.22)';g.fillRect(x+34,y+20,24,40);g.fillRect(x+70,y+20,24,40);g.fillRect(x+34,y+72,24,44);g.fillRect(x+70,y+72,24,44);g.fillStyle='#d8c27a';g.fillRect(x+92,y+66,6,6);}
 {const [x,y]=fill(TILE.AWNING,'#ffffff');for(let i=0;i<4;i++){g.fillStyle='#c9c6be';g.fillRect(x+i*32+16,y,16,PX);}g.fillStyle='rgba(0,0,0,.15)';g.fillRect(x,y+PX-10,PX,10);}
 {const [x,y]=fill(TILE.PLAIN,'#eeeeea');noise(g,x,y,PX,PX,22,r);}
 {const [x,y]=fill(TILE.POSTERS,'#e2ded4');const cols=['#e0b340','#d7553f','#4e8fb5','#f0e8d0','#7aa35a'];for(let i=0;i<5;i++){const px=x+6+i*24,py=y+30+(i%2)*20;g.fillStyle=cols[i];g.fillRect(px,py,20,30);g.fillStyle='rgba(0,0,0,.5)';g.fillRect(px+3,py+5,14,3);g.fillRect(px+3,py+12,10,2);g.fillRect(px+3,py+17,12,2);}noise(g,x,y,PX,PX,30,r);}
 {const [x,y]=fill(TILE.VENT,'#d8d8d2');g.fillStyle='#5b5f5e';g.beginPath();g.arc(x+64,y+64,48,0,7);g.fill();g.strokeStyle='#bfc2bd';g.lineWidth=3;for(let i=0;i<8;i++){g.beginPath();g.arc(x+64,y+64,8+i*5,0,7);g.stroke();}}
 {const [x,y]=fill(TILE.TILES,'#dfe5e2');g.fillStyle='rgba(0,0,0,.18)';for(let i=0;i<8;i++){g.fillRect(x+i*16,y,1,PX);g.fillRect(x,y+i*16,PX,1);}}
 {const [x,y]=fill(TILE.SIDING,'#e7e6e0');for(let i=0;i<10;i++){g.fillStyle='rgba(0,0,0,.18)';g.fillRect(x,y+i*12.8+10,PX,2.8);}}
 {const [x,y]=fill(TILE.DOOR_GLASS,'#b9bdb9');g.fillStyle='#22302f';g.fillRect(x+20,y+8,88,112);g.fillStyle='rgba(255,255,255,.15)';g.fillRect(x+26,y+14,30,100);g.fillStyle='#c9cbc6';g.fillRect(x+20,y+60,88,4);}
 {const [x,y]=fill(TILE.BULBS,'#3a2b20');for(let i=0;i<4;i++)for(let j=0;j<4;j++){g.fillStyle='#f6dd9a';g.beginPath();g.arc(x+16+i*32,y+16+j*32,7,0,7);g.fill();}}
 // Cut-outs: transparent background.
 const clear=t=>{const [x,y]=at(t);g.clearRect(x,y,PX,PX);return [x,y];};
 {const [x,y]=clear(TILE.CHAINLINK);g.strokeStyle='rgba(170,176,172,.95)';g.lineWidth=2;for(let i=-PX;i<PX*2;i+=16){g.beginPath();g.moveTo(x+i,y);g.lineTo(x+i+PX,y+PX);g.stroke();g.beginPath();g.moveTo(x+i+PX,y);g.lineTo(x+i,y+PX);g.stroke();}g.clearRect(x-PX,y,PX,PX);g.clearRect(x+PX,y,PX,PX);}
 {const [x,y]=clear(TILE.GRATE);g.fillStyle='#3f4442';for(let i=0;i<8;i++){g.fillRect(x+i*16,y,4,PX);g.fillRect(x,y+i*16,PX,4);}}
 {const [x,y]=clear(TILE.RAILING);g.fillStyle='#3d4240';g.fillRect(x,y,PX,8);g.fillRect(x,y+64,PX,5);for(let i=0;i<8;i++)g.fillRect(x+i*16+6,y,4,PX);}
 {const [x,y]=clear(TILE.GRILLE);g.fillStyle='#2d3130';for(let i=0;i<7;i++)g.fillRect(x+6+i*19,y,5,PX);g.fillRect(x,y+20,PX,5);g.fillRect(x,y+104,PX,5);}
 const words=['YUMZ','SOUR','B4Y','GOOEY','RIP GRAMPS','NO 2 SUGAR TAX'];
 const inks=[['#e85d75','#2b2140'],['#5ec2b7','#1e2a3a'],['#f2c14e','#3b2a1e'],['#9b6fd6','#1f1a2e'],['#7bd36a','#18301c'],['#f08a3c','#2a1a12']];
 TAGS.forEach((t,i)=>{const [x,y]=clear(t);const [fg,line]=inks[i];g.save();g.translate(x+64,y+64);g.rotate((r()-.5)*.3);g.font=`900 ${words[i].length>6?22:38}px "Arial Black",Impact,sans-serif`;g.textAlign='center';g.textBaseline='middle';g.lineJoin='round';g.lineWidth=9;g.strokeStyle=line;g.strokeText(words[i],0,0);g.fillStyle=fg;g.fillText(words[i],0,0);g.lineWidth=2;g.strokeStyle='rgba(255,255,255,.6)';g.strokeText(words[i],-1,-2);g.restore();g.fillStyle=fg;for(let k=0;k<5;k++)g.fillRect(x+30+r()*70,y+84+r()*6,2,8+r()*20);});
 {const [x,y]=clear(TILE.STAIN);const gr=g.createLinearGradient(x,y,x,y+PX);gr.addColorStop(0,'rgba(40,34,26,.55)');gr.addColorStop(1,'rgba(40,34,26,0)');g.fillStyle=gr;for(let i=0;i<9;i++){const w=6+r()*16;g.fillRect(x+r()*(PX-w),y,w,40+r()*88);}}
 {const [x,y]=clear(TILE.WIRES);g.strokeStyle='#202322';g.lineWidth=3;for(let i=0;i<3;i++){g.beginPath();g.moveTo(x,y+30+i*20);g.quadraticCurveTo(x+64,y+60+i*20,x+PX,y+30+i*20);g.stroke();}}
 // Emissive atlas: warm rooms, shop interiors and marquee bulbs.
 if(e){e.fillStyle='#000';e.fillRect(0,0,PX*ATLAS_GRID,PX*ATLAS_GRID);
  for(const [t,blinds] of [[TILE.WINDOW_LIT,false],[TILE.WINDOW_B_LIT,true]]){const [x,y]=at(t);const gr=e.createLinearGradient(x,y+16,x,y+112);gr.addColorStop(0,'#ffcf8a');gr.addColorStop(1,'#d9863c');e.fillStyle=gr;e.fillRect(x+18,y+16,92,96);e.fillStyle='#000';e.fillRect(x+62,y+16,4,96);if(blinds){e.fillStyle='#a8743c';e.fillRect(x+18,y+16,92,40);}}
  {const [x,y]=at(TILE.SHOP_LIT);e.fillStyle='#f2c98a';e.fillRect(x+6,y+8,116,92);e.fillStyle='#000';e.fillRect(x+62,y+8,4,92);for(let i=0;i<4;i++){e.fillStyle='#4a3a28';e.fillRect(x+12,y+30+i*16,104,6);}}
  {const [x,y]=at(TILE.BULBS);for(let i=0;i<4;i++)for(let j=0;j<4;j++){e.fillStyle='#ffd77a';e.beginPath();e.arc(x+16+i*32,y+16+j*32,9,0,7);e.fill();}}
 }
}
let atlasCache=null;
export function cityAtlas(){
 if(atlasCache)return atlasCache;
 const doc=globalThis.document;let map=null,emissive=null;
 try{
  if(doc?.createElement){
   const a=doc.createElement('canvas'),b=doc.createElement('canvas');a.width=a.height=b.width=b.height=PX*ATLAS_GRID;
   const g=a.getContext('2d'),e=b.getContext('2d');if(g&&e){paintTiles(g,e);map=new THREE.CanvasTexture(a);emissive=new THREE.CanvasTexture(b);
    for(const t of [map,emissive]){t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;t.generateMipmaps=true;t.minFilter=THREE.LinearMipmapLinearFilter;}}
  }
 }catch{map=null;emissive=null;}
 atlasCache={map,emissive};return atlasCache;
}

// Tiled atlas sampling: uv carries the repeat count, `atile` the tile origin.
// textureGrad keeps mip selection smooth across tile wraps (no seams).
function tiledShader(shader){
 shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nattribute vec2 atile;\nvarying vec2 vAtile;\nvarying vec2 vRep;').replace('#include <uv_vertex>','#include <uv_vertex>\nvAtile=atile;vRep=uv;');
 const sample='vec2 cellUv=(vAtile+.03+fract(vRep)*.94)/'+ATLAS_GRID+'.;vec2 gx=dFdx(vRep)*(.94/'+ATLAS_GRID+'.),gy=dFdy(vRep)*(.94/'+ATLAS_GRID+'.);';
 shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec2 vAtile;\nvarying vec2 vRep;')
  .replace('#include <map_fragment>','#ifdef USE_MAP\n'+sample+'vec4 sampledDiffuseColor=textureGrad(map,cellUv,gx,gy);diffuseColor*=sampledDiffuseColor;\n#endif')
  .replace('#include <emissivemap_fragment>','#ifdef USE_EMISSIVEMAP\n{'+sample+'totalEmissiveRadiance*=textureGrad(emissiveMap,cellUv,gx,gy).rgb;}\n#endif');
}
export function createCityMaterials(){
 const {map,emissive}=cityAtlas();
 const solid=new THREE.MeshStandardMaterial({color:0xffffff,vertexColors:true,roughness:.92,metalness:0,map,emissiveMap:emissive,emissive:emissive?0xffffff:0x000000,emissiveIntensity:0});
 const cutout=new THREE.MeshStandardMaterial({color:0xffffff,vertexColors:true,roughness:.95,metalness:0,map,transparent:false,alphaTest:.45,side:THREE.DoubleSide});
 for(const m of [solid,cutout]){m.onBeforeCompile=tiledShader;m.customProgramCacheKey=()=>'gb-city-tiled';}
 solid.name='City kit atlas';cutout.name='City kit cut-outs';
 return {solid,cutout};
}

/* ---------- batch builder ---------- */
// Quads are written in local building space (front faces +z) and transformed
// into world space by the current placement.
export class CityBatch{
 constructor(){this.pos=[];this.nor=[];this.uv=[];this.tile=[];this.col=[];this.idx=[];this.place(0,0,0,0);}
 place(x,y,z,rot){this.ox=x;this.oy=y;this.oz=z;this.c=Math.cos(rot);this.s=Math.sin(rot);return this;}
 get quads(){return this.idx.length/6;}
 _p(x,y,z){return [this.ox+x*this.c+z*this.s,this.oy+y,this.oz-x*this.s+z*this.c];}
 _n(x,y,z){return [x*this.c+z*this.s,y,-x*this.s+z*this.c];}
 // a,b,c,d: local corners (counter-clockwise seen from the front), n: normal, rep [u,v].
 quad(a,b,c,d,n,tile,ru,rv,color,shade=null){
  const base=this.pos.length/3,nn=this._n(...n),cc=new THREE.Color(color);
  const uvs=[[0,0],[ru,0],[ru,rv],[0,rv]];
  [a,b,c,d].forEach((p,i)=>{this.pos.push(...this._p(...p));this.nor.push(...nn);this.uv.push(...uvs[i]);this.tile.push(tile[0],ATLAS_GRID-1-tile[1]);
   const k=shade?shade[i]:1;this.col.push(cc.r*k,cc.g*k,cc.b*k);});
  this.idx.push(base,base+1,base+2,base,base+2,base+3);
 }
 // Wall in the local x/y plane at depth z facing +z (dir=1) or -z (dir=-1).
 wallZ(x0,x1,y0,y1,z,dir,tile,size,color,grime=true){
  const ru=Math.abs(x1-x0)/size[0],rv=(y1-y0)/size[1],sh=grime?[.72,.72,1,1]:null;
  if(dir>0)this.quad([x0,y0,z],[x1,y0,z],[x1,y1,z],[x0,y1,z],[0,0,1],tile,ru,rv,color,sh);
  else this.quad([x1,y0,z],[x0,y0,z],[x0,y1,z],[x1,y1,z],[0,0,-1],tile,ru,rv,color,sh);
 }
 wallX(z0,z1,y0,y1,x,dir,tile,size,color,grime=true){
  const ru=Math.abs(z1-z0)/size[0],rv=(y1-y0)/size[1],sh=grime?[.72,.72,1,1]:null;
  if(dir>0)this.quad([x,y0,z1],[x,y0,z0],[x,y1,z0],[x,y1,z1],[1,0,0],tile,ru,rv,color,sh);
  else this.quad([x,y0,z0],[x,y0,z1],[x,y1,z1],[x,y1,z0],[-1,0,0],tile,ru,rv,color,sh);
 }
 roof(x0,x1,z0,z1,y,tile,size,color){this.quad([x0,y,z1],[x1,y,z1],[x1,y,z0],[x0,y,z0],[0,1,0],tile,(x1-x0)/size,(z1-z0)/size,color);}
 // Axis box with one tile on the sides and another on top.
 box(cx,y0,cz,w,h,d,side,top,color,size=[1,1],{bottom=false,grime=false,skip=''}={}){
  const x0=cx-w/2,x1=cx+w/2,z0=cz-d/2,z1=cz+d/2,y1=y0+h;
  if(!skip.includes('f'))this.wallZ(x0,x1,y0,y1,z1,1,side,size,color,grime);
  if(!skip.includes('b'))this.wallZ(x0,x1,y0,y1,z0,-1,side,size,color,grime);
  if(!skip.includes('r'))this.wallX(z0,z1,y0,y1,x1,1,side,size,color,grime);
  if(!skip.includes('l'))this.wallX(z0,z1,y0,y1,x0,-1,side,size,color,grime);
  if(top)this.roof(x0,x1,z0,z1,y1,top,size[0],color);
  if(bottom)this.quad([x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1],[0,-1,0],side,w/size[0],d/size[0],color);
 }
 // Octagonal prism (tanks, poles).
 prism(cx,y0,cz,r,h,tile,color,top=true,n=8){
  for(let i=0;i<n;i++){const a0=i/n*Math.PI*2,a1=(i+1)/n*Math.PI*2,am=(a0+a1)/2;
   const p0=[cx+Math.sin(a0)*r,y0,cz+Math.cos(a0)*r],p1=[cx+Math.sin(a1)*r,y0,cz+Math.cos(a1)*r];
   this.quad(p0,p1,[p1[0],y0+h,p1[2]],[p0[0],y0+h,p0[2]],[Math.sin(am),0,Math.cos(am)],tile,.25,h,color,[.8,.8,1,1]);
   if(top)this.quad([cx,y0+h,cz],[cx,y0+h,cz],[p1[0],y0+h,p1[2]],[p0[0],y0+h,p0[2]],[0,1,0],tile,.1,.1,color);}
 }
 // Gable roof running along x, ridge at height `rise`.
 gable(x0,x1,z0,z1,y,rise,tile,color,overhang=.35){
  const zm=(z0+z1)/2;x0-=overhang;x1+=overhang;z0-=overhang;z1+=overhang;const run=(z1-z0)/2,len=Math.hypot(run,rise),ny=run/len,nz=rise/len;
  this.quad([x0,y,z1],[x1,y,z1],[x1,y+rise,zm],[x0,y+rise,zm],[0,ny,nz],tile,(x1-x0)/1,len/1,color);
  this.quad([x1,y,z0],[x0,y,z0],[x0,y+rise,zm],[x1,y+rise,zm],[0,ny,-nz],tile,(x1-x0)/1,len/1,color);
 }
 gableEnd(x,z0,z1,y,rise,dir,tile,color){const zm=(z0+z1)/2;
  if(dir>0)this.quad([x,y,z1],[x,y,z0],[x,y+rise,zm],[x,y+rise,zm],[1,0,0],tile,(z1-z0)/2,rise/2,color);
  else this.quad([x,y,z0],[x,y,z1],[x,y+rise,zm],[x,y+rise,zm],[-1,0,0],tile,(z1-z0)/2,rise/2,color);}
 toGeometry(){
  if(!this.idx.length)return null;
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(this.pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(this.nor,3));
  g.setAttribute('uv',new THREE.Float32BufferAttribute(this.uv,2));g.setAttribute('atile',new THREE.Float32BufferAttribute(this.tile,2));g.setAttribute('color',new THREE.Float32BufferAttribute(this.col,3));
  g.setIndex(this.pos.length/3>65535?new THREE.Uint32BufferAttribute(this.idx,1):new THREE.Uint16BufferAttribute(this.idx,1));g.computeBoundingSphere();g.computeBoundingBox();return g;
 }
}

/* ---------- archetypes ---------- */
export const PALETTES=Object.freeze({
 brick:[0xffffff,0xf2e2d6,0xe8d2c0,0xd9c8b8],
 stucco:[0xf0d9a8,0xd9b9a0,0xb9cbb5,0xe4c3b6,0xc9d3d8,0xe8e0c8,0xd6a98a,0xa9bfc4],
 board:[0xd4dccf,0xe8d7b0,0xb8c9cf,0xdcc0b4,0xc8c09a],
 metal:[0x9fb0ae,0xb9a78f,0x8f9c8f,0xb4b7b2,0x9b8f84],
 awning:[0xc8423b,0x2f7a5e,0xe0a93b,0x3d64a8,0x8a3c6c,0xd9682e],
 trim:[0x4f5a55,0x6b5546,0x3e4a52,0xe7e1d2,0x7c3f35]
});
export const ARCHETYPES=Object.freeze({
 terrace:{w:[7,11],d:[10,14],floors:[2,3]},
 shop:{w:[7,11],d:[9,13],floors:[1,2]},
 house:{w:[7,10],d:[8,11],floors:[1,2]},
 warehouse:{w:[11,16],d:[12,16],floors:[1,1]},
 flats:{w:[10,14],d:[11,14],floors:[3,5]},
 container:{w:[6.2,6.2],d:[5,8],floors:[1,1]},
 diner:{w:[9,13],d:[10,14],floors:[1,1]},
 arcade:{w:[16,20],d:[13,16],floors:[2,2]},
 motel:{w:[20,26],d:[13,16],floors:[2,2]},
 carwash:{w:[13,16],d:[10,13],floors:[1,1]},
 pawn:{w:[7,10],d:[10,13],floors:[2,2]},
 laundromat:{w:[9,12],d:[10,13],floors:[1,2]}
});
const pick=(r,list)=>list[Math.floor(r()*list.length)%list.length];
export const FLOOR=3.2;

// Writes one building into the batches. Returns sign slots and light anchors.
// lot: {x,z,w,d,rot,type,floors,seed}. Local front is +z, origin at footprint centre.
export function buildLot(lot,{solid,detail,cutout},opts={}){
 const r=rng(lot.seed),w=lot.w,d=lot.d,hw=w/2,hd=d/2,type=lot.type;
 solid.place(lot.x,lot.y||0,lot.z,lot.rot);detail.place(lot.x,lot.y||0,lot.z,lot.rot);cutout.place(lot.x,lot.y||0,lot.z,lot.rot);
 const floors=lot.floors,H=floors*FLOOR+(type==='diner'||type==='carwash'?.6:0),signs=[];
 const lit=()=>r()<.42;
 let wallTile,wallSize,wallColor;
 const material=lot.material||({terrace:pick(r,['brick','brick','brick_dark','stucco']),shop:pick(r,['stucco','stucco','brick','siding']),house:pick(r,['board','board','siding']),warehouse:'metal',flats:pick(r,['brick','concrete','brick_dark']),container:'container',diner:pick(r,['stucco','tiles']),arcade:'stucco',motel:pick(r,['stucco','brick']),carwash:'concrete',pawn:pick(r,['brick','brick_dark']),laundromat:pick(r,['stucco','siding'])}[type]);
 switch(material){
  case 'brick':wallTile=TILE.BRICK;wallSize=[1.1,1.1];wallColor=pick(r,PALETTES.brick);break;
  case 'brick_dark':wallTile=TILE.BRICK_DARK;wallSize=[1.1,1.1];wallColor=pick(r,PALETTES.brick);break;
  case 'board':wallTile=TILE.WEATHERBOARD;wallSize=[2,1.6];wallColor=pick(r,PALETTES.board);break;
  case 'siding':wallTile=TILE.SIDING;wallSize=[2,1.3];wallColor=pick(r,PALETTES.stucco);break;
  case 'metal':case 'container':wallTile=TILE.CORRUGATED;wallSize=[1.2,2.4];wallColor=pick(r,material==='container'?[0xb8573f,0x3f7a8c,0xd2a33a,0x5d8a4a,0x8c4a72]:PALETTES.metal);break;
  case 'concrete':wallTile=TILE.CONCRETE;wallSize=[2.4,2.4];wallColor=pick(r,[0xe6e2d8,0xd6d2c4,0xc9cfcf]);break;
  case 'tiles':wallTile=TILE.TILES;wallSize=[1.2,1.2];wallColor=pick(r,[0xf1efe6,0xd6ecea,0xf3e3d0]);break;
  default:wallTile=TILE.STUCCO;wallSize=[2.2,2.2];wallColor=lot.color??pick(r,PALETTES.stucco);
 }
 if(lot.color!=null)wallColor=lot.color;
 const trim=pick(r,PALETTES.trim),awningColor=lot.awning??pick(r,PALETTES.awning);
 // Foundation plinth covers slight ground undulation.
 solid.box(0,-.4,0,w+.2,.55,d+.2,TILE.CONCRETE,null,0x9c988c,[2,2],{skip:''});

 const body=(x0,x1,z0,z1,y0,y1,tile=wallTile,size=wallSize,color=wallColor)=>{solid.wallZ(x0,x1,y0,y1,z1,1,tile,size,color);solid.wallZ(x0,x1,y0,y1,z0,-1,tile,size,color);solid.wallX(z0,z1,y0,y1,x1,1,tile,size,color);solid.wallX(z0,z1,y0,y1,x0,-1,tile,size,color);};
 const windowsZ=(x0,x1,y,z,dir,tileA=TILE.WINDOW,tileB=TILE.WINDOW_LIT,ww=1.15,wh=1.45,step=2.6)=>{const n=Math.max(1,Math.floor((x1-x0)/step));const sp=(x1-x0)/n;for(let i=0;i<n;i++){const cx=x0+sp*(i+.5),t=lit()?tileB:tileA,b=r()<.35;const T0=b?(t===tileB?TILE.WINDOW_B_LIT:TILE.WINDOW_B):t;solid.wallZ(cx-ww/2,cx+ww/2,y,y+wh,z+dir*.04,dir,T0,[ww,wh],0xffffff,false);}};
 const windowsX=(z0,z1,y,x,dir,ww=1.1,wh=1.4,step=2.8)=>{const n=Math.max(1,Math.floor((z1-z0)/step));const sp=(z1-z0)/n;for(let i=0;i<n;i++){const cz=z0+sp*(i+.5),t=lit()?TILE.WINDOW_LIT:TILE.WINDOW;solid.wallX(cz-ww/2,cz+ww/2,y,y+wh,x+dir*.04,dir,t,[ww,wh],0xffffff,false);}};
 const parapet=(x0,x1,z0,z1,y,h=.55,color=trim)=>{solid.box((x0+x1)/2,y,z1-.12,x1-x0,h,.25,TILE.PLAIN,TILE.PLAIN,color);solid.box((x0+x1)/2,y,z0+.12,x1-x0,h,.25,TILE.PLAIN,TILE.PLAIN,color);solid.box(x0+.12,y,(z0+z1)/2,.25,h,z1-z0-.5,TILE.PLAIN,TILE.PLAIN,color,[1,1],{skip:'fb'});solid.box(x1-.12,y,(z0+z1)/2,.25,h,z1-z0-.5,TILE.PLAIN,TILE.PLAIN,color,[1,1],{skip:'fb'});};
 const roofFlat=(x0,x1,z0,z1,y)=>solid.roof(x0,x1,z0,z1,y,TILE.ROOF,3,0xffffff);
 const rooftop=(x0,x1,z0,z1,y)=>{ // AC units, vents, water tanks, antennae
  const n=1+Math.floor(r()*3);for(let i=0;i<n;i++){const ax=x0+1.2+r()*(x1-x0-2.4),az=z0+1.2+r()*(z1-z0-2.4);detail.box(ax,y,az,1.3,.9,1,TILE.PLAIN,TILE.PLAIN,pick(r,[0xc9ccc6,0xb4b8b2,0xd8d4c8]));detail.wallZ(ax-.45,ax+.45,y+.05,y+.85,az+.51,1,TILE.VENT,[.9,.8],0xffffff,false);}
  if(r()<.35){const tx=x0+1.8+r()*(x1-x0-3.6),tz=z0+1.8+r()*(z1-z0-3.6);for(const [lx,lz] of [[-.6,-.6],[.6,-.6],[-.6,.6],[.6,.6]])detail.box(tx+lx,y,tz+lz,.12,1.4,.12,TILE.PLAIN,null,0x5a4a3c);detail.prism(tx,y+1.4,tz,1,1.6,TILE.WEATHERBOARD,0x8f6f52);detail.prism(tx,y+3,tz,1.05,.12,TILE.PLAIN,0x4d4640);}
  if(r()<.4){const vx=x0+1+r()*(x1-x0-2);detail.box(vx,y,z0+1,.35,1.1,.35,TILE.PLAIN,TILE.PLAIN,0x6b6e6a);}
  if(r()<.25){const ax=x0+.8+r()*(x1-x0-1.6);detail.box(ax,y,z0+.8,.06,2.6,.06,TILE.PLAIN,null,0x3a3d3c);detail.box(ax,y+2.2,z0+.8,1.2,.05,.05,TILE.PLAIN,null,0x3a3d3c);}
 };
 const downpipe=(x,z)=>detail.box(x,0,z,.14,H,.14,TILE.PLAIN,null,0x6e706a);
 const stains=(x0,x1,z,dir,y)=>{if(r()<.6)cutout.wallZ(x0,x1,y-1.6,y,z+dir*.03,dir,TILE.STAIN,[Math.max(1.5,x1-x0),1.6],0xffffff,false);};
 const sideTags=()=>{ // graffiti and posters on alley-facing side walls, low down
  for(const dir of [-1,1]){if(r()<.42){const z0=-hd+1+r()*(d-4.5),len=2+r()*1.6;cutout.wallX(z0,z0+len,.5,.5+len*.55,dir*(hw+.04),dir,pick(r,TAGS),[len,len*.55],0xffffff,false);}
   if(r()<.18){const z0=-hd+1+r()*(d-3);solid.wallX(z0,z0+2,.7,1.9,dir*(hw+.03),dir,TILE.POSTERS,[2,1.2],0xffffff,false);}}
 };
 const awning=(x0,x1,y,depth=1.6,color=awningColor)=>{
  const z=hd;solid.quad([x0,y,z+depth],[x1,y,z+depth],[x1,y+.9,z],[x0,y+.9,z],[0,.87,.5],TILE.AWNING,(x1-x0)/1.2,1,color);
  solid.quad([x1,y,z+depth],[x0,y,z+depth],[x0,y+.9,z],[x1,y+.9,z],[0,-.87,-.5],TILE.PLAIN,(x1-x0),1,color,[.55,.55,.55,.55]);
  solid.wallZ(x0,x1,y-.32,y,z+depth,1,TILE.AWNING,[1.2,.32],color,false);
 };
 const signSlot=(x,y,z,width,height,face='front',kind='board')=>signs.push({x,y,z,w:width,h:height,face,kind});
 const shopfront=(x0,x1,doorAt=null,tileSet=[TILE.SHOP,TILE.SHOP_LIT])=>{
  const z=hd+.05,t=r()<.7?tileSet[1]:tileSet[0];const dx=doorAt??(r()<.5?x0+1.1:x1-1.1);
  // two big panes either side of a glazed door
  if(dx-.6-x0>.8)solid.wallZ(x0+.15,dx-.6,.15,2.65,z,1,t,[Math.min(2.6,dx-.75-x0),2.5],0xffffff,false);
  if(x1-dx-.6>.8)solid.wallZ(dx+.6,x1-.15,.15,2.65,z,1,t,[Math.min(2.6,x1-dx-.75),2.5],0xffffff,false);
  solid.wallZ(dx-.55,dx+.55,0,2.3,z+.01,1,TILE.DOOR_GLASS,[1.1,2.3],0xffffff,false);
 };

 if(type==='house'){
  const h=floors*2.9;body(-hw,hw,-hd,hd,0,h);
  solid.gable(-hw,hw,-hd,hd,h,2+r()*.8,TILE.ROOF_METAL,pick(r,[0x7a3d33,0x4e6266,0x8b8b80,0x5f5040]));
  solid.gableEnd(hw,-hd,hd,h,2.2,1,wallTile,wallColor);solid.gableEnd(-hw,-hd,hd,h,2.2,-1,wallTile,wallColor);
  for(let f=0;f<floors;f++)windowsZ(-hw+.6,hw-.6,.95+f*2.9,hd,1);for(let f=0;f<floors;f++){windowsZ(-hw+.8,hw-.8,1+f*2.9,-hd,-1);windowsX(-hd+.8,hd-.8,1+f*2.9,hw,1);windowsX(-hd+.8,hd-.8,1+f*2.9,-hw,-1);}
  solid.wallZ(-.55,.55,0,2.2,hd+.05,1,TILE.DOOR,[1.1,2.2],0xffffff,false);
  detail.box(0,0,hd+.9,2.4,.3,1.6,TILE.CONCRETE,TILE.WEATHERBOARD,0x9a8b78);
  if(r()<.5){for(const x of [-hw+.5,hw-.5])detail.box(x,0,hd+1.6,.09,1,.09,TILE.PLAIN,null,0xe6e0d0);detail.wallZ(-hw+.5,hw-.5,0,1,hd+1.6,1,TILE.RAILING,[1,1],0xe6e0d0,false);}
  sideTags();
  return {signs,height:h+2.2};
 }
 if(type==='container'){
  const h=2.6,n=floors;body(-hw,hw,-hd,hd,0,h);solid.roof(-hw,hw,-hd,hd,h,TILE.ROOF_METAL,1.2,wallColor);
  solid.wallZ(-hw+.6,hw-.6,.2,2.4,hd+.05,1,r()<.5?TILE.ROLLER:TILE.SHOP_LIT,[hw*2-1.2,2.2],0xffffff,false);
  signSlot(0,h+.55,hd+.15,w*.9,.9,'front',r()<.5?'neon':'board');sideTags();
  return {signs,height:h};
 }
 if(type==='warehouse'){
  const h=5.2+r()*1.5;body(-hw,hw,-hd,hd,0,h);solid.gable(-hw,hw,-hd,hd,h,1.2,TILE.ROOF_METAL,pick(r,[0x8e9690,0x7a6a5a,0x6c7f86]),.25);
  solid.gableEnd(hw,-hd,hd,h,1.2,1,wallTile,wallColor);solid.gableEnd(-hw,-hd,hd,h,1.2,-1,wallTile,wallColor);
  const doors=w>13?2:1;for(let i=0;i<doors;i++){const cx=doors===1?-hw+3.4:(i?hw-3.2:-hw+3.2);solid.wallZ(cx-2,cx+2,0,4,hd+.05,1,TILE.ROLLER,[4,4],0xffffff,false);}
  solid.wallZ(hw-1.6,hw-.6,0,2.2,hd+.06,1,TILE.DOOR,[1,2.2],0xffffff,false);windowsZ(-hw+1,hw-1,h-1.5,hd,1,TILE.WINDOW,TILE.WINDOW_LIT,1.6,.7,3.2);
  signSlot(0,h-.2,hd+.12,Math.min(w*.7,8),1,'front','board');stains(-hw,hw,hd,1,h);sideTags();
  return {signs,height:h+1.2};
 }
 if(type==='carwash'){
  const h=4.4;// office block on one side, open canopy bays on the other
  const ox=-hw+3;body(-hw,-hw+6,-hd,hd,0,h);roofFlat(-hw,-hw+6,-hd,hd,h);parapet(-hw,-hw+6,-hd,hd,h,.5);
  shopfront(-hw+.4,-hw+5.6,-hw+4.6);
  const cx0=-hw+6,cx1=hw;solid.box((cx0+cx1)/2,h-.5,0,cx1-cx0,.7,d,TILE.PLAIN,TILE.ROOF_METAL,0xe8e6de,[1,1]);
  for(const x of [cx0+.4,(cx0+cx1)/2,cx1-.4])for(const z of [-hd+.4,hd-.4])solid.box(x,0,z,.4,h-.5,.4,TILE.PLAIN,null,0x2f6f9a);
  for(let i=0;i<2;i++){const bx=cx0+(cx1-cx0)*(i+.5)/2;detail.box(bx,0,0,.25,.1,d-1.2,TILE.PLAIN,TILE.PLAIN,0xd9c54a);detail.prism(bx-1.2,0,-1.5,.35,2.3,TILE.PLAIN,0x3c79c9);detail.prism(bx+1.2,0,1.5,.35,2.3,TILE.PLAIN,0xc93c5b);}
  solid.wallZ(cx0,cx1,h-.85,h-.15,hd+.02,1,TILE.AWNING,[1.2,.7],awningColor,false);
  signSlot((cx0+cx1)/2,h+.9,hd-.6,Math.min(cx1-cx0,10),1.5,'roof','neon');
  return {signs,height:h+1.5};
 }
 if(type==='motel'){
  // Two-storey row with an open walkway, doors and windows per room, and a pole sign.
  const h=FLOOR*2,body0=hd-6.2;body(-hw,hw,-hd,body0,0,h);roofFlat(-hw,hw,-hd,body0,h);parapet(-hw,hw,-hd,body0,h,.45);
  const rooms=Math.floor(w/3.6);for(let f=0;f<2;f++)for(let i=0;i<rooms;i++){const cx=-hw+(i+.5)*w/rooms;solid.wallZ(cx-1.2,cx-.2,f*FLOOR,f*FLOOR+2.2,body0+.04,1,TILE.DOOR,[1,2.2],0xffffff,false);solid.wallZ(cx+.1,cx+1.3,f*FLOOR+1,f*FLOOR+2.2,body0+.04,1,lit()?TILE.WINDOW_B_LIT:TILE.WINDOW_B,[1.2,1.2],0xffffff,false);}
  solid.box(0,FLOOR-.25,body0+1.1,w,.25,2.2,TILE.CONCRETE,TILE.CONCRETE,0xbdb8aa,[2,2],{skip:'b'});
  for(let i=0;i<=rooms;i++){const x=-hw+.2+i*(w-.4)/rooms;detail.box(x,0,body0+2.1,.18,FLOOR-.25,.18,TILE.PLAIN,null,0xe8e2d2);detail.box(x,FLOOR,body0+2.1,.12,1,.12,TILE.PLAIN,null,0x4a4f4c);}
  cutout.wallZ(-hw,hw,FLOOR,FLOOR+1,body0+2.15,1,TILE.RAILING,[1,1],0x4a4f4c,false);
  solid.roof(-hw,hw,body0,body0+2.3,h-.3,TILE.ROOF_METAL,1,0x8a8f8a);
  for(let i=0;i<=rooms;i++){const x=-hw+.2+i*(w-.4)/rooms;detail.box(x,FLOOR+1,body0+2.1,.12,h-FLOOR-1.3,.12,TILE.PLAIN,null,0xe8e2d2);}
  // parking bay lines
  for(let i=0;i<rooms;i++){const x=-hw+(i+1)*w/rooms;detail.box(x,0,hd-1.9,.1,.02,3.6,TILE.PLAIN,TILE.PLAIN,0xe8e4d6);}
  rooftop(-hw,hw,-hd,body0,h);
  detail.box(hw-1,0,hd-.8,.35,7.4,.35,TILE.PLAIN,null,0x5d625f);
  signSlot(hw-1,7.6,hd-.8,4.4,2.6,'pole','neon');
  return {signs,height:h};
 }
 // Box-body archetypes: terrace, shop, flats, diner, arcade, pawn, laundromat.
 const h=type==='diner'?4.2:type==='arcade'?7.6:floors*FLOOR;
 body(-hw,hw,-hd,hd,0,h);roofFlat(-hw,hw,-hd,hd,h);
 const ground=['shop','terrace','diner','arcade','pawn','laundromat'].includes(type);
 if(ground){
  // contrasting shop band with kickplate and fascia
  const band=pick(r,[0x2e3a36,0x4a2f2a,0x23323e,0xe9e2d0,0x6a2f2f,0x2d4a3a]);
  solid.wallZ(-hw-.02,hw+.02,0,3.3,hd+.02,1,TILE.PLAIN,[1,1],band,false);
  shopfront(-hw+.35,hw-.35,null,type==='laundromat'?[TILE.TILES,TILE.SHOP_LIT]:[TILE.SHOP,TILE.SHOP_LIT]);
  if(type==='pawn')cutout.wallZ(-hw+.3,hw-.3,.1,2.8,hd+.14,1,TILE.GRILLE,[1,2.7],0xffffff,false);
  if(type!=='arcade'&&type!=='diner'&&r()<.75)awning(-hw+.25,hw-.25,2.7,1.4+r()*.6);
  signSlot(0,3.68,hd+.22,Math.min(w-.6,9),1.2,'front',r()<.45?'neon':'board');
 }else{
  solid.wallZ(-.6,.6,0,2.3,hd+.05,1,TILE.DOOR,[1.2,2.3],0xffffff,false);solid.box(0,2.4,hd+.5,2,.15,1,TILE.PLAIN,TILE.PLAIN,trim);
  windowsZ(-hw+.6,-1,.9,hd,1);windowsZ(1,hw-.6,.9,hd,1);
 }
 const upperStart=ground?1:1;
 if(type==='diner'){
  windowsX(-hd+1,hd-1.5,1,hw,1,1.6,1.6,2.6);windowsX(-hd+1,hd-1.5,1,-hw,-1,1.6,1.6,2.6);
  solid.box(0,h,0,w+.3,.35,d+.3,TILE.PLAIN,TILE.ROOF,trim);
  signSlot(0,h+1.4,0,Math.min(w*.95,10),2,'roof','neon');
 }else if(type==='arcade'){
  // tall facade, bulb marquee and a big neon roof sign
  solid.wallZ(-hw+.4,hw-.4,3.5,h-.6,hd+.03,1,TILE.STUCCO,[2,2],0x6c3a8a,false);
  solid.box(0,3.3,hd+1.2,w-.8,.5,2.4,TILE.BULBS,TILE.ROOF_METAL,0xffffff,[1,.5]);
  for(let i=0;i<3;i++)solid.wallZ(-hw+1+i*(w-2)/3,-hw+1+(i+.8)*(w-2)/3,4.3,6.5,hd+.06,1,TILE.BULBS,[1,1],0xffffff,false);
  signSlot(0,h+2,0,Math.min(w*.95,16),3.6,'roof','neon');
  windowsX(-hd+1,hd-1,4.5,hw,1);windowsX(-hd+1,hd-1,4.5,-hw,-1);
 }else{
  for(let f=upperStart;f<floors;f++){windowsZ(-hw+.6,hw-.6,f*FLOOR+.85,hd,1);windowsX(-hd+.8,hd-.8,f*FLOOR+.85,hw,1);windowsX(-hd+.8,hd-.8,f*FLOOR+.85,-hw,-1);windowsZ(-hw+.8,hw-.8,f*FLOOR+.85,-hd,-1);}
  if(!ground){for(let f=0;f<1;f++){windowsX(-hd+.8,hd-.8,.9,hw,1);windowsX(-hd+.8,hd-.8,.9,-hw,-1);}}
  // floor bands and cornice
  for(let f=1;f<floors;f++)solid.box(0,f*FLOOR-.12,0,w+.12,.18,d+.12,TILE.PLAIN,null,trim,[1,1]);
  parapet(-hw,hw,-hd,hd,h,.6);
  // Flats and some terraces carry a fire escape on the side wall facing the alley.
  if((type==='flats'||type==='terrace')&&floors>=3&&r()<.75){
   const side=r()<.5?1:-1,x=side*(hw+.75),z0=-hd+1.2,z1=Math.min(hd-1.2,z0+5);
   for(let f=1;f<floors;f++){const y=f*FLOOR-.1;cutout.quad([x-.7*side,y,z0],[x-.7*side,y,z1],[x+.7*side,y,z1],[x+.7*side,y,z0],[0,1,0],TILE.GRATE,(z1-z0),1.4,0x3f4442);
    cutout.wallX(z0,z1,y,y+1,x+.7*side,side,TILE.RAILING,[1,1],0x3f4442,false);
    // ladder between landings
    detail.box(x,y-FLOOR+.1,z1-.5,.06,FLOOR,.06,TILE.PLAIN,null,0x3f4442);detail.box(x,y-FLOOR+.1,z1-.1,.06,FLOOR,.06,TILE.PLAIN,null,0x3f4442);}
   for(const z of [z0,z1])detail.box(x+.7*side,FLOOR-.1,z,.08,(floors-1)*FLOOR,.08,TILE.PLAIN,null,0x3f4442);
  }
  if(type==='flats'&&r()<.6){for(let f=1;f<floors;f++){const bx=(r()-.5)*(w-4);detail.box(bx,f*FLOOR,hd+.6,2.4,.18,1.2,TILE.CONCRETE,TILE.CONCRETE,0xc9c4b8);cutout.wallZ(bx-1.2,bx+1.2,f*FLOOR+.18,f*FLOOR+1.1,hd+1.2,1,TILE.RAILING,[1,1],0x3f4442,false);}}
  if(type==='flats'&&lot.name)signSlot(0,FLOOR*1-.6,hd+.2,Math.min(w*.6,6),.7,'front','board');
  rooftop(-hw+.4,hw-.4,-hd+.4,hd-.4,h);
 }
 if(type==='diner'||type==='arcade')rooftop(-hw+.4,hw-.4,-hd+.4,-1.4,h+.35);
 downpipe(hw-.15,hd+.1);stains(-hw,hw,hd,1,h);sideTags();
 // back wall clutter: door and a bin
 solid.wallZ(hw-2.2,hw-1.2,0,2.2,-hd-.04,-1,TILE.DOOR,[1,2.2],0xffffff,false);
 return {signs,height:h};
}
