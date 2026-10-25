const valid=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.z);
// Existing world colliders include pedestrian clearance. Check the whole door
// route, not just its endpoints; bound the work even for malformed saved poses.
function clearRoute(a,b,blocked,floorHeight){
 if(!valid(a)||!valid(b))return false;
 const distance=Math.hypot(b.x-a.x,b.z-a.z);
 if(distance>8)return false;
 const steps=Math.max(1,Math.ceil(distance/.08)),ground=floorHeight(a.x,a.z);
 if(!Number.isFinite(ground))return false;
 for(let i=0;i<=steps;i++){
  const x=a.x+(b.x-a.x)*i/steps,z=a.z+(b.z-a.z)*i/steps,h=floorHeight(x,z);
  if(blocked(x,z)||!Number.isFinite(h)||Math.abs(h-ground)>.45)return false;
 }
 return true;
}
export function vehicleDoorAccess(vehicle,actor,blocked,floorHeight=()=>0){
 if(!valid(vehicle)||!Number.isFinite(vehicle.angle)||actor&&(!valid(actor)||!Number.isFinite(actor.y)))return null;
 const ground=floorHeight(vehicle.x,vehicle.z);
 if(!Number.isFinite(ground)||actor&&(Math.hypot(actor.x-vehicle.x,actor.z-vehicle.z)>5||Math.abs(actor.y-ground-1.72)>.8))return null;
 const doors=[-1,1].map(side=>({x:vehicle.x+Math.cos(vehicle.angle)*side*2,z:vehicle.z-Math.sin(vehicle.angle)*side*2,side}));
 if(actor)doors.sort((a,b)=>Math.hypot(actor.x-a.x,actor.z-a.z)-Math.hypot(actor.x-b.x,actor.z-b.z));
 return doors.find(door=>clearRoute(vehicle,door,blocked,floorHeight)&&(!actor||Math.hypot(actor.x-door.x,actor.z-door.z)<=2.5&&clearRoute(actor,door,blocked,floorHeight)))||null;
}
