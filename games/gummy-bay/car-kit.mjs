// Gummy Bay car kit: low-poly original car bodies, Lucky Lou's lot, skid marks and engine audio.
// Every body is ONE merged, vertex-coloured mesh, so a car costs one draw call.
import * as THREE from './vendor/three.module.min.js';
import {LOT_CARS,LOT_SITE} from './car-physics.mjs';

const col=new THREE.Color();
// Collects transformed, non-indexed primitives into one BufferGeometry with per-vertex colours.
export function createMerger(){
 const pos=[],nor=[],cols=[],m=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),nm=new THREE.Matrix3(),v=new THREE.Vector3();
 const add=(geo,{x=0,y=0,z=0,rx=0,ry=0,rz=0,sx=1,sy=1,sz=1,color=0xffffff})=>{
  const g=geo.index?geo.toNonIndexed():geo;e.set(rx,ry,rz);q.setFromEuler(e);m.compose(new THREE.Vector3(x,y,z),q,new THREE.Vector3(sx,sy,sz));nm.getNormalMatrix(m);col.setHex(color);
  const p=g.attributes.position,n=g.attributes.normal;
  for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(m);pos.push(v.x,v.y,v.z);v.fromBufferAttribute(n,i).applyMatrix3(nm).normalize();nor.push(v.x,v.y,v.z);cols.push(col.r,col.g,col.b);}
  if(g!==geo)g.dispose();
 };
 return {add,box:(x,y,z,w,h,d,color,extra={})=>add(BOX,{x,y,z,sx:w,sy:h,sz:d,color,...extra}),
  build(){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));g.setAttribute('color',new THREE.Float32BufferAttribute(cols,3));g.computeBoundingSphere();g.computeBoundingBox();return g;},
  get vertices(){return pos.length/3;}};
}
const BOX=new THREE.BoxGeometry(1,1,1),WHEEL=new THREE.CylinderGeometry(.3,.3,.2,10),CONE=new THREE.ConeGeometry(1,1,8,1,true);
const TYRE=0x1f2424,GLASS=0x3f5a63,LAMP=0xf6e3b0,TAIL=0xc0453c,CHROME=0xc9ccc4;
export const CAR_MATERIAL=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.55,metalness:.08});
CAR_MATERIAL.name='Car body (vertex colours)';

