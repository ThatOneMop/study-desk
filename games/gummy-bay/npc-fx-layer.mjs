// P1-6 drawing: one Points draw call for every gummy-effect particle (stars,
// puffs, Zs, notes, question marks, glow halos) plus a small pool of DOM speech
// bubbles. Low quality keeps 64 particles and two bubbles.
import * as THREE from './vendor/three.module.min.js';

export const FX_STYLES=Object.freeze({star:0,puff:1,z:2,note:3,question:4,heart:5});
const COLS=3,ROWS=2,CELL=64;
function atlas(){
 if(typeof document==='undefined')return null;
 const c=document.createElement('canvas');c.width=COLS*CELL;c.height=ROWS*CELL;const g=c.getContext?.('2d');if(!g||typeof g.createRadialGradient!=='function')return null;
 const at=i=>[(i%COLS)*CELL+CELL/2,Math.floor(i/COLS)*CELL+CELL/2];
 let [x,y]=at(0);g.fillStyle='#fff';g.beginPath();for(let k=0;k<8;k++){const r=k%2?9:28,a=k*Math.PI/4-Math.PI/2;g.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r);}g.fill();
 [x,y]=at(1);const grad=g.createRadialGradient(x,y,0,x,y,30);grad.addColorStop(0,'rgba(255,255,255,1)');grad.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=grad;g.fillRect(x-32,y-32,64,64);
 g.fillStyle='#fff';g.textAlign='center';g.textBaseline='middle';
 [x,y]=at(2);g.font='bold 46px sans-serif';g.fillText('Z',x,y+2);
 [x,y]=at(3);g.font='bold 44px sans-serif';g.fillText('♪',x,y+2);
 [x,y]=at(4);g.font='bold 48px sans-serif';g.fillText('?',x,y+2);
 [x,y]=at(5);g.font='bold 44px sans-serif';g.fillText('♥',x,y+2);
 const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;return tex;
}
const VERT=`attribute float aCell;attribute float aSize;attribute float aAlpha;attribute vec3 aColor;varying float vCell;varying float vAlpha;varying vec3 vColor;
void main(){vCell=aCell;vAlpha=aAlpha;vColor=aColor;vec4 mv=modelViewMatrix*vec4(position,1.0);gl_PointSize=aSize*(300.0/max(.5,-mv.z));gl_Position=projectionMatrix*mv;}`;
const FRAG=`uniform sampler2D map;varying float vCell;varying float vAlpha;varying vec3 vColor;
void main(){float col=mod(vCell,${COLS}.0),row=floor(vCell/${COLS}.0);vec2 uv=vec2((col+gl_PointCoord.x)/${COLS}.0,1.0-(row+gl_PointCoord.y)/${ROWS}.0);vec4 t=texture2D(map,uv);float a=t.a*vAlpha;if(a<.02)discard;gl_FragColor=vec4(vColor*t.rgb,a);}`;

