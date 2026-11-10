/* Original Corebreaker mechanics. No third-party assets or runtime dependencies. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.Corebreaker=api})(typeof globalThis==='object'?globalThis:this,()=>{
'use strict';
const names=['Duststone','Copper bloom','Glacier shard','Amber giant','Violet heart','Star iron'];
const fresh=()=>({version:1,sector:1,damage:0,credits:0,total:0,hits:0,cores:0,upgrades:{hammer:0,drone:0,precision:0,coolant:0},records:[]});
const maxHP=s=>Math.round(80*Math.pow(1.18,s.sector-1));
const reward=s=>Math.round(35*Math.pow(1.20,s.sector-1));
const power=s=>2*Math.pow(1.28,s.upgrades.hammer)*Math.pow(1.08,s.cores);
const drone=s=>2*s.upgrades.drone*Math.pow(1.17,s.upgrades.drone)*Math.pow(1.08,s.cores);
const cost=(s,k)=>Math.round(({hammer:18,drone:45,precision:70,coolant:55}[k]||Infinity)*Math.pow(1.35,s.upgrades[k]||0));
function buy(s,k){if(!Object.hasOwn(s.upgrades,k)||s.upgrades[k]>=30||s.credits<cost(s,k))return false;s.credits-=cost(s,k);s.upgrades[k]++;return true}
function hit(s,weak=false,combo=0){s.hits++;const n=power(s)*(weak?1.7+s.upgrades.precision*.12:1)*(1+Math.min(10,combo)*.03);return damage(s,n)}
function damage(s,n){if(!(n>0)||!Number.isFinite(n))return {amount:0,broken:false};const amount=Math.min(n,maxHP(s)-s.damage);s.damage+=amount;s.total+=amount;const broken=s.damage>=maxHP(s);let gain=0;if(broken){gain=reward(s);s.credits+=gain;s.records.push(s.sector);s.records=s.records.slice(-12);s.sector++;s.damage=0;if((s.sector-1)%5===0)s.cores++}return {amount,broken,gain}}
function decode(raw){const o=JSON.parse(raw),s=fresh();if(!o||o.version!==1)throw Error('Unknown save version');for(const k of ['sector','damage','credits','total','hits','cores']){if(!Number.isFinite(o[k])||o[k]<0||o[k]>1e15)throw Error('Invalid '+k);s[k]=o[k]}if(!Number.isInteger(s.sector)||s.sector<1||s.sector>200)throw Error('Invalid sector');for(const k in s.upgrades){const n=o.upgrades?.[k];if(!Number.isInteger(n)||n<0||n>30)throw Error('Invalid upgrade');s.upgrades[k]=n}s.damage=Math.min(s.damage,maxHP(s)-.001);s.records=Array.isArray(o.records)?o.records.filter(n=>Number.isInteger(n)&&n>0&&n<s.sector).slice(-12):[];return s}
return {names,fresh,maxHP,reward,power,drone,cost,buy,hit,damage,decode};
});
