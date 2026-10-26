const {JSDOM}=require('jsdom'),fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const gradient={addColorStop(){}};
function stub(window){
 window.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(o,k)=>k==='createLinearGradient'||k==='createRadialGradient'?()=>gradient:k==='measureText'?()=>({width:12}):o[k]??(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
 window.requestAnimationFrame=()=>0;window.scrollTo=()=>{};window.confirm=()=>false;
}
function boot(file){
 const html=fs.readFileSync(path.join(root,file),'utf8');
 const dom=new JSDOM(html,{url:'http://study.test/'+file,runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window,errors=[];
 stub(w);
 const base=path.dirname(file);
 for(const src of [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(match=>match[1])){
  let source=fs.readFileSync(path.normalize(path.join(root,base,src.split('?')[0])),'utf8');
  if(src.endsWith('app.js'))source+=';if(typeof start==="function")globalThis.start=start;if(typeof openGame==="function")globalThis.openGame=openGame;';
  w.eval(source);
 }
 const inline=[...html.matchAll(/<script>([^<]+)<\/script>/g)].map(match=>match[1]).join('\n');
 if(inline)w.eval(inline);
 return {dom,w,errors};
}
const routes=[
 ['games/harbourlight/index.html','Harbourlight — Afterlight','play'],
 ['games/cloud-courier/index.html','Cloud Courier — Afterlight','play'],
 ['games/lumen-grove/index.html','Lumen Grove — Afterlight','play'],
 ['games/nightshift-garden/index.html','Garden Gone Rogue — Nightshift','game'],
 ['games/nightshift-rent/index.html','Rent Is Due — Nightshift','game'],
 ['games/nightshift-slime/index.html','Lunchbreak Slime — Nightshift','game']
];
for(const [file,title,view] of routes){
 const {dom,errors}=boot(file),d=dom.window.document;
 assert.deepEqual(errors,[],'errors in '+file);
 assert.equal(d.title,title,file);
 assert.equal(d.getElementById(view).hidden,false,file+' should open its game');
 assert.equal(d.getElementById(view==='play'?'library':'lobby').hidden,true,file);
 assert(d.getElementById('save-status').textContent.length>0,file+' save status');
 dom.window.close();
}
console.log('PASS direct collection routes: Afterlight and Nightshift pages boot into the named game with save controls.');
