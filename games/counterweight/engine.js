(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.Counterweight=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const TYPES={beam:{name:'Steel frame',weight:3,strength:8,tolerance:3,color:'#c6b783'},motor:{name:'Pump motor',weight:4,strength:5,tolerance:2,color:'#e89352'},glass:{name:'Glass lantern',weight:1,strength:0,tolerance:0,color:'#7dcbd1'},crate:{name:'Supply crate',weight:2,strength:4,tolerance:2,color:'#9eb17a'}};
const make=(type,bays)=>({type,bays});
const JOBS=[
 {name:'First light',subtitle:'Learn the balance of a little harbour.',wind:0,par:22,cargo:[make('crate',[-2]),make('glass',[2])]},
 {name:'Heavy company',subtitle:'Frames below. Lanterns above.',wind:0,par:48,cargo:[make('beam',[-2]),make('beam',[2]),make('glass',[-2]),make('glass',[2])]},
 {name:'The long reach',subtitle:'Four bays, and a breeze from the west.',wind:1,par:58,cargo:[make('motor',[-2]),make('crate',[3]),make('glass',[-3]),make('glass',[2])]},
 {name:'Fragile skyline',subtitle:'Build two towers without crushing their lights.',wind:-1,par:65,cargo:[make('beam',[-2,2]),make('crate',[-2,2]),make('motor',[-2,2]),make('glass',[-2]),make('glass',[2])]},
 {name:'Last boat home',subtitle:'Six loads. A headwind. Make every lift count.',wind:2,par:80,cargo:[make('beam',[-2]),make('beam',[2]),make('motor',[-2]),make('crate',[2]),make('glass',[-2]),make('glass',[2])]}
];
const ACTIONS=['left','right','up','down','ballastLeft','ballastRight','settle','hook','rig'];
const copy=x=>JSON.parse(JSON.stringify(x));
const integer=(x,a,b)=>Number.isInteger(x)&&x>=a&&x<=b;
function create(job=0){if(!integer(job,0,JOBS.length-1))throw Error('Unknown job');return {job,x:0,y:0,ballast:0,sway:0,held:null,next:0,cradles:2,rigged:false,stacks:{'-3':[],'-2':[],'2':[],'3':[]},moves:0,damage:0,strain:0,status:'playing',message:'Hook the first load at the supply dock.',history:[]};}
function cargo(s){if(s.held===null)return null;const c=TYPES[JOBS[s.job].cargo[s.held].type];return s.rigged?{...c,weight:c.weight+1,tolerance:c.tolerance+3}:c;}
function torque(s){return cargo(s)?cargo(s).weight*s.x+3*s.ballast+JOBS[s.job].wind:s.ballast+JOBS[s.job].wind;}
function height(s,x=s.x){return (s.stacks[x]||[]).length;}
function support(s,x,weight){const pile=s.stacks[x];if(!pile)return false;let load=weight;for(let i=pile.length-1;i>=0;i--){const c=TYPES[JOBS[s.job].cargo[pile[i]].type];if(load>c.strength)return false;load+=c.weight;}return true;}
function medal(s){return s.status!=='won'?0:1+(s.damage===0&&s.strain===0?1:0)+(s.damage===0&&s.strain===0&&s.moves<=JOBS[s.job].par?1:0);}
function step(state,action){
 const s=copy(state);if(s.status!=='playing')return {ok:false,state:s,reason:'This job is over. Undo or restart to try again.'};
 if(!ACTIONS.includes(action))return {ok:false,state:s,reason:'Unknown control.'};
 const reject=reason=>({ok:false,state:copy(state),reason});let message='';
 if(action==='rig'){
  if(s.held!==null||s.x!==0||s.y!==0)return reject('Fit or remove a cradle at the dock with an empty hook.');
  if(!s.rigged&&s.cradles===0)return reject('Both padded cradles have been used.');
  s.rigged=!s.rigged;message=s.rigged?'Cradle ready: next lift weighs one tonne more and tolerates three extra swing. One cradle is spent when hooked.':'Cradle removed before pickup; no supply spent.';
 }else if(action==='left'||action==='right'){
  const x=s.x+(action==='left'?-1:1);if(x< -3||x>3)return reject('End of the crane rail.');
  if(s.held!==null&&s.y===0)return reject('Lift the cargo clear of the dock first.');
  if(s.y<height(s,x)+(s.held===null?0:1))return reject('Raise the load above the neighbouring stack first.');
  s.x=x;s.sway=Math.min(6,s.sway+(s.held===null?0:2));message='Trolley moved. Ballast and swing matter before lowering.';
 }else if(action==='up'){
  if(s.y===4)return reject('Hoist is at the top.');s.y++;s.sway=Math.max(0,s.sway-1);message='Load raised.';
 }else if(action==='down'){
  const floor=height(s);if(s.y<=floor)return reject('Hook is already at the landing height.');s.y--;s.sway=Math.max(0,s.sway-1);message='Lowered one level.';
 }else if(action==='ballastLeft'||action==='ballastRight'){
  const b=s.ballast+(action==='ballastLeft'?-1:1);if(b< -4||b>4)return reject('Ballast is at the end of its track.');s.ballast=b;s.sway=Math.max(0,s.sway-1);message='Counterweight shifted.';
 }else if(action==='settle'){
  s.sway=Math.max(0,s.sway-2);message='Cable steadied.';
 }else if(s.held===null){
  if(s.x!==0||s.y!==0)return reject('Return the empty hook to the supply dock at centre, level 0.');
  if(s.next>=JOBS[s.job].cargo.length)return reject('No cargo remains.');s.held=s.next;if(s.rigged)s.cradles--;s.sway=0;message=s.rigged?'Cradled cargo secured. Extra weight affects balance until delivery.':'Cargo secured. Raise it before moving.';
 }else{
  const c=cargo(s),spec=JOBS[s.job].cargo[s.held];
  if(!spec.bays.includes(s.x))return reject('This cargo belongs in '+spec.bays.map(x=>x<0?'L'+(-x):'R'+x).join(' or ')+'.');
  if(s.y!==height(s))return reject('Lower until the cargo rests on its marked landing level.');
  if(!support(s,s.x,TYPES[spec.type].weight))return reject('That stack cannot support this weight. Choose another marked bay or undo a placement.');
  if(s.sway>c.tolerance){s.damage++;message='Rough landing: cargo damaged. Steady the cable before releasing.';}else message='Soft landing. Cargo delivered.';
  s.stacks[s.x].push(s.held);s.held=null;s.rigged=false;s.next++;s.sway=0;
 }
 const t=Math.abs(torque(s));if(t>5){s.strain++;message='Balance exceeded ±5: crane strained. Shift ballast to match the load.';}
 s.moves++;s.history.push(action);
 if(s.moves>=600){s.status='lost';message='Shift action limit reached. Undo or restart for a shorter route.';}
 else if(s.strain>=3){s.status='lost';message='Crane stopped after three overloads. Undo the unsafe move or restart.';}
 else if(s.next===JOBS[s.job].cargo.length&&s.held===null){s.status='won';message='Manifest complete. Every load has a home.';}
 s.message=message;return {ok:true,state:s,reason:message};
}
function replay(job,actions){if(!Array.isArray(actions)||actions.length>600||actions.some(a=>!ACTIONS.includes(a)))throw Error('Invalid actions');let s=create(job);for(const a of actions){const r=step(s,a);if(!r.ok)throw Error('Invalid replay');s=r.state;}return s;}
function undo(s){return s.history.length?replay(s.job,s.history.slice(0,-1)):create(s.job);}
function blank(){return {version:2,current:{job:0,actions:[]},records:[null,null,null,null,null]};}
function decode(raw){const v=typeof raw==='string'?JSON.parse(raw):raw;if(!v||![1,2].includes(v.version)||!Array.isArray(v.records)||v.records.length!==5||!v.current)throw Error('Unreadable save');
 const migrate=actions=>v.version===1&&Array.isArray(actions)?actions.map(a=>a==='ballastLeft'?'ballastRight':a==='ballastRight'?'ballastLeft':a):actions;
 const records=v.records.map((r,i)=>{if(r===null)return null;if(!r||!Array.isArray(r.actions))throw Error('Invalid record');const s=replay(i,migrate(r.actions));if(s.status!=='won')throw Error('Incomplete record');return {actions:s.history,medals:medal(s),moves:s.moves};});
 let unlocked=0;while(unlocked<4&&records[unlocked])unlocked++;const current=replay(v.current.job,migrate(v.current.actions));if(current.job>unlocked)throw Error('Locked job');return {version:2,current:{job:current.job,actions:current.history},records};
}
function unlocked(save){let n=0;while(n<4&&save.records[n])n++;return n;}
function record(save,s){const v=copy(save);v.current={job:s.job,actions:s.history};if(s.status==='won'){const old=v.records[s.job],m=medal(s);if(!old||m>old.medals||(m===old.medals&&s.moves<old.moves))v.records[s.job]={actions:s.history,medals:m,moves:s.moves};}return v;}
function forecast(s,a){const r=step(s,a);return {allowed:r.ok,balance:torque(r.state),sway:r.state.sway,overload:r.state.strain-s.strain,damage:r.state.damage-s.damage,status:r.state.status,reason:r.reason};}
return {forecast,TYPES,JOBS,ACTIONS,create,step,torque,cargo,height,support,medal,replay,undo,blank,decode,unlocked,record};
});
