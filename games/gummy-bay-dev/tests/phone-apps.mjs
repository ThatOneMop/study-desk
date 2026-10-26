import assert from 'node:assert/strict';
import {DEAL_WINDOWS,dealWindow,acceptChance,buildInbox,inboxHTML,negotiationView,dealBubbleHTML,counterSheetHTML,contactGraphModel,contactGraphHTML,productRowsHTML} from '../dist/phone-apps.mjs';

assert.deepEqual(DEAL_WINDOWS.map(item=>item.id),['morning','afternoon','night','late']);
assert.equal(dealWindow(540),'morning');
assert.equal(dealWindow(900),'afternoon');
assert.equal(dealWindow(1200),'night');
assert.equal(dealWindow(60),'late');
assert.equal(dealWindow(1400),'late');
assert.equal(dealWindow(-30),'late');
assert.equal(acceptChance(27,30),100);
assert.equal(acceptChance(30,30),100);
assert.equal(acceptChance(31,30),0);
assert.equal(acceptChance('nope',30),0);

const state={threads:{0:{status:'negotiating',counter:27,max:30,qty:2,messages:[{mine:true,text:'Asking 40.'},{mine:false,text:'I could do $27 <b>'}]}},deals:[{npc:2,t:0,qty:1,price:30}]};
const snapshot=JSON.stringify(state);
const inbox=buildInbox({contacts:[{name:'Jules',swatch:'#c67562',line:'Working late.'},{name:'Benji',line:'Budget.'},{name:'Nina <b>',swatch:'red',locked:true}],threads:state.threads,deals:state.deals,strainNames:['Pine Pop']});
assert.equal(JSON.stringify(state),snapshot,'inbox does not mutate threads or deals');
assert.equal(inbox[0].unread,true);
assert.equal(inbox[0].counter,27);
assert.equal(inbox[0].swatch,'#c67562');
assert.equal(inbox[1].unread,false);
assert.equal(inbox[1].preview,'Budget.');
assert.equal(inbox[2].locked,true);
assert.equal(inbox[2].swatch,'#6d8f78');
assert.equal(inbox[2].deal,'1 × Pine Pop · $30 each');
const inboxHtml=inboxHTML(inbox);
assert.match(inboxHtml,/class="message-inbox"/);
assert.match(inboxHtml,/class="unread-dot"/);
assert.match(inboxHtml,/I could do \$27 &lt;b&gt;/);
assert.equal(inboxHtml.includes('I could do $27 <b>'),false);
assert.match(inboxHtml,/onclick="menu\('thread',0\)"/);
assert.doesNotMatch(inboxHtml,/onclick="menu\('thread',2\)"/);

const view=negotiationView({status:'negotiating',counter:27.2,max:30,qty:2},'Pine Pop',540);
assert.equal(view.theirPrice,27);
assert.equal(view.fair,30);
assert.equal(view.chance,100);
assert.equal(view.windowId,'morning');
assert.equal(negotiationView({status:'agreed',counter:10,max:12},'Pine Pop',0),null);
const bubble=dealBubbleHTML(0,view);
assert.match(bubble,/onclick="action\('offer',0,27\)"/);
assert.match(bubble,/onclick="openCounterSheet\(0\)"/);
assert.match(bubble,/>Reject</);
assert.doesNotMatch(bubble,/onclick="[^"]*Reject/);
assert.match(bubble,/Morning/);
assert.match(bubble,/disabled/);
const sheet=counterSheetHTML(0,view);
assert.match(sheet,/id="counterPrice"/);
assert.match(sheet,/data-fair="30"/);
assert.match(sheet,/id="counterChance">100%/);
assert.match(sheet,/onclick="action\('offer',0,Number\(document.getElementById\('counterPrice'\)\.value\)\)"/);
assert.match(sheet,/disabled/);
assert.match(sheet,/Product and quantity stay/);

const graph=contactGraphModel({selected:1,people:[
 {index:0,name:'Jules',swatch:'#c67562',score:40,district:'West side',craving:{name:'Pine Pop',level:55},effects:null,standards:''},
 {index:1,name:'Nina <b>',swatch:'#b9a567',score:90,district:'East side',craving:null,effects:['Velvet'],standards:'Pays on time.'},
 {index:4,name:'Locked',swatch:'#112233',score:0,locked:true}
]});
assert.equal(graph.focus,1);
assert.equal(graph.nodes[1].loyalty.filled,5);
assert.equal(graph.nodes[2].locked,true);
const graphHtml=contactGraphHTML(graph);
assert.match(graphHtml,/class="contact-graph"/);
assert.match(graphHtml,/Nina &lt;b&gt;/);
assert.equal(graphHtml.includes('Nina <b>'),false);
assert.match(graphHtml,/onclick="showContactCard\(1\)"/);
assert.match(graphHtml,/aria-label="Locked"/);
assert.match(graphHtml,/No craving recorded/);
assert.match(graphHtml,/Velvet/);
assert.match(graphHtml,/Pays on time/);
assert.match(graphHtml,/Loyalty 5 of 5/);

const products=productRowsHTML([{index:0,name:'Pine Pop',swatch:'#93c35b',effects:['Plain'],market:30,price:32,qty:2,packed:4,listed:true,recipe:'Grows from its seed.'},{index:1,name:'<Fizz>',swatch:'nope',effects:['Fizzy'],market:47,price:47,qty:1,packed:0,listed:false,recipe:'Mix it.'}]);
assert.match(products,/class="product-catalog"/);
assert.match(products,/aria-pressed="true"/);
assert.match(products,/>Listed</);
assert.match(products,/onclick="action\('list',0,Number\(document.getElementById\('prodQty0'\)\.value\),Number\(document.getElementById\('prodPrice0'\)\.value\)\)"/);
assert.match(products,/Market \$30 · 4 packed/);
assert.match(products,/&lt;Fizz&gt;/);
assert.match(products,/Grows from its seed/);
assert.match(products,/no separate unlist/);
console.log('PASS: messages, contact graph and product rows describe existing offers, cravings and listings without mutating them.');
