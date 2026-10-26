// Rain rendering for Gummy Bay. Each layer is a single draw call with a hard per-quality budget:
// drops (shader-animated line segments), splash rings (points), puddles and umbrellas (instanced).
import * as THREE from './vendor/three.module.min.js';
import {weatherBudget} from './weather.mjs';

const DROP_BOX=36,DROP_HEIGHT=22;
const cellHash=(x,z)=>{let h=Math.imul(x|0,73856093)^Math.imul(z|0,19349663);h=Math.imul(h^(h>>>13),1274126177);return ((h^(h>>>16))>>>0)/4294967296;};

export function createRainFX({scene,quality='medium',floorHeight=()=>0,wetSurface=()=>true,maxBudget=weatherBudget('high')}={}){
 let budget=weatherBudget(quality);
 // Drops: allocated at the High size once; the draw range follows quality and intensity.
 const N=maxBudget.drops,seed=new Float32Array(N*2*4),tip=new Float32Array(N*2),pos=new Float32Array(N*2*3);
 for(let i=0;i<N;i++){const a=Math.random(),b=Math.random(),c=Math.random(),d=Math.random();for(const k of [0,1]){seed.set([a,b,c,d],(i*2+k)*4);tip[i*2+k]=k;}}
 const dropGeo=new THREE.BufferGeometry();dropGeo.setAttribute('position',new THREE.BufferAttribute(pos,3));dropGeo.setAttribute('seed',new THREE.BufferAttribute(seed,4));dropGeo.setAttribute('tip',new THREE.BufferAttribute(tip,1));
 const dropMat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{uCam:{value:new THREE.Vector3()},uTime:{value:0},uOpacity:{value:0},uWind:{value:.35}},
  vertexShader:`attribute vec4 seed;attribute float tip;uniform vec3 uCam;uniform float uTime;uniform float uWind;varying float vTip;
  void main(){vec3 p=seed.xyz*vec3(${DROP_BOX}.0,${DROP_HEIGHT}.0,${DROP_BOX}.0);p.y=mod(p.y-uTime*(15.0+seed.w*7.0),${DROP_HEIGHT}.0);
  p.xz=mod(p.xz-uCam.xz,${DROP_BOX}.0)+uCam.xz-${DROP_BOX/2}.0;p.y+=uCam.y-${Math.round(DROP_HEIGHT*.4)}.0;float len=.55+seed.w*.35;p.y+=tip*len;p.x+=tip*uWind*len*.3;vTip=tip;
  gl_Position=projectionMatrix*viewMatrix*vec4(p,1.0);}`,
  fragmentShader:`uniform float uOpacity;varying float vTip;void main(){gl_FragColor=vec4(.78,.84,.9,uOpacity*(.15+vTip*.45));}`});
 const drops=new THREE.LineSegments(dropGeo,dropMat);drops.name='Rain drops';drops.frustumCulled=false;drops.renderOrder=3;drops.visible=false;scene.add(drops);
 // Splash rings: CPU-placed around the camera, each grows and fades.
 const S=maxBudget.splashes,sPos=new Float32Array(S*3),sLife=new Float32Array(S).fill(1);
 const splashGeo=new THREE.BufferGeometry();splashGeo.setAttribute('position',new THREE.BufferAttribute(sPos,3));splashGeo.setAttribute('life',new THREE.BufferAttribute(sLife,1));
 const splashMat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{uOpacity:{value:0},uScale:{value:420}},
  vertexShader:`attribute float life;uniform float uScale;varying float vLife;void main(){vLife=life;vec4 mv=modelViewMatrix*vec4(position,1.0);gl_PointSize=life<1.0?(.12+life*.5)*uScale/max(1.0,-mv.z):0.0;gl_Position=projectionMatrix*mv;}`,
  fragmentShader:`uniform float uOpacity;varying float vLife;void main(){vec2 c=gl_PointCoord*2.0-1.0;c.y*=2.2;float r=length(c);float ring=smoothstep(.55,.8,r)*(1.0-smoothstep(.8,1.0,r));if(ring<.02)discard;gl_FragColor=vec4(.85,.9,.95,ring*uOpacity*(1.0-vLife));}`});
 const splashes=new THREE.Points(splashGeo,splashMat);splashes.name='Rain splashes';splashes.frustumCulled=false;splashes.visible=false;splashes.renderOrder=2;scene.add(splashes);
 // Puddles: world-stable cells near the camera, the nearest `budget.puddles` on road or pavement.
 const P=maxBudget.puddles,puddleGeo=new THREE.CircleGeometry(1,14);puddleGeo.rotateX(-Math.PI/2);
 const puddleMat=new THREE.MeshStandardMaterial({color:0x34444d,roughness:.04,metalness:.9,transparent:true,opacity:0,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-3});
 const puddles=new THREE.InstancedMesh(puddleGeo,puddleMat,P);puddles.name='Rain puddles';puddles.frustumCulled=false;puddles.count=0;puddles.receiveShadow=false;puddles.visible=false;scene.add(puddles);
 // Umbrellas: canopy plus handle merged; one instance per sheltered pedestrian.
 const canopy=new THREE.ConeGeometry(.62,.32,8,1,true),handle=new THREE.CylinderGeometry(.018,.018,.9,4);handle.translate(0,-.45,0);canopy.translate(0,.05,0);
 const umbGeo=mergePlain([canopy,handle]);
 const umbMat=new THREE.MeshStandardMaterial({roughness:.7,side:THREE.DoubleSide});
 const U=maxBudget.umbrellas,umbrellas=new THREE.InstancedMesh(umbGeo,umbMat,U);umbrellas.name='Umbrellas';umbrellas.frustumCulled=false;umbrellas.count=0;umbrellas.castShadow=false;umbrellas.visible=false;scene.add(umbrellas);
 const hues=[0xe0524f,0x3f7fd0,0xf2c33d,0x55b37a,0xb95fc4,0x2f3337];const tmpC=new THREE.Color();
 for(let i=0;i<U;i++)umbrellas.setColorAt(i,tmpC.setHex(hues[i%hues.length]));
 const o=new THREE.Object3D();let cellKey='',wetList=[],splashCursor=0,spawnDebt=0,t=0;
 const wetMats=new Map();
 const stats={drops:0,splashes:0,puddles:0,umbrellas:0};
 function placePuddles(cx,cz){
  const gx=Math.floor(cx/7),gz=Math.floor(cz/7),key=gx+','+gz+','+budget.puddles;if(key===cellKey)return;cellKey=key;
  const cand=[];for(let x=gx-6;x<=gx+6;x++)for(let z=gz-6;z<=gz+6;z++){const h=cellHash(x,z);if(h>.3)continue;const px=x*7+3.5+(cellHash(z,x)-.5)*4,pz=z*7+3.5+(h-.15)*12;if(!wetSurface(px,pz))continue;cand.push({x:px,z:pz,r:.7+cellHash(x+9,z-3)*1.3,d:Math.hypot(px-cx,pz-cz),a:h*20});}
  cand.sort((a,b)=>a.d-b.d);wetList=cand.slice(0,budget.puddles);
 }
 return {drops,splashes,puddles,umbrellas,stats,
  setQuality(q){budget=weatherBudget(q);cellKey='';},
  get budget(){return budget;},
  // Gathers flat road and pavement materials once, so wet roads can lose roughness and darken.
  addWetMaterials(list){for(const m of list){if(!m||wetMats.has(m)||!('roughness' in m))continue;wetMats.set(m,{rough:m.roughness,color:m.color?.clone?.()||null,metal:m.metalness||0});}return wetMats.size;},
  update({camera,rain=0,wet=0,dt=0,people=null,umbrellaFor=()=>false,covered=false}={}){
   t+=Math.max(0,Math.min(.1,dt||0));
   const cam=camera?.position||{x:0,y:2,z:0},show=rain>.01;
   drops.visible=show;splashes.visible=show;
   const nDrops=show?Math.max(1,Math.round(budget.drops*Math.min(1,rain*1.15))):0;dropGeo.setDrawRange(0,nDrops*2);dropMat.uniforms.uCam.value.set(cam.x,cam.y,cam.z);dropMat.uniforms.uTime.value=t;dropMat.uniforms.uOpacity.value=Math.min(1,.35+rain*.6);
   stats.drops=nDrops;
   // Splashes: spawn up to the budget, weighted by intensity.
   const nSplash=show?Math.round(budget.splashes*Math.min(1,rain*1.2)):0;splashGeo.setDrawRange(0,nSplash);stats.splashes=nSplash;
   if(show&&dt>0){spawnDebt+=nSplash*dt*2.5;for(let i=0;i<nSplash;i++){if(sLife[i]<1)sLife[i]=Math.min(1,sLife[i]+dt*3.2);}
    while(spawnDebt>=1&&nSplash>0){spawnDebt-=1;let tries=0;while(tries++<nSplash&&sLife[splashCursor%nSplash]<1)splashCursor++;const i=splashCursor%nSplash;splashCursor++;if(sLife[i]<1)continue;const a=Math.random()*Math.PI*2,r=1.5+Math.sqrt(Math.random())*13,x=cam.x+Math.cos(a)*r,z=cam.z+Math.sin(a)*r;sPos[i*3]=x;sPos[i*3+1]=floorHeight(x,z)+.04;sPos[i*3+2]=z;sLife[i]=0;}
    splashGeo.attributes.position.needsUpdate=true;splashGeo.attributes.life.needsUpdate=true;}
   splashMat.uniforms.uOpacity.value=Math.min(1,.4+rain*.6);
   // Puddles and wet sheen follow road wetness, not the live rain, so roads stay wet after a shower.
   puddles.visible=wet>.08;
   if(puddles.visible){placePuddles(cam.x,cam.z);puddles.count=wetList.length;wetList.forEach((p,i)=>{o.position.set(p.x,floorHeight(p.x,p.z)+.03,p.z);o.rotation.set(0,p.a,0);const k=p.r*Math.min(1,.35+wet*.75);o.scale.set(k*1.5,1,k);o.updateMatrix();puddles.setMatrixAt(i,o.matrix);});puddles.instanceMatrix.needsUpdate=true;puddleMat.opacity=Math.min(.82,wet*.9);}
   stats.puddles=puddles.visible?puddles.count:0;
   for(const [m,base] of wetMats){m.roughness=base.rough+(Math.max(.12,base.rough*.3)-base.rough)*wet;m.metalness=base.metal+(.25-base.metal)*wet*.8;if(base.color)m.color.copy(base.color).multiplyScalar(1-wet*.28);}
   // Umbrellas over nearby pedestrians who carry one.
   let n=0;
   if(show&&people)for(const person of people){if(n>=budget.umbrellas)break;if(!umbrellaFor(person))continue;const dx=person.x-cam.x,dz=person.z-cam.z;if(dx*dx+dz*dz>48*48)continue;
    o.position.set(person.x,floorHeight(person.x,person.z)+2.12,person.z);o.rotation.set(.12*Math.sin(t*1.7+person.id),person.yaw||0,.1);o.scale.setScalar(1);o.updateMatrix();umbrellas.setMatrixAt(n++,o.matrix);}
   umbrellas.count=n;umbrellas.visible=n>0;if(n)umbrellas.instanceMatrix.needsUpdate=true;stats.umbrellas=n;
   return stats;
  }};
}
function mergePlain(list){const pos=[],nor=[];for(const g0 of list){const g=g0.index?g0.toNonIndexed():g0;pos.push(...g.attributes.position.array);nor.push(...g.attributes.normal.array);}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));return g;}

// Rain hiss: looped noise through high- and low-pass filters. Quieter while you sit in a car.
export function createRainAudio(ctx,destination){
 if(!ctx||typeof ctx.createBufferSource!=='function')return {update(){},live:false};
 const len=(ctx.sampleRate||44100)*2,buf=ctx.createBuffer(1,len,ctx.sampleRate||44100),d=buf.getChannelData(0);let last=0;for(let i=0;i<len;i++){last=last*.6+(Math.random()*2-1)*.4;d[i]=last+(Math.random()<.0009?(Math.random()-.5)*1.4:0);}
 const src=ctx.createBufferSource();src.buffer=buf;src.loop=true;const hp=ctx.createBiquadFilter();hp.type='highpass';hp.frequency.value=380;const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=5200;const g=ctx.createGain();g.gain.value=0;
 src.connect(hp);hp.connect(lp);lp.connect(g);g.connect(destination||ctx.destination);src.start();
 return {live:true,update(rain=0,{covered=false,volume=1}={}){const t=ctx.currentTime;g.gain.setTargetAtTime(Math.min(.2,rain*.16)*volume*(covered?.45:1),t,.4);lp.frequency.setTargetAtTime(covered?1600:5200,t,.3);}};
}
