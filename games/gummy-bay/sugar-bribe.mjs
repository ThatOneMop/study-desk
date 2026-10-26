// Donuts distract a suspicious officer for ten seconds. Cash is a coin-flip
// that gets more expensive as the squad escalates, and it never touches the bank.
import {freshChase} from './police-ladder.mjs?v=132';

export const DONUT_PRICE=5;
export const DONUT_DISTRACT=10;
export const BRIBE_CHANCE=0.4;
const COST=Object.freeze({suspicious:40,investigating:80,pursuit:150,'all-units':300});

export function donutBribe(chase,donuts){
 const count=Number.isFinite(donuts)?Math.max(0,Math.floor(donuts)):0;
 if(chase?.stage!=='suspicious'||count<1)return {ok:false,reason:chase?.stage==='suspicious'?'none':'stage',chase:chase||freshChase(),donuts:count,seconds:0};
 return {ok:true,reason:'munch',chase:{stage:'suspicious',left:(chase.left||60)+DONUT_DISTRACT,searching:true,distracted:DONUT_DISTRACT},donuts:count-1,seconds:DONUT_DISTRACT};
}
export function bribeCost(stage){return COST[stage]||0;}
export function cashBribe(chase,cash,roll=1){
 const cost=bribeCost(chase?.stage);
 const carried=Number.isFinite(cash)?Math.max(0,cash):0;
 if(!cost)return {ok:false,reason:'stage',cash:carried,chase:chase||freshChase(),cost:0};
 if(carried<cost)return {ok:false,reason:'short',cash:carried,chase,cost};
 const luck=Number.isFinite(roll)?roll:1;
 if(luck>=BRIBE_CHANCE)return {ok:false,reason:'refused',cash:carried,chase,cost};
 return {ok:true,reason:'paid',cash:carried-cost,chase:freshChase(),cost};
}