export function createNpcFxLayer({scene,camera,low=false,parent=null}={}){
 const cap=low?64:192;
 const pos=new Float32Array(cap*3),vel=new Float32Array(cap*3),life=new Float32Array(cap),max=new Float32Array(cap),cell=new Float32Array(cap),size=new Float32Array(cap),alpha=new Float32Array(cap),color=new Float32Array(cap*3);
 const geo=new THREE.BufferGeometry();
 const attr=(name,array,n)=>{const a=new THREE.BufferAttribute(array,n);a.setUsage(THREE.DynamicDrawUsage);geo.setAttribute(name,a);return a;};
 const aPos=attr('position',pos,3),aCell=attr('aCell',cell,1),aSize=attr('aSize',size,1),aAlpha=attr('aAlpha',alpha,1),aColor=attr('aColor',color,3);
 const map=atlas();
 const mat=new THREE.ShaderMaterial({uniforms:{map:{value:map}},vertexShader:VERT,fragmentShader:FRAG,transparent:true,depthWrite:false});
 const points=new THREE.Points(geo,mat);points.name='NPC gummy effects';points.frustumCulled=false;points.renderOrder=5;
 if(map)scene?.add(points);
 let next=0,glows=0;const tmp=new THREE.Color();
 const spawn=(x,y,z,style,hex,{vx=0,vy=.5,vz=0,ttl=1.6,s=.18}={})=>{
  const i=next;next=(next+1)%cap;
  pos[i*3]=x;pos[i*3+1]=y;pos[i*3+2]=z;vel[i*3]=vx;vel[i*3+1]=vy;vel[i*3+2]=vz;life[i]=ttl;max[i]=ttl;cell[i]=FX_STYLES[style]??0;size[i]=s;
  tmp.setHex(hex>>>0);color[i*3]=tmp.r;color[i*3+1]=tmp.g;color[i*3+2]=tmp.b;return i;
 };
 // emitters: [{x,y,z,height,particles:[{style,color,rate}],glow,glowColor,key}]
 const carry=new Map();
 const update=(dt,emitters=[])=>{
  const step=Math.max(0,Math.min(.1,dt||0));
  for(const e of emitters){
   for(const p of e.particles||[]){
    const key=e.key+':'+p.style;let acc=(carry.get(key)||0)+p.rate*step;
    while(acc>=1){acc-=1;const r=Math.random,h=e.height||1.7;
     if(p.style==='star')spawn(e.x+(r()-.5)*.6,e.y+r()*h,e.z+(r()-.5)*.6,'star',p.color,{vx:(r()-.5)*.3,vy:.25+r()*.3,vz:(r()-.5)*.3,ttl:1.1,s:.12+r()*.08});
     else if(p.style==='puff')spawn(e.x+(r()-.5)*.4,e.y+h*.6+r()*.4,e.z+(r()-.5)*.4,'puff',p.color,{vy:.35,ttl:1.8,s:.35});
     else spawn(e.x+.18,e.y+h+.12,e.z,p.style,p.color,{vx:.12,vy:.45,ttl:2,s:.26});
    }
    carry.set(key,acc);
   }
  }
  for(let i=0;i<cap;i++){
   if(life[i]<=0){alpha[i]=0;continue;}
   life[i]-=step;pos[i*3]+=vel[i*3]*step;pos[i*3+1]+=vel[i*3+1]*step;pos[i*3+2]+=vel[i*3+2]*step;
   const k=Math.max(0,life[i]/max[i]);alpha[i]=Math.min(1,k*2.2)*(cell[i]===1?.55:1);
  }
  // Glow halos ride in the tail of the pool and live one frame.
  glows=0;
  for(const e of emitters){if(!(e.glow>0)||glows>=8)continue;const i=cap-1-glows++;life[i]=0;pos[i*3]=e.x;pos[i*3+1]=e.y+(e.height||1.7)*.55;pos[i*3+2]=e.z;cell[i]=1;size[i]=1.9*(e.height||1.7)/1.7;alpha[i]=.55*e.glow;tmp.setHex(e.glowColor??0xbff7ff);color[i*3]=tmp.r;color[i*3+1]=tmp.g;color[i*3+2]=tmp.b;}
  for(const a of [aPos,aCell,aSize,aAlpha,aColor])a.needsUpdate=true;
  return emitters.length;
 };
 // Speech bubbles. items: [{x,y,z,text,tone}] sorted by priority; nearest first.
 const pool=[],maxBubbles=low?2:4;
 const host=parent||(typeof document!=='undefined'?document.body:null);
 if(typeof host?.appendChild==='function')for(let i=0;i<maxBubbles;i++){try{const d=document.createElement('div');d.className='npc-bubble';d.hidden=true;d.dataset??={};d.style??={};host.appendChild(d);pool.push(d);}catch{break;}}
 const v=new THREE.Vector3();
 const bubbles=(items=[],{hidden=false}={})=>{
  let shown=0;
  for(const item of items){
   if(hidden||shown>=pool.length)break;
   v.set(item.x,item.y,item.z).project(camera);
   if(v.z>1||v.z<-1||Math.abs(v.x)>1.05||Math.abs(v.y)>1.05)continue;
   const d=pool[shown++];if(d.textContent!==item.text)d.textContent=item.text;
   d.dataset.tone=item.tone||'';d.hidden=false;
   d.style.transform='translate(-50%,-100%) translate('+((v.x+1)/2*innerWidth).toFixed(1)+'px,'+((1-v.y)/2*innerHeight).toFixed(1)+'px)';
  }
  for(let i=shown;i<pool.length;i++)pool[i].hidden=true;
  return shown;
 };
 const live=()=>{let n=0;for(let i=0;i<cap;i++)if(life[i]>0)n++;return n;};
 return {points,update,bubbles,spawn,live,capacity:cap,maxBubbles,drawCalls:1};
}
export const NPC_BUBBLE_CSS='.npc-bubble{position:fixed;left:0;top:0;z-index:6;pointer-events:none;max-width:180px;padding:5px 10px;border-radius:14px;background:#fffdf4;color:#2a2622;font:600 13px/1.25 system-ui,sans-serif;box-shadow:0 2px 6px rgba(0,0,0,.25);white-space:nowrap;will-change:transform}.npc-bubble::after{content:"";position:absolute;left:50%;bottom:-6px;margin-left:-6px;border:6px solid transparent;border-bottom:0;border-top-color:#fffdf4}.npc-bubble[data-tone=alarm]{background:#ffe3dc;color:#7a1f12}.npc-bubble[data-tone=alarm]::after{border-top-color:#ffe3dc}.npc-bubble[data-tone=fx]{background:#f3ecff;color:#3d2a6b}.npc-bubble[data-tone=fx]::after{border-top-color:#f3ecff}';
