const base=require('node:path').resolve(__dirname,'../dist')+'/';
const fs=require('fs'),vm=require('vm');
(async()=>{const real=await import(base+'vendor/three.module.min.js');const context2d=new Proxy({measureText(text){const size=Number(String(this.font).match(/ (\d+)px/)?.[1]??30);return {width:Array.from(text).reduce((n,c)=>n+(/[MW@]/u.test(c)?.95:/[ilI ’·/]/u.test(c)?.27:.59)*size,0)}},createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}})},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});const elements={};const element=()=>({style:{},dataset:{},setAttribute(){},appendChild(){},insertAdjacentHTML(){},classList:{toggle(){},remove(){}},hidden:false,innerHTML:'',value:'',textContent:'',getContext:()=>context2d,addEventListener(){},click(){},focus(){},select(){},requestPointerLock:()=>Promise.resolve(),setPointerCapture(){}});const document={body:{dataset:{},appendChild(){},classList:{toggle(){},remove(){}}},getElementById(id){return elements[id]||(elements[id]=element())},createElement:()=>element(),querySelector:()=>null,querySelectorAll:()=>[],addEventListener(){},exitPointerLock(){},pointerLockElement:null,activeElement:null};const storage=new Map();const localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};class Renderer{constructor(){this.shadowMap={}}setPixelRatio(){}setSize(){}render(){}}let perf=100;const events={};const pending=[];const {GLTFLoader:ActualLoader}=await import(base+'vendor/gltf-loader.js');class GLTFLoader{load(path,success,progress,failure){pending.push((async()=>{try{const b=fs.readFileSync(base+path);const g=await new ActualLoader().parseAsync(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'');success(g);}catch(e){failure?.(e);}})());}};const env={GLTFLoader,createEffects:()=>({render(){},resize(){},dispose(){}}),THREE:{...real,WebGLRenderer:Renderer},document,localStorage,window:{addEventListener(){}},innerWidth:1440,innerHeight:900,devicePixelRatio:1,requestAnimationFrame(){},addEventListener(n,f){(events[n]??=[]).push(f)},events,setTimeout(){},clearTimeout(){},console,Date,Math,Blob,URL,performance:{now:()=>perf},btoa:s=>Buffer.from(s).toString('base64'),atob:s=>Buffer.from(s,'base64').toString(),navigator:{}};for(const name of ['parcel-handling','parcel-finish','interaction-focus','fleet','arrival-workplace','island-neighborhoods','street-hats','gritty-terrain','gritty-streets','resident-rounding','patrol-expansion','payphone-detail','graphics-atmosphere','graphics-architecture','graphics-landscape','graphics-life','graphics-surfaces','workshop-state','workshop-logistics','business-core','presentation','visual-polish','town-experience','town-collision','player-controller','spatial-hash','spawn-safety','coastal-backdrop','district-horizon','town-skyline','junction-reveals','night-silhouettes','overhead-infrastructure','town-fencing','foreground-depth','domestic-workplace','doorway-reveals','window-connections','ordinary-unusual-work','public-service-fronts','narrow-alleys','shop-approaches','logical-wear','object-silhouettes','production-containers','occupational-outfits','resident-accessories','resident-expressions','chunky-cast','street-crowd','resident-proportions','resident-clothing','resident-life','resident-animation','tactile-work','bench-mode','station-readiness','stock-display','customer-context','customer-craving','gameplay-feed','starter-sale','police-notice','sale-shield','police-vision','police-ladder','hide-spots','witness-call','pocket-slip','scuffle','sugar-bribe','busted','squad-cast','mix-bench','mix-core','mix-pantry','mix-risk','staff-status','field-crew','sim-clock','prop-motion','vehicle-access','exchange-access','point-access','police-feedback','workshop-move','signage','equipment-guide','world-lighting','atmospheric-distance','scruffy-welcome','exchange-gesture','player-view','rv-support','town-surfaces','police-lighting','window-lighting','furniture-access','tent-access','location-memory','journey-progress','coop-ping','coop-activity','progression-portrait','delivery-round','phone-device','phone-contacts','hud-readout','shop-counter','phone-apps','road-zones','parking-guide','district-architecture','street-construction','vertical-town','contextual-street-props','starter-street','opening-shot','post-stack','hud-s1','skateboard','cinematics','loading-flyover','hints','sky-clouds','story-act1','city-expansion','city-shells','police-penalty','xp-curve','reach-gate','arcade-core','arcade-ui'])Object.assign(env,await import(base+name+'.mjs'));env.workshopStageStatus=env.stationStatus;vm.createContext(env);vm.runInContext(fs.readFileSync(base+'game.js','utf8').replace(/^import .*?;\n/gm,''),env);await Promise.all(pending);vm.runInContext(`function check(v,msg){if(!v)throw Error(msg)}load('story',2,true);check(s.cash===400,'starting cash');
updateUI();check($('cash').textContent==='$400','cash HUD');
check(citizenAssetStatus==='ready','Blender characters loaded');
check(townAssetStatus==='ready','Blender town loaded');
for(const a of visualActors){prepareActorLOD(a);check(a.body.scale.x>=.80&&a.body.scale.x<=.90&&a.body.scale.y===.86,'bounded varied width, stable height');if(a.low)check(a.low.body.scale.x===a.high.body.scale.x,'LOD scale continuity');}
check(cargoBox.parent===crafterActor,'cargo attachment preserved');menu('craft');check(!$('modal').innerHTML.includes('undefined'),'workshop status projection');close();
menu('customer',0);check(document.body.dataset.panel==='customer','compact conversation state');close();check(document.body.dataset.panel==='','conversation close');
s.room=true;s.helpers.crafter=true;s.staffConfig.crafter.stock='stored';s.raw[0]=3;s.wrappers=3;update(.016);updateUI();
net.role='host';const packet=playerPacket();check(packet.worker&&Number.isFinite(packet.worker.x),'host worker packet');
net.role='guest';net.connected=true;net.remote=packet;net.workerSeenAt=performance.now();update(.016);check(crafterActor.visible,'guest sees worker');
net.connected=false;update(.016);check(!crafterActor.visible,'disconnect hides worker');
net.role='solo';net.connected=false;load('story',2,false);check(s.cash===400,'save reload');
close();s.can=true;s.packs[0]=2;s.packs[1]=1;
const stockBefore=JSON.stringify(s.packs);equipTool('packs');check(equippedTool==='packs','equip real stock');cycleCarriedPack();check(equippedStrain===1,'cycle owned flavour');check(JSON.stringify(s.packs)===stockBefore,'equipping conserves inventory');
s.packs[1]=0;renderFrame();check(equippedStrain===0,'empty flavour falls back');s.packs.fill(0);renderFrame();check(equippedTool===null&&!carriedPack.visible,'empty inventory lowers pack');
equipTool('can');renderFrame();check(watering.visible,'can visible when equipped');menu('bag');renderFrame();check(!watering.visible,'menu hides can');close();resetSystems();check(equippedTool===null,'slot reset clears equipment');
for(const [g,props] of residentProps){let parent=props.phone.parent;while(parent&&parent!==g)parent=parent.parent;check(parent===g&&props.cup.parent===props.phone.parent,'resident props remain within their character after asset install');}
net.role='solo';net.connected=false;load('story',3,true);player.set(-75,1.72,72);close();
const places=Object.values(PLACES);let routes=0;let routeStart=Date.now();
for(let i=0;i<CONTACTS.length;i++){
 let start=customerHomes[i];
 for(const time of [480,720,960,1200]){
  const target=residentPlan(i,time,customerHomes[i],false);check(!blocked(target.x,target.z),'clear destination '+i+' '+time);
  const path=citizenRoute(start,target,blocked);check(path&&path.length,'route '+i+' '+time);
  let from=start;for(const point of path){check(segmentClear(from,point,blocked),'clear route segment');from=point;}
  start=target;routes++;
 }
}
console.log('PASS: '+routes+' scheduled routes cross actual starter-town colliders; planning checks took '+(Date.now()-routeStart)+' ms in Node (not browser frame time).');
const person=CONTACTS[0];person.x=-7;person.z=21;const target=residentPlan(0,480,customerHomes[0]);customerPaths.clear();
let maxStep=0;for(let i=0;i<3000&&Math.hypot(person.x-target.x,person.z-target.z)>.12;i++){customerPathBudget=1;const old={x:person.x,z:person.z};moveCustomerTo(person,0,target,.06);const step=Math.hypot(person.x-old.x,person.z-old.z);maxStep=Math.max(maxStep,step);check(step<=.063001,'no teleport');check(!blocked(person.x,person.z),'never enters collider');}
check(Math.hypot(person.x-target.x,person.z-target.z)<=.12,'walk reaches motel');
s.deals=[{npc:0,t:0,qty:1,price:30}];check(planForResident(0).meeting,'order overrides routine');s.deals=[];
s.time=480;const actor=visualActors.find(a=>a.g===people[0]);actor.g.position.set(target.x,0,target.z);actor.previous.copy(actor.g.position);actor.speed=0;actor.g.userData.walking=false;actorAnimation(actor,.016);
const props=residentProps.get(actor.g);check(props.phone.parent===actor.body.getObjectByName('Hand1'),'phone follows animated hand');check(props.phone.visible,'phone at scheduled break');
camera.position.set(100,2,100);selectActorLOD(actor);actorAnimation(actor,.016);check(props.phone.parent===actor.body.getObjectByName('Hand1'),'phone follows LOD hand');
player.set(target.x,1.72,target.z+1.5);menu('customer',0);actorAnimation(actor,.016);check(!props.phone.visible,'prop lowered for conversation');close();
menu('phone');check($('modal').innerHTML.includes('Find in town'),'contact navigation');menu('deals');check($('modal').innerHTML.includes('Create listing'),'empty delivery action');
// Execute real GLTF clip selection, not a replacement animation stub.
close();const bystander=visualActors.find(a=>a.g===people[1]);
function idleConversationFixture(a){a.g.userData.walking=false;a.previous.copy(a.g.position);a.speed=0;a.mixer.stopAllAction();a.actions.Idle.reset().play();a.current='Idle';}
bystander.g.position.set(target.x+1,0,target.z);idleConversationFixture(actor);idleConversationFixture(bystander);
bystander.g.rotation.y=1.2;const bystanderYaw=bystander.g.rotation.y;
player.set(target.x,1.72,target.z+1.5);menu('customer',0);actorAnimation(actor,.016);actorAnimation(bystander,.016);
check(actor.current==='Talk','addressed customer uses talk clip');
check(bystander.current==='Idle','nearby unaddressed customer stays idle');
check(bystander.g.rotation.y===bystanderYaw,'bystander does not turn to unrelated conversation');
close();idleConversationFixture(actor);menu('thread',0);actorAnimation(actor,.016);
check(actor.current==='Idle','phone thread does not start nearby in-person talk');
check(props.phone.visible,'own phone routine remains visible during phone thread');
menu('bag');actorAnimation(actor,.016);check(props.phone.visible,'backpack does not interrupt resident phone routine');
menu('customer',0);actorAnimation(actor,.016);check(!props.phone.visible,'only actual in-person target lowers idle prop');
// An unrelated resident at their own scheduled destination keeps their prop.
close();const savedActorPosition=actor.g.position.clone(),savedContactPosition={x:person.x,z:person.z};
s.time=960;const bystanderPlan=planForResident(1);bystander.g.position.set(bystanderPlan.x,0,bystanderPlan.z);idleConversationFixture(bystander);
person.x=bystanderPlan.x+1;person.z=bystanderPlan.z;actor.g.position.set(person.x,0,person.z);idleConversationFixture(actor);
player.set(bystanderPlan.x,1.72,bystanderPlan.z+1.5);check(customerExchangeStatus(0).ok,'clear adjacent resident fixture');menu('customer',0);actorAnimation(bystander,.016);
check(residentProps.get(bystander.g).phone.visible,'nearby bystander retains own phone routine during conversation');
close();s.time=480;Object.assign(person,savedContactPosition);actor.g.position.copy(savedActorPosition);
// Exercise all 13 authored vendors, including counters and the expanded town.
const vendorPoints=points.filter(p=>p.actor&&p.type!=='customer');check(vendorPoints.length===16,'all original, district and three neighbourhood vendors explicitly associated');
function visitConversationPoint(p){let found=false;for(let dx=-2;dx<=2&&!found;dx+=.5)for(let dz=-2;dz<=2;dz+=.5){const pose={x:p.x+dx,y:1.72+floorHeight(p.x+dx,p.z+dz),z:p.z+dz};if(pointApproach(pose,p,blocked,floorHeight,3)){player.set(pose.x,pose.y,pose.z);found=true;break;}}check(found,'clear actual vendor approach '+p.label);}
for(const p of vendorPoints){
 close();visitConversationPoint(p);near=p;const vendor=visualActors.find(a=>a.g===p.actor);check(!!vendor,'vendor GLTF loaded');idleConversationFixture(vendor);
 now=((4-vendor.g.userData.id%4)%4)*9;act();check(conversationPoint===p,'actual interaction selects exact authored vendor '+p.label);
 vendor.g.rotation.y=Math.atan2(player.x-vendor.g.position.x,player.z-vendor.g.position.z)+1;const facingBefore=vendor.g.rotation.y;
 actorAnimation(vendor,.016);check(vendor.current==='Talk','talk overrides scheduled work gesture '+p.label);check(vendor.g.rotation.y!==facingBefore,'addressed vendor turns toward player');
 menu(p.type);check(conversationPoint===p,'vendor menu refresh retains addressed actor');
 net.role='guest';net.connected=false;actorAnimation(vendor,.016);check(vendor.current==='Work','disconnected guest releases vendor conversation');net.role='solo';actorAnimation(vendor,.016);check(vendor.current==='Talk','local vendor conversation restored');
 const poseBefore=vendor.g.position.clone();camera.position.copy(vendor.g.position);selectActorLOD(vendor);actorAnimation(vendor,.016);
 const talkTime=vendor.actions.Talk.time;camera.position.copy(vendor.g.position).addScalar(100);selectActorLOD(vendor);
 check(vendor.body===vendor.low.body&&vendor.current==='Talk'&&vendor.actions.Talk.time===talkTime,'talk clip time survives low LOD switch');
 actorAnimation(vendor,.016);const lowTalkTime=vendor.actions.Talk.time;camera.position.copy(vendor.g.position);selectActorLOD(vendor);
 check(vendor.body===vendor.high.body&&vendor.actions.Talk.time===lowTalkTime,'talk clip time survives high LOD switch');check(vendor.g.position.equals(poseBefore),'conversation does not move actor');
 close();actorAnimation(vendor,.016);check(vendor.current==='Work','closing returns vendor to independent work gesture');
 menu('thread',0);actorAnimation(vendor,.016);check(vendor.current==='Work','phone does not replace vendor work with talk');
 player.set(200,1.72,80);menu(p.type);actorAnimation(vendor,.016);check(!conversationPoint&&vendor.current==='Idle','remote menu cannot address vendor');
}
// Range, obstruction, eye-height, driving and guest state remain authoritative.
close();player.set(target.x,1.72,target.z+1.5);person.x=target.x;person.z=target.z;actor.g.position.set(target.x,0,target.z);idleConversationFixture(actor);menu('customer',0);
const beforeConversationState=JSON.stringify(s),beforeConversationSaves=Array.from({length:6},(_,i)=>localStorage.getItem('gummybay-v3-'+(i<3?'story':'free')+'-'+(i%3+1))).join('|');
for(let i=0;i<200;i++)actorAnimation(actor,.016);
check(JSON.stringify(s)===beforeConversationState,'animation presentation does not mutate business state');check(Array.from({length:6},(_,i)=>localStorage.getItem('gummybay-v3-'+(i<3?'story':'free')+'-'+(i%3+1))).join('|')===beforeConversationSaves,'animation does not write personal slots');
const conversationWall={x:target.x,z:target.z+.75,w:2,d:.2};colliders.push(conversationWall);actorAnimation(actor,.016);check(actor.current==='Idle'&&props.phone.visible,'new obstruction releases talk and idle prop');check(colliders.pop()===conversationWall,'remove conversation obstruction');
player.y=9;actorAnimation(actor,.016);check(actor.current==='Idle','wrong eye height cannot keep in-person talk');player.y=1.72;driving=true;actorAnimation(actor,.016);check(actor.current==='Idle','driving cannot keep in-person talk');driving=false;
actorAnimation(actor,.016);check(actor.current==='Talk','valid approach restores same conversation');net.role='guest';net.connected=false;actorAnimation(actor,.016);check(actor.current==='Idle','disconnected guest releases talk');
net.connected=true;s.npcs[0]={x:200,z:80};actorAnimation(actor,.016);check(actor.current==='Idle','guest uses accepted host customer position for reach');s.npcs[0]={x:target.x,z:target.z};actorAnimation(actor,.016);check(actor.current==='Talk','connected guest accepted customer pose can talk');net.role='solo';net.connected=false;
// Existing walk/run and police clip precedence is not replaced by a menu.
actor.previous.copy(actor.g.position);actor.speed=0;actor.g.position.x+=.02;actorAnimation(actor,.016);check(actor.current==='Walk','moving addressed actor keeps walk');actor.g.position.x+=.2;actorAnimation(actor,.016);check(actor.current==='Run','running addressed actor keeps run');
close();idleConversationFixture(actor);actorAnimation(actor,.016);check(actor.current==='Idle','closing releases resident talk');
menu('craft');actorAnimation(actor,.016);check(!conversationPoint&&actor.current==='Idle','unattended equipment never chooses a nearby speaker');close();
const copActor=visualActors.find(a=>a.g===officers[0]);copActor.g.position.set(player.x+1,0,player.z);idleConversationFixture(copActor);const policeState=ensurePolice();policeState.officers[0].mode='stop';policeState.officers[0].target='host';menu('customer',0);actorAnimation(copActor,.016);check(copActor.current==='Talk','stopping officer keeps own talk, not conversation target');policeState.search={role:'host',remaining:4};actorAnimation(copActor,.016);check(copActor.current==='Search','search keeps precedence during unrelated menu');policeState.search=null;
close();idleConversationFixture(visualActors.find(a=>a.g===crafterActor));const carryingActor=visualActors.find(a=>a.g===crafterActor);crafterActor.userData.carrying=true;actorAnimation(carryingActor,.016);check(carryingActor.body.getObjectByName('Forearm1').rotation.x===-1.05,'carrying arm override preserved');crafterActor.userData.carrying=false;
net.role='host';net.connected=true;net.remote={x:player.x+1,y:1.72,z:player.z,yaw:0};networkTick(.4);const remoteActor=visualActors.find(a=>a.g===other);check(!!remoteActor,'real peer rig installed');idleConversationFixture(remoteActor);policeState.search={role:'guest',remaining:4};menu('customer',0);actorAnimation(remoteActor,.016);check(remoteActor.current==='Surrender','peer search surrender keeps priority over unrelated conversation');policeState.search=null;net.role='solo';net.connected=false;close();
console.log('PASS: 13 actual authored vendor interactions, independent bystanders/phone props, work/talk priority, walk/run/search/carry precedence, high/low clip time, physical/guest guards and 200 read-only animation updates. DOM/WebGL/channels mocked; no rendered foot-sliding or live co-op claim.');
console.log('PASS: continuous collision-safe customer walking, deal priority, hand attachment/LOD, addressed conversation, phone and empty-order actions. Rendering remains unverified.');
`,env);})().catch(e=>{console.error(e);process.exitCode=1;});