function wheels(k,xs,zs,r=1){for(const x of xs)for(const z of zs)k.add(WHEEL,{x,y:.3*r,z,rz:Math.PI/2,sx:r,sy:r,sz:r,color:TYRE});}
// Adds one car body into a merger, centred on (ox,oz) and rotated by `angle`. Forward is +z.
export function addCarBody(k,kind,color,trim,{ox=0,oy=0,oz=0,angle=0}={}){
 const c=Math.cos(angle),s=Math.sin(angle);
 const local=k.add,at=(geo,o)=>{const x=o.x||0,z=o.z||0;local(geo,{...o,x:ox+x*c+z*s,y:oy+(o.y||0),z:oz-x*s+z*c,ry:(o.ry||0)+angle});};
 const kk={add:at,box:(x,y,z,w,h,d,color,extra={})=>at(BOX,{x,y,z,sx:w,sy:h,sz:d,color,...extra})};
 if(kind==='tuktuk'){
  kk.box(0,.62,.15,1.3,.5,2.2,color);kk.box(0,1.35,-.2,1.36,.08,1.6,trim);for(const x of [-.6,.6])for(const z of [-.9,.5])kk.box(x,1.05,z,.06,.62,.06,CHROME);
  kk.box(0,.98,.95,1.1,.5,.06,GLASS);kk.box(0,.75,-.2,1.1,.35,.7,trim);kk.box(0,.7,1.28,.5,.2,.1,LAMP);
  at(WHEEL,{x:0,y:.27,z:1.1,rz:Math.PI/2,sx:.9,sy:.9,sz:.9,color:TYRE});wheels(kk,[-.62,.62],[-.75],.9);
 }else if(kind==='icecream'){
  kk.box(0,.95,0,1.75,1.3,3.6,color);kk.box(0,1.62,.0,1.79,.12,3.64,trim);kk.box(0,1.15,1.52,1.5,.55,.55,GLASS);kk.box(.9,1.2,-.4,.04,.6,1.4,0x2b2f33);kk.box(.98,.88,-.4,.16,.06,1.5,trim);
  kk.add(CONE,{x:0,y:2.15,z:-.6,rx:Math.PI,sx:.32,sy:.6,sz:.32,color:0xf0c88a});kk.add(new THREE.SphereGeometry(.34,8,6),{x:0,y:2.5,z:-.6,color:0xf6b9cf});
  for(const x of [-.6,.6])kk.box(x,.55,1.81,.3,.18,.04,LAMP);for(const x of [-.6,.6])kk.box(x,.6,-1.81,.25,.18,.04,TAIL);wheels(kk,[-.82,.82],[-1.1,1.15]);
 }else if(kind==='pickup'){
  kk.box(0,.7,.2,1.75,.55,3.9,color);kk.box(0,1.25,.65,1.6,.6,1.35,color);kk.box(0,1.3,1.33,1.45,.45,.04,GLASS);kk.box(0,.95,-1.05,1.6,.12,1.45,trim);
  for(const x of [-.84,.84])kk.box(x,1.08,-1.05,.08,.32,1.5,color);kk.box(0,1.08,-1.77,1.7,.32,.08,color);for(const x of [-.6,.6])kk.box(x,.75,2.16,.3,.16,.04,LAMP);kk.box(0,.58,2.17,1.5,.14,.05,CHROME);
  wheels(kk,[-.85,.85],[-1.2,1.3],1.12);
 }else if(kind==='limo'){
  kk.box(0,.6,0,1.7,.48,5.4,color);kk.box(0,1.02,-.25,1.5,.4,3.9,GLASS);kk.box(0,1.26,-.25,1.56,.08,4,color);for(const z of [-1.4,0,1.2])kk.box(0,1.02,z,1.55,.42,.1,color);
  kk.box(0,.6,2.72,1.4,.2,.06,CHROME);for(const x of [-.6,.6])kk.box(x,.68,2.71,.25,.14,.04,LAMP);for(const x of [-.6,.6])kk.box(x,.68,-2.71,.25,.14,.04,TAIL);
  wheels(kk,[-.8,.8],[-1.9,1.9]);
 }else if(kind==='sprinter'){
  kk.box(0,.5,0,1.72,.36,3.6,color);kk.box(0,.82,-.2,1.4,.34,1.7,GLASS);kk.box(0,1,-.2,1.42,.06,1.5,color);kk.box(0,.92,-1.72,1.6,.06,.4,trim);for(const x of [-.65,.65])kk.box(x,.8,-1.6,.06,.26,.06,trim);
  kk.box(0,.42,1.82,1.5,.14,.05,trim);for(const x of [-.6,.6])kk.box(x,.55,1.8,.32,.08,.04,LAMP);for(const x of [-.55,.55])kk.box(x,.55,-1.81,.35,.1,.04,TAIL);kk.box(0,.69,.2,.18,.02,3.3,trim);
  wheels(kk,[-.82,.82],[-1.15,1.15],.95);
 }else if(kind==='cruiser'){
  kk.box(0,.62,0,1.75,.52,4.1,0xf2f2ee);kk.box(0,.66,0,1.78,.24,1.6,0x2d5fbd);kk.box(0,1.12,-.2,1.5,.46,2.1,GLASS);kk.box(0,1.38,-.2,1.56,.08,2.15,0xf2f2ee);
  kk.box(0,.56,2.07,1.5,.16,.06,0x222);for(const x of [-.6,.6])kk.box(x,.7,2.06,.3,.14,.04,LAMP);wheels(kk,[-.85,.85],[-1.3,1.3]);
 }else{ // wagon
  kk.box(0,.62,0,1.7,.55,4,color);kk.box(0,1.15,-.35,1.5,.5,2.7,GLASS);kk.box(0,1.43,-.35,1.58,.08,2.8,color);kk.box(0,1.15,1.0,1.52,.5,.06,color);
  kk.box(.86,.7,.6,.03,.3,.5,0x7a4b2e);kk.box(-.86,.8,-1,.03,.25,.7,0x6a3f26);kk.box(0,1.5,-.4,1.2,.06,1.7,trim);
  for(const x of [-.6,.6])kk.box(x,.72,2.01,.28,.16,.04,LAMP);for(const x of [-.6,.6])kk.box(x,.72,-2.01,.25,.16,.04,TAIL);kk.box(0,.5,2.02,1.5,.12,.05,CHROME);
  wheels(kk,[-.82,.82],[-1.3,1.35]);
 }
}
export function carGeometry(kind,color,trim){const k=createMerger();addCarBody(k,kind,color,trim);return k.build();}
// Bodies for the player's lot cars. select(id) shows one, or none for fleet vehicles.
export function createLotModels(){
 const group=new THREE.Group();group.name='Lot car bodies';const models=new Map();
 for(const car of LOT_CARS){const mesh=new THREE.Mesh(carGeometry(car.body,car.color,car.trim),CAR_MATERIAL);mesh.name=car.id;mesh.castShadow=true;mesh.receiveShadow=false;mesh.visible=false;group.add(mesh);models.set(car.id,mesh);}
 return {group,models,select(id){let any=false;for(const [k,m]of models){m.visible=k===id;any||=m.visible;}group.visible=any;return any;}};
}
// The lot itself: fence, bunting, office hut, sign and every unsold car, merged into one mesh.
// The open front faces the z=-90 road (negative z). Front row faces the road; back row faces the office.
export function lotLayout(){return LOT_CARS.map((car,i)=>({id:car.id,x:LOT_SITE.x-11+(i%3)*5.5+(i>=3?2.6:0),z:LOT_SITE.z+(i>=3?3.4:-3.4),angle:Math.PI}));}
export const LOT_OFFICE=Object.freeze({x:LOT_SITE.x+9,z:LOT_SITE.z+4.5,w:5,d:4});
export const LOT_DOOR=Object.freeze({x:LOT_SITE.x+9,z:LOT_SITE.z+1.6});
export function lotColliders(unsold=LOT_CARS.map(c=>c.id)){
 const X=LOT_SITE.x,Z=LOT_SITE.z,live=new Set(unsold),out=[{x:LOT_OFFICE.x,z:LOT_OFFICE.z,w:LOT_OFFICE.w+.65,d:LOT_OFFICE.d+.65,lot:'office'},{x:X,z:Z+7.5,w:26.6,d:.8,lot:'fence'},{x:X-13,z:Z,w:.8,d:15.6,lot:'fence'},{x:X+13,z:Z,w:.8,d:15.6,lot:'fence'}];
 for(const spot of lotLayout())if(live.has(spot.id)){const car=LOT_CARS.find(c=>c.id===spot.id),len=car.body==='limo'?5.6:car.body==='tuktuk'?2.8:4.2;out.push({x:spot.x,z:spot.z,w:2.5,d:len+.5,lot:spot.id});}
 return out;
}
export function buildLotGeometry(unsold=LOT_CARS.map(c=>c.id)){
 const k=createMerger(),X=LOT_SITE.x,Z=LOT_SITE.z,F=-1; // F: road side
 k.box(X,.02,Z,26,.04,15,0x8d877a);
 for(let i=0;i<6;i++)k.box(X-10+i*4,.045,Z-.2,.12,.01,5.5,0xe9e4d0);
 for(const [x,z,w,d] of [[X,Z-F*7.5,26,.12],[X-13,Z,.12,15],[X+13,Z,.12,15]])k.box(x,.45,z,w,.9,d,0x9aa1a0);
 for(let i=0;i<=8;i++)k.box(X-13+i*3.25,1.2,Z+F*7.5,.12,2.4,.12,0x6d6d64);
 for(let i=0;i<14;i++){const t=i/13,x=X-13+t*26;k.add(CONE,{x,y:2.25-Math.sin(t*Math.PI)*.25,z:Z+F*7.5,rx:Math.PI,sx:.22,sy:.4,sz:.05,color:[0xf05a5a,0xf6c445,0x4fb3e8,0x7ed957][i%4]});}
 const O=LOT_OFFICE;k.box(O.x,1.4,O.z,O.w,2.8,O.d,0xd9cfa8);k.box(O.x,2.9,O.z,O.w+.6,.2,O.d+.6,0xb24a3a);k.box(O.x,1.1,O.z-O.d/2-.02,1,2,.06,0x5d4634);k.box(O.x-1.7,1.6,O.z-O.d/2-.02,1.4,.9,.06,GLASS);k.box(O.x+1.6,1.6,O.z-O.d/2-.02,1.2,.9,.06,GLASS);
 // Big roadside sign: a yellow board with a red panel and a row of cream "price tag" cards.
 k.box(X-8,4.2,Z+F*7.9,9,1.8,.25,0xf6c445);k.box(X-8,4.25,Z+F*8.04,8.4,1.2,.04,0xb2302c);for(const x of [-11.5,-4.5])k.box(X+x,2.6,Z+F*7.9,.25,3.2,.25,0x6d6d64);
 for(let i=0;i<5;i++)k.box(X-11.6+i*1.75,4.25,Z+F*8.08,1.1,.6,.03,0xfff4d8);
 k.add(new THREE.SphereGeometry(.5,10,8),{x:X-2.6,y:4.6,z:Z+F*7.95,color:0xf6c445});k.add(new THREE.SphereGeometry(.18,8,6),{x:X-2.6,y:5.2,z:Z+F*7.95,color:0x7ed957});
 const live=new Set(unsold);for(const spot of lotLayout()){if(!live.has(spot.id))continue;const car=LOT_CARS.find(c=>c.id===spot.id);addCarBody(k,car.body,car.color,car.trim,{ox:spot.x,oz:spot.z,angle:spot.angle});k.box(spot.x,1.9+(car.body==='icecream'?.9:car.body==='sprinter'?-.6:0),spot.z-.4,.9,.35,.04,0xfff4d8);}
 return k.build();
}
export function createLot(scene,unsold){
 const mesh=new THREE.Mesh(buildLotGeometry(unsold),CAR_MATERIAL);mesh.name="Lucky Lou's lot";mesh.castShadow=true;mesh.receiveShadow=true;scene.add(mesh);
 return {mesh,refresh(list){mesh.geometry.dispose();mesh.geometry=buildLotGeometry(list);}};
}

