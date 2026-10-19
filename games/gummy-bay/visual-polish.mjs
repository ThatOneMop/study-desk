import * as THREE from './vendor/three.module.min.js';
// Original geometry, shared materials; no gameplay state or collisions modified.
export function createVisualPolish({scene,camera,homes,buildings,reflectionMap}){
 const M={metal:new THREE.MeshStandardMaterial({color:0x91a5a6,roughness:.36,metalness:.65,envMap:reflectionMap}),paint:new THREE.MeshStandardMaterial({color:0x365c61,roughness:.48,metalness:.15}),wood:new THREE.MeshStandardMaterial({color:0x8d765a,roughness:.92}),cream:new THREE.MeshStandardMaterial({color:0xc9c1a8,roughness:.9}),dark:new THREE.MeshStandardMaterial({color:0x303b3c,roughness:.8}),gummy:new THREE.MeshStandardMaterial({color:0xd8a850,roughness:.24}),lamp:new THREE.MeshStandardMaterial({color:0xffdf9c,emissive:0xffd18c,emissiveIntensity:.65})};
 const geo=new Map();
 function box(parent,x,y,z,w,h,d,material){const key=[w,h,d].join();if(!geo.has(key))geo.set(key,new THREE.BoxGeometry(w,h,d));const m=new THREE.Mesh(geo.get(key),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 function tube(parent,x,y,z,r,h,material){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,12),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 const workshops=homes.map(h=>{const g=new THREE.Group();g.position.set(h.x,0,h.z);scene.add(g);g.visible=false;
  // Hardware stays within the existing worktable footprint.
  box(g,7,1.32,3,4.15,.06,1.35,M.metal);
  for(const x of [5.2,8.8])for(const z of [2.55,3.45]){box(g,x,.64,z,.13,1.24,.13,M.dark);box(g,x,.06,z,.23,.08,.23,M.dark);}
  box(g,7,.35,3,3.6,.06,.9,M.wood);
  // Moulding tray has individual recesses and a raised perimeter.
  box(g,6.1,1.37,3,1.35,.04,.92,M.dark);
  for(let i=0;i<12;i++)box(g,5.67+(i%4)*.28,1.40,2.72+Math.floor(i/4)*.26,.22,.025,.20,M.metal);
  const sealer=new THREE.Group();g.add(sealer);
  // Compact bag sealer with raised lever and output platform.
  box(sealer,8,1.43,3,.9,.16,.7,M.paint);box(sealer,8,1.54,3.12,.82,.06,.1,M.metal);
  const lever=box(sealer,8,1.68,2.87,.85,.08,.12,M.dark);box(sealer,8.38,1.56,2.78,.09,.23,.1,M.metal);
  const indicator=box(sealer,7.69,1.53,3.24,.06,.035,.06,M.lamp);
  // Physical sign posts and backboards support the existing stage labels.
  for(const [x,z,w,y]of [[6.1,2.4,2,2.25],[7.9,2.4,1.4,2.25],[-1.8,4,1.5,2.45]]){box(g,x,y,z-.035,w+.08,.56,.055,M.dark);box(g,x,y-.55,z-.05,.045,.65,.045,M.metal);}
  return {g,lever,indicator,sealer};
 });
 const exterior=new THREE.Group();scene.add(exterior);

 for(const [i,b]of buildings.entries()){
  const z=b.z+b.d/2;
  // Wall-mounted entrance lamps, address plaques and projecting brackets.
  const x=b.x+b.w*.23;
  box(exterior,x,2.65,z+.33,.32,.48,.16,M.dark);box(exterior,x,2.64,z+.43,.22,.31,.045,M.lamp);
  box(exterior,b.x-b.w*.23,1.65,z+.21,.36,.25,.055,M.paint);
  // Distinct rooftop ventilation units, kept behind the facade.
  if(i%2===0){box(exterior,b.x+b.w*.28,4.05,b.z,.95,.45,.9,M.metal);for(let j=0;j<4;j++)box(exterior,b.x+b.w*.28-.3+j*.2,4.29,b.z,.055,.02,.7,M.dark);}
 }
 // Task-specific first-person bowl, contents, mould and ingredient container.
 const rig=new THREE.Group();camera.add(rig);rig.visible=false;
 const bowl=tube(rig,-.18,-.34,-1.04,.17,.12,M.metal),contents=tube(rig,-.18,-.275,-1.04,.145,.012,M.gummy);
 const container=new THREE.Group();container.position.set(.21,-.10,-1.04);rig.add(container);tube(container,0,0,0,.055,.18,M.paint);tube(container,0,.105,0,.025,.035,M.metal);
 // Open rim gives the bowl a readable hollow silhouette instead of a solid drum.
 const rim=new THREE.Mesh(new THREE.TorusGeometry(.16,.015,6,20),M.metal);rim.rotation.x=Math.PI/2;rim.position.set(-.18,-.273,-1.04);rig.add(rim);
 const stream=tube(rig,0,0,0,.008,1,M.gummy);stream.visible=false;
 const spout=new THREE.Vector3(),destination=new THREE.Vector3(-.18,-.27,-1.04),direction=new THREE.Vector3(),up=new THREE.Vector3(0,1,0);
 const mould=new THREE.Group();rig.add(mould);
 box(mould,0,-.35,-1.04,.53,.035,.34,M.dark);
 const cavities=[];for(let i=0;i<6;i++){const x=-.16+(i%3)*.16,z=-1.12+Math.floor(i/3)*.16;
  box(mould,x,-.325,z,.125,.018,.125,M.metal);
  const sweet=box(mould,x,-.31,z,.09,.024,.09,M.gummy);cavities.push(sweet);
 }
 const packing=new THREE.Group();rig.add(packing);
 // Same teal housing and metal feed deck as the world sealer.
 box(packing,.13,-.395,-1.04,.48,.08,.40,M.paint);
 box(packing,.13,-.35,-1.04,.45,.018,.38,M.metal);
 box(packing,.34,-.28,-1.16,.035,.18,.06,M.paint);

 const packet=box(packing,.13,-.34,-1.02,.32,.014,.32,M.cream);
 const packSweet=box(packing,-.27,-.30,-1.02,.14,.07,.14,M.gummy);
 const foldA=box(packing,-.035,-.326,-1.02,.15,.014,.32,M.cream);
 const foldB=box(packing,.295,-.326,-1.02,.15,.014,.32,M.cream);
 const seal=box(packing,.13,-.22,-1.16,.34,.04,.045,M.metal);
 const band=box(packing,.13,-.30,-1.02,.07,.012,.28,M.paint);
 const paddle=box(rig,-.18,-.22,-1.04,.025,.25,.035,M.wood);
 rig.traverse(o=>{if(!o.isMesh)return;o.material=o.material.clone();o.material.depthTest=false;o.castShadow=false;o.receiveShadow=false;o.renderOrder=52;});
 function update({active,state,task,held,now,near,quality,productColor=0xd8a850}){
  for(const [i,w]of workshops.entries()){
   w.g.visible=!!(active&&state.room&&state.house===i);
   w.sealer.visible=!!state.packStation;
   w.lever.rotation.x=task?.k==='pack'&&held?-.25:0;
   w.indicator.material=state.wrappers>0?M.lamp:M.dark;
  }
  exterior.visible=quality!=='performance';
  rig.visible=!!active&&!!task&&['mix','make','pack','prepare','water','fill'].includes(task.k);
  for(const o of [stream,rim,bowl,contents,paddle,container,mould,packing])o.visible=false;
  if(!rig.visible)return;
  const k=task.k,step=task.step||0;
  for(const o of [contents,packSweet,...cavities])o.material.color.set(productColor);
  const limit=k==='mix'?[1,300,1.1][step]:k==='make'?[240,1][step]:k==='pack'?[180,.9][step]:1;
  const progress=Math.max(0,Math.min(1,(task.progress||0)/(limit||1)));
  if(k==='pack'){
   packing.visible=true;
   packSweet.position.x=step===0?-.27+progress*.4:.13;
   packSweet.visible=step===0||progress<.45;
   foldA.rotation.z=step===1?-progress*Math.PI*.48:0;
   foldB.rotation.z=step===1?progress*Math.PI*.48:0;
   foldA.position.y=foldB.position.y=-.326+(step===1?progress*.035:0);
   seal.position.y=step===1?-.22-progress*.08:-.22;
   band.visible=step===1&&progress>.8;
   return;
  }
  if(k==='make'){
   mould.visible=true;
   for(let i=0;i<cavities.length;i++){cavities[i].visible=step>0||progress>(i+.5)/6;cavities[i].scale.y=1;}
   return;
  }
  const mixing=k==='mix',pourMould=mixing&&step===2;
  bowl.visible=contents.visible=rim.visible=mixing;
  mould.visible=pourMould;
  for(const sweet of cavities){sweet.visible=pourMould&&progress>0;sweet.scale.y=Math.max(.04,progress);}
  bowl.position.x=contents.position.x=rim.position.x=pourMould?-.31:-.18;
  bowl.position.y=pourMould?-.16:-.34;contents.position.y=rim.position.y=pourMould?-.095:-.275;
  bowl.rotation.z=contents.rotation.z=rim.rotation.z=pourMould&&held?-.7:0;
  contents.scale.y=pourMould?Math.max(.05,1-progress):1;
  paddle.visible=mixing&&step===1;
  paddle.position.x=-.18+(held?Math.sin(now*7)*.07:0);
  paddle.position.z=-1.04+(held?Math.cos(now*7)*.07:0);
  container.visible=!mixing||step===0;
  const pouring=held&&(container.visible||pourMould);
  container.position.set(pouring?-.24:.21,pouring?-.04:-.10,-1.04);
  container.rotation.z=pouring?2.15:0;
  if(pouring){
   if(pourMould){spout.set(-.19,-.10,-1.04);destination.set(-.04,-.30,-1.04);}
   else{container.updateMatrix();spout.set(0,.125,0).applyMatrix4(container.matrix);destination.set(-.18,-.27,-1.04);}
   direction.subVectors(destination,spout);stream.visible=true;
   stream.position.copy(spout).add(destination).multiplyScalar(.5);stream.scale.y=direction.length();
   stream.quaternion.setFromUnitVectors(up,direction.normalize());
   stream.material.color.set(k==='water'||k==='fill'?0x78bbd5:productColor);
  }
 }
 return {update,workshops,exterior,rig,stream,mould,packing,packSweet,cavities};
}
