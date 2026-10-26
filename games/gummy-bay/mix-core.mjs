// Effect mixing for fictional gummies. Numbers follow the public 0.4.6 mix rules.
// Names, colours and copy are original. This module does not draw or sell anything.
export const MAX_EFFECTS=8;
export const NEW_RECIPE_XP=80;
export const MAP_RADIUS=4;
export const EFFECT_DISC=0.4;
export const STATIONS=Object.freeze({
 mk1:Object.freeze({batch:10,minutesPerUnit:6}),
 mk2:Object.freeze({batch:20,minutesPerUnit:3})
});
export const MIX_STATION_TIER=2;

const effect=(id,name,tier,bonus,addictiveness)=>({id,name,tier,bonus,addictiveness});
export const EFFECTS=Object.freeze([
 effect('still','Still',1,.10,0),effect('sunny','Sunny',1,.18,.235),effect('keen','Keen',1,.16,.104),
 effect('peckish','Peckish',1,.12,.096),effect('wary','Wary',1,0,0),effect('breezy','Breezy',1,.14,.104),
 effect('pungent','Pungent',1,0,0),effect('hearty','Hearty',2,.28,.10),effect('woozy','Woozy',2,0,0),
 effect('zippy','Zippy',2,.22,.34),effect('zesty','Zesty',2,.20,0),effect('drowsy','Drowsy',2,.26,0),
 effect('quiet','Quiet',2,.24,.327),effect('bitter','Bitter',2,0,0),effect('spry','Spry',3,.32,.607),
 effect('smooth','Smooth',3,.30,0),effect('hazy','Hazy',3,.36,.10),effect('restless','Restless',3,0,.10),
 effect('jittery','Jittery',3,0,0),effect('slick','Slick',3,.34,.309),effect('peppery','Peppery',3,.38,.665),
 effect('bright','Bright',4,.40,.20),effect('luminous','Luminous',4,.48,.472),effect('brisk','Brisk',4,.42,.343),
 effect('scattered','Scattered',4,0,0),effect('curious','Curious',4,.44,.37),effect('thunder','Thunder',4,.46,.803),
 effect('buoyant','Buoyant',5,.54,.611),effect('looming','Looming',5,.56,.10),effect('sparking','Sparking',5,.50,.235),
 effect('volatile','Volatile',5,0,0),effect('lanky','Lanky',5,.52,.607),effect('tiny','Tiny',5,.60,.336),
 effect('shambling','Shambling',5,.58,.598)
].map(Object.freeze));
const EFFECT_INDEX=new Map(EFFECTS.map((item,index)=>[item.id,index]));

const FIRST=['Coastal','Harbor','Pier','Salt','Citrus','Golden','Velvet','Midnight'];
const SECOND=['Chew','Pop','Cluster','Drop','Twist','Gleam','Batch','Square'];

