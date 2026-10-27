// v173: packaging feel. Finished packs physically land on the packing table as a growing stack: loose
// baggies in short piles, and every four packs boxed into a lidded jar. Each new pack drops in with a
// bounce, a puff of sugar sparkles and a crinkle/thud, staggered so a batch of four lands one by one.
// Original code; one InstancedMesh per shape plus one Points burst (4 draw calls, all on the same table).
export const BAG={w:.15,h:.032,d:.19},JAR={r:.075,h:.17},PER_JAR=4,MAX_JARS=6,MAX_BAGS=PER_JAR-1,LAND_TIME=.32,STAGGER=.12,BURST=18;
// Layout for n finished packs: whole jars first (two columns), then the loose remainder as a baggie pile.
export function stackLayout(n,origin={x:0,y:0,z:0}){
 const total=Math.max(0,Math.floor(Number(n)||0)),jars=Math.min(MAX_JARS,Math.floor(total/PER_JAR)),bags=Math.min(MAX_BAGS,total-jars*PER_JAR<0?0:total-jars*PER_JAR);
 const out={total,jars:[],bags:[],hidden:Math.max(0,total-jars*PER_JAR-bags)};
 for(let i=0;i<jars;i++){const col=i%2,row=Math.floor(i/2);out.jars.push({x:origin.x+.07-col*.16,y:origin.y+JAR.h/2,z:origin.z-.34+row*.17,i});}
 for(let i=0;i<bags;i++)out.bags.push({x:origin.x+.02+(i%2?.012:-.01),y:origin.y+BAG.h/2+i*BAG.h,z:origin.z+.34,rot:(i*.37)%.5-.25,i});
 return out;
}
// Drop height over time: falls from 0.32 m and settles with two small bounces.
export function landingOffset(t){
 if(!(t>0))return .32;if(t>=LAND_TIME)return 0;const u=t/LAND_TIME;
 if(u<.6){const k=u/.6;return .32*(1-k*k);}if(u<.85){const k=(u-.6)/.25;return .035*Math.sin(k*Math.PI);}return .01*Math.sin((u-.85)/.15*Math.PI);
}
// Deterministic sparkle burst: unit directions with an upward bias.
export function burstVelocities(seed=1,count=BURST){
 let h=(seed*2654435761)>>>0;const r=()=>(h=Math.imul(h^(h>>>15),2246822519)>>>0,(h>>>0)/4294967296);const v=[];
 for(let i=0;i<count;i++){const a=r()*Math.PI*2,s=.35+r()*.5;v.push({x:Math.cos(a)*s,y:.9+r()*.9,z:Math.sin(a)*s});}return v;
}
// Which new items are landing: each pack added gets its own start time, so a batch lands one by one.
export function queueLandings(prev,next,clock,queue=[]){
 const added=Math.max(0,Math.min(8,(next|0)-(prev|0)));const last=queue.length?queue[queue.length-1].at:clock-STAGGER;
 for(let i=0;i<added;i++)queue.push({at:Math.max(clock,last+STAGGER*(i+1)),index:(prev|0)+i,landed:false});return queue;
}
export function createPackStack(THREE,scene){
 const mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:.55,metalness:0,flatShading:true});
 const bagMat=mat(0xffffff);bagMat.transparent=true;bagMat.opacity=.88;
 const bags=new THREE.InstancedMesh(new THREE.BoxGeometry(BAG.w,BAG.h,BAG.d),bagMat,MAX_BAGS);
 const jarMat=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.18,metalness:0,transparent:true,opacity:.82});
 const jars=new THREE.InstancedMesh(new THREE.CylinderGeometry(JAR.r,JAR.r*.94,JAR.h,10),jarMat,MAX_JARS);
 const lids=new THREE.InstancedMesh(new THREE.CylinderGeometry(JAR.r*1.04,JAR.r*1.04,.03,10),mat(0x2b2f33),MAX_JARS);
 const pts=new Float32Array(BURST*3),geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pts,3));
 const burst=new THREE.Points(geo,new THREE.PointsMaterial({color:0xfff2b8,size:.035,transparent:true,opacity:.95,depthWrite:false}));burst.visible=false;burst.frustumCulled=false;
 for(const m of [bags,jars,lids]){m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);m.count=0;m.castShadow=false;m.receiveShadow=true;m.frustumCulled=false;scene.add(m);}
 scene.add(burst);bags.name='PackStackBags';jars.name='PackStackJars';
 const o=new THREE.Object3D(),col=new THREE.Color();let fx=null;
 function draw(layout,color=0x98bd64,drops={}){
  bags.count=layout.bags.length;jars.count=layout.jars.length;lids.count=layout.jars.length;
  layout.bags.forEach((b,i)=>{o.position.set(b.x,b.y+(drops['b'+i]||0),b.z);o.rotation.set(0,b.rot,0);o.scale.set(1,1,1);o.updateMatrix();bags.setMatrixAt(i,o.matrix);bags.setColorAt(i,col.setHex(color).lerp(new THREE.Color(0xffffff),.35));});
  layout.jars.forEach((j,i)=>{const dy=drops['j'+i]||0;o.rotation.set(0,0,0);o.position.set(j.x,j.y+dy,j.z);o.updateMatrix();jars.setMatrixAt(i,o.matrix);jars.setColorAt(i,col.setHex(color));o.position.set(j.x,j.y+JAR.h/2+.015+dy,j.z);o.updateMatrix();lids.setMatrixAt(i,o.matrix);});
  for(const m of [bags,jars,lids]){m.instanceMatrix.needsUpdate=true;if(m.instanceColor)m.instanceColor.needsUpdate=true;}
 }
 function pop(at,seed){fx={at,t:0,v:burstVelocities(seed)};burst.visible=true;}
 function tick(dt){if(!fx)return;fx.t+=dt;const t=fx.t;if(t>.7){burst.visible=false;fx=null;return;}
  fx.v.forEach((v,i)=>{pts[i*3]=fx.at.x+v.x*t*.5;pts[i*3+1]=fx.at.y+v.y*t*.5-2.2*t*t*.5;pts[i*3+2]=fx.at.z+v.z*t*.5;});geo.attributes.position.needsUpdate=true;burst.material.opacity=Math.max(0,1-t/.7);}
 function setVisible(v){bags.visible=jars.visible=lids.visible=v;if(!v)burst.visible=false;}
 return {bags,jars,lids,burst,draw,pop,tick,setVisible,drawCalls:4};
}
