// Read-only presentation and movement helpers. No inventory writes.
export function turnTowards(current,target,dt,rate=8){
 const delta=Math.atan2(Math.sin(target-current),Math.cos(target-current));
 return current+delta*(1-Math.exp(-Math.max(0,dt)*rate));
}
export function sweepWalk(position,dx,dz,blocked){
 const moveX=Number.isFinite(dx)?dx:0,moveZ=Number.isFinite(dz)?dz:0;
 const steps=Math.max(1,Math.ceil(Math.hypot(moveX,moveZ)/.16));
 let x=position.x,z=position.z,hitX=false,hitZ=false;
 const sx=moveX/steps,sz=moveZ/steps;
 for(let i=0;i<steps;i++){
  let blockedX=false,blockedZ=false;
  if(!blocked(x+sx,z))x+=sx;else {hitX=true;blockedX=true;}
  if(!blocked(x,z+sz))z+=sz;else {hitZ=true;blockedZ=true;}
  // A corner that catches both axes gets one small slide so the body does not stick.
  if(blockedX&&blockedZ&&sx&&sz){
   const nudge=Math.min(.08,Math.hypot(sx,sz));
   if(Math.abs(sx)>=Math.abs(sz)){
    const dir=Math.sign(sz);
    if(!blocked(x,z+dir*nudge))z+=dir*nudge;
    else if(!blocked(x,z-dir*nudge))z-=dir*nudge;
   }else{
    const dir=Math.sign(sx);
    if(!blocked(x+dir*nudge,z))x+=dir*nudge;
    else if(!blocked(x-dir*nudge,z))x-=dir*nudge;
   }
  }
 }
 return {x,z,hitX,hitZ};
}
export function stockSummary(s){
 const sum=a=>(a||[]).reduce((n,v)=>n+(Number.isFinite(v)?Math.max(0,v):0),0);
 const carried=sum(s.packs),reserved=sum((s.deals||[]).map(d=>d.qty));
 return {raw:sum(s.raw),loose:sum(s.gummies),carried,stored:sum(s.storedPacks),reserved,available:Math.max(0,carried-reserved),wrappers:Math.max(0,s.wrappers||0),transit:s.crafterCargo?1:0};
}
export function workerPoseValid(p,bounds){return !!p&&[p.x,p.z,p.angle].every(Number.isFinite)&&p.x>=bounds.minX&&p.x<=bounds.maxX&&p.z>=bounds.minZ&&p.z<=bounds.maxZ;}
export function createBalanceFeedback(){
 let previous=null;
 return {reset(){previous=null;},sample(cash,bank){
  const next={cash,bank};if(!Number.isFinite(cash)||!Number.isFinite(bank))return [];
  const changes=previous?['cash','bank'].filter(k=>next[k]!==previous[k]).map(k=>({account:k,amount:next[k]-previous[k]})):[];
  previous=next;return changes;
 }};
}

