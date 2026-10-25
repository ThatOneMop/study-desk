// V11 visual layer. Save data, world extents, collider arrays and gameplay are unchanged.
const visualActors=[];
let citizenAssetStatus='loading';
function cloneRig(source){
 const copy=source.clone(true),map=new Map();
 function pair(a,b){map.set(a,b);for(let i=0;i<a.children.length;i++)pair(a.children[i],b.children[i]);}
 pair(source,copy);
 source.traverse(original=>{if(!original.isSkinnedMesh)return;const mesh=map.get(original);mesh.skeleton=original.skeleton.clone();mesh.skeleton.bones=original.skeleton.bones.map(b=>map.get(b));mesh.bind(mesh.skeleton,original.bindMatrix.clone());});
 return copy;
}
function installCitizen(gltf,variant=0){
 for(const g of avatars){
  if(g.userData.id%3!==variant)continue;
  const body=cloneRig(gltf.scene),palette=g.userData.palette||{};
  const isCop=!!g.userData.cop,originalChildren=[...g.children];
  const variants=new Map();
  body.traverse(o=>{if(!o.isMesh)return;o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;
   const tint=m=>{if(variants.has(m))return variants.get(m);const v=m.clone();
    if(v.name==='Skin')v.color.set(palette.skin||0xc58f6c);
    if(v.name==='Shirt')v.color.set(isCop?0x243c58:palette.color||0x497d89);
    if(v.name==='Hair')v.color.set(palette.hair||0x46312d);
    v.roughness=Math.max(v.roughness,.65);variants.set(m,v);return v;};
   o.material=Array.isArray(o.material)?o.material.map(tint):tint(o.material);
  });
  // Hide fallback only after a complete, valid asset is ready.
  originalChildren.forEach(o=>o.visible=false);g.add(body);
  const mixer=new THREE.AnimationMixer(body),actions={};
  for(const clip of gltf.animations)actions[clip.name]=mixer.clipAction(clip);
  const head=body.getObjectByName('Head');
  if(head){head.scale.set(1+(g.userData.id%3-1)*.035,1,1+(g.userData.id%2)*.025);
   // Accessories attach to the actual animated head bone; local Y follows the bone.
   if(isCop){let cap=new THREE.Mesh(new THREE.CylinderGeometry(.35,.38,.11,12),mat(0x233b56));cap.position.set(0,.72,-.02);head.add(cap);let brim=new THREE.Mesh(new THREE.BoxGeometry(.48,.22,.04),mat(0x192b40));brim.position.set(0,.66,-.33);head.add(brim);}
  }
  actions.Idle?.play();visualActors.push({g,body,mixer,actions,current:'Idle',previous:g.position.clone(),speed:0});
 }
 citizenAssetStatus='ready';
}
const citizenLoads=[false,false,false];
if(typeof GLTFLoader!=='undefined')for(let variant=0;variant<3;variant++)new GLTFLoader().load('./assets/citizen-v11'+(variant?'-'+variant:'')+'.glb',gltf=>{
 if(!gltf.animations.some(a=>a.name==='Walk')||!gltf.scene.getObjectByProperty('isSkinnedMesh',true)){citizenAssetStatus='partial';return;}
 installCitizen(gltf,variant);citizenLoads[variant]=true;citizenAssetStatus=citizenLoads.every(Boolean)?'ready':'partial';
},undefined,e=>{citizenAssetStatus='partial';console.warn('Citizen asset unavailable; retaining previous characters.',e);});
function actorAnimation(a,dt){
 const moved=a.g.position.distanceTo(a.previous);a.previous.copy(a.g.position);
 const speed=dt>0&&moved<3?moved/dt:0;a.speed+=(speed-a.speed)*Math.min(1,dt*14);
 let desired=a.speed>.08?(a.speed>2.1?'Run':'Walk'):'Idle';
 const index=officers.indexOf(a.g),police=s.police;
 if(index>=0&&police?.search&&police.officers[index]?.target===police.search.role&&a.g.position.distanceTo(police.search.role===localPoliceRole()?player:other.position)<4)desired='Search';
 else if(index>=0&&police?.officers[index]?.mode==='stop')desired='Talk';
 else if(a.g===other&&police?.search&&police.search.role!==localPoliceRole())desired='Surrender';
 else if(a.speed<.08&&!isNaN(a.g.userData.id)&&!people.includes(a.g)&&index<0&&a.g!==other&&a.g.position.distanceTo(player)<20&&Math.floor(now/9+a.g.userData.id)%4===0)desired='Work';
 else if(a.speed<.08&&['customer','thread','dealer','hardware','store','helpers','property','reception'].includes(panel)&&a.g.position.distanceTo(player)<5)desired='Talk';
 if(desired!==a.current&&a.actions[desired]){a.actions[a.current]?.fadeOut(.18);a.actions[desired].reset().fadeIn(.18).play();a.current=desired;}
 const action=a.actions[a.current];if(action)action.timeScale=desired==='Walk'?Math.max(.25,Math.min(2.4,a.speed/1.2)):desired==='Run'?Math.max(.6,Math.min(2,a.speed/3.4)):1;
 a.mixer.update(dt);const blinkPhase=(now+a.g.userData.id*.61)%5.2;const blink=blinkPhase>4.95?Math.sin((blinkPhase-4.95)/.25*Math.PI):0;a.body.traverse(o=>{if(o.morphTargetDictionary?.Blink!==undefined)o.morphTargetInfluences[o.morphTargetDictionary.Blink]=blink;});
}
let visualPrevious=performance.now();
const visualRender=renderFrame;
renderFrame=function(){
 const t=performance.now(),dt=Math.max(0,Math.min(.08,(t-visualPrevious)/1000));visualPrevious=t;
 for(const a of visualActors){const distance=a.g.position.distanceTo(camera.position);a.body.visible=distance<(quality==='performance'?75:125);if(a.body.visible)actorAnimation(a,dt);else a.previous.copy(a.g.position);}
 if(visualTown)for(const chunk of visualTown.children){const c=chunk.userData.center;if(c)chunk.visible=camera.position.distanceTo(c)<(quality==='performance'?145:quality==='high'?280:210)+chunk.userData.radius;}
 visualRender();
};
// Quality-independent palette; no post-processing is required for readable materials.
const visualUpdate=update;update=function(dt){visualUpdate(dt);
 if(active){const daylight=Math.max(0,Math.sin((s.time-360)/1440*Math.PI*2));sun.intensity=.18+daylight*2.5;hemi.intensity=.48+daylight*.78;}
};

let equipmentAssetStatus='loading';
if(typeof GLTFLoader!=='undefined')new GLTFLoader().load('./assets/equipment-v11.glb',gltf=>{
 const tent=gltf.scene.getObjectByName('Tent'),mixer=gltf.scene.getObjectByName('Mixer'),phone=gltf.scene.getObjectByName('Payphone');
 if(!tent||!mixer||!phone){equipmentAssetStatus='failed';return;}
 gltf.scene.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
 tents.forEach((g,i)=>{for(const child of [...g.children])if(child!==plantVisuals[i])g.remove(child);g.add(tent.clone(true));});
 mixers.forEach(g=>{g.clear();g.add(mixer.clone(true));});
 for(const o of [...scene.children])if(o.isMesh&&Math.abs(o.position.x+47)<.7&&Math.abs(o.position.z-29)<.65&&o.position.y>0&&o.position.y<3.1)scene.remove(o);
 const model=phone.clone(true);model.position.set(-47,0,29);scene.add(model);equipmentAssetStatus='ready';
},undefined,e=>{equipmentAssetStatus='failed';console.warn('Equipment retains previous artwork',e);});

