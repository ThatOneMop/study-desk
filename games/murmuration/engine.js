/* Murmuration — original game code and artwork, MIT. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Murmuration=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{'use strict';
const KEY='study-desk-murmuration-v1',clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const plans=[
 ['Reed rehearsal','The estuary teaches a small flock to move as one.','#d69b70',0,8,[[320,1],[320,0],[230,1],[390,0],[320,1],[320,0],[320,1]]],
 ['Copper wetlands','Crosswinds bend your course. Watch the wind ribbon.','#bc7961',.55,9,[[230,0],[390,1],[250,0],[420,1],[200,1],[370,0],[320,1]]],
 ['The long divide','Alternating channels ask for early, deliberate regrouping.','#9c9acb',.8,10,[[430,1],[210,0],[380,1],[230,0],[420,1],[200,0],[320,1]]],
 ['Home in the rain','Bring the flock through the headland and back to the roost.','#87b9bb',1,11,[[200,1],[420,0],[240,1],[400,0],[200,1],[420,0],[320,1]]]
];
const ROUTES=plans.map(([name,brief,color,wind,goal,rows],id)=>({id,name,brief,color,wind,goal,length:3360,speed:1.7+id*.1,rows:rows.map(([x,split],i)=>({z:440+i*420,x,split:!!split,name:split?'Split around the reed island':'Gather through the channel'}))}));
function objects(route){const food=[],hazards=[];for(const [i,row]of ROUTES[route].rows.entries()){if(row.split){hazards.push({x:row.x-43,w:86,z:row.z,h:66});for(const side of[-1,1])food.push({x:row.x+side*94,z:row.z-65,id:food.length});}else{hazards.push({x:0,w:row.x-55,z:row.z,h:66},{x:row.x+55,w:640-row.x-55,z:row.z,h:66});for(const dz of[-65,-100])food.push({x:row.x,z:row.z+dz,id:food.length});}}return{food,hazards};}
function run(){return{phase:'ready',frame:0,progress:0,x:320,spread:14,target:320,split:false,birds:Array.from({length:12},(_,i)=>({x:320+(i<6?-14:14)+(i%3-1)*8,y:354+Math.floor(i%6/3)*12,alive:true})),food:[],history:[],lost:0,message:'Choose a route. Set the wind, then take flight.'};}
function create(){return{version:1,route:0,records:[null,null,null,null],run:run()};}
function unlocked(s){return Math.min(3,s.records.findIndex(x=>!x)<0?3:s.records.findIndex(x=>!x));}
function start(s){if(s.run.phase!=='ready')return s;return{...s,run:{...s.run,phase:'play',message:'Shape the wind. The flock follows your hand.'}};}
function route(s,id){if(!Number.isInteger(id)||id<0||id>unlocked(s))return s;return{...s,route:id,run:run()};}
function retry(s){return{...s,run:run()};}
function next(s){return s.run.phase==='won'&&s.route<3?route(s,s.route+1):s;}
function count(s){return s.run.birds.filter(b=>b.alive).length;}
function medals(s){return 1+(count(s)===12?1:0)+(s.run.food.length===14?1:0);}
function tick(s,input={}){if(s.run.phase!=='play')return s;const o=ROUTES[s.route],old=s.run,r={...old,birds:old.birds.map(b=>({...b})),food:[...old.food],history:old.history.map(a=>[...a])};const target=Number.isFinite(input.x)?Math.round(clamp(input.x,65,575)):old.target,split=typeof input.split==='boolean'?input.split:old.split;r.target=target;r.split=split;r.frame++;r.progress+=o.speed;r.x+=clamp((target-r.x)*.065,-3.3,3.3)+Math.sin(r.frame/93)*o.wind;r.x=clamp(r.x,32,608);r.spread+=((split?94:14)-r.spread)*.075;
 const last=r.history[r.history.length-1];if(last&&last[0]===target&&last[1]===+split)last[2]++;else r.history.push([target,+split,1]);
 const {food,hazards}=objects(s.route);for(let i=0;i<12;i++){const b=r.birds[i];if(!b.alive)continue;const desired=r.x+(i<6?-r.spread:r.spread)+(i%3-1)*8;b.x+=clamp((desired-b.x)*.18,-5,5);b.x=clamp(b.x,8,632);const worldY=r.progress-(b.y-360);if(hazards.some(h=>b.x>h.x-5&&b.x<h.x+h.w+5&&Math.abs(worldY-h.z)<h.h/2+5)){b.alive=false;r.lost++;r.message='A bird turned back. The remaining flock can still reach home.';continue;}for(const f of food)if(!r.food.includes(f.id)&&Math.hypot(f.x-b.x,f.z-worldY)<24){r.food.push(f.id);r.message='Food gathered. Keep the flock together for the crossing.';}}
 let result={...s,run:r};if(count(result)<6){r.phase='lost';r.message='Too few birds to cross. Retry this route; earlier roosts are safe.';}else if(r.progress>=o.length){r.phase=r.food.length>=o.goal?'won':'lost';r.message=r.phase==='won'?'The roost is alive with wings.':'The flock arrived short of food. Try the outer feeding paths.';if(r.phase==='won'){const record={birds:count(result),food:r.food.length,medals:medals(result)},prev=s.records[s.route];result.records=s.records.map((p,i)=>i===s.route?{birds:Math.max(prev?.birds||0,record.birds),food:Math.max(prev?.food||0,record.food),medals:Math.max(prev?.medals||0,record.medals)}:p);}}
 return result;
}
function incoming(s){return ROUTES[s.route].rows.find(row=>row.z+55>s.run.progress)||null;}
function encode(s){return JSON.stringify({version:1,route:s.route,records:s.records,phase:s.run.phase,history:s.run.history});}
function decode(raw){let a;try{a=JSON.parse(raw);}catch(_){throw Error('Unreadable flight journal');}if(!a||a.version!==1||!Number.isInteger(a.route)||a.route<0||a.route>3||!Array.isArray(a.records)||a.records.length!==4||!Array.isArray(a.history)||a.history.length>2500||!['ready','play','won','lost'].includes(a.phase))throw Error('Invalid journal');let gap=false;for(const r of a.records){if(r===null){gap=true;continue;}if(gap||!r||!Number.isInteger(r.birds)||r.birds<6||r.birds>12||!Number.isInteger(r.food)||r.food<8||r.food>14||!Number.isInteger(r.medals)||r.medals<1||r.medals>3)throw Error('Invalid roost records');}
 let s=create();s.records=JSON.parse(JSON.stringify(a.records));if(a.route>unlocked(s))throw Error('Locked route');s=route(s,a.route);if(a.phase==='ready'){if(a.history.length)throw Error('Ready journal contains flight');return s;}s=start(s);let n=0;for(const h of a.history){if(!Array.isArray(h)||h.length!==3||!Number.isInteger(h[0])||h[0]<65||h[0]>575||![0,1].includes(h[1])||!Number.isInteger(h[2])||h[2]<1||(n+=h[2])>2500)throw Error('Invalid flight trail');for(let i=0;i<h[2];i++){if(s.run.phase!=='play')throw Error('Trail after landing');s=tick(s,{x:h[0],split:!!h[1]});}}if(s.run.phase!==a.phase)throw Error('Flight outcome differs');return s;
}
return{KEY,ROUTES,create,start,route,retry,next,tick,objects,incoming,count,medals,unlocked,encode,decode};});
