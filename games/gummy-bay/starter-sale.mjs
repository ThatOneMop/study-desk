// Day 1 starter sale. Four packed Pine Pops, then one agreed text from Jules.
export const STARTER_PACKS=4;
export const STARTER_NPC=0;
export const STARTER_PRODUCT=0;
export const STARTER_QTY=2;
export const STARTER_PRICE=30;
export const STARTER_DELAY=20;
export const STARTER_TEXT='Gramps said the RV still had Pine Pops. I\'ll take 2 at $30 each. Meet me at my usual spot.';

function stocked(v){
 return ['packs','gummies','raw','storedPacks'].some(key=>Array.isArray(v?.[key])&&v[key].some(n=>n>0));
}
export function starterUntouched(v){
 return !!v&&!v.starterBatch&&!v.sold&&!v.made&&!v.harvested&&!v.mixed&&!stocked(v);
}
export function grantStarter(v){
 if(starterUntouched(v)){v.packs??=[];v.packs[0]=(v.packs[0]||0)+STARTER_PACKS;}
 v.starterBatch=true;
 if(v.starterOffer!==true)v.starterOffer=false;
 return v;
}
export function starterOfferDue(v,waited){
 if(!v||v.starterOffer||v.sold>0)return false;
 if((v.packs?.[STARTER_PRODUCT]||0)<STARTER_QTY)return false;
 if((v.deals||[]).some(deal=>deal.npc===STARTER_NPC))return false;
 return waited>=STARTER_DELAY;
}