const freezeTravelPoints=points=>Object.freeze(points.map(point=>Object.freeze({...point})));
export const TRAVEL_DISTRICTS=freezeTravelPoints([
 {name:'Old Town',x:-11,z:-5},{name:'Westside',x:-108,z:-160},{name:'East Market',x:108,z:-160},
 {name:'North Heights',x:-3,z:-300},{name:'East Coast',x:185,z:-3},{name:'West Harbor',x:-185,z:-3},
 {name:'Northgate',x:-3,z:-435}
]);
export const TRAVEL_LANDMARKS=freezeTravelPoints([
 {name:'Driftwood campsite',x:-58,z:27},{name:'Palm Court',x:-25,z:19},{name:'Old Town shops',x:0,z:-20},
 {name:'The pier',x:0,z:80},{name:'Harbor Motors',x:-180,z:-150},{name:'Westside seeds',x:-70,z:-147},
 {name:'East Market packaging',x:140,z:-147},{name:'North Heights hardware',x:-30,z:-287},
 {name:'North servo ingredients',x:70,z:-357},{name:'Northgate bus stop',x:-3,z:-435}
]);
const finiteTravelPoint=point=>point&&Number.isFinite(point.x)&&Number.isFinite(point.z);
const travelDistance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const wrapTravelAngle=angle=>Math.atan2(Math.sin(angle),Math.cos(angle));
export function nearestTravelPoint(position,points){
 if(!finiteTravelPoint(position)||!Array.isArray(points))return null;
 let nearest=null,best=Infinity;
 for(const point of points){if(!finiteTravelPoint(point))continue;const metres=travelDistance(position,point);if(metres<best){best=metres;nearest=point;}}
 return nearest?{point:nearest,distance:best}:null;
}
export function travelDistrictContext(position,districts=TRAVEL_DISTRICTS){
 if(!finiteTravelPoint(position)||!Array.isArray(districts))return {district:'Gummy Bay',neighbor:null};
 const ranked=districts.map((point,index)=>finiteTravelPoint(point)?{point,index,distance:travelDistance(position,point)}:null).filter(Boolean).sort((a,b)=>a.distance-b.distance||a.index-b.index);
 if(!ranked.length)return {district:'Gummy Bay',neighbor:null};
 return {district:String(ranked[0].point.name||'Gummy Bay'),neighbor:ranked[1]&&ranked[1].distance-ranked[0].distance<=18?String(ranked[1].point.name||'Gummy Bay'):null};
}
export function travelHeading(angle){
 if(!Number.isFinite(angle))angle=0;
 const directions=['south','south-east','east','north-east','north','north-west','west','south-west'];
 return directions[Math.round(((wrapTravelAngle(angle)+Math.PI*2)%(Math.PI*2))/(Math.PI/4))%8];
}
export function targetBearing(position,heading,target){
 if(!finiteTravelPoint(position)||!finiteTravelPoint(target))return null;
 const metres=travelDistance(position,target),angle=Math.atan2(target.x-position.x,target.z-position.z);
 const relative=wrapTravelAngle(angle-(Number.isFinite(heading)?heading:0)),magnitude=Math.abs(relative);
 let cue='ahead';
 if(metres<8)cue='arriving';
 else if(magnitude>=Math.PI*7/8)cue='behind';
 else if(magnitude>=Math.PI*3/8)cue=relative>0?'left':'right';
 else if(magnitude>=Math.PI/8)cue=relative>0?'bear left':'bear right';
 return {distance:metres,relative,cue};
}
export function travelMapScale(driving){return driving?.72:1.25;}
export function formatTravelDistance(metres){return !Number.isFinite(metres)||metres<0?'—':metres<1000?Math.round(metres)+' m':(metres/1000).toFixed(1)+' km';}
export function projectMapMarker(point,center,scale,width,height,padding=14){
 if(!finiteTravelPoint(point)||!finiteTravelPoint(center)||!Number.isFinite(scale)||scale<=0||!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0||!Number.isFinite(padding)||padding<0||width<=padding*2||height<=padding*2)return null;
 const middleX=width/2,middleY=height/2,dx=(point.x-center.x)*scale,dy=(point.z-center.z)*scale,rawX=middleX+dx,rawY=middleY+dy;
 const minX=padding,maxX=width-padding,minY=padding,maxY=height-padding,offscreen=rawX<minX||rawX>maxX||rawY<minY||rawY>maxY;
 let x=rawX,y=rawY;
 if(offscreen){
  const tx=dx>0?(maxX-middleX)/dx:dx<0?(minX-middleX)/dx:Infinity;
  const ty=dy>0?(maxY-middleY)/dy:dy<0?(minY-middleY)/dy:Infinity;
  const t=Math.min(tx,ty);x=middleX+dx*t;y=middleY+dy*t;
 }
 return {x,y,offscreen,angle:Math.atan2(dx,-dy),distance:travelDistance(point,center)};
}
export function projectMapPoint(point,center,scale,width,height,padding=0){
 const projected=projectMapMarker(point,center,scale,width,height,padding);
 return projected&&!projected.offscreen?{x:projected.x,y:projected.y}:null;
}
export function mapRectVisible(rect,center,scale,width,height,padding=0){
 if(!finiteTravelPoint(rect)||!finiteTravelPoint(center)||!Number.isFinite(rect?.w)||!Number.isFinite(rect?.d)||rect.w<0||rect.d<0||!Number.isFinite(scale)||scale<=0||!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0||!Number.isFinite(padding)||padding<0||width<=padding*2||height<=padding*2)return false;
 const left=width/2+(rect.x-rect.w/2-center.x)*scale,right=width/2+(rect.x+rect.w/2-center.x)*scale,top=height/2+(rect.z-rect.d/2-center.z)*scale,bottom=height/2+(rect.z+rect.d/2-center.z)*scale;
 return right>=padding&&left<=width-padding&&bottom>=padding&&top<=height-padding;
}
export function travelReading(position,{districts=TRAVEL_DISTRICTS,landmarks=TRAVEL_LANDMARKS,target=null}={}){
 const safe=finiteTravelPoint(position)?position:{x:0,z:0,heading:0};
 const district=travelDistrictContext(safe,districts),landmark=nearestTravelPoint(safe,landmarks);
 const heading=Number.isFinite(position?.heading)?position.heading:0,tracked=finiteTravelPoint(target)?targetBearing(safe,heading,target):null;
 return {district:district.district,districtNeighbor:district.neighbor,heading:travelHeading(heading),landmark:landmark?{label:landmark.point.name,distance:landmark.distance}:null,target:tracked?{label:String(target.label||'Tracked place'),distance:tracked.distance,cue:tracked.cue,relative:tracked.relative}:null};
}
export function travelMapCaption(position,{driving=false,districts=TRAVEL_DISTRICTS,landmarks=TRAVEL_LANDMARKS,targetOffscreen=false}={}){
 const reading=travelReading(position,{districts,landmarks}),district=reading.district.toUpperCase()+(reading.districtNeighbor?' / '+reading.districtNeighbor.toUpperCase()+' BORDER':'');
 return (driving?'DRIVE':'WALK')+' · '+district+(reading.landmark?' · '+reading.landmark.label.toUpperCase()+' '+formatTravelDistance(reading.landmark.distance):'')+' · N ↑'+(targetOffscreen?' · EDGE TARGET':'');
}
export function customerTrackStatus({guest=false,connected=true,moving=false,blocked=false}={}){
 if(guest&&!connected)return 'last known · reconnect';
 if(blocked)return 'route delayed';
 if(moving)return 'on the move';
 return 'waiting';
}
export function projectTrackedCustomer(track,customers,options={}){
 if(!track||!Number.isInteger(track.npc)||!Array.isArray(customers))return null;
 const customer=customers[track.npc];if(!finiteTravelPoint(customer))return null;
 return {...track,x:customer.x,z:customer.z,type:'customer',status:customerTrackStatus(options)};
}
