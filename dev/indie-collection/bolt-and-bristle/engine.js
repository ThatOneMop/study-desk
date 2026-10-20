/* Bolt & Bristle: original repair rules; all art and boards created for Study Desk. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.BoltBristle=factory()})(globalThis,()=>{
'use strict';
const W=6,H=4,dirs=[[-1,0,1,4],[0,-1,2,8],[1,0,4,1],[0,1,8,2]];
const jobs=[
 {name:'The midnight radio',owner:'Mara, the night gardener',story:'It used to keep the greenhouse company. Find its voice again.',color:'#f2b660',path:[6,7,8,9,10,11]},
 {name:'A pocket of summer',owner:'Ivo, the seed keeper',story:'A little desk fan for the hottest corner of the seed library.',color:'#80c9bb',path:[0,1,7,8,14,15,9,10,11]},
 {name:'The rain collector',owner:'Sol, the rooftop farmer',story:'This pump has one more rainy season in it.',color:'#a2b9ee',path:[12,13,7,8,2,3,9,15,16,17]},
 {name:'A light for late arrivals',owner:'Nell, the harbour keeper',story:'The harbour lamp should welcome every boat home.',color:'#ef947d',path:[18,19,13,7,8,14,15,9,3,4,10,16,22,23]},
 {name:'The wandering song',owner:'Pip, the travelling musician',story:'A music box that has crossed three seas. Listen for the click.',color:'#cbb0e9',path:[0,6,12,13,14,8,2,3,4,10,9,15,21,22,16,17]},
 {name:'The moth hotel',owner:'Ada, the lamp maker',story:'One warm window for a hundred small travellers.',color:'#c5d980',path:[18,12,6,0,1,7,13,19,20,14,8,2,3,9,15,21,22,16,10,4,5]}
];
const copy=x=>JSON.parse(JSON.stringify(x)),int=(n,a,b)=>Number.isSafeInteger(n)&&n>=a&&n<=b;
const blank=()=>({coins:0,best:Array(jobs.length).fill(0),upgrades:{brush:0,torque:0}});
function edge(a,b){const d=b-a;return d===1?4:d===-1?1:d===W?8:2}
function layout(index){const p=jobs[index].path,base=Array.from({length:W*H},(_,i)=>[5,10,3,12][(i+index)%4]);for(let k=0;k<p.length;k++)base[p[k]]=(k?edge(p[k],p[k-1]):1)|(k===p.length-1?4:edge(p[k],p[k+1]));return base}
function mask(base,rot){for(let k=0;k<rot;k++)base=((base<<1)&14)|(base>>3);return base}
function start(index,p){return{index,status:'repair',tiles:layout(index).map((_,i)=>({dirt:1+(i+index)%2,rust:(i*7+index)%4===0?1:0,bolt:(i+index)%3===0?2:0,rot:(i*5+index+1)%4})),actions:0,tests:0,reward:0,stars:0,checkpoint:copy(p),message:'Start with the brush. Clean plates conduct; seized screws stop them turning.'}}
const create=()=>{const profile=blank();return{profile,job:start(0,profile)}};
function circuit(s){const base=layout(s.index),seen=new Set(),p=jobs[s.index].path,start=p[0],end=p.at(-1),clean=i=>s.tiles[i].dirt===0&&s.tiles[i].rust===0,ports=i=>mask(base[i],s.tiles[i].rot);if(clean(start)&&(ports(start)&1))seen.add(start);const queue=[...seen];for(let n=0;n<queue.length;n++){const i=queue[n],x=i%W,y=Math.floor(i/W);for(const [dx,dy,out,back]of dirs){const nx=x+dx,ny=y+dy,j=ny*W+nx;if(nx<0||nx>=W||ny<0||ny>=H||seen.has(j)||!clean(j))continue;if((ports(i)&out)&&(ports(j)&back)){seen.add(j);queue.push(j)}}}return{powered:[...seen],connected:seen.has(end)&&!!(ports(end)&4)}}
function progress(s){return Math.round(100*s.tiles.reduce((n,t)=>n+(t.dirt===0&&t.rust===0?1:0),0)/s.tiles.length)}
function act(o,tool,i){const s=o.job,p=o.profile;if(s.status!=='repair'||!int(i,0,W*H-1))return false;const t=s.tiles[i];let changed=false;
 if(tool==='brush'&&t.dirt){t.dirt=Math.max(0,t.dirt-1-p.upgrades.brush);changed=true;s.message='Dust lifted. Copper is appearing beneath it.'}
 if(tool==='solvent'&&!t.dirt&&t.rust){t.rust=0;changed=true;s.message='Rust dissolved. The plate can conduct again.'}
 if(tool==='spanner'&&!t.dirt&&!t.rust&&t.bolt){t.bolt=Math.max(0,t.bolt-1-p.upgrades.torque);changed=true;s.message=t.bolt?'A little looser. One more turn.':'Screw freed. This plate can now rotate.'}
 if(tool==='turn'&&!t.dirt&&!t.rust&&!t.bolt){t.rot=(t.rot+1)%4;changed=true;s.message='Plate turned clockwise. Join the copper from IN to OUT.'}
 if(changed)s.actions++;else s.message=t.dirt?'Brush away the dust first.':t.rust?'Use solvent on the rust.':tool==='turn'&&t.bolt?'Free the screw with the spanner first.':'This tool has nothing to do here.';return changed;
}
function test(o){const s=o.job;if(s.status!=='repair')return false;s.tests++;const result=circuit(s);if(!result.connected){s.message=result.powered.length?'Not quite. Follow the copper from IN; every joining port must face its neighbour.':'No power at IN. Clean the entry plate and turn its copper toward the left edge.';return false}s.status='complete';s.stars=progress(s)===100?3:progress(s)>=75?2:1;s.reward=Math.max(0,s.stars-o.profile.best[s.index])*6;o.profile.coins+=s.reward;o.profile.best[s.index]=Math.max(o.profile.best[s.index],s.stars);s.message=`It lives! ${s.stars}/3 restoration stars. ${s.reward} new workshop coins. ${s.stars<3?'Replay for a cleaner restoration; your best result is safe.':'A whole little machine, saved.'}`;return true}
// Interpolate skipped grid cells during quick pointer strokes; never wrap an edge.
function stroke(from,to){if(!int(from,0,23)||!int(to,0,23))return[];const x=from%W,y=Math.floor(from/W),dx=to%W-x,dy=Math.floor(to/W)-y,steps=Math.max(Math.abs(dx),Math.abs(dy)),out=[];for(let n=1;n<=steps;n++){const i=Math.round(y+dy*n/steps)*W+Math.round(x+dx*n/steps);if(out.at(-1)!==i)out.push(i)}return out}
function inspect(s,i){if(!int(i,0,23))return null;const t=s.tiles[i],ports=mask(layout(s.index)[i],t.rot),names=['left','up','right','down'].filter((_,n)=>ports&(1<<n));return{ports:names,need:t.dirt?'Brush dust':t.rust?'Dissolve rust with solvent':t.bolt?'Free the screw with the spanner':'Turn the copper clockwise',powered:circuit(s).powered.includes(i)}}
const costs={brush:18,torque:18};
function canContinue(o){return o.job.status==='complete'&&o.job.stars<3}
function continueRepair(o){if(!canContinue(o))return false;const s=o.job;s.checkpoint=copy(o.profile);s.status='repair';s.reward=0;s.stars=0;s.message='Working circuit preserved. Earlier stars and coins are safe; clean the remaining plates, then test again for only the improvement.';return true}
// Diagnose live-copper boundaries, never reveal a precomputed solution route.
function diagnose(s){const base=layout(s.index),power=circuit(s),entry=jobs[s.index].path[0],ports=i=>mask(base[i],s.tiles[i].rot),need=i=>s.tiles[i].dirt?'Brush dust':s.tiles[i].rust?'Dissolve rust':s.tiles[i].bolt?'Free screw, then turn copper':'Turn copper';if(power.connected)return[];if(!power.powered.length)return[{cell:entry,from:-1,reason:s.tiles[entry].dirt?'Brush entry dust':s.tiles[entry].rust?'Dissolve entry rust':s.tiles[entry].bolt?'Free entry screw, then face copper left':'Face entry copper left'}];const out=[];for(const i of power.powered){const x=i%W,y=Math.floor(i/W);for(const [dx,dy,port,back]of dirs){const nx=x+dx,ny=y+dy,j=ny*W+nx;if(nx<0||nx>=W||ny<0||ny>=H||!(ports(i)&port)||power.powered.includes(j)||out.some(v=>v.cell===j))continue;out.push({cell:j,from:i,reason:need(j)+(s.tiles[j].dirt||s.tiles[j].rust?' to carry current from plate '+(i+1):' to face plate '+(i+1))})}}return out.length?out:[{cell:power.powered.at(-1),from:-1,reason:'Live copper has no outgoing route. Turn a live plate toward an adjoining clean plate.'}]}
function upgrade(o,key){if(o.job.status!=='complete'||!Object.hasOwn(costs,key)||o.profile.upgrades[key]||o.profile.coins<costs[key])return false;o.profile.coins-=costs[key];o.profile.upgrades[key]=1;o.job.message='Tool upgraded. It works immediately on your next repair.';return true}
function next(o,index=o.job.index+1){if(o.job.status!=='complete'||!int(index,0,jobs.length-1)||index>0&&!o.profile.best[index-1])return false;o.job=start(index,o.profile);return true}
function retry(o){if(o.job.status!=='complete')o.profile=copy(o.job.checkpoint);o.job=start(o.job.index,o.profile)}
const encode=o=>JSON.stringify({version:1,profile:o.profile,job:o.job});
function validProfile(p){return p&&int(p.coins,0,1000)&&Array.isArray(p.best)&&p.best.length===jobs.length&&p.best.every(n=>int(n,0,3))&&p.best.every((n,i)=>!n||!i||p.best[i-1])&&p.upgrades&&['brush','torque'].every(k=>int(p.upgrades[k],0,1))&&p.coins===p.best.reduce((a,b)=>a+b,0)*6-Object.keys(costs).reduce((n,k)=>n+p.upgrades[k]*costs[k],0)}
function decode(raw){try{if(typeof raw!=='string'||raw.length>30000)return null;const o=JSON.parse(raw),s=o.job,p=o.profile;if(o.version!==1||!validProfile(p)||!s||!validProfile(s.checkpoint)||!int(s.index,0,jobs.length-1)||s.index>0&&!s.checkpoint.best[s.index-1]||!['repair','complete'].includes(s.status)||!int(s.actions,0,1000000)||!int(s.tests,0,1000000)||!int(s.reward,0,18)||!int(s.stars,0,3)||!Array.isArray(s.tiles)||s.tiles.length!==W*H||s.tiles.some(t=>!t||!int(t.dirt,0,2)||!int(t.rust,0,1)||!int(t.bolt,0,2)||!int(t.rot,0,3)))return null;
 if(s.status==='repair'){if(s.reward||s.stars||JSON.stringify(p)!==JSON.stringify(s.checkpoint))return null}else{if(!circuit(s).connected||!s.tests||(s.stars!==(progress(s)===100?3:progress(s)>=75?2:1)&&!(s.stars===2&&progress(s)===100&&s.tests>3))||s.reward!==Math.max(0,s.stars-s.checkpoint.best[s.index])*6)return null;const expected=copy(s.checkpoint);expected.best[s.index]=Math.max(expected.best[s.index],s.stars);if(p.best.some((n,i)=>n!==expected.best[i])||Object.keys(costs).some(k=>p.upgrades[k]<expected.upgrades[k]))return null}
 return{profile:copy(p),job:{...copy(s),message:'Repair restored. Your tools and machine are just as you left them.'}};
 }catch{return null}}
return{W,H,jobs,copy,blank,layout,mask,start,create,circuit,progress,act,test,stroke,inspect,costs,upgrade,canContinue,continueRepair,diagnose,next,retry,encode,decode};
});