// Skid marks: one InstancedMesh ring buffer. Old marks shrink away. One draw call.
export function createSkidMarks(scene,capacity=60){
 const geo=new THREE.PlaneGeometry(.26,.7);geo.rotateX(-Math.PI/2);
 const mat=new THREE.MeshBasicMaterial({color:0x151617,transparent:true,opacity:.5,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2});
 const mesh=new THREE.InstancedMesh(geo,mat,capacity);mesh.name='Skid marks';mesh.frustumCulled=false;mesh.count=0;mesh.renderOrder=1;scene.add(mesh);
 const marks=Array.from({length:capacity},()=>({x:0,y:0,z:0,a:0,age:Infinity}));let next=0,live=0;const o=new THREE.Object3D();
 const write=(i)=>{const m=marks[i],k=Math.max(0,1-m.age/24);o.position.set(m.x,m.y,m.z);o.rotation.set(0,m.a,0);o.scale.setScalar(k>0?.35+.65*Math.min(1,k*3):0);o.updateMatrix();mesh.setMatrixAt(i,o.matrix);};
 return {mesh,capacity,
  add(x,y,z,a){const m=marks[next];m.x=x;m.y=y+.025;m.z=z;m.a=a;m.age=0;write(next);next=(next+1)%capacity;live=Math.min(capacity,live+1);mesh.count=live;mesh.instanceMatrix.needsUpdate=true;},
  update(dt){let dirty=false;for(let i=0;i<live;i++){const m=marks[i];if(m.age>=24)continue;const before=Math.floor(m.age);m.age+=dt;if(Math.floor(m.age)!==before||m.age>=24){write(i);dirty=true;}}if(dirty)mesh.instanceMatrix.needsUpdate=true;},
  get live(){return marks.filter(m=>m.age<24).length;}};
}

