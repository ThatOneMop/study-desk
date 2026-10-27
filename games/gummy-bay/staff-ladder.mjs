// v178: staff are earned. A first hire needs a level and a person who already knows you.
// Later tiers cost more and work a little faster. Old saves that already hired someone
// keep that person as a trainee.
export const STAFF_ROLES=Object.freeze([
 {id:'gardener',title:'Gardener',station:'Your tents',tiers:Object.freeze([
  {id:'trainee',name:'Trainee',level:4,friend:'Milo',min:12,cost:450,pace:1,blurb:'Walks the tents you already installed. Needs soil, seeds and a filled can.'},
  {id:'hand',name:'Hand',level:8,friend:'Pam',min:28,cost:1100,pace:1.2,blurb:'Keeps a second tent moving and wastes less of the watering can.'},
  {id:'lead',name:'Lead',level:12,friend:'Ned',min:45,cost:2200,pace:1.45,blurb:'Runs the whole garden row and calls you only when a tent is empty.'}
 ])},
 {id:'crafter',title:'Chemist',station:'The worktable',tiers:Object.freeze([
  {id:'trainee',name:'Trainee',level:6,friend:'Hank Harrow',min:12,cost:1200,pace:1,blurb:'Shapes and wraps what you harvested. Keep wrappers in stock.'},
  {id:'hand',name:'Hand',level:10,friend:'Juniper',min:30,cost:2400,pace:1.2,blurb:'Batches the flavour you assigned and leaves the rest of the table alone.'},
  {id:'lead',name:'Lead',level:14,friend:'Mabel Toffee',min:45,cost:4000,pace:1.4,blurb:'Runs the press and the packing table on the shelf you picked.'}
 ])},
 {id:'cleaner',title:'Cleaner',station:'The shelves',tiers:Object.freeze([
  {id:'trainee',name:'Trainee',level:5,friend:'Beryl',min:10,cost:700,pace:1,blurb:'Sweeps the workshop and takes a bit of rubbish out each round.'},
  {id:'hand',name:'Hand',level:9,friend:'Leanne',min:25,cost:1500,pace:1.25,blurb:'Keeps the stockroom shelves straight as well as the floor.'},
  {id:'lead',name:'Lead',level:13,friend:'Clive',min:40,cost:2800,pace:1.5,blurb:'Closes the place down tidy, bins and shelves both.'}
 ])},
 {id:'seller',title:'Seller',station:'The agreed route',tiers:Object.freeze([
  {id:'trainee',name:'Trainee',level:7,friend:'Nia',min:15,cost:1600,pace:1,blurb:'Walks an agreed order to the customer. Background sales stay at 90% of market.'},
  {id:'hand',name:'Hand',level:11,friend:'Benny Boardwalk',min:30,cost:3000,pace:1.2,blurb:'Covers the route you set and leaves reserved packs alone.'},
  {id:'lead',name:'Lead',level:15,friend:'Mayor Prudence',min:45,cost:5000,pace:1.4,blurb:'Handles the counter and the route from the house you live in.'}
 ])}
].map(role=>Object.freeze({...role,tiers:Object.freeze(role.tiers.map(Object.freeze))})));

export const DEALER_HOMES=Object.freeze({
 benny:Object.freeze({house:'the boardwalk cottage',x:-18,z:-6}),
 mo:Object.freeze({house:'the market flat',x:108,z:-148}),
 cleo:Object.freeze({house:'the harbor loft',x:-174,z:-4}),
 dex:Object.freeze({house:'the heights terrace',x:-4,z:-286})
});

const roleOf=id=>STAFF_ROLES.find(r=>r.id===id)||null;
const regard=(contacts,state,name)=>{
 const i=(contacts||[]).findIndex(c=>c&&c.name===name);
 if(i<0)return 0;
 const rel=state?.relations?.[i]||0;
 return state?.unlocked?.[i]?Math.max(rel,999):rel;
};

export function currentTier(roleId,state){
 const role=roleOf(roleId);if(!role)return null;
 const id=state?.staffTier?.[roleId]||(state?.helpers?.[roleId]?'trainee':null);
 return role.tiers.find(t=>t.id===id)||null;
}
export function staffPace(state,roleId){return currentTier(roleId,state)?.pace||1;}

