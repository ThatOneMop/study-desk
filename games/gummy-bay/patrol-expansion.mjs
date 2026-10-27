export const EXTRA_PATROL_ROUTES=Object.freeze([
 // v166: the Old Town beats bend round the new winding lanes (winding-lanes.mjs); the east beat walks Gutter Lane.
 [[-11,-10],[-75,-10],[-75,-40],[-11,-40]],
 [[11,8],[75,8],[75,-40],[72,-56],[57,-61],[44,-64],[33,-59],[22,-53.5],[11,-55]],
 [[-105,-230],[-270,-230],[-270,-370],[-105,-370]],
 [[105,-160],[270,-160],[270,-435],[105,-435]]
]);
export function expandPoliceRoster(police,routes,{guest=false}={}){
 if(guest||!police||!Array.isArray(police.officers))return police;
 for(let i=police.officers.length;i<routes.length;i++){const r=routes[i];police.officers.push({x:r[0][0],z:r[0][1],angle:0,waypoint:1,mode:'patrol',suspicion:0,lost:0,target:null,lastX:r[0][0],lastZ:r[0][1]});}
 return police;
}
