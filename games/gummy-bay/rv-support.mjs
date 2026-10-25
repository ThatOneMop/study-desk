import {PROP_HALF_WIDTH,PROP_HALF_DEPTH} from './prop-motion.mjs?v=56';
// Runtime support for the original exported RV. No mesh or collision edits.
// Floor/roof heights are checked against the actual GLB by scale-audit.mjs.
// Extend the head guard just outside the bevelled roof edge (-55.85).
export const RV_SUPPORT=Object.freeze({floor:.94,ceiling:3.02,minX:-60,maxX:-55.4,minZ:21.7,maxZ:30.2,roofMaxX:-55.75,rampEndX:-53.5,doorZ:27,halfDoor:.85});
export function rvFloorHeight(x,z){
 if(!Number.isFinite(x)||!Number.isFinite(z))return 0;
 const r=RV_SUPPORT;
 if(x>r.minX&&x<r.maxX&&z>r.minZ&&z<r.maxZ)return r.floor;
 if(x>=r.maxX&&x<r.rampEndX&&Math.abs(z-r.doorZ)<r.halfDoor)return r.floor*(r.rampEndX-x)/(r.rampEndX-r.maxX);
 return 0;
}
export function rvCeilingHeight(x,z){
 const r=RV_SUPPORT;
 return Number.isFinite(x)&&Number.isFinite(z)&&x>r.minX&&x<r.roofMaxX&&z>r.minZ&&z<r.maxZ?r.ceiling:Infinity;
}
// Separate finite bands preserve the open roof around the original rooftop
// vent. Bounds come from the exported GLB triangles, padded by the measured
// world-axis crate extents rather than turning the whole roof into a tall slab.
export const RV_PROP_ROOF=Object.freeze({bottom:3.02,top:3.24,minX:-60.15-PROP_HALF_WIDTH,maxX:-55.85+PROP_HALF_WIDTH,minZ:21.7-PROP_HALF_DEPTH,maxZ:30.3+PROP_HALF_DEPTH});
export const RV_PROP_VENT=Object.freeze({bottom:3.24,top:3.58,minX:-58.75-PROP_HALF_WIDTH,maxX:-57.25+PROP_HALF_WIDTH,minZ:23.45-PROP_HALF_DEPTH,maxZ:25.15+PROP_HALF_DEPTH});
const rvRoofBands=Object.freeze([RV_PROP_ROOF]),rvVentBands=Object.freeze([RV_PROP_ROOF,RV_PROP_VENT]),noRVBands=Object.freeze([]);
export function rvPropBands(x,z){
 if(!Number.isFinite(x)||!Number.isFinite(z))return noRVBands;
 const roof=RV_PROP_ROOF,vent=RV_PROP_VENT;
 if(x<roof.minX||x>roof.maxX||z<roof.minZ||z>roof.maxZ)return noRVBands;
 return x>=vent.minX&&x<=vent.maxX&&z>=vent.minZ&&z<=vent.maxZ?rvVentBands:rvRoofBands;
}
