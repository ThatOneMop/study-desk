/* Underleaf recovery controls — MIT, Study Desk contributors, 2026. */
window.UnderleafRecovery={mount({store,apply,setBusy,notice,refreshStatus}){
 const $=id=>document.getElementById(id),input=$('importFile');let attempt=0,busy=false;
 function reading(value){busy=value;setBusy(value);$('cancelImport').hidden=!value;$('importColony').disabled=value;$('restoreColony').disabled=value;$('recoveryStatus').textContent=value?'Reading colony file…':'';input.value='';}
 function cancel(){attempt++;if(busy)reading(false);}
 function replace(text,label){
  const colony=UnderleafSaves.parse(text,true),expected=store.readCurrent();
  if(!confirm(label+' with '+colony.workers+' workers, '+colony.rooms+' chambers and '+Math.floor(colony.food)+' food? This replaces the current colony. The stored colony will be backed up first. Export any unsaved progress before continuing.'))return false;
  if(!store.replace(colony,expected)){refreshStatus();notice('Colony was not replaced. Storage failed or another tab changed the save. Export your current colony before trying again.');return false;}
  apply(colony);refreshStatus();notice(expected===null?'Colony restored. Autosaving is enabled.':'Colony restored. The previous stored colony is available as a backup.');return true;
 }
 $('importColony').onclick=()=>input.click();
 input.onchange=async()=>{
  const file=input.files?.[0];if(!file)return;
  const id=++attempt;reading(true);
  try{if(file.size>100000)throw Error('File too large');const text=await file.text();if(id!==attempt)return;replace(text,'Import colony');}
  catch{if(id===attempt)notice('Could not import. Choose a complete, valid Underleaf JSON export under 100 KB. Your colony was kept.');}
  finally{if(id===attempt)reading(false);}
 };
 $('cancelImport').onclick=()=>{cancel();notice('Import cancelled. Your colony was kept.');};
 $('restoreColony').onclick=()=>{
  if(busy)return;
  try{const text=store.readBackup();if(text===null){notice('No previous colony backup is available.');return;}replace(text,'Restore previous colony');}
  catch{notice('The previous backup could not be read or is not a valid complete colony. Download it to keep a copy. Your colony was kept.');}
 };
 // A slow file read must not restore after this game page has been left.
 window.addEventListener('pagehide',cancel);
 return {cancel};
}};
