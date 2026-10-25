const MAX_STEPS=64;

export function journeyProgress(completed,storedChapter=0){
 const flags=Array.isArray(completed)?completed.slice(0,MAX_STEPS).map(value=>value===true):[];
 const total=flags.length,firstOpen=flags.findIndex(value=>!value),chapter=firstOpen<0?total:firstOpen;
 const completedCount=flags.reduce((count,value)=>count+(value?1:0),0);
 const stored=Number.isSafeInteger(storedChapter)&&storedChapter>=0&&storedChapter<=total?storedChapter:0;
 return Object.freeze({total,completed:completedCount,chapter,next:chapter<total?chapter:null,complete:total>0&&chapter===total,changed:stored!==chapter,stored,flags:Object.freeze(flags)});
}

export function journeySummary(progress,titles=[]){
 if(!progress||!Number.isSafeInteger(progress.total)||!Number.isSafeInteger(progress.completed)||progress.total<1||progress.completed<0||progress.completed>progress.total)return Object.freeze({label:'Journey unavailable',next:'Return to the bay and reopen the notebook.'});
 const title=progress.next===null?null:typeof titles[progress.next]==='string'?titles[progress.next].trim():'';
 return Object.freeze({label:`${progress.completed} / ${progress.total} milestones`,next:progress.complete?'Every notebook milestone is complete. Keep building in the same save.':title?`Next: ${title}`:'Next milestone needs a valid notebook entry.'});
}
