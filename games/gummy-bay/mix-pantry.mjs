// The full Coastway Servo pantry: the four starter flavourings plus eight risky
// newcomers. Names and copy are original and candy-themed. mix-core stays untouched;
// this module re-implements its transform rule for the wider pantry.
import {effectById,ingredientById,MAX_EFFECTS} from './mix-core.mjs';

const starter=(id,color,instability,risks=[],blurb='')=>{const item=ingredientById(id);return Object.freeze({id,name:item.name,price:item.price,adds:item.adds,unlockLevel:1,instability,risks:Object.freeze(risks),color,tag:'Steady',blurb,transforms:item.transforms,legacy:true});};
const fresh=(id,name,price,adds,unlockLevel,instability,risks,color,tag,blurb,transforms)=>Object.freeze({id,name,price,adds,unlockLevel,instability,risks:Object.freeze(risks),color,tag,blurb,transforms:Object.freeze(transforms),legacy:false});

// Mystery Jelly adds a different effect in every save. The label always reads ???
export const JELLY_POOL=Object.freeze(['tiny','buoyant','luminous','curious','hearty','bitter','pungent','woozy']);

export const PANTRY=Object.freeze([
 starter('peel',0xe3b662,.06,['jittery'],'Old reliable. A bright, tangy lift.'),
 starter('fizz',0xa8c36f,.10,['restless'],'Local soda syrup. Gives a gummy some pep.'),
 starter('glaze',0xe8d9b2,.12,['volatile'],'Thick sugar coat. Rarely goes wrong.'),
 starter('dust',0xb58bb6,.08,['wary'],'Puckers the face, calms the buzz.'),
 fresh('mallow','Stale marshmallow',1,'hearty',2,.50,['woozy','pungent'],0xf1e6d6,'Risky','Dirt cheap and a bit squashed. Smells… fine?',
  {still:'smooth',sunny:'woozy',breezy:'pungent',zippy:'drowsy',quiet:'hazy',zesty:'bitter',keen:'peckish',spry:'woozy',bright:'hazy',tiny:'hearty'}),
 fresh('dye','Knock-off food dye',2,'bright',2,.30,['bitter'],0xe2557a,'Wild card','Turns anything a premium colour. Tastes like a crayon sometimes.',
  {still:'bitter',sunny:'luminous',breezy:'curious',zippy:'slick',quiet:'scattered',zesty:'wary',hearty:'peppery',drowsy:'bitter',smooth:'bright'}),
 fresh('cough','Grandma’s mint drop',4,'drowsy',3,.06,[],0x9fd9c0,'Fixer','Calms a jittery batch right down. Grandma swears by them.',
  {jittery:'still',restless:'quiet',scattered:'smooth',volatile:'smooth',bitter:'breezy',zippy:'woozy',sunny:'breezy',zesty:'quiet',thunder:'hazy',sparking:'keen'}),
 fresh('jelly','Mystery jelly',3,'?',3,.60,['bitter','pungent','woozy'],0x8a6fd1,'???','Unlabelled jar from the back shelf. Nobody knows what is in it.',
  {still:'tiny',sunny:'woozy',breezy:'bitter',zippy:'curious',quiet:'pungent',zesty:'buoyant',hearty:'looming',smooth:'shambling'}),
 fresh('sherbet','Thunder sherbet',6,'thunder',4,.35,['volatile'],0xf2d64b,'Risky','Crackles on the tongue. Top-shelf value if the stir holds.',
  {still:'brisk',sunny:'jittery',breezy:'curious',zippy:'peppery',quiet:'volatile',zesty:'sparking',hearty:'spry',drowsy:'quiet',smooth:'bright'}),
 fresh('crackle','Crackle crystals',5,'sparking',5,.40,['volatile'],0x6ec3e8,'Risky','Tiny pops and sparks. Over-stir and the bowl fizzes everywhere.',
  {still:'spry',sunny:'bright',breezy:'zippy',zippy:'jittery',quiet:'restless',zesty:'volatile',hearty:'thunder',curious:'tiny'}),
 fresh('gloop','Glow gloop',8,'luminous',5,.25,['scattered'],0x9cf07a,'Premium','Glows faintly in the dark. So do the customers. Police notice at night.',
  {still:'looming',sunny:'shambling',breezy:'buoyant',zippy:'scattered',quiet:'bright',zesty:'hazy',drowsy:'curious',bitter:'smooth'}),
 fresh('rocket','Rocket rock candy',7,'zippy',6,.30,['jittery'],0xff8a4c,'Risky','Fizzing rock candy. Very moreish, sometimes very twitchy.',
  {still:'jittery',sunny:'spry',breezy:'sparking',zippy:'thunder',quiet:'lanky',zesty:'brisk',drowsy:'zippy',hazy:'looming'})
]);
export const LEGACY_SLOTS=4;
export function pantryItem(index){return PANTRY[index]||null;}
export function pantryIndex(id){return PANTRY.findIndex(item=>item.id===id);}

// Strain index layout. The original 6 x 4 block stays where old saves expect it;
// each newer ingredient appends one block of six so adding more never shifts stock.
export function mixedStrainIndex(base,ingredient,baseCount=6){
 if(!Number.isInteger(base)||!Number.isInteger(ingredient)||base<0||base>=baseCount||ingredient<0)return -1;
 if(ingredient<LEGACY_SLOTS)return baseCount+base*LEGACY_SLOTS+ingredient;
 return baseCount+baseCount*LEGACY_SLOTS+(ingredient-LEGACY_SLOTS)*baseCount+base;
}
export function mixedSlots(baseCount=6,count=PANTRY.length){
 const slots=[];
 for(let base=0;base<baseCount;base++)for(let ingredient=0;ingredient<Math.min(LEGACY_SLOTS,count);ingredient++)slots.push({base,ingredient});
 for(let ingredient=LEGACY_SLOTS;ingredient<count;ingredient++)for(let base=0;base<baseCount;base++)slots.push({base,ingredient});
 return slots.map(slot=>({...slot,index:mixedStrainIndex(slot.base,slot.ingredient,baseCount)}));
}

// The mix-core transform rule applied with a pantry item and a resolved added effect.
export function applyPantryMix(effects,item,adds=item?.adds){
 const product=(effects||[]).filter(id=>effectById(id)).slice(0,MAX_EFFECTS);
 if(!item)return product;
 for(let i=0;i<product.length;i++){
  const target=item.transforms[product[i]];
  if(target&&effectById(target)&&!product.includes(target))product[i]=target;
 }
 if(effectById(adds)&&product.length<MAX_EFFECTS&&!product.includes(adds))product.push(adds);
 return product;
}
