const E=require('../games/bramble-dice/engine.js');
const slots=Array.from({length:81},(_,i)=>Array.from({length:4},(_,j)=>1+Math.floor(i/3**j)%3));
function next(s,perk='blade'){const r=E.run(s);if(r.phase==='reward')return{type:'perk',id:perk};if(r.phase!=='active')return null;
 const options=slots.map(a=>({a,f:E.forecast(r,a)})).filter(x=>x.f.hp>0).sort((a,b)=>score(b.f,r)-score(a.f,r));
 if(r.rerolls&&r.dice.some(v=>v<4))return{type:'reroll',keep:r.dice.map(v=>v>=4)};
 return{type:'resolve',slots:(options[0]?.a||[1,1,1,1])};
}
function score(f,r){return(f.defeated?100:0)+Math.min(f.attack,r.foeHp)*1.6+(f.hp-r.hp)*2+f.hp*.02;}
function route(seed=1,perk='blade'){let s=E.create(seed),actions=[];for(let i=0;i<150;i++){const a=next(s,perk);if(!a)return{state:s,actions};const t=E.act(s,a);if(!t.ok)throw Error(t.reason);s=t.state;actions.push(a);}throw Error('Route did not terminate');}
module.exports={next,route};
if(require.main===module)for(const perk of E.PERKS)for(const seed of [1,2,3,42,2026]){const s=route(seed,perk.id).state,r=E.run(s);console.log(seed,perk.id,r.phase,r.turns,r.hp);}
