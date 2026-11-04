const A=require('node:assert/strict'),T= require.main===module?require('node:test'):()=>{},E=require('../games/rootstock/engine');
const plans=[[[56,7,2,0],[42,55,4,1]],[[56,7,1,1],[7,24,4,1]],[[42,21,3,0]]];
function route(order){let s=E.create(order),out=[];for(const [a,b,cut,keep]of plans[order]){for(const cmd of ['a:'+s.stock.indexOf(a),'b:'+s.stock.indexOf(b),'cut:'+cut,'cross','keep:'+keep]){out.push(cmd);s=E.act(s,cmd);A.ok(s)}}out.push('deliver');return out}
T('three requests breed, deliver, reload and preserve album',()=>{for(let order=0;order<3;order++){let s=E.create(order);for(const a of route(order)){s=E.act(s,a);A.deepEqual(E.decode(JSON.stringify(s)),s)}A.equal(s.phase,'won');A.deepEqual(E.act(s,'restart').album,s.album);A.equal(E.act(s,'next').records[order],s.crosses)}});
T('nursery capacity, duplicates and pruning preserve discoveries',()=>{let s=E.create();for(const a of route(0).slice(0,-1))s=E.act(s,a);A.equal(s.stock.length,6);s=E.act(s,'cross');A.equal(E.act(s,'keep:0'),null);const album=s.album;s=E.act(s,'prune:4');A.equal(s.stock.length,5);A.deepEqual(s.album,album);while(s.stock.length>2)s=E.act(s,'prune:0');A.equal(E.act(s,'prune:0'),null)});
T('different parents and explicit cross required',()=>{let s=E.create();A.equal(E.act(s,'keep:0'),null);s=E.act(s,'b:0');A.equal(E.act(s,'cross'),null)});
T('invalid saves rejected',()=>{for(const patch of [{stock:[1]},{cut:6},{pending:[0,0]},{phase:'won'},{album:[]}])A.throws(()=>E.decode(JSON.stringify({...E.create(),...patch})))});


function pairedRoute(order){let s=E.create(order);s.records[order]=2;s=E.act(s,'paired');const out=[];function doIt(a){s=E.act(s,a);A.ok(s,a);out.push(a)}function prune(g){doIt('prune:'+s.stock.indexOf(g))}function cross(a,b,c,k){for(const cmd of ['a:'+s.stock.indexOf(a),'b:'+s.stock.indexOf(b),'cut:'+c,'cross','keep:'+k])doIt(cmd)}
if(order===0){cross(56,7,2,0);cross(56,7,2,1);prune(56);cross(42,55,4,1);prune(7);cross(21,8,4,1)}
if(order===1){cross(56,7,1,1);cross(56,7,1,0);prune(42);cross(7,24,4,1);prune(21);cross(56,39,4,1)}
if(order===2){cross(42,21,3,0);cross(42,21,3,1)}doIt('deliver');return out}
T('earned paired orchards require both cultivars and preserve separate seals',()=>{for(let i=0;i<3;i++){let s=E.create(i);A.equal(E.act(s,'paired'),null);for(const a of route(i))s=E.act(s,a);s=E.act(s,'paired');for(const a of pairedRoute(i)){s=E.act(s,a);A.deepEqual(E.decode(JSON.stringify(s)),s)}A.equal(s.phase,'won');A.ok(s.stock.includes(63^E.targets[i]));A.ok(s.seals[i]);A.deepEqual(E.act(s,'restart').seals,s.seals);if(i<2)A.equal(pairedRoute(i).filter(a=>a.startsWith('prune')).length,2)}});
T('legacy records migrate without losing discoveries',()=>{let s=E.create();delete s.paired;delete s.seals;const n=E.decode(JSON.stringify(s));A.equal(n.paired,false);A.deepEqual(n.album,s.album);A.deepEqual(n.seals,{})});
module.exports={route,pairedRoute};

T('paired progress and unbred seedlings cannot be forged by inconsistent saves',()=>{for(const patch of [{paired:true},{seals:{0:4}},{records:{0:0}},{pending:[63,0]},{stock:[56,7,42,21,63],album:[56,7,42,21,63]}])A.throws(()=>E.decode(JSON.stringify({...E.create(),...patch})));let s=E.create(0);for(const a of route(0))s=E.act(s,a);s=E.act(s,'paired');for(const a of pairedRoute(0))s=E.act(s,a);A.throws(()=>E.decode(JSON.stringify({...s,seals:{0:99}})));A.throws(()=>E.decode(JSON.stringify({...s,records:{}})))});
T('pruning a needed trait can be retried without deleting records or discoveries',()=>{let s=E.create();for(const a of route(0))s=E.act(s,a);s=E.act(s,'paired');s=E.act(s,'prune:0');s=E.act(s,'prune:0');const album=s.album;s=E.act(s,'restart');A.deepEqual(s.stock,[56,7,42,21]);A.deepEqual(s.album,album);A.equal(s.paired,true);A.equal(s.records[0],2)});
