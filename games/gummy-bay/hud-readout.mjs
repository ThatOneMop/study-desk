// Presentation-only HUD readings. Police stages, heat, clock and map markers
// already exist. This module does not change suspicion, searches or saves.
// Armed status is read only when the simulation sets police.armed === true.

const DAYS=Object.freeze(['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']);
const SHORT=Object.freeze(['Mon','Tue','Wed','Thu','Fri','Sat','Sun']);
const CARDINALS=Object.freeze([[0,'N'],[45,'NE'],[90,'E'],[135,'SE'],[180,'S'],[225,'SW'],[270,'W'],[315,'NW']]);
const wrap=radians=>{let a=radians%(Math.PI*2);if(a>Math.PI)a-=Math.PI*2;if(a<-Math.PI)a+=Math.PI*2;return a;};
const finite=value=>Number.isFinite(value)?value:0;

export function weekdayClock(day,time){
 const safeDay=Number.isFinite(day)&&day>=1?Math.min(9999,Math.floor(day)):1;
 const minute=Number.isFinite(time)?Math.max(0,Math.min(1439,Math.floor(time))):0;
 const index=(safeDay-1)%7;
 const clock=String(Math.floor(minute/60)).padStart(2,'0')+':'+String(minute%60).padStart(2,'0');
 return Object.freeze({day:safeDay,weekday:DAYS[index],short:SHORT[index],clock,label:'Day '+safeDay+' · '+SHORT[index]+' '+clock});
}
export function compassView({yaw=0,x=0,z=0,markers=[]}={}){
 const facing=wrap(-finite(yaw));
 const facingDeg=(facing*180/Math.PI+360)%360;
 const points=(Array.isArray(markers)?markers:[]).filter(marker=>marker&&Number.isFinite(marker.x)&&Number.isFinite(marker.z)).slice(0,4).map(marker=>{
  const dx=marker.x-finite(x),dz=marker.z-finite(z);
  const relative=wrap(Math.atan2(dx,-dz)-facing)*180/Math.PI;
  return Object.freeze({id:String(marker.id||marker.label||'mark').slice(0,24),label:String(marker.label||'Objective').slice(0,42),icon:String(marker.icon||'●').slice(0,2),metres:Math.max(0,Math.round(Math.hypot(dx,dz))),offset:Math.round(relative)});
 });
 const cardinal=CARDINALS.reduce((best,entry)=>Math.abs(wrap((entry[0]-facingDeg)*Math.PI/180))<Math.abs(wrap((best[0]-facingDeg)*Math.PI/180))?entry:best,CARDINALS[0]);
 return Object.freeze({facingDeg:Math.round(facingDeg),cardinal:cardinal[1],markers:Object.freeze(points)});
}
export function policeBanner({heat=0,stage='clear',searchRemaining=null,armed=false,duration=4}={}){
 const remaining=Number.isFinite(searchRemaining)?Math.max(0,searchRemaining):null;
 const total=Number.isFinite(duration)&&duration>0?duration:4;
 if(stage==='search'||stage==='arrest')return Object.freeze({visible:true,id:'arrest',label:'UNDER ARREST',countdown:remaining===null?1:Math.max(0,Math.min(1,remaining/total))});
 if(stage==='pursuit')return Object.freeze({visible:true,id:armed===true?'armed':'wanted',label:armed===true?'WANTED - ARMED':'WANTED',countdown:null});
 if(stage==='stop'||stage==='watching'||(Number.isFinite(heat)&&heat>=40))return Object.freeze({visible:true,id:'called',label:'POLICE CALLED',countdown:null});
 return Object.freeze({visible:false,id:'clear',label:'',countdown:null});
}
export function phoneBadges(state={}){
 const threads=state&&typeof state.threads==='object'&&state.threads?state.threads:{};
 let unread=0;
 for(const thread of Object.values(threads)){const messages=thread&&Array.isArray(thread.messages)?thread.messages:[];const last=messages[messages.length-1];if(last&&last.mine===false)unread++;}
 return Object.freeze({phone:unread,deals:Array.isArray(state?.deals)?state.deals.length:0,listing:state?.listing?1:0,contacts:0,wallet:0,map:0});
}
export function curfewCue(day,time){
 const safeDay=Number.isFinite(day)&&day>=1?Math.floor(day):1;
 const minute=Number.isFinite(time)?time:0;
 if(minute>=1230&&minute<1232)return Object.freeze({id:'curfew',day:safeDay,text:'Curfew. Police pay closer attention after 20:30.'});
 if(safeDay>1&&minute>=240&&minute<242)return Object.freeze({id:'sleep',day:safeDay,text:'You should sleep. A bed at home takes you to morning.'});
 return null;
}
// The town drawing is tall enough to fill the modal. Keep the place rows in a
// region that sits under the drawing instead of below the fold.
export function revealTownPlaces(html){
 if(typeof html!=='string'||html.includes('class="town-places"'))return typeof html==='string'?html:'';
 const start=html.indexOf('<canvas id="townOverview"');
 if(start<0)return html;
 const end=html.indexOf('</canvas>',start);
 if(end<0)return html;
 const cut=end+'</canvas>'.length;
 return html.slice(0,cut)+'<div class="town-places" role="region" aria-label="Places on the map">'+html.slice(cut)+'</div>';
}
