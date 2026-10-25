import {PROP_HALF_WIDTH,PROP_HALF_DEPTH} from './prop-motion.mjs?v=56';
// Union of unchanged procedural/exported canvas, zip rails and pot, with the
// existing .325 player radius. The +Z centre is deliberately an open entrance.
export const TENT_COLLISION=Object.freeze({sideInner:.775,sideOuter:1.525,backMin:-1.525,backMax:-.725,front:1.5575,potRadius:.925});
// Unpadded exported/procedural body envelope. Player collision above stays
// byte-for-byte unchanged; crates use their measured rectangular support under
// tent rotation instead of inheriting the .325 circular player convention.
export const TENT_BODY=Object.freeze({sideInner:1.1,sideOuter:1.2,backMin:-1.2,backMax:-1.05,front:1.2325,potRadius:.6});
// Original exported floor/roof undersides, plus a conservative head footprint.
// Lamp envelope also covers the wider procedural fallback, without moving art.
// These are height fields, not a climbable pot or a full 3D capsule simulation.
export const TENT_SUPPORT=Object.freeze({floor:.08,halfFloor:1.2,ceiling:2.255,halfRoof:1.4,lamp:2.0525,halfLampX:1.05,halfLampZ:.9});
export function tentFloorHeight(x,z,tx,tz,angle=0){
 if(!Number.isFinite(x)||!Number.isFinite(z)||!Number.isFinite(tx)||!Number.isFinite(tz)||!Number.isFinite(angle))return 0;
 const dx=x-tx,dz=z-tz;if(Math.abs(dx)>2||Math.abs(dz)>2)return 0;
 const c=Math.cos(angle),s=Math.sin(angle),b=TENT_SUPPORT;
 return Math.abs(c*dx-s*dz)<=b.halfFloor+1e-9&&Math.abs(s*dx+c*dz)<=b.halfFloor+1e-9?b.floor:0;
}
export function tentCeilingHeight(x,z,tx,tz,angle=0){
 if(!Number.isFinite(x)||!Number.isFinite(z)||!Number.isFinite(tx)||!Number.isFinite(tz)||!Number.isFinite(angle))return Infinity;
 const dx=x-tx,dz=z-tz;if(Math.abs(dx)>2||Math.abs(dz)>2)return Infinity;
 const c=Math.cos(angle),s=Math.sin(angle),lx=Math.abs(c*dx-s*dz),lz=Math.abs(s*dx+c*dz),b=TENT_SUPPORT;
 if(lx>b.halfRoof+1e-9||lz>b.halfRoof+1e-9)return Infinity;
 return lx<=b.halfLampX+1e-9&&lz<=b.halfLampZ+1e-9?b.lamp:b.ceiling;
}
export function tentPointBlocked(x,z,tx,tz,angle=0){
 if(!Number.isFinite(x)||!Number.isFinite(z)||!Number.isFinite(tx)||!Number.isFinite(tz)||!Number.isFinite(angle))return false;
 const dx=x-tx,dz=z-tz;if(Math.abs(dx)>2.5||Math.abs(dz)>2.5)return false;
 const c=Math.cos(angle),s=Math.sin(angle),lx=c*dx-s*dz,lz=s*dx+c*dz,a=Math.abs(lx),b=TENT_COLLISION;
 return a>b.sideInner&&a<b.sideOuter&&lz>b.backMin&&lz<b.front||a<b.sideOuter&&lz>b.backMin&&lz<b.backMax||lx*lx+lz*lz<b.potRadius*b.potRadius;
}
export function tentPropBlocked(x,z,tx,tz,angle=0){
 if(!Number.isFinite(x)||!Number.isFinite(z)||!Number.isFinite(tx)||!Number.isFinite(tz)||!Number.isFinite(angle))return false;
 const dx=x-tx,dz=z-tz;if(Math.abs(dx)>3||Math.abs(dz)>3)return false;
 const c=Math.cos(angle),s=Math.sin(angle),lx=c*dx-s*dz,lz=s*dx+c*dz,b=TENT_BODY;
 const padX=Math.abs(c)*PROP_HALF_WIDTH+Math.abs(s)*PROP_HALF_DEPTH,padZ=Math.abs(s)*PROP_HALF_WIDTH+Math.abs(c)*PROP_HALF_DEPTH,a=Math.abs(lx);
 const side=a>b.sideInner-padX&&a<b.sideOuter+padX&&lz>b.backMin-padZ&&lz<b.front+padZ;
 const back=a<b.sideOuter+padX&&lz>b.backMin-padZ&&lz<b.backMax+padZ;
 const potX=Math.max(0,a-padX),potZ=Math.max(0,Math.abs(lz)-padZ),pot=potX*potX+potZ*potZ<b.potRadius*b.potRadius;
 return side||back||pot;
}
// Workers/placement still conservatively avoid the whole footprint, but that
// footprint rotates too; a diagonal front approach must not fall inside an
// unrelated world-axis box. It encloses all padded canvas/zip/pot components.
export function tentFootprintBlocked(x,z,tx,tz,angle=0){
 if(!Number.isFinite(x)||!Number.isFinite(z)||!Number.isFinite(tx)||!Number.isFinite(tz)||!Number.isFinite(angle))return false;
 const dx=x-tx,dz=z-tz;if(Math.abs(dx)>2.5||Math.abs(dz)>2.5)return false;
 const c=Math.cos(angle),s=Math.sin(angle);
 return Math.abs(c*dx-s*dz)<TENT_COLLISION.front&&Math.abs(s*dx+c*dz)<TENT_COLLISION.front;
}
// Bounded solid bands for the crate, not an infinite ceiling plane. The union
// covers the original export and procedural fallback (.005 roof difference).
export const TENT_PROP_ROOF=Object.freeze({bottom:2.25,top:2.35});
export const TENT_PROP_LAMP=Object.freeze({bottom:2.0525,top:2.16});
const tentRoofBands=Object.freeze([TENT_PROP_ROOF]),tentLampBands=Object.freeze([TENT_PROP_LAMP]),tentBothBands=Object.freeze([TENT_PROP_ROOF,TENT_PROP_LAMP]),noTentBands=Object.freeze([]);
export function tentPropBands(x,z,tx,tz,angle=0){
 if(!Number.isFinite(x)||!Number.isFinite(z)||!Number.isFinite(tx)||!Number.isFinite(tz)||!Number.isFinite(angle))return noTentBands;
 const dx=x-tx,dz=z-tz;if(Math.abs(dx)>3||Math.abs(dz)>3)return noTentBands;
 const c=Math.cos(angle),s=Math.sin(angle),lx=Math.abs(c*dx-s*dz),lz=Math.abs(s*dx+c*dz),pad=PROP_HALF_WIDTH*(Math.abs(c)+Math.abs(s));
 const roof=lx<=1.2+pad+1e-9&&lz<=1.2+pad+1e-9,lamp=lx<=.85+pad+1e-9&&lz<=.7+pad+1e-9;
 return roof?(lamp?tentBothBands:tentRoofBands):lamp?tentLampBands:noTentBands;
}
