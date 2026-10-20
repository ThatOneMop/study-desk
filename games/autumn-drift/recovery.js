/* Autumn Drift recovery controls — MIT, Study Desk contributors, 2026. */
window.AutumnRecovery={mount({store,snapshot,apply,refreshStatus}){
 const $=id=>document.getElementById(id),input=$('importFile'),draft=$('gardenJson');let attempt=0,busy=false;
 const notice=message=>$('recoveryStatus').textContent=message;
 function reading(value){busy=value;$('chooseGarden').disabled=value;$('importGarden').disabled=value;$('restoreGarden').disabled=value;$('showGarden').disabled=value;draft.disabled=value;$('cancelRead').hidden=!value;input.value='';}
 function cancel(){attempt++;if(busy){reading(false);notice('File read cancelled. Your garden was kept.')}}
 function restore(text,label){
  const next=AutumnSaves.parseExport(text),expected=store.readCurrent();
  const summary=`Area ${next.area+1}, ${Math.floor(next.money).toLocaleString()} acorns, ${next.garden.collected} / ${next.garden.total} leaves picked`;
  if(!confirm(`${label}? ${summary}. This replaces your current garden. The stored save is backed up first, replacing the previous backup if one exists. Copy or export any unsaved progress before continuing.`)){notice('Restoration cancelled. Your garden was kept.');return}
  if(!store.replace(next,expected)){refreshStatus();notice('Garden was not replaced. Storage failed or another tab changed the save. Copy your current garden before trying again.');return}
  apply(next);refreshStatus();notice('Garden restored. '+summary+'. Autosaving is enabled.');
 }
 $('showGarden').onclick=()=>{if(busy)return;draft.value=JSON.stringify(snapshot(),null,2);notice('Current garden text is ready. Copy all the text and keep it in a .json file.');draft.focus();draft.select()};
 $('importGarden').onclick=()=>{if(busy)return;try{restore(draft.value,'Import garden text')}catch{notice('Not imported. Use a complete, valid Autumn Drift JSON export under 1 MB. Your garden was kept.')}};
 $('chooseGarden').onclick=()=>input.click();
 input.onchange=async()=>{
  const file=input.files?.[0];if(!file)return;const id=++attempt;reading(true);notice('Reading garden file…');
  try{if(file.size>AutumnSaves.LIMIT)throw Error('File too large');const text=await file.text();if(id!==attempt)return;AutumnSaves.parseExport(text);draft.value=text;notice('File validated. Choose Import garden text to review and confirm replacement.');}
  catch{if(id===attempt)notice('File not loaded. Choose a complete, valid Autumn Drift JSON export under 1 MB. Your garden was kept.')}
  finally{if(id===attempt)reading(false)}
 };
 $('cancelRead').onclick=cancel;
 $('restoreGarden').onclick=()=>{if(busy)return;try{const text=store.readBackup();if(text===null){notice('No previous garden backup yet. Importing a garden backs up the stored save first.');return}restore(text,'Restore previous garden')}catch{notice('The previous backup is unreadable or invalid. Download it to preserve a copy. Your garden was kept.')}};
 window.addEventListener('pagehide',cancel);
 return {cancel};
}};