export function nextStaffHire(roleId,state){
 const role=roleOf(roleId);
 if(!role)return {ok:false,reason:'That job is not on the board.'};
 const have=currentTier(roleId,state);
 const idx=have?role.tiers.findIndex(t=>t.id===have.id):-1;
 const next=role.tiers[idx+1];
 if(!next)return {ok:false,reason:role.title+' is already a lead.',role,tier:null,lead:true};
 const level=state?.level||0;
 if(level<next.level)return {ok:false,reason:'Reach level '+next.level+' for a '+next.name.toLowerCase()+' '+role.title.toLowerCase()+'.',role,tier:next,cost:next.cost};
 if(regard(state?.contacts,state,next.friend)<next.min)return {ok:false,reason:'Get to know '+next.friend+' first. A sample that suits them opens the door.',role,tier:next,cost:next.cost};
 return {ok:true,role,tier:next,cost:next.cost,promoted:!!have,title:next.name+' '+role.title};
}

export function dealerIntro(dealer,state){
 if(!dealer)return {ok:false,reason:'No such dealer.'};
 const home=DEALER_HOMES[dealer.id];
 if(!home)return {ok:true};
 if(regard(state?.contacts,state,dealer.name)<8)return {ok:false,reason:dealer.name.split(' ')[0]+' will not sign until they are in your customer book.'};
 return {ok:true,home};
}

export function dealerRoutine(id,time){
 const home=DEALER_HOMES[id];if(!home)return null;
 const t=((time%1440)+1440)%1440;
 let place='at the stall';
 if(t<8*60||t>=21*60)place='at home in '+home.house;
 else if(t<11*60)place='opening '+home.house+' and walking to the stall';
 else if(t>=18*60)place='counting the tin, then heading to '+home.house;
 return {place,house:home.house,x:home.x,z:home.z};
}

function money(n){return '$'+Math.round(n).toLocaleString('en-US');}
export function staffLadderHTML(v){
 const esc=v.esc||(s=>s);
 const house=esc(v.house||'your place');
 let h='<div class="overline">THE HELPING HAND / CREW LADDER</div><h2>Earn the extra hands.</h2><p>Helpers work in the background and use your stock. No daily wage. Each step is a one-time fee, and the next step needs a higher level plus someone who already knows you. They work from <b>'+house+'</b>. Assign the station on the workshop board.</p>';
 for(const role of STAFF_ROLES){
  const have=currentTier(role.id,v);
  const gate=nextStaffHire(role.id,v);
  const pace=have?have.pace:1;
  const where=esc(role.station);
  const now=have?esc(have.name)+' · '+where+' · pace '+pace.toFixed(2):'Not on the crew';
  let label,disabled=false;
  if(!gate.tier){label='LEAD';disabled=true;}
  else if(!gate.ok){label=gate.reason.startsWith('Reach')?'LEVEL '+gate.tier.level:'GET TO KNOW';disabled=true;}
  else label=(have?'PROMOTE ':'')+money(gate.cost);
  if(gate.ok&&(v.cash??0)<gate.cost){label=money(gate.cost);disabled=true;}
  const desc=esc((gate.tier||have).blurb)+(gate.ok?'':' '+esc(gate.reason||''));
  h+='<div class="item"><div><strong>'+esc(role.title)+'</strong><p>'+now+'</p><p>'+desc+'</p></div><button class="primary" '+(disabled?'disabled ':'')+'onclick="action(\'hire\',\''+role.id+'\')">'+esc(label)+'</button></div>';
 }
 return h;
}
export function staffPostingHTML(v){
 const esc=v.esc||(s=>s);
 const lines=STAFF_ROLES.map(role=>{
  const have=currentTier(role.id,v);
  return '<li>'+esc(role.title)+' · '+(have?esc(have.name)+' · '+esc(role.station):'open')+'</li>';
 }).join('');
 return '<div class="overline">ASSIGNED TO '+esc((v.house||'YOUR PLACE').toUpperCase())+'</div><ul class="staff-posting">'+lines+'</ul>';
}
