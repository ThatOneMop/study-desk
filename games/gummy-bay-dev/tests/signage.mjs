import assert from 'node:assert/strict';
import {layoutSignText,drawSignText,drawSignBoard,drawStockBoard} from '../dist/signage.mjs';
// Deliberately non-uniform widths: wide letters/punctuation are not char counts.
const measure=(s,size)=>Array.from(s).reduce((n,c)=>n+(/[MW@]/u.test(c)?.95:/[ilI ’·/]/u.test(c)?.27:.59)*size,0);
const names=['MILO’S GARDEN GOODS','HANK’S HARDWARE','ROOM 04 · WORKSHOP','CEDAR BAY LETTINGS','FRESH FLAVOURS / SMALL BATCH','EAST MARKET PACKAGING','NORTH HEIGHTS HARDWARE','NORTH SERVO INGREDIENTS','SUPPLIES / ROSTER','GRAMPS → PAYPHONE','COASTWAY • OPEN 24/7','MAKE IT SWEET'];
for(const text of names){const p=layoutSignText(text,measure);assert(!p.truncated,text);assert.equal(p.lines.join(' '),text);assert(p.lines.every(l=>measure(l,p.fontSize)<=960));assert(p.lines.length*p.lineHeight<=188);}
const narrow=layoutSignText('iiiiiiiiiiiiiiii',measure),wide=layoutSignText('WWWWWWWWWWWWWWWW',measure);assert(wide.lines.length>narrow.lines.length||wide.fontSize<narrow.fontSize);
const long=layoutSignText('Extraordinarilylongunbrokenoriginalword',measure,{width:150,height:120,maxFont:24,minFont:18,maxLines:3});assert(long.lines.every(l=>measure(l,long.fontSize)<=150));
for(const text of ['',null,'   two   spaces  ','Syrup 🌊 café','X'.repeat(10000)]){const p=layoutSignText(text,measure);assert(p.lines.length<=2);assert(p.lines.every(l=>measure(l,p.fontSize)<=960));assert(Number.isFinite(p.fontSize));}
assert(layoutSignText('X'.repeat(10000),measure).truncated);
assert(layoutSignText('x',()=>NaN).lines.length===1,'safe metric fallback');
assert(layoutSignText('x',measure,{maxFont:NaN,width:Infinity,minFont:-1}).fontSize>0);
for(let i=0;i<160;i++){
 const options={width:8+i*6,height:8+i%17*9,maxFont:8+i%113,minFont:8+i%70,maxLines:1+i%3};
 const p=layoutSignText('Wavy syrup and fizz '.repeat(i%24),measure,options);
 assert(p.lines.every(l=>measure(l,p.fontSize)<=options.width));assert(p.lines.length*p.lineHeight<=options.height);assert(p.lines.length<=options.maxLines);
}
const calls=[];const ctx={font:'',clearRect(){},fillRect(){},strokeRect(){},measureText(s){return {width:measure(s,Number(this.font.match(/ (\d+)px/)?.[1]??30))}},fillText(...args){calls.push(args)}};
for(const text of names){const p=drawSignBoard(ctx,text);assert(!p.truncated);assert(calls.every(c=>c.length===3),'no Canvas fillText maxWidth squeezing');}
for(const n of [0,1,40,160,400,999999]){const p=drawStockBoard(ctx,'STORED  '+n+' / 400','12 SHOWN  +'+n+' MORE','#405b42');assert(p.every(l=>!l.truncated));}
for(const text of ['Workshop roster · assignments and status','Gummy maker · Waiting: storage full','400 / 400 stored · Shelves full — collect packs','Ready to mix · choose a flavour']){const p=drawSignText(ctx,text,{x:24,y:12,width:720,height:104},{maxFont:36,minFont:22,weight:500});assert(!p.truncated);assert(p.lines.length<=2);}
console.log('PASS: original sign names, non-uniform measured fitting, word wrapping, bounded oversized/invalid input, stock counts/readiness text and unsqueezed canvas calls. Synthetic metrics, not browser typography or rendered legibility.');
