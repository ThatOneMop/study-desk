(function(root){'use strict';
const levels=[
{name:'The first lock',rows:['#######','#A.SGD#','#.#####','#..C..#','#######'],gold:12},
{name:'Shoal water',rows:['#######','#A.l.C#','#.#.#.#','#..h.D#','#######'],gold:7},
{name:'Two parcels',rows:['#######','#A.l.C#','#.#h#.#','#S.G.D#','#C....#','#######'],gold:14},
{name:'The lock island',rows:['#######','#A.l.C#','#.#.#.#','#ShG.D#','#.#.#.#','#C.h..#','#######'],gold:16},
{name:'Evening channels',rows:['#######','#Al..C#','#.###.#','#S.G.D#','#.###.#','#C.h.C#','#######'],gold:17},
{name:'The last crossing',rows:['#######','#A.h.C#','#l#.#l#','#S.G.D#','#h#.#h#','#C.l.C#','#######'],gold:20}
];
function create(index){const l=levels[index];let x=0,y=0,total=0;l.rows.forEach((r,j)=>[...r].forEach((c,i)=>{if(c==='A'){x=i;y=j;}if(c==='C')total++;}));return {index,x,y,tide:0,lock:false,cargo:[],total,turns:0,won:false,message:'Collect every parcel, then bring the boat to the striped dock.'};}
function tile(s,x,y){return (levels[s.index].rows[y]||'')[x]||'#';}
function act(s,action){if(s.won)return false;if(action==='tide'){const t=tile(s,s.x,s.y);if(t==='l'||t==='h'){s.message='Change the tide from deep water, away from the shoals.';return false;}s.tide=1-s.tide;s.turns++;s.message=s.tide?'High tide: pale high channels are open.':'Low tide: the sandy shallows are open.';return true;}const delta={left:[-1,0],right:[1,0],up:[0,-1],down:[0,1]}[action];if(!delta)return false;const x=s.x+delta[0],y=s.y+delta[1],t=tile(s,x,y);if(t==='#'){s.message='Land ahead. Choose another channel.';return false;}if(t==='G'&&!s.lock){s.message='The lock is closed. Sail onto the brass wheel to open it.';return false;}if(t==='l'&&s.tide!==0||t==='h'&&s.tide!==1){s.message='This channel needs '+(t==='l'?'low':'high')+' tide. Change the tide from deep water.';return false;}s.x=x;s.y=y;s.turns++;s.message='Follow the channels to collect the mail.';if(t==='S'){s.lock=true;s.message='Lock opened. Its gates stay open for this delivery.';}const key=x+','+y;if(t==='C'&&!s.cargo.includes(key)){s.cargo.push(key);s.message='Parcel aboard. '+s.cargo.length+' of '+s.total+' collected.';}if(t==='D'){if(s.cargo.length===s.total){s.won=true;s.message='Delivered! Every parcel is safe at the dock.';}else s.message='The dock is ready, but '+(s.total-s.cargo.length)+' parcels still need collecting.';}return true;}
const api={levels,create,tile,act};if(typeof module!=='undefined')module.exports=api;else root.TidalSwitch=api;
})(typeof window==='undefined'?globalThis:window);
