import assert from 'node:assert/strict';
import {PHONE_APP_KEYS,PHONE_HOME_APPS,RELATION_BANDS,relationBand,buildContactBook,satisfactionContext,satisfactionView,satisfactionHTML,contactBookHTML} from '../dist/phone-contacts.mjs';

assert.deepEqual(PHONE_HOME_APPS.map(app=>app.key),['1','2','3','4','5','6']);
assert.deepEqual(PHONE_HOME_APPS.map(app=>PHONE_APP_KEYS[app.key]),PHONE_HOME_APPS.map(app=>app.screen));
assert.equal(PHONE_HOME_APPS[1].name,'Contacts');
assert.equal(PHONE_HOME_APPS[2].name,'Marketplace');
assert.equal(RELATION_BANDS.map(band=>band.label).join(','),'Stranger,Acquaintance,Regular,Trusted,Loyal');
for(const [score,label] of [[-4,'Stranger'],[0,'Stranger'],[14,'Stranger'],[15,'Acquaintance'],[39.9,'Acquaintance'],[40,'Regular'],[69,'Regular'],[70,'Trusted'],[89,'Trusted'],[90,'Loyal'],[150,'Loyal'],['nope','Stranger'],[Infinity,'Stranger']]){
 assert.equal(relationBand(score).label,label,score+' -> '+label);
}
assert.equal(relationBand(42).score,42);
assert.equal(relationBand(39.9).score,39);
assert(Object.isFrozen(relationBand(10)));

const state={relations:{0:42,1:-8,2:95},threads:{0:{status:'negotiating',messages:[{text:'Can you do 28?'}]},2:{messages:[{text:'Thanks for the last box.'}]}},deals:[{npc:2,t:0,qty:2,price:30,due:1},{npc:9,qty:'x'}],helpers:{seller:true},staffConfig:{seller:{route:'walk'}},dealers:[{name:'  <Rook>  ',area:'West slips',cut:20.4,relationship:80},'nope',{name:''},{cut:10},null,{name:'Ok',relationship:NaN}]};
const snapshot=JSON.stringify(state);
const book=buildContactBook({state,contacts:[{name:'Jules',role:'Late-shift regular',favourite:'Fizzy',line:'Working late.'},{name:'Benji',line:'Budget.'},{name:'Nina <b>',role:'Gardener',favourite:'Velvet',line:'Flavour.'}],strainNames:['Pine Pop']});
assert.equal(JSON.stringify(state),snapshot,'contact book does not mutate save data');
assert.equal(book.customers.length,3);
assert.equal(book.customers[0].band.label,'Regular');
assert.equal(book.customers[0].line,'Can you do 28?');
assert.equal(book.customers[0].negotiating,true);
assert.equal(book.customers[1].band.label,'Stranger');
assert.equal(book.customers[1].band.score,0);
assert.equal(book.customers[2].band.label,'Loyal');
assert.equal(book.customers[2].deal.label,'2 × Pine Pop · $30 each');
assert.equal(book.assistant.route,'walk');
assert.match(book.assistant.summary,/walks agreed orders/);
assert.equal(book.dealers.length,2);
assert.equal(book.dealers[0].name,'<Rook>');
assert.equal(book.dealers[0].cut,20);
assert.equal(book.dealers[0].relationship.label,'Trusted');
assert.equal(book.dealers[1].relationship,null);
assert.equal(buildContactBook({state:{helpers:{seller:true},staffConfig:{seller:{route:'timer'}}}}).assistant.summary.includes('90%'),true);
assert.match(buildContactBook({state:{}}).assistant.summary,/Nobody sells for you yet/);
assert.equal(buildContactBook({state:{dealers:'later'}}).dealers.length,0);
assert.equal(Object.isFrozen(book)&&Object.isFrozen(book.customers)&&Object.isFrozen(book.dealers),true);

const html=contactBookHTML(book);
assert.equal(html.includes('<Rook>'),false);
assert.equal(html.includes('&lt;Rook&gt;'),true);
assert.equal(html.includes('Nina &lt;b&gt;'),true);
assert.equal(html.includes('Nina <b>'),false);
assert.match(html,/role="meter"/);
assert.match(html,/aria-valuenow="42"/);
assert.match(html,/onclick="menu\('thread',0\)"/);
assert.match(html,/onclick="trackCustomer\(2\)"/);
assert.doesNotMatch(html,/not part of the bay yet/);
const empty=contactBookHTML(buildContactBook({state:{},contacts:[{name:'Jules',line:'Hello'}]}));
assert.match(empty,/not part of the bay yet/);
assert.match(empty,/Nobody sells for you yet/);
assert.match(empty,/Stranger/);

assert.equal(satisfactionContext({surface:'thread',negotiating:true,hasDeal:true}),'haggle');
assert.equal(satisfactionContext({surface:'customer',hasDeal:true,hasReceipt:true}),'waiting');
assert.equal(satisfactionContext({hasReceipt:true}),'delivered');
assert.equal(satisfactionContext({}),'meet');
const haggle=satisfactionView(72,'haggle');
assert.equal(haggle.label,'Trusted');
assert.match(haggle.text,/stretch a little/);
assert.equal(satisfactionView(3,'nope').context,'meet');
const strip=satisfactionHTML(satisfactionView(0,'meet'));
assert.match(strip,/data-band="stranger"/);
assert.match(strip,/They do not know your work yet/);
assert.equal(satisfactionHTML(satisfactionView(100,'delivered')).includes('They will be back'),true);
console.log('PASS: contact book reads relationships, deals and an optional dealers hook without mutating saves; satisfaction copy follows the same bands.');
