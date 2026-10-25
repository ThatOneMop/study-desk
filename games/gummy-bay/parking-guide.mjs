const freezeBays=bays=>Object.freeze(bays.map(bay=>Object.freeze(bay)));
export const PARKING_BAYS=freezeBays([
 {label:'Harbor Motors',x:-180,z:-158,angle:Math.PI/2,frontX:-180,frontZ:-150},
 {label:'Westside seeds',x:-70,z:-158,angle:Math.PI/2,frontX:-70,frontZ:-147},
 {label:'East Market packaging',x:140,z:-158,angle:Math.PI/2,frontX:140,frontZ:-147},
 {label:'North Heights hardware',x:-30,z:-298,angle:Math.PI/2,frontX:-30,frontZ:-287},
 {label:'North servo ingredients',x:70,z:-368,angle:Math.PI/2,frontX:70,frontZ:-357}
]);

const finitePose=pose=>pose&&Number.isFinite(pose.x)&&Number.isFinite(pose.z)&&Number.isFinite(pose.angle);
const wrap=angle=>Math.atan2(Math.sin(angle),Math.cos(angle));
const alignedAngle=(angle,target)=>{
 const forward=Math.abs(wrap(angle-target)),reverse=Math.abs(wrap(angle-target-Math.PI));
 return reverse<forward?target+Math.PI:target;
};
const freeze=result=>Object.freeze(result);

export function parkingGuide(vehicle,speed,bays=PARKING_BAYS){
 if(!finitePose(vehicle)||!Number.isFinite(speed)||!Array.isArray(bays))return null;
 let nearest=null;
 for(let i=0;i<bays.length;i++){
  const bay=bays[i];if(!finitePose(bay)||typeof bay.label!=='string'||!bay.label)continue;
  const distance=Math.hypot(vehicle.x-bay.x,vehicle.z-bay.z),angle=alignedAngle(vehicle.angle,bay.angle),angleError=Math.abs(wrap(vehicle.angle-angle));
  if(!nearest||distance<nearest.distance||(distance===nearest.distance&&i<nearest.index))nearest={bay,index:i,distance,angle,angleError};
 }
 if(!nearest||nearest.distance>55)return null;
 const stopped=Math.abs(speed)<=1,close=nearest.distance<=2.5,aligned=nearest.angleError<=Math.PI/9;
 let key='approach',instruction='Follow the road to the marked bay';
 if(close&&!aligned){key='align';instruction='Straighten parallel with the bay';}
 else if(close&&!stopped){key='stop';instruction='Stop fully before parking';}
 else if(close){key='ready';instruction='Bay ready · F aligns and exits';}
 return freeze({key,label:nearest.bay.label,index:nearest.index,distance:nearest.distance,angleError:nearest.angleError,instruction,ready:key==='ready'});
}

export function parkingSnapPose(vehicle,speed,bays=PARKING_BAYS){
 const guide=parkingGuide(vehicle,speed,bays);if(!guide?.ready)return null;
 const bay=bays[guide.index];
 return freeze({x:bay.x,z:bay.z,angle:alignedAngle(vehicle.angle,bay.angle),label:bay.label,index:guide.index});
}

export function parkingGuideLine(guide){
 if(!guide)return 'PARKING · No marked storefront bay nearby';
 if(guide.ready)return 'PARKING · '+guide.label+' · BAY READY · F align / exit';
 return 'PARKING · '+guide.label+' · '+Math.round(guide.distance)+' m · '+guide.instruction;
}
