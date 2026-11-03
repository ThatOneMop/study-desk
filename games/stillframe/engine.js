(function(root, factory) {
  const engine = factory();
  if (typeof module === 'object') module.exports = engine; else root.Stillframe = engine;
})(globalThis, () => {
  'use strict';
  const KEY = 'study-desk-stillframe-v1'; // Keep the original storage key; decode migrates old albums.
  const subjects = [
    {name:'Kingfisher', light:3, speed:2, depth:1},
    {name:'Red deer', light:2, speed:1, depth:2},
    {name:'Luna moth', light:1, speed:1, depth:0}
  ];
  const paths = [[0,1,3,4,2],[4,3,2,1,0],[2,4,3,0,1]];
  const poses = ['Resting','Travelling','Travelling','Revealed','Resting'];
  const copy = value => JSON.parse(JSON.stringify(value));
  function create(records = [0,0,0], seals = [0,0,0], edition = 0) {
    return {v:2, subject:0, tick:0, aim:2, shutter:1, aperture:1, focus:1, technique:0,
      film:9, records:[...records], seals:[...seals], edition, prints:[], phase:'field',
      last:'Choose a subject. Watch its rhythm, then make the photograph in its brief.'};
  }
  const position = s => paths[s.subject][s.tick % 5];
  function moment(s) {
    const phase = s.tick % 5, moving = phase === 1 || phase === 2;
    return {pose:poses[phase], moving, speed:moving ? subjects[s.subject].speed : 0,
      direction:Math.sign(paths[s.subject][(phase+1)%5] - position(s))};
  }
  function brief(s) {
    const step = s.seals[s.subject], alternate = s.edition % 2 === 1;
    if (step === 0) return {title:'Portrait', text:(alternate?'Resting':'Revealed')+' · center the subject · Hold still', pose:alternate?'Resting':'Revealed'};
    if (step === 1) return {title:'Habitat', text:'Resting · subject on the '+(alternate?'right':'left')+' third · Hold still', offset:alternate?1:-1};
    if (step === 2) return {title:'In motion', text:'Travelling · leave space ahead · Follow subject · Medium shutter'};
    return {title:'Set complete', text:'Choose another subject, or keep a personal print.'};
  }
  function preview(s) {
    const t=subjects[s.subject], m=moment(s), b=brief(s), offset=position(s)-s.aim;
    const exposure=t.light+s.aperture-s.shutter, framed=Math.abs(offset)<=1;
    // Following buys a sharp moving subject at a slower shutter, but blurs a resting subject.
    const blur=s.technique===1 ? (m.moving ? Math.max(0,1-s.shutter)*25 : 30) : Math.max(0,m.speed-s.shutter)*25;
    const score=framed ? Math.max(0,100-Math.abs(exposure-2)*20-Math.abs(s.focus-t.depth)*25-blur) : 0;
    const step=s.seals[s.subject];
    const checks=step===0 ? [[m.pose===b.pose,'Wait for '+b.pose.toLowerCase()],[offset===0,'Center the subject'],[s.technique===0,'Hold still']]
      :step===1 ? [[m.pose==='Resting','Wait for resting'],[offset===b.offset,'Place subject on the '+(b.offset<0?'left':'right')+' third'],[s.technique===0,'Hold still']]
      :step===2 ? [[m.moving,'Wait for travelling'],[offset===-m.direction,'Leave space ahead'],[s.technique===1,'Follow subject'],[s.shutter===1,'Use Medium shutter']] : [];
    const missing=checks.filter(c=>!c[0]).map(c=>c[1]);
    if(score<80) missing.push('Reach 80 quality: check exposure, focus and motion');
    return {framed, exposure, score, offset, qualifies:step<3&&missing.length===0, missing};
  }
  function act(s, action) {
    if(action==='restart') return create(s.records, s.phase==='won'?[0,0,0]:s.seals, s.edition+(s.phase==='won'?1:0));
    if(s.phase!=='field') return null;
    const n=copy(s);
    if(action==='wait') {n.tick=(n.tick+1)%1000000; n.last='Watched: '+moment(n).pose.toLowerCase()+'. No film spent.';}
    else if(action==='shoot') {
      const p=preview(s), b=brief(s), m=moment(s);
      n.film--; n.records[s.subject]=Math.max(n.records[s.subject],p.score);
      n.prints.push({subject:s.subject,score:p.score,pose:m.pose,position:position(s),aim:s.aim,brief:b.title,earned:p.qualifies,technique:s.technique});
      if(p.qualifies)n.seals[s.subject]++;
      n.last=p.qualifies?b.title+' accepted. The next brief is ready.':p.score+'/100 print kept. '+(p.missing.join('; ')||'This subject’s set is already complete.')+'.';
      n.tick=(n.tick+1)%1000000;
      if(n.seals.every(x=>x===3)){n.phase='won';n.last='Exhibition complete: portraits, habitats and movement. A new outing opens the alternate composition briefs; your best scores stay.';}
      else if(!n.film){n.phase='lost';n.last='Film spent. New outing keeps your accepted briefs and best scores.';}
    } else if(typeof action==='string'&&/^(subject|aim|shutter|aperture|focus|technique):[0-4]$/.test(action)) {
      const [key,value]=action.split(':'), number=+value;
      if(number>(key==='aim'?4:key==='technique'?1:2))return null;
      n[key]=number;
    } else return null;
    return n;
  }
  function decode(raw) {
    let s=JSON.parse(raw);
    const int=(x,a,b)=>Number.isSafeInteger(x)&&x>=a&&x<=b;
    if(!s||![1,2].includes(s.v)||!int(s.subject,0,2)||!int(s.tick,0,1000000)||!int(s.aim,0,4)||!int(s.shutter,0,2)||!int(s.aperture,0,2)||!int(s.focus,0,2)||!int(s.film,0,9)||!Array.isArray(s.records)||s.records.length!==3||s.records.some(x=>!int(x,0,100))||!['field','won','lost'].includes(s.phase)||typeof s.last!=='string')throw Error('Invalid camera save');
    if(s.v===1) {
      if(s.phase==='field'&&!s.film||s.phase==='lost'&&s.film||s.phase==='won'&&!s.records.every(x=>x>=80))throw Error('Invalid old album');
      const old=s;s={...create(old.records),...old,v:2,tick:old.tick%1000000,technique:0,seals:[0,0,0],edition:0,prints:[]};
      if(old.phase==='won'){s.phase='field';s.film=9;s.last='Your original best scores are safe. The new composition briefs are ready.';}
    }
    if(!int(s.technique,0,1)||!int(s.edition,0,1000000)||!Array.isArray(s.seals)||s.seals.length!==3||s.seals.some(x=>!int(x,0,3))||!Array.isArray(s.prints)||s.prints.length>9)throw Error('Invalid composition album');
    for(const p of s.prints)if(!p||!int(p.subject,0,2)||!int(p.score,0,100)||!poses.includes(p.pose)||!int(p.position,0,4)||!int(p.aim,0,4)||!int(p.technique,0,1)||!['Portrait','Habitat','In motion','Set complete'].includes(p.brief)||typeof p.earned!=='boolean')throw Error('Invalid print');
    if(s.prints.length>9-s.film || s.seals.some((n,i)=>n>0&&s.records[i]<80))throw Error('Inconsistent album');
    const earned=[new Set(),new Set(),new Set()],order=['Portrait','Habitat','In motion'];
    for(const p of s.prints){
      if(p.score>s.records[p.subject])throw Error('Print exceeds best score');
      if(p.earned){
        const step=order.indexOf(p.brief);
        if(p.score<80||step<0||step>=s.seals[p.subject]||earned[p.subject].has(step))throw Error('Invalid accepted print');
        earned[p.subject].add(step);
      }
    }
    const complete=s.seals.every(x=>x===3);
    if(s.phase==='field'&&(!s.film||complete)||s.phase==='lost'&&(s.film||complete)||s.phase==='won'&&!complete)throw Error('Invalid outing state');
    return copy(s);
  }
  return {KEY,subjects,position,moment,brief,create,preview,act,decode};
});
