/* Reefwright: original deterministic habitat-placement engine. No external assets. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.Reefwright=api;})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const SIZE=6, ROUNDS=8;
const PIECES=[
 {name:'Coral sprig',cells:[[0,0,'C'],[1,0,'C'],[0,1,'K']]},
 {name:'Shell nook',cells:[[0,0,'N'],[1,0,'N'],[1,1,'C']]},
 {name:'Coral shelf',cells:[[0,0,'C'],[1,0,'C'],[2,0,'C']]},
 {name:'Kelp ribbon',cells:[[0,0,'K'],[1,0,'K'],[2,0,'K']]},
 {name:'Tidal cradle',cells:[[0,0,'N'],[0,1,'K'],[1,1,'N']]},
 {name:'Mixed bed',cells:[[0,0,'C'],[1,0,'N'],[2,0,'K']]},
 {name:'Shell terrace',cells:[[0,0,'C'],[1,0,'C'],[0,1,'N'],[1,1,'N']]},
 {name:'Kelp crown',cells:[[0,0,'K'],[1,0,'C'],[2,0,'K'],[1,1,'N']]},
 {name:'Little refuge',cells:[[0,0,'C'],[1,0,'N']]}
];
const STAGES=[
 {name:'First light',tag:'A sheltered beginning',rocks:[35],goals:{coral:4,nursery:1,kelp:3},par:14,deck:[[0,1,3],[1,2,4],[3,5,6],[0,4,8],[2,5,7],[1,3,6],[0,4,7],[1,5,8]],note:'First coast is shorter: 4 coral, 1 nursery, 3 kelp. A nursery needs coral beside it and a route through water to an edge.'},
 {name:'Split shoal',tag:'Work around the old stones',rocks:[8,14,20,27],goals:{coral:6,nursery:3,kelp:3},par:34,deck:[[6,3,0],[1,5,7],[0,4,2],[3,6,8],[5,1,2],[4,7,0],[3,6,1],[8,5,2]],note:'Stones split the bay. Leave a sea channel between your habitat clusters.'},
 {name:'Ribbon coast',tag:'A forest in the shallows',rocks:[0,1,6,29,34,35],goals:{coral:5,nursery:3,kelp:6},par:36,deck:[[3,0,4],[7,1,2],[3,5,6],[0,4,8],[3,6,1],[7,2,4],[0,3,8],[1,5,4]],note:'Only kelp in connected groups of at least three counts as forest.'},
 {name:'Cradle lagoon',tag:'Leave the water breathing',rocks:[7,10,25,28],goals:{coral:6,nursery:5,kelp:3},par:38,deck:[[6,3,4],[1,0,7],[2,4,5],[6,3,8],[1,7,0],[4,5,2],[3,6,1],[8,4,5]],note:'Nurseries can share a channel. A nursery at the edge has direct sea access.'},
 {name:'Living mosaic',tag:'Bring the whole reef home',rocks:[2,12,23,33],goals:{coral:7,nursery:4,kelp:6},par:42,deck:[[0,3,6],[1,7,2],[3,4,5],[6,0,8],[3,7,1],[2,4,6],[0,3,5],[1,8,4]],note:'Balance all three habitats. Bigger pieces help, but every filled channel can cost nursery habitat.'}
];
const clone=x=>JSON.parse(JSON.stringify(x));
const int=(x,a,b)=>Number.isInteger(x)&&x>=a&&x<=b;
const neighbors=i=>[i%SIZE>0?i-1:-1,i%SIZE<SIZE-1?i+1:-1,i>=SIZE?i-SIZE:-1,i<SIZE*(SIZE-1)?i+SIZE:-1].filter(x=>x>=0);
const edge=i=>i%SIZE===0||i%SIZE===SIZE-1||i<SIZE||i>=SIZE*(SIZE-1);
function fresh(stage=0){if(!int(stage,0,STAGES.length-1))throw Error('Unknown reef');return {stage,moves:[],finished:false};}
function shape(id,rotation=0){if(!int(id,0,PIECES.length-1)||!int(rotation,0,3))throw Error('Unknown piece');let cells=clone(PIECES[id].cells);for(let r=0;r<rotation;r++)cells=cells.map(([x,y,k])=>[-y,x,k]);let minX=Math.min(...cells.map(c=>c[0])),minY=Math.min(...cells.map(c=>c[1]));return cells.map(([x,y,k])=>[x-minX,y-minY,k]);}
function offers(s){return s.moves.length<ROUNDS?STAGES[s.stage].deck[s.moves.length]:[];}
function board(s){const b=Array(SIZE*SIZE).fill('.');STAGES[s.stage].rocks.forEach(i=>b[i]='#');for(const m of s.moves){const id=STAGES[s.stage].deck[bRound(s,m)][m.offer];for(const [dx,dy,k]of shape(id,m.rotation))b[(m.y+dy)*SIZE+m.x+dx]=k;}return b;}
function bRound(s,m){return s.moves.indexOf(m);}
function cellsFor(s,m){if(!m||!int(m.offer,0,2)||!int(m.rotation,0,3)||!int(m.x,0,SIZE-1)||!int(m.y,0,SIZE-1)||s.finished||s.moves.length>=ROUNDS)return null;const cells=shape(offers(s)[m.offer],m.rotation).map(([dx,dy,k])=>[m.x+dx,m.y+dy,k]);if(cells.some(([x,y])=>x>=SIZE||y>=SIZE))return null;const b=board(s);return cells.every(([x,y])=>b[y*SIZE+x]==='.')?cells:null;}
function place(s,m){if(!cellsFor(s,m))return null;return {...s,moves:[...s.moves,{offer:m.offer,rotation:m.rotation,x:m.x,y:m.y}]};}
function undo(s){return s.finished?{...s,finished:false}:s.moves.length?{...s,moves:s.moves.slice(0,-1)}:s;}
function finish(s){return {...s,finished:true};}
function groups(b,kind){let seen=new Set(),out=[];for(let i=0;i<b.length;i++){if(b[i]!==kind||seen.has(i))continue;let q=[i];seen.add(i);for(let j=0;j<q.length;j++)for(const n of neighbors(q[j]))if(b[n]===kind&&!seen.has(n)){seen.add(n);q.push(n);}out.push(q);}return out;}
function evaluate(s){const b=board(s),sea=new Set();const q=b.map((v,i)=>v==='.'&&edge(i)?i:-1).filter(i=>i>=0);q.forEach(i=>sea.add(i));for(let j=0;j<q.length;j++)for(const n of neighbors(q[j]))if(b[n]==='.'&&!sea.has(n)){sea.add(n);q.push(n);}
const coral=Math.max(0,...groups(b,'C').map(g=>g.length));const forests=groups(b,'K').filter(g=>g.length>=3).flat();const nurseryCells=b.map((v,i)=>v==='N'&&neighbors(i).some(n=>b[n]==='C')&&(edge(i)||neighbors(i).some(n=>sea.has(n)))?i:-1).filter(i=>i>=0);
const nursery=nurseryCells.length,kelp=forests.length,score=coral*2+nursery*3+kelp;const goal=STAGES[s.stage].goals,met=coral>=goal.coral&&nursery>=goal.nursery&&kelp>=goal.kelp;const medals=met?1+Number(score>=STAGES[s.stage].par)+Number(score>=STAGES[s.stage].par+6):0;
return {coral,nursery,kelp,score,met,medals,sea:[...sea],nurseryCells,forests};}
function legalMoves(s){const out=[];for(let offer=0;offer<offers(s).length;offer++)for(let rotation=0;rotation<4;rotation++)for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++){let m={offer,rotation,x,y};if(cellsFor(s,m))out.push(m);}return out;}
function replay(raw){if(!raw||!int(raw.stage,0,4)||!Array.isArray(raw.moves)||raw.moves.length>ROUNDS||typeof raw.finished!=='boolean')return null;let s=fresh(raw.stage);for(const m of raw.moves){s=place(s,m);if(!s)return null;}s.finished=raw.finished;return s;}
function profile(){return {version:1,current:fresh(),records:Array(5).fill(null)};}
function unlocked(p){let n=0;while(n<4&&p.records[n])n++;return n;}
function record(p){const s=p.current,e=evaluate(s);if(s.finished&&e.met&&(!p.records[s.stage]||evaluate(p.records[s.stage]).score<e.score))p.records[s.stage]=clone(s);return p;}
function restore(raw){if(!raw||raw.version!==1||!Array.isArray(raw.records)||raw.records.length!==5)return null;const p=profile();for(let i=0;i<5;i++){if(raw.records[i]===null)continue;const s=replay(raw.records[i]);if(!s||s.stage!==i||!s.finished||!evaluate(s).met||(i>0&&!p.records[i-1]))return null;p.records[i]=s;}const current=replay(raw.current);if(!current||current.stage>unlocked(p))return null;p.current=current;return record(p);}
return {SIZE,ROUNDS,PIECES,STAGES,fresh,shape,offers,board,cellsFor,place,undo,finish,evaluate,legalMoves,replay,profile,unlocked,record,restore,neighbors};
});