// Engine and tyre audio: two detuned oscillators through a low-pass filter follow the RPM;
// a filtered noise loop screeches with the skid amount. Silent until a context exists.
export function createEngineAudio(ctx,destination){
 if(!ctx||typeof ctx.createOscillator!=='function')return {update(){},stop(){},live:false};
 const out=ctx.createGain();out.gain.value=0;out.connect(destination||ctx.destination);
 const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=600;filter.Q.value=3;filter.connect(out);
 const a=ctx.createOscillator(),b=ctx.createOscillator();a.type='sawtooth';b.type='square';b.detune.value=-1200;const bg=ctx.createGain();bg.gain.value=.35;a.connect(filter);b.connect(bg);bg.connect(filter);a.start();b.start();
 const len=ctx.sampleRate||44100,buf=ctx.createBuffer(1,len,len),data=buf.getChannelData(0);for(let i=0;i<len;i++)data[i]=Math.random()*2-1;
 const noise=ctx.createBufferSource();noise.buffer=buf;noise.loop=true;const band=ctx.createBiquadFilter();band.type='bandpass';band.frequency.value=1700;band.Q.value=4;const sk=ctx.createGain();sk.gain.value=0;noise.connect(band);band.connect(sk);sk.connect(destination||ctx.destination);noise.start();
 let alive=true;
 return {live:true,update({rpm=900,throttle=0,skid=0,on=true,volume=1}={}){if(!alive)return;const t=ctx.currentTime,hz=22+rpm/60*1.1;a.frequency.setTargetAtTime(hz,t,.05);b.frequency.setTargetAtTime(hz,t,.05);filter.frequency.setTargetAtTime(300+rpm*.35+Math.abs(throttle)*500,t,.08);out.gain.setTargetAtTime(on?(.025+Math.abs(throttle)*.03)*volume:0,t,.1);sk.gain.setTargetAtTime(on?skid*.05*volume:0,t,.05);},
  stop(){if(!alive)return;alive=false;try{a.stop();b.stop();noise.stop();out.disconnect();sk.disconnect();}catch{}}};
}
