import {TRAVEL_DISTRICTS} from './town-experience.mjs?v=60';

const freezePalette=palette=>Object.freeze({...palette});
const palettes=Object.freeze({
 'Old Town':freezePalette({key:'old-town',wall:0xb9aa8e,upper:0xc9c1a8,trim:0x676f62,roof:0x59645c,door:0x456269,awning:0xc18466}),
 Westside:freezePalette({key:'westside',wall:0xa9896e,upper:0xc0aa8d,trim:0x686d58,roof:0x5b6258,door:0x526d68,awning:0xc48a62}),
 'East Market':freezePalette({key:'east-market',wall:0x8fa087,upper:0xb6bea0,trim:0xd4c7a6,roof:0x58675e,door:0x526a64,awning:0xc7a05f}),
 'North Heights':freezePalette({key:'north-heights',wall:0x8c939e,upper:0xadb2b5,trim:0xd2c5a8,roof:0x555e63,door:0x4f656b,awning:0xa97261}),
 'East Coast':freezePalette({key:'east-coast',wall:0x86a0a0,upper:0xacc0ba,trim:0xd9ccae,roof:0x526665,door:0x4d6c72,awning:0xc38b70}),
 'West Harbor':freezePalette({key:'west-harbor',wall:0x9d8072,upper:0xb99d89,trim:0xd0bea0,roof:0x5d625d,door:0x4d6964,awning:0xc47a5f}),
 Northgate:freezePalette({key:'northgate',wall:0x87947d,upper:0xaeb69b,trim:0xd0c7a8,roof:0x535f57,door:0x4e6860,awning:0xbf9862})
});

export const TOWN_NEUTRALS=freezePalette({
 foundation:0x777565,hardscapeA:0xb1aa91,hardscapeB:0xa7a18a,curb:0xaaa58f,
 streetMetal:0x59675f,darkMetal:0x53615c,wood:0x87745b,soil:0x4f493b
});

export const TOWN_ACCENTS=freezePalette({
 crossing:0xe8e2c7,tactile:0xd2b45f,parking:0xd4e1d9,service:0x6e8b83,
 emergency:0xcf7659,wayfinding:0x3f717a
});

export const TOWN_DISTRICT_PALETTES=Object.freeze(TRAVEL_DISTRICTS.map(district=>Object.freeze({
 district:district.name,x:district.x,z:district.z,palette:palettes[district.name]
})));

const finite=n=>Number.isFinite(n);
export function townDistrictPalette(x,z){
 if(!finite(x)||!finite(z))return TOWN_DISTRICT_PALETTES[0];
 return TOWN_DISTRICT_PALETTES.reduce((best,entry)=>Math.hypot(x-entry.x,z-entry.z)<Math.hypot(x-best.x,z-best.z)?entry:best,TOWN_DISTRICT_PALETTES[0]);
}

export function townRoleColor(role){
 return Object.prototype.hasOwnProperty.call(TOWN_ACCENTS,role)?TOWN_ACCENTS[role]:Object.prototype.hasOwnProperty.call(TOWN_NEUTRALS,role)?TOWN_NEUTRALS[role]:null;
}

function rgb(hex){return [(hex>>16&255)/255,(hex>>8&255)/255,(hex&255)/255];}
export function townColorDistance(a,b){
 if(!Number.isInteger(a)||!Number.isInteger(b)||a<0||a>0xffffff||b<0||b>0xffffff)return null;
 const aa=rgb(a),bb=rgb(b);return Math.hypot(aa[0]-bb[0],aa[1]-bb[1],aa[2]-bb[2]);
}

export function townRelativeLuminance(color){
 if(!Number.isInteger(color)||color<0||color>0xffffff)return null;
 return rgb(color).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4).reduce((sum,c,index)=>sum+c*[.2126,.7152,.0722][index],0);
}

export function townContrastRatio(a,b){
 const aa=townRelativeLuminance(a),bb=townRelativeLuminance(b);if(aa===null||bb===null)return null;
 return (Math.max(aa,bb)+.05)/(Math.min(aa,bb)+.05);
}