function ingredient(id,name,price,adds,unlockTier,transforms){
 return Object.freeze({id,name,price,adds,unlockTier,transforms:Object.freeze(transforms)});
}
export const INGREDIENTS=Object.freeze([
 ingredient('peel','Citrus peel',2,'zesty',0,{still:'quiet',keen:'jittery',wary:'brisk',pungent:'buoyant',woozy:'keen',zippy:'curious',bitter:'pungent',looming:'zippy',lanky:'breezy'}),
 ingredient('fizz','Bay fizz',2,'zippy',0,{sunny:'restless',peckish:'spry',zesty:'curious',quiet:'wary',bitter:'sunny',hazy:'looming',slick:'peckish'}),
 ingredient('glaze','Sugar glaze',3,'hearty',0,{keen:'sunny',peckish:'still',hearty:'volatile',smooth:'quiet',brisk:'zesty',buoyant:'slick',tiny:'zippy'}),
 ingredient('dust','Sour dust',3,'quiet',0,{still:'slick',keen:'zesty',peckish:'buoyant',wary:'smooth',zippy:'wary',bitter:'thunder',hazy:'still',peppery:'bright',luminous:'bitter',sparking:'spry'}),
 ingredient('spark','Violet spark',4,'thunder',7,{sunny:'bright',woozy:'bitter',spry:'quiet',restless:'still',tiny:'zesty'}),
 ingredient('rinse','Mint rinse',4,'smooth',8,{still:'buoyant',keen:'brisk',hearty:'quiet',volatile:'drowsy'}),
 ingredient('nightcap','Nightcap syrup',5,'drowsy',9,{still:'bright',sunny:'bitter',keen:'still',peckish:'slick',spry:'peckish',restless:'sunny',curious:'zesty',looming:'hazy',sparking:'breezy',tiny:'wary'}),
 ingredient('solvent','Bitter solvent',5,'bitter',10,{sunny:'peppery',peckish:'drowsy',wary:'still',woozy:'luminous',zippy:'sunny',zesty:'pungent',quiet:'thunder',restless:'hazy',brisk:'quiet',sparking:'woozy',tiny:'keen'}),
 ingredient('pulse','Pulse syrup',6,'spry',11,{sunny:'zippy',keen:'tiny',woozy:'sparking',drowsy:'peckish',hazy:'restless',peppery:'sunny',luminous:'woozy',scattered:'smooth',thunder:'quiet'}),
 ingredient('slicker','Slip gel',6,'slick',12,{sunny:'drowsy',peckish:'scattered',wary:'buoyant',zippy:'peckish',hazy:'bitter'}),
 ingredient('flake','Pepper flake',7,'peppery',14,{peckish:'bitter',quiet:'bright',spry:'sunny',restless:'lanky',buoyant:'thunder',tiny:'breezy'}),
 ingredient('bean','Cloud bean',7,'hazy',13,{still:'luminous',keen:'woozy',zippy:'looming',quiet:'still',spry:'restless',jittery:'keen',slick:'bitter',brisk:'wary',curious:'zippy',tiny:'sparking'}),
 ingredient('cell','Sour cell',8,'bright',15,{sunny:'shambling',peckish:'thunder',restless:'hearty',looming:'luminous',sparking:'sunny',tiny:'peckish'}),
 ingredient('crystal','Shore crystal',8,'brisk',16,{still:'smooth',sunny:'jittery',breezy:'curious',hearty:'zesty',bitter:'quiet',hazy:'wary'}),
 ingredient('tablet','Focus tablet',9,'curious',17,{drowsy:'zesty',hazy:'zippy',luminous:'breezy',volatile:'sunny',lanky:'sparking'}),
 ingredient('taffy','Pull taffy',9,'lanky',18,{zesty:'breezy',jittery:'zippy',curious:'sparking',buoyant:'still'})
]);

export function effectById(id){const index=EFFECT_INDEX.get(id);return index===undefined?null:EFFECTS[index];}
export function ingredientById(id){return INGREDIENTS.find(item=>item.id===id)||null;}
export function transformCount(){return INGREDIENTS.reduce((sum,item)=>sum+Object.keys(item.transforms).length,0);}

export function roundHalfEven(value){
 const floor=Math.floor(value),frac=value-floor;
 if(Math.abs(frac-.5)>1e-9)return Math.round(value);
 return floor%2===0?floor:floor+1;
}
export function productValue(base,effects){
 const bonus=(effects||[]).reduce((sum,id)=>sum+(effectById(id)?.bonus||0),0);
 return roundHalfEven(base*(1+bonus));
}
export function addictiveness(base,effects){
 const extra=(effects||[]).reduce((sum,id)=>sum+(effectById(id)?.addictiveness||0),0);
 return Math.min(1,base+extra);
}
export function recipeName(effects){
 const set=[...new Set(effects||[])].sort();
 let hash=2166136261;
 for(const id of set){for(const ch of id)hash=Math.imul(hash^ch.charCodeAt(0),16777619);hash=Math.imul(hash^124,16777619);}
 hash>>>=0;
 return FIRST[hash%FIRST.length]+' '+SECOND[(hash>>>8)%SECOND.length];
}
export function applyMix(effects,ingredientId){
 const ingredient=ingredientById(ingredientId);
 if(!ingredient)return (effects||[]).slice(0,MAX_EFFECTS);
 const product=(effects||[]).filter(id=>effectById(id)).slice(0,MAX_EFFECTS);
 for(let i=0;i<product.length;i++){
  const target=ingredient.transforms[product[i]];
  if(target&&effectById(target)&&!product.includes(target))product[i]=target;
 }
 if(product.length<MAX_EFFECTS&&!product.includes(ingredient.adds))product.push(ingredient.adds);
 return product;
}
export function batchMinutes(mark,units){
 const station=STATIONS[mark];
 if(!station)return 0;
 return station.minutesPerUnit*Math.min(Math.max(0,units||0),station.batch);
}
export function recipeXp(known){return known?0:NEW_RECIPE_XP;}
