'use strict';
// Read-only check: callers must fetch current main, then use expectedSha as the
// update_ref lease. This never changes catalogue files, refs or player saves.
function checkRelease({observedSha,expectedSha,currentIds,proposedIds,policy}){
 const errors=[];
 if(!observedSha||observedSha!==expectedSha)errors.push('Main changed: re-read source and rebuild the proposal.');
 const valid=a=>Array.isArray(a)&&a.every(x=>typeof x==='string'&&x.length)&&new Set(a).size===a.length;
 if(!valid(currentIds)||!valid(proposedIds))return {ok:false,errors:[...errors,'Catalogue IDs must be unique nonempty strings.']};
 if(!policy||!valid(policy.allowedIds))return {ok:false,errors:[...errors,'Missing current curation policy.']};
 const before=new Set(currentIds),after=new Set(proposedIds),allowed=new Set(policy.allowedIds);
 for(const id of before)if(!after.has(id))errors.push('Proposal removes concurrently kept game: '+id);
 for(const id of after)if(!allowed.has(id))errors.push('Outside current curated catalogue: '+id);
 for(const id of before)if(!allowed.has(id))errors.push('Main has newer curation than this policy: '+id);
 return {ok:errors.length===0,errors,added:proposedIds.filter(id=>!before.has(id)),expectedSha};
}
module.exports={checkRelease};
if(require.main===module){const fs=require('node:fs');try{const result=checkRelease(JSON.parse(fs.readFileSync(process.argv[2],'utf8')));console.log(JSON.stringify(result,null,2));if(!result.ok)process.exitCode=2}catch(e){console.error('Preflight input error: '+e.message);process.exitCode=2}}
