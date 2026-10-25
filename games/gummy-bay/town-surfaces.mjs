import {PROP_HALF_WIDTH,PROP_HALF_DEPTH} from './prop-motion.mjs?v=56';

const WORLD_MIN_Z=95-(178*171*10/560);
const surface=(id,x,z,w,d,top)=>Object.freeze({id,x,z,w,d,top});
const surfaces=[
 surface('old-south',0,-9,180,5,.105),
 surface('old-north',0,9,180,5,.105),
 surface('old-west',-9,0,5,145,.105),
 surface('old-east',9,0,5,145,.105),
 // Seven original boards span x -4.6..4.4; their .1 gaps are narrower
 // than the crate footprint, so the supported centre envelope is continuous.
 surface('pier',-.1,85,9,22,.09)
];
const roadXs=[-270,-105,0,105,270],roadZs=[-90,-160,-230,-300,-370,-435];
for(const x of roadXs){
 const from=x===0?-72:-7,to=WORLD_MIN_Z+4;
 for(const side of [-1,1])surfaces.push(surface('district-v-'+x+'-'+side,x+side*8.1,(from+to)/2,4,from-to,.085));
}
for(const z of roadZs)for(const side of [-1,1])surfaces.push(surface('district-h-'+z+'-'+side,0,z+side*8.1,555,4,.085));
for(const side of [-1,1])for(const z of [-8.1,8.1])surfaces.push(surface('coast-'+side+'-'+z,side*180,z,180,4,.085));

export const TOWN_PROP_SURFACES=Object.freeze(surfaces);
export function townPropFloorHeight(x,z){
 if(!Number.isFinite(x)||!Number.isFinite(z))return 0;
 let top=0;
 for(const r of TOWN_PROP_SURFACES)if(Math.abs(x-r.x)<=r.w/2+PROP_HALF_WIDTH+1e-9&&Math.abs(z-r.z)<=r.d/2+PROP_HALF_DEPTH+1e-9)top=Math.max(top,r.top);
 return top;
}
