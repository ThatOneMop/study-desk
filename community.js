'use strict';
const REPO='ThatOneMop/study-desk', API='https://api.github.com/repos/'+REPO;
function weekKey(now=new Date()){
 const date=new Intl.DateTimeFormat('en-CA',{timeZone:'Australia/Sydney',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
 const get=t=>date.find(p=>p.type===t).value;
 const d=new Date(get('year')+'-'+get('month')+'-'+get('day')+'T12:00:00Z');
 d.setUTCDate(d.getUTCDate()-((d.getUTCDay()+6)%7));return d.toISOString().slice(0,10);
}
function el(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
function link(text,url){const a=el('a',text);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;}
async function get(path){const r=await fetch(API+path,{headers:{Accept:'application/vnd.github+json'}});if(!r.ok)throw Error(r.status===403||r.status===429?'GitHub is temporarily limiting requests. Try again later.':'Could not load GitHub data ('+r.status+').');return r.json();}
async function allIssues(){let result=[];for(let page=1;page<=20;page++){const rows=await get('/issues?state=all&sort=created&direction=desc&per_page=100&page='+page);result.push(...rows);if(rows.length<100)return result;}throw Error('Too many requests to load completely. Open GitHub to see the full list.');}
async function loadMessages(){
 const host=document.getElementById('messages'),button=document.getElementById('refreshMessages');button.disabled=true;
 try{const issue=await get('/issues/1');const page=Math.max(1,Math.ceil(issue.comments/30));const rows=await get('/issues/1/comments?per_page=30&page='+page);host.replaceChildren();host.append(el('p',rows.length?'Latest messages · open the lounge for the full conversation.':'No messages yet. Start the conversation!','meta'));
 for(const row of rows){const article=el('article',undefined,'entry');article.append(el('strong',row.user?.login||'Deleted account'),el('p',row.body),link('Reply on GitHub ↗',row.html_url));host.append(article);}
 }catch(e){host.replaceChildren(el('p',e.message),link('Open the player lounge ↗','https://github.com/'+REPO+'/issues/1'));}finally{button.disabled=false;}
}
async function loadVotes(){
 const host=document.getElementById('requestsList'),button=document.getElementById('refreshVotes');button.disabled=true;
 const prefix='[Game request '+weekKey()+'] ';document.getElementById('week').textContent='WEEK OF '+weekKey()+' · SYDNEY TIME';
 try{const rows=(await allIssues()).filter(r=>!r.pull_request&&r.title.startsWith(prefix));
 rows.sort((a,b)=>(b.reactions?.['+1']||0)-(a.reactions?.['+1']||0)||a.created_at.localeCompare(b.created_at)||a.number-b.number);
 host.replaceChildren();host.append(el('p',rows.length?'Live request totals. The weekly review combines duplicates and excludes votes outside the week.':'No requests this week yet. Suggest the first game!','meta'));
 rows.forEach((r,i)=>{const article=el('article',undefined,'entry');article.append(el('span','#'+(i+1)+' · ','rank'),el('strong',r.title.slice(prefix.length)),el('p',(r.reactions?.['+1']||0)+' votes · '+(r.state==='closed'?'closed':'open'), 'meta'),link('Vote 👍 / discuss ↗',r.html_url));host.append(article);});
 }catch(e){host.replaceChildren(el('p',e.message),link('View requests on GitHub ↗','https://github.com/'+REPO+'/issues'));}finally{button.disabled=false;}
}
function openIssue(title,body){const url=new URL('https://github.com/'+REPO+'/issues/new');url.searchParams.set('title',title);url.searchParams.set('body',body);window.location.assign(url.href);}
document.getElementById('feedbackForm').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target),name=String(f.get('game')).trim(),thoughts=String(f.get('thoughts')).trim();if(!name||!thoughts)return;openIssue('[Game feedback] '+name,'Game: '+name+'\n\n'+thoughts);});
document.getElementById('requestForm').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target),name=String(f.get('game')).trim(),repo=String(f.get('repo')).trim();if(!name)return;if(repo){const u=new URL(repo);if(u.protocol!=='https:'||u.hostname!=='github.com'||!/^\/[^/]+\/[^/]+\/?$/.test(u.pathname)){document.getElementById('formStatus').textContent='Use a repository URL such as https://github.com/owner/repository.';return;}}openIssue('[Game request '+weekKey()+'] '+name,'Requested game: '+name+'\nVoting week (Sydney Monday): '+weekKey()+'\nSuggested repository: '+(repo||'Not supplied')+'\n\n'+String(f.get('reason')).trim()+'\n\nVote with a 👍 reaction on this issue. A suitable licence and browser support are required.');});
document.getElementById('refreshMessages').addEventListener('click',loadMessages);document.getElementById('refreshVotes').addEventListener('click',loadVotes);loadMessages();loadVotes();
