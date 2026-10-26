// Rank curve. Each level costs a little more than the last, so the first two
// ranks come in a day or two and the top rank (510 XP) lands around day eight instead of day seven.
// Shared by the HUD, shops, deeds, fleet and the economy sim.
export const LEVEL_XP=Object.freeze([0,30,60,110,180,270,380,510]);
export const MAX_LEVEL=LEVEL_XP.length;
export function levelOf(xp){
 const n=Number.isFinite(xp)?Math.max(0,xp):0;
 let level=1;for(let i=1;i<LEVEL_XP.length;i++)if(n>=LEVEL_XP[i])level=i+1;
 return level;
}
// XP into the current level and the XP that level needs. At max rank the bar stays full.
export function levelProgress(xp){
 const n=Number.isFinite(xp)?Math.max(0,xp):0,level=levelOf(n);
 if(level>=MAX_LEVEL)return Object.freeze({level,into:0,need:0,ratio:1});
 const from=LEVEL_XP[level-1],to=LEVEL_XP[level];
 return Object.freeze({level,into:Math.floor(n-from),need:to-from,ratio:Math.max(0,Math.min(1,(n-from)/(to-from)))});
}

// v156 street ranks: eleven original candy titles, five tiers each (I-V), like a crime-sim
// rank ladder. Cosmetic and motivational only: unlocks still follow levelOf() above.
// Tier costs grow per title; past Gummy Kingpin V the tiers keep counting (Gummy Kingpin 6, 7, ...).
export const RANK_TITLES=Object.freeze(['Sugar Rat','Chew Peddler','Wrapper Runner','Gum Hustler','Jar Boss','Sweet Talker','Candy Shot-Caller','Block Bonbon','Taffy Tycoon','Bay Baron','Gummy Kingpin']);
export const TIER_XP=Object.freeze([10,20,31,41,51,62,72,84,94,104,115]);
const ROMAN=['I','II','III','IV','V'];
export function rankTitle(xp){
 let left=Number.isFinite(xp)?Math.max(0,xp):0,index=0;
 const last=RANK_TITLES.length*5-1;
 while(true){
  const title=Math.min(RANK_TITLES.length-1,Math.floor(index/5)),need=TIER_XP[title];
  if(left<need){
   const tier=index>last?5+(index-last):index%5+1;
   const name=RANK_TITLES[title];
   return Object.freeze({index,title:name,tier,label:name+' '+(tier<=5?ROMAN[tier-1]:tier),into:Math.floor(left),need,ratio:Math.max(0,Math.min(1,left/need))});
  }
  left-=need;index++;
 }
}
