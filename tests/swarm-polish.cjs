'use strict';
// Engine and DOM regressions; canvas is stubbed, so this is not rendered QA.
const {spawnSync}=require('node:child_process');
const path=require('node:path');
const suites=[
 'collection-expansion','gameplay-upgrades','action-polish','strategy-polish',
 'sports-polish','cozy-polish','builder-polish','new-games-polish','new-games-ui',
 'swarm-hub','arcade-disabled','shell-picks-and-saves','study-import','study-storage'
];
for(const name of suites){
 const result=spawnSync(process.execPath,[path.join(__dirname,name+'.cjs')],{
  cwd:path.resolve(__dirname,'..'),stdio:'inherit',env:process.env,timeout:240000
 });
 if(result.error)console.error(result.error.message);
 if(result.status!==0)process.exit(result.status||1);
}
console.log('PASS swarm polish: all collection, game, save and study regressions');
