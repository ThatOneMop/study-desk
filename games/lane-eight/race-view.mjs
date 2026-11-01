// Original canvas stadium and perspective camera. Race physics and save formats stay shared.
export function drawChasePool(ctx,s,{clock,playing,paused,countdown,drawSwimmer,narrow}){
 const motion=playing&&!paused&&countdown===0;
 const reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 const t=motion?s.time:0, waterTime=reduced?0:clock;
 const lap=Math.floor(Math.max(0,s.d-.0001)/50), dir=lap%2?-1:1;
 const progress=s.d-lap*50, remain=Math.max(0,50-progress);
 const cx=500, horizon=155, focal=narrow?215:360;
 const project=(lane,z)=>{const depth=Math.max(3.3,z+8);return{x:cx+(lane-3)*2.5*focal/depth,y:horizon+1700/depth,k:8/depth};};
 const line=(a,b,color,width=1)=>{ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();};
 const poly=(points,color)=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fillStyle=color;ctx.fill();};
 const label=(str,x,y,size=14,color='#effbff')=>{ctx.font=`600 ${size}px Arial`;ctx.textAlign='center';ctx.fillStyle=color;ctx.fillText(str,x,y);};
 const ellipse=(x,y,rx,ry,color)=>{ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();};
 let sky=ctx.createLinearGradient(0,0,0,580);sky.addColorStop(0,'#17374e');sky.addColorStop(.32,'#7197a0');sky.addColorStop(.34,'#46bac3');sky.addColorStop(1,'#076782');ctx.fillStyle=sky;ctx.fillRect(0,0,1000,580);
 // A softly lit outdoor aquatic stadium: seating, roof trusses and floodlights.
 for(let row=0;row<4;row++){ctx.fillStyle=row%2?'#294e5b':'#345c65';ctx.fillRect(0,88+row*15,1000,15);for(let i=0;i<78;i++)ellipse(i*13+row*4,91+row*15,2.5,3,['#8eaeb2','#d3b7a2','#416372'][i%3]);}
 line({x:0,y:65},{x:1000,y:65},'#9bbbc066',3);
 for(let x=30;x<1000;x+=180){line({x,y:64},{x:x+40,y:15},'#87a8b666',2);line({x:x+40,y:15},{x:x+180,y:65},'#87a8b655',2);ctx.fillStyle='#edf9e5';ctx.fillRect(x+35,10,36,4);}
 ctx.fillStyle='#102e3e';ctx.fillRect(370,86,260,51);label('LANE EIGHT',500,108,17,'#d4f895');label('A Q U A T I C   C L U B',500,125,9,'#9ec2c9');
 const wall=project(3,remain),left=project(-.5,remain),right=project(5.5,remain);
 poly([{x:0,y:153},{x:1000,y:153},{x:1000,y:wall.y-8},{x:0,y:wall.y-8}],'#91aead');
 poly([{x:0,y:wall.y-8},{x:1000,y:wall.y-8},{x:1000,y:wall.y},{x:0,y:wall.y}],'#ecdfc1');
 poly([left,right,project(5.5,-4),project(-.5,-4)],'#158fa5');
 ctx.save();ctx.beginPath();[left,right,project(5.5,-4),project(-.5,-4)].forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.clip();
 let water=ctx.createLinearGradient(0,wall.y,0,580);water.addColorStop(0,'#60c5cb');water.addColorStop(.5,'#219db2');water.addColorStop(1,'#087493');ctx.fillStyle=water;ctx.fillRect(0,wall.y,1000,580);
 // Tiles advance toward the camera with actual travelled distance, giving speed a visible scale.
 for(let z=Math.ceil(progress-4);z<=50;z+=1){const rel=z-progress;if(rel<-4)continue;line(project(-.5,rel),project(5.5,rel),'#b5efdd20',1);}
 for(let l=-.5;l<=5.5;l+=.25)line(project(l,remain),project(l,-4),'#a5e9dc15',1);
 for(let lane=0;lane<6;lane++){line(project(lane,remain-1),project(lane,-4),'#09516e88',7);line(project(lane-.25,remain-1),project(lane+.25,remain-1),'#09516e88',5);}
 for(let i=0;i<90;i++){let z=((i*.631+waterTime*.45)%50)-3.8;if(z>remain)continue;let l=(i*1.618)%6-.5;let p=project(l,z);ctx.strokeStyle='#dcfff344';ctx.lineWidth=Math.max(.5,p.k);ctx.beginPath();ctx.ellipse(p.x+Math.sin(waterTime+i)*5*p.k,p.y,14*p.k,2.4*p.k,0,0,Math.PI*2);ctx.stroke();}
 ctx.restore();
 // Floating lane ropes have perspective-scaled highlights and alternating race colours.
 for(let l=-.5;l<=5.5;l++){line(project(l,remain),project(l,-4),'#133e5370',5);for(let z=50;z>=0;z-=.45){const rel=z-progress;if(rel<-4||rel>remain)continue;const p=project(l,rel);ellipse(p.x,p.y,Math.max(1,4*p.k),Math.max(.8,2.6*p.k),z<5||z>45?'#ee7c5b':l===2.5||l===3.5?'#f3d36c':Math.round(z/.45)%2?'#ebf5df':'#3282b3');}}
 for(let lane=0;lane<6;lane++){const p=project(lane,remain);ctx.fillStyle='#234d62';ctx.fillRect(p.x-18*p.k,p.y-23*p.k,36*p.k,16*p.k);ctx.fillStyle='#f0ead1';ctx.fillRect(p.x-19*p.k,p.y-26*p.k,38*p.k,9*p.k);label(String(lane+1),p.x,p.y-10*p.k,Math.max(8,12*p.k),'#183b50');}
 // Same physical positions as the overview, including opponents swimming the return length.
 const swimmers=Array.from({length:6},(_,lane)=>{const distance=lane===3?s.d:s.ai[lane>3?lane-1:lane];const al=Math.floor(Math.max(0,distance-.0001)/50),ap=distance-al*50;const physical=al%2?50-ap:ap;const own=dir===1?progress:50-progress;return{lane,z:lane===3?0:dir*(physical-own),facing:(al%2?-1:1)*dir};}).sort((a,b)=>b.z-a.z);
 const colors=['#e88068','#758bd9','#98dfca','#d4f895','#f4bf72','#d4b6e3'];
 for(const swimmer of swimmers){const {lane,z,facing}=swimmer;if(z<-3.2||z>remain+.2)continue;const p=project(lane,z);let phase=motion?(s.time*9+lane):lane;
  for(let j=0;j<8;j++){const q=project(lane,z-facing*(.35+j*.2));ctx.strokeStyle=`rgba(213,255,250,${.3-j*.03})`;ctx.lineWidth=1.5*p.k;ctx.beginPath();ctx.ellipse(q.x,q.y,(9+j*3)*p.k,3*p.k,0,0,Math.PI*2);ctx.stroke();}
  ctx.save();ctx.translate(p.x,p.y);ctx.scale(p.k*(narrow?1.1:1.35),p.k*1.15);ctx.rotate(-Math.PI/2);drawSwimmer(0,0,colors[lane],phase,facing,lane===3);ctx.restore();
  if(motion){for(let i=0;i<10;i++){const q=(t*1.9+i*.13)%1;const side=i%2?-1:1;ellipse(p.x+side*(14+q*25)*p.k,p.y-18*p.k-Math.sin(q*Math.PI)*16*p.k,Math.max(.6,(1-q)*2.4*p.k),Math.max(.6,(1-q)*1.6*p.k),'#e7ffffb0');}}
  if(lane===3){label('YOU',p.x,p.y+62*p.k,11,'#edffc2');}
 }
 // A visible approach prompt and stroke feedback bring attention back to the water.
 if(playing&&!s.done&&!countdown){const message=s.turn?'PUSH OFF · SPACE':remain<7?(s.d+remain>=s.distance?'FINISH WALL':'TURN WALL')+' · '+remain.toFixed(1)+' m':s.distance-s.d<15?'FINAL LENGTH · SAVE YOUR LAST SPRINT':'SETTLE INTO YOUR RHYTHM';
 ctx.fillStyle='#092d3bdd';ctx.fillRect(300,492,400,47);label(message,500,512,13,s.turn||remain<7?'#f9dc93':'#d4f895');label(s.speed.toFixed(1)+' m/s  ·  '+(s.lastSide==='left'?'RIGHT / D':'LEFT / A')+' NEXT',500,529,11,'#bddde1');}
 const vignette=ctx.createRadialGradient(500,300,100,500,300,650);vignette.addColorStop(0,'#001d3000');vignette.addColorStop(1,'#001d3066');ctx.fillStyle=vignette;ctx.fillRect(0,0,1000,580);
}
