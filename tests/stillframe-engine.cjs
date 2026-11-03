const T=require('node:test'),A=require('node:assert/strict'),E=require('../games/stillframe/engine.js');
function route(){let s=E.create(),a=[];for(let i=0;i<3;i++){for(const x of ['subject:'+i,'focus:'+E.subjects[i].depth,'shutter:'+E.subjects[i].speed,'aperture:'+(2-E.subjects[i].light+E.subjects[i].speed)]){s=E.act(s,x);A.ok(s);a.push(x)}const aim='aim:'+E.position(s);s=E.act(s,aim);a.push(aim);s=E.act(s,'shoot');a.push('shoot')}A.equal(s.phase,'won');return a}
T('complete field album and exact saves',()=>{let s=E.create();for(const a of route()){s=E.act(s,a);A.deepEqual(E.decode(JSON.stringify(s)),s)}A.deepEqual(s.records,[100,100,100]);A.equal(s.film,6)});
T('poor framing spends film and retains prints on retry',()=>{let s=E.create([45,0,0]);while(s.phase==='field')s=E.act(s,'shoot');A.equal(s.phase,'lost');A.deepEqual(E.act(s,'restart').records,s.records)});
T('focus blur and motion blur independently reduce quality',()=>{let s=E.create();s.aim=E.position(s);s.shutter=2;s.aperture=1;A.equal(E.preview(s).score,100);s.focus=0;A.equal(E.preview(s).score,75);s.focus=1;s.shutter=1;s.aperture=0;A.equal(E.preview(s).score,75)});
T('invalid saves rejected',()=>{for(const p of [{film:-1},{records:[]},{phase:'won'},{focus:4}])A.throws(()=>E.decode(JSON.stringify({...E.create(),...p})))});
module.exports={route};
