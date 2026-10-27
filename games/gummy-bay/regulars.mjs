// v172: street regulars. People you have talked to remember you (and you remember their names), so the
// second chat greets you as a regular and the talk card shows how you know them. Pure helpers.
export const REGULAR_AT=3;
export function noteMeeting(book,id,{name='',day=1}={}){
 const b=book&&typeof book==='object'?book:{},k=String(id),old=b[k]||{};
 const e={name:old.name||name,n:(old.n||0)+1,first:old.first||day,last:day,bought:old.bought||0};
 b[k]=e;return e;
}
export function noteRegularSale(book,id){const e=book?.[String(id)];if(e)e.bought=(e.bought||0)+1;return e||null;}
export function regularTag(e){
 if(!e||e.n<=1)return 'First time you\u2019ve met';
 return (e.n>=REGULAR_AT?'Regular':'Met before')+' \u00b7 '+e.n+' chats'+(e.bought?' \u00b7 bought '+e.bought:'');
}
const BACK={chatty:['Oh, it\u2019s you again! How\u2019s things?','Back again! Good to see ya.'],wary:['You again. ...What is it this time?','Hm. I remember you.'],grumpy:['You. Again.','Didn\u2019t I just see you?'],keen:['Hey! My favourite person!','Ooh, hi again!']};
const BUYER={chatty:'Hey, my candy friend! Got anything good?',wary:'...You got the usual?',grumpy:'Fine. Same as last time.',keen:'Yes! Tell me you brought gummies!'};
export function regularGreeting(e,mood='chatty'){
 if(!e||e.n<=1)return null;if(e.bought)return BUYER[mood]||BUYER.chatty;
 const set=BACK[mood]||BACK.chatty;return set[e.n%set.length];
}
