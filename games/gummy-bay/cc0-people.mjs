// v160: CC0 rigged townsfolk (Quaternius "Ultimate Animated Character" style models via poly.pizza, CC0 1.0).
// Baked to one vertex-coloured, smooth-shaded primitive per model (see CREDITS.md), so each person is one draw call.
// The nearest people on screen borrow a rigged model; everyone else keeps the cheap instanced chunky cast.
export const CC0_PEOPLE_VARIANTS=Object.freeze(['man','woman','suit','sleeves','tank','dress','womancasual']);
export const CC0_POLICE_VARIANT='police';
export const CC0_PEOPLE_HEIGHT=1.74;
export const CC0_HEAD_SCALE=1.26;
export const CC0_GIRTH=1.1;
export const cc0Budget=quality=>quality==='performance'?10:quality==='high'?22:16;
export const cc0Range=quality=>quality==='performance'?34:quality==='high'?60:46;
const hash=n=>{let x=(Math.abs(Math.trunc(Number(n)||0))+1)*2654435761%4294967296;x^=x>>>15;return x>>>0;};
export const cc0Variant=(id,cop=false)=>cop?CC0_POLICE_VARIANT:CC0_PEOPLE_VARIANTS[hash(id)%CC0_PEOPLE_VARIANTS.length];
// Gameplay clips map onto the four CC0 clips; speed (m/s) chooses walk or run.
export function cc0Clip(clip=null,speed=0,pose=''){
 if(pose==='sit'||clip==='Sit')return 'Sit';
 if(clip==='Run')return 'Run';
 const moving=clip?clip==='Walk':(pose==='walk'||speed>.35);
 if(!moving)return 'Idle';
 return speed>3.4?'Run':'Walk';
}
export const cc0TimeScale=(clip,speed)=>clip==='Walk'?Math.max(.55,Math.min(1.7,(speed||1.3)/1.35)):clip==='Run'?Math.max(.7,Math.min(1.5,speed/4.6)):1;
// Pick who gets a rigged model: nearest first, skipping people behind the camera or out of range.
export function cc0Pick(candidates,camera,budget,range){
 if(!camera?.position)return [];
 const cx=camera.position.x,cz=camera.position.z;let fx=0,fz=-1;
 if(camera.getWorldDirection&&camera.isObject3D!==undefined){try{const d=camera.getWorldDirection(camera.position.clone());fx=d.x;fz=d.z;}catch(e){}}
 const out=[];
 for(const c of candidates){const dx=c.x-cx,dz=c.z-cz,d=Math.hypot(dx,dz);if(d>range)continue;if(d>3&&(dx*fx+dz*fz)<-2)continue;out.push([d,c]);}
 out.sort((a,b)=>a[0]-b[0]);
 return out.slice(0,budget).map(e=>e[1]);
}
function cloneSkinned(source){
 const copy=source.clone(true),map=new Map();
 const pair=(a,b)=>{map.set(a,b);for(let i=0;i<a.children.length;i++)pair(a.children[i],b.children[i]);};
 pair(source,copy);
 source.traverse(o=>{if(!o.isSkinnedMesh)return;const m=map.get(o);const sk=o.skeleton.clone();sk.bones=o.skeleton.bones.map(b=>map.get(b));m.bind(sk,o.bindMatrix.clone());});
 return copy;
}
export function createCc0People({THREE,scene,GLTFLoader,quality='balanced',base='./assets/people/',shadows=true}={}){
 const templates=new Map();let ready=false,failed=false,budget=cc0Budget(quality),range=cc0Range(quality);
 const slots=[];// {key,variant,models:Map(variant->{obj,mixer,actions,head}),current,clip}
 // Baked colours live in the glTF COLOR_0 attribute; a mesh without one keeps a plain material (never black).
 const material=new THREE.MeshStandardMaterial({roughness:.8,metalness:0}),painted=material.clone();painted.vertexColors=true;
 const names=[...CC0_PEOPLE_VARIANTS,CC0_POLICE_VARIANT];
 const loader=GLTFLoader?new GLTFLoader():null;
 const loaded=!loader?Promise.resolve():Promise.all(names.map(name=>new Promise(res=>{
  try{loader.load(base+'people-'+name+'.glb',g=>{
   g.scene.traverse(o=>{if(o.isMesh){o.material=o.geometry?.getAttribute?.('color')?painted:material;o.frustumCulled=false;o.castShadow=shadows;o.receiveShadow=false;}});
   g.scene.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(g.scene);
   templates.set(name,{scene:g.scene,clips:g.animations,height:Math.max(.01,box.max.y-box.min.y),floor:box.min.y});res();
  },undefined,()=>{failed=true;res();});}catch(e){failed=true;res();}
 }))).then(()=>{ready=templates.size>0;});
 const group=new THREE.Group();group.name='cc0-people';scene?.add(group);
 function model(slot,variant){
  if(slot.models.has(variant))return slot.models.get(variant);
  const t=templates.get(variant)||templates.get(CC0_PEOPLE_VARIANTS[0]);if(!t)return null;
  const obj=cloneSkinned(t.scene);const mixer=new THREE.AnimationMixer(obj);const actions={};
  for(const clip of t.clips)actions[clip.name]=mixer.clipAction(clip);
  let head=null;obj.traverse(o=>{if(o.isBone&&o.name==='Head')head=o;});
  const s=CC0_PEOPLE_HEIGHT/t.height;obj.userData.baseScale=s;obj.userData.floor=t.floor*s;
  obj.visible=false;group.add(obj);
  const entry={obj,mixer,actions,head,clip:null};slot.models.set(variant,entry);return entry;
 }
 function play(entry,clip,speed){
  const next=entry.actions[clip]||entry.actions.Idle;if(!next)return;
  if(entry.clip!==clip){const prev=entry.clip&&entry.actions[entry.clip];next.reset().play();if(prev&&prev!==next)prev.crossFadeTo(next,.22,false);else next.setEffectiveWeight(1);
   // Offset each person's cycle so a crowd never marches in step.
   if(!entry.clip)next.time=(entry.obj.id*.37)%Math.max(.1,next.getClip().duration);entry.clip=clip;}
  next.timeScale=cc0TimeScale(clip,speed);
 }
 // candidates: [{key,x,y,z,yaw,speed,clip,pose,variant,height,ref}] -> returns the refs that are now drawn as CC0 models.
 function update({dt=0,camera=null,candidates=[]}={}){
  const shown=new Set();
  if(!ready){return shown;}
  const picks=cc0Pick(candidates,camera,budget,range);
  const wanted=new Map(picks.map(c=>[c.key,c]));
  // keep stable slot ownership so animation never pops
  for(const slot of slots)if(slot.key!=null&&!wanted.has(slot.key)){for(const m of slot.models.values())m.obj.visible=false;slot.key=null;}
  for(const c of picks){
   let slot=slots.find(s=>s.key===c.key);
   if(!slot){slot=slots.find(s=>s.key==null);if(!slot){if(slots.length>=budget)continue;slot={key:null,models:new Map(),variant:null};slots.push(slot);}slot.key=c.key;}
   const entry=model(slot,c.variant||CC0_PEOPLE_VARIANTS[0]);if(!entry)continue;
   if(slot.variant!==c.variant)for(const [v,m] of slot.models)m.obj.visible=v===c.variant;
   slot.variant=c.variant;entry.obj.visible=true;
   const h=Number.isFinite(c.height)?c.height:1,s=entry.obj.userData.baseScale*h;
   entry.obj.scale.set(s*CC0_GIRTH,s,s*CC0_GIRTH);
   entry.obj.position.set(c.x,(c.y||0)-entry.obj.userData.floor*h,c.z);entry.obj.rotation.set(0,c.yaw||0,0);
   play(entry,cc0Clip(c.clip,c.speed,c.pose),c.speed||0);
   entry.mixer.update(Math.min(.1,Math.max(0,dt)));
   if(entry.head)entry.head.scale.setScalar(CC0_HEAD_SCALE);
   shown.add(c.ref??c.key);
  }
  return shown;
 }
 function setQuality(q){quality=q;budget=cc0Budget(q);range=cc0Range(q);}
 function drawCalls(){let n=0;for(const s of slots)for(const m of s.models.values())if(m.obj.visible)n++;return n;}
 return {group,update,setQuality,drawCalls,loaded,get ready(){return ready;},get failed(){return failed;},get budget(){return budget;},templates};
}
