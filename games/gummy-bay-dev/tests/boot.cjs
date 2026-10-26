const base=require('node:path').resolve(__dirname,'../dist')+'/';
const fs=require('fs'),vm=require('vm');
(async()=>{const real=await import(base+'vendor/three.module.min.js');const context2d=new Proxy({measureText(text){const size=Number(String(this.font).match(/ (\d+)px/)?.[1]??30);return {width:Array.from(text).reduce((n,c)=>n+(/[MW@]/u.test(c)?.95:/[ilI ’·/]/u.test(c)?.27:.59)*size,0)}},createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}})},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});const elements={};const element=()=>({style:{},dataset:{},setAttribute(){},appendChild(){},insertAdjacentHTML(){},classList:{toggle(){},remove(){}},hidden:false,innerHTML:'',value:'',textContent:'',getContext:()=>context2d,addEventListener(n,f){((this.events??={})[n]??=[]).push(f)},click(){},focus(){},select(){},requestPointerLock:()=>Promise.resolve(),setPointerCapture(){}});const document={body:{dataset:{},appendChild(){},classList:{toggle(){},remove(){}}},getElementById(id){return elements[id]||(elements[id]=element())},createElement:()=>element(),querySelector:()=>null,querySelectorAll:()=>[],addEventListener(n,f){((this.events??={})[n]??=[]).push(f)},exitPointerLock(){},pointerLockElement:null,activeElement:null};const storage=new Map();const localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};class Renderer{constructor(){this.shadowMap={}}setPixelRatio(v){this.pixelRatio=v;}setSize(w,h){this.width=w;this.height=h;}render(){}}let perf=100;const events={};const pending=[];const {GLTFLoader:ActualLoader}=await import(base+'vendor/gltf-loader.js');class GLTFLoader{load(path,success,progress,failure){pending.push((async()=>{try{const b=fs.readFileSync(base+path);const g=await new ActualLoader().parseAsync(b.buffer.slice(b.byteOffset,b.byteLength),'');success(g);}catch(e){failure?.(e);}})());}};const env={GLTFLoader,createEffects:()=>({render(){},resize(){},dispose(){}}),THREE:{...real,WebGLRenderer:Renderer},document,localStorage,window:{addEventListener(){}},innerWidth:1440,innerHeight:900,devicePixelRatio:1,requestAnimationFrame(){},addEventListener(n,f){(events[n]??=[]).push(f)},events,setTimeout(){},clearTimeout(){},console,Date,Math,Blob,URL,performance:{now:()=>perf},btoa:s=>Buffer.from(s).toString('base64'),atob:s=>Buffer.from(s,'base64').toString(),navigator:{}};for(const name of ['parcel-handling','parcel-finish','interaction-focus','fleet','arrival-workplace','island-neighborhoods','street-hats','gritty-terrain','gritty-streets','resident-rounding','patrol-expansion','payphone-detail','graphics-atmosphere','graphics-architecture','graphics-landscape','graphics-life','graphics-surfaces','workshop-state','workshop-logistics','business-core','presentation','visual-polish','town-experience','town-collision','player-controller','spatial-hash','spawn-safety','coastal-backdrop','district-horizon','town-skyline','junction-reveals','night-silhouettes','overhead-infrastructure','town-fencing','foreground-depth','domestic-workplace','doorway-reveals','window-connections','ordinary-unusual-work','public-service-fronts','narrow-alleys','shop-approaches','logical-wear','object-silhouettes','production-containers','occupational-outfits','resident-accessories','resident-expressions','chunky-cast','street-crowd','resident-proportions','resident-clothing','resident-life','resident-animation','tactile-work','bench-mode','station-readiness','stock-display','customer-context','customer-craving','gameplay-feed','starter-sale','police-notice','sale-shield','police-vision','police-ladder','hide-spots','witness-call','pocket-slip','scuffle','sugar-bribe','busted','squad-cast','mix-bench','mix-core','mix-pantry','mix-risk','staff-status','field-crew','sim-clock','prop-motion','vehicle-access','exchange-access','point-access','police-feedback','workshop-move','signage','equipment-guide','world-lighting','atmospheric-distance','scruffy-welcome','exchange-gesture','player-view','rv-support','town-surfaces','police-lighting','window-lighting','furniture-access','tent-access','location-memory','journey-progress','coop-ping','coop-activity','progression-portrait','delivery-round','phone-device','phone-contacts','hud-readout','shop-counter','phone-apps','road-zones','parking-guide','town-palette','district-architecture','street-construction','vertical-town','contextual-street-props','starter-street','opening-shot','post-stack','hud-s1','skateboard','cinematics','loading-flyover','hints','sky-clouds','cine-cast','gfx-lighting','cine-stage','story-act1','city-expansion','city-shells','light-grade','police-penalty','xp-curve','reach-gate','arcade-core','arcade-ui','walk-grid','story-acts','npc-fx','npc-fx-layer','dealer-network','car-physics','car-kit','police-cruisers','weather','weather-fx'])Object.assign(env,await import(base+name+'.mjs'));env.sceneResources=(await import('./scene-resources.mjs')).sceneResources;env.workshopStageStatus=env.stationStatus;vm.createContext(env);vm.runInContext(fs.readFileSync(base+'game.js','utf8').replace(/^import .*?;\n/gm,''),env);await Promise.all(pending);vm.runInContext(`function check(v,msg){if(!v)throw Error(msg)}// User-requested town changes retain real movement support and old police state.
check(officers.length===10&&policeRoutes.length===10,'ten real patrol actors and routes');
for(const hill of WALKABLE_HILLS){check(!blocked(hill.x,hill.z),'hillside centre is walkable');check(Math.abs(floorHeight(hill.x,hill.z)-hill.h)<1e-8,'hill geometry and player support share elevation');}
console.log('Island infill built:',islandSites.length);check(islandSites.length>70,'substantial real-world infill');
const grittyRosterBefore=s.police;s.police={cooldown:4,arrests:2,search:null,officers:policeRoutes.slice(0,6).map(r=>({x:r[0][0],z:r[0][1],angle:0,waypoint:1,mode:'patrol',suspicion:0,lost:0,target:null,lastX:r[0][0],lastZ:r[0][1]}))};const grittyFirstSix=JSON.stringify(s.police.officers);ensurePolice();check(s.police.officers.length===10&&JSON.stringify(s.police.officers.slice(0,6))===grittyFirstSix&&s.police.arrests===2,'six-officer legacy save gains four patrols without changing original state');s.police=grittyRosterBefore;
renderFrame();check(tents.every(g=>!g.visible)&&mixers.every(g=>!g.visible),'title cannot display unowned tent/mixer equipment');
const silhouetteStateBefore=JSON.stringify(s),silhouetteColliderCount=colliders.length,rvSilhouette=rv.children.find(child=>child.userData.objectSilhouette==='rv'),vanSilhouettes=[playerVan,remoteVan].map(van=>van.children.find(child=>child.userData.objectSilhouette==='van')),stationSilhouettes=mixers.map(mixer=>mixer.children.find(child=>child.userData.objectSilhouette==='station')),silhouetteRigs=[rvSilhouette,...vanSilhouettes,...stationSilhouettes];
check(silhouetteRigs.every(Boolean)&&silhouetteRigs.length===6&&rvSilhouette.children.length===4&&vanSilhouettes.every(rig=>rig.children.length===4)&&stationSilhouettes.every(rig=>rig.children.length===4),'actual RV, both loaded delivery vans and all three mixers carry their four-part silhouette signatures · '+silhouetteRigs.map(rig=>rig?rig.children.length:'missing').join(','));
check(rvSilhouette.userData.profile===objectSilhouetteProfile('rv')&&vanSilhouettes.every(rig=>rig.userData.profile===objectSilhouetteProfile('van'))&&stationSilhouettes.every(rig=>rig.userData.profile===objectSilhouetteProfile('station'))&&objectSilhouetteProfile('police')===null,'actual objects use three distinct authored profiles and no nonexistent police vehicle is claimed');
check(OBJECT_SILHOUETTE_PROFILES.every(profile=>{const bounds=objectSilhouetteBounds(profile);return bounds&&bounds.width>0&&bounds.height>0&&bounds.depth>0;})&&new Set(OBJECT_SILHOUETTE_PROFILES.map(profile=>profile.signature)).size===3,'RV, van and station have distinct finite outline signatures');
const silhouetteMeshes=silhouetteRigs.flatMap(rig=>rig.children),silhouetteResources=silhouetteMeshes.map(mesh=>[mesh,mesh.geometry,mesh.material]);
check(new Set(silhouetteMeshes.filter(mesh=>mesh.geometry.type==='BoxGeometry').map(mesh=>mesh.geometry)).size===1&&new Set(silhouetteMeshes.filter(mesh=>mesh.geometry.type==='CylinderGeometry').map(mesh=>mesh.geometry)).size===1&&OBJECT_SILHOUETTE_COLLIDERS.length===0,'silhouette parts share shape resources and add zero collision');
setQuality('performance');check(silhouetteMeshes.every(mesh=>!mesh.castShadow&&mesh.receiveShadow),'Performance retains every outline without silhouette shadow work');setQuality('balanced');
check(silhouetteResources.every((resources,i)=>resources.every((resource,j)=>resource===[silhouetteMeshes[i],silhouetteMeshes[i].geometry,silhouetteMeshes[i].material][j]))&&colliders.length===silhouetteColliderCount&&JSON.stringify(s)===silhouetteStateBefore,'quality switching preserves exact silhouette resources, collision and business state');
console.log('PASS: the actual RV, two real delivery-van GLB instances and three production mixers carry distinct shared-geometry silhouette signatures with zero collision; police vehicle remains absent and rendered recognition is not claimed.');
check(assemblyLabels.length===8&&new Set(assemblyLabels.map(l=>l.material.map)).size===8&&assemblyLabels.every(l=>l.material.map.image.width===512&&l.material.map.image.height===128&&!l.userData.heading.truncated&&!l.userData.detail.truncated&&l.material.depthTest&&l.material.toneMapped===false),'all numbered assembly labels have fixed bounded maps, fitted wording and depth testing');
load('story',2,true);check(s.cash===400,'starting cash');
updateUI();check($('cash').textContent==='$400','cash HUD');
check(s.chapter===0,'fresh story begins at the first derived milestone');menu('journal');
check($('modal').innerHTML.includes('Gummy Bay journey · 0 / 14 milestones')&&$('modal').innerHTML.includes('Next: 01 · Gramps’ starter batch')&&($('modal').innerHTML.match(/<li>/g)||[]).length===14,'fresh notebook exposes exact 14-step journey and resume point');
trackJourney();check(track.x===CONTACTS[0].x&&track.z===CONTACTS[0].z&&track.npc===0,'fresh journey tracking targets Jules for the starter handoff');track=null;
check(citizenAssetStatus==='ready','Blender characters loaded');
check(townAssetStatus==='ready','Blender town loaded');
const districtStateBefore=JSON.stringify(s),districtMeshes=[districtArchitecture.massMesh,districtArchitecture.detailMesh,districtArchitecture.roofMesh];
check(districtArchitecture.profiles.length===60&&districtArchitecture.profiles.length+islandArchitecture.profiles.length===districtBuildings.length&&districtArchitecture.drawCalls===3,'all 60 map/collider blocks have three-batch visible architecture');
check(DISTRICT_CONTRAST_COLLIDERS.length===0&&districtArchitecture.contrastProfiles.length===60&&districtArchitecture.counts.contrastVerticals===120&&districtArchitecture.counts.contrastHorizontals===districtArchitecture.profiles.reduce((sum,profile)=>sum+profile.floors,0),'all facades use paired full-height ribs and one orthogonal datum per floor without collision');
check(districtArchitecture.contrastProfiles.every((item,index)=>item===districtGeometricContrast(districtArchitecture.profiles[index])||item.signature===districtGeometricContrast(districtArchitecture.profiles[index]).signature)&&districtArchitecture.contrastProfiles.every(item=>item.rightAngles&&item.roundedParts===0&&item.clearance>.75),'structured facade records remain orthogonal and inside their authored setback');
check(districtArchitecture.detailMesh.geometry.type==='BoxGeometry'&&visualActors.every(actor=>{let skinned=0;actor.high.body.traverse(object=>{if(object.isSkinnedMesh)skinned++;});return skinned>0;}),'the actual rounded skinned resident assets stand against an explicitly box-structured facade batch');
check(districtArchitecture.profiles.every((p,i)=>p.x===districtBuildings[i].x&&p.z===districtBuildings[i].z&&p.w<districtBuildings[i].w&&p.d<districtBuildings[i].d),'architecture remains centred inside every authored navigation footprint');
check(districtArchitecture.profiles.every(p=>blocked(p.x,p.z)),'every visible district mass has an actual matching collider');
check(districtArchitecture.profiles.every((p,i)=>{const d=districtFacadeDepth(p),b=districtBuildings[i],massHalf=p.front.axis==='z'?p.d/2:p.w/2,siteHalf=p.front.axis==='z'?b.d/2:b.w/2;return d&&d.layers.doorBack<0&&d.layers.windowPane<0&&d.layers.frame>0&&d.layers.step>d.layers.cornice&&d.clearance>=.18-1e-9&&massHalf+d.maxProjection<siteHalf;}),'all facades layer recesses behind projections while staying inside their real colliders');
check(districtArchitecture.counts.detail>1100&&districtArchitecture.detailMesh.count===districtArchitecture.counts.detail,'facade frames, lintels, sills, steps and cornices use the existing detail batch');
setQuality('performance');check(!districtArchitecture.detailMesh.visible&&districtArchitecture.massMesh.visible,'performance keeps district silhouettes and hides only frontage detail');
setQuality('balanced');check(districtArchitecture.detailMesh.visible&&districtMeshes.every((m,i)=>m===[districtArchitecture.massMesh,districtArchitecture.detailMesh,districtArchitecture.roofMesh][i])&&JSON.stringify(s)===districtStateBefore,'quality restores the same district resources without business mutation');
console.log('PASS: 60 actual expanded-town collider/map sites have signed facade recesses, projecting frames/steps/cornices, collider clearance and three-batch architecture; performance mode keeps silhouettes. DOM/WebGL mocked; no grazing-angle render or FPS claim.');
const streetStateBefore=JSON.stringify(s),streetMeshes=[streetConstruction.markingMesh,streetConstruction.hardscapeMesh];
check(streetConstruction.drawCalls===2&&streetConstruction.profiles.length===30,'all 30 real expanded-town junctions have two-batch street construction');
check(streetConstruction.counts.curbs===26&&streetConstruction.counts.bays===PARKING_BAYS.length&&streetConstruction.counts.markings===500&&streetConstruction.counts.hardscape===391,'crossings, curb ramps, tactile strips, curb edges and every guided parking bay are instantiated');
check(streetConstruction.profiles.every(p=>p.stripes===16&&p.ramps===4&&p.tactile===8),'each junction has a complete four-way pedestrian treatment');
setQuality('performance');check(streetConstruction.markingMesh.visible&&streetConstruction.hardscapeMesh.visible&&!streetConstruction.hardscapeMesh.castShadow,'performance keeps crossing and curb safety geometry without hardscape shadows');
setQuality('balanced');check(streetConstruction.hardscapeMesh.castShadow&&streetMeshes.every((m,i)=>m===[streetConstruction.markingMesh,streetConstruction.hardscapeMesh][i])&&JSON.stringify(s)===streetStateBefore,'quality restores street shadows on the same resources without business mutation');
console.log('PASS: 30 actual junctions have four-way crossings, curb panels/tactile strips, continuous curb edges and five world-space parking bays in two instanced draw calls. DOM/WebGL mocked; no pedestrian-height rendered acceptance or FPS claim.');
const starterStateBefore=JSON.stringify(s),starterColliderCount=colliders.length,starterMeshes=[starterStreet.markingMesh,starterStreet.hardscapeMesh],starterResources=starterMeshes.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]);
check(starterStreet.drawCalls===2&&starterStreet.counts.adopted===62&&starterStreet.counts.dashes===46&&starterStreet.counts.crosswalks===16&&starterStreet.counts.curbs===8&&starterStreet.counts.approachDashes===5&&starterStreet.counts.colliders===0,'old-town starter markings collapse to two draws with the campsite approach and no collision');
check(!scene.children.some(starterMarkingKind),'no loose starter dash or crossing mesh remains on the live scene');
check(STARTER_APPROACH.minZ>25.7&&STARTER_APPROACH.minX>-46.2,'the flat approach stays clear of Palm Court and the payphone');
check(starterCurbRecords().every(curb=>{const minX=curb.x-curb.w/2,maxX=curb.x+curb.w/2,minZ=curb.z-curb.d/2,maxZ=curb.z+curb.d/2;return maxX<=-7.4||minX>=7.4||maxZ<=-7.4||minZ>=7.4;}),'starter curbs leave the Main Street crossing mouth open');
check(!blocked(0,0)&&!blocked(-32,27)&&!blocked(12,0),'starter dressing does not occupy the road centre or the approach');
const starterWalk=sweepWalk({x:24,z:0},-48,0,blocked);check(Math.abs(starterWalk.x-(-24))<1e-9&&!starterWalk.hitX&&!starterWalk.hitZ,'a walk along Main Street is unchanged by the visual curb layer');
setQuality('performance');check(starterStreet.activeBudget==='performance'&&starterStreet.markingMesh.count===starterStreet.budgets.performance&&starterStreet.markingMesh.count<starterStreet.counts.markings&&starterStreet.hardscapeMesh.count===starterStreet.counts.hardscape&&starterStreet.markingMesh.visible&&starterStreet.hardscapeMesh.visible&&!starterStreet.hardscapeMesh.castShadow,'performance keeps curbs, the approach and a readable dash subset in the same two draws');
const starterShown=starterStreet.markingMesh.userData.items.slice(0,starterStreet.markingMesh.count);check(starterShown.filter(item=>item.role==='crosswalk').length===16&&starterShown.filter(item=>item.role==='approach-dash').length===5&&starterShown.some(item=>item.role==='dash'&&item.z===0)&&starterShown.some(item=>item.role==='dash'&&item.x===0),'performance still shows both centre lines and every crossing bar');
setQuality('high');check(starterStreet.markingMesh.count===starterStreet.counts.markings&&!starterStreet.hardscapeMesh.castShadow,'high restores every dash without curb shadow work');
setQuality('balanced');check(starterStreet.hardscapeMesh.receiveShadow&&starterResources.every((resources,i)=>resources.every((resource,j)=>resource===[starterMeshes[i],starterMeshes[i].geometry,starterMeshes[i].material,starterMeshes[i].instanceMatrix,starterMeshes[i].instanceColor][j]))&&colliders.length===starterColliderCount&&JSON.stringify(s)===starterStateBefore,'balanced restores the same starter-street resources without business or collider changes');
console.log('PASS: Main Street dashes and crossing bars share one instanced draw, curbs and the RV approach share the second, and performance keeps that street readable. DOM/WebGL mocked; no FPS claim.');
const verticalStateBefore=JSON.stringify(s),verticalMeshes=[verticalTown.massMesh,verticalTown.detailMesh],verticalPlayer=player.clone(),verticalEyes=[];
check(verticalTown.drawCalls===2&&verticalTown.counts.steps===16&&verticalTown.counts.platforms===1&&verticalTown.counts.detail===26,'Gumdrop Terrace has two eight-step flights, a raised platform, rails and benches in two batches');
check(!blocked(VERTICAL_TOWN_LAYER.x,-62)&&blocked(VERTICAL_TOWN_BARRIERS[0].x,VERTICAL_TOWN_BARRIERS[0].z),'terrace centre remains traversable while the authored side rail blocks walking off the platform');
for(let z=VERTICAL_TOWN_LAYER.northStart;z>=VERTICAL_TOWN_LAYER.southEnd;z-=.25){player.set(VERTICAL_TOWN_LAYER.x,1.72,z);syncPlayerView();verticalEyes.push(camera.position.y);check(Math.abs(camera.position.y-(1.72+verticalTownFloorHeight(player.x,player.z)))<1e-9,'camera follows the shared continuous terrace support');}
check(verticalEyes.every((eye,i)=>!i||Math.abs(eye-verticalEyes[i-1])<=.061),'quarter-metre traversal never changes eye height by more than 6.1 cm');
check(Math.abs(floorHeight(VERTICAL_TOWN_LAYER.x,-62)-1.44)<1e-9&&Math.abs(propFloorHeight(VERTICAL_TOWN_LAYER.x,-62)-1.44)<1e-9,'player and crate support agree on the raised public platform');
setQuality('performance');check(verticalTown.massMesh.visible&&verticalTown.detailMesh.visible&&!verticalTown.detailMesh.castShadow,'performance retains terrace safety geometry without detail shadows');
setQuality('balanced');player.copy(verticalPlayer);syncPlayerView();check(verticalTown.detailMesh.castShadow&&verticalMeshes.every((m,i)=>m===[verticalTown.massMesh,verticalTown.detailMesh][i])&&JSON.stringify(s)===verticalStateBefore,'balanced restores terrace shadows on the same resources without business mutation');
console.log('PASS: actual player eye and crate support traverse Gumdrop Terrace continuously across two stair flights and a 1.44 m platform; safety rails block side falls and quality reuses two batches. DOM/WebGL mocked; no rendered camera-jitter or FPS claim.');
const streetPropStateBefore=JSON.stringify(s),streetPropMeshes=[contextualStreetProps.boxMesh,contextualStreetProps.cylinderMesh];
check(contextualStreetProps.drawCalls===2&&contextualStreetProps.counts.sites===8&&contextualStreetProps.counts.boxes===31&&contextualStreetProps.counts.cylinders===28,'eight purpose-specific street installations share two batches');
check(STREET_PROP_PROFILES.every(profile=>STREET_PROP_COLLIDERS.includes(profile.collider)&&colliders.includes(profile.collider)&&blocked(profile.x,profile.z)),'every visible installation has its exact padded solid footprint in the world');
for(const profile of STREET_PROP_PROFILES){
 const side=Math.sign(profile.z-profile.roadZ),walkZ=profile.roadZ+side*7.35;
 check(!blocked(profile.x,walkZ),'clear authored pavement corridor remains beside '+profile.label);
 const walk=sweepWalk({x:profile.x-3,z:walkZ},6,0,blocked);check(Math.abs(walk.x-(profile.x+3))<1e-9&&!walk.hitX&&!walk.hitZ,'six-metre pedestrian pass stays clear beside '+profile.label);
}
setQuality('performance');check(contextualStreetProps.boxMesh.visible&&contextualStreetProps.cylinderMesh.visible&&!contextualStreetProps.boxMesh.castShadow&&!contextualStreetProps.cylinderMesh.castShadow,'performance retains contextual street silhouettes without their shadows');
setQuality('balanced');check(contextualStreetProps.boxMesh.castShadow&&contextualStreetProps.cylinderMesh.castShadow&&streetPropMeshes.every((mesh,i)=>mesh===[contextualStreetProps.boxMesh,contextualStreetProps.cylinderMesh][i])&&JSON.stringify(s)===streetPropStateBefore,'balanced restores street-prop shadows on the same resources without business mutation');
console.log('PASS: eight contextual street installations have shared solid footprints and preserve a six-metre walk along at least 1.8 m of pavement clearance; two quality-stable batches. DOM/WebGL mocked; no rendered clutter/readability or FPS claim.');
const horizonStateBefore=JSON.stringify(s),horizonMeshes=[districtHorizon.trunkMesh,districtHorizon.crownMesh,districtHorizon.scrubMesh],horizonResources=horizonMeshes.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]);
check(districtHorizon.drawCalls===3&&districtHorizon.profiles.length===22,'the complete district horizon uses 22 authored sites in three instanced batches');
check(districtHorizon.counts.trees===22&&districtHorizon.counts.trunks===22&&districtHorizon.counts.crowns===44&&districtHorizon.counts.scrub===22,'the district horizon has one trunk, two crown layers and one scrub transition per site');
check(districtHorizon.profiles.every(profile=>horizonSiteOutsideBounds(profile,WORLD,8)&&horizonViewGap(profile)>=18),'every horizon site remains beyond gameplay and at least 18 m from every authored street view corridor');
check(horizonMeshes.every(mesh=>mesh.count>0&&mesh.material.map==null),'horizon batches use bounded geometry and untextured palette materials');
setQuality('performance');check(horizonMeshes.every(mesh=>mesh.visible&&!mesh.castShadow),'Performance keeps the full horizon silhouette without shadow-map work');
setQuality('high');check(districtHorizon.trunkMesh.castShadow&&districtHorizon.crownMesh.castShadow&&!districtHorizon.scrubMesh.castShadow,'High selectively enables tree shadows while scrub remains shadow-free');
setQuality('balanced');check(horizonMeshes.every(mesh=>mesh.visible&&!mesh.castShadow)&&horizonResources.every((resources,i)=>resources.every((resource,j)=>resource===[horizonMeshes[i],horizonMeshes[i].geometry,horizonMeshes[i].material,horizonMeshes[i].instanceMatrix,horizonMeshes[i].instanceColor][j]))&&JSON.stringify(s)===horizonStateBefore,'Balanced restores the same horizon resources without business mutation');
console.log('PASS: 22 off-route windbreak trees, 44 crown layers and 22 scrub transitions preserve at least 18 m of every authored skyline corridor in three stable batches. DOM/WebGL mocked; no rendered horizon, natural-traversal or FPS claim.');
const scruffyStateBefore=JSON.stringify(s),scruffyMeshes=[scruffyWelcome.boxMesh,scruffyWelcome.tinMesh],scruffyResources=scruffyMeshes.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]);
check(scruffyWelcome.drawCalls===2&&scruffyWelcome.profiles.length===5&&scruffyWelcome.counts.boxes===40&&scruffyWelcome.counts.tins===10&&scruffyWelcome.counts.repair===10&&scruffyWelcome.counts.care===40&&scruffyWelcome.counts.colliders===0,'campsite and four shopfronts receive exact paired weathered/cared-for dressing in two batches');
check(scruffyWelcome.profiles.filter(profile=>profile.kind==='campsite').length===1&&scruffyWelcome.profiles.filter(profile=>profile.kind==='shop').length===4&&scruffyWelcome.profiles.every(profile=>profile.decorativeOnly&&profile.attached&&scruffyWelcomeMounted(profile)),'actual care profiles stay mounted within their authored frontage spans');
for(const profile of scruffyWelcome.profiles){const items=scruffyMeshes.flatMap(mesh=>mesh.userData.items).filter(item=>item.site===profile.id);check(items.filter(item=>item.role==='repair').length===2&&items.filter(item=>item.role!=='repair').length===8,'each actual site pairs visible repair wear with tidy welcome care');}
check(scruffyMeshes.every(mesh=>mesh.material.map==null&&!mesh.castShadow)&&SCRUFFY_WELCOME_COLLIDERS.length===0,'scruffy welcome layer adds no textures, default shadows or collision');
setQuality('performance');check(scruffyMeshes.every(mesh=>mesh.visible&&!mesh.castShadow),'Performance keeps both scruffy/welcome silhouettes without shadow work');
setQuality('high');check(scruffyMeshes.every(mesh=>mesh.visible&&mesh.castShadow),'High enables selective dressing shadows');
setQuality('balanced');check(scruffyMeshes.every(mesh=>mesh.visible&&!mesh.castShadow)&&scruffyResources.every((resources,i)=>resources.every((resource,j)=>resource===[scruffyMeshes[i],scruffyMeshes[i].geometry,scruffyMeshes[i].material,scruffyMeshes[i].instanceMatrix,scruffyMeshes[i].instanceColor][j]))&&JSON.stringify(s)===scruffyStateBefore,'Balanced restores exact care resources without business mutation');
console.log('PASS: campsite and four shopfronts pair ten weathered repairs with forty tidy welcome/care details in two stable untextured batches and zero collision. DOM/WebGL mocked; no rendered matched-daylight claim.');
const skylineStateBefore=JSON.stringify(s),skylineMeshes=[townSkyline.boxMesh,townSkyline.cylinderMesh,townSkyline.coneMesh],skylineResources=skylineMeshes.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]);
check(townSkyline.drawCalls===3&&townSkyline.profiles.length===4,'four complete town landmarks use three instanced skyline batches');
check(townSkyline.counts.landmarks===4&&townSkyline.counts.boxes===11&&townSkyline.counts.cylinders===10&&townSkyline.counts.cones===4,'water tower, clock tower, chimney and signal mast have the exact authored silhouettes');
check(new Set(townSkyline.profiles.map(profile=>profile.kind)).size===4&&new Set(townSkyline.profiles.map(profile=>profile.topY)).size===4,'every cardinal approach has a distinct landmark family and total height');
check(townSkyline.profiles.every(profile=>districtBuildings.includes(profile.support)&&blocked(profile.x,profile.z)&&skylineFootprintOnSupport(profile,.5)),'every skyline landmark is roof-mounted inside an existing solid building footprint');
check(Object.keys(SKYLINE_APPROACHES).length===4&&townSkyline.profiles.every(profile=>SKYLINE_APPROACHES[profile.approach].landmark===profile.id),'west, east, north and south approaches resolve to four authored silhouette signatures');
setQuality('performance');check(skylineMeshes.every(mesh=>mesh.visible&&!mesh.castShadow),'Performance keeps every skyline landmark without shadow-map work');
setQuality('high');check(townSkyline.boxMesh.castShadow&&townSkyline.cylinderMesh.castShadow&&!townSkyline.coneMesh.castShadow,'High selectively enables landmark mass shadows while caps remain shadow-free');
setQuality('balanced');check(skylineMeshes.every(mesh=>mesh.visible&&!mesh.castShadow)&&skylineResources.every((resources,i)=>resources.every((resource,j)=>resource===[skylineMeshes[i],skylineMeshes[i].geometry,skylineMeshes[i].material,skylineMeshes[i].instanceMatrix,skylineMeshes[i].instanceColor][j]))&&JSON.stringify(s)===skylineStateBefore,'Balanced restores the same skyline resources without business mutation');
console.log('PASS: four roof-mounted original landmarks give west/east/north/south approaches unique silhouettes and four distinct peaks in three stable batches. DOM/WebGL mocked; no rendered recognition, natural traversal or FPS claim.');
const revealBusinessBefore=JSON.stringify([s.cash,s.bank,s.xp,s.seeds,s.raw,s.gummies,s.packs,s.deals,s.threads,s.vehiclePark]),revealColliderCount=colliders.length,revealMeshes=[junctionReveals.boxMesh,junctionReveals.cylinderMesh],revealResources=revealMeshes.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]);
check(junctionReveals.drawCalls===2&&junctionReveals.profiles.length===8&&junctionReveals.counts.reveals===8&&junctionReveals.counts.boxes===40&&junctionReveals.counts.cylinders===16&&junctionReveals.counts.parts===56&&junctionReveals.counts.colliders===8,'eight landmark sight pylons share exact two-batch geometry and collider counts');
check(new Set(junctionReveals.profiles.map(profile=>profile.landmark.id)).size===4&&new Set(junctionReveals.profiles.map(profile=>profile.landmark.signature)).size===4,'two approaches expose each of four distinct skyline silhouettes');
for(const profile of junctionReveals.profiles){
 check(colliders.some(collider=>collider.junctionReveal===profile.id)&&blocked(profile.corner.x,profile.corner.z),'every visible sight pylon has exact solid corner collision at '+profile.id);
 const revealRouteBlockers=[profile.start,profile.end].flatMap((point,endpoint)=>colliders.filter(collider=>Math.abs(point.x-collider.x)<collider.w/2&&Math.abs(point.z-collider.z)<collider.d/2).map(collider=>({endpoint,id:collider.id||collider.junctionReveal||collider.contextualStreetProp||'unnamed',x:collider.x,z:collider.z,w:collider.w,d:collider.d})));
 check(!blocked(profile.start.x,profile.start.z)&&!blocked(profile.end.x,profile.end.z),'the 32 m road-centre approach stays open at '+profile.id+' · '+JSON.stringify(revealRouteBlockers));
 const walk=sweepWalk(profile.start,profile.end.x-profile.start.x,profile.end.z-profile.start.z,blocked);check(Math.hypot(walk.x-profile.end.x,walk.z-profile.end.z)<1e-9&&!walk.hitX&&!walk.hitZ,'actual player-radius sweep reaches the junction at '+profile.id);
 const glimpse=junctionRevealReading(profile,profile.start),middle=junctionRevealReading(profile,{x:(profile.start.x+profile.end.x)/2,z:(profile.start.z+profile.end.z)/2}),clear=junctionRevealReading(profile,profile.end);check(glimpse.stage==='glimpse'&&middle.stage==='emerging'&&clear.stage==='clear view'&&glimpse.apparentAngle<middle.apparentAngle&&middle.apparentAngle<clear.apparentAngle,'real landmark apparent height grows across three stages at '+profile.id);
 check(drivingSurfaceZone({...profile.start,angle:profile.heading}).key==='road'&&drivingSurfaceZone({...profile.end,angle:profile.heading}).key==='junction','the staged approach starts on a real road and ends at a real junction at '+profile.id);
}
const hudProfile=junctionReveals.profiles[0],hudPlayer=player.clone(),hudActive=active,hudPanel=panel,hudDriving=driving,hudAngle=driveAngle;active=false;panel='title';driving=true;driveAngle=hudProfile.heading;player.set(hudProfile.start.x,1.72,hudProfile.start.z);update(0);check($('drivingHUD').textContent.includes('JUNCTION VIEW · SYRUP STACK · GLIMPSE'),'actual driving HUD names the visible skyline landmark and reveal stage without a tracked marker');player.copy(hudPlayer);active=hudActive;panel=hudPanel;driving=hudDriving;driveAngle=hudAngle;
setQuality('performance');check(revealMeshes.every(mesh=>mesh.visible&&!mesh.castShadow&&!mesh.receiveShadow),'Performance keeps every junction sight cue without shadow work');
setQuality('high');check(revealMeshes.every(mesh=>mesh.castShadow&&mesh.receiveShadow),'High enables sight-pylon structure and beacon shadows');
setQuality('balanced');check(junctionReveals.boxMesh.castShadow&&!junctionReveals.cylinderMesh.castShadow,'Balanced restores selective junction shadows');check(revealResources.every((resources,i)=>resources.every((resource,j)=>resource===[revealMeshes[i],revealMeshes[i].geometry,revealMeshes[i].material,revealMeshes[i].instanceMatrix,revealMeshes[i].instanceColor][j])),'junction quality switching reuses exact resources');check(colliders.length===revealColliderCount,'junction quality switching adds no collider');check(JSON.stringify([s.cash,s.bank,s.xp,s.seeds,s.raw,s.gummies,s.packs,s.deals,s.threads,s.vehiclePark])===revealBusinessBefore,'junction HUD and quality checks do not mutate money, stock, deals, threads or vehicle save state');
console.log('PASS: eight real 32 m junction approaches stage four skyline landmarks from glimpse to clear view, preserve swept road centres and feed the actual driving HUD without tracked markers. DOM/WebGL mocked; no rendered recognition or natural navigation claim.');
const utilityStateBefore=JSON.stringify(s),utilityMeshes=[townUtilities.boxMesh,townUtilities.cylinderMesh],utilityResources=utilityMeshes.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]);
check(townUtilities.drawCalls===2&&townUtilities.profiles.length===10&&townUtilities.counts.boxes===16&&townUtilities.counts.cylinders===17,'ten purposeful utility sites share exact box and cylinder batches');
check(new Set(townUtilities.profiles.map(profile=>profile.kind)).size===4&&townUtilities.profiles.every(profile=>profile.purpose===TOWN_UTILITY_KINDS[profile.kind].purpose),'meter, cooling, rainwater and extraction utilities retain explicit site purposes');
check(townUtilities.profiles.every(profile=>districtBuildings.includes(profile.support)&&colliders.includes(profile.support)&&blocked(profile.x,profile.z)&&utilityInsideSupport(profile,.08)),'every utility sits inside its existing solid service-back building footprint');
check(townUtilities.profiles.every((profile,i)=>townUtilities.profiles.every((other,j)=>i===j||Math.hypot(profile.x-other.x,profile.z-other.z)>12)),'utility clusters remain deliberately sparse instead of filling pavements');
setQuality('performance');check(utilityMeshes.every(mesh=>mesh.visible&&!mesh.castShadow),'Performance keeps utilities visible without their shadow work');
setQuality('high');check(townUtilities.boxMesh.castShadow&&!townUtilities.cylinderMesh.castShadow,'High selectively enables utility cabinet shadows while pipework stays shadow-free');
setQuality('balanced');check(utilityMeshes.every(mesh=>mesh.visible&&!mesh.castShadow)&&utilityResources.every((resources,i)=>resources.every((resource,j)=>resource===[utilityMeshes[i],utilityMeshes[i].geometry,utilityMeshes[i].material,utilityMeshes[i].instanceMatrix,utilityMeshes[i].instanceColor][j]))&&JSON.stringify(s)===utilityStateBefore,'Balanced restores the same utility resources without business mutation');
console.log('PASS: ten sparse service-back utility sites cover four believable purposes inside existing solid building footprints in two stable batches. DOM/WebGL mocked; no rendered clutter, natural traversal or FPS claim.');
const overheadStateBefore=JSON.stringify(s),overheadMeshes=[overheadInfrastructure.supportMesh,overheadInfrastructure.armMesh,overheadInfrastructure.cableMesh],overheadResources=overheadMeshes.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]);
check(overheadInfrastructure.drawCalls===3&&overheadInfrastructure.profiles.length===4&&overheadInfrastructure.counts.supportParts===32&&overheadInfrastructure.counts.arms===8&&overheadInfrastructure.counts.cables===24,'four East Grid spans share exact support, arm and cable batches');
check(overheadInfrastructure.profiles.every(profile=>districtBuildings.includes(profile.leftSupport)&&districtBuildings.includes(profile.rightSupport)&&colliders.includes(profile.leftSupport)&&colliders.includes(profile.rightSupport)&&blocked(profile.leftX,profile.z)&&blocked(profile.rightX,profile.z)&&roofSupportsContain(profile,.55)),'every overhead mast is roof-mounted inside an existing solid building footprint');
check(overheadInfrastructure.profiles.every(profile=>profile.leftX<profile.roadX&&profile.roadX<profile.rightX&&profile.clearance>=10&&overheadCableSegments(profile).length===6),'each three-line span crosses its road with at least ten metres of measured cable clearance');
check(overheadInfrastructure.profiles.every(profile=>!colliders.some(collider=>collider!==profile.leftSupport&&collider!==profile.rightSupport&&Math.abs(collider.x-profile.roadX)<6&&Math.abs(collider.z-profile.z)<6)),'overhead routes add no ground-level collider or road obstruction');
setQuality('performance');check(overheadMeshes.every(mesh=>mesh.visible&&!mesh.castShadow),'Performance keeps overhead silhouettes without shadow-map work');
setQuality('high');check(overheadInfrastructure.supportMesh.castShadow&&overheadInfrastructure.armMesh.castShadow&&!overheadInfrastructure.cableMesh.castShadow,'High selectively shades supports while cable shadows stay disabled');
setQuality('balanced');check(overheadMeshes.every(mesh=>mesh.visible&&!mesh.castShadow)&&overheadResources.every((resources,i)=>resources.every((resource,j)=>resource===[overheadMeshes[i],overheadMeshes[i].geometry,overheadMeshes[i].material,overheadMeshes[i].instanceMatrix,overheadMeshes[i].instanceColor][j]))&&JSON.stringify(s)===overheadStateBefore,'Balanced restores the same overhead resources without business mutation');
console.log('PASS: four roof-supported East Grid spans cross real road corridors with measured 10.15 m cable clearance, no new collision and three stable batches. DOM/WebGL mocked; no rendered scale, shading, live co-op or FPS claim.');
const fenceStateBefore=JSON.stringify(s),fenceMeshes=[townFencing.railMesh,townFencing.postMesh],fenceResources=fenceMeshes.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]);
check(townFencing.drawCalls===2&&townFencing.profiles.length===4&&townFencing.counts.rails===32&&townFencing.counts.posts===24&&townFencing.counts.colliders===16,'four service yards share exact rail, post and collision counts');
check(townFencing.profiles.every(profile=>districtBuildings.some(support=>support.id===profile.support.id)&&profile.colliders.every(collider=>TOWN_FENCE_COLLIDERS.some(item=>item.fence===collider.fence)&&colliders.some(item=>item.fence===collider.fence))&&profile.visibilityRatio>.7&&profile.roadClearance>9),'every sparse fence has see-through spacing, matching shared collision and more than nine metres of road clearance');
for(const profile of townFencing.profiles){
 check(fenceGateClear(profile)&&!blocked(profile.x,profile.gateZ)&&blocked(profile.x-profile.yardW/2,profile.z)&&fencePointBlocked(profile,profile.x+profile.gateWidth/2+.15,profile.gateZ),'gate opens while side and gate rails block at '+profile.label);
 const start={x:profile.x,z:profile.gateZ+profile.backSign*2},walk=sweepWalk(start,0,-profile.backSign*4,blocked),targetZ=profile.gateZ-profile.backSign*2;
 check(Math.abs(walk.z-targetZ)<1e-9&&!walk.hitX&&!walk.hitZ,'2.15 m padded gate admits a four-metre pedestrian pass at '+profile.label);
}
setQuality('performance');check(fenceMeshes.every(mesh=>mesh.visible&&!mesh.castShadow),'Performance keeps fence silhouettes without shadow work');
setQuality('high');check(fenceMeshes.every(mesh=>mesh.castShadow),'High enables bounded fence shadows');
setQuality('balanced');check(townFencing.railMesh.castShadow&&!townFencing.postMesh.castShadow&&fenceResources.every((resources,i)=>resources.every((resource,j)=>resource===[fenceMeshes[i],fenceMeshes[i].geometry,fenceMeshes[i].material,fenceMeshes[i].instanceMatrix,fenceMeshes[i].instanceColor][j]))&&JSON.stringify(s)===fenceStateBefore,'Balanced restores the same fence resources without business mutation');
console.log('PASS: four see-through service-yard fences block exact rails while preserving 2.15 m padded gates and four-metre pedestrian passes in two stable batches. DOM/WebGL mocked; no rendered visibility, natural traversal, live co-op or FPS claim.');
const depthStateBefore=JSON.stringify(s),depthMeshes=[foregroundDepth.boxMesh,foregroundDepth.plantMesh],depthResources=depthMeshes.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]);
check(foregroundDepth.drawCalls===2&&foregroundDepth.profiles.length===4&&foregroundDepth.counts.beds===8&&foregroundDepth.counts.boxes===16&&foregroundDepth.counts.plants===48&&foregroundDepth.counts.colliders===8,'four shop approaches share exact low-bed, planting and collision counts');
check(foregroundDepth.profiles.every(profile=>profile.colliders.every(collider=>FOREGROUND_DEPTH_COLLIDERS.some(item=>item.foregroundDepth===collider.foregroundDepth)&&colliders.some(item=>item.foregroundDepth===collider.foregroundDepth))&&profile.centralClearWidth===5.35&&Math.abs(profile.depthRatio-8/13)<1e-12),'every paired approach uses shared collision, 5.35 m centre clearance and a 0.615 depth ratio');
for(const profile of foregroundDepth.profiles){
 check(foregroundSightlineClear(profile)&&!blocked(profile.view.x,profile.view.z)&&!blocked(profile.target.x,profile.target.z),'the full centre sightline and interaction target stay clear at '+profile.label);
 check(profile.beds.every(bed=>blocked(bed.x,bed.z)&&foregroundPointBlocked(profile,bed.x,bed.z)),'both visible planting beds block at '+profile.label);
 const walk=sweepWalk(profile.view,profile.target.x-profile.view.x,profile.target.z-profile.view.z,blocked);
 check(Math.abs(walk.x-profile.target.x)<1e-9&&Math.abs(walk.z-profile.target.z)<1e-9&&!walk.hitX&&!walk.hitZ,'thirteen-metre centre walk reaches '+profile.label);
}
setQuality('performance');check(depthMeshes.every(mesh=>mesh.visible&&!mesh.castShadow),'Performance keeps foreground framing without shadow work');
setQuality('high');check(depthMeshes.every(mesh=>mesh.castShadow),'High enables bounded foreground shadows');
setQuality('balanced');check(foregroundDepth.boxMesh.castShadow&&!foregroundDepth.plantMesh.castShadow&&depthResources.every((resources,i)=>resources.every((resource,j)=>resource===[depthMeshes[i],depthMeshes[i].geometry,depthMeshes[i].material,depthMeshes[i].instanceMatrix,depthMeshes[i].instanceColor][j]))&&JSON.stringify(s)===depthStateBefore,'Balanced restores the same foreground resources without business mutation');
console.log('PASS: four real shop approaches use paired low planting beds at 0.615 route depth while retaining 5.35 m centres, clear interaction sightlines and thirteen-metre walks. DOM/WebGL mocked; no rendered depth, natural traversal, live co-op or FPS claim.');
const domesticStateBefore=JSON.stringify(s),domesticActiveBefore=active,domesticMeshes=[domesticWorkplace.boxMesh,domesticWorkplace.jarMesh],domesticResources=domesticMeshes.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]),domesticMatrix=new THREE.Matrix4(),domesticShown=(mesh,index)=>{mesh.getMatrixAt(index,domesticMatrix);return Math.abs(domesticMatrix.determinant())>1e-12;};
check(domesticWorkplace.drawCalls===2&&domesticWorkplace.profiles.length===3&&domesticWorkplace.counts.rails===3&&domesticWorkplace.counts.slots===12&&domesticWorkplace.counts.boxes===51&&domesticWorkplace.counts.jars===24&&domesticWorkplace.counts.colliders===0&&DOMESTIC_WORKPLACE_COLLIDERS.length===0,'three homes share exact wall-board, shelf-jar and four-slot rail batches with no new collider');
check(EQUIPMENT_REPETITION_SLOTS.join('|')==='can|trimmers|pack|mixer'&&domesticWorkplace.profiles.every(profile=>profile.decorativeOnly&&profile.lowestY===1.48&&profile.railWidth===3.2&&profile.slotSpacing===.72&&profile.slots.length===4&&domesticPanelInsideHome(profile,.1)&&blocked(profile.anchorX,profile.wallZ)),'every decorative cluster and equally spaced equipment rail is high, inside its room and mounted over an already solid wall');
check(domesticWorkplace.profiles.every(profile=>!colliders.some(collider=>collider.domesticWorkplace===profile.id)),'domestic dressing contributes no hidden floor or route blocker');
active=true;s.room=true;s.house=1;s.can=true;s.trimmers=false;s.packStation=true;s.mixer=false;renderFrame();check(JSON.stringify(domesticWorkplace.snapshot())===JSON.stringify(equipmentRepetitionState({active:true,room:true,home:1,can:true,packStation:true})),'actual render state selects Harbor and its owned equipment');
for(const mesh of domesticMeshes)for(const [index,item] of mesh.userData.items.entries())if(item.home>=0){const expected=item.home===1&&(item.slot==='rail'||item.slot==='can'||item.slot==='pack');check(domesticShown(mesh,index)===expected,'only Harbor rail and owned can/pack parts expand');}
s.house=2;s.can=false;s.trimmers=true;s.packStation=false;s.mixer=true;renderFrame();check(domesticWorkplace.snapshot().home===2&&domesticWorkplace.snapshot().owned.trimmers&&domesticWorkplace.snapshot().owned.mixer&&!domesticWorkplace.snapshot().owned.can&&!domesticWorkplace.snapshot().owned.pack,'actual render state retargets the same equipment layer to Hillside ownership');
for(const mesh of domesticMeshes)for(const [index,item] of mesh.userData.items.entries())if(item.home>=0){const expected=item.home===2&&(item.slot==='rail'||item.slot==='trimmers'||item.slot==='mixer');check(domesticShown(mesh,index)===expected,'only Hillside rail and owned trimmers/mixer parts expand');}
setQuality('performance');check(domesticMeshes.every(mesh=>mesh.visible&&!mesh.castShadow),'Performance keeps domestic silhouettes without shadow work');
setQuality('high');check(domesticMeshes.every(mesh=>mesh.castShadow),'High enables bounded domestic-dressing shadows');
setQuality('balanced');s=JSON.parse(domesticStateBefore);active=domesticActiveBefore;renderFrame();check(domesticWorkplace.boxMesh.castShadow&&!domesticWorkplace.jarMesh.castShadow&&domesticResources.every((resources,i)=>resources.every((resource,j)=>resource===[domesticMeshes[i],domesticMeshes[i].geometry,domesticMeshes[i].material,domesticMeshes[i].instanceMatrix,domesticMeshes[i].instanceColor][j]))&&JSON.stringify(s)===domesticStateBefore,'Balanced and restored state reuse the same domestic resources without business mutation');
console.log('PASS: three real production homes repeat exact four-slot rails; actual render state shows only the current workshop and owned can/trimmers/pack/mixer silhouettes in the existing two batches with no new collision. DOM/WebGL mocked; no rendered spacing, natural traversal, live co-op or FPS claim.');
const doorwayStateBefore=JSON.stringify(s),doorwayColliderCount=colliders.length,doorwayResources=[doorwayReveals.mesh,doorwayReveals.mesh.geometry,doorwayReveals.mesh.material,doorwayReveals.mesh.instanceMatrix,doorwayReveals.mesh.instanceColor];
check(doorwayReveals.drawCalls===1&&doorwayReveals.profiles.length===10&&doorwayReveals.counts.sites===10&&doorwayReveals.counts.parts===70&&doorwayReveals.counts.colliders===0&&DOORWAY_REVEAL_COLLIDERS.length===0,'ten actual walk-in buildings share seventy measured reveal parts in one batch with no new collider');
for(const profile of doorwayReveals.profiles){
 check(profile.parts.length===7&&profile.playerClearWidth>=6.55&&doorwayRevealCollisionAligned(profile,blocked),'visible jambs align to existing solid wall edges while the doorway centre remains open at '+profile.label);
 check(doorwayRevealPathClear(profile,blocked),'centre and two body-width entry lanes remain clear at '+profile.label);
 const walk=sweepWalk(profile.outside,profile.inside.x-profile.outside.x,profile.inside.z-profile.outside.z,blocked);check(Math.abs(walk.x-profile.inside.x)<1e-9&&Math.abs(walk.z-profile.inside.z)<1e-9&&!walk.hitX&&!walk.hitZ,'actual player-radius sweep crosses the reveal at '+profile.label);
}
check(doorwayReveals.mesh.userData.items.filter(part=>part.part.includes('return')||part.part.includes('edge')).every(part=>blocked(part.x,part.z)),'all visible side returns and jamb edges sit inside existing wall collision');
setQuality('performance');check(doorwayReveals.mesh.visible&&!doorwayReveals.mesh.castShadow&&!doorwayReveals.mesh.receiveShadow,'Performance keeps doorway depth without shadow work');
setQuality('high');check(doorwayReveals.mesh.castShadow&&doorwayReveals.mesh.receiveShadow,'High enables doorway reveal shadows');
setQuality('balanced');check(!doorwayReveals.mesh.castShadow&&doorwayReveals.mesh.receiveShadow&&doorwayResources.every((resource,index)=>resource===[doorwayReveals.mesh,doorwayReveals.mesh.geometry,doorwayReveals.mesh.material,doorwayReveals.mesh.instanceMatrix,doorwayReveals.mesh.instanceColor][index])&&colliders.length===doorwayColliderCount&&JSON.stringify(s)===doorwayStateBefore,'Balanced restores the same reveal resources without collision or business mutation');
console.log('PASS: ten actual walk-in buildings gain seven-part doorway depth; visible jambs coincide with existing wall collision and centre plus two body-width lanes pass real player-radius sweeps in one stable batch. DOM/WebGL mocked; no rendered interior-visibility or natural traversal claim.');
const windowConnectionStateBefore=JSON.stringify(s),windowConnectionColliderCount=colliders.length,windowConnectionResources=[windowConnections.mesh,windowConnections.mesh.geometry,windowConnections.mesh.material,windowConnections.mesh.instanceMatrix,windowConnections.mesh.instanceColor],opaqueFacadeBoxes=scene.children.filter(object=>object.isMesh&&!object.isInstancedMesh&&object.geometry?.type==='BoxGeometry'&&!object.material?.transparent),aperturePoint=new THREE.Vector3(),apertureClear=sample=>!opaqueFacadeBoxes.some(object=>new THREE.Box3().setFromObject(object).containsPoint(aperturePoint.set(sample.x,sample.y,sample.z)));
check(windowConnections.drawCalls===1&&windowConnections.profiles.length===11&&windowConnections.windows.length===22&&windowConnections.counts.sites===11&&windowConnections.counts.windows===22&&windowConnections.counts.parts===154&&windowConnections.counts.colliders===0&&WINDOW_CONNECTION_COLLIDERS.length===0,'all eleven real frontages share 154 measured reveal parts for 22 windows in one batch with no new collider');
check(facadeWindows.length===22&&facadeWindows.every(row=>row.mesh.material.transparent&&row.mesh.material.opacity===.42&&!row.mesh.material.depthWrite&&row.mesh.material.side===THREE.DoubleSide&&row.mesh.userData.windowConnection),'all actual frontage panes are bounded two-sided transparent reflective glass');
for(const profile of windowConnections.profiles)for(const window of profile.windows){
 const row=facadeWindows.find(candidate=>candidate.x===profile.x&&candidate.z===profile.z&&candidate.side===window.side);check(!!row,'actual pane exists for '+window.id);
 check(windowConnectionAligned(window,{x:row.mesh.position.x,y:row.mesh.position.y,z:row.mesh.position.z,width:profile.paneWidth,height:profile.paneHeight}),'actual pane aligns to the measured opening at '+window.id);
 check(blocked(window.x,window.frontZ),'window retains the original physical wall collision at '+window.id);
 check(windowApertureSamples(window).every(apertureClear),'four off-mullion visual rays cross the cut facade at '+window.id);
}
setQuality('performance');check(windowConnections.mesh.visible&&!windowConnections.mesh.castShadow&&!windowConnections.mesh.receiveShadow,'Performance keeps window depth without shadow work');
setQuality('high');check(windowConnections.mesh.castShadow&&windowConnections.mesh.receiveShadow,'High enables recessed window shadows');
setQuality('balanced');check(!windowConnections.mesh.castShadow&&windowConnections.mesh.receiveShadow&&windowConnectionResources.every((resource,index)=>resource===[windowConnections.mesh,windowConnections.mesh.geometry,windowConnections.mesh.material,windowConnections.mesh.instanceMatrix,windowConnections.mesh.instanceColor][index])&&colliders.length===windowConnectionColliderCount&&JSON.stringify(s)===windowConnectionStateBefore,'Balanced restores the same window resources without collision or business mutation');
console.log('PASS: all 22 actual frontage panes now occupy real visual openings with transparent reflective glass, seven-part depth and four clear off-mullion aperture rays while retaining the original physical wall collision. DOM/WebGL mocked; no rendered inside/outside, live co-op or FPS claim.');
const ordinaryStateBefore=JSON.stringify(s),ordinaryColliderCount=colliders.length,ordinaryMeshes=[ordinaryUnusualWork.boxMesh,ordinaryUnusualWork.cylinderMesh],ordinaryResources=ordinaryMeshes.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]);
check(ordinaryUnusualWork.drawCalls===2&&ordinaryUnusualWork.profiles.length===3&&ordinaryUnusualWork.counts.sites===3&&ordinaryUnusualWork.counts.boxes===36&&ordinaryUnusualWork.counts.cylinders===18&&ordinaryUnusualWork.counts.parts===54&&ordinaryUnusualWork.counts.colliders===0&&ORDINARY_UNUSUAL_COLLIDERS.length===0,'three production homes share exact ordinary/work detail counts in two batches with no new collider');
for(const profile of ordinaryUnusualWork.profiles){
 const pair=ordinaryUnusualPairing(profile),windows=WINDOW_CONNECTION_PROFILES.find(candidate=>candidate.id===profile.id);check(pair.domestic===8&&pair.work===10&&ordinaryUnusualInsideHome(profile),'domestic and production details remain bounded inside '+profile.label);
 check(windows&&windows.windows[0].x===profile.domesticX&&windows.windows[1].x===profile.workX&&profile.insideZ<windows.frontZ-.5,'ordinary and stage-specific work clusters align behind the two real windows at '+profile.label);
 check(pair.stages.some(part=>part.includes(profile.stage==='mould'?'cooling-tray':profile.stage==='pack'?'pack-caddy':'mix-bottle')),'home keeps its distinct '+profile.stage+' production clue');
}
check(ordinaryMeshes.flatMap(mesh=>mesh.userData.items).every(part=>!colliders.some(collider=>collider.ordinaryUnusual===part.site)),'ordinary/work dressing contributes no hidden route blocker');
setQuality('performance');check(ordinaryMeshes.every(mesh=>mesh.visible&&!mesh.castShadow&&!mesh.receiveShadow),'Performance keeps paired room identity without shadow work');
setQuality('high');check(ordinaryMeshes.every(mesh=>mesh.castShadow&&mesh.receiveShadow),'High enables paired interior-detail shadows');
setQuality('balanced');check(ordinaryMeshes.every(mesh=>!mesh.castShadow&&mesh.receiveShadow)&&ordinaryResources.every((resources,i)=>resources.every((resource,j)=>resource===[ordinaryMeshes[i],ordinaryMeshes[i].geometry,ordinaryMeshes[i].material,ordinaryMeshes[i].instanceMatrix,ordinaryMeshes[i].instanceColor][j]))&&colliders.length===ordinaryColliderCount&&JSON.stringify(s)===ordinaryStateBefore,'Balanced restores the same paired-detail resources without collision or business mutation');
console.log('PASS: Room 04, Harbor and Hillside pair ordinary shelves/photos/mugs with distinct mould, pack and mix clues behind their real windows in two stable batches and zero collision. DOM/WebGL mocked; no rendered domestic/work identity, live co-op or FPS claim.');
const publicServiceStateBefore=JSON.stringify(s),publicServiceColliderCount=colliders.length,publicServiceMeshes=[publicServiceFronts.boxMesh,publicServiceFronts.cylinderMesh],publicServiceResources=publicServiceMeshes.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]);
check(publicServiceFronts.drawCalls===2&&publicServiceFronts.profiles.length===8&&publicServiceFronts.counts.sites===8&&publicServiceFronts.counts.boxes===80&&publicServiceFronts.counts.cylinders===16&&publicServiceFronts.counts.parts===96&&publicServiceFronts.counts.public===48&&publicServiceFronts.counts.service===48&&publicServiceFronts.counts.colliders===0&&PUBLIC_SERVICE_COLLIDERS.length===0,'eight real businesses share exact public-front and service-back counts in two batches with no new collider');
check(new Set(publicServiceFronts.profiles.map(profile=>profile.cue)).size===8,'all eight rear service families retain a distinct authored cue');
for(const profile of publicServiceFronts.profiles){
 const source=WINDOW_CONNECTION_PROFILES.find(candidate=>candidate.id===profile.id),parts=[...profile.boxes,...profile.cylinders];check(source&&source.x===profile.x&&source.z===profile.z&&source.w===profile.w&&source.d===profile.d,'public/service dressing matches the actual building footprint at '+profile.label);
 check(publicServiceOpposed(profile)&&publicServiceMounted(profile)&&parts.filter(part=>part.role==='public').length===6&&parts.filter(part=>part.role==='service').length===6,'welcoming and service cues stay mounted on opposite walls at '+profile.label);
 check(blocked(profile.publicX,profile.frontZ)&&blocked(profile.serviceX,profile.rearZ),'front notice and rear service door coincide with existing wall collision at '+profile.label);
 check(parts.every(part=>part.y-part.h/2>=.18),'all front/back details remain wall-mounted above the walk surface at '+profile.label);
}
check(publicServiceMeshes.flatMap(mesh=>mesh.userData.items).every(part=>!colliders.some(collider=>collider.publicService===part.site)),'public/service dressing contributes no hidden route blocker');
setQuality('performance');check(publicServiceMeshes.every(mesh=>mesh.visible&&!mesh.castShadow&&!mesh.receiveShadow),'Performance keeps front/back identity without shadow work');
setQuality('high');check(publicServiceMeshes.every(mesh=>mesh.castShadow&&mesh.receiveShadow),'High enables public/service detail shadows');
setQuality('balanced');check(publicServiceMeshes.every(mesh=>!mesh.castShadow&&mesh.receiveShadow)&&publicServiceResources.every((resources,i)=>resources.every((resource,j)=>resource===[publicServiceMeshes[i],publicServiceMeshes[i].geometry,publicServiceMeshes[i].material,publicServiceMeshes[i].instanceMatrix,publicServiceMeshes[i].instanceColor][j]))&&colliders.length===publicServiceColliderCount&&JSON.stringify(s)===publicServiceStateBefore,'Balanced restores the same public/service resources without collision or business mutation');
console.log('PASS: eight real businesses pair six welcoming frontage cues with six distinct rear-service cues on opposite existing walls in two stable batches and zero collision. DOM/WebGL mocked; no rendered front/back identity, live co-op or FPS claim.');
const alleyStateBefore=JSON.stringify(s),alleyColliderCount=colliders.length,alleyMeshes=[narrowAlleys.boxMesh,narrowAlleys.cylinderMesh],alleyResources=alleyMeshes.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]);
check(narrowAlleys.drawCalls===2&&narrowAlleys.profiles.length===4&&narrowAlleys.counts.alleys===4&&narrowAlleys.counts.boxes===28&&narrowAlleys.counts.cylinders===8&&narrowAlleys.counts.parts===36&&narrowAlleys.counts.colliders===4&&NARROW_ALLEY_COLLIDERS.length===4,'four real service alleys share exact screen, detail and collider counts in two batches');
for(const profile of narrowAlleys.profiles){
 check(Math.abs(profile.clearWidth-3.165)<1e-9&&profile.collider.w===profile.screenLength+.65&&profile.collider.d===profile.screenDepth+.65,'measured wall and screen padding leaves a 3.165 m lane at '+profile.label);
 check(colliders.some(collider=>collider.narrowAlley===profile.id)&&blocked(profile.x,profile.screenZ)&&blocked(profile.x,profile.rearZ),'visible screen and existing rear wall form two solid sides at '+profile.label);
 check(narrowAlleyPathClear(profile,blocked)&&segmentClear(profile.left,profile.right,blocked),'resident line sampling crosses the complete lane at '+profile.label);
 const walk=sweepWalk(profile.left,profile.right.x-profile.left.x,profile.right.z-profile.left.z,blocked);check(Math.hypot(walk.x-profile.right.x,walk.z-profile.right.z)<1e-9&&!walk.hitX&&!walk.hitZ,'actual player-radius sweep crosses '+profile.label);
 const cameraSamples=narrowAlleyPathSamples(profile);check(cameraSamples.every(point=>playerHeadFits({ground:floorHeight(point.x,point.z),crouch:0,jump:0,ceiling:ceilingHeight(point.x,point.z)})),'standing first-person camera retains head clearance through '+profile.label);
 const cop={x:profile.left.x,z:profile.left.z,angle:0};for(let step=0;step<100&&Math.hypot(cop.x-profile.right.x,cop.z-profile.right.z)>.08;step++)moveCop(cop,99,profile.right,8.2,.06);check(Math.hypot(cop.x-profile.right.x,cop.z-profile.right.z)<=.08&&!blocked(cop.x,cop.z),'actual pursuit mover reaches the far end of '+profile.label);
}
setQuality('performance');check(alleyMeshes.every(mesh=>mesh.visible&&!mesh.castShadow&&!mesh.receiveShadow),'Performance keeps all narrow-alley boundaries without shadow work');
setQuality('high');check(alleyMeshes.every(mesh=>mesh.castShadow&&mesh.receiveShadow),'High enables narrow-alley screen and pipe shadows');
setQuality('balanced');check(alleyMeshes.every(mesh=>mesh.castShadow&&mesh.receiveShadow)&&alleyResources.every((resources,i)=>resources.every((resource,j)=>resource===[alleyMeshes[i],alleyMeshes[i].geometry,alleyMeshes[i].material,alleyMeshes[i].instanceMatrix,alleyMeshes[i].instanceColor][j]))&&colliders.length===alleyColliderCount&&JSON.stringify(s)===alleyStateBefore,'Balanced restores the same alley resources without collision growth or business mutation');
console.log('PASS: four measured 3.165 m alleys keep the actual standing camera, resident line passage, player sweep and police pursuit mover clear between solid rear walls and service screens. DOM/WebGL mocked; no rendered or natural pursuit claim.');
const shopStateBefore=JSON.stringify(s),shopMeshes=[shopApproaches.boxMesh,shopApproaches.cylinderMesh,shopApproaches.coneMesh],shopResources=shopMeshes.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]);
check(shopApproaches.drawCalls===3&&shopApproaches.profiles.length===4&&shopApproaches.counts.boxes===21&&shopApproaches.counts.cylinders===11&&shopApproaches.counts.cones===3&&shopApproaches.counts.colliders===8,'four distinct shop entrances share exact box, cylinder, cone and side-post counts');
check(new Set(shopApproaches.profiles.map(profile=>profile.kind)).size===4&&new Set(shopApproaches.profiles.map(profile=>profile.signature)).size===4,'leaf arch, striped awning, braced tool portal and droplet totem keep unique geometry signatures');
for(const profile of shopApproaches.profiles){
 check(profile.colliders.every(collider=>SHOP_APPROACH_COLLIDERS.some(item=>item.shopApproach===collider.shopApproach)&&colliders.some(item=>item.shopApproach===collider.shopApproach))&&profile.posts.every(post=>blocked(post.x,post.z)),'both visible entrance posts have exact shared collision at '+profile.label);
 check(shopApproachSightlineClear(profile)&&profile.centralClearWidth>=3.8&&!blocked(profile.view.x,profile.view.z)&&!blocked(profile.target.x,profile.target.z)&&!blocked(profile.anchor.x,profile.anchor.z),'the view, interaction target and entrance centre stay open at '+profile.label);
 const walk=sweepWalk(profile.view,profile.target.x-profile.view.x,profile.target.z-profile.view.z,blocked);
 check(Math.abs(walk.x-profile.target.x)<1e-9&&Math.abs(walk.z-profile.target.z)<1e-9&&!walk.hitX&&!walk.hitZ,'thirteen-metre interaction approach reaches '+profile.label);
}
setQuality('performance');check(shopMeshes.every(mesh=>mesh.visible&&!mesh.castShadow),'Performance keeps every entrance silhouette without shadow work');
setQuality('high');check(shopApproaches.boxMesh.castShadow&&shopApproaches.cylinderMesh.castShadow&&!shopApproaches.coneMesh.castShadow,'High shades entrance structure while keeping small cap shadows disabled');
setQuality('balanced');check(shopApproaches.boxMesh.castShadow&&!shopApproaches.cylinderMesh.castShadow&&!shopApproaches.coneMesh.castShadow&&shopResources.every((resources,i)=>resources.every((resource,j)=>resource===[shopMeshes[i],shopMeshes[i].geometry,shopMeshes[i].material,shopMeshes[i].instanceMatrix,shopMeshes[i].instanceColor][j]))&&JSON.stringify(s)===shopStateBefore,'Balanced restores the same entrance resources without business mutation');
console.log('PASS: four actual expanded-town shops have unique entrance signatures, exact side-post collision, at least 3.8 m clear centres and unobstructed interaction walks in three stable batches. DOM/WebGL mocked; no rendered recognition, natural traversal, live co-op or FPS claim.');
const wearStateBefore=JSON.stringify(s),wearColliderCount=colliders.length,wearResources=[logicalWear.mesh,logicalWear.mesh.geometry,logicalWear.mesh.material,logicalWear.mesh.instanceMatrix,logicalWear.mesh.instanceColor];
check(logicalWear.drawCalls===1&&logicalWear.counts.marks===34&&logicalWear.counts.footfall===8&&logicalWear.counts.tyre===10&&logicalWear.counts.tread===16&&logicalWear.mesh.count===34&&LOGICAL_WEAR_COLLIDERS.length===0,'shop, parking and terrace contact wear shares one exact zero-collision batch');
check(shopApproaches.profiles.every(profile=>{const marks=logicalWear.marks.filter(mark=>mark.source===profile.id);return marks.length===2&&marks.every(mark=>!logicalWearCoversPoint(mark,profile.target.x,profile.target.z,.2));}),'shop footfall lanes stay clear of all four interaction targets');
check(PARKING_BAYS.every(bay=>{const marks=logicalWear.marks.filter(mark=>mark.source===bay.label);return marks.length===2&&marks.every(mark=>mark.ry===bay.angle&&Math.hypot(mark.x-bay.x,mark.z-bay.z)>.5&&Math.hypot(mark.x-bay.x,mark.z-bay.z)<.6);})&&logicalWear.marks.filter(mark=>mark.kind==='tread').every(mark=>mark.w<VERTICAL_TOWN_LAYER.width&&mark.y<=VERTICAL_TOWN_LAYER.height+.006),'tyre paths align with every bay and tread wear stays inside the terrace');
for(let i=0;i<logicalWear.mesh.count;i++){const matrix=new THREE.Matrix4();logicalWear.mesh.getMatrixAt(i,matrix);check(matrix.elements.every(Number.isFinite),'logical wear matrices stay finite');}
setQuality('performance');check(logicalWear.mesh.visible&&!logicalWear.mesh.castShadow&&!logicalWear.mesh.receiveShadow,'Performance keeps contact cues without shadow receiving');
setQuality('balanced');check(logicalWear.mesh.receiveShadow&&wearResources.every((resource,i)=>resource===[logicalWear.mesh,logicalWear.mesh.geometry,logicalWear.mesh.material,logicalWear.mesh.instanceMatrix,logicalWear.mesh.instanceColor][i])&&colliders.length===wearColliderCount&&JSON.stringify(s)===wearStateBefore,'Balanced restores the same wear resources without collision or business mutation');
console.log('PASS: 34 low contact marks explain shop footfall, parking tyre paths and terrace tread edges in one stable batch while keeping interaction targets and collision clear. DOM/WebGL mocked; no rendered wear claim.');
const containerStateBefore=JSON.stringify(s),containerMeshes=[productionContainers.boxMesh,productionContainers.cylinderMesh,productionContainers.sphereMesh],containerResources=containerMeshes.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]);
check(productionContainers.drawCalls===3&&productionContainers.profiles.length===3&&productionContainers.counts.stages===9&&productionContainers.counts.boxes===54&&productionContainers.counts.cylinders===9&&productionContainers.counts.spheres===9&&productionContainers.counts.colliders===0&&PRODUCTION_CONTAINER_COLLIDERS.length===0,'three workshop tables share exact harvest, loose-gummy and finished-pack container batches with no new collider');
check(productionContainers.profiles.every((profile,i)=>profile.table.x===HOMES[i].x+7&&profile.table.z===HOMES[i].z+3&&productionContainersOnTable(profile)&&blocked(profile.table.x,profile.table.z)&&new Set(profile.stages.map(stage=>stage.shape)).size===3),'every stage trio sits on an existing solid worktable with three distinct silhouettes');
check(productionContainers.profiles.every(profile=>!colliders.some(collider=>collider.productionContainer===profile.id)),'production containers add no hidden route blocker');
renderFrame();check(!productionContainers.snapshot().visible,'unrented title/fresh workshop shows no phantom production containers');
s.room=true;s.house=0;s.raw[0]=4;s.raw[2]=1;s.gummies[1]=2;s.gummies[2]=1;s.packs[0]=3;s.packs[1]=1;renderFrame();const containerRoomView=productionContainers.snapshot();
check(containerRoomView.visible&&containerRoomView.home===0&&containerRoomView.stages.harvest.total===5&&containerRoomView.stages.harvest.slots.join(',')==='0,2,0'&&containerRoomView.stages.shape.slots.join(',')==='1,2,1'&&containerRoomView.stages.pack.slots.join(',')==='0,1,0','active Room 04 containers project truthful bounded stage inventory with flavour variety before repeats');
const roomMatrices=containerMeshes.map(mesh=>Array.from(mesh.instanceMatrix.array));s.house=1;renderFrame();check(productionContainers.snapshot().home===1&&containerMeshes.some((mesh,i)=>Array.from(mesh.instanceMatrix.array).some((value,j)=>value!==roomMatrices[i][j])),'moving production to Harbor retargets the same container batches to the active table');
setQuality('performance');check(containerMeshes.every(mesh=>mesh.visible&&!mesh.castShadow),'Performance keeps stage-container silhouettes without shadow work');
setQuality('high');check(containerMeshes.every(mesh=>mesh.castShadow),'High enables bounded stage-container shadows');
s=JSON.parse(containerStateBefore);renderFrame();setQuality('balanced');check(!productionContainers.snapshot().visible&&productionContainers.boxMesh.castShadow&&!productionContainers.cylinderMesh.castShadow&&!productionContainers.sphereMesh.castShadow&&containerResources.every((resources,i)=>resources.every((resource,j)=>resource===[containerMeshes[i],containerMeshes[i].geometry,containerMeshes[i].material,containerMeshes[i].instanceMatrix,containerMeshes[i].instanceColor][j]))&&JSON.stringify(s)===containerStateBefore,'Balanced and restored fresh state reuse exact resources without business mutation or inactive-home ghosts');
console.log('PASS: the active real worktable uses distinct harvest basket, loose-gummy mould and finished-pack caddy silhouettes driven by real bounded stock; other homes collapse with no collision or business mutation. DOM/WebGL mocked; no rendered stage recognition, live co-op or FPS claim.');
const outfitStateBefore=JSON.stringify(s),outfitMeshes=[occupationalOutfits.boxMesh,occupationalOutfits.cylinderMesh],outfitResources=outfitMeshes.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]),outfitBodies=colliders.length;
check(occupationalOutfits.drawCalls===2&&occupationalOutfits.counts.actors===13&&occupationalOutfits.counts.roles===8&&occupationalOutfits.counts.boxes===77&&occupationalOutfits.counts.cylinders===9&&occupationalOutfits.counts.colliders===0&&OCCUPATIONAL_OUTFIT_COLLIDERS.length===0,'all 13 authored vendors use eight role-specific outfit languages in two batches with no collision');
check(occupationalOutfits.entries.every(entry=>points.some(point=>point.actor===entry.actor&&point.type===entry.type)&&entry.parts.every(part=>part.y-part.h/2>=.58&&part.y+part.h/2<=1.5)),'every outfit belongs to an authored occupational interaction and keeps the face and legs clear');
check(new Set(occupationalOutfits.entries.map(entry=>entry.type)).size===OCCUPATIONAL_OUTFIT_PROFILES.length&&new Set(OCCUPATIONAL_OUTFIT_PROFILES.map(profile=>occupationOutfitParts(profile.type).map(part=>part.part).join('|'))).size===8,'all eight occupations have distinct original part signatures');
active=true;renderFrame();const outfitMatrix=new THREE.Matrix4();occupationalOutfits.boxMesh.getMatrixAt(0,outfitMatrix);check(outfitMatrix.elements.every(Number.isFinite)&&Math.hypot(outfitMatrix.elements[12]-occupationalOutfits.entries[0].actor.position.x,outfitMatrix.elements[14]-occupationalOutfits.entries[0].actor.position.z)<1,'outfit batch follows its actor at a finite chest position');
const outfitActor=occupationalOutfits.entries[0].actor,outfitRotation=outfitActor.rotation.y,beforeOutfitTurn=outfitMatrix.clone();outfitActor.rotation.y+=.5;renderFrame();occupationalOutfits.boxMesh.getMatrixAt(0,outfitMatrix);check(outfitMatrix.elements.some((value,index)=>value!==beforeOutfitTurn.elements[index]),'outfit batch follows actor conversation turns');outfitActor.rotation.y=outfitRotation;
active=false;renderFrame();occupationalOutfits.boxMesh.getMatrixAt(0,outfitMatrix);check(Math.abs(outfitMatrix.determinant())<1e-12,'title state collapses outfit instances');active=true;
setQuality('performance');check(!occupationalOutfits.boxMesh.castShadow&&!occupationalOutfits.cylinderMesh.castShadow,'Performance keeps outfit silhouettes without outfit shadow work');setQuality('high');check(occupationalOutfits.boxMesh.castShadow&&occupationalOutfits.cylinderMesh.castShadow,'High shades both outfit batches');setQuality('balanced');
check(outfitResources.every((resources,i)=>resources.every((resource,j)=>resource===[outfitMeshes[i],outfitMeshes[i].geometry,outfitMeshes[i].material,outfitMeshes[i].instanceMatrix,outfitMeshes[i].instanceColor][j]))&&colliders.length===outfitBodies&&JSON.stringify(s)===outfitStateBefore,'quality and actor turns reuse exact outfit resources without collision or business mutation');
console.log('PASS: 13 actual occupational vendors carry eight face-clear role outfits in two dynamic instanced batches; actor turns, title collapse and quality reuse preserve collision and business state. DOM/WebGL mocked; no rendered-distance or face-prominence claim.');
const accessoryStateBefore=JSON.stringify(s),accessoryMeshes=[residentAccessories.boxMesh,residentAccessories.cylinderMesh],accessoryResources=accessoryMeshes.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]),accessoryBodies=colliders.length;
check(residentAccessories.drawCalls===2&&residentAccessories.counts.actors===13&&residentAccessories.counts.styles===8&&residentAccessories.counts.boxes===33&&residentAccessories.counts.cylinders===23&&residentAccessories.counts.colliders===0&&RESIDENT_ACCESSORY_COLLIDERS.length===0,'all 13 authored vendors use eight head-accessory silhouettes in two batches with no collision');
check(residentAccessories.entries.every(entry=>points.some(point=>point.actor===entry.actor&&point.type===entry.type)&&entry.parts.every(part=>part.y+part.h/2<=2.55&&((part.y-part.h/2>=2.02)||Math.abs(part.x)-(part.w??part.r*2)/2>=.28))),'every accessory belongs to an authored resident and keeps the front face open');
check(new Set(residentAccessories.entries.map(entry=>entry.profile.style)).size===RESIDENT_ACCESSORY_PROFILES.length&&new Set(RESIDENT_ACCESSORY_PROFILES.map(profile=>residentAccessoryParts(profile.type).map(part=>part.part).join('|'))).size===8,'all eight resident roles have distinct original accessory signatures');
active=true;renderFrame();const accessoryMatrix=new THREE.Matrix4();residentAccessories.boxMesh.getMatrixAt(0,accessoryMatrix);check(accessoryMatrix.elements.every(Number.isFinite)&&Math.hypot(accessoryMatrix.elements[12]-residentAccessories.entries[0].actor.position.x,accessoryMatrix.elements[14]-residentAccessories.entries[0].actor.position.z)<1,'accessory batch follows its actor at a finite head position');
const accessoryActor=residentAccessories.entries[0].actor,accessoryRotation=accessoryActor.rotation.y,beforeAccessoryTurn=accessoryMatrix.clone();accessoryActor.rotation.y+=.45;renderFrame();residentAccessories.boxMesh.getMatrixAt(0,accessoryMatrix);check(accessoryMatrix.elements.some((value,index)=>value!==beforeAccessoryTurn.elements[index]),'accessory batch follows actor conversation turns');accessoryActor.rotation.y=accessoryRotation;
active=false;renderFrame();residentAccessories.boxMesh.getMatrixAt(0,accessoryMatrix);check(Math.abs(accessoryMatrix.determinant())<1e-12,'title state collapses head-accessory instances');active=true;
setQuality('performance');check(!residentAccessories.boxMesh.castShadow&&!residentAccessories.cylinderMesh.castShadow,'Performance keeps accessory silhouettes without accessory shadow work');setQuality('high');check(residentAccessories.boxMesh.castShadow&&residentAccessories.cylinderMesh.castShadow,'High shades both accessory batches');setQuality('balanced');
check(accessoryResources.every((resources,i)=>resources.every((resource,j)=>resource===[accessoryMeshes[i],accessoryMeshes[i].geometry,accessoryMeshes[i].material,accessoryMeshes[i].instanceMatrix,accessoryMeshes[i].instanceColor][j]))&&colliders.length===accessoryBodies&&JSON.stringify(s)===accessoryStateBefore,'quality and actor turns reuse exact accessory resources without collision or business mutation');
console.log('PASS: 13 actual occupational residents carry eight face-open head-accessory silhouettes in two dynamic instanced batches; actor turns, title collapse and quality reuse preserve collision and business state. DOM/WebGL mocked; no rendered-recognition claim.');
const nightStateBefore=JSON.stringify(s),nightColliderCount=colliders.length,nightMeshes=[nightSilhouettes.residentMesh,nightSilhouettes.obstacleMesh],nightResources=nightMeshes.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix]);
check(nightSilhouettes.drawCalls===2&&nightSilhouettes.counts.actors===avatars.length&&nightSilhouettes.counts.actors===34&&nightSilhouettes.counts.residentBands===68&&nightSilhouettes.counts.obstacles===8&&nightSilhouettes.counts.obstacleTags===16&&nightSilhouettes.counts.parts===84&&nightSilhouettes.counts.colliders===0&&NIGHT_SILHOUETTE_COLLIDERS.length===0,'all 34 resident roots and eight solid street obstacles share exact two-batch night-silhouette counts without new collision · '+JSON.stringify({avatars:avatars.length,counts:nightSilhouettes.counts,obstacles:nightSilhouettes.obstacleProfiles.length}));
check(nightSilhouettes.obstacleProfiles.every(profile=>contextualStreetProps.profiles.some(item=>item.id===profile.id)&&profile.tags.every(tag=>blocked(tag.x,tag.z))),'every reflector tab is mounted inside an existing visible solid street-prop footprint');
const nightTime=s.time,nightActor=avatars[0],nightActorX=nightActor.position.x,nightMatrix=new THREE.Matrix4();active=true;s.time=0;renderFrame();nightSilhouettes.residentMesh.getMatrixAt(0,nightMatrix);check(nightMeshes.every(mesh=>mesh.visible&&!mesh.castShadow)&&nightMeshes.every(mesh=>Math.abs(mesh.material.emissiveIntensity-.56)<1e-12)&&nightMatrix.elements.every(Number.isFinite)&&Math.hypot(nightMatrix.elements[12]-nightActor.position.x,nightMatrix.elements[14]-nightActor.position.z)<.01,'actual midnight render raises bounded emission and follows the first resident root');
const beforeNightMove=nightMatrix.clone();nightActor.position.x+=.4;renderFrame();nightSilhouettes.residentMesh.getMatrixAt(0,nightMatrix);check(nightMatrix.elements.some((value,index)=>value!==beforeNightMove.elements[index]),'resident night bands follow actual actor movement');nightActor.position.x=nightActorX;
s.time=720;renderFrame();check(nightMeshes.every(mesh=>Math.abs(mesh.material.emissiveIntensity-.04)<1e-12),'actual midday render returns both batches to restrained non-emissive trim');
active=false;renderFrame();check(nightMeshes.every(mesh=>!mesh.visible),'title collapses resident and obstacle night accents');active=true;s.time=nightTime;renderFrame();
setQuality('performance');check(nightMeshes.every(mesh=>mesh.visible&&!mesh.castShadow&&!mesh.receiveShadow),'Performance retains night silhouettes without shadow work');setQuality('high');check(nightMeshes.every(mesh=>mesh.visible&&!mesh.castShadow&&mesh.receiveShadow),'High receives world shading but adds no silhouette shadow');setQuality('balanced');
check(nightResources.every((resources,i)=>resources.every((resource,j)=>resource===[nightMeshes[i],nightMeshes[i].geometry,nightMeshes[i].material,nightMeshes[i].instanceMatrix][j]))&&colliders.length===nightColliderCount&&JSON.stringify(s)===nightStateBefore,'night updates reuse exact resources without collision or business mutation');
console.log('PASS: all 25 moving resident roots carry two face-clear reflective bands and all eight existing solid street obstacles carry paired low tabs; actual midnight/day/title/quality states reuse two batches with no new collision. DOM/WebGL mocked; no rendered unlit-route recognition claim.');
const townDetailMaps=[districtArchitecture.massMesh.material.map,districtArchitecture.roofMesh.material.map,streetConstruction.hardscapeMesh.material.map];
check(townDetailMaps.every(map=>map?.isDataTexture&&['mineral','roof','concrete'].includes(map.userData.townSurface))&&new Set(townDetailMaps).size===3,'architecture mass, roof and hardscape use three distinct original procedural detail maps');
check(!districtArchitecture.detailMesh.material.map&&!streetConstruction.markingMesh.material.map&&!verticalTown.detailMesh.material.map&&!contextualStreetProps.boxMesh.material.map&&!contextualStreetProps.cylinderMesh.material.map,'trim, safety markings and street props retain clean untextured material tiers');
let characterTownMaps=0;for(const actor of visualActors)actor.g.traverse(object=>{if(!object.isMesh)return;for(const material of Array.isArray(object.material)?object.material:[object.material])if(material?.map?.userData?.townSurface)characterTownMaps++;});
check(characterTownMaps===0,'procedural town microdetail never touches original character materials');
const materialStateBefore=JSON.stringify(s),materialMapsBefore=townDetailMaps.slice();setQuality('performance');setQuality('balanced');
check(townDetailMaps.every((map,i)=>map===materialMapsBefore[i])&&JSON.stringify(s)===materialStateBefore,'quality changes reuse material maps without business mutation');
console.log('PASS: actual scene separates textured mineral masses/roofs/hardscape from clean trim/markings/props and leaves every original character material untouched; three shared deterministic maps. DOM/WebGL mocked; no rendered hierarchy or GPU claim.');
function actualInstanceColors(mesh){const values=new Set(),color=new THREE.Color();for(let i=0;i<mesh.count;i++){mesh.getColorAt(i,color);values.add(color.getHex());}return values;}
const actualMassColors=actualInstanceColors(districtArchitecture.massMesh),actualMarkingColors=actualInstanceColors(streetConstruction.markingMesh),actualHardscapeColors=actualInstanceColors(streetConstruction.hardscapeMesh),actualTerraceColors=actualInstanceColors(verticalTown.detailMesh),actualPropBoxColors=actualInstanceColors(contextualStreetProps.boxMesh),actualPropCylinderColors=actualInstanceColors(contextualStreetProps.cylinderMesh);
check(districtArchitecture.profiles.every(p=>{const district=townDistrictPalette(p.x,p.z);return p.district===district.district&&p.palette.key===district.palette.key&&p.palette.wall===district.palette.wall&&actualMassColors.has(p.palette.wall); }),'every real district building resolves to and displays its named shared palette');
check(['crossing','parking'].every(role=>actualMarkingColors.has(townRoleColor(role)))&&['hardscapeA','curb','tactile'].every(role=>actualHardscapeColors.has(townRoleColor(role))),'actual street batches retain coordinated neutral surfaces and distinct safety accents');
check(actualTerraceColors.has(townRoleColor('streetMetal'))&&actualTerraceColors.has(townRoleColor('wood'))&&actualPropBoxColors.has(townRoleColor('service'))&&actualPropCylinderColors.has(townRoleColor('emergency')),'terrace and contextual installations share the coordinated town roles');
const paletteStateBefore=JSON.stringify(s),paletteResources=[districtArchitecture.massMesh.instanceColor,streetConstruction.markingMesh.instanceColor,streetConstruction.hardscapeMesh.instanceColor,verticalTown.detailMesh.instanceColor,contextualStreetProps.boxMesh.instanceColor];setQuality('performance');setQuality('balanced');
check(paletteResources.every((resource,i)=>resource===[districtArchitecture.massMesh.instanceColor,streetConstruction.markingMesh.instanceColor,streetConstruction.hardscapeMesh.instanceColor,verticalTown.detailMesh.instanceColor,contextualStreetProps.boxMesh.instanceColor][i])&&JSON.stringify(s)===paletteStateBefore,'quality changes reuse palette attributes without business mutation');
console.log('PASS: actual scene assigns all 60 buildings to named district palettes and keeps crossing, tactile, parking, service and emergency roles distinct on existing batches; DOM/WebGL mocked, no rendered palette claim.');

// Physical visits become useful persistent memories without menu-spam counts.
const hardwareVisit=points.find(p=>p.type==='hardware');player.set(hardwareVisit.x,1.72,hardwareVisit.z);near=hardwareVisit;act();
check(s.visits.hardware.count===1&&$('modal').innerHTML.includes('Visit 1 · last here Day 1 at 09:00')&&$('modal').innerHTML.includes('Hank points out'),'first physical shop visit recorded and presented');
close();act();check(s.visits.hardware.count===1,'reopening place in the same minute does not add a visit');
close();s.time+=10;act();check(s.visits.hardware.count===2&&$('modal').innerHTML.includes('Hank remembers your setup'),'return visit gets persistent authored recognition');
close();save();s.visits={};load('story',2,false);check(s.visits.hardware.count===2,'location memory survives reload');
let legacyVisit=JSON.parse(localStorage.getItem('gummybay-v3-story-2'));delete legacyVisit.visits;localStorage.setItem('gummybay-v3-story-2',JSON.stringify(legacyVisit));load('story',2,false);check(Object.keys(s.visits).length===0,'legacy save without visits remains compatible');
const hardwarePose={x:hardwareVisit.x,y:1.72,z:hardwareVisit.z,yaw:0},hostPose=player.clone(),sent=[];net.role='host';net.connected=true;net.remote=hardwarePose;
const visitChannel={readyState:'open',send(payload){sent.push(JSON.parse(payload))},close(){}};wireChannel(visitChannel);visitChannel.onmessage({data:JSON.stringify({type:'position',player:hardwarePose})});
visitChannel.onmessage({data:JSON.stringify({type:'action',seq:1,k:'visitPlace',a:'hardware',x:hardwareVisit.x,z:hardwareVisit.z})});check(s.visits.hardware.count===1,'host commits a partner visit');
visitChannel.onmessage({data:JSON.stringify({type:'action',seq:1,k:'visitPlace',a:'hardware',x:hardwareVisit.x,z:hardwareVisit.z})});check(s.visits.hardware.count===1&&sent.some(m=>m.type==='ack'&&m.seq===1),'replayed partner visit is acknowledged without duplication');
visitChannel.onmessage({data:JSON.stringify({type:'action',seq:2,k:'visitPlace',a:'dealer',x:hardwareVisit.x,z:hardwareVisit.z})});check(!s.visits.dealer&&sent.some(m=>m.type==='ack'&&m.seq===2&&m.error),'partner cannot forge a different place from this shop');check(player.equals(hostPose),'partner visit restores host pose');
net.role='solo';net.connected=false;load('story',2,true);console.log('PASS: real physical first/return visit, anti-spam, v3 save/reload, legacy migration and host-authoritative replay-safe co-op place memory; DOM/WebGL/channels mocked.');

// Audit the actual authored town lettering with explicitly synthetic font metrics.
const authoredSigns=scene.children.filter(o=>o.userData.signText);
check(authoredSigns.length>40,'authored sign audit covers expanded town and all properties');
for(const o of authoredSigns){
 check(!o.userData.signLayout.truncated&&o.userData.signLayout.fullText===o.userData.signText.replace(/\\s+/gu,' ').trim(),'authored name retained without ellipsis');
 check(o.geometry===signPlane&&Math.abs(o.scale.y-o.scale.x*(o.userData.dynamicSign?1:.55))<1e-8&&o.material.toneMapped===false,'slim static signs, unchanged dynamic boards and readable palette');
 check(o.material.map.image.width===1024&&o.material.map.image.height===256,'bounded board resolution');
}
const staticSigns=authoredSigns.filter(o=>!o.userData.dynamicSign),dynamicSigns=authoredSigns.filter(o=>o.userData.dynamicSign);
const staticMaps=new Set(staticSigns.map(o=>o.material.map)),dynamicMaps=new Set(dynamicSigns.map(o=>o.material.map));
check(staticMaps.size===signMaterials.size&&staticMaps.size<staticSigns.length&&signMaterials.size<=128,'identical static boards share cached material/map');
check(dynamicSigns.length===9&&dynamicMaps.size===9&&dynamicSigns.every(o=>!staticMaps.has(o.material.map)),'all stock boards own isolated maps');
const supplySigns=staticSigns.filter(o=>o.userData.signText==='SUPPLIES / ROSTER');
check(supplySigns.length===3&&supplySigns.every(o=>o.material===supplySigns[0].material),'repeated supply labels share immutable resource');
const originalSignCache=new Map(signMaterials),budgetBoards=[];let existingMapDisposed=false;
supplySigns[0].material.map.addEventListener('dispose',()=>{existingMapDisposed=true;});
for(let i=0;i<140;i++)budgetBoards.push(sign('Cache probe '+i,200,2,80,1));
check(signMaterials.size===128&&budgetBoards.every(o=>o.material.map.image.width===1024)&&!existingMapDisposed,'cache overflow stays capped without disposing a live authored map');
for(const o of budgetBoards){scene.remove(o);o.material.map.dispose();o.material.dispose();}
signMaterials.clear();for(const [k,v] of originalSignCache)signMaterials.set(k,v);

const signStorageSnapshot=()=>JSON.stringify(['story','free'].flatMap(m=>[1,2,3].map(i=>localStorage.getItem('gummybay-v3-'+m+'-'+i))));
const signSaveBefore=JSON.stringify(s),signStorageBefore=signStorageSnapshot(),cacheSize=signMaterials.size;
s.room=true;s.house=0;s.storedPacks[0]=40;refreshWorkshop();
const sign0=workshopDisplays[0].labels[2],sign1=workshopDisplays[1].labels[2],oldInactiveVersion=sign1.material.map.version;
check(sign0.userData.signLayout.every(l=>!l.truncated),'working stock heading and overflow fit');
s.storedPacks[0]=0;refreshWorkshop();check(sign0.userData.stockKey.includes('STORED  0')&&sign1.material.map.version===oldInactiveVersion,'active stock repaint cannot overwrite another property');
const signVersion=sign0.material.map.version,staticVersions=staticSigns.map(o=>o.material.map.version);
for(let i=0;i<300;i++)refreshWorkshop();
check(sign0.material.map.version===signVersion&&signMaterials.size===cacheSize&&staticSigns.every((o,i)=>o.material.map.version===staticVersions[i]),'300 unchanged stock refreshes reuse maps without uploads');
s=normalize(JSON.parse(signSaveBefore));refreshWorkshop();
check(JSON.stringify(s)===signSaveBefore&&signStorageSnapshot()===signStorageBefore,'lettering projection does not mutate business or saves');
console.log('PASS: '+authoredSigns.length+' authored boards retain full names with synthetic font metrics; '+staticSigns.length+' static signs share '+staticMaps.size+' maps and one plane; 9 stock boards stay isolated with no unchanged uploads over 300 refreshes. Not rendered readability or FPS.');

for(const a of visualActors){prepareActorLOD(a);check(a.body.scale.x>=.80&&a.body.scale.x<=.90&&a.body.scale.y===.86,'bounded varied resident width with stable eye and foot height');if(a.low)check(a.low.body.scale.x===a.high.body.scale.x,'LOD scale continuity');}
const hairstyleLayers=visualActors.flatMap(a=>[a.high,a.low]).filter(Boolean),hairstyleStateBefore=JSON.stringify(s),hairstyleSlotsBefore=signStorageSnapshot();
check(hairstyleLayers.length===visualActors.length*2&&hairstyleLayers.every(layer=>layer.hairstyle?.mesh.parent===layer.body.getObjectByName('Head')),'all resident high/low rigs carry one hairstyle mesh on the animated Head bone');
check(new Set(visualActors.map(a=>a.high.hairstyle.profile.id)).size===RESIDENT_HAIRSTYLE_PROFILES.length&&visualActors.every(a=>a.high.hairstyle.profile===a.low.hairstyle.profile&&a.high.hairstyle.mesh.geometry===a.low.hairstyle.mesh.geometry&&a.high.hairstyle.mesh.material===a.low.hairstyle.mesh.material),'five deterministic hairstyles retain exact geometry and palette material across LODs');
check(new Set(hairstyleLayers.map(layer=>layer.hairstyle.mesh.geometry)).size===5&&residentHairstyleResources().geometries.every(geometry=>hairstyleLayers.some(layer=>layer.hairstyle.mesh.geometry===geometry)),'five pre-merged hairstyle geometries are shared across every resident');
check(hairstyleLayers.every(layer=>!layer.hairstyle.mesh.castShadow&&!layer.hairstyle.mesh.receiveShadow)&&RESIDENT_HAIRSTYLE_COLLIDERS.length===0&&JSON.stringify(s)===hairstyleStateBefore&&signStorageSnapshot()===hairstyleSlotsBefore,'hairstyles add no shadows, collision, business or save mutation');
console.log('PASS: '+visualActors.length+' actual GLTF residents use five original face-open pre-merged hairstyle silhouettes on both animated Head-bone LOD rigs with shared geometry, cached palette materials and zero collision. CPU geometry only; not rendered recognition.');
const proportionLayers=visualActors.flatMap(a=>[a.high,a.low].map(l=>({actor:a,layer:l}))).filter(v=>v.layer),proportionStateBefore=JSON.stringify(s),proportionSlotsBefore=signStorageSnapshot();
check(proportionLayers.length===visualActors.length*2&&proportionLayers.every(({actor,layer})=>layer.proportions?.profile===residentProportionProfile(actor.g.userData.id)&&layer.proportions.head===layer.body.getObjectByName('Head')&&layer.proportions.hands.every(b=>b.parent)),'both resident LOD rigs carry the same deterministic real-bone proportion profile');
check(new Set(proportionLayers.map(v=>v.layer.proportions.profile.id)).size===RESIDENT_PROPORTION_PROFILES.length,'all five proportion profiles appear across actual residents');
for(const {layer} of proportionLayers){const p=layer.proportions.profile;applyResidentProportionRig(layer.proportions);check(layer.proportions.head.scale.toArray().every((v,i)=>Math.abs(v-[p.head.x,p.head.y/1.18,p.head.z][i])<1e-9),'head profile applied');check(layer.proportions.hands.every(b=>Math.abs(b.scale.x-p.hand.x)<1e-9&&Math.abs(b.scale.y-p.hand.y)<1e-9),'hand profiles applied');check(p.foot.width>=.24&&p.foot.width<=.28&&p.foot.depth>=.35&&p.foot.depth<=.4,'bounded foot profile applied');for(const name of ['Thigh-1','Shin-1','Thigh1','Shin1'])check(layer.body.getObjectByName(name).scale.toArray().every(v=>Math.abs(v-1)<1e-9),'leg and foot-contact bones unchanged');}
const proportionProbe=visualActors[0],proportionHead=proportionProbe.proportions.head,proportionExpected=proportionProbe.proportions.profile.head;proportionHead.scale.set(9,9,9);actorAnimation(proportionProbe,.016);check(Math.abs(proportionHead.scale.x-proportionExpected.x)<1e-9&&Math.abs(proportionHead.scale.y-proportionExpected.y/1.18)<1e-9&&Math.abs(proportionHead.scale.z-proportionExpected.z)<1e-9,'animation scale write is followed by deterministic proportion reapply');
for(const actor of visualActors)actor.body.visible=true;check(residentFootSilhouettes.update({active:true})===visualActors.length*2,'one shoe pair follows every active actual resident rig');
check(residentFootSilhouettes.upper.count===visualActors.length*2&&residentFootSilhouettes.sole.count===visualActors.length*2&&residentFootSilhouettes.drawCalls===2,'shoe uppers and soles use two bounded instanced batches');
check(residentFootSilhouettes.upper.material.map==null&&residentFootSilhouettes.sole.material.map==null&&residentFootSilhouettes.counts.textures===0,'resident shoe silhouettes add no textures');
const footMatrix=new THREE.Matrix4(),footPosition=new THREE.Vector3(),footQuaternion=new THREE.Quaternion(),footScale=new THREE.Vector3();residentFootSilhouettes.upper.getMatrixAt(0,footMatrix);footMatrix.decompose(footPosition,footQuaternion,footScale);check(footPosition.toArray().every(Number.isFinite)&&footScale.x>=.193&&footScale.x<=.251&&footScale.z>=.3&&footScale.z<=.345,'actual resident foot instance has finite bounded world transform');
residentFootSilhouettes.setQuality('performance');check(!residentFootSilhouettes.upper.castShadow&&!residentFootSilhouettes.sole.castShadow,'performance keeps shoe silhouette without shadows');residentFootSilhouettes.setQuality('high');check(residentFootSilhouettes.upper.castShadow&&residentFootSilhouettes.sole.castShadow,'high enables shoe shadows');residentFootSilhouettes.setQuality('balanced');
check(RESIDENT_PROPORTION_COLLIDERS.length===0&&residentFootSilhouettes.counts.colliders===0&&JSON.stringify(s)===proportionStateBefore&&signStorageSnapshot()===proportionSlotsBefore,'proportion projection preserves collision, business and saves');
console.log('PASS: '+visualActors.length+' actual GLTF residents use five bounded head/forearm/hand/foot profiles on both LOD rigs after animation; 100 shoe parts share two batches with unchanged leg scales, no textures and zero collision. CPU transforms only; not rendered proportions.');
const clothingLayers=visualActors.flatMap(a=>[a.high,a.low].map(layer=>({actor:a,layer}))).filter(v=>v.layer),clothingStateBefore=JSON.stringify(s),clothingSlotsBefore=signStorageSnapshot();
check(clothingLayers.length===visualActors.length*2&&clothingLayers.every(({actor,layer})=>layer.clothing?.profile===residentClothingProfile(actor.g.userData.id)&&layer.clothing.materials.length===1),'both resident LOD rigs carry the same deterministic existing-shirt fabric profile');
check(new Set(clothingLayers.map(v=>v.layer.clothing.profile.id)).size===RESIDENT_CLOTHING_PROFILES.length,'all six everyday fabric profiles appear across actual residents');
const fabricTexture=residentFabricTexture();for(const {actor,layer} of clothingLayers){const wardrobe=layer.clothing,material=wardrobe.materials[0];check(material.name==='Shirt'&&material.color.getHex()===wardrobe.color&&material.roughness===wardrobe.profile.roughness&&material.metalness===0&&material.roughnessMap===fabricTexture&&wardrobe.texture===fabricTexture&&material.userData.fabric===wardrobe.profile.id&&material.userData.fabricPattern===RESIDENT_FABRIC_PATTERN.id,'actual shirt material carries bounded fabric tone, roughness and one shared weave map');if(actor.isCop)check(wardrobe.isCop&&wardrobe.color===clothingTone(0x243c58,wardrobe.profile.tone),'police uniform variation remains navy-derived');}
check(visualActors.every(a=>a.high.clothing.materials[0]===a.low.clothing.materials[0]),'low LOD reuses each resident existing styled shirt material');
check(new Set(clothingLayers.map(v=>v.layer.clothing.texture)).size===1&&fabricTexture.image.width===16&&fabricTexture.image.height===16&&fabricTexture.repeat.x===7&&fabricTexture.repeat.y===10,'one bounded original textile texture is shared by all resident LODs');
check(RESIDENT_CLOTHING_COLLIDERS.length===0&&JSON.stringify(s)===clothingStateBefore&&signStorageSnapshot()===clothingSlotsBefore,'clothing treatment preserves collision, business and saves');
console.log('PASS: '+visualActors.length+' actual GLTF residents use six bounded everyday fabric treatments plus one shared original diagonal-loom roughness texture on the existing Shirt material across both LODs, with police navy retained and zero collision. Material checks only; not rendered clothing.');
const expressionLayers=visualActors.flatMap(a=>[a.high,a.low]).filter(Boolean),expressionStateBefore=JSON.stringify(s),expressionSlotsBefore=signStorageSnapshot();
check(expressionLayers.length===visualActors.length*2&&expressionLayers.every(l=>l.expression?.group.parent===l.body.getObjectByName('Head')&&l.expression.group.children.length===7),'both resident LOD rigs carry seven head-bone expression/focus accents');
check(new Set(expressionLayers.map(l=>l.expression.leftBrow.geometry)).size===1&&new Set(expressionLayers.map(l=>l.expression.leftGlint.geometry)).size===1&&new Set(expressionLayers.map(l=>l.expression.leftLid.geometry)).size===1&&new Set(expressionLayers.map(l=>l.expression.faceFocus.geometry)).size===1,'resident expression, blink fallback and face-focus geometry is shared across both LODs');
check(residentAccessories.entries.every(entry=>{const actor=visualActors.find(a=>a.g===entry.actor);return actor?.high?.expression?.faceFocus&&actor?.low?.expression?.faceFocus&&entry.parts.every(part=>part.y>=2.07||Math.abs(part.x)>=.35)}),'all eight role-accessory languages retain the authored open face window on both actual LOD rigs');
const expressionProbe=expressionLayers[0].expression,expressionIdle=residentExpressionState({now:1,id:2,distance:8}),expressionTalk=residentExpressionState({now:1,id:2,talking:true,distance:8}),expressionFar=residentExpressionState({now:1,id:2,distance:125}),expressionBlink=residentExpressionState({now:5.075-.61*3,id:3});
updateResidentExpressionRig(expressionProbe,expressionIdle);const expressionIdleY=expressionProbe.leftBrow.position.y;updateResidentExpressionRig(expressionProbe,expressionTalk);check(expressionProbe.leftBrow.position.y>expressionIdleY&&expressionProbe.leftGlint.position.x>=-.158&&expressionProbe.leftGlint.position.x<=-.122,'talk brows and bounded gaze update the real head rig');
updateResidentExpressionRig(expressionProbe,expressionFar);check(expressionProbe.leftGlint.scale.x>1.16&&expressionProbe.leftBrow.scale.y>1.19&&expressionProbe.faceFocus.scale.x>1.09,'far-view projection gives bounded emphasis to glints, brows and cheek/nose facets');
updateResidentExpressionRig(expressionProbe,expressionBlink);check(!expressionProbe.leftGlint.visible&&expressionProbe.leftLid.visible&&expressionProbe.leftLid.scale.y>.99,'blink projection hides glints and closes the shared skin-toned lid');updateResidentExpressionRig(expressionProbe,residentExpressionState({active:false}));check(!expressionProbe.group.visible,'title state hides expression accents');
check(RESIDENT_EXPRESSION_COLLIDERS.length===0&&residentExpressionResources().browGeometry===expressionProbe.leftBrow.geometry&&residentExpressionResources().lidGeometry===expressionProbe.leftLid.geometry&&residentExpressionResources().faceFocusGeometry===expressionProbe.faceFocus.geometry&&RESIDENT_FACE_FOCUS_BOUNDS.maxY<.46&&RESIDENT_FACE_FOCUS_BOUNDS.minZ>0&&JSON.stringify(s)===expressionStateBefore&&signStorageSnapshot()===expressionSlotsBefore,'expression projection shares bounded face-open resources and preserves collision, business and saves');
console.log('PASS: '+visualActors.length+' actual GLTF residents carry bounded blink/gaze/talk-work expression, shared skin-toned blink fallback and distance-aware cheek/nose focus on both head-bone LOD rigs across all eight role-accessory languages with zero collision. CPU transforms only; not rendered face alignment.');
check(cargoBox.parent===crafterActor,'cargo attachment preserved');menu('craft');check(!$('modal').innerHTML.includes('undefined'),'workshop status projection');close();
const sinkPoint=points.find(p=>p.type==='sink'&&pointVisible(p));s.room=true;s.can=true;s.water=2;player.set(sinkPoint.x,1.72,sinkPoint.z);updateUI();check(readinessLabel.visible,'near station readiness visible');const readyMap=readinessLabel.material.map;renderFrame();check(readinessLabel.material.map===readyMap,'readiness texture reused');
const readinessStateBefore=JSON.stringify(s),readinessSlotBefore=signStorageSnapshot();
check(!readinessLabel.userData.signLayout.truncated&&readinessLabel.userData.signLayout.lines.join(' ').includes('2 / 6'),'refill wording fits without squeezing');
const readinessVersion=readyMap.version;for(let i=0;i<300;i++)updateUI();check(readyMap.version===readinessVersion,'unchanged readiness does not upload');
s.water=6;updateUI();check(readyMap.version===readinessVersion+1&&readinessLabel.userData.signLayout.fullText==='Can full · 6 / 6 charges','changed readiness updates one existing map');
updateUI();check(readyMap.version===readinessVersion+1,'new readiness uploads only once');
s.water=2;updateUI();check(JSON.stringify(s)===readinessStateBefore&&signStorageSnapshot()===readinessSlotBefore,'readiness lettering preserves saves and inventory');
menu('bag');renderFrame();check(!readinessLabel.visible,'panel hides world readiness');close();s.room=false;
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

// Exercise real station completion through the authoritative inventory handler.
net.role='solo';s.room=true;s.house=0;s.packStation=true;s.bench=1;s.gummies[0]=4;s.wrappers=4;
const craft=points.find(p=>p.type==='craft'&&pointVisible(p));player.set(craft.x,1.72,craft.z);close();

function fire(target,name,event={}){for(const fn of target.events?.[name]||[])fn(event);}
const pointer={clientX:700,clientY:400,pointerId:1,button:0,isPrimary:true};
s.raw[0]=1;action('make',0);document.pointerLockElement=canvas;
fire(canvas,'pointerdown',{...pointer,button:2});check(!stationHeld,'right button cannot start work');
fire(canvas,'pointerdown',pointer);check(stationHeld,'primary drag starts work');
const beforeGesture=JSON.stringify([s.raw,s.gummies,s.packs,s.wrappers]);
for(let i=0;i<4;i++)for(const fn of events.pointermove)fn({...pointer,movementX:30,movementY:0});
check(stationTask.progress===120,'fixed locked cursor still shapes gummy');
check(JSON.stringify([s.raw,s.gummies,s.packs,s.wrappers])===beforeGesture,'gesture preview consumes nothing');
for(const fn of events.pointermove)fn({...pointer,isPrimary:false,movementX:30,movementY:0});
check(stationTask.progress===120,'second touch cannot credit work');
for(let i=0;i<4;i++)for(const fn of events.pointermove)fn({...pointer,movementX:30,movementY:0});
check(stationTask.step===1&&!stationHeld,'drag reaches next step and releases hold');
fire(canvas,'pointerdown',{...pointer,button:2});check(!!stationTask,'secondary click cannot commit');
const looseBefore=s.gummies[0];fire(canvas,'pointerdown',pointer);
check(!stationTask&&s.raw[0]===0&&s.gummies[0]===looseBefore+1,'primary tap commits shape once');
fire(canvas,'pointerdown',pointer);check(s.gummies[0]===looseBefore+1,'extra tap cannot duplicate output');
s.gummies[0]=4;document.pointerLockElement=null;action('pack',0);fire(canvas,'pointerdown',pointer);
for(const fn of events.pointermove)fn({...pointer,clientX:730,movementX:999});
check(stationTask.progress===30,'free cursor uses positions instead of reported movement');
stationControl(true);document.hidden=true;fire(document,'visibilitychange');document.hidden=false;
const pausedProgress=stationTask.progress;updateStationInput(.06);
for(const fn of events.pointermove)fn({...pointer,clientX:760});
check(stationTask.progress===pausedProgress&&!stationHeld&&!stationAssist,'hidden tab releases mouse and accessibility input');
cancelStation();check(s.gummies[0]===4&&s.wrappers===4,'interrupted drag preserves inventory');

s.raw[0]=1;action('make',0);advanceStation(240);s.raw[0]=0;
const depletedState=JSON.stringify([s.raw,s.gummies,s.packs,s.wrappers]);
fire(canvas,'pointerdown',pointer);
check(!stationTask&&JSON.stringify([s.raw,s.gummies,s.packs,s.wrappers])===depletedState,'concurrent supply depletion cannot create output');
console.log('PASS: real event handlers for locked/free drag, primary-button gating, exactly-once shaping, hidden-tab release and cancellation; DOM/WebGL mocked.');

startBatch('pack',0,4);check(stationTask?.batch.count===4,'start upgraded batch');
advanceStation(360);check(isTimedSeal(),'upgraded seal reached');
const inventory=JSON.stringify([s.gummies,s.packs,s.wrappers]);stationTask.elapsed=0;pressSeal();
check(JSON.stringify([s.gummies,s.packs,s.wrappers])===inventory&&!!stationTask,'miss consumes nothing');
stationTask.elapsed=1/2.2;pressSeal();check(!stationTask&&s.packs[0]===4&&s.wrappers===0,'timed batch commits exactly once');
s.gummies[0]=1;s.wrappers=1;action('pack',0);advanceStation(180);assistSeal();check(!isTimedSeal(),'steady alternative exits timing');
stationControl(true);for(let n=0;n<20;n++)updateStationInput(.06);check(!stationTask&&s.packs[0]===5,'steady alternative completes');
s.gummies[0]=1;s.wrappers=1;action('pack',0);advanceStation(50);cancelStation();check(s.gummies[0]===1&&s.wrappers===1,'cancel preserves inputs');
console.log('PASS: upgraded batch hit/miss, exactly-once commit, steady-seal accessibility and cancellation.');
// Shelf visuals use authoritative storage; transfers retain reservations and capacity.
load('story',3,true);s.room=true;s.storedPacks[0]=20;s.storedPacks[5]=1;s.storedPacks[29]=1;
s.packs[0]=6;s.deals=[{npc:0,t:0,qty:3,price:30}];s.threads[0]={status:'agreed',messages:[]};
s.crafterCargo={phase:'output',source:'raw',index:4,home:0};
const storagePoint=points.find(p=>p.type==='stockroom'&&pointVisible(p));
player.set(storagePoint.x,1.72,storagePoint.z);close();
const displaySnapshot=JSON.stringify(s);refreshWorkshop();
check(JSON.stringify(s)===displaySnapshot,'stock projections do not mutate state');
const display=workshopDisplays[0],visiblePacks=()=>display.packs.filter(m=>m.visible);
check(visiblePacks().length===12,'large stock uses bounded preview');
check(visiblePacks().some(m=>m.userData.stockType===29),'mixed flavour not hidden behind large first stack');
for(const m of visiblePacks())check(m.material.color.getHex()===STRAINS[m.userData.stockType].color,'pack colour follows real flavour');
check(display.labels[2].userData.stockKey==='STORED  22 / 40|12 SHOWN  +10 MORE','sign gives exact total and overflow, excludes cargo');
const shelfTexture=display.labels[2].material.map,textureVersion=shelfTexture.version;
refreshWorkshop();check(shelfTexture.version===textureVersion,'unchanged stock does not upload another texture');
action('stash',0,2);close();refreshWorkshop();
check(s.packs[0]===4&&s.storedPacks[0]===22,'store moves exact packs');
const reservedState=JSON.stringify([s.packs,s.storedPacks]);action('stash',0,2);close();
check(JSON.stringify([s.packs,s.storedPacks])===reservedState,'promised stock cannot enter shelf');
action('unstash',29,1);close();refreshWorkshop();
check(s.storedPacks[29]===0&&s.packs[29]===1&&!visiblePacks().some(m=>m.userData.stockType===29),'collected flavour leaves preview');
s.storedPacks.fill(0);s.storedPacks[0]=40;
const fullState=JSON.stringify([s.packs,s.storedPacks]);action('stash',0,1);close();refreshWorkshop();
check(JSON.stringify([s.packs,s.storedPacks])===fullState,'full shelf refuses transfer without loss');
check(!stationReadiness('stockroom',s).ready,'full capacity marked before opening');
s.storedPacks.fill(0);refreshWorkshop();check(visiblePacks().length===0,'empty shelf shows no packs');
check(depositCargo(s,storageCapacity()),'worker deposits real output');refreshWorkshop();
check(visiblePacks().length===1&&visiblePacks()[0].userData.stockType===4,'worker deposit immediately appears as correct flavour');
// Snapshot replacement is the same read-only display path used for guest state.
const ownSlot=localStorage.getItem('gummybay-v3-story-3');net.role='guest';
s=normalize(JSON.parse(JSON.stringify(s)));s.storedPacks.fill(0);s.storedPacks[29]=2;updateUI();save();
check(visiblePacks().length===2&&visiblePacks().every(m=>m.userData.stockType===29),'guest snapshot refreshes existing meshes');
check(localStorage.getItem('gummybay-v3-story-3')===ownSlot,'guest display never writes local slot');
net.role='solo';check(validateSave(s,STRAINS.length,WORLD).ok,'valid mixed-save fixture');save();s.storedPacks[29]=0;load('story',3,false);refreshWorkshop();
check(s.storedPacks[29]===2&&visiblePacks().length===2,'mixed stock and preview survive reload');
const old=JSON.parse(localStorage.getItem('gummybay-v3-story-3'));
for(const key of ['raw','gummies','packs','seeds'])old[key]=old[key].slice(0,6);
delete old.storedPacks;delete old.crafterCargo;check(validateSave(old,STRAINS.length,WORLD).ok,'valid legacy fixture');localStorage.setItem('gummybay-v3-story-3',JSON.stringify(old));
load('story',3,false);refreshWorkshop();check(s.storedPacks.length===STRAINS.length&&visiblePacks().length===0,'legacy save normalizes empty storage without phantom stock');
s.house=2;refreshWorkshop();check(!workshopDisplays[0].group.visible&&workshopDisplays[2].group.visible,'only current property displays shared stock');
console.log('PASS: real stockroom actions, reservations, full/empty shelves, flavour previews, worker deposit, guest snapshot, legacy/mixed reload and property visibility; DOM/WebGL mocked.');
load('free',1,true);s.room=true;
for(let home=0;home<3;home++){
 s.house=home;s.tents=maxTents();s.installed=Array.from({length:s.tents},(_,i)=>i);refreshBase();
 const p={x:tents[0].position.x,z:tents[0].position.z,r:0,home};
 check(placementValid(0,p),'fully equipped property '+home+' keeps routes');
 const edge={x:HOMES[home].x-HOMES[home].w/2+2,z:p.z,r:-Math.PI/2,home};
 check(placement19(0,edge),'edge fixture passes older footprint checks');
 check(!placementValid(0,edge)&&placementFailure.includes('tent 1 entrance'),'wall-facing tent entrance rejected at property '+home);
 edge.r=0;check(placementValid(0,edge),'rotating entrance inward restores access at property '+home);
 player.set(edge.x,1.72,edge.z+3);yaw=0;beginPlacement(0);placeMode.r=-Math.PI/2;update(.016);
 check($('placementConfirm').disabled&&$('placementStatus').textContent.includes('tent 1 entrance'),'invalid preview explains blocked entrance');
 placeMode.r=0;update(.016);check(!$('placementConfirm').disabled&&$('placementStatus').textContent.includes('Access clear'),'rotated valid preview enables confirmation');cancelPlacement();
 const currentPoint=points.find(q=>q.type==='tent'&&q.i===0);player.set(currentPoint.x,1.72,currentPoint.z);
 const unchanged=JSON.stringify([s.layout,s.plants,s.raw,s.gummies,s.packs,s.cash]);
 beginPlacement(0);placeGhost.position.set(999,1.15,999);confirmPlacement();
 check(!!placeMode&&JSON.stringify([s.layout,s.plants,s.raw,s.gummies,s.packs,s.cash])===unchanged,'invalid confirmation keeps property and stock unchanged');
 cancelPlacement();check(!placeMode&&!placeGhost.visible&&$('placementHUD').hidden,'cancel returns to exploration');
 s.plants[0]={phase:'soil'};
 beginPlacement(0);placeGhost.position.set(edge.x,1.15,edge.z);placeMode.r=0;confirmPlacement();
 check(!placeMode&&s.layout[home+':0'].x===edge.x&&s.plants[0].phase==='soil','valid relocation preserves crop and commits once');
 save();s.layout={};load('free',1,false);refreshBase();
 check(s.layout[home+':0'].x===edge.x&&tents[0].position.x===edge.x,'relocated equipment survives reload at property '+home);
 s.packStation=true;s.helpers.crafter=true;s.workerEnabled.crafter=true;s.staffConfig.crafter.stock='stored';
 s.raw.fill(0);s.gummies.fill(0);s.packs.fill(0);s.storedPacks.fill(0);s.raw[0]=1;s.wrappers=1;s.crafterCargo=null;
 const testWorker=new StockroomCrafter();
 for(let n=0;n<900&&!s.storedPacks[0];n++){
  testWorker.tick(s,.06,workerContext());
  check(s.raw[0]+s.gummies[0]+s.packs[0]+s.storedPacks[0]+(s.crafterCargo?1:0)===1,'property worker conserves stock each tick');
 }
 check(s.storedPacks[0]===1&&s.wrappers===0&&!s.crafterCargo,'real furnished property worker completes cycle at property '+home);
}
s.house=1;s.installed=[0,1];s.tents=2;s.layout={};
s.layout['1:1']={x:HOMES[1].x-5,z:HOMES[1].z-5,r:0,home:1};refreshBase();
const neighbour={x:HOMES[1].x-5,z:HOMES[1].z-2,r:0,home:1};
check(placement19(0,neighbour),'neighbour fixture has separate footprints');
check(!placementValid(0,neighbour)&&placementFailure.includes('tent 2 entrance'),'moving a tent cannot seal another tent entrance');
console.log('PASS: real fully-equipped property layouts, wall/other-tent entrance rejection, rotation recovery, no-loss cancel/invalid confirmation, crop-preserving relocation and save/reload; DOM/WebGL mocked.');
load('story',1,true);s.room=true;s.packs[0]=2;s.packs[6]=3;
action('list',0,2,30);action('text',0);close();
check(s.deals.length===1&&!customerBrief(s,0,STRAINS.length).receipt,'agreement is not remembered as a purchase');
player.set(200,1.72,90);const farReceipt=JSON.stringify([s.cash,s.packs,s.threads[0]]);action('deliver',0);
check(JSON.stringify([s.cash,s.packs,s.threads[0]])===farReceipt,'remote delivery cannot create receipt or income');
player.set(CONTACTS[0].x,1.72,CONTACTS[0].z);close();
const promisedSample=JSON.stringify([s.packs,s.relations]);action('sample',0,0);
check(JSON.stringify([s.packs,s.relations])===promisedSample,'samples protect promised stock');
menu('customer',0);check($('modal').innerHTML.includes('favourite mix')&&$('modal').innerHTML.includes('sampleType'),'customer can choose a real preferred sample');
action('sample',0,6);close();check(s.packs[6]===2&&relationship(0)===10&&!readCustomerReceipt(s.threads[0],STRAINS.length),'sample consumes one pack but is not a sale');
action('deliver',0);const receipt0=JSON.stringify(s.threads[0].lastSale),paid=s.cash;
check(s.threads[0].lastSale.qty===2&&s.threads[0].lastSale.total===60&&s.cash===460,'successful delivery writes exact receipt');
action('deliver',0);check(s.cash===paid&&JSON.stringify(s.threads[0].lastSale)===receipt0,'repeated delivery cannot repeat money or receipt');
s.packs[0]=1;action('list',0,1,9999);action('text',0);
check(s.threads[0].status==='negotiating'&&JSON.stringify(s.threads[0].lastSale)===receipt0,'new negotiation preserves previous purchase');
check(s.threads[0].messages.at(-1).text.includes('work break'),'negotiation has customer-specific voice');
menu('thread',0);check($('modal').innerHTML.includes('Last purchase: 2 × Pine Pop')&&$('modal').innerHTML.includes('$60'),'thread presents remembered exact purchase');
action('offer',0,s.threads[0].counter);action('cancelDeal',0);close();
check(JSON.stringify(s.threads[0].lastSale)===receipt0,'cancelling later appointment preserves purchase memory');
save();s.threads[0].lastSale=null;load('story',1,false);menu('phone');
check(JSON.stringify(s.threads[0].lastSale)===receipt0&&$('modal').innerHTML.includes('Last purchase: 2 × Pine Pop'),'memory survives reload and appears in phone contacts');close();
const localReceiptSlot=localStorage.getItem('gummybay-v3-story-1'),shared=JSON.parse(JSON.stringify(s));
shared.threads[0].lastSale={t:6,qty:1,total:45,day:1,time:520};
net.role='guest';net.connected=true;const guestChannel={readyState:'open',send(){},close(){}};wireChannel(guestChannel);
guestChannel.onmessage({data:JSON.stringify({type:'state',state:shared,player:playerPacket()})});save();
check(s.threads[0].lastSale.t===6&&localStorage.getItem('gummybay-v3-story-1')===localReceiptSlot,'real guest state handler accepts receipt without writing guest slot');
net.role='solo';load('story',1,false);close();s.packs[0]=1;action('list',0,1,30);action('text',0);close();
net.role='host';net.connected=true;net.remote={x:CONTACTS[0].x,z:CONTACTS[0].z};const hostChannel={readyState:'open',send(){},close(){}};wireChannel(hostChannel);
hostChannel.onmessage({data:JSON.stringify({type:'position',player:{x:CONTACTS[0].x,y:1.72,z:CONTACTS[0].z,yaw:0}})});
const command={type:'action',seq:1,k:'deliver',a:0,x:CONTACTS[0].x,z:CONTACTS[0].z},hostCash=s.cash;
hostChannel.onmessage({data:JSON.stringify(command)});const hostReceipt=JSON.stringify(s.threads[0].lastSale);
check(s.cash===hostCash+30&&s.threads[0].lastSale.qty===1,'host receives shared delivery and records once');
hostChannel.onmessage({data:JSON.stringify(command)});check(s.cash===hostCash+30&&JSON.stringify(s.threads[0].lastSale)===hostReceipt,'network replay cannot repeat delivery or memory');
net.role='solo';net.connected=false;save();const legacy=JSON.parse(localStorage.getItem('gummybay-v3-story-1'));delete legacy.threads[0].lastSale;
localStorage.setItem('gummybay-v3-story-1',JSON.stringify(legacy));load('story',1,false);
check(!customerBrief(s,0,STRAINS.length).receipt&&s.cash===hostCash+30,'older save without memory loads without invented history');
console.log('PASS: real sample/list/offer/cancel/delivery handlers, receipt persistence, distance/reservations, exact-once host replay and guest snapshot/local-save protection; DOM/WebGL mocked.');
load('free',3,true);s.room=true;s.helpers.crafter=true;s.packStation=true;
for(let home=0;home<3;home++){
 s.house=home;refreshBase();const roster=points.find(p=>p.type==='staffboard'&&p.home===home);
 check(points.filter(p=>p.type==='staffboard'&&pointVisible(p)).length===1,'only current property roster is usable');
 player.set(roster.x,1.72,roster.z);close();updateUI();check(near?.type==='staffboard'&&readinessLabel.visible,'existing trolley provides roster interaction and guidance');
 menu('staffboard');check($('modal').innerHTML.includes('Your crew, right here.')&&$('modal').innerHTML.includes('Gummy maker'),'roster opens actual staff controls');
 check(!$('modal').innerHTML.includes("action('hire'"),'roster does not expose hiring purchases');
 const before=JSON.stringify([s.raw,s.gummies,s.packs,s.storedPacks,s.wrappers,s.cash]);
 action('staffAssign','crafter','stock','stored');action('staffAssign','crafter','strain',0);
 check(panel==='staffboard'&&s.staffConfig.crafter.stock==='stored'&&s.staffConfig.crafter.strain===0,'assignment stays in local roster');
 action('worker','crafter');check(panel==='staffboard'&&!s.workerEnabled.crafter,'pause remains situated');
 action('worker','crafter');check(s.workerEnabled.crafter&&JSON.stringify([s.raw,s.gummies,s.packs,s.storedPacks,s.wrappers,s.cash])===before,'roster controls preserve goods and money');
 net.role='host';net.connected=true;net.remote={x:roster.x,y:1.72,z:roster.z,yaw:0};net.peerPoseSeenAt=performance.now();
 check(remoteActionAllowed({k:'staffAssign',x:roster.x,z:roster.z}),'shared assignment allowed at current roster');
 check(!remoteActionAllowed({k:'hire',x:roster.x,z:roster.z}),'shared hiring still requires shop');
 const crewChannel={readyState:'open',send(){},close(){}};wireChannel(crewChannel);
 crewChannel.onmessage({data:JSON.stringify({type:'position',player:net.remote})});
 const pauseCommand={type:'action',seq:1,k:'worker',a:'crafter',x:roster.x,z:roster.z};
 crewChannel.onmessage({data:JSON.stringify(pauseCommand)});check(!s.workerEnabled.crafter,'real shared roster command pauses worker');
 crewChannel.onmessage({data:JSON.stringify(pauseCommand)});check(!s.workerEnabled.crafter,'replayed toggle cannot resume paused worker');
 crewChannel.onmessage({data:JSON.stringify({type:'action',seq:2,k:'staffAssign',a:'crafter',b:'strain',c:0,x:roster.x,z:roster.z})});
 check(s.staffConfig.crafter.strain===0,'real shared roster assignment reaches authoritative handler');action('worker','crafter');
 const otherRoster=points.find(p=>p.type==='staffboard'&&p.home!==home);net.remote={x:otherRoster.x,z:otherRoster.z};
 check(!remoteActionAllowed({k:'worker',x:otherRoster.x,z:otherRoster.z}),'wrong-property shared controls rejected');
 net.role='solo';net.connected=false;close();
}
s.raw.fill(0);s.raw[0]=1;s.wrappers=1;s.crafterCargo=null;s.house=0;refreshBase();const cargoRoster=points.find(p=>p.type==='staffboard'&&p.home===0);player.set(cargoRoster.x,1.72,cargoRoster.z);
check(pickupCargo(s),'real worker collects one batch');menu('staffboard');action('worker','crafter');const heldCargo=JSON.stringify(s.crafterCargo);
close();physicalCrafter.tick(s,.06,workerContext());check(JSON.stringify(s.crafterCargo)===heldCargo&&!s.raw[0]&&!s.wrappers,'pause keeps real in-transit stock');
menu('staffboard');check($('modal').innerHTML.includes('one input and one reserved wrapper'),'roster explains held cargo separately');save();load('free',3,false);
check(!s.workerEnabled.crafter&&JSON.stringify(s.crafterCargo)===heldCargo&&s.staffConfig.crafter.stock==='stored','paused assignment/cargo survive reload');
menu('staffboard');action('worker','crafter');close();
for(let n=0;n<900&&s.crafterCargo;n++)physicalCrafter.tick(s,.06,workerContext());
check(!s.crafterCargo&&s.storedPacks[0]===1,'resumed roster assignment delivers exactly one preserved batch');
net.role='host';physicalCrafter.status='Route blocked';const statusPacket=playerPacket();
check(statusPacket.worker.status==='Route blocked','host publishes real worker status');
net.role='guest';net.connected=true;net.remote=statusPacket;net.workerSeenAt=performance.now();physicalCrafter.status='Missing wrappers';
check(workerStatus('crafter')==='Route blocked','guest uses host rather than local worker status');
menu('staffboard');refreshCrewPanel();check($('crewStatus_crafter').innerHTML.includes('Clear the route'),'guest sees actionable host stopping reason');
s.workerEnabled.crafter=false;s.staffConfig.crafter.strain=1;refreshCrewPanel();
check($('crewToggle_crafter').textContent==='Resume assignment'&&$('crewProduct_crafter').value==='1','shared updates refresh pause label and unfocused assignment');
document.activeElement=$('crewProduct_crafter');document.activeElement.value='2';s.staffConfig.crafter.strain=0;refreshCrewPanel();
check(document.activeElement.value==='2','shared refresh preserves a selector being edited');document.activeElement=null;s.workerEnabled.crafter=true;
net.workerSeenAt=performance.now()-5001;check(workerStatus('crafter')==='Host update stale','stale host is not shown as active');
net.workerSeenAt=performance.now();net.remote.worker.status='<script>bad</script>';check(workerStatus('crafter')==='Awaiting host status','unrecognised remote status rejected');
delete net.remote.worker.status;check(workerStatus('crafter')==='Awaiting host status','older host packet gets honest fallback');
net.connected=false;refreshCrewPanel();check(workerStatus('crafter')==='Host unavailable'&&crewSectionHTML('crafter').includes(' disabled')&&$('crewToggle_crafter').disabled,'disconnected guest cannot use controls');net.role='solo';close();
s.helpers.gardener=true;s.installed=[0];s.can=true;s.trimmers=true;s.soil=1;s.plants=[];s.seeds.fill(0);s.seeds[5]=1;s.staffConfig.gardener.strain=5;s.xp=0;
check(workerStatus('gardener')==='Waiting: assigned seeds','locked seed cannot produce false ready status');
s.xp=380;check(workerStatus('gardener')==='Ready to plant','unlocked selected seed matches gardener readiness');
console.log('PASS: real rosters across three properties, assignment/pause conservation, proximity/hiring guards, cargo save/reload/resume, host status, stale/legacy/disconnected guest presentation; DOM/WebGL mocked.');
load('free',2,true);ensureProps();player.set(200,1.72,80);yaw=0;close();
const propCount=s.props.length,goodsBefore=JSON.stringify([s.cash,s.raw,s.gummies,s.packs,s.storedPacks,s.wrappers]);
Object.assign(s.props[0],{x:202,y:.3,z:80,vx:0,vy:0,vz:0,owner:null,rx:0,ry:0,rz:0,wx:0,wy:0,wz:0});
check(!blocked(200,80)&&!blocked(202,80),'prop fixture is in open world');
const grabWall={x:201,z:80,w:.3,d:4};colliders.push(grabWall);action('grabProp',0);
check(s.props[0].owner===null,'real grab handler rejects reaching through wall');
menu('prop',0);check($('modal').innerHTML.includes('disabled'),'blocked prop menu explains reach and disables pickup');close();
check(colliders.pop()===grabWall,'remove only temporary grab fixture');action('grabProp',0);action('grabProp',0);
check(s.props[0].owner==='host'&&s.props.filter(p=>p.owner==='host').length===1,'repeat pickup cannot create or duplicate crate');
const heldPropSave=JSON.stringify(s.props[0]);save();s.props=null;load('free',2,false);close();
check(JSON.stringify(s.props[0])===heldPropSave,'older-format held prop reload retains ownership and position');
update(.06);check(s.props[0].owner==='host'&&Math.hypot(s.props[0].x-player.x,s.props[0].z-player.z)<1.5,'carried prop follows through real update');
for(const fn of events.keydown)fn({key:'g',code:'KeyG',shiftKey:true,repeat:false,target:{tagName:'CANVAS'},preventDefault(){},stopImmediatePropagation(){}});
check(!s.props[0].owner&&s.props[0].vx===0&&s.props[0].vy===0&&s.props[0].vz===0&&s.props[0].wx===0&&s.props[0].wy===0&&s.props[0].wz===0,'Shift+G sets crate down without linear or angular throw');
const dropped=JSON.stringify(s.props[0]);save();s.props=null;load('free',2,false);check(JSON.stringify(s.props[0])===dropped,'set-down position survives reload');close();
action('grabProp',0);action('throwProp');const launched=JSON.stringify(s.props[0]);action('throwProp');
check(JSON.stringify(s.props[0])===launched&&s.props[0].vy===3&&Math.hypot(s.props[0].wx,s.props[0].wy,s.props[0].wz)>5,'throw applies linear and bounded angular impulse only once');
const throwWall={x:s.props[0].x,z:s.props[0].z-.25,w:4,d:.12};colliders.push(throwWall);update(.06);
check(s.props[0].z>=throwWall.z+.06&&s.props[0].vz>0,'real thrown crate cannot tunnel through thin collider');check(Math.abs(propMeshes[0].rotation.x)+Math.abs(propMeshes[0].rotation.y)+Math.abs(propMeshes[0].rotation.z)>0&&[s.props[0].rx,s.props[0].ry,s.props[0].rz,s.props[0].wx,s.props[0].wy,s.props[0].wz].every(Number.isFinite),'actual host update presents finite visible tumble');const angularSave=JSON.stringify([s.props[0].rx,s.props[0].ry,s.props[0].rz,s.props[0].wx,s.props[0].wy,s.props[0].wz]);save();s.props[0].rx=0;load('free',2,false);close();check(JSON.stringify([s.props[0].rx,s.props[0].ry,s.props[0].rz,s.props[0].wx,s.props[0].wy,s.props[0].wz])===angularSave,'v3 save/reload preserves in-flight angular state');check(colliders.pop()===throwWall,'remove only temporary throw fixture');
Object.assign(s.props[0],{x:202,y:PROP_RADIUS,z:80,vx:0,vy:0,vz:0,owner:null,rx:0,ry:0,rz:0,wx:0,wy:0,wz:0});Object.assign(s.props[1],{x:202,y:PROP_RADIUS,z:80.2,vx:0,vy:0,vz:-4,owner:null,rx:0,ry:0,rz:0,wx:0,wy:0,wz:0});Object.assign(s.props[2],{x:206,y:PROP_RADIUS,z:80,owner:null});Object.assign(s.props[3],{x:208,y:PROP_RADIUS,z:80,owner:null});update(.06);
check(Math.abs(s.props[1].z-s.props[0].z)>=PROP_HALF_DEPTH*2-1e-6&&s.props[0].vz<0&&s.props[1].vz>-4,'actual host substeps prevent crate tunnelling and transfer bounded momentum');
Object.assign(s.props[0],{x:202,y:PROP_RADIUS,z:80,vx:0,vy:0,vz:0,owner:null});Object.assign(s.props[1],{x:202,y:.6,z:80,vx:2,vy:-5,vz:0,owner:null,wx:0,wy:0,wz:0});update(.06);
check(s.props[1].y>=PROP_RADIUS*3-1e-6&&s.props[1].y<PROP_RADIUS*3+.15&&s.props[1].vy>=0&&Math.abs(s.props[1].wz)>0,'actual falling crate stacks, gives a bounded rebound and converts travel into roll');
const pairSave=JSON.stringify(s.props.slice(0,2));save();s.props[0].x=250;load('free',2,false);close();check(JSON.stringify(s.props.slice(0,2))===pairSave,'resolved crate pair persists in the unchanged v3 save');
Object.assign(s.props[0],{x:202,y:.3,z:80,vx:0,vy:0,vz:0,owner:null,rx:0,ry:0,rz:0,wx:0,wy:0,wz:0});update(0);
net.role='host';net.connected=true;net.remote={x:200,z:80,yaw:0};const propChannel={readyState:'open',send(){},close(){}};wireChannel(propChannel);
colliders.push(grabWall);propChannel.onmessage({data:JSON.stringify({type:'action',seq:1,k:'grabProp',a:0,x:200,z:80})});
check(s.props[0].owner===null,'host applies occlusion to guest pickup too');check(colliders.pop()===grabWall,'remove temporary shared fixture');
const guestGrab={type:'action',seq:2,k:'grabProp',a:0,x:200,z:80};propChannel.onmessage({data:JSON.stringify(guestGrab)});propChannel.onmessage({data:JSON.stringify(guestGrab)});
check(s.props[0].owner==='guest'&&s.props.filter(p=>p.owner==='guest').length===1,'shared pickup/replay has one guest owner');
s.props[1].owner='host';propChannel.onmessage({data:JSON.stringify({type:'action',seq:3,k:'dropProp',x:200,z:80})});
check(s.props[0].owner===null&&s.props[1].owner==='host','guest set-down cannot release host crate');
net.role='guest';net.connected=true;const sharedPropSnapshot=JSON.stringify(s.props),localPropSlot=localStorage.getItem('gummybay-v3-free-2');update(.06);save();
check(JSON.stringify(s.props)===sharedPropSnapshot&&localStorage.getItem('gummybay-v3-free-2')===localPropSlot,'guest neither simulates shared props nor writes own slot');
net.role='host';net.connected=false;Object.assign(s.props[2],{owner:'guest',vx:0,vy:0,vz:0});const lostPosition={x:s.props[2].x,z:s.props[2].z};update(.06);
check(s.props[2].owner===null&&s.props[2].x===lostPosition.x&&s.props[2].z===lostPosition.z,'disconnected guest releases crate at last safe position');
check(s.props.length===propCount&&JSON.stringify([s.cash,s.raw,s.gummies,s.packs,s.storedPacks,s.wrappers])===goodsBefore,'prop interactions preserve all business stock and crate count');net.role='solo';
console.log('PASS: real blocked/duplicate grabs, carry update, zero-spin set-down, tumbling throw, crate-pair separation/stacking/save, authoritative guest/replay/owner guards, disconnect release and guest save/simulation protection; DOM/WebGL mocked.');
load('free',2,true);close();s.vehicleOwned=true;vehiclePose={x:200,z:80,angle:0};s.vehiclePark={...vehiclePose};player.set(197,1.72,80);
const vanGoods=JSON.stringify([s.cash,s.bank,s.raw,s.gummies,s.packs,s.storedPacks,s.wrappers]),vanWall={x:199,z:80,w:.2,d:6};
colliders.push(vanWall);enterVehicle();check(!driving&&player.x===197,'real entry rejects wall between player and side door');
menu('vehicle');check($('modal').innerHTML.includes('Approach a clear side door')&&$('modal').innerHTML.includes('disabled'),'van menu explains unavailable door');close();
check(colliders.pop()===vanWall,'remove only van entry fixture');player.y=3.1;enterVehicle();check(!driving,'no elevated entry teleport');player.y=1.72;
enterVehicle();check(driving&&player.x===200&&player.z===80,'clear side door enters actual van');
track={x:-70,z:-147,label:'Westside seeds'};update(0);drawMap();
check($('drivingHUD').textContent.includes('km/h · EAST COAST · heading south')&&$('drivingHUD').textContent.includes('TRACKED · Westside seeds')&&$('drivingHUD').textContent.includes('right'),'driving HUD adds district, heading, tracked distance and relative bearing');
check($('drivingHUD').textContent.includes('SURFACE · OFF ROAD · 29 km/h limit'),'pier-side open ground is honestly identified');
player.set(-40,1.72,-160);driveAngle=Math.PI/2;driveSpeed=16;keys.w=true;update(.06);keys.w=false;
check(driveSpeed===16&&$('drivingHUD').textContent.includes('SURFACE · ROAD · 58 km/h limit'),'authored road retains the original top speed and identifies the lane');
player.set(-105,1.72,-160);driveAngle=Math.PI/2;driveSpeed=12;keys.w=true;update(.06);keys.w=false;
check(driveSpeed<12&&driveSpeed>11&&$('drivingHUD').textContent.includes('SURFACE · JUNCTION · 40 km/h limit'),'actual junction progressively reduces overspeed and warns about crossings');
player.set(-40,1.72,-151.9);driveAngle=Math.PI/2;driveSpeed=6;keys.w=true;update(.06);keys.w=false;
check(driveSpeed<6&&driveSpeed>5&&$('drivingHUD').textContent.includes('SURFACE · PEDESTRIAN WAY · 11 km/h limit'),'actual pavement progressively limits the van and names the pedestrian zone');
player.set(200,1.72,80);driveAngle=0;driveSpeed=0;update(0);
check($('mapCaption').textContent==='DRIVE · EAST COAST · THE PIER 200 m · N ↑ · EDGE TARGET'&&travelMapScale(true)<travelMapScale(false),'driving map names its district/nearest landmark and retains a far target at the edge');
track={x:202,z:80,label:'Nearby'};drawMap();check($('mapCaption').textContent==='DRIVE · EAST COAST · THE PIER 200 m · N ↑','near target remains an ordinary in-map marker');
const localMapState=paintTownMap(mc,334,288,true);check(localMapState.visibleRoads>0&&localMapState.visibleBuildings>0&&localMapState.visibleBuildings<buildings.length+districtBuildings.length&&localMapState.visibleDistricts>0&&localMapState.visibleDistricts<DISTRICTS.length&&localMapState.landmarkVisible,'actual local map filters distant environment while retaining nearby streets, buildings, district and landmark');
player.set(0,1.72,-160);track=null;update(0);check($('drivingHUD').textContent.includes('WESTSIDE · EAST MARKET BORDER'),'equidistant district transition is explicit and deterministic');
player.set(200,1.72,80);update(0);
const heldF={key:'f',code:'KeyF',repeat:true,target:{tagName:'CANVAS'},preventDefault(){},stopImmediatePropagation(){}};
for(const fn of events.keydown)fn(heldF);check(driving,'held F repeat cannot immediately eject driver');
driveSpeed=1.01;exitVehicle();check(driving,'moving van rejects exit');driveSpeed=0;
colliders.push(vanWall);exitVehicle();check(!driving&&player.x===202&&player.z===80,'real exit sweeps route and chooses unblocked opposite door');
drawMap();check($('mapCaption').textContent==='WALK · EAST COAST · THE PIER 202 m · N ↑','walking map restores close scale while retaining district and landmark context');
check(colliders.pop()===vanWall,'remove only van exit fixture');
check(s.vehiclePark.x===200&&s.vehiclePark.z===80,'parking retains seat, not exit-door position');
save();load('free',2,false);close();check(s.vehicleOwned&&!driving&&vehiclePose.x===200&&player.x===202,'fleet and parking survive v3 reload');
enterVehicle();check(driving,'opposite clear side can re-enter');
const bothVanDoors={x:201,z:80,w:.2,d:6};colliders.push(vanWall,bothVanDoors);exitVehicle();check(driving&&player.x===200,'two blocked swept exits leave driver inside');
check(colliders.pop()===bothVanDoors&&colliders.pop()===vanWall,'remove only two-door fixtures');
for(const fn of events.keydown)fn({...heldF,repeat:false});check(!driving,'fresh F exits once');
player.set(200,1.72,80);enterVehicle();check(driving,'legacy saved position at seat remains usable');exitVehicle();
for(const bay of PARKING_BAYS){check(vehicleClear(bay.x,bay.z,bay.angle),'marked bay keeps full van footprint clear at '+bay.label);check(vehicleDoorAccess(bay,null,blocked,floorHeight),'marked bay retains a swept exit door at '+bay.label);}
const parkingBay=PARKING_BAYS[1];vehiclePose={x:parkingBay.x+1.5,z:parkingBay.z,angle:parkingBay.angle};player.set(vehiclePose.x,1.72,vehiclePose.z+2);enterVehicle();check(driving,'nearby aligned Westside bay remains enterable');
update(0);check($('drivingHUD').textContent.includes('PARKING · Westside seeds · BAY READY · F align / exit'),'actual HUD identifies a stopped aligned storefront bay');
const parkingMap=paintTownMap(mc,334,288,true);check(parkingMap.visibleParking>0,'local driving map retains a nearby parking mark');
exitVehicle();check(!driving&&vehiclePose.x===parkingBay.x&&vehiclePose.z===parkingBay.z&&vehiclePose.angle===parkingBay.angle&&s.vehiclePark.x===parkingBay.x&&Math.abs(player.z-(parkingBay.z+2))<1e-9,'F snaps a ready bay before the existing swept door exit and saves the exact host parking pose');
save();load('free',2,false);close();check(s.vehiclePark.x===parkingBay.x&&s.vehiclePark.z===parkingBay.z&&vehiclePose.x===parkingBay.x,'marked bay survives unchanged version-3 parking reload');
const hostParking=JSON.stringify(s.vehiclePark),hostSlot=localStorage.getItem('gummybay-v3-free-2');
net.role='guest';vehiclePose={x:210,z:80,angle:Math.PI/2};player.set(210,1.72,83);enterVehicle();check(driving,'guest can enter own fleet van');exitVehicle();
check(!driving&&JSON.stringify(s.vehiclePark)===hostParking&&localStorage.getItem('gummybay-v3-free-2')===hostSlot,'guest exit does not overwrite host parking or local save');
vehiclePose={x:-40,z:-151.9,angle:Math.PI/2};player.set(-40,1.72,-149);enterVehicle();driveSpeed=6;keys.w=true;update(.06);keys.w=false;save();
check(driving&&driveSpeed<6&&JSON.stringify(s.vehiclePark)===hostParking&&localStorage.getItem('gummybay-v3-free-2')===hostSlot,'guest pavement limit changes only local van motion, never host parking or a personal slot');driveSpeed=0;exitVehicle();
net.connected=true;const oldCustomer={x:CONTACTS[0].x,z:CONTACTS[0].z};player.set(oldCustomer.x,1.72,oldCustomer.z);trackCustomer(0);s.npcs[0]={x:oldCustomer.x-42,z:oldCustomer.z-18,routeBlocked:false};update(.06);
check(track?.npc===0&&Math.hypot(track.x-oldCustomer.x,track.z-oldCustomer.z)>1&&track.status==='on the move','moving customer replaces stale marker before old-position arrival can clear it');
check($('drivingHUD').textContent.includes('CUSTOMER · Jules')&&$('drivingHUD').textContent.includes('on the move'),'navigation text identifies a moving customer');
net.connected=false;update(.06);check(track?.status==='last known · reconnect'&&track.x===CONTACTS[0].x&&track.z===CONTACTS[0].z,'disconnected guest retains an explicit finite last-known marker');
net.connected=true;for(let i=0;i<12;i++)update(.06);player.set(CONTACTS[0].x,1.72,CONTACTS[0].z);update(0);check(track===null,'tracking clears only at the current reachable customer position');
check(localStorage.getItem('gummybay-v3-free-2')===hostSlot,'guest navigation never writes the host slot');
check(JSON.stringify([s.cash,s.bank,s.raw,s.gummies,s.packs,s.storedPacks,s.wrappers])===vanGoods,'vehicle and navigation interactions conserve money and all business goods');net.role='solo';net.connected=false;
console.log('PASS: real entry/exit/menu/F handlers, authored road/junction/pavement HUD and progressive limits, static and moving-customer travel HUD, driving/walking map context, stale-position/reconnect/current-arrival tracking, occluded and elevated entry, alternate/two-blocked exits, moving exit, v3 parking reload, legacy seat recovery and guest save/parking protection; DOM/WebGL mocked.');
load('free',1,true);close();s.packs[0]=2;s.packs[6]=2;action('list',0,2,30);action('text',0);close();
CONTACTS[0].x=200;CONTACTS[0].z=80;const handoffPoint=points.find(p=>p.type==='customer'&&p.i===0);handoffPoint.x=200;handoffPoint.z=80;
player.set(198,1.72,80);const handoffWall={x:199,z:80,w:.3,d:6};colliders.push(handoffWall);
const exchangeSnapshot=()=>JSON.stringify([s.cash,s.bank,s.packs,s.sold,s.xp,s.earned,s.heat,s.relations,s.threads,s.deals,s.listing]);
const blockedHandoff=exchangeSnapshot();action('deliver',0);action('sample',0,6);doAction('deliver',0);doAction('sample',0,6);
check(exchangeSnapshot()===blockedHandoff,'local and authoritative handlers reject cross-wall sale/sample without side effects');
updateUI();check(near?.type!=='customer','occluded customer is not offered as a nearby conversation');near=handoffPoint;act();check(!panel,'stale nearby reference cannot open occluded conversation');
menu('customer',0);check(/id="customerDeliver"[^>]*disabled/.test($('modal').innerHTML)&&/id="customerSample"[^>]*disabled/.test($('modal').innerHTML),'occluded handoff buttons render disabled');
$('sampleType').value='6';refreshCustomerPanel();check($('customerDeliver').disabled&&$('customerSample').disabled&&$('customerReach').textContent.includes('obstruction'),'live menu explains blocked handoff');
check(colliders.pop()===handoffWall,'remove only temporary handoff wall');updateUI();
check(!$('customerDeliver').disabled&&!$('customerSample').disabled&&$('sampleType').value==='6','menu re-enables clear handoffs without replacing selected sample');
CONTACTS[0].x=206;updateUI();check($('customerDeliver').disabled&&$('customerSample').disabled,'guest-style moving customer disables stale menu');action('deliver',0);action('sample',0,6);check(exchangeSnapshot()===blockedHandoff,'stale-menu click cannot exchange with departed customer');
CONTACTS[0].x=200;close();player.y=3.2;doAction('deliver',0);doAction('sample',0,6);check(exchangeSnapshot()===blockedHandoff,'elevated direct handoffs rejected');
player.y=1.72;player.x=NaN;doAction('deliver',0);doAction('sample',0,6);check(exchangeSnapshot()===blockedHandoff,'invalid direct position cannot consume or award stock');player.x=198;
driving=true;doAction('deliver',0);doAction('sample',0,6);check(exchangeSnapshot()===blockedHandoff,'driver must leave van before handoff');driving=false;
doAction('sample','0',6);doAction('sample',0,'6');check(exchangeSnapshot()===blockedHandoff,'invalid sample indices have no side effects');
action('sample',0,6);close();action('deliver',0);check(s.cash===460&&s.sold===2&&s.packs[6]===1&&s.packs[0]===0&&relationship(0)===16,'legitimate sample and exact sale still work');
const completedExchange=exchangeSnapshot();action('deliver',0);check(exchangeSnapshot()===completedExchange,'repeated clear delivery cannot duplicate sale');
save();load('free',1,false);close();check(s.cash===460&&s.threads[0].lastSale.qty===2&&s.packs[6]===1,'handoff money, stock and receipt persist in v3 save');
for(let i=0;i<CONTACTS.length;i++){player.set(CONTACTS[i].x,1.72,CONTACTS[i].z);check(customerExchangeStatus(i).ok,'existing customer meeting '+i+' remains reachable');}
CONTACTS[0].x=200;CONTACTS[0].z=80;player.set(198,1.72,80);s.packs[0]=1;action('list',0,1,30);action('text',0);close();
net.role='host';net.connected=true;const exchangePackets=[],exchangeChannel={readyState:'open',send(data){exchangePackets.push(JSON.parse(data))},close(){}};wireChannel(exchangeChannel);
const receiveExchange=m=>exchangeChannel.onmessage({data:JSON.stringify(m)}),peerPose={x:198,y:1.72,z:80,yaw:0};
let handoffSeq=0;const peerHandoff=k=>receiveExchange({type:'action',seq:++handoffSeq,k,a:0,b:6,x:198,z:80});
const sharedBefore=exchangeSnapshot();peerHandoff('deliver');check(exchangeSnapshot()===sharedBefore,'new channel requires an accepted current position before sale');
receiveExchange({type:'position',player:peerPose});colliders.push(handoffWall);peerHandoff('deliver');peerHandoff('sample');check(exchangeSnapshot()===sharedBefore,'host rejects guest cross-wall handoffs');check(colliders.pop()===handoffWall,'remove shared handoff fixture');
net.peerPoseSeenAt=performance.now()-2001;peerHandoff('deliver');check(exchangeSnapshot()===sharedBefore,'stale peer position cannot authorize delivery');
receiveExchange({type:'position',player:{...peerPose,y:null}});peerHandoff('deliver');check(exchangeSnapshot()===sharedBefore,'malformed pose does not refresh expired authority');
receiveExchange({type:'position',player:{...peerPose,x:194}});peerHandoff('deliver');check(exchangeSnapshot()===sharedBefore,'claimed/peer drift cannot authorize handoff');
receiveExchange({type:'position',player:{...peerPose,x:195}});peerHandoff('deliver');check(exchangeSnapshot()===sharedBefore,'peer itself must be in handoff reach, not merely claimed position');
receiveExchange({type:'position',player:{...peerPose,y:3.2}});peerHandoff('sample');check(exchangeSnapshot()===sharedBefore,'host rejects elevated guest sample');
receiveExchange({type:'position',player:{...peerPose,vehicle:true}});peerHandoff('deliver');check(exchangeSnapshot()===sharedBefore,'host rejects handoff from guest vehicle');
receiveExchange({type:'position',player:{x:198,z:80,yaw:0}});player.set(210,1.72,80);peerHandoff('sample');const guestSample=exchangeSnapshot();
receiveExchange({type:'action',seq:handoffSeq,k:'sample',a:0,b:6,x:198,z:80});check(exchangeSnapshot()===guestSample&&s.packs[6]===0,'fresh legacy peer without eye-height field and replay consume one unreserved pack');
peerHandoff('deliver');const guestSale=exchangeSnapshot();receiveExchange({type:'action',seq:handoffSeq,k:'deliver',a:0,x:198,z:80});
check(exchangeSnapshot()===guestSale&&s.cash===490&&s.sold===3&&player.x===210,'fresh guest delivery commits once and restores host pose');
check(exchangePackets.some(p=>p.type==='ack'&&p.error),'rejected shared exchanges return actionable acknowledgment');
check(!remoteActionAllowed({k:'deliver',a:0,x:NaN,z:80}),'invalid shared claimed coordinate rejected');
net.role='guest';player.set(198,1.72,80);const exchangeOwnSlot=localStorage.getItem('gummybay-v3-free-1');action('sample',0,6);
check(exchangePackets.at(-2)?.type==='position'&&exchangePackets.at(-2).player.y===1.72&&exchangePackets.at(-1)?.type==='action','guest publishes current eye position before exchange request');
menu('customer',0);$('sampleType').value='6';const movedCustomerState=JSON.parse(JSON.stringify(s));movedCustomerState.npcs[0]={x:206,z:80};movedCustomerState.packs[6]=1;
const frozenCustomerX=CONTACTS[0].x;receiveExchange({type:'state',state:movedCustomerState,player:{x:210,y:1.72,z:80,yaw:0}});updateUI();
check(CONTACTS[0].x===frozenCustomerX&&$('customerSample').disabled&&$('customerReach').textContent.includes('closer'),'open guest menu uses newer host position despite frozen local animation');
const movedHostPackets=exchangePackets.length;action('sample',0,6);check(exchangePackets.length===movedHostPackets,'departed host-snapshot customer cannot receive stale guest action');
movedCustomerState.npcs[0]={x:200,z:80};receiveExchange({type:'state',state:movedCustomerState,player:{x:210,y:1.72,z:80,yaw:0}});updateUI();check(!$('customerSample').disabled&&$('customerReach').textContent.includes('Within reach')&&$('sampleType').value==='6','host snapshot can restore reach without resetting sample selection');
net.connected=false;menu('customer',0);refreshCustomerPanel();check($('customerSample').disabled&&$('customerReach').textContent.includes('Reconnect'),'disconnected guest sees disabled handoff');
const disconnectedPackets=exchangePackets.length;action('sample',0,6);save();check(exchangePackets.length===disconnectedPackets&&localStorage.getItem('gummybay-v3-free-1')===exchangeOwnSlot,'disconnected guest cannot send or overwrite personal save');net.role='solo';
console.log('PASS: real wall/elevation/van/invalid handoff guards, prompt and stale-menu state, sample-selection preservation, exact sales/receipts/reload, fresh/stale/malformed peer authority, command replay and guest local-save protection; DOM/WebGL/channels mocked.');
// Authoritative approaches use authored public-side points, not vendor bodies.
load('story',3,true);close();
function visitFixture(k,a){const p=points.find(p=>actionPointMatches(p,k,a)&&pointVisible(p)&&!blocked(p.x,p.z));check(!!p,'real interaction point for '+k);player.set(p.x,1.72+floorHeight(p.x,p.z),p.z);close();return p;}
function completeFixtureWork(){let steps=0;while(stationTask&&steps++<12)advanceStation(10000);check(!stationTask,'bounded automatic task completion');work=null;}
function performFixtureWork(k,a,b){visitFixture(k,a);action(k,a,b);check(!!stationTask,'manual task starts at real point '+k);completeFixtureWork();}
visitFixture('call');action('call');visitFixture('rent');action('rent');
for(const k of ['buyTent','buyCan','buyTrimmers','buyPackStation','soil','seed','wrappers']){visitFixture(k,0);action(k,0);}
check(s.cash===50&&s.called===1&&s.room&&s.tents===1&&s.can&&s.trimmers&&s.packStation,'actual situated opening purchases keep the $350 budget');
visitFixture('install',0);action('install',0);work=null;performFixtureWork('prepare',0);performFixtureWork('plant',0,0);performFixtureWork('fill');performFixtureWork('water',0);
s.plants[0].end=Date.now()-1;production(0);check(s.plants[0].phase==='thirsty','first growth stage reaches second watering');performFixtureWork('water',0);
s.plants[0].end=Date.now()-1;production(0);performFixtureWork('harvest',0);check(s.raw[0]===4,'situated harvest yields four inputs');
for(let i=0;i<4;i++){performFixtureWork('make',0);performFixtureWork('pack',0);}
action('list',0,4,30);action('text',0);close();player.set(CONTACTS[0].x,1.72,CONTACTS[0].z);action('deliver',0);
check(s.cash===170&&s.sold===4&&s.xp===20&&s.packs[0]===4&&s.threads[0].lastSale.qty===4,'actual guarded first-sale pipeline preserves cash/stock/reward and leaves the unused starter packs');
save();load('story',3,false);check(s.cash===170&&s.sold===4&&s.threads[0].lastSale.qty===4,'situated first sale survives v3 reload');
check(s.chapter===11,'first-sale reload derives the first unmet milestone instead of trusting the old counter');menu('journal');check($('modal').innerHTML.includes('Gummy Bay journey · 11 / 14 milestones')&&$('modal').innerHTML.includes('Next: 12 · Call home'),'first-sale reload exposes an exact honest resume point');close();
const staleJourney=fresh('story');staleJourney.called=1;staleJourney.room=true;staleJourney.chapter=13;localStorage.setItem('gummybay-v3-story-2',JSON.stringify(staleJourney));load('story',2,false);
check(s.chapter===0&&JSON.parse(localStorage.getItem('gummybay-v3-story-2')).chapter===0,'older save repairs an impossible forward chapter and persists the correction');menu('journal');check($('modal').innerHTML.includes('Gummy Bay journey · 2 / 14 milestones')&&$('modal').innerHTML.includes('Next: 01 · Gramps’ starter batch'),'older save resumes at its first real gap');close();
load('story',3,false);const legacyJourney=JSON.parse(JSON.stringify(s));delete legacyJourney.chapter;pendingReset={state:legacyJourney};confirmImport();
check(s.chapter===11&&JSON.parse(localStorage.getItem('gummybay-v3-story-3')).chapter===11,'legacy import derives and saves its journey without a new schema field');menu('journal');check($('modal').innerHTML.includes('Gummy Bay journey · 11 / 14 milestones'),'legacy import keeps its earned first-sale progress visible');close();
const personalJourneySlot=localStorage.getItem('gummybay-v3-story-3'),sharedJourney=JSON.parse(personalJourneySlot);sharedJourney.called=2;sharedJourney.hired=1;sharedJourney.helpers.gardener=true;sharedJourney.house=1;sharedJourney.chapter=0;
net.role='guest';net.connected=true;const journeyPackets=[],journeyChannel={readyState:'open',send(payload){journeyPackets.push(JSON.parse(payload))},close(){}};wireChannel(journeyChannel);journeyChannel.onmessage({data:JSON.stringify({type:'welcome',state:sharedJourney,mode:'story'})});
check(s.chapter===13,'guest derives journey progress from the authoritative host snapshot');menu('journal');check($('modal').innerHTML.includes('Gummy Bay journey · 13 / 14 milestones')&&$('modal').innerHTML.includes('Next: 14 · A sweet little empire'),'guest sees the shared world resume point');close();save();check(localStorage.getItem('gummybay-v3-story-3')===personalJourneySlot,'guest journey reconciliation never overwrites the personal slot');disconnect(false);load('story',3,false);
console.log('PASS: fresh, situated first-sale reload, stale older save, legacy import and guest host-snapshot journeys derive the first real gap across 14 milestones while preserving v3 and guest slots; DOM/WebGL/channels mocked.');
load('story',3,false);close();menu('journal');check($('modal').innerHTML.includes('Business footprint')&&$('modal').innerHTML.includes('NOW · Room 04 workshop')&&$('modal').innerHTML.includes('4 sold'),'real first-sale save presents its current workshop scale and lifetime sales');close();
load('free',3,true);close();const portraitState=()=>JSON.stringify([s.cash,s.bank,s.xp,s.room,s.house,s.tents,s.installed,s.helpers,s.can,s.trimmers,s.packStation,s.mixer,s.vehicleOwned,s.irrigation,s.sold,s.earned,s.seeds,s.raw,s.gummies,s.packs,s.storedPacks]),portraitFresh=portraitState();menu('pause');check($('modal').innerHTML.includes('NOW · Old RV start')&&$('modal').innerHTML.includes('0/0 grow spaces installed')&&$('modal').innerHTML.includes('Rent Room 04'),'fresh pause menu presents the RV beginning and next spatial step');close();check(portraitState()===portraitFresh,'fresh business portrait is read-only');
s.room=true;s.tents=3;s.installed=[0,1];s.can=s.trimmers=s.packStation=true;s.xp=60;s.bank=1199;s.sold=4;s.earned=120;const portraitRoom=portraitState();menu('property');
check($('modal').innerHTML.includes('NOW · Room 04 workshop')&&$('modal').innerHTML.includes('2/2 grow spaces installed')&&$('modal').innerHTML.includes('64 total-goods capacity')&&$('modal').innerHTML.includes('$1,200'),'room portrait compares installed scale, capacity and exact next deed target');close();check(portraitState()===portraitRoom,'room portrait does not mutate business state');
const portraitPersonalSlot=localStorage.getItem('gummybay-v3-free-3'),portraitShared=JSON.parse(JSON.stringify(s));portraitShared.house=2;portraitShared.xp=120;portraitShared.bank=0;portraitShared.tents=8;portraitShared.installed=[0,1,2,3,4,5,6,7];portraitShared.helpers={gardener:true,crafter:true,seller:true};portraitShared.hired=3;portraitShared.sold=24;portraitShared.earned=1440;portraitShared.mixer=true;portraitShared.vehicleOwned=true;portraitShared.irrigation=true;
net.role='guest';net.connected=true;const portraitChannel={readyState:'open',send(){},close(){}};wireChannel(portraitChannel);portraitChannel.onmessage({data:JSON.stringify({type:'welcome',state:portraitShared,mode:'free'})});menu('property');
check($('modal').innerHTML.includes('NOW · Hillside house')&&$('modal').innerHTML.includes('8/8 grow spaces installed')&&$('modal').innerHTML.includes('640 total-goods capacity')&&$('modal').innerHTML.includes('3/3 crew')&&$('modal').innerHTML.includes('Full property ladder'),'accepted host snapshot presents the expanded business without inventing guest progress');close();save();check(localStorage.getItem('gummybay-v3-free-3')===portraitPersonalSlot,'guest business portrait never writes the personal slot');disconnect(false);
console.log('PASS: fresh RV, real first-sale Room 04, prepared Room/Harbor target and authoritative Hillside snapshot business portraits expose exact spatial capacity, equipment, crew, sales and next expansion without save mutation; DOM/WebGL/channels mocked.');
load('free',3,true);close();const pingPersonalSlot=localStorage.getItem('gummybay-v3-free-3'),outboundPings=[];player.set(140,1.72,-147);net.role='guest';net.connected=true;
const outboundPingChannel={readyState:'open',send(payload){outboundPings.push(JSON.parse(payload))},close(){}};wireChannel(outboundPingChannel);sendPartnerPing();
check(outboundPings.at(-2).type==='position'&&outboundPings.at(-1).type==='ping'&&outboundPings.at(-1).seq===1&&outboundPings.at(-1).x===140&&outboundPings.at(-1).z===-147,'guest publishes a current pose before a bounded sequenced ping');save();check(localStorage.getItem('gummybay-v3-free-3')===pingPersonalSlot,'sending a guest ping cannot write the personal slot');disconnect(false);
load('free',3,false);close();player.set(-58,1.72,26);net.role='host';net.connected=true;const hostPingPackets=[],hostPingChannel={readyState:'open',send(payload){hostPingPackets.push(JSON.parse(payload))},close(){}};wireChannel(hostPingChannel);
hostPingChannel.onmessage({data:JSON.stringify({type:'position',player:{x:140,y:1.72,z:-147,yaw:0}})});hostPingChannel.onmessage({data:JSON.stringify({type:'ping',seq:1,x:140,z:-147})});
check(partnerPing?.from==='Partner'&&partnerPing.x===140&&partnerPing.z===-147,'host accepts a fresh corroborated partner ping');const pingMap=paintTownMap(mc,334,288,true);check(pingMap.pingOffscreen,'distant partner ping remains visible as a local-map edge marker');menu('network');check($('modal').innerHTML.includes('Partner ping')&&$('modal').innerHTML.includes('metres away')&&$('modal').innerHTML.includes('Track ping'),'multiplayer panel presents distance and tracking action');trackPartnerPing();check(track?.type==='coopPing'&&track.x===140&&track.z===-147,'partner ping becomes an ordinary optional navigation target');
hostPingChannel.onmessage({data:JSON.stringify({type:'ping',seq:1,x:-47,z:29})});check(partnerPing.x===140&&partnerPing.z===-147,'replayed ping cannot replace the accepted location');hostPingChannel.onmessage({data:JSON.stringify({type:'ping',seq:2,x:200,z:-147})});check(partnerPing.x===140&&partnerPing.z===-147,'guest cannot forge a ping away from its fresh peer pose');
clearPartnerPing();const replacementPingChannel={readyState:'open',send(){},close(){}};wireChannel(replacementPingChannel);hostPingChannel.onmessage({data:JSON.stringify({type:'ping',seq:2,x:140,z:-147})});check(!partnerPing,'obsolete channel cannot restore a cleared ping');
net.role='guest';net.connected=true;const inboundPersonal=localStorage.getItem('gummybay-v3-free-3'),inboundPingChannel={readyState:'open',send(){},close(){}};wireChannel(inboundPingChannel);inboundPingChannel.onmessage({data:JSON.stringify({type:'ping',seq:1,x:0,z:-230})});
check(partnerPing?.from==='Host'&&partnerPing.x===0&&partnerPing.z===-230,'guest accepts the authoritative host location without local-save mutation');partnerPing.receivedAt=performance.now()-COOP_PING_TTL-1;menu('network');check(!partnerPing&&$('modal').innerHTML.includes('No active ping'),'expired host ping clears from navigation and the panel');save();check(localStorage.getItem('gummybay-v3-free-3')===inboundPersonal,'received and expired guest ping never changes the personal slot');disconnect(false);check(!partnerPing&&track?.type!=='coopPing','disconnect clears ephemeral ping state');
console.log('PASS: real guest send/pose ordering, host corroboration, replay/forgery/stale-channel rejection, edge-map marker, optional tracking, expiry, disconnect and guest personal-save protection for co-op pings; DOM/WebGL/channels mocked.');
load('free',3,true);close();s.cash=400;s.can=false;s.trimmers=false;const activityShop=visitFixture('buyCan');net.role='host';net.connected=true;
const hostActivityPackets=[],hostActivityChannel={readyState:'open',send(payload){hostActivityPackets.push(JSON.parse(payload))},close(){}};wireChannel(hostActivityChannel);
action('buyCan');let activityPackets=hostActivityPackets.filter(packet=>packet.type==='activity');
check(s.can&&s.cash===385&&activityPackets.length===1&&activityPackets[0].event.actor==='Host'&&activityPackets[0].event.key==='buyCan','successful host purchase creates one canonical shared-work event');
action('buyCan');check(hostActivityPackets.filter(packet=>packet.type==='activity').length===1,'failed repeated purchase cannot create activity');
const partnerShopPose={x:activityShop.x,y:1.72,z:activityShop.z,yaw:0},receiveActivityHost=message=>hostActivityChannel.onmessage({data:JSON.stringify(message)});
receiveActivityHost({type:'position',player:partnerShopPose});receiveActivityHost({type:'action',seq:1,k:'buyTrimmers',x:partnerShopPose.x,z:partnerShopPose.z});activityPackets=hostActivityPackets.filter(packet=>packet.type==='activity');
check(s.trimmers&&s.cash===375&&activityPackets.length===2&&activityPackets[1].event.actor==='Partner'&&activityPackets[1].event.key==='buyTrimmers','fresh partner purchase creates one host-verified partner event');
receiveActivityHost({type:'action',seq:1,k:'buyTrimmers',x:partnerShopPose.x,z:partnerShopPose.z});check(hostActivityPackets.filter(packet=>packet.type==='activity').length===2,'replayed partner command cannot duplicate shared activity');
menu('network');check($('modal').innerHTML.includes('Recent shared work')&&$('modal').innerHTML.includes('Partner bought trimmers')&&$('modal').innerHTML.includes('Host bought a watering can'),'host multiplayer panel presents newest verified actions and actors');close();
const hostEvent=activityPackets[1],activityPersonalSlot=localStorage.getItem('gummybay-v3-free-3');net.role='guest';net.connected=true;
const guestActivityChannel={readyState:'open',send(){},close(){}};wireChannel(guestActivityChannel);guestActivityChannel.onmessage({data:JSON.stringify(hostEvent)});guestActivityChannel.onmessage({data:JSON.stringify(hostEvent)});
guestActivityChannel.onmessage({data:JSON.stringify({type:'activity',event:{...hostEvent.event,sequence:3,key:'<script>'}})});guestActivityChannel.onmessage({data:JSON.stringify({type:'activity',event:{...hostEvent.event,sequence:3,actor:'Host',key:'water',item:0,amount:1}})});
check(coopActivity.length===2&&coopActivity[0].key==='buyTrimmers'&&coopActivity[1].key==='water','guest accepts increasing canonical host events but rejects replay and unknown keys');menu('network');check($('modal').innerHTML.includes('Host watered a crop')&&$('modal').innerHTML.includes('Pine Pop'),'guest sees canonical copy without accepting remote HTML');close();
const replacementActivityChannel={readyState:'open',send(){},close(){}};wireChannel(replacementActivityChannel);guestActivityChannel.onmessage({data:JSON.stringify({type:'activity',event:{...hostEvent.event,sequence:4}})});check(coopActivity.length===0,'obsolete channel cannot restore a cleared activity trail');
save();check(localStorage.getItem('gummybay-v3-free-3')===activityPersonalSlot,'received activity never writes the guest personal slot');disconnect(false);check(coopActivity.length===0,'disconnect clears the ephemeral activity trail');
console.log('PASS: host and partner shared-work derivation, failed-action and command-replay suppression, canonical guest receipt, hostile-key/stale-channel rejection, panel copy, disconnect and guest personal-save protection; DOM/WebGL/channels mocked.');
load('free',2,true);close();
for(let home=0;home<3;home++){
 s.house=home;s.room=true;s.tents=maxTents();s.installed=[];refreshBase();
 for(const p of points.filter(p=>physicalPointTypes.has(p.type)&&pointVisible(p))){
  check(pointApproach({x:p.x,y:1.72+floorHeight(p.x,p.z),z:p.z+.25},p,blocked,floorHeight),'real public-side approach remains clear: '+p.type+' home '+home);
 }
}
s.house=0;refreshBase();s.helpers.crafter=true;s.packStation=true;s.packs[0]=2;s.gummies[0]=1;s.wrappers=1;s.raw[0]=4;
const approachSnapshot=()=>JSON.stringify([s.cash,s.bank,s.raw,s.gummies,s.packs,s.storedPacks,s.wrappers,s.helpers,s.workerEnabled,s.staffConfig,s.can]);
const shopFixture=visitFixture('buyCan'),shopBlock={x:shopFixture.x,z:shopFixture.z+1,w:5,d:.3};player.z+=2;colliders.push(shopBlock);const shopBefore=approachSnapshot();
menu('hardware');check($('modal').innerHTML.includes('approachStatus'),'shop menu contains reach guidance');action('buyCan');doAction('buyCan');check(approachSnapshot()===shopBefore,'local and authoritative shop transaction cannot cross wall');
close();updateUI();check(near?.type!=='hardware','occluded shop prompt suppressed');near=shopFixture;act();check(!panel,'stale shop reference cannot open through wall');check(colliders.pop()===shopBlock,'remove only shop wall');
player.set(shopFixture.x+5,1.72,shopFixture.z);check(physicalActionAccess('buyCan').ok,'real shop interaction allows inclusive five-metre boundary');player.x+=.001;check(!physicalActionAccess('buyCan').ok,'real shop interaction rejects beyond boundary');
player.set(200,1.72,80);menu('hardware');refreshApproachPanel();check($('approachStatus').textContent.includes('Walk to a clear'),'stale shop menu reports lost approach');action('buyCan');check(approachSnapshot()===shopBefore,'distant stale purchase has no side effects');
action('list',0,1,30);check(s.listing?.qty===1,'phone listing remains available away from physical shops');close();
visitFixture('buyCan');driving=true;action('buyCan');check(approachSnapshot()===shopBefore,'shop purchases require leaving the van');driving=false;player.y=3.2;action('buyCan');check(approachSnapshot()===shopBefore,'elevated shop purchase rejected');player.y=1.72;player.x=NaN;doAction('buyCan');check(approachSnapshot()===shopBefore,'nonfinite shop position rejected');
visitFixture('buyCan');action('buyCan');check(s.can&&s.cash===385,'valid counter-side purchase succeeds once');
const clearCraft=visitFixture('pack'),workBlock={x:clearCraft.x,z:clearCraft.z+.75,w:5,d:.3};player.z+=1.5;colliders.push(workBlock);const workBefore=approachSnapshot();
action('pack',0);check(!stationTask&&approachSnapshot()===workBefore,'wall blocks workshop task before input is captured');check(colliders.pop()===workBlock,'remove workshop start wall');
action('pack',0);check(!!stationTask,'clear work surface starts task');colliders.push(workBlock);const approachTones=[],savedApproachTone=playTone;playTone=(...args)=>approachTones.push(args);completeFixtureWork();playTone=savedApproachTone;check(approachSnapshot()===workBefore,'new obstruction at final commit consumes no inputs or wrapper');check(approachTones.length===0&&!panel&&!stationView.visible,'rejected completion returns to exploration without a success tone');check(colliders.pop()===workBlock,'remove workshop commit wall');
visitFixture('make');s.bench=1;startBatch('make',0,4);check(stationTask?.batch.count===4,'clear upgraded batch begins');player.set(200,1.72,80);completeFixtureWork();check(approachSnapshot()===workBefore,'departed batch completion cannot craft remotely');
const shelfFixture=visitFixture('stash'),shelfBlock={x:shelfFixture.x,z:shelfFixture.z+1,w:4,d:.3};player.z+=2;colliders.push(shelfBlock);const shelfBefore=approachSnapshot();action('stash',0,1);check(approachSnapshot()===shelfBefore,'close but occluded stockroom transfer rejected');check(colliders.pop()===shelfBlock,'remove stockroom fixture');
const rosterFixture=visitFixture('worker'),rosterBlock={x:rosterFixture.x,z:rosterFixture.z+1,w:4,d:.3};
// Choose the current workshop board explicitly; the hiring office remains separate.
const currentBoard=points.find(p=>p.type==='staffboard'&&pointVisible(p));player.set(currentBoard.x,1.72,currentBoard.z+2);rosterBlock.x=currentBoard.x;rosterBlock.z=currentBoard.z+1;colliders.push(rosterBlock);
menu('staffboard');$('crewProduct_crafter').value='2';document.activeElement=$('crewProduct_crafter');refreshCrewPanel();check($('crewToggle_crafter').disabled&&document.activeElement.value==='2','blocked roster disables controls without replacing edited selection');
const rosterBefore=approachSnapshot();action('worker','crafter');action('staffAssign','crafter','stock','stored');check(approachSnapshot()===rosterBefore,'occluded staff controls do not toggle or alter assignment');check(colliders.pop()===rosterBlock,'remove roster fixture');refreshCrewPanel();check(!$('crewToggle_crafter').disabled&&document.activeElement.value==='2','clear roster restores controls and preserves selection');document.activeElement=null;close();
visitFixture('buyCan');s.can=false;net.role='host';net.connected=true;const servicePackets=[],serviceChannel={readyState:'open',send(data){servicePackets.push(JSON.parse(data))},close(){}};wireChannel(serviceChannel);
const servicePose={x:shopFixture.x,y:1.72,z:shopFixture.z+2,yaw:0},serviceReceive=m=>serviceChannel.onmessage({data:JSON.stringify(m)});let serviceSeq=0;
const serviceBuy=()=>serviceReceive({type:'action',seq:++serviceSeq,k:'buyCan',x:servicePose.x,z:servicePose.z}),peerShopBefore=approachSnapshot();
serviceBuy();check(approachSnapshot()===peerShopBefore,'shared shop requires fresh channel position');serviceReceive({type:'position',player:servicePose});colliders.push(shopBlock);serviceBuy();check(approachSnapshot()===peerShopBefore,'shared shop uses same occluded-approach guard');check(colliders.pop()===shopBlock,'remove shared shop fixture');
net.peerPoseSeenAt=performance.now()-2001;serviceBuy();check(approachSnapshot()===peerShopBefore,'expired peer position cannot buy');serviceReceive({type:'position',player:servicePose});player.set(200,1.72,80);const cashBeforeSharedShop=s.cash;serviceBuy();
check(s.can&&s.cash===cashBeforeSharedShop-15&&player.x===200,'fresh clear shared purchase succeeds and restores host pose');const afterSharedShop=approachSnapshot();serviceReceive({type:'action',seq:serviceSeq,k:'buyCan',x:servicePose.x,z:servicePose.z});check(approachSnapshot()===afterSharedShop,'replayed shared shop command cannot spend twice');
net.role='guest';player.set(200,1.72,80);const guestServiceSlot=localStorage.getItem('gummybay-v3-free-2'),serviceCount=servicePackets.length;action('wrappers');save();check(servicePackets.length===serviceCount&&localStorage.getItem('gummybay-v3-free-2')===guestServiceSlot,'guest stale shop click neither sends nor writes local slot');net.role='solo';net.connected=false;
console.log('PASS: real point approaches across all shops/three properties, $400-to-first-sale/reload pipeline, stale/occluded/elevated/van/finite guards, workstation start and final-commit conservation, roster editing, stockroom access, shared freshness/replay and guest save protection. Growth stages/task credits simulated; DOM/WebGL/channels mocked.');
load('free',3,true);close();player.set(200,1.72,80);s.made=1;const policeFixture=ensurePolice();
function quietPoliceFixture(){for(const c of ensurePolice().officers)Object.assign(c,{x:-200,z:-400,mode:'patrol',target:null,suspicion:0,lost:0});}
quietPoliceFixture();Object.assign(policeFixture.officers[0],{x:203,z:80,mode:'stop',target:'host',suspicion:100,lost:1});Object.assign(policeFixture.officers[1],{x:205,z:80,mode:'pursuit',target:'host',suspicion:0});update(0);
check($('policeStatus').textContent.startsWith('PURSUIT')&&!$('policeComply').disabled,'actual HUD prioritizes pursuit over higher-suspicion stop');
quietPoliceFixture();Object.assign(policeFixture.officers[0],{x:220,z:80,mode:'pursuit',target:'host'});update(0);check($('policeComply').disabled&&$('policeStatus').textContent.includes('18 m'),'far surrender explains real reach');
Object.assign(policeFixture.officers[0],{x:203,z:80});const policeWall={x:201.5,z:80,w:.3,d:6};colliders.push(policeWall);update(0);complyPolice();check(!policeFixture.search&&$('policeComply').disabled,'occluded surrender is unavailable and cannot start search');check(colliders.pop()===policeWall,'remove police sight fixture');
quietPoliceFixture();Object.assign(policeFixture.officers[0],{x:203,z:80,mode:'stop',target:'host',lost:2,suspicion:100});update(0);check($('policeStatus').textContent.includes('2s before pursuit'),'actual stop HUD shows remaining grace');
driving=true;policeFixture.officers[0].lost=3.99;tickPolice(.06);check(policeFixture.officers[0].mode==='pursuit'&&s.heat>=70,'ignored stop escalates to pursuit');driving=false;
quietPoliceFixture();Object.assign(policeFixture.officers[0],{x:100,z:80,mode:'pursuit',target:'host',lost:18.01,suspicion:100});tickPolice(.06);check(policeFixture.officers[0].mode==='patrol'&&!policeFixture.officers[0].target,'lost pursuit returns to patrol');
load('free',3,true);close();s.day=4;s.room=true;s.packStation=true;s.made=1;s.bank=234;s.seeds[0]=9;s.soil=3;s.raw[0]=5;s.gummies[0]=2;s.packs[0]=3;s.storedPacks[0]=8;s.wrappers=6;s.helpers.crafter=true;s.staffConfig.crafter.stock='stored';check(pickupCargo(s),'police fixture reserves real worker input');
s.deals=[{npc:0,t:0,qty:1,price:30}];s.threads[0]={status:'agreed',messages:[]};s.listing={t:0,qty:1,price:30};visitFixture('pack');action('pack',0);advanceStation(20);stationHeld=stationAssist=true;
quietPoliceFixture();const searchCop=ensurePolice().officers[0];Object.assign(searchCop,{x:player.x,z:player.z+2,mode:'stop',target:'host',suspicion:100,lost:0});const policeGoods=JSON.stringify([s.raw,s.gummies,s.packs,s.storedPacks,s.wrappers,s.crafterCargo,s.cash,s.bank]),policeCargo=JSON.stringify(s.crafterCargo);
document.activeElement={tagName:'INPUT'};for(const fn of events.keydown)fn({key:'h',repeat:false});check(!!stationTask&&!ensurePolice().search,'typing H cannot surrender or interrupt a task');document.activeElement=null;for(const fn of events.keydown)fn({key:'h',repeat:true});check(!!stationTask&&!ensurePolice().search,'held H repeat is ignored');
keys.w=true;for(const fn of events.keydown)fn({key:'h',repeat:false});
check(ensurePolice().search?.role==='host'&&!stationTask&&!stationHeld&&!stationAssist&&!panel&&JSON.stringify([s.raw,s.gummies,s.packs,s.storedPacks,s.wrappers,s.crafterCargo,s.cash,s.bank])===policeGoods,'H interrupts real workstation without consuming goods and begins compliant search');
const searchedAt={x:player.x,z:player.z};update(.06);production(5);action('list',0,1,30);action('worker','crafter');
 s.vehicleOwned=true;vehiclePose={x:player.x,z:player.z,angle:0};enterVehicle();check(!driving,'cannot enter van during own search');driving=true;exitVehicle();check(driving&&player.x===searchedAt.x&&player.z===searchedAt.z,'cannot use van exit teleport during own search');driving=false;
check(!keys.w&&player.x===searchedAt.x&&player.z===searchedAt.z&&JSON.stringify([s.raw,s.gummies,s.packs,s.storedPacks,s.wrappers,s.crafterCargo,s.cash,s.bank])===policeGoods,'search freezes local input and shared business/worker production without cargo loss');
const remainingSearch=ensurePolice().search.remaining;tickPolice(NaN);tickPolice(-1);check(ensurePolice().search.remaining===remainingSearch,'invalid elapsed input cannot corrupt or reverse search');save();load('free',3,false);close();check(ensurePolice().search.remaining===remainingSearch&&JSON.stringify(s.crafterCargo)===policeCargo,'in-progress search and reserved cargo survive v3 reload');
for(let i=0;i<80&&ensurePolice().search;i++)update(.06);
check(!ensurePolice().search&&s.cash===280&&s.bank===234&&s.raw[0]===0&&s.gummies[0]===0&&s.packs[0]===0&&s.storedPacks[0]===8&&s.wrappers===5&&s.seeds[0]===9&&JSON.stringify(s.crafterCargo)===policeCargo,'search applies day-4 nine-item/30% ($120) confiscation once and preserves stored/bank/equipment/cargo');
check(!s.deals.length&&!s.listing&&s.threads[0].status==='cancelled'&&ensurePolice().report.seized===9&&$('policeStatus').textContent.startsWith('SEARCH FINISHED'),'orders cancel and outcome appears in actual HUD');
const settledPoliceCash=s.cash;finishPoliceSearch();finishPoliceSearch();check(s.cash===settledPoliceCash,'repeated finish cannot fine twice');menu('journal');check($('modal').innerHTML.includes('Last search outcome')&&$('modal').innerHTML.includes('$120'),'journal preserves exact search outcome');save();load('free',3,false);menu('pause');check(s.cash===280&&$('modal').innerHTML.includes('Last search outcome'),'post-search report and exact funds survive reload');close();
// Position recovery cannot escape active encounters; it works after release.
load('free',1,true);close();s.day=4;s.packs.fill(0);player.set(200,1.72,80);update(0);const recoveryWall={x:201,z:80,w:1,d:1};colliders.push(recoveryWall);player.x=201;Object.assign(ensurePolice().officers[0],{target:'host',mode:'stop'});recoverPosition();check(player.x===201,'position recovery blocked while stopped');beginPoliceSearch('host');recoverPosition();check(player.x===201,'position recovery blocked during search');finishPoliceSearch();recoverPosition();check(player.x===200&&player.z===80,'clear released player can recover to actual last safe position');check(colliders.pop()===recoveryWall,'remove recovery fixture');
// A remote search interrupts host work, but its timer continues through host menus/disconnect.
check(ensurePolice().report.fine===0&&s.cash===400,'empty compliant search leaves cash unchanged');ensurePolice().cooldown=0;s.cash=25;s.bank=100;beginPoliceSearch('host',true);finishPoliceSearch();check(s.cash===5&&s.bank===100&&ensurePolice().report.fine===20,'empty fleeing fine is the $20 floor, taken from cash, not bank');
s.police.report={role:'guest',seized:0,fine:0};save();load('free',1,false);menu('journal');check($('modal').innerHTML.includes('Partner search · 0 carried gummy products'),'legacy report without date metadata loads and renders honestly');close();
load('free',2,true);close();s.day=4;s.room=true;s.packStation=true;s.gummies[0]=1;s.packs[0]=2;s.wrappers=1;s.made=1;visitFixture('pack');action('pack',0);quietPoliceFixture();Object.assign(ensurePolice().officers[0],{x:200,z:78,mode:'stop',target:'guest',suspicion:100});
net.role='host';net.connected=true;const policeChannel={readyState:'open',send(){},close(){}};wireChannel(policeChannel);policeChannel.onmessage({data:JSON.stringify({type:'position',player:{x:200,y:1.72,z:80,yaw:0}})});
const guestComplyCommand={type:'action',seq:1,k:'complyPolice',x:200,z:80};policeChannel.onmessage({data:JSON.stringify(guestComplyCommand)});check(ensurePolice().search?.role==='guest'&&!stationTask&&s.gummies[0]===1&&s.wrappers===1,'guest surrender cancels host shared work without consuming inputs');
const guestSearchState=JSON.parse(JSON.stringify(s)),previousOther=other;other=null;renderFrame();other=previousOther;policeChannel.onmessage({data:JSON.stringify(guestComplyCommand)});check(ensurePolice().search.remaining===4,'shared surrender replay cannot reset timer');
menu('journal');policeChannel.onclose();for(let i=0;i<80&&ensurePolice().search;i++)update(.06);check(panel==='journal'&&!ensurePolice().search&&ensurePolice().report.role==='guest'&&s.cash===280,'partner search completes through host journal/disconnect with three-item/30% ($120) fine');const releasedGuestState=JSON.parse(JSON.stringify(s));
net.role='solo';load('free',1,true);close();s.room=true;s.packStation=true;s.gummies[0]=1;s.wrappers=1;visitFixture('pack');action('pack',0);const personalPoliceSlot=localStorage.getItem('gummybay-v3-free-1');net.role='guest';net.connected=true;const policeGuestChannel={readyState:'open',send(){},close(){}};wireChannel(policeGuestChannel);
policeGuestChannel.onmessage({data:JSON.stringify({type:'state',state:guestSearchState,player:{x:200,y:1.72,z:80,yaw:0}})});const authoritativeRemaining=ensurePolice().search.remaining;update(.06);finishPoliceSearch();save();
check(!stationTask&&ensurePolice().search.remaining===authoritativeRemaining&&s.cash===400&&localStorage.getItem('gummybay-v3-free-1')===personalPoliceSlot,'searched guest cancels task but cannot advance/finalize host search or overwrite own save');
policeGuestChannel.onmessage({data:JSON.stringify({type:'state',state:releasedGuestState,player:{x:200,y:1.72,z:80,yaw:0}})});update(0);check(!ensurePolice().search&&s.cash===280&&$('policeStatus').textContent.startsWith('SEARCH FINISHED'),'guest receives exact authoritative release/outcome');
net.workerSeenAt=performance.now()-5001;update(0);check($('policeStatus').textContent.includes('HOST UPDATE STALE')&&$('policeComply').disabled,'guest stale status does not pretend current police timing');net.connected=false;update(0);check($('policeStatus').textContent.includes('HOST DISCONNECTED'),'guest disconnect has honest police status');net.role='solo';
load('free',1,true);close();s.packs[0]=3;s.cash=116;quietPoliceFixture();ensurePolice().cooldown=0;beginPoliceSearch('host');finishPoliceSearch();check(s.cash===116&&s.packs[0]===3&&ensurePolice().report.tier==='warning'&&ensurePolice().report.fine===0,'day-1 search is a warning: no fine, starter packs kept');
check(warnedToday()&&!squadLive(),'warned day suspends the squad');Object.assign(ensurePolice().officers[0],{x:player.x+2,z:player.z,mode:'stop',target:'host',suspicion:100});tickPolice(.06);check(ensurePolice().officers[0].mode==='patrol'&&!ensurePolice().search,'patrol leaves a warned player alone for the rest of day 1');
console.log('PASS: actual police HUD severity/stop timer/comply reach, H task interruption, search input/production lock, v3 in-progress and outcome reload, original seizure/fines/order cancellation, cargo/stored/bank protection, recovery restrictions, remote search through host menus/disconnect, replay and guest authority/save safety; DOM/WebGL/channels mocked.');
for(const movePhase of ['input','output']){
 load('story',1,true);close();s.room=true;s.xp=180;s.bank=6000;s.tents=2;s.installed=[0,1];s.packStation=true;s.mixer=true;s.can=true;s.helpers.crafter=true;s.workerEnabled.crafter=false;s.staffConfig.crafter.stock='stored';s.raw[0]=4;s.gummies[0]=2;s.packs[0]=3;s.storedPacks[0]=5;s.wrappers=6;s.plants=[{phase:'growing',t:0,waterings:1,start:Date.now(),end:Date.now()+100000},{phase:'soil'}];s.layout['0:0']={x:-31,z:35,r:0,home:0};
 s.deals=[{npc:0,t:0,qty:1,price:30}];s.threads[0]={status:'agreed',messages:[]};check(pickupCargo(s),'actual input reserved before move');if(movePhase==='output')processCargo(s);
 const retainedMove=JSON.stringify([s.plants,s.deals,s.threads,s.storedPacks,s.layout,s.cash,s.helpers,s.staffConfig,s.workerEnabled]),preMoveRaw=s.raw[0],preMovePack=s.packs[0],preMoveWrap=s.wrappers;
 const previousCraft=points.find(p=>p.type==='craft'&&pointVisible(p));visitFixture('house');trackPlace('craft');const purchaseAt={x:player.x,z:player.z};action('house',1);
 check(s.house===1&&s.bank===4800&&s.room&&!s.crafterCargo,'guarded workshop deed settles cargo and debits once before ticking');
 check(s.ledger[0].amount===-1200&&s.ledger[0].balance===4800&&s.ledger[0].label.includes('Harbor workshop'),'deed retains a concrete bank ledger entry');
 check(s.raw[0]===preMoveRaw&&s.gummies[0]===(movePhase==='input'?2:1)&&s.packs[0]===preMovePack+(movePhase==='output'?1:0)&&s.wrappers===preMoveWrap+(movePhase==='input'?1:0),'input/output cargo is recovered in correct form');
 check(JSON.stringify([s.plants,s.deals,s.threads,s.storedPacks,s.layout,s.cash,s.helpers,s.staffConfig,s.workerEnabled])===retainedMove&&player.x===purchaseAt.x&&player.z===purchaseAt.z,'deed preserves crops/orders/layout/settings and player position');
 const newCraft=points.find(p=>p.type==='craft'&&pointVisible(p)),moveSaved=JSON.parse(localStorage.getItem('gummybay-v3-story-1'));
 check(moveSaved.house===1&&!moveSaved.crafterCargo&&moveSaved.bank===4800&&physicalCrafter.home===1&&physicalCrafter.position.x===workerContext().source.x&&physicalCrafter.progress===0,'saved/worker state never exposes stale-home cargo');
 check(track.x===newCraft.x&&track.z===newCraft.z&&!physicalActionAccess('make',0,{x:previousCraft.x,y:1.72,z:previousCraft.z},false).ok,'work marker follows relocation and old workstation loses authority');
 check($('modal').innerHTML.includes('Your workshop · Harbor workshop')&&$('modal').innerHTML.includes('4 tent spaces')&&$('modal').innerHTML.includes(movePhase==='input'?'reserved input and wrapper':'finished pack'),'property menu gives concrete relocation guide and cargo receipt');
 const noDuplicateMove=JSON.stringify([s.bank,s.raw,s.gummies,s.packs,s.wrappers,s.lastMove]);action('house',1);check(JSON.stringify([s.bank,s.raw,s.gummies,s.packs,s.wrappers,s.lastMove])===noDuplicateMove,'repeat deed cannot refund cargo or debit again');
 visitFixture('worker');action('worker','crafter');close();const goodsMoveTotal=()=>['raw','gummies','packs','storedPacks'].reduce((n,k)=>n+s[k].reduce((a,b)=>a+b,0),s.crafterCargo?1:0),beforeMoveCycle=goodsMoveTotal(),beforeMoveStorage=s.storedPacks[0];
 for(let i=0;i<1000&&s.storedPacks[0]===beforeMoveStorage;i++){physicalCrafter.tick(s,.06,workerContext());check(goodsMoveTotal()===beforeMoveCycle,'relocated supply/work/storage cycle conserves goods each tick');}
 check(s.storedPacks[0]===beforeMoveStorage+1&&!s.crafterCargo,'worker completes real routes after actual workshop purchase');visitFixture('worker');action('worker','crafter');
 check(pickupCargo(s),'reserve next batch before second deed');processCargo(s);trackCustomer(0);const retainedMeeting=JSON.stringify(track);visitFixture('house');action('house',2);
 check(s.house===2&&s.bank===1300&&!s.crafterCargo&&maxTents()===8&&JSON.stringify(track)===retainedMeeting,'actual Hillside purchase preserves customer tracking and returns finished cargo once');
 check(s.ledger[0].amount===-3500&&s.ledger[0].balance===1300&&s.ledger.filter(p=>p.label.startsWith('Property deed')).length===2,'second deed records exactly one matching bank debit');
 const secondCycleBefore=s.storedPacks[0];visitFixture('worker');action('worker','crafter');close();for(let i=0;i<1000&&s.storedPacks[0]===secondCycleBefore;i++)physicalCrafter.tick(s,.06,workerContext());check(s.storedPacks[0]===secondCycleBefore+1,'worker completes supply/work/storage cycle after second actual deed');
 const movePlayer={x:player.x,z:player.z};trackWorkshop('work');check(track.x===points.find(p=>p.type==='craft'&&pointVisible(p)).x&&player.x===movePlayer.x&&player.z===movePlayer.z,'workshop route button tracks without teleporting');
 save();const finalMoveCrop=JSON.stringify(s.plants),finalMoveOrders=JSON.stringify(s.deals);load('story',1,false);menu('journal');check(s.house===2&&s.bank===1300&&JSON.stringify(s.plants)===finalMoveCrop&&JSON.stringify(s.deals)===finalMoveOrders&&$('modal').innerHTML.includes('Your workshop · Hillside house'),'relocated crops/orders/guide and balances survive v3 reload');
 const oldMoveSave=JSON.parse(localStorage.getItem('gummybay-v3-story-1'));delete oldMoveSave.lastMove;localStorage.setItem('gummybay-v3-story-1',JSON.stringify(oldMoveSave));load('story',1,false);menu('journal');check($('modal').innerHTML.includes('Your workshop · Hillside house')&&!workshopGuideHTML().includes('Moved from'),'old saves get current guidance without invented relocation history');
}
load('free',3,true);close();s.room=true;s.xp=60;s.bank=1500;s.packStation=true;s.gummies[0]=2;s.wrappers=2;s.helpers.crafter=true;s.staffConfig.crafter.stock='stored';check(pickupCargo(s),'shared move reserves cargo');visitFixture('pack');action('pack',0);const hostMovePosition={x:player.x,z:player.z};
net.role='host';net.connected=true;const movePackets=[],moveChannel={readyState:'open',send(data){movePackets.push(JSON.parse(data))},close(){}};wireChannel(moveChannel);const deedPoint=points.find(p=>p.type==='property');moveChannel.onmessage({data:JSON.stringify({type:'position',player:{x:deedPoint.x,y:1.72,z:deedPoint.z,yaw:0}})});
const sharedDeed={type:'action',seq:1,k:'house',a:1,x:deedPoint.x,z:deedPoint.z};moveChannel.onmessage({data:JSON.stringify(sharedDeed)});
check(s.house===1&&s.bank===300&&!s.crafterCargo&&!stationTask&&player.x===hostMovePosition.x&&player.z===hostMovePosition.z,'guest deed settles host cargo and safely cancels host work without moving host');
const sharedMovedState=JSON.parse(JSON.stringify(s)),sharedMoveAmounts=JSON.stringify([s.bank,s.gummies,s.wrappers,s.lastMove]);moveChannel.onmessage({data:JSON.stringify(sharedDeed)});check(JSON.stringify([s.bank,s.gummies,s.wrappers,s.lastMove])===sharedMoveAmounts,'shared deed replay cannot charge or recover twice');
check(movePackets.some(p=>p.type==='state'&&p.state.house===1&&!p.state.crafterCargo&&p.player.worker.x===workerContext().source.x),'host publishes already-settled cargo and new worker source');
net.role='solo';load('free',2,true);close();s.room=true;s.packStation=true;s.gummies[0]=1;s.wrappers=1;visitFixture('pack');action('pack',0);track={type:'craft',x:player.x,z:player.z,label:'old worktable'};const guestMovePosition={x:player.x,z:player.z},guestMoveSlot=localStorage.getItem('gummybay-v3-free-2');
net.role='guest';net.connected=true;const moveGuestChannel={readyState:'open',send(){},close(){}};wireChannel(moveGuestChannel);moveGuestChannel.onmessage({data:JSON.stringify({type:'state',state:sharedMovedState,player:{x:deedPoint.x,y:1.72,z:deedPoint.z,yaw:0}})});save();
check(s.house===1&&!stationTask&&!placeMode&&track.x===points.find(p=>p.type==='craft'&&pointVisible(p)).x&&player.x===guestMovePosition.x&&player.z===guestMovePosition.z&&localStorage.getItem('gummybay-v3-free-2')===guestMoveSlot,'incoming relocation cancels guest old work, retargets guidance and preserves player/personal save');
check(JSON.stringify([s.bank,s.gummies,s.wrappers,s.lastMove])===sharedMoveAmounts,'guest presentation never refunds shared cargo a second time');
net.role='solo';load('free',2,true);close();s.room=true;s.tents=1;s.installed=[0];refreshBase();beginPlacement(0);check(!!placeMode,'old-property placement preview begins');net.role='guest';net.connected=true;wireChannel(moveGuestChannel);moveGuestChannel.onmessage({data:JSON.stringify({type:'state',state:sharedMovedState,player:{x:deedPoint.x,y:1.72,z:deedPoint.z,yaw:0}})});check(!placeMode&&!placeGhost.visible&&$('placementHUD').hidden,'incoming move cancels stale guest placement without purchasing or losing stock');net.role='solo';net.connected=false;
console.log('PASS: guarded workshop/Hillside deeds with both cargo phases, atomic save/worker relocation, crop/order/layout conservation, duplicate purchase/replay, real supply/work/storage cycles, current-home guide/markers, legacy reload and host/guest stale-work/placement/personal-save protection; DOM/WebGL/channels mocked, progression funds/XP are prepared fixtures.');

// Actual starter purchases, assembly labels and immediate ownership transitions.
net.role='solo';net.connected=false;load('free',1,true);close();renderFrame();
check(s.cash===400&&s.called===0&&tents.every(g=>!g.visible)&&mixers.every(g=>!g.visible)&&assemblyLabels.every(l=>!l.visible),'fresh RV begins with $400 and no purchased equipment');
visitFixture('call');action('call');check(s.called===1,'first payphone call still starts Gramps guide');
visitFixture('rent');action('rent');renderFrame();check(s.cash===325&&s.room&&tents.every(g=>!g.visible),'rental buys space, not an installed tent');
visitFixture('buyTent');action('buyTent');close();renderFrame();check(s.cash===225&&s.tents===1&&!tents[0].visible&&workshopEquipment(s).pending===1,'tent purchase creates one owned frame awaiting assembly, not a free installed model');
const beforeAssemblyTrack={x:player.x,z:player.z};trackAssembly();check(track.purpose==='assembly'&&track.tentIndex===0&&player.x===beforeAssemblyTrack.x&&player.z===beforeAssemblyTrack.z,'assembly navigation tracks actual numbered point without teleporting');
visitFixture('install',0);renderFrame();check(assemblyLabels[0].visible&&!assemblyLabels[1].visible&&assemblyLabels[0].position.x===assemblyPoints[0].x&&!assemblyLabels[0].userData.heading.truncated,'owned pending frame has a fitted label at its actual approach');
const assemblyLabelMaps=assemblyLabels.map(l=>l.material.map),assemblyVersions=assemblyLabelMaps.map(m=>m.version),assemblyChildCount=scene.children.length,assemblyStateBefore=JSON.stringify(s),assemblySavedBefore=signStorageSnapshot(),cachedAssemblyView=equipmentGuideView,assemblyTrackObject=track;
for(let i=0;i<300;i++)refreshEquipmentPresentation();
check(assemblyLabels.every((l,i)=>l.material.map===assemblyLabelMaps[i]&&l.material.map.version===assemblyVersions[i])&&scene.children.length===assemblyChildCount&&JSON.stringify(s)===assemblyStateBefore&&signStorageSnapshot()===assemblySavedBefore&&equipmentGuideView===cachedAssemblyView&&track===assemblyTrackObject,'assembly refresh is read-only with fixed maps and no unchanged uploads');
menu('bag');renderFrame();check(!assemblyLabels[0].visible&&$('modal').innerHTML.includes('1 awaiting assembly')&&$('modal').innerHTML.includes('Find tent 1 assembly spot'),'bag explains pending equipment without an in-world panel overlay');close();
action('install',0);work=null;renderFrame();check(tents[0].visible&&!assemblyLabels[0].visible&&!track&&s.cash===225,'installation shows one real owned tent and clears completed assembly marker without buying again');
const installedOnce=JSON.stringify([s.cash,s.tents,s.installed]);action('install',0);work=null;check(JSON.stringify([s.cash,s.tents,s.installed])===installedOnce,'repeat installation cannot charge or duplicate equipment');
for(const k of ['buyCan','buyTrimmers','buyPackStation']){visitFixture(k);action(k);}
close();renderFrame();check(s.cash===100&&s.can&&s.trimmers&&s.packStation&&visualPolish.workshops[0].g.visible&&visualPolish.workshops[0].sealer.visible&&visualPolish.workshops.slice(1).every(w=>!w.g.visible),'actual early tools/sealer ownership costs remain exact and only active workspace appears');
equipTool('can');renderFrame();check(watering.visible,'bought can still equips');equipTool('can');
visitFixture('buyTent');action('buyTent');s.layout={'0:1':{x:-27,z:40,r:Math.PI/2,home:0}};refreshBase();trackAssembly();check(s.cash===0&&track.tentIndex===1&&track.x===assemblyPoints[1].x&&track.z===assemblyPoints[1].z,'next assembly skips installed tent and follows saved rotated placement');
visitFixture('install',1);action('install',1);work=null;renderFrame();check(tents[1].visible&&assemblyLabels.every(l=>!l.visible)&&!track,'second purchased frame installs once at saved spot');
save();load('free',1,false);renderFrame();check(s.cash===0&&s.called===1&&s.installed.length===2&&s.packStation&&tents.slice(0,2).every(g=>g.visible),'equipment and original call/save-v3 flow survive reload before UI timer');
s.xp=30;s.cash=500;visitFixture('buyMixer');action('buyMixer');close();renderFrame();check(s.cash===0&&s.mixer&&mixers[0].visible&&mixers.slice(1).every(g=>!g.visible),'prepared level-2 funds buy exactly one mixer at the active home');
// Later deeds use prepared funds/XP, not an organically played campaign.
s.bank=6000;s.xp=180;s.payment='card';visitFixture('house');action('house',1);visitFixture('buyTent');action('buyTent');trackAssembly();renderFrame();check(s.house===1&&track.tentIndex===2&&mixers[1].visible&&!mixers[0].visible,'Harbor relocation keeps equipment and marks only next unassembled frame');
visitFixture('house');action('house',2);close();renderFrame();check(s.house===2&&track.tentIndex===2&&track.x===assemblyPoints[2].x&&track.z===assemblyPoints[2].z&&mixers[2].visible&&!mixers[1].visible,'Hillside move preserves assembly index and moves its guide to current saved approach');
player.set(assemblyPoints[2].x,1.72,assemblyPoints[2].z);renderFrame();check(assemblyLabels[2].visible&&assemblyLabels[2].position.x===assemblyPoints[2].x,'new-home label follows real target');
title();renderFrame();check(!active&&!beacon.visible&&tents.every(g=>!g.visible)&&mixers.every(g=>!g.visible)&&assemblyLabels.every(g=>!g.visible)&&workshopDisplays.every(d=>!d.group.visible),'title hides owned equipment without mutating the saved business');
load('free',2,true);renderFrame();check(s.cash===400&&!s.room&&tents.every(g=>!g.visible)&&mixers.every(g=>!g.visible)&&assemblyLabels.every(g=>!g.visible),'fresh slot cannot inherit prior equipment presentation even before next UI tick');
net.role='host';net.connected=true;s.room=true;s.cash=100;const assemblyChannel={readyState:'open',send(){},close(){}};wireChannel(assemblyChannel);const assemblyVendor=points.find(p=>p.type==='hardware');
assemblyChannel.onmessage({data:JSON.stringify({type:'position',player:{x:assemblyVendor.x,y:1.72,z:assemblyVendor.z,yaw:0}})});
const assemblyBuy={type:'action',seq:1,k:'buyTent',x:assemblyVendor.x,z:assemblyVendor.z};assemblyChannel.onmessage({data:JSON.stringify(assemblyBuy)});assemblyChannel.onmessage({data:JSON.stringify(assemblyBuy)});
check(s.tents===1&&s.cash===0&&workshopEquipment(s).pending===1,'host applies guest tent purchase once under replay');
const pendingAssemblySnapshot=JSON.parse(JSON.stringify(s)),assemblyPoint=assemblyPoints[0];
assemblyChannel.onmessage({data:JSON.stringify({type:'position',player:{x:assemblyPoint.x,y:1.72,z:assemblyPoint.z,yaw:0}})});
assemblyChannel.onmessage({data:JSON.stringify({type:'action',seq:2,k:'install',a:0,x:assemblyPoint.x,z:assemblyPoint.z})});
const installedAssemblySnapshot=JSON.parse(JSON.stringify(s));check(installedAssemblySnapshot.installed.includes(0)&&workshopEquipment(s).pending===0,'host installs purchased shared frame without another purchase');
net.role='solo';net.connected=false;load('free',3,true);close();const assemblyPersonal=localStorage.getItem('gummybay-v3-free-3');net.role='guest';net.connected=true;const assemblyGuest={readyState:'open',send(){},close(){}};wireChannel(assemblyGuest);
player.set(assemblyPoint.x,1.72,assemblyPoint.z);assemblyGuest.onmessage({data:JSON.stringify({type:'state',state:pendingAssemblySnapshot,player:{x:assemblyVendor.x,y:1.72,z:assemblyVendor.z,yaw:0}})});renderFrame();check(assemblyLabels[0].visible&&!tents[0].visible,'pending host purchase appears as assembly label, not an installed guest model');
trackAssembly();menu('bag');renderFrame();check($('equipmentGuide').innerHTML.includes('1 awaiting assembly'),'open guest bag shows current host purchase');assemblyGuest.onmessage({data:JSON.stringify({type:'state',state:installedAssemblySnapshot,player:{x:assemblyVendor.x,y:1.72,z:assemblyVendor.z,yaw:0}})});renderFrame();save();check(tents[0].visible&&!assemblyLabels[0].visible&&!track&&$('equipmentGuide').innerHTML.includes('0 awaiting assembly')&&!$('equipmentGuide').innerHTML.includes('Find tent')&&localStorage.getItem('gummybay-v3-free-3')===assemblyPersonal,'host installation clears guest assembly marker and preserves personal save');
net.role='solo';net.connected=false;
console.log('PASS: actual $400/call/rent/tool/tent/sealer purchases, no-cost/replayed installation, numbered assembly/saved rotated positions, fixed maps/300 read-only refreshes, all-property relocation, immediate title/fresh-slot/mixer ownership, reload and host/guest purchase/install/personal-save safety. DOM/WebGL/channels mocked; later XP/funds and direct positions are prepared fixtures.');

// Resource budget: warm real states, then keep identities stable through cycles.
net.role='solo';net.connected=false;load('free',1,true);close();s.room=true;s.house=2;s.tents=8;s.installed=[0,1,2,3,4,5,6,7];s.packStation=true;s.mixer=true;
for(let i=0;i<STRAINS.length;i++){s.raw.fill(0);s.gummies.fill(0);s.storedPacks.fill(0);s.raw[i]=s.gummies[i]=s.storedPacks[i]=1;refreshWorkshop();}
net.role='host';net.connected=true;net.remote={x:200,y:1.72,z:80,yaw:0};networkTick(.4);check(!!other,'first peer avatar allocates once');net.role='solo';net.connected=false;
for(const a of visualActors)prepareActorLOD(a);renderFrame();updateUI();
const warmResources=sceneResources(scene),warmMaterialCache=materials.size,warmGeometryCache=geometry.size,warmActors=visualActors.length,warmAvatars=avatars.length,resourceSave=signStorageSnapshot();
const warmMaterialPool=new Set([...warmResources.materials,...materials.values()]);
const sameResources=(a,b)=>['objects','geometries','textures'].every(k=>a[k].size===b[k].size&&[...a[k]].every(r=>b[k].has(r)))&&[...b.materials].every(m=>warmMaterialPool.has(m));
const actualFactory=createEffects,effectInstances=[];createEffects=()=>{const f={disposed:false,disposeCalls:0,renderCalls:0,resizeCalls:0,dispose(){this.disposed=true;this.disposeCalls++;},render(){check(!this.disposed,'never render disposed effects');this.renderCalls++;},resize(){check(!this.disposed,'never resize disposed effects');this.resizeCalls++;}};effectInstances.push(f);return f;};
setQuality('high');const stableHigh=effects;for(let i=0;i<200;i++)setQuality('high');
check(effects===stableHigh&&effectInstances.length===1,'reselecting High reuses its effect chain instead of rebuilding');
resizeEffects();check(stableHigh.resizeCalls===1,'window resize still reaches the current effects');
const originalDPR=devicePixelRatio;devicePixelRatio=2;setQuality('high');check(effects!==stableHigh&&stableHigh.disposeCalls===1&&renderer.pixelRatio===1.85,'density change reapplies quality and releases previous chain');devicePixelRatio=originalDPR;
const qualityInventory=[];
for(const q of ['performance','balanced','high']){
 setQuality(q);
 camera.position.set(0,2,0);for(const a of visualActors){camera.position.copy(a.g.position);selectActorLOD(a);check(a.body===a.high.body,'near faces retain detailed LOD');camera.position.copy(a.g.position).addScalar(100);selectActorLOD(a);check(a.body===a.low.body,'far actors use existing simplified LOD');}
 renderFrame();const inventory=sceneResources(scene);check(sameResources(warmResources,inventory),'quality changes do not reconstruct scene resources');
 qualityInventory.push({quality:q,...inventory.counts});
}
for(let cycle=0;cycle<24;cycle++){
 setQuality(['performance','balanced','high'][cycle%3]);s.house=cycle%3;s.tents=[2,4,8][s.house];s.installed=Array.from({length:s.tents},(_,i)=>i);s.layout={};s.raw.fill(0);s.gummies.fill(0);s.storedPacks.fill(0);s.raw[cycle%30]=1;s.gummies[cycle%30]=1;s.storedPacks[cycle%30]=1;
 refreshBase();updateUI();renderFrame();net.role='host';net.connected=true;net.remote={x:200,y:1.72,z:80,yaw:cycle*.1};networkTick(.4);net.role='solo';net.connected=false;
 {const currentResourceProbe=sceneResources(scene);if(!sameResources(warmResources,currentResourceProbe)||materials.size!==warmMaterialCache||geometry.size!==warmGeometryCache||visualActors.length!==warmActors||avatars.length!==warmAvatars)console.log('RESOURCE DELTA '+JSON.stringify({cycle,before:warmResources.counts,after:currentResourceProbe.counts,materialCache:[warmMaterialCache,materials.size],geometryCache:[warmGeometryCache,geometry.size],actors:[warmActors,visualActors.length],avatars:[warmAvatars,avatars.length],newMaterial:[...currentResourceProbe.materials].filter(m=>!warmResources.materials.has(m)).map(m=>({type:m.type,color:m.color?.getHex(),roughness:m.roughness,metalness:m.metalness}))}));}
check(sameResources(warmResources,sceneResources(scene))&&materials.size===warmMaterialCache&&geometry.size===warmGeometryCache&&visualActors.length===warmActors&&avatars.length===warmAvatars,'property/inventory/peer cycles reuse warmed resources');
}
const peerResourceState=JSON.parse(JSON.stringify(s));net.role='guest';net.connected=true;const resourceChannel={readyState:'open',send(){},close(){}};wireChannel(resourceChannel);
for(let i=0;i<12;i++){resourceChannel.onmessage({data:JSON.stringify({type:'state',state:peerResourceState,player:{x:200,y:1.72,z:80,yaw:0}})});updateUI();renderFrame();check(sameResources(warmResources,sceneResources(scene)),'incoming snapshots do not clone visual assets');}
save();check(signStorageSnapshot()===resourceSave,'resource and guest snapshot probes preserve personal saves');
net.role='solo';net.connected=false;setQuality('obsolete-setting');check(quality==='balanced'&&!effects&&renderer.shadowMap.enabled,'unknown legacy setting returns to Balanced safely');
check(effectInstances.every(f=>f.disposeCalls===1),'all replaced effect mocks are released exactly once');createEffects=actualFactory;
const allCachedResourceState=sceneResources(scene);
for(const saveMode of ['story','free'])for(let saveSlot=1;saveSlot<=3;saveSlot++){load(saveMode,saveSlot,false);renderFrame();updateUI();check(sameResources(allCachedResourceState,sceneResources(scene)),'six save slots reuse warmed assets');}
console.log('CPU RESOURCE INVENTORY (not GPU draws, memory or FPS): '+JSON.stringify(qualityInventory));
console.log('PASS: stable real scene/geometry/texture identities and warmed material pool across all quality modes, near/far LOD, 24 property/stock/peer cycles, 12 host snapshots and six save slots; no redundant High rebuilds, density/resize recovery, exact-once effect-mock replacement and guest save safety. DOM/WebGL/channels mocked.');


net.role='solo';net.connected=false;load('free',1,true);close();s.room=true;s.house=2;s.time=0;camera.position.set(HOMES[2].x+7,1.72,HOMES[2].z+5);setQuality('balanced');renderFrame();
check(interiorLights.some(l=>l.intensity>0&&Math.hypot(l.position.x-(HOMES[2].x+7),l.position.z-(HOMES[2].z+3))<5),'owned Hillside worktable receives practical light');
const practicalHandles=[...interiorLights],lightingBefore=JSON.stringify(s),lightingSlotsBefore=signStorageSnapshot(),lightingResources=sceneResources(scene),lightingCountBefore=scene.children.filter(o=>o.isLight).length;
for(let i=0;i<300;i++)refreshWorldLighting();
check(JSON.stringify(s)===lightingBefore&&signStorageSnapshot()===lightingSlotsBefore&&sameResources(lightingResources,sceneResources(scene))&&scene.children.filter(o=>o.isLight).length===lightingCountBefore&&interiorLights.every((l,i)=>l===practicalHandles[i]),'lighting refresh reuses original lights/resources and cannot change business or slots');
for(const q of ['balanced','high'])for(let home=0;home<3;home++){
 s.house=home;setQuality(q);refreshBase();
 for(const type of ['craft','staffboard','stockroom']){
  const station=points.find(p=>p.type===type&&pointVisible(p));camera.position.set(station.x,1.72,station.z);renderFrame();
check(interiorLights.some(l=>l.intensity>0&&l.userData.home===home)&&interiorLights.every(l=>l.intensity===0||l.userData.home===home),'active '+q+' home '+home+' '+type+' gets only its own practical lights');
  check(interiorLights.reduce((n,l)=>n+l.intensity,0)<=18.000001,'combined practical brightness stays within the original single-room budget');
 }
}
s.room=false;renderFrame();check(interiorLights.every(l=>l.intensity===0),'unowned workshop cannot claim occupied task lighting');s.room=true;
setQuality('performance');renderFrame();check(interiorLights.every(l=>l.intensity===0)&&Number.isFinite(hemi.intensity)&&hemi.intensity>0,'Performance retains ambient fallback without extra practical-light cost');
setQuality('balanced');renderFrame();check(interiorLights.some(l=>l.intensity>0),'returning to Balanced restores existing workshop lights');
s.time=720;close();renderFrame();const noonLighting={fog:scene.fog.color.getHex(),near:scene.fog.near,far:scene.fog.far,sun:sun.intensity,sky:skyUniforms.night.value,water:waterUniforms.uLight.value};check(lights.every(l=>l.intensity===0),'noon street lamps turn off');
const noonAtmosphere=atmosphericDistancePlan({daylight:1,active:true,quality:'balanced'});check(scene.fog.near===noonAtmosphere.near&&scene.fog.far===noonAtmosphere.far&&waterUniforms.uFogNear.value===noonAtmosphere.waterNear&&waterUniforms.uFogFar.value===noonAtmosphere.waterFar,'actual land and water use one noon distance plan');
for(const view of ATMOSPHERIC_FIXED_VIEWS){const sample=atmosphericViewSeparation(view,noonAtmosphere);check(sample.separated&&sample.foreground<sample.town&&sample.town<sample.backdrop,'actual fixed '+view.id+' view preserves foreground/town/backdrop separation');}
menu('bag');s.time=0;renderFrame();const midnightPlan=worldLighting(0);
check(panel==='bag'&&lights.every(l=>Math.abs(l.intensity-midnightPlan.streetIntensity)<1e-9)&&scene.fog.color.getHex()!==noonLighting.fog&&sun.intensity<noonLighting.sun&&skyUniforms.night.value<noonLighting.sky&&waterUniforms.uLight.value<noonLighting.water,'clock replacement during an open menu updates sun/fog/sky/water/street lights coherently without a movement tick');
const midnightAtmosphere=atmosphericDistancePlan({daylight:0,active:true,quality:'balanced'});check(scene.fog.near===midnightAtmosphere.near&&scene.fog.far===midnightAtmosphere.far&&scene.fog.far<noonLighting.far,'night haze tightens coherently without entering the crisp foreground');
check(waterUniforms.uFog.value.equals(scene.fog.color)&&skyUniforms.bottom.value.equals(scene.fog.color)&&porchBulbs.every(b=>Math.abs(b.material.emissiveIntensity-midnightPlan.porchEmission)<1e-9),'night water/sky fog and porch emission use the same plan');
title();renderFrame();check(!active&&interiorLights.every(l=>l.intensity===0)&&renderer.toneMappingExposure===worldLighting(s.time,false).exposure&&scene.fog.color.getHex()===0x26352f,'title resets exposure/fog and releases occupied-workshop light assignment');
load('free',2,true);close();s.room=true;s.house=1;s.time=1300;save();load('free',2,false);menu('bag');camera.position.set(HOMES[1].x+7,1.72,HOMES[1].z+5);renderFrame();
check(s.time===1300&&Math.abs(sun.intensity-Math.max(worldLighting(1300).sunIntensity*(1-coastalWeather(s.day,1300).cloud*.42)*gfxLightGrade(worldLighting(1300),quality).sunScale,gfxLightGrade(worldLighting(1300),quality).moon))<1e-9&&interiorLights.some(l=>l.intensity>0&&l.userData.home===1),'saved night and active-workshop lighting restore before the next update tick');
const lightPersonalSlots=signStorageSnapshot(),lightingSnapshot=JSON.parse(JSON.stringify(s));net.role='guest';net.connected=true;const lightingChannel={readyState:'open',send(){},close(){}};wireChannel(lightingChannel);
lightingSnapshot.time=720;lightingChannel.onmessage({data:JSON.stringify({type:'state',state:lightingSnapshot,player:{x:200,y:1.72,z:80,yaw:0}})});renderFrame();check(panel==='bag'&&lights.every(l=>l.intensity===0),'accepted host noon refreshes lighting with guest bag open');
lightingSnapshot.time=0;lightingSnapshot.house=2;lightingChannel.onmessage({data:JSON.stringify({type:'state',state:lightingSnapshot,player:{x:200,y:1.72,z:80,yaw:0}})});camera.position.set(HOMES[2].x+7,1.72,HOMES[2].z+5);renderFrame();save();
check(panel==='bag'&&s.time===0&&lights.every(l=>l.intensity===8)&&interiorLights.some(l=>l.intensity>0&&l.userData.home===2)&&signStorageSnapshot()===lightPersonalSlots,'host midnight/property snapshot changes only guest presentation, not time authority or personal slots');
net.role='solo';net.connected=false;setQuality('balanced');
console.log('PASS: original two-light budget reaches every active-home work/supply/stock point, no unowned/Performance point-light assignment, coherent clock/fog/sky/water/porch/street state during menus and host snapshots, title and night-save restoration, 300 stable/read-only refreshes and guest save safety. DOM/WebGL/channels mocked; property/camera states are prepared fixtures, not rendered day/night traversal.');

load('free',1,true);close();player.set(200,1.72,80);camera.position.copy(player);CONTACTS[0].x=202;CONTACTS[0].z=80;people[0].position.set(202,0,80);people[1].position.set(202,0,81);
const gestureRecipient=visualActors.find(a=>a.g===people[0]),gestureBystander=visualActors.find(a=>a.g===people[1]);for(const a of [gestureRecipient,gestureBystander]){a.previous.copy(a.g.position);a.speed=0;}
s.packs[0]=1;s.deals=[{npc:0,t:0,qty:1,price:30}];s.threads[0]={status:'agreed',messages:[]};
s.can=true;equipTool('can');renderFrame();check(watering.visible,'pre-handoff equipped can fixture');
const originalExchangeClock=performance.now;let exchangeClock=1000;performance.now=()=>exchangeClock;
menu('customer',0);action('deliver',0);exchangeClock+=300;renderFrame();
check(s.packs[0]===0&&s.cash===430&&s.sold===1,'handoff fixture commits exactly one actual sale');
check(hand.position.z<0&&carriedPack.visible,'committed last-pack sale has a real handoff transform, not an idle empty hand');
check(gestureRecipient.current==='Talk'&&gestureBystander.current==='Idle','only actual recipient acknowledges completed handoff with existing clip');
check(!watering.visible&&equippedTool==='can','handoff temporarily lowers can without losing equipment selection');
check(packLabel.material.color.getHex()===STRAINS[0].color,'committed receipt retains delivered flavour even after last pack leaves stock');
const gestureStart=exchangeGesture.started,completedSale=JSON.stringify(s);action('deliver',0);check(exchangeGesture.started===gestureStart&&JSON.stringify(s)===completedSale,'replayed local delivery neither recommits nor restarts gesture');
exchangeClock+=300;renderFrame();check(!carriedPack.visible&&hand.position.z<0,'released pack is gone while empty hand returns');exchangeClock+=300;renderFrame();
check(!exchangeGesture&&!carriedPack.visible&&hand.position.z===0&&carriedPack.scale.x===1,'gesture expires with exact resting transforms and no phantom last pack');
check(watering.visible&&equippedTool==='can','completed handoff restores equipped can');
function rejectExchangeFixture(k,a,b){const before=JSON.stringify(s);action(k,a,b);renderFrame();check(!exchangeGesture&&JSON.stringify(s)===before,'failed '+k+' cannot animate or mutate exchange');}
rejectExchangeFixture('deliver',0);rejectExchangeFixture('sample',0,NaN);rejectExchangeFixture('sample',0,6);
s.packs[6]=1;s.deals=[{npc:0,t:6,qty:1,price:30}];rejectExchangeFixture('sample',0,6);s.deals=[];
player.x=190;rejectExchangeFixture('sample',0,6);player.x=200;player.y=5;rejectExchangeFixture('sample',0,6);player.y=1.72;driving=true;rejectExchangeFixture('sample',0,6);driving=false;
const gestureWall={x:201,z:80,w:.2,d:3};colliders.push(gestureWall);rejectExchangeFixture('sample',0,6);check(colliders.pop()===gestureWall,'remove handoff wall');
ensurePolice().search={role:'host',remaining:4};rejectExchangeFixture('sample',0,6);ensurePolice().search=null;
menu('customer',0);action('sample',0,6);check(exchangeGesture?.kind==='sample'&&exchangeGesture.t===6&&s.packs[6]===0&&!panel,'actual sample closes card for committed world cue');
const committedSampleState=JSON.stringify(s),committedSampleSlots=signStorageSnapshot(),gestureResources=sceneResources(scene);
for(let i=0;i<100;i++){exchangeClock+=4;renderFrame();}
check(JSON.stringify(s)===committedSampleState&&signStorageSnapshot()===committedSampleSlots,'100 handoff render updates are business/save read-only');
const afterGestureResources=sceneResources(scene);for(const key of ['objects','geometries','textures'])check(afterGestureResources[key].size===gestureResources[key].size&&[...afterGestureResources[key]].every(v=>gestureResources[key].has(v)),'handoff reuses existing '+key);
menu('bag');check(!exchangeGesture&&hand.position.z===0,'new menu cancels only transient presentation');close();
// Every remaining interruption is a render-only fixture, not a second transaction.
const cueReceipt={kind:'sample',npc:0,t:6,qty:1};
for(const interrupt of ['hidden','blur','drive','station','police','range','reload']){
 check(startExchangeGesture(cueReceipt),'prepare committed presentation interruption '+interrupt);exchangeClock+=100;renderFrame();
 if(interrupt==='hidden'){document.hidden=true;for(const fn of document.events.visibilitychange||[])fn();}
 if(interrupt==='blur')for(const fn of events.blur||[])fn();
 if(interrupt==='drive')driving=true;
 if(interrupt==='station')stationTask={k:'pack',a:0,step:0,progress:0,elapsed:0};
 if(interrupt==='police')ensurePolice().search={role:'host',remaining:4};
 if(interrupt==='range')player.x=190;
 if(interrupt==='reload')load('free',1,false);
 if(interrupt!=='station')renderFrame();else refreshExchangeGesture();
 check(!exchangeGesture&&hand.position.z===0,'interruption clears handoff '+interrupt);
 document.hidden=false;driving=false;stationTask=null;ensurePolice().search=null;player.set(200,1.72,80);close();
}
// Host emits typed success only at actual commits; old bare acks stay compatible.
load('free',3,true);close();player.set(210,1.72,80);CONTACTS[0].x=200;CONTACTS[0].z=80;people[0].position.set(200,0,80);
s.packs[0]=2;s.packs[6]=1;s.deals=[{npc:0,t:0,qty:2,price:30}];s.threads[0]={status:'agreed',messages:[]};s.npcs[0]={x:200,z:80};
const initialGestureState=JSON.parse(JSON.stringify(s)),hostGesturePackets=[];net.role='host';net.connected=true;
const gestureHostChannel={readyState:'open',send(text){hostGesturePackets.push(JSON.parse(text));},close(){}};wireChannel(gestureHostChannel);
const hostGestureReceive=m=>gestureHostChannel.onmessage({data:JSON.stringify(m)});hostGestureReceive({type:'position',player:{x:198,y:1.72,z:80,yaw:0}});
const remoteSampleRequest={type:'action',seq:1,k:'sample',a:0,b:6,x:198,z:80};hostGestureReceive(remoteSampleRequest);
const remoteSampleAck=hostGesturePackets.at(-1);check(remoteSampleAck.exchange?.kind==='sample'&&remoteSampleAck.exchange.t===6&&s.packs[6]===0&&!exchangeGesture&&player.x===210,'host commits guest sample and sends typed result without moving host hand/pose');
const remoteSampleState=JSON.stringify(s);hostGestureReceive(remoteSampleRequest);check(!hostGesturePackets.at(-1).exchange&&JSON.stringify(s)===remoteSampleState,'replayed remote command gets bare ack, no repeated cue/stock');
hostGestureReceive({...remoteSampleRequest,seq:2});check(!hostGesturePackets.at(-1).exchange,'depleted but physically valid remote sample gets no success receipt');
const remoteSaleRequest={type:'action',seq:3,k:'deliver',a:0,x:198,z:80};hostGestureReceive(remoteSaleRequest);const remoteSaleAck=hostGesturePackets.at(-1),finalGestureState=JSON.parse(JSON.stringify(s));
check(remoteSaleAck.exchange?.kind==='deliver'&&remoteSaleAck.exchange.qty===2&&s.cash===460&&s.sold===2&&s.packs[0]===0&&!exchangeGesture,'exact remote sale receipt reflects actual inventory commit');hostGestureReceive(remoteSaleRequest);check(!hostGesturePackets.at(-1).exchange&&s.cash===460,'duplicate sale has no duplicate result');
hostGestureReceive({type:'position',player:{x:190,y:1.72,z:80,yaw:0}});hostGestureReceive({...remoteSaleRequest,seq:4,x:190});check(hostGesturePackets.at(-1).error&&!hostGesturePackets.at(-1).exchange,'blocked reach ack has error and no result');
net.role='solo';net.connected=false;load('free',2,true);close();player.set(198,1.72,80);net.role='guest';net.connected=true;const guestGesturePackets=[];
const gestureGuestChannel={readyState:'open',send(text){guestGesturePackets.push(JSON.parse(text));},close(){}};wireChannel(gestureGuestChannel);
const guestGestureReceive=m=>gestureGuestChannel.onmessage({data:JSON.stringify(m)}),gesturePersonalSlots=signStorageSnapshot();
function guestGestureSnapshot(state){guestGestureReceive({type:'state',state:JSON.parse(JSON.stringify(state)),player:{x:210,y:1.72,z:80,yaw:0}});}
guestGestureSnapshot(initialGestureState);menu('customer',0);action('deliver',0);const guestSaleCommand=guestGesturePackets.at(-1);
check(!exchangeGesture&&s.packs[0]===2&&s.cash===400,'guest request never consumes stock or animates before host commit');
guestGestureSnapshot(finalGestureState);guestGestureReceive({...remoteSaleAck,seq:guestSaleCommand.seq});
check(exchangeGesture?.kind==='deliver'&&exchangeGesture.qty===2&&!panel&&s.packs[0]===0&&s.cash===460,'matching host receipt starts guest cue after authoritative snapshot');
const guestGestureStarted=exchangeGesture.started;exchangeClock+=100;guestGestureReceive({...remoteSaleAck,seq:guestSaleCommand.seq});check(exchangeGesture.started===guestGestureStarted,'duplicate success ack cannot restart cue');
clearExchangeGesture();
for(const variant of ['bare','error','mismatch','late','unknown','menu','disconnected','hidden']){
 guestGestureSnapshot(initialGestureState);close();action('sample',0,6);const seq=guestGesturePackets.at(-1).seq;
 const ack={...remoteSampleAck,seq};if(variant==='bare')delete ack.exchange;if(variant==='error')ack.error='rejected';if(variant==='mismatch')ack.exchange={...ack.exchange,t:0};if(variant==='late')exchangeClock+=10001;if(variant==='unknown')ack.seq=seq+1000;
 if(variant==='menu')menu('bag');if(variant==='disconnected')net.connected=false;if(variant==='hidden')document.hidden=true;
 guestGestureReceive(ack);check(!exchangeGesture,'unusable acknowledgement cannot animate '+variant);if(variant==='menu')check(panel==='bag','late receipt cannot dismiss a different open menu');net.connected=true;document.hidden=false;
}
// Old channel callbacks cannot consume a new session's matching sequence.
guestGestureSnapshot(initialGestureState);const newGesturePackets=[],newGestureChannel={readyState:'open',send(text){newGesturePackets.push(JSON.parse(text));},close(){}};wireChannel(newGestureChannel);close();action('sample',0,6);const newGestureCommand=newGesturePackets.at(-1);
guestGestureReceive({...remoteSampleAck,seq:newGestureCommand.seq});gestureGuestChannel.onclose();check(!exchangeGesture&&pendingCommands.has(newGestureCommand.seq)&&net.connected,'stale channel ack/close leaves current session pending and connected');
newGestureChannel.onmessage({data:JSON.stringify({...remoteSampleAck,seq:newGestureCommand.seq})});check(exchangeGesture?.kind==='sample','current session accepts its matching receipt');newGestureChannel.onclose();check(!exchangeGesture&&!net.connected&&pendingCommands.size===0,'disconnect clears transient cue and pending receipts');
net.connected=true;for(let i=0;i<160;i++)netSend({type:'action',k:'payment',a:'cash',x:198,z:80});check(pendingCommands.size<=128,'pending presentation metadata stays bounded');
save();check(signStorageSnapshot()===gesturePersonalSlots,'guest requests, snapshots and receipt gestures never write personal slots');net.role='solo';net.connected=false;pendingCommands.clear();clearExchangeGesture();
performance.now=originalExchangeClock;
console.log('PASS: committed last-pack sale/sample handoff, timed release/return, failed/replayed exchanges, fixed-resource/read-only renders, interruption cleanup, typed host results, matching/replayed/bare/error/late/stale-channel acknowledgements, bounded pending metadata and guest personal-save protection. DOM/WebGL/channels mocked; not rendered hand contact or live co-op.');
load('free',1,true);close();player.set(-58,1.72,26.7);update(0);
check(floorHeight(player.x,player.z)===.94,'actual raised RV floor fixture');
check(Math.abs(player.y-camera.position.y)<1e-9,'stationary interaction and camera eyes agree on raised RV floor');
Object.assign(locomotion,{jump:.7,vertical:3,crouch:.3,space:true});load('story',2,true);
check(locomotion.jump===0&&locomotion.vertical===0&&locomotion.crouch===0&&!locomotion.space,'new slot cannot inherit jump/crouch from previous world');
check(camera.position.x===player.x&&camera.position.z===player.z&&player.x===-52.6&&Math.abs(player.y-1.72)<1e-9&&camera.position.y===player.y&&camera.fov===75&&stamina===100,'new slot restores doorstep eye (outside the RV shell), FOV and stamina before a movement tick');
player.set(200,1.72,80);close();update(0);keys.control=true;
for(let i=0;i<30;i++)update(.06);
check(Math.abs(player.y-1.22)<1e-9&&Math.abs(camera.position.y-player.y)<1e-9&&playerPacket().y===player.y,'actual crouch updates physical/network eye, not just camera');
keys={};for(let i=0;i<30;i++)update(.06);keys[' ']=true;let peakViewEye=player.y;update(.06);keys[' ']=false;
for(let i=0;i<30;i++){update(.06);peakViewEye=Math.max(peakViewEye,player.y);check(Math.abs(camera.position.y-player.y)<=.060000001&&playerPacket().y===player.y,'actual jump shares unbobbed physical/network height');}
check(peakViewEye>2.2&&Math.abs(player.y-1.72)<1e-9,'jump rises and lands back at authored standing eye');
for(const x of [-58,-55.3,-54.45,-53.5]){player.set(x,1.72,27);Object.assign(locomotion,{crouch:0,jump:0});syncPlayerView();check(Math.abs(player.y-(floorHeight(x,27)+1.72))<1e-9&&camera.position.y===player.y,'RV/ramp floor projection '+x);}
// These probes compare authored height, not a rendered walk through furniture.
player.set(200,1.72,80);close();keys={w:true,shift:true};for(let i=0;i<20;i++)update(.06);check(camera.fov>74,'actual sprint FOV fixture');menu('settings');
setComfort('sprintFov',false);setComfort('bob',false);check(camera.fov===75&&hand.position.y===0&&camera.position.y===player.y,'comfort switches apply immediately while paused, without a movement tick');setComfort('sprintFov',true);setComfort('bob',true);close();
s.vehicleOwned=true;vehiclePose={x:200,z:80,angle:0};s.vehiclePark={...vehiclePose};player.set(197,1.72,80);Object.assign(locomotion,{jump:.7,vertical:3,crouch:.3,space:true});syncPlayerView();enterVehicle();
check(driving&&locomotion.jump===0&&locomotion.crouch===0&&locomotion.vertical===0&&camera.position.y===1.55&&player.y===1.55&&camera.position.x===200,'vehicle entry resets old motion and applies seated eye immediately');
s.can=true;s.packs[0]=1;equippedTool='can';renderFrame();check(!hand.visible&&!watering.visible&&!carriedPack.visible,'driving hides all first-person tools');menu('pause');update(0);renderFrame();check(!hand.visible&&!watering.visible&&!carriedPack.visible&&camera.position.y===1.55,'paused driving cannot bring idle hand back');
close();exitVehicle();renderFrame();check(!driving&&player.y===1.72&&camera.position.y===1.72&&camera.position.x===player.x&&hand.visible&&watering.visible,'vehicle exit restores immediate standing eye and selected owned can');
menu('bag');renderFrame();check(!hand.visible&&!watering.visible&&!carriedPack.visible,'bag consistently lowers hand and tools');close();renderFrame();check(hand.visible&&watering.visible,'closing bag restores ordinary hand/tool');
equippedTool='packs';startWork('View work fixture',2,true);renderFrame();check(watering.visible&&!carriedPack.visible&&equippedTool==='packs','active work tool temporarily overrides equipped pack without changing selection');work=null;renderFrame();check(carriedPack.visible&&!watering.visible,'work completion restores owned equipped pack');
player.set(-58,1.72,26.7);syncPlayerView();save();Object.assign(locomotion,{jump:.7,vertical:3,crouch:.3,space:true});camera.fov=75;stamina=12;load('story',2,false);
check(locomotion.jump===0&&locomotion.crouch===0&&camera.fov===75&&stamina===100&&camera.position.y===player.y&&Math.abs(player.y-2.66)<1e-9,'old slot reload resets only transient view/motion and restores raised spawn');
const viewImportState=JSON.parse(JSON.stringify(s));viewImportState.mode='free';viewImportState.x=200;viewImportState.z=80;viewImportState.yaw=.7;viewImportState.pitch=.1;pendingReset={state:viewImportState};Object.assign(locomotion,{jump:.7,crouch:.3,vertical:3});confirmImport();
check(mode==='free'&&s.cash===viewImportState.cash&&player.x===200&&camera.position.x===200&&player.y===1.72&&camera.position.y===1.72&&locomotion.jump===0&&locomotion.crouch===0&&camera.fov===75,'validated v3 import resets view at actual restored position without advancing business');
const viewReadOnlyState=JSON.stringify(s),viewReadOnlySlots=signStorageSnapshot(),viewResourcePool=sceneResources(scene);for(let i=0;i<300;i++)renderFrame();const viewResourcesAfter=sceneResources(scene);
check(JSON.stringify(s)===viewReadOnlyState&&signStorageSnapshot()===viewReadOnlySlots,'300 view/hand render projections preserve business and all six slots');for(const k of ['objects','geometries','textures'])check(viewResourcesAfter[k].size===viewResourcePool[k].size&&[...viewResourcesAfter[k]].every(v=>viewResourcePool[k].has(v)),'view projection adds no '+k);
Object.assign(locomotion,{jump:.7,crouch:.3,vertical:3,space:true});camera.fov=75;stamina=12;net.role='guest';net.connected=true;const viewGuestSlots=signStorageSnapshot(),viewHostState=JSON.parse(JSON.stringify(s)),viewChannel={readyState:'open',send(){},close(){}};wireChannel(viewChannel);
viewChannel.onmessage({data:JSON.stringify({type:'welcome',state:viewHostState,mode:'free'})});renderFrame();
check(active&&player.x===-52&&player.z===32&&camera.position.x===-52&&camera.position.z===32&&player.y===1.72&&camera.position.y===1.72&&camera.fov===75&&locomotion.jump===0&&locomotion.crouch===0&&stamina===100,'accepted guest welcome resets transient view at actual guest spawn');
const viewGuestClock=s.time;keys.control=true;for(let i=0;i<30;i++)update(.06);save();check(player.y<1.23&&playerPacket().y===player.y&&s.time===viewGuestClock&&signStorageSnapshot()===viewGuestSlots,'guest crouch shares actual eye without advancing host clock or writing personal slots');
net.role='solo';net.connected=false;keys={};close();resetPlayerView();
console.log('PASS: immediate RV/ramp/crouch/jump physical-camera-network heights, sprint/bob switches while paused, vehicle entry/pause/exit hands, new/old save and validated-import resets, guest welcome/crouch authority, and 300 fixed-resource/read-only render updates. DOM/WebGL/channels mocked; fixture positions, not rendered scale or live co-op.');
load('free',1,true);close();player.set(-58,1.72,26.7);keys={' ':true};
for(let i=0;i<30;i++){update(.06);keys[' ']=false;check(camera.position.y+.2<=3.020001,'RV jump keeps eye and head margin under exported roof underside');}
player.set(-55.73,1.72,26.7);resetPlayerView();locomotion.jump=.7;locomotion.vertical=3;yaw=Math.PI/2;keys={w:true};syncPlayerView();const airborneDoorX=player.x;update(.06);
check(player.x===airborneDoorX&&locomotion.jump>.5,'too-tall airborne doorway approach is blocked rather than snapped down under roof');keys={};close();
for(let i=0;i<40&&locomotion.jump>0;i++)update(.06);keys={w:true};for(let i=0;i<15;i++)update(.06);check(player.x<-56,'landed player can enter after overhead block clears');keys={};close();
const rvEconomicSnapshot=JSON.stringify([s.cash,s.bank,s.packs,s.raw,s.gummies,s.storedPacks,s.seeds,s.tents,s.wrappers]);
function walkRVDoor(fromX,toX,z){player.set(fromX,1.72,z);yaw=toX>fromX?-Math.PI/2:Math.PI/2;close();resetPlayerView();keys={w:true};let previousEye=player.y,steps=0;const direction=Math.sign(toX-fromX);
 while((toX-player.x)*direction>0&&steps++<60){update(.06);check(!blocked(player.x,player.z),'RV doorway walk stays outside original colliders');check(Math.abs(camera.position.y-previousEye)<.2,'RV ramp has no abrupt view step');previousEye=camera.position.y;if(Number.isFinite(rvCeilingHeight(player.x,player.z)))check(camera.position.y+.2<=3.020001,'walking fits exported RV ceiling');}
 check((toX-player.x)*direction<=0,'actual movement reaches other side of RV doorway');keys={};close();return steps;
}
let rvDoorSteps=0;for(const z of [26.3,27.2]){rvDoorSteps+=walkRVDoor(-58,-53.3,z);check(player.y===1.72,'RV exit reaches street support');rvDoorSteps+=walkRVDoor(-52.8,-57.8,z);check(Math.abs(player.y-2.66)<1e-9,'RV entry reaches corrected support');}
check(JSON.stringify([s.cash,s.bank,s.packs,s.raw,s.gummies,s.storedPacks,s.seeds,s.tents,s.wrappers])===rvEconomicSnapshot,'two doorway lanes and returns do not alter business goods');
const legacyRVState=JSON.parse(JSON.stringify(s));legacyRVState.x=-58;legacyRVState.z=26.7;legacyRVState.yaw=-Math.PI/2;legacyRVState.mode='free';legacyRVState.props[0]={x:-57.5,y:1.05,z:26.7,vx:0,vy:0,vz:0,owner:null};localStorage.setItem('gummybay-v3-free-3',JSON.stringify(legacyRVState));load('free',3,false);
check(Math.abs(player.y-2.66)<1e-9&&camera.position.y===player.y&&player.x===-58&&player.z===26.7,'legacy v3 RV coordinates derive new support without moving saved x/z');update(.06);check(Math.abs(s.props[0].y-1.265)<1e-9,'legacy low crate settles onto corrected RV floor');
const rvCargoEconomy=JSON.stringify([s.cash,s.bank,s.packs,s.raw,s.gummies,s.storedPacks,s.wrappers]);action('grabProp',0);update(.06);check(s.props[0].owner==='host'&&s.props[0].y>1.265&&s.props[0].y<=2.12,'held crate eases above corrected RV floor');action('dropProp');for(let i=0;i<120;i++)update(.06);check(!s.props[0].owner&&Math.abs(s.props[0].y-1.265)<1e-5,'dropped crate settles above original exported floor');check(JSON.stringify([s.cash,s.bank,s.packs,s.raw,s.gummies,s.storedPacks,s.wrappers])===rvCargoEconomy,'RV crate correction conserves business stock');
save();load('free',3,false);check(Math.abs(player.y-2.66)<1e-9&&Math.abs(s.props[0].y-1.265)<1e-5,'corrected player/crate support survives reload');
const rvImportState=JSON.parse(JSON.stringify(legacyRVState));pendingReset={state:rvImportState};confirmImport();check(player.x===-58&&player.z===26.7&&Math.abs(player.y-2.66)<1e-9,'validated legacy RV import derives support without a new save field');update(.06);
// Exercise real remote-command eye restoration and the existing peer mesh, not a new rig.
player.set(200,1.72,80);resetPlayerView();net.role='host';net.connected=true;const rvChannel={readyState:'open',send(){},close(){}};wireChannel(rvChannel);const rvReceive=m=>rvChannel.onmessage({data:JSON.stringify(m)});
rvReceive({type:'position',player:{x:-58,y:5,z:26.7,yaw:-Math.PI/2}});rvReceive({type:'action',seq:1,k:'grabProp',a:0,x:-58,z:26.7});check(!s.props[0].owner,'host applies actual remote eye height rather than grounded default to elevated pickup');
rvReceive({type:'position',player:{x:-58,y:2.66,z:26.7,yaw:-Math.PI/2}});rvReceive({type:'action',seq:2,k:'grabProp',a:0,x:-58,z:26.7});check(s.props[0].owner==='guest'&&player.x===200&&player.y===1.72,'valid raised peer pickup succeeds and restores complete host pose');networkTick(.4);check(other&&Math.abs(other.position.y-.94)<1e-9,'existing remote avatar root uses raised RV support');
const rvSharedState=JSON.parse(JSON.stringify(s));net.role='solo';net.connected=false;load('free',2,true);const rvGuestSlots=signStorageSnapshot();net.role='guest';net.connected=true;const rvGuestChannel={readyState:'open',send(){},close(){}};wireChannel(rvGuestChannel);
rvGuestChannel.onmessage({data:JSON.stringify({type:'welcome',state:rvSharedState,mode:'free'})});rvGuestChannel.onmessage({data:JSON.stringify({type:'state',state:rvSharedState,player:{x:-58,y:2.66,z:26.7,yaw:0}})});networkTick(.4);check(Math.abs(other.position.y-.94)<1e-9,'guest host-avatar root shares corrected RV support');
player.set(-58,1.72,26.7);resetPlayerView();keys.control=true;const rvHostClock=s.time,rvHostBusiness=JSON.stringify(s);for(let i=0;i<30;i++)update(.06);save();check(Math.abs(player.y-2.16)<1e-9&&playerPacket().y===player.y&&s.time===rvHostClock&&JSON.stringify(s)===rvHostBusiness&&signStorageSnapshot()===rvGuestSlots,'raised-floor guest crouch publishes correct eye without simulating host business or saving personal slots');
const rvRenderState=JSON.stringify(s),rvRenderSlots=signStorageSnapshot(),rvRenderResources=sceneResources(scene);for(let i=0;i<150;i++)renderFrame();const rvResourcesAfter=sceneResources(scene);check(JSON.stringify(s)===rvRenderState&&signStorageSnapshot()===rvRenderSlots,'150 RV presentation updates remain business/save read-only');for(const k of ['objects','geometries','textures'])check(rvResourcesAfter[k].size===rvRenderResources[k].size&&[...rvResourcesAfter[k]].every(v=>rvRenderResources[k].has(v)),'RV support adds no '+k);
net.role='solo';net.connected=false;keys={};close();resetPlayerView();
console.log('PASS: original-collider RV exit/re-entry through two lanes ('+rvDoorSteps+' simulated movement steps), roof jump/airborne doorway guard and landing recovery, legacy save/import/player/crate support, carried/drop conservation, actual remote eye/host pose restoration, peer mesh floor placement, guest authority/save safety and 150 unchanged-resource presentation updates. DOM/WebGL/channels mocked; movement is simulated, not rendered travel or live co-op.');

// A response lamp must illuminate nearby surfaces using the existing practical pool.
check(typeof refreshPoliceLighting==='function','police warning projection is present, not just HUD/emissive geometry');
net.role='solo';net.connected=false;load('free',1,true);close();s.time=0;setQuality('balanced');player.set(6,1.72,0);resetPlayerView();
const signalPolice=ensurePolice();signalPolice.officers.forEach((c,i)=>Object.assign(c,{x:i?200+i:6,z:i?80:4,mode:i?'patrol':'stop',target:i?null:'host'}));
refreshWorldLighting();check(interiorLights.some(l=>l.userData.policeIndex===0&&l.intensity>0&&l.distance===8&&!l.castShadow),'night response owns one real non-shadow point light within existing pool');
check(officers[0].userData.warningMaterials.every(m=>m.emissiveIntensity>0)&&officers.slice(1).every(g=>g.userData.warningMaterials.every(m=>m.emissiveIntensity===0)),'only actual responding officer signal illuminates, not bystanders');
const signalMaterials=officers.flatMap(g=>g.userData.warningMaterials);check(new Set(signalMaterials).size===signalMaterials.length&&signalMaterials.every(m=>![...materials.values()].includes(m)),'signal materials are isolated from shared town/actor palette');
const signalBefore=JSON.stringify(s),signalSlots=signStorageSnapshot(),signalResources=sceneResources(scene),signalLights=scene.children.filter(o=>o.isLight),signalClock=now;
for(let i=0;i<300;i++){now=i/60;refreshWorldLighting();check(interiorLights.reduce((n,l)=>n+l.intensity,0)<=18+1e-9&&interiorLights.filter(l=>l.userData.policeIndex!==null).length<=1,'response/practical lights share existing 18 combined-intensity budget');}
now=signalClock;check(JSON.stringify(s)===signalBefore&&signStorageSnapshot()===signalSlots&&sameResources(signalResources,sceneResources(scene))&&signalLights.every(l=>scene.children.includes(l))&&scene.children.filter(o=>o.isLight).length===signalLights.length,'300 warning refreshes reuse lights/materials/geometry and preserve state and six slots');
setQuality('performance');refreshWorldLighting();check(interiorLights.every(l=>l.intensity===0)&&officers[0].userData.warningMaterials.every(m=>m.emissiveIntensity>0),'Performance retains signal without dynamic practical illumination');
setQuality('balanced');s.time=720;refreshWorldLighting();check(interiorLights.every(l=>l.userData.policeIndex===null)&&officers[0].userData.warningMaterials.every(m=>m.emissiveIntensity>0),'noon keeps responder identification but releases environmental warning light');
s.time=0;signalPolice.officers[0].mode='patrol';signalPolice.officers[0].suspicion=99;refreshWorldLighting();check(interiorLights.every(l=>l.userData.policeIndex===null)&&officers[0].userData.warningMaterials.every(m=>m.emissiveIntensity===0),'suspicion alone cannot invent a response signal');
signalPolice.officers[0].mode='pursuit';camera.position.set(200,1.72,80);refreshWorldLighting();check(interiorLights.every(l=>l.userData.policeIndex===null)&&officers[0].userData.warningMaterials.every(m=>m.emissiveIntensity===0),'distant patrol cannot claim nearby practical pool');
camera.position.set(6,1.72,0);signalPolice.officers[0].x=6;signalPolice.officers[0].z=4;
const signalShared=JSON.parse(JSON.stringify(s));save();load('free',1,false);camera.position.set(6,1.72,0);menu('bag');refreshWorldLighting();check(interiorLights.some(l=>l.userData.policeIndex===0),'saved night response refreshes with menu open before next tick');
title();refreshWorldLighting();check(interiorLights.every(l=>l.intensity===0)&&officers.every(g=>g.userData.warningMaterials.every(m=>m.emissiveIntensity===0)),'title releases warning and practical lights');
load('free',2,true);close();const signalPersonal=signStorageSnapshot();net.role='guest';net.connected=true;const signalChannel={readyState:'open',send(){},close(){}};wireChannel(signalChannel);
signalChannel.onmessage({data:JSON.stringify({type:'state',state:signalShared,player:{x:200,y:1.72,z:80,yaw:0}})});camera.position.set(6,1.72,0);menu('bag');refreshWorldLighting();check(interiorLights.some(l=>l.userData.policeIndex===0),'accepted host response to partner is visible to nearby guest with bag open');
net.workerSeenAt=performance.now()-5001;refreshWorldLighting();check(interiorLights.every(l=>l.userData.policeIndex===null)&&officers.every(g=>g.userData.warningMaterials.every(m=>m.emissiveIntensity===0)),'stale snapshot cannot sustain warning');
net.workerSeenAt=performance.now();net.connected=false;refreshWorldLighting();save();check(interiorLights.every(l=>l.userData.policeIndex===null)&&signStorageSnapshot()===signalPersonal,'disconnected guest warning off and personal saves unchanged');
net.role='solo';net.connected=false;load('free',3,true);close();s.time=0;s.room=true;s.house=0;s.packStation=true;
const signalWorkPoint=points.find(p=>p.type==='craft'&&pointVisible(p));camera.position.set(signalWorkPoint.x,1.72,signalWorkPoint.z);
ensurePolice().officers.forEach((c,i)=>Object.assign(c,{x:i?200:signalWorkPoint.x,z:i?80:signalWorkPoint.z,mode:i?'patrol':'stop',target:i?null:'host'}));
refreshWorldLighting();check(interiorLights[0].userData.home===0&&interiorLights[0].intensity>0&&interiorLights[1].userData.policeIndex===0&&interiorLights.reduce((n,l)=>n+l.intensity,0)<=18+1e-9,'response preserves primary occupied-workshop light within combined budget');
for(const a of visualActors.filter(a=>a.g.userData.cop)){prepareActorLOD(a);const surface=a.g.userData.warningMaterials[1];check(surface&&[a.high.body,a.low.body].every(body=>{let found=false;body.traverse(o=>{if(o.material===surface)found=true;});return found;}),'high/low cap copies share each officer isolated signal surface');}
ensurePolice().officers[0].mode='patrol';refreshWorldLighting();check(interiorLights.every((l,i)=>l.userData.policeIndex===null&&l.color.getHex()===(i===0?0xffd6a0:0xe9dabb)&&l.distance===(i===0?11:10)),'clear response restores warm practical colour/range/ownership immediately');
camera.position.set(200,1.72,80);Object.assign(ensurePolice().officers[0],{x:203,z:80,mode:'pursuit',target:'guest'});
const signalWall={x:201.5,z:80,w:.3,d:6};colliders.push(signalWall);refreshWorldLighting();check(interiorLights.every(l=>l.userData.policeIndex===null)&&officers[0].userData.warningMaterials.every(m=>m.emissiveIntensity===0),'actual collider sight guard suppresses occluded response');
check(colliders.pop()===signalWall,'remove response occlusion fixture');now=.5;refreshWorldLighting();const signalBlueHex=interiorLights[1].color.getHex();now=1.5;refreshWorldLighting();check(signalBlueHex===0x4b83ff&&interiorLights[1].color.getHex()===0xef4c48,'environment light colour matches continuous actual signal cycle');
now=signalClock;keys={};close();resetPlayerView();
console.log('PASS: bounded real PointLight response assignment, isolated existing-surface emission, night/day/quality/range/title/save/menu/host-snapshot/stale/disconnected paths and 300 read-only stable-resource refreshes. DOM/WebGL/channels mocked, not rendered illumination or live co-op.');


// Ground-floor occupied-window cues must agree with existing interior fittings.
net.role='solo';net.connected=false;load('free',1,true);close();s.time=0;s.room=false;refreshWorldLighting();
const windowUnownedFitting=scene.children.find(o=>o.isMesh&&o.position.x===-25&&o.position.z===40&&o.position.y===3.25);
check(windowUnownedFitting&&windowUnownedFitting.material.emissiveIntensity===0,'unowned Room 04 ceiling fitting is not universally powered');
check(typeof refreshWindowLighting==='function'&&facadeWindows.length===22&&interiorFittings.length===8,'all 22 existing frontage panes and eight original fittings are explicitly registered');
check(new Set(facadeWindows.map(r=>r.mesh.material)).size===22,'each original frontage pane already has isolated glass material');
const windowTownGlass=[];visualTown.traverse(o=>{if(o.isMesh&&o.material?.name==='glass')windowTownGlass.push(o);});check(windowTownGlass.length===70,'exported upper/district/RV glass stays available unchanged');
const windowExportMaterials=windowTownGlass.map(o=>o.material),windowExportValues=windowTownGlass.map(o=>[o.material.emissiveIntensity,o.material.emissive.getHex(),o.material.color.getHex(),o.material.roughness,o.material.metalness]);
const windowMaterialRefs=facadeWindows.map(r=>r.mesh.material),windowBaseValues=facadeWindows.map(r=>[r.mesh.material.color.getHex(),r.mesh.material.roughness,r.mesh.material.metalness,r.mesh.material.envMap]);
for(let home=0;home<3;home++)for(const q of ['performance','balanced','high']){
 s.room=true;s.house=home;setQuality(q);refreshWorldLighting();
 for(const row of occupiedWindowRows)check(row.mesh.material.emissiveIntensity>0===(row.home===null||row.home===home),'night ground-floor cue follows only active home or public shop');
 check(windowUnownedFitting.material.emissiveIntensity===(home===0?.45:0),'Room 04 fitting tracks same active-home occupancy as its windows');
}
s.room=false;refreshWorldLighting();check(occupiedWindowRows.filter(r=>r.home!==null).every(r=>r.mesh.material.emissiveIntensity===0)&&occupiedWindowRows.filter(r=>r.home===null).every(r=>r.mesh.material.emissiveIntensity>0),'unowned player rooms are dark without declaring public shops vacant');
s.room=true;s.house=1;menu('bag');s.time=720;refreshWorldLighting();check(facadeWindows.every(r=>r.mesh.material.emissiveIntensity===0),'accepted noon clears window glow with bag open before movement tick');
s.time=0;refreshWorldLighting();check(occupiedWindowRows.filter(r=>r.home===1).every(r=>r.mesh.material.emissiveIntensity>0),'night restores active Harbor windows without reconstructing glass');
const windowBeforeState=JSON.stringify(s),windowBeforeSlots=signStorageSnapshot(),windowResources=sceneResources(scene),windowLightCount=scene.children.filter(o=>o.isLight).length;
for(let i=0;i<300;i++)refreshWorldLighting();
check(JSON.stringify(s)===windowBeforeState&&signStorageSnapshot()===windowBeforeSlots&&sameResources(windowResources,sceneResources(scene))&&scene.children.filter(o=>o.isLight).length===windowLightCount,'300 occupied-window refreshes are read-only with stable materials/resources/light count');
for(let i=0;i<facadeWindows.length;i++){const m=facadeWindows[i].mesh.material,b=windowBaseValues[i];check(m===windowMaterialRefs[i]&&m.color.getHex()===b[0]&&m.roughness===b[1]&&m.metalness===b[2]&&m.envMap===b[3]&&m.emissiveIntensity<=.24,'window cue preserves original PBR glass/reflections and bounded warm emission');}
check(windowTownGlass.every((o,i)=>o.material===windowExportMaterials[i]&&JSON.stringify([o.material.emissiveIntensity,o.material.emissive.getHex(),o.material.color.getHex(),o.material.roughness,o.material.metalness])===JSON.stringify(windowExportValues[i])),'shared exported glass including RV/windscreen is untouched');
save();load('free',1,false);refreshWorldLighting();check(s.room&&s.house===1&&s.time===0&&occupiedWindowRows.filter(r=>r.home===1).every(r=>r.mesh.material.emissiveIntensity>0),'existing v3 night/home reload restores window cues');
load('free',3,true);close();s.time=0;visitFixture('rent');action('rent');close();refreshWorldLighting();check(s.cash===325&&s.room&&occupiedWindowRows.filter(r=>r.home===0).every(r=>r.mesh.material.emissiveIntensity>0)&&windowUnownedFitting.material.emissiveIntensity===.45,'actual $75 rental turns on existing Room 04 panes/fitting without changing cost');
s.bank=6000;s.xp=180;s.payment='card';visitFixture('house');action('house',1);close();refreshWorldLighting();check(s.house===1&&occupiedWindowRows.filter(r=>r.home===1).every(r=>r.mesh.material.emissiveIntensity>0)&&occupiedWindowRows.filter(r=>r.home===0).every(r=>r.mesh.material.emissiveIntensity===0)&&windowUnownedFitting.material.emissiveIntensity===0,'actual guarded deed purchase moves cues to Harbor and clears old fitting; later funds/XP are prepared fixture');
title();refreshWorldLighting();check(facadeWindows.every(r=>r.mesh.material.emissiveIntensity===0)&&interiorFittings.every(r=>r.mesh.material.emissiveIntensity===0),'title clears window/interior occupation cues');
load('free',2,true);close();const windowPersonal=signStorageSnapshot(),windowHostState=JSON.parse(JSON.stringify(s));windowHostState.room=true;windowHostState.house=2;windowHostState.time=0;net.role='guest';net.connected=true;
const windowChannel={readyState:'open',send(){},close(){}};wireChannel(windowChannel);const windowReceive=m=>windowChannel.onmessage({data:JSON.stringify(m)});
windowReceive({type:'state',state:windowHostState,player:{x:200,y:1.72,z:80,yaw:0}});menu('bag');refreshWorldLighting();check(occupiedWindowRows.filter(r=>r.home===2).every(r=>r.mesh.material.emissiveIntensity>0)&&occupiedWindowRows.filter(r=>r.home===0||r.home===1).every(r=>r.mesh.material.emissiveIntensity===0),'fresh host Hillside ownership controls guest glass with bag open');
windowHostState.house=0;windowReceive({type:'state',state:windowHostState,player:{x:200,y:1.72,z:80,yaw:0}});refreshWorldLighting();check(windowUnownedFitting.material.emissiveIntensity===.45&&occupiedWindowRows.filter(r=>r.home===0).every(r=>r.mesh.material.emissiveIntensity>0),'accepted host move updates fitting and windows together');
for(const invalidWindowSeen of [undefined,null,NaN,performance.now()+1]){net.workerSeenAt=invalidWindowSeen;refreshWorldLighting();check(occupiedWindowRows.filter(r=>r.home!==null).every(r=>r.mesh.material.emissiveIntensity===0),'absent or future host-state time cannot assert current home occupation');}
net.workerSeenAt=performance.now()-5001;windowReceive({type:'state',state:{version:3},player:{x:200,y:1.72,z:80,yaw:0}});refreshWorldLighting();check(occupiedWindowRows.filter(r=>r.home!==null).every(r=>r.mesh.material.emissiveIntensity===0)&&windowUnownedFitting.material.emissiveIntensity===0,'stale or rejected host state cannot assert current home occupation');
net.workerSeenAt=performance.now();net.connected=false;refreshWorldLighting();save();check(occupiedWindowRows.filter(r=>r.home!==null).every(r=>r.mesh.material.emissiveIntensity===0)&&signStorageSnapshot()===windowPersonal,'disconnected guest drops home occupation cues without writing personal slots');
net.role='solo';keys={};close();resetPlayerView();
console.log('PASS: 22 existing frontage panes/eight fittings, all-home/quality occupancy, independent public shops, day/night/menu/title/v3 reload, unchanged 70 exported glass batches/PBR, 300 stable/read-only refreshes and current/stale/disconnected host snapshot/save protection. DOM/WebGL/channels mocked, not rendered windows/interior matching or live co-op.');


// Existing solid floor furniture must block movement without sealing home routes.
net.role='solo';net.connected=false;load('free',1,true);close();s.room=true;s.house=0;refreshBase();
check(blocked(HOMES[0].x-1.8,HOMES[0].z+4),'existing stock rack cannot be walked through');
check(furnishings.length===7&&furnishings.every(Object.isFrozen)&&new Set(furnishings).size===7,'seven fixed non-scene furnishing records, no per-frame collider growth');
let interiorRouteCount=0;
for(let home=0;home<3;home++){
 s.house=home;s.room=true;s.mixer=true;s.tents=maxTents();s.installed=Array.from({length:s.tents},(_,i)=>i);s.layout={};refreshBase();
 const ctx=workerContext(),h=HOMES[home],entrance={x:h.x,z:h.z+h.d/2-1};
 const targets=[{...ctx.source,label:'supplies'},{...ctx.station,label:'work'},{...ctx.storage,label:'stock'},
 ...points.filter(p=>p.home===home&&['sink','mix'].includes(p.type)),...points.filter(p=>p.type==='tent'&&s.installed.includes(p.i))];
 if(home===0)targets.push(points.find(p=>p.type==='bed'));
 for(const target of targets){
  const route=findRoute(entrance,target,ctx.bounds,ctx.blocked);check(route,'fully furnished home '+home+' retains '+(target.label||target.type)+' route');
  for(let i=1;i<route.length;i++){const start=route[i-1],end=route[i],walked=sweepWalk(start,end.x-start.x,end.z-start.z,ctx.blocked);check(Math.hypot(walked.x-end.x,walked.z-end.z)<1e-7,'route uses actual swept collision without furnishing penetration');}
  interiorRouteCount++;
 }
 const rack=furnishings.find(f=>f.furniture==='stockrack'&&f.home===home);check(blocked(rack.x,rack.z),'home rack footprint is solid');
 const rackParts=scene.children.filter(o=>o.isMesh&&o.geometry.type==='BoxGeometry'&&o.position.y<2.1&&Math.abs(o.position.x-rack.x)<.65&&Math.abs(o.position.z-rack.z)<.45);
 const rackBounds=new THREE.Box3();for(const o of rackParts)rackBounds.expandByObject(o);check(!rackBounds.isEmpty()&&Math.abs(rackBounds.max.x-rackBounds.min.x-1.2)<1e-6&&Math.abs(rackBounds.max.z-rackBounds.min.z-.8)<1e-6,'source rack footprint agrees with actual scene boards/uprights');
 for(const f of furnishings.filter(f=>f.furniture==='mixer'))check(blocked(f.x,f.z)===(f.home===home),'only active owned mixer has a collider, with no ghost in previous home');
 s.mixer=false;check(furnishings.filter(f=>f.furniture==='mixer').every(f=>!blocked(f.x,f.z)),'unbought mixer bodies have no invisible colliders');s.mixer=true;
 const pose={x:tents[0].position.x,z:tents[0].position.z,r:0,home};check(placementValid(0,pose),'new furniture-aware placement audit accepts complete default home');
}
// Old custom layout coordinates are user data, never silently repositioned.
for(const furnitureKind of ['mixer','stockrack']){
 s.house=1;s.room=true;s.mixer=true;s.tents=1;s.installed=[0];s.layout={};const legacyFixture=furnishings.find(f=>f.furniture===furnitureKind&&f.home===1);
 s.layout['1:0']={home:1,x:legacyFixture.x,z:legacyFixture.z,r:0};refreshBase();const legacyLayoutJSON=JSON.stringify(s.layout);
 check(furnitureLayoutConflict(legacyFixture)&&!colliderEnabled(legacyFixture)&&!staticBlocked(legacyFixture.x,legacyFixture.z),'pre-existing overlapping '+furnitureKind+' layout defers new fixture collision; the separate tent pot may still block its centre');
 save();load('free',1,false);refreshBase();check(JSON.stringify(s.layout)===legacyLayoutJSON&&!colliderEnabled(legacyFixture),'overlapping saved layout survives without automatic equipment movement');
 s.layout={};refreshBase();check(colliderEnabled(legacyFixture)&&blocked(legacyFixture.x,legacyFixture.z),'moving tent clear restores fixture collision without rebuilding it');
}
load('free',1,true);close();s.room=true;s.house=0;s.mixer=true;const furnitureRack=furnishings.find(f=>f.furniture==='stockrack'&&f.home===0);
player.set(furnitureRack.x-2,1.72,furnitureRack.z);resetPlayerView();yaw=0;keys={d:true};for(let i=0;i<60;i++)update(.06);keys={};
check(player.x<=furnitureRack.x-furnitureRack.w/2+.001&&player.x>furnitureRack.x-2,'actual held movement stops at stock rack');
keys={d:true,s:true};for(let i=0;i<60;i++)update(.06);keys={};check(player.x>furnitureRack.x+furnitureRack.w/2,'actual diagonal movement slides around furnishing instead of sticking');
const furnitureGoods=()=>JSON.stringify([s.cash,s.bank,s.raw,s.gummies,s.packs,s.storedPacks,s.seeds,s.wrappers,s.plants,s.layout,s.crafterCargo]);
s.raw[0]=2;s.packs[0]=3;s.storedPacks[0]=4;const furnitureSavedGoods=furnitureGoods();
for(const fixture of furnishings){
 s.house=fixture.home;s.mixer=true;s.room=true;player.set(fixture.x,1.72,fixture.z);save();load('free',1,false);
 check(!blocked(player.x,player.z)&&Math.hypot(player.x-fixture.x,player.z-fixture.z)<=3&&furnitureGoods()===furnitureSavedGoods,'legacy embedded '+fixture.furniture+' save recovers nearby without losing business/layout');
 const safeFurniturePose={x:player.x,z:player.z};save();load('free',1,false);check(player.x===safeFurniturePose.x&&player.z===safeFurniturePose.z,'safe recovered position persists and does not drift on reload');
}
const beforeFurnitureState=JSON.stringify(s),beforeFurnitureSlots=signStorageSnapshot(),beforeFurnitureResources=sceneResources(scene),beforeFurnitureColliders=colliders.length;for(let i=0;i<100;i++)renderFrame();
check(JSON.stringify(s)===beforeFurnitureState&&signStorageSnapshot()===beforeFurnitureSlots&&sameResources(beforeFurnitureResources,sceneResources(scene))&&colliders.length===beforeFurnitureColliders,'100 rendering updates do not allocate colliders/scene resources or alter business/saves');
s.house=0;s.room=true;s.mixer=true;s.packs[0]=3;s.storedPacks[0]=0;player.set(200,1.72,80);net.role='host';net.connected=true;const furnitureChannel={readyState:'open',send(){},close(){}};wireChannel(furnitureChannel);const furnitureReceive=m=>furnitureChannel.onmessage({data:JSON.stringify(m)});
furnitureReceive({type:'position',player:{x:furnitureRack.x,y:1.72,z:furnitureRack.z,yaw:0}});furnitureReceive({type:'action',seq:1,k:'stash',a:0,b:1,x:furnitureRack.x,z:furnitureRack.z});check(s.packs[0]===3&&s.storedPacks[0]===0&&player.x===200,'guest embedded shelf command is rejected without moving host or stock');
const furnitureStore=points.find(p=>p.type==='stockroom'&&p.home===0);furnitureReceive({type:'position',player:{x:furnitureStore.x,y:1.72,z:furnitureStore.z,yaw:0}});const furnitureStash={type:'action',seq:2,k:'stash',a:0,b:1,x:furnitureStore.x,z:furnitureStore.z};furnitureReceive(furnitureStash);furnitureReceive(furnitureStash);check(s.packs[0]===2&&s.storedPacks[0]===1&&player.x===200,'valid clear peer approach transfers once and restores host pose');
const furnitureShared=JSON.parse(JSON.stringify(s));net.role='solo';net.connected=false;load('free',2,true);const furnitureGuestSlots=signStorageSnapshot();net.role='guest';net.connected=true;const furnitureGuestChannel={readyState:'open',send(){},close(){}};wireChannel(furnitureGuestChannel);furnitureGuestChannel.onmessage({data:JSON.stringify({type:'state',state:furnitureShared,player:{x:200,y:1.72,z:80,yaw:0}})});
player.set(furnitureRack.x,1.72,furnitureRack.z);const furnitureGuestState=JSON.stringify(s);resetPlayerView();save();check(!blocked(player.x,player.z)&&JSON.stringify(s)===furnitureGuestState&&signStorageSnapshot()===furnitureGuestSlots,'guest local unembedding preserves host state and six personal slots');
net.role='solo';net.connected=false;keys={};close();resetPlayerView();
console.log('PASS: seven measured/static-or-owned furniture colliders, '+interiorRouteCount+' fully-equipped home/bed/work/sink/stock/tent routes with swept clearance, actual movement/slide, seven embedded legacy-save recoveries without inventory loss/drift, stable resources and shared command/guest save safety. DOM/WebGL/channels mocked; no rendered furniture/capsule or live co-op acceptance.');



// The original tent is open at the front, not at its side/back panels.
net.role='solo';net.connected=false;load('free',1,true);close();s.room=true;s.tents=1;s.installed=[0];refreshBase();
check(blocked(tents[0].position.x+1.15,tents[0].position.z),'installed tent side panel blocks walking');
function tentWorldPoint(p,x,z){return {x:p.x+Math.cos(p.r)*x+Math.sin(p.r)*z,z:p.z-Math.sin(p.r)*x+Math.cos(p.r)*z};}
let tentRotationChecks=0;
for(let home=0;home<3;home++)for(const angle of [0,Math.PI/2,Math.PI,Math.PI*1.5,Math.PI/4]){
 s.house=home;s.room=true;s.tents=maxTents();s.installed=Array.from({length:s.tents},(_,i)=>i);s.layout={};const origin=tentOrigins[home];s.layout[home+':0']={home,x:origin.x,z:origin.z,r:angle};refreshBase();
 const p=activeTentPose(0);check(p&&p.r===tents[0].rotation.y&&p.x===tents[0].position.x,'collision uses canonical saved/default pose matching rendered group');
 for(const [x,z]of [[1.15,0],[-1.15,0],[0,-1.15],[0,0]]){const q=tentWorldPoint(p,x,z);check(tentCollisionAt(q.x,q.z)&&blocked(q.x,q.z),'rotated side/back/pot is solid');}
 for(const z of [1.1,1.6]){const q=tentWorldPoint(p,0,z);check(!blocked(q.x,q.z),'front aisle/approach remain open at home '+home+' angle '+angle);}
 const side=tentWorldPoint(p,1.15,0);s.installed=[];check(!tentCollisionAt(side.x,side.z),'uninstalled owned tent has no phantom body');s.installed=[0];s.room=false;check(!tentCollisionAt(side.x,side.z),'unowned workshop has no tent body');s.room=true;active=false;check(!tentCollisionAt(side.x,side.z),'title has no active tent body');active=true;
 tentRotationChecks++;
}
load('free',1,true);close();s.room=true;s.house=1;s.tents=1;s.installed=[0];s.layout={};refreshBase();const tentMovePose=activeTentPose(0);
player.set(tentMovePose.x+2.3,1.72,tentMovePose.z);resetPlayerView();yaw=0;keys={a:true};for(let i=0;i<30;i++)update(.06);keys={};check(player.x>=tentMovePose.x+1.525-.001,'actual local movement stops at right canvas');
player.set(tentMovePose.x,1.72,tentMovePose.z-2.3);resetPlayerView();keys={s:true};for(let i=0;i<30;i++)update(.06);keys={};check(player.z<=tentMovePose.z-1.525+.001,'actual local movement stops at back canvas');
player.set(tentMovePose.x,1.72,tentMovePose.z+2);resetPlayerView();keys={w:true};for(let i=0;i<30;i++)update(.06);keys={};check(player.z<tentMovePose.z+1.5&&player.z>=tentMovePose.z+.925-.001,'front remains walkable until solid pot, not a filled tent box');
s.soil=1;s.seeds[0]=1;performFixtureWork('prepare',0);performFixtureWork('plant',0,0);check(s.soil===0&&s.seeds[0]===0&&s.plants[0]?.phase==='dry','real manual soil/seed tasks still commit from front exactly once');
const tentCropBefore=JSON.stringify(s.plants);beginPlacement(0);placeGhost.position.set(tentMovePose.x+2,1.15,tentMovePose.z+1);placeMode.r=Math.PI/2;confirmPlacement();work=null;close();check(!placeMode&&s.layout['1:0']?.r===Math.PI/2&&JSON.stringify(s.plants)===tentCropBefore,'actual rotated relocation remains valid and preserves crop');
const tentativeDiagonal={home:1,x:tentMovePose.x+2,z:tentMovePose.z+1,r:Math.PI/4};check(placementValid(0,tentativeDiagonal),'diagonal proposed footprint leaves usable front and routes rather than including old tent body');
const clippedDiagonal={home:1,x:HOMES[1].x-HOMES[1].w/2+2,z:tentMovePose.z+1,r:Math.PI/4};check(!placement19(0,clippedDiagonal),'rotated physical corners may not clip a static wall');
save();load('free',1,false);const tentMoved=activeTentPose(0);check(tentMoved.r===Math.PI/2&&tentMoved.x===tentMovePose.x+2,'moved rotated body restores from v3 layout');
const tentBusiness=()=>JSON.stringify([s.cash,s.bank,s.soil,s.seeds,s.raw,s.gummies,s.packs,s.storedPacks,s.plants,s.layout]);
let tentLegacyChecks=0;
for(const angle of [0,Math.PI/2,Math.PI]){
 s.layout['1:0'].r=angle;refreshBase();const p=activeTentPose(0),layoutBefore=JSON.stringify(s.layout),cropBefore=JSON.stringify(s.plants),tentSavedBusiness=tentBusiness();
 for(const [x,z]of [[1.15,0],[0,-1.15],[0,0]]){
  const embedded=tentWorldPoint(p,x,z);player.set(embedded.x,1.72,embedded.z);save();load('free',1,false);
  check(!blocked(player.x,player.z)&&Math.hypot(player.x-embedded.x,player.z-embedded.z)<=3&&JSON.stringify(s.layout)===layoutBefore&&JSON.stringify(s.plants)===cropBefore&&tentBusiness()===tentSavedBusiness,'legacy rotated panel/pot save unembeds locally without changing business, inventory, equipment or crops');
  const recovered={x:player.x,z:player.z};save();load('free',1,false);check(player.x===recovered.x&&player.z===recovered.z,'tent recovery does not drift after second reload');tentLegacyChecks++;
 }
 const aisle=tentWorldPoint(p,0,1.1);player.set(aisle.x,1.72,aisle.z);save();load('free',1,false);check(player.x===aisle.x&&player.z===aisle.z,'valid open-front saved stance is not moved');
}
load('free',1,true);close();s.room=true;s.house=1;s.tents=1;s.installed=[];refreshBase();const installingPose={x:tentOrigins[1].x,z:tentOrigins[1].z,r:0};player.set(installingPose.x+1.15,1.72,installingPose.z);resetPlayerView();action('install',0);check(s.installed.includes(0)&&!blocked(player.x,player.z),'successful local installation cannot leave player embedded in newly active canvas');work=null;close();
s.soil=2;s.plants[0]=null;player.set(200,1.72,80);resetPlayerView();const tentHostCamera=camera.position.clone();net.role='host';net.connected=true;const tentChannel={readyState:'open',send(){},close(){}};wireChannel(tentChannel);const tentReceive=m=>tentChannel.onmessage({data:JSON.stringify(m)}),tentPrepareSide={x:installingPose.x+1.15,y:1.72,z:installingPose.z,yaw:0};
tentReceive({type:'position',player:tentPrepareSide});tentReceive({type:'action',seq:1,k:'prepare',a:0,x:tentPrepareSide.x,z:tentPrepareSide.z});check(s.soil===2&&!s.plants[0]&&player.x===200&&camera.position.equals(tentHostCamera),'host rejects guest side-panel task without changing host camera/pose or supplies');
const tentFront={x:installingPose.x,y:1.72,z:installingPose.z+1.6,yaw:0};tentReceive({type:'position',player:tentFront});const tentPrepare={type:'action',seq:2,k:'prepare',a:0,x:tentFront.x,z:tentFront.z};tentReceive(tentPrepare);tentReceive(tentPrepare);check(s.soil===1&&s.plants[0]?.phase==='soil'&&player.x===200&&camera.position.equals(tentHostCamera),'clear front guest task commits once and remote execution never unembeds host');
const tentShared=JSON.parse(JSON.stringify(s));net.role='solo';net.connected=false;load('free',2,true);close();const tentPersonalSlots=signStorageSnapshot();net.role='guest';net.connected=true;const tentGuestChannel={readyState:'open',send(){},close(){}};wireChannel(tentGuestChannel);
const tentPending=JSON.parse(JSON.stringify(tentShared));tentPending.installed=[];tentGuestChannel.onmessage({data:JSON.stringify({type:'state',state:tentPending,player:{x:200,y:1.72,z:80,yaw:0}})});player.set(tentPrepareSide.x,1.72,tentPrepareSide.z);
tentGuestChannel.onmessage({data:JSON.stringify({type:'state',state:tentShared,player:{x:200,y:1.72,z:80,yaw:0}})});const tentGuestSafe={x:player.x,z:player.z},tentGuestState=JSON.stringify(s);
check(!blocked(player.x,player.z)&&Math.hypot(player.x-tentPrepareSide.x,player.z-tentPrepareSide.z)<=3,'accepted host installation snapshot unembeds guest only locally');
tentGuestChannel.onmessage({data:JSON.stringify({type:'state',state:tentShared,player:{x:200,y:1.72,z:80,yaw:0}})});save();check(player.x===tentGuestSafe.x&&player.z===tentGuestSafe.z&&JSON.stringify(s)===tentGuestState&&signStorageSnapshot()===tentPersonalSlots,'repeated accepted installation is drift-free and preserves host state/six guest slots');
const tentRenderResources=sceneResources(scene),tentRenderState=JSON.stringify(s),tentRecordCount=colliders.length;for(let i=0;i<150;i++)renderFrame();check(sameResources(tentRenderResources,sceneResources(scene))&&JSON.stringify(s)===tentRenderState&&colliders.length===tentRecordCount&&signStorageSnapshot()===tentPersonalSlots,'150 tent presentation updates add no body/scene resources or save/state writes');
net.role='solo';net.connected=false;keys={};close();resetPlayerView();
console.log('PASS: '+tentRotationChecks+' actual home/rotation cases, bounded installed-only open-front canvas/pot collision, local walking/manual soil/seed/rotated move, '+tentLegacyChecks+' drift-free embedded save recoveries, install safety, rejected side/accepted-once front guest tasks, host camera restoration and snapshot-local recovery with stable resources. DOM/WebGL/channels mocked; not rendered contact, 3D headroom or live co-op.');


// Installed tent support must agree with the unchanged exported floor.
load('free',1,true);close();s.room=true;s.house=1;s.tents=1;s.installed=[0];refreshBase();
const supportTent=activeTentPose(0),supportAisle=tentWorldPoint(supportTent,0,1.05);
check(Math.abs(floorHeight(supportAisle.x,supportAisle.z)-.08)<1e-9,'installed tent aisle uses exported .08 floor support');
let supportCases=0;
for(let home=0;home<3;home++)for(const angle of [0,Math.PI/2,Math.PI,Math.PI*1.5,Math.PI/4]){
 s.house=home;s.room=true;s.tents=1;s.installed=[0];s.layout={};const o=tentOrigins[home];s.layout[home+':0']={home,x:o.x,z:o.z,r:angle};refreshBase();
 const p=activeTentPose(0),aisle=tentWorldPoint(p,0,1.05),lampLane=tentWorldPoint(p,.65,.75),front=tentWorldPoint(p,0,1.6);
 check(floorHeight(aisle.x,aisle.z)===.08&&ceilingHeight(aisle.x,aisle.z)===2.255&&ceilingHeight(lampLane.x,lampLane.z)===2.0525,'canonical rotated floor/roof/lamp at home '+home);
 check(floorHeight(front.x,front.z)===0&&ceilingHeight(front.x,front.z)===Infinity,'authored working approach has no phantom floor/roof');
 player.set(aisle.x,1.72,aisle.z);resetPlayerView();check(Math.abs(player.y-1.8)<1e-9&&camera.position.y===player.y&&playerPacket().y===player.y,'standing eye/camera/network share tent support');
 keys={' ':true};for(let i=0;i<25;i++){update(.06);keys[' ']=false;check(player.y+.2<=2.255001&&camera.position.y+.17<=2.255001,'actual jump remains below exported tent roof');}check(locomotion.jump===0,'tent jump lands on raised floor');
 keys={control:true};for(let i=0;i<20;i++)update(.06);check(Math.abs(player.y-1.3)<1e-5,'crouch uses same support');keys={};for(let i=0;i<20;i++)update(.06);
 player.set(lampLane.x,1.72,lampLane.z);resetPlayerView();keys={' ':true};let lampPeak=player.y;for(let i=0;i<25;i++){update(.06);keys[' ']=false;lampPeak=Math.max(lampPeak,player.y);check(player.y+.2<=2.052501,'accessible side of pot respects conservative low lamp guard');}check(lampPeak>1.8&&lampPeak<1.853,'low lamp actually reduces local jump headroom');
 for(const off of ['pending','unowned','title']){s.installed=off==='pending'?[]:[0];s.room=off!=='unowned';active=off!=='title';check(floorHeight(aisle.x,aisle.z)===0&&ceilingHeight(aisle.x,aisle.z)===Infinity,'no '+off+' support/headroom ghosts');}active=true;s.room=true;s.installed=[0];supportCases++;
}
load('free',1,true);close();s.room=true;s.house=1;s.tents=1;s.installed=[0];s.layout={};refreshBase();const tentEntry=activeTentPose(0);
function walkTentFloor(from,to){player.set(tentEntry.x,1.72,tentEntry.z+from);resetPlayerView();yaw=to<from?0:Math.PI;keys={w:true};let count=0,lastEye=player.y;
 while((to<from?player.z>tentEntry.z+to:player.z<tentEntry.z+to)&&count++<40){update(.03);check(!blocked(player.x,player.z)&&Math.abs(camera.position.y-lastEye)<.13,'real front-entry floor step stays clear and bounded');lastEye=camera.position.y;}
 keys={};check(count<40,'actual entry/exit reaches destination');
}
walkTentFloor(1.7,1.05);check(Math.abs(player.y-1.8)<1e-9,'walking steps onto tent floor');walkTentFloor(1.05,1.7);check(Math.abs(player.y-1.72)<1e-9,'walking steps back off tent floor');
player.set(tentEntry.x,1.72,tentEntry.z+1.41);resetPlayerView();locomotion.jump=.7;locomotion.vertical=3;syncPlayerView();yaw=0;keys={w:true};update(.06);keys={};check(player.z>tentEntry.z+1.4&&locomotion.jump>.5,'airborne front approach stops before roof instead of snapping through it');
for(let i=0;i<40;i++)update(.06);keys={w:true};for(let i=0;i<3;i++)update(.06);keys={};check(player.z<tentEntry.z+1.4&&player.z>tentEntry.z+.925,'landed player can enter open tent after head guard clears');
const supportGoods=tentBusiness();player.set(tentEntry.x,1.72,tentEntry.z+1.05);resetPlayerView();save();load('free',1,false);check(player.x===tentEntry.x&&player.z===tentEntry.z+1.05&&Math.abs(player.y-1.8)<1e-9&&tentBusiness()===supportGoods,'legacy aisle x/z and goods survive v3 reload with derived eye');
const supportImport=JSON.parse(JSON.stringify(s));pendingReset={state:supportImport};confirmImport();check(Math.abs(player.y-1.8)<1e-9&&tentBusiness()===supportGoods,'validated import derives tent support without new save fields');
s.props[0]={x:tentEntry.x,y:.3,z:tentEntry.z+1.05,vx:0,vy:0,vz:0,owner:null};update(.06);check(Math.abs(s.props[0].y-.405)<1e-9,'old low crate settles on tent floor');action('grabProp',0);update(.06);check(s.props[0].owner==='host'&&s.props[0].y>.405&&s.props[0].y<=1.26,'held crate eases above raised tent floor');action('dropProp');for(let i=0;i<120;i++)update(.06);check(!s.props[0].owner&&Math.abs(s.props[0].y-.405)<1e-5&&tentBusiness()===supportGoods,'set-down settles on floor without business goods changes');
// Local installation updates support even if no unembedding was necessary.
s.installed=[];refreshBase();player.set(tentEntry.x,1.72,tentEntry.z+1.05);resetPlayerView();action('install',0);check(s.installed.includes(0)&&Math.abs(player.y-1.8)<1e-9&&camera.position.y===player.y,'local install raises a clear aisle stance immediately');work=null;close();
const supportHost=JSON.parse(JSON.stringify(s));net.role='host';net.connected=true;net.remote={x:tentEntry.x,y:1.8,z:tentEntry.z+1.05,yaw:0};networkTick(.4);check(other.position.y===.08,'existing peer root shares raised tent floor');
player.set(200,1.72,80);resetPlayerView();s.soil=2;s.plants[0]=null;const supportRemoteCamera=camera.position.clone(),supportActionChannel={readyState:'open',send(){},close(){}};wireChannel(supportActionChannel);
const supportReceive=m=>supportActionChannel.onmessage({data:JSON.stringify(m)}),supportRemotePose={x:tentEntry.x,y:1.8,z:tentEntry.z+1.05,yaw:0};supportReceive({type:'position',player:supportRemotePose});const supportPrepare={type:'action',seq:1,k:'prepare',a:0,x:supportRemotePose.x,z:supportRemotePose.z};supportReceive(supportPrepare);supportReceive(supportPrepare);check(s.soil===1&&s.plants[0]?.phase==='soil'&&player.x===200&&player.y===1.72&&camera.position.equals(supportRemoteCamera),'raised-floor guest manual task commits once and restores host physical/camera pose');
net.role='solo';net.connected=false;load('free',2,true);close();const supportPersonal=signStorageSnapshot();net.role='guest';net.connected=true;const supportChannel={readyState:'open',send(){},close(){}};wireChannel(supportChannel);
const supportPending=JSON.parse(JSON.stringify(supportHost));supportPending.installed=[];supportChannel.onmessage({data:JSON.stringify({type:'state',state:supportPending,player:{x:200,y:1.72,z:80,yaw:0}})});player.set(tentEntry.x,1.72,tentEntry.z+1.05);resetPlayerView();menu('bag');
supportChannel.onmessage({data:JSON.stringify({type:'state',state:supportHost,player:{x:200,y:1.72,z:80,yaw:0}})});check(Math.abs(player.y-1.8)<1e-9&&camera.position.y===player.y&&player.x===tentEntry.x,'accepted host installation immediately updates paused guest support without changing clear x/z');
const supportGuestState=JSON.stringify(s),supportResources=sceneResources(scene),supportColliderCount=colliders.length;for(let i=0;i<150;i++){floorHeight(player.x,player.z);ceilingHeight(player.x,player.z);renderFrame();}save();check(JSON.stringify(s)===supportGuestState&&signStorageSnapshot()===supportPersonal&&sameResources(supportResources,sceneResources(scene))&&colliders.length===supportColliderCount,'support/render projections preserve accepted host state, guest slots and warmed resources');
const supportReplacement={readyState:'open',send(){},close(){}};wireChannel(supportReplacement);supportChannel.onmessage({data:JSON.stringify({type:'state',state:supportPending,player:{x:200,y:1.72,z:80,yaw:0}})});check(JSON.stringify(s)===supportGuestState&&Math.abs(player.y-1.8)<1e-9,'obsolete channel cannot remove support or change guest eye');
net.role='solo';net.connected=false;keys={};close();resetPlayerView();
load('free',1,true);close();s.room=true;s.house=1;s.tents=1;s.installed=[0];refreshBase();s.plants[0]={strain:0,phase:'soil',progress:0};const supportMoving=activeTentPose(0),supportMoveCrop=JSON.stringify(s.plants);player.set(supportMoving.x,1.72,supportMoving.z+1.6);resetPlayerView();beginPlacement(0);placeGhost.position.set(supportMoving.x+2,1.15,supportMoving.z+1);placeMode.r=Math.PI/2;confirmPlacement();work=null;close();const supportMoved=activeTentPose(0),supportMovedAisle=tentWorldPoint(supportMoved,0,1.05);
check(supportMoved.r===Math.PI/2&&floorHeight(supportMovedAisle.x,supportMovedAisle.z)===.08&&ceilingHeight(supportMovedAisle.x,supportMovedAisle.z)===2.255&&floorHeight(supportMoving.x,supportMoving.z+1.05)===0&&JSON.stringify(s.plants)===supportMoveCrop,'actual moved rotated tent retargets support/headroom without stale old footprint or crop loss');
save();load('free',1,false);check(floorHeight(supportMovedAisle.x,supportMovedAisle.z)===.08&&ceilingHeight(supportMovedAisle.x,supportMovedAisle.z)===2.255,'custom moved support restores from v3 canonical layout');
console.log('PASS: '+supportCases+' home/rotation floor/roof/lamp cases with actual standing/crouch/jump, bounded front entry/exit and airborne/landed head clearance, legacy reload/import, crate carry/drop, immediate local/paused guest installation support, existing peer root and stable read-only resource/slot checks. DOM/WebGL/channels mocked, not rendered contact or live co-op.');

// Prop overhead contacts use bounded slabs, not the player's infinite ceiling.
net.role='solo';net.connected=false;load('free',1,true);close();ensureProps();
const propBoundPosition=propMeshes[0].position.clone(),propBoundRotation=propMeshes[0].rotation.clone();propMeshes[0].position.set(0,0,0);propMeshes[0].rotation.set(0,0,0);propMeshes[0].updateMatrixWorld(true);const originalCrateBox=new THREE.Box3().setFromObject(propMeshes[0]);propMeshes[0].position.copy(propBoundPosition);propMeshes[0].rotation.copy(propBoundRotation);
console.log('CPU original crate bounds: '+JSON.stringify([originalCrateBox.min.toArray(),originalCrateBox.max.toArray()]));check(originalCrateBox.min.x>=-.335001&&originalCrateBox.max.x<=.335001&&originalCrateBox.min.z>=-.335001&&originalCrateBox.max.z<=.335001&&originalCrateBox.min.y>=-.325001&&originalCrateBox.max.y<=.325001,'original rounded crate/tape fit measured .335 horizontal/.325 vertical half-extents');
scene.updateMatrixWorld(true);const lowSurfaceMeshes=[];scene.traverse(o=>{if(o.isMesh)lowSurfaceMeshes.push(o);});
function lowSurfaceTop(x,z){return new THREE.Raycaster(new THREE.Vector3(x,.25,z),new THREE.Vector3(0,-1,0),0,1).intersectObjects(lowSurfaceMeshes,false).find(h=>h.point.y>=-.001)?.point.y;}
const townPropCases=[[20,9,.105,'old-town pavement'],[-261.9,-160,.085,'expanded pavement'],[0,85,.09,'pier deck']],townPropBusiness=tentBusiness();
for(const [x,z,top,label] of townPropCases){check(Math.abs(lowSurfaceTop(x,z)-top)<1e-6&&townPropFloorHeight(x,z)===top,'actual '+label+' mesh top agrees with finite crate support');check(floorHeight(x,z)===0,'crate-only '+label+' support leaves player route unchanged');s.props[0]={x,y:.325,z,vx:0,vy:0,vz:0,owner:null};update(.06);check(Math.abs(s.props[0].y-(top+.325))<1e-9&&s.props[0].x===x&&s.props[0].z===z,'actual host crate settles on '+label+' without horizontal drift');}
s.props[0]={x:-261.9,y:.325,z:-160,vx:0,vy:0,vz:0,owner:null};save();load('free',1,false);update(.06);check(s.props[0].x===-261.9&&s.props[0].z===-160&&Math.abs(s.props[0].y-.41)<1e-9&&tentBusiness()===townPropBusiness,'legacy low district-pavement crate derives new support without save fields or business changes');
s.props[0]={x:20,y:.325,z:5.9,vx:0,vy:0,vz:10,owner:null};update(.06);check(s.props[0].z>6.2&&Math.abs(s.props[0].y-.43)<1e-9,'moving crate steps onto the measured old-town pavement envelope');
const clearanceWall={x:100,z:-70,w:.65,d:4};colliders.push(clearanceWall);const oldCentreClear={x:99.67,z:-70};
check(!blocked(oldCentreClear.x,oldCentreClear.z)&&propBlocked(oldCentreClear.x,oldCentreClear.z),'crate-specific static clearance catches measured bevel overlap without widening player collision');
s.props[0]={...oldCentreClear,y:.325,vx:0,vy:0,vz:0,owner:null};const clearanceBusiness=tentBusiness();update(.06);check(!propBlocked(s.props[0].x,s.props[0].z)&&Math.hypot(s.props[0].x-oldCentreClear.x,s.props[0].z-oldCentreClear.z)<=.16&&tentBusiness()===clearanceBusiness,'legacy centre-clear crate recovers locally without business changes');
s.props[0]={x:99,y:.325,z:-70,vx:30,vy:0,vz:0,owner:null};update(.06);check(s.props[0].x<=clearanceWall.x-clearanceWall.w/2-.009&&s.props[0].vx<0,'actual host throw sweep stops at measured crate clearance before a player-padded wall');
check(colliders.pop()===clearanceWall,'temporary clearance fixture is removed exactly');
s.props[0]={x:-57.5,y:2.6,z:26.7,vx:0,vy:20,vz:0,owner:null};const overheadEconomy=tentBusiness();update(.06);check(s.props[0].y+.325<=3.020001&&s.props[0].vy<0,'actual host prop update reflects upward sweep from original RV roof underside');
for(let i=0;i<300;i++)update(.06);check(Math.abs(s.props[0].y-1.265)<1e-8&&s.props[0].vy===0&&tentBusiness()===overheadEconomy,'RV underside rebound eventually settles on raised floor with business conserved');
check(s.props[0].y+originalCrateBox.min.y>=.94&&s.props[0].y+originalCrateBox.min.y-.94<.001,'settled original bevel bottom no longer intersects exported RV floor');
for(const legacyRoofY of [3.1,3.22]){s.props[0]={x:-57.5,y:legacyRoofY,z:26.7,vx:0,vy:0,vz:0,owner:null};save();load('free',1,false);update(.06);check(s.props[0].x===-57.5&&s.props[0].z===26.7&&Math.abs(s.props[0].y-legacyRoofY)<.5&&(s.props[0].y<=2.6950001||s.props[0].y>=3.5649999)&&tentBusiness()===overheadEconomy,'embedded legacy roof save exits to nearest clear vertical side without horizontal/business changes');}
s.props[0]={x:-57.5,y:4,z:26.7,vx:0,vy:-30,vz:0,owner:null};update(.06);check(s.props[0].y>=3.565-1e-8&&s.props[0].vy>0,'actual falling crate hits exported RV roof top');for(let i=0;i<300;i++)update(.06);check(Math.abs(s.props[0].y-3.565)<1e-8&&s.props[0].vy===0,'actual rooftop crate settles above, not below, slab');save();load('free',1,false);update(.06);check(Math.abs(s.props[0].y-3.565)<1e-8,'v3 rooftop prop reload remains on top');
check(ceilingHeight(-58,24.3)===3.02,'crate-only rooftop vent leaves existing player headroom unchanged');
s.props[0]={x:-58,y:4.5,z:24.3,vx:0,vy:-30,vz:0,owner:null};update(.06);check(s.props[0].y>=3.905-1e-8&&s.props[0].vy>0,'actual falling crate hits original exported rooftop vent top');for(let i=0;i<300;i++)update(.06);check(Math.abs(s.props[0].y-3.905)<1e-8&&s.props[0].vy===0,'actual crate settles on finite vent instead of the main roof');save();load('free',1,false);update(.06);check(Math.abs(s.props[0].y-3.905)<1e-8,'v3 vent-top prop reload remains on top');
s.props[0]={x:-59.5,y:3.565,z:24.3,vx:30,vy:0,vz:0,owner:null};update(.06);check(s.props[0].x<RV_PROP_VENT.minX&&s.props[0].vx<=0,'actual rooftop throw substeps stop at the finite vent side before tunnelling through');
s.props[0]={x:-58,y:3.7,z:24.3,vx:0,vy:0,vz:0,owner:null};save();load('free',1,false);update(.06);check(s.props[0].x===-58&&s.props[0].z===24.3&&Math.abs(s.props[0].y-3.905)<1e-8&&tentBusiness()===overheadEconomy,'legacy vent-overlap save recovers vertically without horizontal or business changes');
s.props[0]={x:-58,y:4.5,z:26.7,vx:0,vy:-30,vz:0,owner:null};for(let i=0;i<300;i++)update(.06);check(Math.abs(s.props[0].y-3.565)<1e-8,'adjacent rooftop remains at the original main-roof height outside finite vent footprint');
player.set(-57.5,1.72,26.7);resetPlayerView();action('grabProp',0);check(!s.props[0].owner,'local pickup cannot reach through RV roof');menu('prop',0);check($('modal').innerHTML.includes('disabled'),'prop card disables occluded rooftop pickup');close();
let overheadTentCases=0,horizontalTentCases=0;
for(let home=0;home<3;home++)for(const angle of [0,Math.PI/2,Math.PI,Math.PI*1.5,Math.PI/4]){
 s.room=true;s.house=home;s.tents=1;s.installed=[0];s.layout={};const o=tentOrigins[home];s.layout[home+':0']={home,x:o.x,z:o.z,r:angle};refreshBase();const p=activeTentPose(0),aisle=tentWorldPoint(p,0,1.2),lampSide=tentWorldPoint(p,.65,.75);
 check(propOverheadBands(aisle.x,aisle.z).some(b=>b.bottom===2.25)&&propOverheadBands(lampSide.x,lampSide.z).some(b=>b.bottom===2.0525),'canonical tent roof/lamp bands rotate at home '+home);
 const corner=tentWorldPoint(p,.77,1),cornerHit=tentPropBlocked(corner.x,corner.z,p.x,p.z,p.r);check(propTentCollisionAt(corner.x,corner.z)===cornerHit&&!blocked(corner.x,corner.z),'canonical crate-only body query keeps the player route unchanged');
 if(cornerHit){s.props[1]={x:corner.x,y:.405,z:corner.z,vx:0,vy:0,vz:0,owner:null};const cornerBusiness=tentBusiness();update(.06);check(!propTentCollisionAt(s.props[1].x,s.props[1].z)&&Math.hypot(s.props[1].x-corner.x,s.props[1].z-corner.z)<=.16&&tentBusiness()===cornerBusiness,'old crate near rotated tent recovers locally without moving tent/crop/business');horizontalTentCases++;}
 s.props[0]={x:aisle.x,y:1.8,z:aisle.z,vx:0,vy:20,vz:0,owner:null};update(.06);check(s.props[0].y+.325<=2.250001&&s.props[0].vy<0,'actual rotated tent underside contact');
 s.props[0]={x:lampSide.x,y:1.6,z:lampSide.z,vx:0,vy:20,vz:0,owner:null};update(.06);check(s.props[0].y+.325<=2.052501&&s.props[0].vy<0,'actual rotated conservative lamp contact');
 s.props[0]={x:aisle.x,y:3.3,z:aisle.z,vx:0,vy:-30,vz:0,owner:null};update(.06);check(s.props[0].y>=2.675-1e-8&&s.props[0].vy>0,'actual rotated roof top landing');
 for(const off of ['pending','unowned','title']){s.installed=off==='pending'?[]:[0];s.room=off!=='unowned';active=off!=='title';check(propOverheadBands(aisle.x,aisle.z).length===0,'no '+off+' tent prop slab ghosts');}active=true;s.room=true;s.installed=[0];overheadTentCases++;
}
// Moving a tent must not leave a stale roof query at its former position.
s.house=1;s.layout={};s.installed=[0];refreshBase();const oldOverheadPose=activeTentPose(0),oldOverheadPoint=tentWorldPoint(oldOverheadPose,0,1.15);s.layout['1:0']={home:1,x:oldOverheadPose.x+4,z:oldOverheadPose.z+2,r:Math.PI/4};const movedOverheadPoint=tentWorldPoint(s.layout['1:0'],0,1.15);check(propOverheadBands(oldOverheadPoint.x,oldOverheadPoint.z).length===0&&propOverheadBands(movedOverheadPoint.x,movedOverheadPoint.z).length>0,'queries use latest canonical rotated layout before a rendered refresh');
load('free',1,true);close();ensureProps();s.props[0]={x:-57.5,y:3.565,z:26.7,vx:0,vy:0,vz:0,owner:null};update(0);player.set(200,1.72,80);resetPlayerView();const overheadHostPose=player.clone(),overheadHostCamera=camera.position.clone(),overheadHostGoods=tentBusiness();net.role='host';net.connected=true;const overheadChannel={readyState:'open',send(){},close(){}};wireChannel(overheadChannel);const overheadReceive=m=>overheadChannel.onmessage({data:JSON.stringify(m)});
overheadReceive({type:'position',player:{x:-57.5,y:2.66,z:26.7,yaw:0}});overheadReceive({type:'action',seq:1,k:'grabProp',a:0,x:-57.5,z:26.7});check(!s.props[0].owner&&player.equals(overheadHostPose)&&camera.position.equals(overheadHostCamera),'host rejects partner through-roof grab without host pose/camera changes');
s.props[0].y=1.265;const overheadValidGrab={type:'action',seq:2,k:'grabProp',a:0,x:-57.5,z:26.7};overheadReceive(overheadValidGrab);overheadReceive(overheadValidGrab);check(s.props[0].owner==='guest','clear below-roof shared grab remains valid once');const overheadThrow={type:'action',seq:3,k:'throwProp',x:-57.5,z:26.7};overheadReceive(overheadThrow);overheadReceive(overheadThrow);check(!s.props[0].owner&&s.props[0].vy===3&&Math.hypot(s.props[0].wx,s.props[0].wy,s.props[0].wz)>5&&tentBusiness()===overheadHostGoods&&player.equals(overheadHostPose)&&camera.position.equals(overheadHostCamera),'shared throw preserves deterministic angular/linear impulse, replay/business and host pose');
s.props[0]={x:-57.5,y:2.6,z:26.7,vx:0,vy:20,vz:0,owner:null};update(.06);check(s.props[0].vy<0&&s.props[0].y+.325<=3.020001,'shared host alone advances roof rebound');const overheadShared=JSON.parse(JSON.stringify(s));
net.role='solo';net.connected=false;load('free',2,true);close();const overheadSlots=signStorageSnapshot();net.role='guest';net.connected=true;const overheadGuestChannel={readyState:'open',send(){},close(){}};wireChannel(overheadGuestChannel);overheadGuestChannel.onmessage({data:JSON.stringify({type:'state',state:overheadShared,player:{x:200,y:1.72,z:80,yaw:0}})});const overheadAccepted=JSON.stringify(s),overheadResourcePool=sceneResources(scene),overheadBodyCount=colliders.length;
for(let i=0;i<150;i++){update(.06);renderFrame();propOverheadBands(-57.5,26.7);}save();check(JSON.stringify(s)===overheadAccepted&&signStorageSnapshot()===overheadSlots&&sameResources(overheadResourcePool,sceneResources(scene))&&colliders.length===overheadBodyCount,'guest never advances roof physics or writes slots; repeated queries/render retain host state and scene resources');
net.role='solo';net.connected=false;keys={};close();resetPlayerView();
console.log('PASS: original crate bounds, dedicated wall/world/tent clearance with local legacy recovery, '+horizontalTentCases+' rotated corner recoveries, actual old-town/expanded pavement and pier settling, RV underside/main-roof/finite-vent top and side contacts with reload/occluded pickup, '+overheadTentCases+' owned-only tent roof/lamp contacts, fresh layout queries, shared replay-safe grab/throw and host-only/guest-slot safety with stable resources. Prepared fixtures and mocked DOM/WebGL/channels; not rendered/live co-op.');

// Delivery phone joins promise, carried stock, current customer position and one next action.
load('free',3,true);close();player.set(0,1.72,0);s.packs=STRAINS.map(()=>0);s.packs[0]=2;s.npcs[0]={x:3,z:4};const deliveryClock=(s.day-1)*1440+s.time;
s.deals=[{npc:0,t:0,qty:2,price:30,due:deliveryClock+80},{npc:1,t:1,qty:1,price:40,due:deliveryClock+20}];
const deliveryBusiness=JSON.stringify({cash:s.cash,bank:s.bank,packs:s.packs,deals:s.deals});menu('deals');
check($('modal').innerHTML.includes('NEXT STOP')&&$('modal').innerHTML.includes('Jules · Pine Pop')&&$('modal').innerHTML.includes('Ready now · earliest deadline · 80 min · 5 m away')&&$('modal').innerHTML.includes('NEXT · Jules'),'actual phone recommends the ready customer and accepted current position instead of the earlier incomplete promise');
trackNextDelivery();check(track?.npc===0&&track.label==='Jules','next-stop action starts existing moving-customer tracking');
s.packs[0]=0;menu('deals');check($('modal').innerHTML.includes('NEXT TASK')&&$('modal').innerHTML.includes('Benji · Lemon Fizz')&&$('modal').innerHTML.includes('Pack 1 more before leaving')&&$('modal').innerHTML.includes('Find worktable'),'phone switches to the smallest packing gap when no order is ready');
trackNextDelivery();check(track?.type==='craft','packing recommendation points to the existing worktable');
s.packs[0]=2;menu('deals');check(JSON.stringify({cash:s.cash,bank:s.bank,packs:s.packs,deals:s.deals})===deliveryBusiness,'delivery planning and navigation do not mutate money, commitments or carried stock');
const deliverySlots=signStorageSnapshot();net.role='guest';net.connected=true;s.npcs[0]={x:140,z:70};menu('deals');check($('modal').innerHTML.includes(Math.round(Math.hypot(140,70))+' m away'),'guest phone reads accepted moving-customer coordinates');trackNextDelivery();save();check(signStorageSnapshot()===deliverySlots,'guest delivery planning and ephemeral tracking never write personal slots');
net.role='solo';net.connected=false;track=null;close();
console.log('PASS: actual delivery phone selects one ready next stop or packing task, follows current customer positions, preserves economy/commitments and leaves guest slots untouched. DOM/WebGL/channels mocked, not a rendered route or live co-op.');

// One fictional dated handset consistently frames every functional phone screen.
load('free',3,true);close();s.day=3;s.time=547;const phoneBusiness=JSON.stringify({cash:s.cash,bank:s.bank,packs:s.packs,deals:s.deals,threads:s.threads}),phoneSlots=signStorageSnapshot();
menu('phone');check($('modal').innerHTML.includes('GBM-04')&&$('modal').innerHTML.includes('COASTLINE CELL')&&$('modal').innerHTML.includes('MESSAGES')&&$('modal').innerHTML.includes('9:07 AM')&&$('modal').innerHTML.includes('LOCAL')&&$('modal').innerHTML.includes('aria-label="Signal 2 of 4"'),'messages show bounded local GBM-04 identity, clock and signal');
check(($('modal').innerHTML.match(/class="device-keys"/g)||[]).length===1&&$('modal').innerHTML.includes('aria-current="page"')&&$('modal').innerHTML.includes('>MSG</button>'),'phone has one persistent hardware navigation row and marks messages current');
menu('listing');check($('modal').innerHTML.includes('MARKET LISTING')&&$('modal').innerHTML.includes('aria-current="page"')&&$('modal').innerHTML.includes('>LIST</button>'),'listing keeps the same shell and current key');
menu('deals');check($('modal').innerHTML.includes('DELIVERY ROUND')&&$('modal').innerHTML.includes('aria-current="page"')&&$('modal').innerHTML.includes('>DEALS</button>'),'empty delivery screen keeps shell/navigation');
menu('wallet');check($('modal').innerHTML.includes('ONLINE CARD')&&$('modal').innerHTML.includes('aria-current="page"')&&$('modal').innerHTML.includes('>CARD</button>'),'online card remains a handset function');
menu('thread',0);check($('modal').innerHTML.includes('CONVERSATION')&&$('modal').innerHTML.includes('Phone functions'),'customer conversation retains the device shell');
net.role='host';net.connected=true;menu('phone');check($('modal').innerHTML.includes('LINK HOST')&&$('modal').innerHTML.includes('aria-label="Signal 4 of 4"'),'connected host status is explicit');
net.role='guest';net.connected=false;menu('phone');check($('modal').innerHTML.includes('LINK LOST')&&$('modal').innerHTML.includes('aria-label="Signal 0 of 4"'),'disconnected guest does not show false signal');save();
check(JSON.stringify({cash:s.cash,bank:s.bank,packs:s.packs,deals:s.deals,threads:s.threads})===phoneBusiness&&signStorageSnapshot()===phoneSlots,'device shell changes no business state and disconnected guest writes no personal slot');
net.role='solo';net.connected=false;close();
console.log('PASS: actual six-screen GBM-04 shell keeps functional keys, bounded game clock and honest local/host/lost status without business or guest-slot mutation. DOM mocked, not rendered device legibility.');

phoneHome();check(($('modal').innerHTML.match(/<button onclick=/g)||[]).length===6&&$('modal').innerHTML.includes('phone-home-clock')&&$('modal').innerHTML.includes('Marketplace')&&$('modal').innerHTML.includes('>Contacts<'),'phone home exposes six actual app actions, contacts and clock');for(const screen of ['phone','listing','deals','wallet','map','journal']){menu(screen);check($('modal').innerHTML.length>0,'phone app opens '+screen);}menu('phone');check($('modal').innerHTML.includes('class="message-inbox"')&&$('modal').innerHTML.includes('Jules'),'messages inbox lists the town');menu('listing');check($('modal').innerHTML.includes('class="product-row"')&&$('modal').innerHTML.includes('Pine Pop')&&$('modal').innerHTML.includes("action('list'"),'marketplace rows keep the list action');
const contactsBefore=JSON.stringify({cash:s.cash,bank:s.bank,relations:s.relations,deals:s.deals,threads:s.threads,helpers:s.helpers,dealers:s.dealers,packs:s.packs});
menu('contacts');check($('modal').innerHTML.includes('>CONTACTS<')&&$('modal').innerHTML.includes('role="meter"')&&$('modal').innerHTML.includes('Jules')&&$('modal').innerHTML.includes('Stranger')&&$('modal').innerHTML.includes('not part of the bay yet')&&$('modal').innerHTML.includes('aria-current="page"')&&$('modal').innerHTML.includes('>PEOPLE</button>')&&$('modal').innerHTML.includes('class="contact-graph"'),'contacts app reads relationships and does not invent street dealers');
check(JSON.stringify({cash:s.cash,bank:s.bank,relations:s.relations,deals:s.deals,threads:s.threads,helpers:s.helpers,dealers:s.dealers,packs:s.packs})===contactsBefore,'opening contacts does not mutate business state');
s.relations[0]=72;s.deals=[{npc:0,t:0,qty:1,price:30}];menu('customer',0);check($('modal').innerHTML.includes('data-band="trusted"')&&$('modal').innerHTML.includes('They walked out to meet you'),'in-person deal screen shows relationship satisfaction');
menu('contacts');for(const fn of events.keydown||[])fn({key:'Backspace',repeat:false,preventDefault(){},target:{tagName:'BODY',closest(){return null}}});check($('modal').innerHTML.includes('phone-app-grid'),'backspace returns to the phone home');
for(const fn of events.keydown||[])fn({key:'2',repeat:false,preventDefault(){},target:{tagName:'BODY',closest(){return null}}});check(panel==='contacts'&&$('modal').innerHTML.includes('role="meter"'),'keyboard 2 opens contacts');
close();
check(neighborhoodShops.length===3,'three outer shops have unobstructed approaches');
for(const shop of neighborhoodShops){
 load('free',1,true);close();player.set(shop.x,1.72+floorHeight(shop.x,shop.z),shop.z);resetPlayerView();
 check(!blocked(shop.x,shop.z)&&pointApproach(player,shop,blocked,floorHeight),'outer shop has real physical access');
 const kind=shop.type==='store'?'wrappers':shop.type==='hardware'?'buyCan':'soil',before=s.cash;
 check(physicalActionAccess(kind).ok,'outer shop passes same authoritative access as original');action(kind);
 check(s.cash===before-(kind==='buyCan'?15:10),'outer shop uses existing verified purchase accounting');
 check(kind==='buyCan'?s.can:kind==='soil'?s.soil===1:s.wrappers===10,'outer shop delivers correct inventory');
 check(visualActors.some(a=>a.g===shop.actor),'outer shop has actual loaded animated resident');
}
menu('map');check(neighborhoodShops.every(shop=>$('modal').innerHTML.includes(shop.label))&&$('modal').innerHTML.includes('class="town-places"')&&$('modal').innerHTML.indexOf('class="town-places"')<$('modal').innerHTML.indexOf(neighborhoodShops[0].label),'town map keeps every place in a visible list');close();
load('free',1,true);visitFixture('buyTent');s.room=true;s.cash=400;s.tents=0;s.plants=[];s.payment='cash';s.can=false;s.trimmers=false;s.packStation=false;menu('hardware');
check($('modal').innerHTML.includes('class="shop-name"')&&$('modal').innerHTML.includes('Basic grow tent')&&$('modal').innerHTML.includes('openShopConfirm(0)')&&!$('modal').innerHTML.includes("action('buyTent')"),'shop buttons name the item and wait for confirmation');
openShopConfirm(0);check(s.cash===400&&s.tents===0&&$('modal').innerHTML.includes('CART')&&$('modal').innerHTML.includes('Buy now')&&$('modal').innerHTML.includes('Basic grow tent'),'confirm cart does not charge before Buy now');
acceptShopConfirm();check(s.cash===300&&s.tents===1&&$('modal').innerHTML.includes('id="shopRefund"'),'confirmed tent purchase can be undone');
refundShopPurchase();check(s.cash===400&&s.tents===0&&s.plants.length===0,'refund restores the $400 start and the tent');
close();
// Actual browser event paths: hovering cannot rotate; a deliberate mouse drag can.
load('free',1,true);close();const pointerYaw=yaw;drag=false;
for(const fn of events.mousemove||[])fn({target:canvas,movementX:20,movementY:0,clientX:100,clientY:100});
check(yaw===pointerYaw,'hovering the world cannot turn the view');drag=true;
for(const fn of events.mousemove||[])fn({target:canvas,movementX:20,movementY:0,clientX:100,clientY:100});
check(yaw<pointerYaw,'held mouse drag turns the view');releaseGameInput();
load('story',3,true);showArrival();check(panel==='arrival'&&s.cash===400&&!s.room,'arrival uses real unchanged fresh save');advanceArrival();advanceArrival();advanceArrival();check(panel===''&&s.arrivalSeen&&track.label.includes('Payphone'),'arrival releases control and tracks real payphone');
menu('payphone');check(callPage===0&&s.called===0,'first call starts before any completion');showCallPage(2);check(s.called===0,'reading dialogue does not complete call');
const callPoint=points.find(p=>p.type==='payphone');player.set(callPoint.x,1.72,callPoint.z);finishFirstCall();check(s.called===1&&s.cash===400&&track.label.includes('Palm'),'call commits once and tracks reception');finishFirstCall();check(s.called===1,'double completion does not advance call twice');
load('story',3);check(s.arrivalSeen&&s.called===1&&s.cash===400,'arrival state and call survive save reload');close();
console.log('PASS: hover/drag input, paced arrival and phone call, skip/continue path and save persistence; DOM/WebGL mocked.');
// Weather remains a reversible projection, never an accumulating mutation.
s.day=2;s.time=0;const weatherSave=JSON.stringify(s);refreshWorldLighting();
const mistNear=scene.fog.near,mistFar=scene.fog.far,mistSun=sun.intensity;
check(coastalWeather(s.day,s.time).mist>.4,'marine fog fixture');
for(let i=0;i<120;i++)refreshWorldLighting();
check(scene.fog.near===mistNear&&scene.fog.far===mistFar&&sun.intensity===mistSun,'weather does not accumulate darkness or fog');
check(JSON.stringify(s)===weatherSave,'weather leaves saved gameplay state unchanged');
s.day=1;s.time=540;refreshWorldLighting();const clearPlan=atmosphericDistancePlan({daylight:worldLighting(s.time,true).daylight,active:true,quality});
check(scene.fog.far===clearPlan.far&&waterUniforms.uFogFar.value===clearPlan.waterFar,'clear weather restores original distance plans');
for(const actor of visualActors){prepareActorLOD(actor);for(const level of [actor.high,actor.low]){if(!level)continue;const head=level.body.getObjectByName('Head');check(head.children.filter(c=>c.name.startsWith('ResidentFacialHair-')).length<=1,'LOD has no cloned duplicate beard');}}
console.log('PASS: actual weather integration restores clear sky, does not accumulate fog, preserves saves and avoids duplicate LOD facial hair.');
// BayBook is read-only management over the same owned property and crew actions.
load('free',3,true);close();s.room=true;s.helpers.crafter=true;
for(let home=0;home<HOMES.length;home++){
 s.house=home;refreshBase();const terminalPoint=points.find(p=>p.type==='staffboard'&&p.home===home);player.set(terminalPoint.x,1.72+floorHeight(terminalPoint.x,terminalPoint.z),terminalPoint.z);
 const beforeTerminal=JSON.stringify(s);menu('staffboard');check($('modal').innerHTML.includes('BAYBOOK / LOCAL BUSINESS SYSTEM')&&$('modal').innerHTML.includes('Today’s production plan'),'actual computer opens management at home '+home);check(JSON.stringify(s)===beforeTerminal,'computer opening is read only');
 workshopTerminals.update({active,room:s.room,house:s.house});check(workshopTerminals.rows.filter(r=>r.group.visible).length===1&&workshopTerminals.rows[home].group.visible,'only owned computer is active');close();
}
check(blocked(-69,24),'contained campsite fire has collision');
load('story',3,true);showArrival();const arrivalMoney=s.cash;now=arrivalStarted;renderFrame();check(openingCamera(0).outside&&!insideRvShell(camera.position.x,camera.position.z)&&camera.position.y>4,'opening frame is an exterior establishing shot, not the RV interior');now+=3;renderFrame();check(!insideRvShell(camera.position.x,camera.position.z)&&camera.position.distanceTo(player)>2,'establishing shot stays outside the shell');finishArrival();check(s.cash===arrivalMoney&&!insideRvShell(player.x,player.z),'stepping outside leaves the RV shell without changing starter money');
console.log('PASS: three owned-property computers, read-only planner, fire collision and actual waking camera preserve player and save state.');
// Extended fleet uses the actual shop, payment, host and save paths.
load('free',3,true);close();s.cash=7000;s.xp=180;const motorPoint=points.find(p=>p.type==='garage');player.set(motorPoint.x,1.72+floorHeight(motorPoint.x,motorPoint.z),motorPoint.z);
check(physicalActionAccess('buyFleet').ok,'garage has a clear fleet purchase approach');action('buyFleet','compact');check(s.cash===7000&&!s.fleetUnlocks,'new vehicle requires original fleet first');
action('buyVehicle');check(s.vehicleOwned&&s.cash===6250,'original van purchase remains unchanged');action('buyFleet','compact');check(s.cash===4650&&activeFleet(s).id==='compact','compact purchase commits price and selection');action('buyFleet','compact');check(s.cash===4650,'duplicate compact purchase cannot charge twice');
const beforeFleet=JSON.stringify([s.cash,s.bank,s.fleetUnlocks,s.fleetSelected,s.vehiclePark]);player.set(200,1.72,80);action('buyFleet','estate');action('selectFleet','van');check(JSON.stringify([s.cash,s.bank,s.fleetUnlocks,s.fleetSelected,s.vehiclePark])===beforeFleet,'remote garage purchases and selection denied');
player.set(motorPoint.x,1.72,motorPoint.z);s.payment='card';s.bank=4000;action('buyFleet','estate');check(s.bank===600&&s.cash===4650&&activeFleet(s).id==='estate','estate charges selected card only');
driving=true;action('selectFleet','van');check(activeFleet(s).id==='estate','moving driver cannot swap fleet');driving=false;
net.connected=true;net.remote={vehicle:true};action('selectFleet','van');check(activeFleet(s).id==='estate','parked host cannot swap partner vehicle while driven');net.connected=false;net.remote=null;
action('selectFleet','compact');save();load('free',3);close();check(activeFleet(s).id==='compact'&&fleetOwned(s,'estate')&&s.bank===600,'both unlocks and selected fleet survive save reload');
player.set(motorPoint.x,1.72,motorPoint.z);net.role='guest';net.connected=false;const disconnectedFleet=JSON.stringify(s);action('selectFleet','van');check(JSON.stringify(s)===disconnectedFleet,'disconnected guest cannot change fleet');net.role='solo';
const originalGaragePark=JSON.stringify(s.vehiclePark);renderFrame();check(localFleetModels.models.get('compact').visible&&!localFleetModels.models.get('estate').visible,'selected model appears without changing parking');check(JSON.stringify(s.vehiclePark)===originalGaragePark,'fleet display preserves parking');
console.log('PASS: actual fleet purchases, duplicate and proximity rejection, card payment, driving/peer locks, save reload, disconnected guest protection and model selection.');
close();player.set(200,1.72,80);vehiclePose={x:200,z:80,angle:0};driving=true;driveSpeed=4;update(0);check(!$('vehicleExit').hidden&&$('vehicleExit').disabled,'mobile exit shown but disabled while moving');driveSpeed=0;update(0);check(!$('vehicleExit').disabled,'mobile exit enabled once stopped');exitVehicle();update(0);check(!driving&&$('vehicleExit').hidden,'existing safe exit hides mobile control');
load('free',3,true);close();s.vehicleOwned=true;s.xp=180;s.cash=5000;player.set(200,1.72,80);net.role='host';net.connected=true;
const fleetChannel={readyState:'open',send(){},close(){}};wireChannel(fleetChannel);const receiveFleet=message=>fleetChannel.onmessage({data:JSON.stringify(message)}),fleetPeer={x:motorPoint.x,y:1.72+floorHeight(motorPoint.x,motorPoint.z),z:motorPoint.z,yaw:0,vehicle:false};
receiveFleet({type:'position',player:fleetPeer});receiveFleet({type:'action',seq:1,k:'buyFleet',a:'compact',x:fleetPeer.x,z:fleetPeer.z});check(s.cash===3400&&activeFleet(s).id==='compact'&&player.x===200,'host accepts a fresh peer garage purchase and restores host position');receiveFleet({type:'action',seq:1,k:'buyFleet',a:'compact',x:fleetPeer.x,z:fleetPeer.z});check(s.cash===3400,'network replay cannot charge a fleet purchase twice');
net.peerPoseSeenAt=performance.now()-2001;receiveFleet({type:'action',seq:2,k:'selectFleet',a:'van',x:fleetPeer.x,z:fleetPeer.z});check(activeFleet(s).id==='compact','stale peer selection denied');
net.role='solo';net.connected=false;net.remote=null;
console.log('PASS: real host channel fleet purchase, duplicate sequence and stale-pose rejection. Channels mocked.');
load('free',3,true);close();player.set(200,1.72,80);yaw=0;
const focusFront={type:'focus-fixture',label:'Front',x:200,z:78},focusBack={type:'focus-fixture',label:'Back',x:200,z:81};points.push(focusFront,focusBack);updateUI();check(near===focusFront,'real prompt chooses aimed front object over closer object behind');yaw=Math.PI;updateUI();check(near===focusBack,'turning selects visible target');yaw=0;act();check(!panel&&near===null,'stale behind-target E press is rejected');points.splice(points.indexOf(focusFront),1);points.splice(points.indexOf(focusBack),1);
Object.assign(locomotion,{jump:.005,vertical:-1,space:false,jumpQueued:0});keys={' ':true};update(.016);check(locomotion.jump===0&&locomotion.jumpQueued>0,'early jump press survives the landing frame');update(.016);check(locomotion.jump>0&&locomotion.jumpQueued===0,'buffered press jumps once after landing');for(let i=0;i<90;i++)update(.016);check(locomotion.jump===0,'holding jump does not auto-hop');releaseGameInput();check(locomotion.jumpQueued===0,'focus loss clears buffered jump');locomotion.jumpQueued=.1;menu('bag');check(locomotion.jumpQueued===0,'opening a menu cancels queued jump');close();
const gaitActor=visualActors.find(a=>a.g===people[0]),gaitPosition=gaitActor.g.position.clone(),gaitWidth=gaitActor.body.scale.x;gaitActor.previous.copy(gaitActor.g.position);gaitActor.g.position.x+=.02;gaitActor.speed=1;gaitActor.body.scale.x=.45;actorAnimation(gaitActor,.02);check(gaitActor.current==='Walk'&&Math.abs(gaitActor.actions.Walk.timeScale-1/(1.2*gaitActor.body.scale.y))<1e-8,'walking cadence uses height, not body width');gaitActor.body.scale.x=gaitWidth;gaitActor.g.position.copy(gaitPosition);gaitActor.previous.copy(gaitPosition);
console.log('PASS: actual aimed interaction/stale click rejection, buffered landing jump, held-key nonrepeat and height-scaled walking cadence.');
load('free',3,true);close();player.set(200,1.72,80);yaw=0;pitch=-.2;ensureProps();
s.props[0]={x:200,y:1.18,z:78.5,vx:0,vy:0,vz:0,owner:null};
const tactilePoint=points.find(p=>p.type==='prop'&&p.i===0);tactilePoint.x=200;tactilePoint.z=78.5;near=tactilePoint;
const tactileMoney=s.cash;act();check(s.props[0].owner==='host'&&!panel,'E grabs an aimed parcel without opening a menu');
check(s.parcelNotes[0]&&s.cash===tactileMoney,'discovery records flavour without changing money');
updateUI();check(!carryHint.hidden&&carryHint.textContent.includes('Shift + G'),'held controls are visible');
pitch=.7;action('throwProp');check(s.props[0].vy>3,'real action uses upward aim');
menu('journal');check($('modal').innerHTML.includes('Return to sender'),'discovered label appears in real notebook');
close();save();load('free',3);close();check(s.parcelNotes[0],'parcel discovery survives save reload');
console.log('PASS: direct E handling, carry controls, aim-dependent throw, notebook discovery and save roundtrip.');
load('free',3,true);close();const spawnGrid=[];for(let x=-56;x<=-40;x+=4)for(let z=22;z<=34;z+=4)spawnGrid.push([x,z]);spawnGrid.push([-47,28.6],[-47,29]);let spawnMoved=0;for(const [x,z] of spawnGrid){const saved=JSON.parse(JSON.stringify(s));saved.x=x;saved.z=z;saved.version=3;saved.mode='free';localStorage.setItem('gummybay-v3-free-3',JSON.stringify(saved));load('free',3,false);close();check(!blocked(player.x,player.z),'loaded spawn stays in open space at '+x+','+z+' → '+player.x.toFixed(2)+','+player.z.toFixed(2));check(Math.hypot(player.x-x,player.z-z)<8,'loaded spawn stays near the saved point');if(Math.hypot(player.x-x,player.z-z)>0.05)spawnMoved++;}check(blocked(-47,28.6),'payphone sample starts inside geometry');check(spawnMoved>0,'a solid save is pushed to open ground');
console.log('PASS: real GLTF assets load; both character LOD scales agree; cargo attachment survives; HUD/menu, $400 save reload, host packet and guest visibility paths execute. DOM/WebGL mocked; not a rendered playtest.');
`,env);})().catch(e=>{console.error(e);process.exitCode=1;});
