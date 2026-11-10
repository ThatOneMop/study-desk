/* Little Lake catch-and-release surveys. Original Study Desk code, MIT. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.LakeResearch=factory()})(typeof globalThis==='undefined'?window:globalThis,()=>{
'use strict';
const MAX_RANK=5;
const local=(area,id)=>Array.from({length:6},(_,i)=>(area*6+i)%7000).includes(id);
function create(area=0){return {rank:0,area,tagged:[],complete:false}}
function restore(value,area=0){
 if(!value||!Number.isInteger(value.rank)||value.rank<0||value.rank>MAX_RANK||!Number.isInteger(value.area)||value.area<0||value.area>=8000000||!Array.isArray(value.tagged)||value.tagged.length>6||new Set(value.tagged).size!==value.tagged.length||!value.tagged.every(id=>Number.isInteger(id)&&local(value.area,id))||typeof value.complete!=='boolean')return create(area);
 const r={rank:value.rank,area:value.area,tagged:[...value.tagged],complete:value.complete};
 if((r.complete&&(r.rank<1||r.tagged.length<r.rank+1))||(!r.complete&&(r.rank>=MAX_RANK||r.tagged.length>=r.rank+2)))return create(area);
 return r;
}
function need(survey){return Math.min(6,survey.rank+(survey.complete?1:2))}
function canTag(survey,area,id){return !survey.complete&&survey.rank<MAX_RANK&&survey.area===area&&local(area,id)&&!survey.tagged.includes(id)}
function tag(survey,area,id){
 if(!canTag(survey,area,id))return {ok:false,reward:0};
 survey.tagged.push(id);let reward=0;
 if(survey.tagged.length>=need(survey)){survey.rank++;survey.complete=true;reward=Math.round(80*survey.rank*(1+Math.sqrt(survey.area)*.6))}
 return {ok:true,reward,complete:survey.complete};
}
function next(survey,area){
 if(!survey.complete||survey.rank>=MAX_RANK||!Number.isInteger(area)||area<0||area>=8000000)return false;
 survey.area=area;survey.tagged=[];survey.complete=false;return true;
}
return {MAX_RANK,create,restore,need,canTag,tag,next};
});
