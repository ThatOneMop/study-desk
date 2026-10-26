import * as THREE from './vendor/three.module.min.js';
// Soft billboard clouds. Each texture is painted on a canvas from overlapping
// radial puffs, broken up by value noise, flat-ish at the base and feathered to
// zero alpha at every edge, so no hard silhouette can read as a solid object.
// Clouds wrap around the camera in a 640 m tile and fade out before the far
// plane, so they never pop and always sit in the sky above the town.

export const CLOUD_TILE=640;
export const CLOUD_FADE=Object.freeze({start:190,end:300});

function rng(seed){let s=seed>>>0||1;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};}

export function cloudLayout(count=30,seed=11){
 const r=rng(seed),out=[];
 for(let i=0;i<count;i++){
  const w=60+r()*120;
  out.push(Object.freeze({x:(r()-.5)*CLOUD_TILE,z:(r()-.5)*CLOUD_TILE,y:62+r()*36,w,h:w*(.36+r()*.16),variant:i%4,drift:.6+r()*.8,alpha:.62+r()*.3}));
 }
 return out;
}

// Wraps a value into [-tile/2, tile/2) around the camera.
export function wrapAround(value,centre,tile=CLOUD_TILE){
 const d=value-centre;return centre+(((d+tile/2)%tile)+tile)%tile-tile/2;
}

export function cloudFade(horizontal){
 if(!Number.isFinite(horizontal))return 0;
 if(horizontal<=CLOUD_FADE.start)return 1;
 if(horizontal>=CLOUD_FADE.end)return 0;
 const t=(horizontal-CLOUD_FADE.start)/(CLOUD_FADE.end-CLOUD_FADE.start);return 1-t*t*(3-2*t);
}

function paintCloud(variant){
 const W=256,H=128,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
 const r=rng(101+variant*977);
 g.clearRect(0,0,W,H);
 // Puffs: bigger in the middle, rising towards the top, flattened at the base.
 const puffs=14+Math.floor(r()*8);
 for(let i=0;i<puffs;i++){
  const u=r(),x=W*(.16+u*.68),centre=1-Math.abs(u-.5)*2;
  const rad=H*(.16+centre*.22+r()*.1),y=H*(.66-centre*.2-r()*.12);
  const grad=g.createRadialGradient(x,y,0,x,y,rad);
  grad.addColorStop(0,'rgba(255,255,255,.55)');grad.addColorStop(.55,'rgba(255,255,255,.28)');grad.addColorStop(1,'rgba(255,255,255,0)');
  g.fillStyle=grad;g.beginPath();g.arc(x,y,rad,0,Math.PI*2);g.fill();
 }
 // Value noise erodes the alpha and shades the underside a touch bluer.
 const img=g.getImageData(0,0,W,H),d=img.data;
 const lattice=new Float32Array(33*17);for(let i=0;i<lattice.length;i++)lattice[i]=r();
 const noise=(x,y,s)=>{const fx=x/s,fy=y/s,ix=Math.floor(fx),iy=Math.floor(fy),tx=fx-ix,ty=fy-iy,sx=tx*tx*(3-2*tx),sy=ty*ty*(3-2*ty);
  const L=(a,b)=>lattice[((b%17)*33+(a%33))];
  return (L(ix,iy)*(1-sx)+L(ix+1,iy)*sx)*(1-sy)+(L(ix,iy+1)*(1-sx)+L(ix+1,iy+1)*sx)*sy;};
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){
  const i=(y*W+x)*4;let a=d[i+3]/255;if(!a)continue;
  const n=noise(x,y,16)*.55+noise(x+50,y+20,8)*.3+noise(x+9,y+77,4)*.15;
  a=Math.max(0,Math.min(1,(a*1.5-.12)*(.55+n*.9)));
  const ex=Math.min(x,W-1-x)/(W*.14),ey=Math.min(y,H-1-y)/(H*.2);a*=Math.min(1,ex)*Math.min(1,ey);
  const shade=.78+.22*(1-y/H)+(n-.5)*.08;
  d[i]=Math.min(255,255*shade);d[i+1]=Math.min(255,252*shade);d[i+2]=Math.min(255,250*(shade*.96+.04));d[i+3]=Math.round(a*255);
 }
 g.putImageData(img,0,0);
 const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.needsUpdate=true;return tex;
}

export function createSkyClouds(scene,{count=30,seed=11}={}){
 const group=new THREE.Group();group.name='Soft sky clouds';
 if(typeof document==='undefined'||!document.createElement)return {group,sprites:[],update(){}};
 const textures=[0,1,2,3].map(paintCloud);
 const layout=cloudLayout(count,seed);
 const sprites=layout.map((c,i)=>{
  const m=new THREE.SpriteMaterial({map:textures[c.variant],transparent:true,depthWrite:false,fog:false,opacity:c.alpha,color:0xffffff});
  const s=new THREE.Sprite(m);s.scale.set(c.w,c.h,1);s.renderOrder=-1;s.userData.cloud=c;s.frustumCulled=false;group.add(s);return s;
 });
 scene.add(group);
 const tint=new THREE.Color(),warm=new THREE.Color(),night=new THREE.Color(0x2c3644);
 return {group,sprites,
  update(camera,{time=0,daylight=1,warmth=0,sunColor=0xffe2bb,cloud=0}={}){
   if(!camera)return;
   tint.setRGB(1,1,1).lerp(night,1-Math.min(1,daylight*2.4));
   warm.setHex(sunColor);tint.lerp(warm.multiplyScalar(1.05),Math.min(.55,warmth*.5));
   const wind=time*1.4;
   for(const s of sprites){const c=s.userData.cloud;
    const x=wrapAround(c.x+wind*c.drift,camera.position.x),z=wrapAround(c.z+wind*c.drift*.35,camera.position.z);
    s.position.set(x,Math.max(c.y,camera.position.y+34),z);
    const f=cloudFade(Math.hypot(x-camera.position.x,z-camera.position.z));
    s.visible=f>.01;s.material.opacity=c.alpha*f*(.85+cloud*.15);s.material.color.copy(tint);
   }
  }};
}
