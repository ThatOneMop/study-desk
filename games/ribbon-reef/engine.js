/* Original Ribbon Reef rules and geometry. No third-party game assets. */
(function(root){
'use strict';
const KEY='study-desk-ribbon-reef-v1',NAMES=['Silver sprat','Amber fin','Pearl minnow','Protected ray'];
const fish=(list)=>list.map(([x,y,kind],id)=>({x,y,kind,id}));
const SITES=[
 {name:'Sandbar Post',budget:800,orders:[[1,1,0],[1,1,0],[1,1,0]],fish:fish([[120,110,0],[220,125,1],[390,110,0],[470,145,1],[150,300,0],[265,290,1],[420,300,3]]),coral:[{x:310,y:200,r:25}]},
 {name:'Coral Arch',budget:1100,orders:[[2,0,0],[0,2,0],[1,1,0]],fish:fish([[100,100,0],[190,280,0],[460,100,0],[235,100,1],[430,280,1],[520,220,1],[310,220,3]]),coral:[{x:140,y:195,r:22},{x:360,y:110,r:22}]},
 {name:'Pearl Channel',budget:1000,orders:[[1,1,0],[1,0,1],[0,1,1]],fish:fish([[100,100,0],[260,105,1],[470,100,0],[450,205,2],[130,300,1],[280,300,2],[330,190,3],[530,310,3]]),coral:[{x:195,y:205,r:28},{x:375,y:300,r:24}]}
];
const copy=x=>JSON.parse(JSON.stringify(x));
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
function segmentDistance(p,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],d=dx*dx+dy*dy,t=d?Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/d)):0;return dist(p,[a[0]+t*dx,a[1]+t*dy])}
function intersects(a,b,c,d){const ab1=cross(a,b,c),ab2=cross(a,b,d),cd1=cross(c,d,a),cd2=cross(c,d,b);if(((ab1>0&&ab2<0)||(ab1<0&&ab2>0))&&((cd1>0&&cd2<0)||(cd1<0&&cd2>0)))return true;return (ab1===0&&segmentDistance(c,a,b)<1e-8)||(ab2===0&&segmentDistance(d,a,b)<1e-8)||(cd1===0&&segmentDistance(a,c,d)<1e-8)||(cd2===0&&segmentDistance(b,c,d)<1e-8)}
function inside(p,points){let yes=false;for(let i=0,j=points.length-1;i<points.length;j=i++){const a=points[i],b=points[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])yes=!yes}return yes}
function outline(points,budget){if(!Array.isArray(points)||points.length<3||points.length>128||!points.every(p=>Array.isArray(p)&&p.length===2&&p.every(Number.isInteger)&&p[0]>=0&&p[0]<=600&&p[1]>=0&&p[1]<=400))return {ok:false,message:'Draw a loop with at least three corners, inside the water.'};
 for(let i=0;i<points.length;i++){const a=points[(i+points.length-1)%points.length],b=points[i],c=points[(i+1)%points.length];if(cross(a,b,c)===0&&(a[0]-b[0])*(c[0]-b[0])+(a[1]-b[1])*(c[1]-b[1])>0)return {ok:false,message:'The rope doubles back on itself.'}}
 let length=0,area=0;for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];if(dist(a,b)<1)return {ok:false,message:'Remove repeated corners.'};length+=dist(a,b);area+=a[0]*b[1]-b[0]*a[1];for(let j=i+1;j<points.length;j++){if(j===i+1||(i===0&&j===points.length-1))continue;if(intersects(a,b,points[j],points[(j+1)%points.length]))return {ok:false,message:'The rope crosses itself. Clear it and trace one simple loop.'}}}
 if(Math.abs(area)<200)return {ok:false,message:'Give the net a little more room.'};if(length>budget)return {ok:false,message:'Not enough rope. Try a tighter loop.',length:Math.ceil(length)};return {ok:true,length:Math.ceil(length)};
}
function initial(level){return{caught:[],order:0,frays:0,rope:0,phase:'active',last:'Ready for your first net.'}}
function inspect(level,b,points){if(b.phase!=='active')return {ok:false,message:'This trip is over. Retry or visit another reef.'};const site=SITES[level],g=outline(points,site.budget);if(!g.ok)return g;
 const near=(p,r)=>points.some((a,i)=>segmentDistance(p,a,points[(i+1)%points.length])<=r);
 const remaining=site.fish.filter(f=>!b.caught.includes(f.id));if(remaining.some(f=>near([f.x,f.y],18)))return {ok:false,message:'The rope touches a fish. Leave a little space around its body.',length:g.length};
 const caught=remaining.filter(f=>inside([f.x,f.y],points)),counts=[0,0,0];caught.forEach(f=>{if(f.kind<3)counts[f.kind]++});
 const coral=site.coral.some(c=>inside([c.x,c.y],points)||near([c.x,c.y],c.r));
 const protectedRay=caught.some(f=>f.kind===3),matched=counts.every((n,i)=>n===site.orders[b.order][i]);
 const success=!coral&&!protectedRay&&matched;
 return{ok:true,length:g.length,caught:caught.map(f=>f.id),counts,success,message:coral?'Coral snag. The catch is released.':protectedRay?'A protected ray entered the net. Everything is released.':!matched?'That catch does not match the order. Everything is released.':'Clean catch — delivered to the post.'};
}
function apply(level,b,points){const f=inspect(level,b,points);if(!f.ok)return null;const n=copy(b);n.last=f.message;n.rope+=f.length;if(f.success){n.caught.push(...f.caught);n.order++;if(n.order===3)n.phase='won'}else{n.frays++;if(n.frays===3)n.phase='lost'}return n}
function create(){return{v:1,level:0,moves:[],records:[null,null,null]}}
function board(s){let b=initial(s.level);for(const p of s.moves){b=apply(s.level,b,p);if(!b)throw Error('Invalid net journal')}return b}
function act(s,a){const n=copy(s);if(a==='undo'){if(!n.moves.length)return{ok:false};n.moves.pop()}
 else if(a==='retry')n.moves=[];
 else if(Number.isInteger(a)&&a>=0&&a<3){if(a>0&&n.records[a-1]===null)return{ok:false};n.level=a;n.moves=[]}
 else{const b=apply(s.level,board(s),a);if(!b)return{ok:false};n.moves.push(copy(a));if(b.phase==='won')n.records[n.level]=n.records[n.level]===null?b.rope:Math.min(n.records[n.level],b.rope)}
 return{ok:true,state:n};
}
function decode(raw){if(typeof raw!=='string'||raw.length>25000)throw Error('Save too large');const s=JSON.parse(raw);if(!s||s.v!==1||!Number.isInteger(s.level)||s.level<0||s.level>2||!Array.isArray(s.moves)||s.moves.length>5||!Array.isArray(s.records)||s.records.length!==3||!s.records.every(x=>x===null||(Number.isInteger(x)&&x>=3&&x<=5500)))throw Error('Invalid save');for(let i=1;i<3;i++)if((s.records[i]!==null||s.level>=i)&&s.records[i-1]===null)throw Error('Locked reef');const clean={v:1,level:s.level,moves:copy(s.moves),records:copy(s.records)},b=board(clean);if(b.phase==='won'&&(clean.records[clean.level]===null||clean.records[clean.level]>b.rope))throw Error('Missing record');return clean}
const api={KEY,NAMES,SITES,create,board,act,decode,inspect,outline,inside,segmentDistance};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.RibbonReef=api;
})(typeof globalThis!=='undefined'?globalThis:this);
