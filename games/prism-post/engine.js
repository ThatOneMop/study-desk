(function(root){'use strict';
const routes=[
 {name:'First delivery',path:[[0,3],[3,3],[3,0]],targets:[[3,1]]},
 {name:'Around the corner',path:[[0,5],[2,5],[2,2],[6,2]],targets:[[2,3],[5,2]]},
 {name:'The long way home',path:[[0,1],[5,1],[5,5],[1,5],[1,3]],targets:[[3,1],[3,5],[1,3]]},
 {name:'Three addresses',path:[[0,6],[3,6],[3,4],[6,4],[6,1],[1,1]],targets:[[3,5],[5,4],[2,1]]},
 {name:'Paper lanterns',path:[[0,0],[6,0],[6,6],[2,6],[2,2],[4,2],[4,4]],targets:[[4,0],[4,6],[2,4],[4,4]]},
 {name:'Switchback',path:[[0,2],[2,2],[2,0],[6,0],[6,6],[1,6],[1,4],[4,4]],targets:[[4,0],[6,3],[3,6],[4,4]]},
 {name:'Night mail',path:[[0,5],[5,5],[5,1],[1,1],[1,3],[3,3],[3,0]],targets:[[3,5],[5,3],[3,1],[2,3],[3,0]]},
 {name:'Last light',path:[[0,6],[6,6],[6,0],[1,0],[1,4],[4,4],[4,2],[2,2]],targets:[[3,6],[6,3],[3,0],[1,2],[3,4],[2,2]]}
];
const vec=(a,b)=>[Math.sign(b[0]-a[0]),Math.sign(b[1]-a[1])];
function level(i){const r=routes[i], mirrors=[];for(let k=1;k<r.path.length-1;k++){const p=r.path[k],a=vec(r.path[k-1],p),b=vec(p,r.path[k+1]);const solution=(-a[1]===b[0]&&-a[0]===b[1])?'/':'\\';mirrors.push({x:p[0],y:p[1],solution,value:k%3===0?solution:solution==='/'?'\\':'/'});}return {name:r.name,start:r.path[0],mirrors,targets:r.targets.map(p=>p.slice())};}
function trace(l){let [x,y]=l.start,dx=1,dy=0;const path=[],seen=new Set(),lit=new Set();for(let step=0;step<400;step++){if(x<0||x>6||y<0||y>6)break;const k=[x,y,dx,dy].join(',');if(seen.has(k))return {path,lit:[...lit],loop:true,won:false};seen.add(k);path.push([x,y]);l.targets.forEach((p,i)=>{if(p[0]===x&&p[1]===y)lit.add(i)});const m=l.mirrors.find(m=>m.x===x&&m.y===y);if(m){if(m.value==='/')[dx,dy]=[-dy,-dx];else [dx,dy]=[dy,dx];}x+=dx;y+=dy;}return {path,lit:[...lit],loop:false,won:lit.size===l.targets.length};}
const api={routes,level,trace};if(typeof module!=='undefined')module.exports=api;else root.PrismPost=api;
})(typeof window==='undefined'?globalThis:window);
