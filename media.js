'use strict';
(() => {
 const byId=id=>document.getElementById(id);
 let section='games';
 const data=window.MEDIA_CATALOG;
 const make=(tag,text,cls)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(cls)node.className=cls;return node};
 const link=(text,url,cls)=>{const a=make('a',text,cls);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a};
 function render(){
  const words=byId('mediaSearch').value.trim().toLowerCase().split(/\s+/);
  const list=data.filter(item=>item.type===section&&words.every(word=>(item.title+' '+item.genre+' '+item.description).toLowerCase().includes(word))&&(byId('mediaGenre').value==='all'||item.genre===byId('mediaGenre').value)&&(section==='tv'||byId('mediaRating').value==='all'||item.rating===byId('mediaRating').value));
  if(byId('mediaSort').value==='az')list.sort((a,b)=>a.title.localeCompare(b.title));
  const grid=byId('mediaGrid');grid.replaceChildren();byId('mediaCount').textContent=list.length+' '+(section==='tv'?'shows':'movies')+' shown';
  if(!list.length){grid.append(make('p','Nothing matches yet. Try another search or reset the filters.','empty'));return}
  for(const item of list){
   const card=make('article',undefined,'media-card');
   const art=make('div',undefined,'media-art');art.dataset.genre=item.genre;
   art.append(make('span',item.genre,'eyebrow'),make('strong',item.title));
   const body=make('div',undefined,'media-body');
   body.append(make('h3',item.title),make('p',item.year+' · '+(section==='tv'?item.seasons+' seasons':item.rating+' · AU'),'media-meta'),make('p',item.description));
   const url=item.type==='tv'?'https://www.justwatch.com/au/tv-show/'+item.slug:'https://www.justwatch.com/au/search?q='+encodeURIComponent(item.title);
   body.append(link('Find where to watch ↗',url,'watch-link'));
   if(item.type==='tv'){
    const details=make('details'),summary=make('summary','Browse all '+item.seasons+' seasons');details.append(summary);
    details.append(make('p','Check each season for available services and episodes.','media-meta'));
    const seasons=make('div',undefined,'season-links');
    for(let n=1;n<=item.seasons;n++)seasons.append(link('Season '+n,url+'/season-'+n));
    details.append(seasons);body.append(details);
   }
   card.append(art,body);grid.append(card);
  }
 }
 function resetFilters(){byId('mediaSearch').value='';byId('mediaGenre').value='all';byId('mediaRating').value='all';byId('mediaSort').value='featured'}
 window.selectEntertainment=(next,focus=true)=>{
  if(!['games','movies','tv'].includes(next))return;
  const changed=next!==section;section=next;
  byId('gameCollection').hidden=section!=='games';byId('mediaCollection').hidden=section==='games';
  for(const name of ['games','movies','tv']){const tab=byId(name+'Tab');if(name===section)tab.setAttribute('aria-current','page');else tab.removeAttribute('aria-current')}
  if(section==='games')return;
  if(changed){resetFilters();byId('mediaGenre').replaceChildren(new Option('All genres','all'));for(const genre of [...new Set(data.filter(item=>item.type===section).map(item=>item.genre))].sort())byId('mediaGenre').append(new Option(genre,genre))}
  byId('mediaHeading').textContent=section==='tv'?'20 shows. Find your next series.':'50 movies. Make a night of it.';
  byId('mediaRatingLabel').hidden=section==='tv';
  byId('mediaGuidance').textContent=section==='tv'?'All seasons are listed for these completed shows. This is a viewing guide, not a hosted full-series collection. Ratings can vary by episode; check the provider’s advice.':'Australian film ratings are shown. Check the provider’s classification and content advice for the version you choose.';
  render();if(focus)byId('mediaSearch').focus();
 };
 for(const name of ['games','movies','tv'])byId(name+'Tab').addEventListener('click',event=>{
  event.preventDefault();
  if(location.hash!=='#'+name)location.hash=name;
  window.selectEntertainment(name);
 });
 byId('mediaSearch').oninput=render;
 for(const name of ['mediaGenre','mediaRating','mediaSort'])byId(name).onchange=render;
 byId('mediaReset').onclick=()=>{resetFilters();render();byId('mediaSearch').focus()};
 if(['#movies','#tv'].includes(location.hash))window.selectEntertainment(location.hash.slice(1));
})();
