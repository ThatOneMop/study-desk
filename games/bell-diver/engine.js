(function(r,f){const e=f();if(typeof module==='object')module.exports=e;else r.BellDiver=e})(globalThis,()=>{'use strict';
const KEY='study-desk-bell-diver-v1',DIRS={left:-1,right:1,up:-5,down:5},NAMES=['The green shallows','The broken observatory','The midnight shelf'];
const layouts=[{rocks:[5,9,15,19,25,29,30,34],air:[12,23],relic:32,items:[{p:7,v:3,w:1},{p:16,v:5,w:2},{p:18,v:4,w:1},{p:27,v:7,w:2}]},{rocks:[5,8,10,13,19,20,24,30,34],air:[17,26],relic:33,items:[{p:6,v:4,w:1},{p:16,v:6,w:2},{p:23,v:5,w:1},{p:31,v:8,w:2}]},{rocks:[5,9,11,15,18,20,24,30,34],air:[16,28],relic:32,items:[{p:8,v:5,w:1},{p:17,v:7,w:2},{p:21,v:6,w:1},{p:33,v:9,w:2}]}];
const create=()=>({v:2,charter:-1,badges:[],level:0,pos:2,air:22,cargo:[],banked:[],usedAir:[],coins:0,tank:0,fins:0,records:[false,false,false],rescues:0,dives:0,expeditions:0,won:false});
const requests=[[4,3],[4,0,2],[4,0]],charterName=['Heavy recovery','Survey bundle','Sealed recovery'];
const maxAir=s=>22+s.tank*6,weight=s=>s.cargo.reduce((a,i)=>a+(i===4?2:layouts[s.level].items[i].w),0);
const adjacent=(a,b)=>Math.abs(a%5-b%5)+Math.abs(Math.floor(a/5)-Math.floor(b/5))===1;
const cost=(s,dir)=>1+(dir==='up'&&weight(s)>=3&&!s.fins?1:0);
function act(s,a){if(!a)return null;if(s.won){if(a.type!=='retry')return null;return{...create(),coins:s.coins,tank:s.tank,fins:s.fins,air:maxAir(s),expeditions:s.expeditions,badges:s.badges.slice()}};const n=JSON.parse(JSON.stringify(s)),map=layouts[s.level];
 if(a.type==='move'){const p=s.pos+DIRS[a.dir];if(!Number.isInteger(p)||p<0||p>=35||!adjacent(s.pos,p)||map.rocks.includes(p))return null;n.pos=p;n.air-=cost(s,a.dir);if(n.pos===2&&n.air>=0){n.air=maxAir(n);n.usedAir=[];if(n.cargo.length){if(s.charter>=0&&requests[s.charter].every(i=>n.cargo.includes(i))){const badge=s.charter===2?6+s.level:s.level*2+s.charter;if(!n.badges.includes(badge)){n.badges.push(badge);n.coins+=8}}for(const i of n.cargo){if(i===4)n.records[n.level]=true;else n.coins+=map.items[i].v;n.banked.push(i)}n.cargo=[];n.dives++}n.won=n.records.every(Boolean);if(n.won)n.expeditions++}else if(n.air<=0){n.pos=2;n.air=maxAir(n);n.cargo=[];n.usedAir=[];n.rescues++;}}
 else if(a.type==='charter'){if(s.pos!==2||s.banked.length||![-1,0,1,2].includes(a.id))return null;n.charter=a.id;}
 else if(a.type==='take'){const i=s.pos===map.relic?4:map.items.findIndex(o=>o.p===s.pos);if(i<0||s.banked.includes(i)||s.cargo.includes(i))return null;const w=i===4?2:map.items[i].w;if(weight(s)+w>4)return null;n.cargo.push(i);}
 else if(a.type==='breathe'){if(s.charter===2||!map.air.includes(s.pos)||s.usedAir.includes(s.pos))return null;n.usedAir.push(s.pos);n.air=Math.min(maxAir(s),s.air+8);}
 else if(a.type==='upgrade'){if(s.pos!==2)return null;if(a.gear==='tank'&&s.tank<2&&s.coins>=6+4*s.tank){n.coins-=6+4*s.tank;n.tank++;n.air=maxAir(n)}else if(a.gear==='fins'&&!s.fins&&s.coins>=8){n.coins-=8;n.fins=1}else return null;}
 else if(a.type==='next'){if(s.pos!==2||!s.records[s.level]||s.level>=2)return null;n.level++;n.charter=-1;n.banked=[];n.usedAir=[];n.air=maxAir(n);}
 else if(a.type==='retry'){n.pos=2;n.air=maxAir(n);n.cargo=[];n.usedAir=[];}
 else return null;return n;
}
// Minimum swim-air route home at the current bag weight. Air-pocket refills
// are deliberately excluded so the estimate never promises an unsafe return.
function returnRoute(s){
 const map=layouts[s.level],dist=Array(35).fill(Infinity),paths=Array(35);dist[s.pos]=0;paths[s.pos]=[];
 const open=new Set([s.pos]);
 while(open.size){const p=[...open].sort((a,b)=>dist[a]-dist[b])[0];open.delete(p);
  if(p===2)return {air:dist[p],path:paths[p],safe:s.air>=dist[p]};
  for(const [dir,delta] of Object.entries(DIRS)){const q=p+delta;if(q<0||q>=35||!adjacent(p,q)||map.rocks.includes(q))continue;
   const d=dist[p]+cost(s,dir);if(d<dist[q]){dist[q]=d;paths[q]=[...paths[p],q];open.add(q)}
  }
 }
 return {air:Infinity,path:[],safe:false};
}
function decode(raw){const s=JSON.parse(raw),int=(v,a,b)=>Number.isSafeInteger(v)&&v>=a&&v<=b,unique=(v,a,b)=>Array.isArray(v)&&new Set(v).size===v.length&&v.every(x=>int(x,a,b));
 if(s?.v===1){s.v=2;s.charter=-1;s.badges=[]}
 if(!s||s.v!==2||!int(s.charter,-1,2)||!unique(s.badges,0,8)||!int(s.level,0,2)||!int(s.pos,0,34)||layouts[s.level].rocks.includes(s.pos)||!int(s.tank,0,2)||!int(s.fins,0,1)||!int(s.air,1,maxAir(s))||!int(s.coins,0,1000000)||!int(s.expeditions,0,1000000)||!int(s.dives,0,1000000)||!int(s.rescues,0,1000000)||!unique(s.cargo,0,4)||!unique(s.banked,0,4)||s.cargo.some(i=>s.banked.includes(i))||weight(s)>4||!unique(s.usedAir,0,34)||s.usedAir.some(p=>!layouts[s.level].air.includes(p))||!Array.isArray(s.records)||s.records.length!==3||s.records.some((x,i)=>typeof x!=='boolean'||x&&i>0&&!s.records[i-1]||i>s.level&&x)||s.level>0&&!s.records[s.level-1]||s.records[s.level]!==s.banked.includes(4)||s.won!==s.records.every(Boolean)||s.pos===2&&(s.cargo.length||s.air!==maxAir(s)||s.usedAir.length))throw Error('Invalid dive save');return JSON.parse(JSON.stringify(s));}
return{KEY,DIRS,NAMES,layouts,requests,charterName,create,maxAir,weight,cost,adjacent,act,returnRoute,decode};});
