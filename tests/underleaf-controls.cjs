const assert=require('node:assert/strict'),fs=require('fs'),{JSDOM}=require('jsdom');
const root=__dirname+'/../',html=fs.readFileSync(root+'games/underleaf/index.html','utf8');
function boot(){
 const dom=new JSDOM(html,{url:'https://example.test/underleaf/',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window,d=w.document,$=id=>d.getElementById(id);
 w.requestAnimationFrame=()=>1;w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(_,k)=>k==='createLinearGradient'?()=>({addColorStop(){}}):()=>{}});
 for(const name of ['save-store.js','recovery.js'])w.eval(fs.readFileSync(root+'games/underleaf/'+name,'utf8'));
 for(const script of d.querySelectorAll('script:not([src])'))w.eval(script.textContent+'\nwindow.probe={get state(){return s},get sources(){return sources},tick,refresh};');
 return {w,d,$,p:w.probe,close:()=>w.close()};
}
let g=boot();assert(g.$('gather0'),'manual gathering must have a keyboard-focusable control');
for(let i=0;i<4;i++){assert.equal(g.$('gather'+i).tagName,'BUTTON');assert(g.$('gather'+i).disabled);g.$('gather'+i).click()}
assert.equal(g.p.state.food,20,'intro prevents gathering');
g.$('start').click();assert.equal(g.d.activeElement,g.$('gather0'),'start restores useful keyboard focus');
for(let i=0;i<4;i++){
 const before=g.p.state.food,stock=g.p.sources[i].stock;g.$('gather'+i).focus();g.$('gather'+i).click();
 assert.equal(g.p.state.food,before+2);assert.equal(g.p.sources[i].stock,stock-1);assert.equal(g.d.activeElement,g.$('gather'+i));
 assert.equal(JSON.parse(g.w.localStorage.getItem('underleaf-v1')).food,g.p.state.food);assert.match(g.$('gatherStatus').textContent,/Collected 2 food/);
}
for(let i=0;i<7;i++)g.$('gather0').click();assert.equal(g.p.sources[0].stock,0);assert(g.$('gather0').disabled);assert.match(g.$('sourceStatus0').textContent,/Regrowing/);
const emptyFood=g.p.state.food;g.$('gather0').click();assert.equal(g.p.state.food,emptyFood,'exhausted source grants nothing');
g.p.tick(2);g.p.refresh();assert(!g.$('gather0').disabled,'existing regrowth re-enables control');
g.$('pause').click();const paused=g.p.state.food;for(let i=0;i<4;i++){assert(g.$('gather'+i).disabled);g.$('gather'+i).click()}assert.equal(g.p.state.food,paused);
g.$('pause').click();g.p.state.carry=2;g.p.refresh();assert.match(g.$('sourceStatus1').textContent,/\+4 food/);const upgraded=g.p.state.food;g.$('gather1').click();assert.equal(g.p.state.food,upgraded+4);
// Actual canvas listener and the visible control must use the same source/reward path.
const canvas=g.$('game');canvas.getBoundingClientRect=()=>({left:0,top:0,width:1000,height:810});
const before=g.p.state.food,stock=g.p.sources[2].stock;
canvas.dispatchEvent(new g.w.MouseEvent('pointerdown',{clientX:710,clientY:153,bubbles:true}));assert.equal(g.p.state.food,before+4);assert.equal(g.p.sources[2].stock,stock-1);
const beforeKey=g.p.state.food;g.d.dispatchEvent(new g.w.KeyboardEvent('keydown',{key:'1',bubbles:true}));assert.equal(g.p.state.food,beforeKey,'no global shortcut steals typing');
g.$('gather2').focus();g.p.refresh();assert.equal(g.d.activeElement,g.$('gather2'),'refresh never moves focus');g.close();
console.log('PASS Underleaf controls: named native buttons, intro/start focus, four matching sources, rewards/save, exhaustion/regrowth, pause, upgrades, canvas parity and no global key binding');
