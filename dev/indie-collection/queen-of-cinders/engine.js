'use strict';
(function(root){
const W=7,H=7,Q=45,clone=x=>JSON.parse(JSON.stringify(x));
const chapters=[
 {name:'The warm nursery',story:'A spark has crossed the orchard. Establish three supply trails and raise a new brood before the wind turns.',goal:3,limit:18,fire:10,axis:'north',rocks:[9,11,16,18],food:30,water:40,resin:32,color:'#eab873'},
 {name:'Root and rivulet',story:'Stone roots divide the pantry. Water can preserve a short trail, or you can dig around the heat.',goal:4,limit:19,fire:9,axis:'west',rocks:[15,22,29,24],food:28,water:39,resin:33,color:'#9fcdb3'},
 {name:'The amber crossing',story:'The resin grove is exposed. Build a wet firebreak before the cinders reach your carriers.',goal:5,limit:20,fire:8,axis:'east',rocks:[17,24,31,10],food:29,water:37,resin:26,color:'#f0aa6a'},
 {name:'Under the black fern',story:'The fire is close. Divide a growing workforce between supplies and the nursery.',goal:5,limit:20,fire:7,axis:'north',rocks:[25,18,11,30],food:35,water:41,resin:23,color:'#bcadcf'},
 {name:'A small green future',story:'Rescue six brood from the last ember tide. The colony you raise is the forest that comes next.',goal:6,limit:22,fire:7,axis:'west',rocks:[24,17,10,36],food:28,water:40,resin:32,color:'#b6c887'}
];
const costs={boots:3,nursery:4,shell:3};
function fresh(index,p){return{index,turn:0,status:'active',open:[Q,38],wet:[],burn:[],teams:{food:0,water:0,resin:0,nurse:0},carry:{food:0,water:0,resin:0},left:{food:60,water:40,resin:30},food:16,water:0,resin:0,workers:6,brood:0,growth:0,health:p.upgrades.shell?5:3,stars:0,message:'Dig connected soil to supplies. Assign carriers and nurses, then send a shift.'}}
function create(){const profile={best:[0,0,0,0,0],coins:0,upgrades:{boots:0,nursery:0,shell:0}};return{version:1,profile,colony:fresh(0,profile)}}
const neighbours=i=>[i-W,i+W,i%W?i-1:-1,i%W<W-1?i+1:-1].filter(n=>n>=0&&n<W*H);
function distances(s){const d={[Q]:0},queue=[Q];for(const i of queue)for(const n of neighbours(i))if(s.open.includes(n)&&!s.burn.includes(n)&&d[n]===undefined){d[n]=d[i]+1;queue.push(n)}return d}
function allocated(s){return Object.values(s.teams).reduce((a,b)=>a+b,0)}
function free(s){return s.workers-allocated(s)}
function due(s,i){const c=chapters[s.index],x=i%W,y=Math.floor(i/W);return c.fire+(c.axis==='north'?y:c.axis==='west'?x:W-1-x)}
function travel(o,type){const d=distances(o.colony)[chapters[o.colony.index][type]];return d===undefined?null:Math.max(1,Math.ceil(d/3)-o.profile.upgrades.boots)}
function assign(o,type,delta){const s=o.colony;if(s.status!=='active'||!Object.hasOwn(s.teams,type)||![-1,1].includes(delta))return false;if(delta<0&&s.teams[type]===0||delta>0&&free(s)===0){s.message='Reassign an existing ant, or hatch more brood to grow the workforce.';return false}s.teams[type]+=delta;s.message=`${type==='nurse'?'Nursery':type} team: ${s.teams[type]} ants.`;return true}
function dig(o,i){const s=o.colony,c=chapters[s.index];if(s.status!=='active'||!Number.isInteger(i)||i<0||i>=49)return false;if(s.open.includes(i)){s.message='This tunnel is already open.';return false}if(c.rocks.includes(i)){s.message='Solid root. Dig a different route.';return false}if(!neighbours(i).some(n=>distances(s)[n]!==undefined)){s.message='Start at a connected tunnel. Diagonal soil is not connected.';return false}if(s.food<1){s.message='Digging needs one food. Send food carriers on a shift first.';return false}s.food--;s.open.push(i);if(due(s,i)<=s.turn){s.burn.push(i);s.message='The ground here is hot. Dampen it with two water to reopen the tunnel.'}else s.message='Tunnel opened for one food. Planning and digging do not advance the fire.';return true}
function damp(o,i){const s=o.colony;if(s.status!=='active'||!s.open.includes(i)||s.wet.includes(i)||i===Q)return false;if(s.water<2){s.message='A wet firebreak needs two water.';return false}s.water-=2;s.wet.push(i);s.burn=s.burn.filter(n=>n!==i);s.message='Wet earth protects this tunnel for the whole chapter.';return true}
function step(o){const s=o.colony,c=chapters[s.index];if(s.status!=='active')return false;s.turn++;const gains={};
 for(const k of ['food','water','resin']){const cost=travel(o,k);gains[k]=0;if(cost!==null&&s.left[k]>0){s.carry[k]+=s.teams[k];const n=Math.min(s.left[k],Math.floor(s.carry[k]/cost));s.carry[k]-=n*cost;s.left[k]-=n;s[k]+=n;gains[k]=n}}
 if(s.food>=1)s.food--;else s.health--;
 s.growth+=s.teams.nurse;const need=o.profile.upgrades.nursery?2:3;let born=0;
 while(s.growth>=need&&s.food>=3&&s.resin>=1&&s.brood<c.goal){s.growth-=need;s.food-=3;s.resin--;s.brood++;s.workers++;born++}
 // Nursery work can be prepared, but does not accumulate unlimited free births.
 s.growth=Math.min(s.growth,need);
 const newBurn=s.open.filter(i=>i!==Q&&!s.wet.includes(i)&&!s.burn.includes(i)&&due(s,i)<=s.turn);s.burn.push(...newBurn);
 s.message=`Shift ${s.turn}: +${gains.food} food, +${gains.water} water, +${gains.resin} resin.${born?' '+born+' brood hatched; new ants are ready to assign.':''}${newBurn.length?' Cinders closed '+newBurn.length+' tunnel'+(newBurn.length===1?'':'s')+'.':''}`;
 if(s.health<=0){s.status='lost';s.message='The pantry ran dry and the queen weakened. Retry freely; build a food route first.'}
 else if(s.brood>=c.goal){s.status='complete';s.stars=1+(s.health===(o.profile.upgrades.shell?5:3)?1:0)+(s.turn<=c.limit-4?1:0);const delta=Math.max(0,s.stars-o.profile.best[s.index]);o.profile.best[s.index]=Math.max(o.profile.best[s.index],s.stars);o.profile.coins+=delta;s.message=`Brood rescued! ${s.stars}/3 leaf medals. ${delta?delta+' new medals banked.':'Best score already banked; replay never farms medals.'}`}
 else if(s.turn>=c.limit){s.status='lost';s.message='The ember tide reached the nursery. Retry and protect the supply junctions sooner.'}
 return true}
function retry(o){o.colony=fresh(o.colony.index,o.profile);return true}
function next(o,i){if(o.colony.status==='active'||!Number.isInteger(i)||i<0||i>=chapters.length||i>0&&!o.profile.best[i-1])return false;o.colony=fresh(i,o.profile);return true}
function upgrade(o,k){if(o.colony.status!=='complete'||!Object.hasOwn(costs,k)||o.profile.upgrades[k]||o.profile.coins<costs[k])return false;o.profile.coins-=costs[k];o.profile.upgrades[k]=1;return true}
function valid(o){
 if(!o||o.version!==1||!o.profile||!o.colony)return false;const p=o.profile,s=o.colony,num=(n,a,b)=>Number.isInteger(n)&&n>=a&&n<=b,arr=(v,max)=>Array.isArray(v)&&v.length<=max&&v.every(n=>num(n,0,48))&&new Set(v).size===v.length;
 if(!Array.isArray(p.best)||p.best.length!==5||!p.best.every(n=>num(n,0,3))||!p.upgrades||Object.keys(p.upgrades).length!==3||!Object.keys(costs).every(k=>num(p.upgrades[k],0,1)))return false;
 if(p.best.some((n,i)=>n&&i>0&&!p.best[i-1])||p.coins!==p.best.reduce((a,b)=>a+b,0)-Object.keys(costs).reduce((a,k)=>a+costs[k]*p.upgrades[k],0)||!num(p.coins,0,15))return false;
 if(!num(s.index,0,4)||s.index>0&&!p.best[s.index-1]||!num(s.turn,0,22)||!['active','complete','lost'].includes(s.status)||!arr(s.open,49)||!s.open.includes(Q)||!arr(s.wet,48)||!arr(s.burn,48)||s.wet.includes(Q)||s.burn.includes(Q)||s.open.some(i=>chapters[s.index].rocks.includes(i))||[...s.wet,...s.burn].some(i=>!s.open.includes(i))||s.wet.some(i=>s.burn.includes(i)))return false;
 const c=chapters[s.index];if(!num(s.brood,0,c.goal)||s.workers!==6+s.brood||!num(s.health,0,5)||!num(s.growth,0,3)||!num(s.stars,0,3)||typeof s.message!=='string'||s.message.length>500||s.turn>c.limit)return false;
 for(const k of ['food','water','resin'])if(!num(s[k],0,100)||!s.left||!num(s.left[k],0,{food:60,water:40,resin:30}[k])||!s.carry||!num(s.carry[k],0,12))return false;
 if(!s.teams||Object.keys(s.teams).length!==4||!['food','water','resin','nurse'].every(k=>num(s.teams[k],0,12))||allocated(s)>s.workers)return false;
 if(s.status==='complete'&&(s.brood!==c.goal||!s.stars||p.best[s.index]<s.stars)||s.status==='active'&&(s.brood>=c.goal||s.health<=0||s.turn>=c.limit||s.stars!==0)||s.status==='lost'&&(s.health>0&&s.turn<c.limit||s.stars!==0))return false;return true;
}
function decode(raw){try{if(typeof raw!=='string'||raw.length>30000)return null;const o=JSON.parse(raw);return valid(o)?o:null}catch{return null}}
const E={W,H,Q,chapters,costs,create,clone,neighbours,distances,allocated,free,due,travel,assign,dig,damp,step,retry,next,upgrade,valid,encode:JSON.stringify,decode};if(typeof module!=='undefined'&&module.exports)module.exports=E;else root.Cinders=E;
})(typeof window!=='undefined'?window:globalThis);
