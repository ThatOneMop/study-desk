// Direction-aware selection over already reachable interaction points.
// World/transaction access remains a separate authoritative check.
export function focusScore(point,actor,yaw){
 if(!point||!actor||![point.x,point.z,actor.x,actor.z,yaw].every(Number.isFinite))return Infinity;
 const dx=point.x-actor.x,dz=point.z-actor.z,distance=Math.hypot(dx,dz);if(distance>=3)return Infinity;
 if(distance<.45)return distance*.25;
 const alignment=(-Math.sin(yaw)*dx-Math.cos(yaw)*dz)/distance;
 if(alignment<.42)return Infinity;
 return Math.acos(Math.max(-1,Math.min(1,alignment)))*1.8+distance*.25;
}
export function chooseInteraction(points,actor,yaw,previous=null,eligible=()=>true){
 let winner=null,best=Infinity;
 for(const point of points){if(!eligible(point))continue;let score=focusScore(point,actor,yaw);if(point===previous)score-=.12;if(score<best){best=score;winner=point;}}
 return winner;
}
