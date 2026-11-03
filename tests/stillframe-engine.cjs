const T=require('node:test'),A=require('node:assert/strict'),E=require('../games/stillframe/engine.js');
// Read each public brief and choose the next feasible moment; never inject state during a route.
function route(initial=E.create()) {
  let s=initial;const actions=[];
  const doAction=a=>{s=E.act(s,a);A.ok(s,a);actions.push(a)};
  for(let i=0;i<3;i++) {
    doAction('subject:'+i);
    while(s.seals[i]<3) {
      const step=s.seals[i],b=E.brief(s);
      doAction('focus:'+E.subjects[i].depth);doAction('shutter:1');doAction('aperture:'+(3-E.subjects[i].light));doAction('technique:'+(step===2?1:0));
      let found=false;
      for(let n=0;n<6;n++) {
        const m=E.moment(s), offset=step===0?0:step===1?b.offset:-m.direction;
        const aim=E.position(s)-offset;
        if(aim>=0&&aim<=4){doAction('aim:'+aim);if(E.preview(s).qualifies){found=true;break}}
        doAction('wait');
      }
      A.ok(found,'brief must have a feasible moment');doAction('shoot');
    }
  }
  A.equal(s.phase,'won');return actions;
}
T('all nine distinct briefs, exact saves and alternate replay',()=>{
  let s=E.create();for(const a of route(s)){s=E.act(s,a);A.deepEqual(E.decode(JSON.stringify(s)),s)}
  A.deepEqual(s.records,[100,100,100]);A.equal(s.film,0);A.deepEqual(s.seals,[3,3,3]);
  A.deepEqual([...new Set(s.prints.map(p=>p.brief))],['Portrait','Habitat','In motion']);
  s=E.act(s,'restart');A.equal(s.edition,1);A.deepEqual(s.seals,[0,0,0]);A.deepEqual(s.records,[100,100,100]);
  for(const a of route(s))s=E.act(s,a);A.equal(s.phase,'won');
});
T('sharp but wrong pose/composition does not earn a brief; watching spends no film',()=>{
  let s=E.create();for(const a of ['aim:0','shutter:1','aperture:0'])s=E.act(s,a);
  A.equal(E.preview(s).score,100);A.equal(E.preview(s).qualifies,false);s=E.act(s,'shoot');A.equal(s.seals[0],0);
  const film=s.film;s=E.act(s,'wait');A.equal(s.film,film);
  s=E.act(s,'wait');s=E.act(s,'aim:3');A.equal(E.preview(s).score,100);A.equal(E.preview(s).qualifies,false);
  s=E.act(s,'aim:4');A.equal(E.preview(s).qualifies,true);
});
T('following moving subject fixes blur but blurs a stationary subject',()=>{
  let s=E.create();for(const a of ['wait','aim:1','shutter:1','aperture:0'])s=E.act(s,a);
  A.equal(E.preview(s).score,75);s=E.act(s,'technique:1');A.equal(E.preview(s).score,100);
  s=E.act(s,'wait');s=E.act(s,'wait');s=E.act(s,'aim:4');A.equal(E.preview(s).score,70);
});
T('capture is frozen when live position moves; failed outing retains earned work',()=>{
  let s=E.create();for(const a of route()){s=E.act(s,a);if(a==='shoot')break}
  A.equal(s.seals[0],1);A.equal(s.prints[0].position,4);A.equal(E.position(s),2);
  const print=JSON.stringify(s.prints[0]);while(s.phase==='field')s=E.act(s,'shoot');
  A.equal(s.phase,'lost');A.equal(JSON.stringify(s.prints[0]),print);const n=E.act(s,'restart');A.deepEqual(n.seals,s.seals);A.deepEqual(n.records,s.records);A.equal(n.prints.length,0);
});
T('old completed and mid-outing saves retain records without auto-completing briefs',()=>{
  for(const phase of ['won','field','lost']){
    const old={...E.create([100,90,80]),v:1,phase,film:phase==='lost'?0:6};for(const k of ['seals','edition','prints','technique'])delete old[k];
    const s=E.decode(JSON.stringify(old));A.deepEqual(s.records,old.records);A.deepEqual(s.seals,[0,0,0]);A.equal(s.phase,phase==='won'?'field':phase);A.deepEqual(E.decode(JSON.stringify(s)),s);
  }
});
T('malformed saves and invalid actions rejected',()=>{
  for(const p of [{film:-1},{records:[]},{phase:'won'},{focus:4},{seals:[4,0,0]},{technique:3},{prints:[{}]},{edition:-1}])A.throws(()=>E.decode(JSON.stringify({...E.create(),...p})));
  A.equal(E.act(E.create(),'technique:2'),null);A.equal(E.act(E.create(),'subject:3'),null);
});
module.exports={route};

T('contact sheet cannot exceed spent film or best scores',()=>{
 let s=E.create();for(const a of route()){s=E.act(s,a);if(a==='shoot')break}
 for(const patch of [{film:9},{records:[0,0,0]},{seals:[0,0,0]},{prints:[s.prints[0],s.prints[0]],film:7}]){
   A.throws(()=>E.decode(JSON.stringify({...s,...patch})));
 }
 A.deepEqual(E.decode(JSON.stringify(s)),s);
});
T('accepted work from earlier outings remains valid without current prints',()=>{
 let s=E.create();for(const a of route()){s=E.act(s,a);if(a==='shoot')break}
 s=E.act(s,'restart');A.equal(s.prints.length,0);A.equal(s.seals[0],1);
 A.deepEqual(E.decode(JSON.stringify(s)),s);
 for(const a of route(s))s=E.act(s,a);A.equal(s.phase,'won');A.deepEqual(E.decode(JSON.stringify(s)),s);
});
