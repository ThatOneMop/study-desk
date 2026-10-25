// Canvas-native lettering for the original town. No canvas maxWidth squeezing.
// Metrics are supplied by the current canvas font; Node tests use explicit mocks.
const clamp=(v,lo,hi,fallback)=>Number.isFinite(v)?Math.max(lo,Math.min(hi,v)):fallback;
export function layoutSignText(value,measure,options={}){
 const fullText=String(value??'').replace(/\s+/gu,' ').trim();
 const text=Array.from(fullText).slice(0,256).join('');
 const width=clamp(options.width,8,4096,960),height=clamp(options.height,8,1024,188);
 const maxFont=Math.floor(clamp(options.maxFont,8,120,86));
 const minFont=Math.min(maxFont,Math.floor(clamp(options.minFont,8,120,28)));
 const maxLines=Math.floor(clamp(options.maxLines,1,3,2)),leading=clamp(options.leading,1,1.5,1.1);
 const sizeOf=(s,size)=>{const n=measure?.(s,size);return Number.isFinite(n)&&n>=0?n:Array.from(s).length*size;};
 function wrap(size){
  const lines=[];let line='';
  for(const word of text.split(' ').filter(Boolean)){
   const trial=line?line+' '+word:word;
   if(sizeOf(trial,size)<=width){line=trial;continue;}
   if(line){lines.push(line);line='';}
   // Overlong words are split only at code-point boundaries, never squashed.
   for(const char of Array.from(word)){
    if(line&&sizeOf(line+char,size)>width){lines.push(line);line='';}
    line+=char;
   }
  }
  if(line)lines.push(line);return lines;
 }
 for(let fontSize=maxFont;fontSize>=minFont;fontSize--){
  const lines=wrap(fontSize);
  if(lines.length<=maxLines&&lines.length*fontSize*leading<=height&&lines.every(l=>sizeOf(l,fontSize)<=width)&&text===fullText)
   return {fullText,lines,fontSize,lineHeight:fontSize*leading,truncated:false};
 }
 // Exceptional oversized input is explicitly marked, with the full wording
 // retained in metadata/DOM guidance. Authored signs must never take this path.
 const fontSize=Math.min(minFont,Math.max(1,Math.floor(height/leading)));
 const count=Math.max(1,Math.min(maxLines,Math.floor(height/(fontSize*leading))));
 const lines=wrap(fontSize).slice(0,count).map(line=>{const chars=Array.from(line);while(chars.length&&sizeOf(chars.join(''),fontSize)>width)chars.pop();return chars.join('');});if(!lines.length)lines.push('');
 let tail=Array.from(lines.at(-1));while(tail.length&&sizeOf(tail.join('')+'…',fontSize)>width)tail.pop();
 lines[lines.length-1]=sizeOf('…',fontSize)<=width?tail.join('')+'…':'';
 return {fullText,lines,fontSize,lineHeight:fontSize*leading,truncated:true};
}

export function drawSignText(ctx,text,box,options={}){
 const weight=options.weight??900,family='sans-serif';
 const layout=layoutSignText(text,(line,size)=>{ctx.font=`${weight} ${size}px ${family}`;return ctx.measureText(line)?.width;},{...options,width:box.width,height:box.height});
 ctx.font=`${weight} ${layout.fontSize}px ${family}`;ctx.textAlign='center';ctx.textBaseline='middle';
 const center=box.y+box.height/2,first=center-(layout.lines.length-1)*layout.lineHeight/2;
 layout.lines.forEach((line,i)=>ctx.fillText(line,box.x+box.width/2,first+i*layout.lineHeight));
 return layout;
}

export function drawSignBoard(ctx,text,bg='#425f4e',fg='#fff1ca'){
 const t=String(text),hardware=/HANK|HARDWARE|MOTORS/i.test(t),motel=/ROOM|PALM|VACANCY|LETTINGS/i.test(t),food=/MILO|GARDEN|FLAVOUR|SEED/i.test(t);
 const base=hardware?'#4b514d':motel?'#ddd1ac':food?'#344b3d':'#303b3a',ink=motel?'#453c35':'#e0d6b8';
 ctx.clearRect(0,0,1024,256);ctx.fillStyle=base;ctx.fillRect(0,0,1024,256);
 // Thin painted rules and sun-faded enamel, not a heavy framed billboard.
 ctx.fillStyle=hardware?'#ac8058':motel?'#82634b':'#91a083';ctx.fillRect(0,231,1024,5);
 ctx.fillStyle='#ffffff09';for(let i=0;i<28;i++)ctx.fillRect((i*127)%1024,(i*43)%250,20+i%17,2);
 ctx.fillStyle=ink;
 return drawSignText(ctx,t,{x:38,y:22,width:948,height:192},{maxFont:83,minFont:26,weight:motel?500:650});
}

export function drawStockBoard(ctx,heading,detail,bg){
 ctx.clearRect(0,0,1024,256);ctx.fillStyle=bg;ctx.fillRect(0,0,1024,256);ctx.fillStyle='#fff1ca';
 return [drawSignText(ctx,heading,{x:30,y:22,width:964,height:110},{maxFont:80,minFont:28,maxLines:1,weight:700}),
  drawSignText(ctx,detail,{x:30,y:148,width:964,height:78},{maxFont:44,minFont:22,maxLines:1,weight:500})];
}
