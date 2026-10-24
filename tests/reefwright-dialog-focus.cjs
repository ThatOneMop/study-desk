const {JSDOM}=require('jsdom'),fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(root+'/games/reefwright/index.html','utf8');
const dom=new JSDOM(html,{url:'https://example.test/games/reefwright/',runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window,d=w.document,$=id=>d.getElementById(id);
w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')};w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open')};w.requestAnimationFrame=fn=>{fn();return 1};d.hasFocus=()=>true;
w.eval(fs.readFileSync(root+'/games/reefwright/engine.js','utf8'));w.eval(fs.readFileSync(root+'/games/reefwright/game.js','utf8'));
assert.equal($('guide').getAttribute('aria-labelledby'),'guide-title');assert.equal($('confirm').getAttribute('aria-describedby'),'confirm-text');
$('help-button').focus();$('help-button').click();assert($('guide').open);assert.equal(d.activeElement,$('close-guide'));
let cancel=new w.Event('cancel',{cancelable:true});$('guide').dispatchEvent(cancel);assert(cancel.defaultPrevented);assert(!$('guide').open);assert.equal(d.activeElement,$('help-button'));
$('restart').focus();$('restart').click();assert($('confirm').open);assert.equal(d.activeElement,$('cancel-confirm'));
$('cancel-confirm').click();assert(!$('confirm').open);assert.equal(d.activeElement,$('restart'));
$('restart').click();$('accept-confirm').click();assert(!$('confirm').open);assert.equal(d.activeElement,$('restart'));assert.equal(w.Reefwright.board(w.Reefwright.profile().current).length,36);
$('restart').click();cancel=new w.Event('cancel',{cancelable:true});$('confirm').dispatchEvent(cancel);assert(cancel.defaultPrevented);assert(!$('confirm').open);assert.equal(d.activeElement,$('restart'));
// Focus restoration is deliberately suppressed if the document is inactive.
d.hasFocus=()=>false;$('help-button').focus();$('help-button').click();$('close-guide').click();assert.notEqual(d.activeElement,$('help-button'));
console.log('PASS Reefwright dialogs: names/descriptions, safe initial focus, button/Escape cancellation, accepted-action return and inactive-document guard.');
w.close();
