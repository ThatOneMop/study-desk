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
