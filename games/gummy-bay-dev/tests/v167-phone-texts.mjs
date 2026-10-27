import assert from 'node:assert/strict';import fs from 'node:fs';
import {contactPalette,smsHeadHTML,smsComposeHTML,restyleThread,portraitInbox,nameHash} from '../dist/phone-texts.mjs';
// Portrait palettes come from the contact's own outfit and skin, with a stable hair colour per name.
const p=contactPalette({name:'Jules',color:0xc67562,skin:0xc68d6a});assert.equal(p.outfit,0xc67562);assert.equal(p.skin,0xc68d6a);
assert.equal(contactPalette({name:'Jules'}).hair,p.hair);assert.equal(nameHash('Jules'),nameHash('Jules'));
// Header: back button, round portrait, name centred; escaped.
const head=smsHeadHTML({name:'Jo<b>',sub:'Nurse · mobile',avatar:'data:image/png;base64,AA'});
assert.match(head,/class="sms-back"/);assert.match(head,/class="sms-avatar" src="data:image\/png;base64,AA"/);assert.match(head,/Jo&lt;b&gt;/);
assert.match(smsHeadHTML({name:'Kit'}),/sms-initial[^>]*>K</);
// Compose bar keeps the real text action and its disabled state.
const send=smsComposeHTML({placeholder:'Create a listing first.',action:"action('text',0)",disabled:true});
assert.match(send,/onclick="action\('text',0\)"/);assert.match(send,/ disabled>/);
assert.equal(restyleThread(null),null);assert.equal(portraitInbox(null),0);
// Wired in: game.js imports it, the menu wrapper decorates thread and inbox, the page loads the stylesheet.
const game=fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8'),html=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8'),css=fs.readFileSync(new URL('../dist/phone-texts.css',import.meta.url),'utf8');
assert.match(game,/phone-texts\.mjs\?v=167/);assert.match(game,/restyleThread\(m,/);assert.match(game,/portraitInbox\(m,/);
assert.match(html,/phone-texts\.css\?v=167/);
assert.match(css,/\.message\.mine\{[^}]*background:#30c158/,'your bubbles are green');assert.match(css,/#modal\.sms-screen\{background:#fff/,'white screen');
console.log('PASS v167 Messages app: white texting screen, centred portrait/name header, green outgoing bubbles, compose bar');
