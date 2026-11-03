const A=require('node:assert/strict'),T= require.main===module?require('node:test'):()=>{},E=require('../games/rootstock/engine');
const plans=[[[56,7,2,0],[42,55,4,1]],[[56,7,1,1],[7,24,4,1]],[[42,21,3,0]]];
function route(order){let s=E.create(order),out=[];for(const [a,b,cut,keep]of plans[order]){for(const cmd of ['a:'+s.stock.indexOf(a),'b:'+s.stock.indexOf(b),'cut:'+cut,'cross','keep:'+keep]){out.push(cmd);s=E.act(s,cmd);A.ok(s)}}out.push('deliver');return out}
T('three requests breed, deliver, reload and preserve album',()=>{for(let order=0;order<3;order++){let s=E.create(order);for(const a of route(order)){s=E.act(s,a);A.deepEqual(E.decode(JSON.stringify(s)),s)}A.equal(s.phase,'won');A.deepEqual(E.act(s,'restart').album,s.album);A.equal(E.act(s,'next').records[order],s.crosses)}});
T('nursery capacity, duplicates and pruning preserve discoveries',()=>{let s=E.create();for(const a of route(0).slice(0,-1))s=E.act(s,a);A.equal(s.stock.length,6);s=E.act(s,'cross');A.equal(E.act(s,'keep:0'),null);const album=s.album;s=E.act(s,'prune:4');A.equal(s.stock.length,5);A.deepEqual(s.album,album);while(s.stock.length>2)s=E.act(s,'prune:0');A.equal(E.act(s,'prune:0'),null)});
T('different parents and explicit cross required',()=>{let s=E.create();A.equal(E.act(s,'keep:0'),null);s=E.act(s,'b:0');A.equal(E.act(s,'cross'),null)});
T('invalid saves rejected',()=>{for(const patch of [{stock:[1]},{cut:6},{pending:[0,0]},{phase:'won'},{album:[]}])A.throws(()=>E.decode(JSON.stringify({...E.create(),...patch})))});
module.exports={route};
