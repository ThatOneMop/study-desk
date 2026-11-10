'use strict';
// Runs behavioural regressions for the November collection expansion.
// Install jsdom 26 in a separate workspace and set NODE_PATH; hosting needs no npm.
const {spawnSync}=require('node:child_process');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const suites=[
 'tests/storefront.cjs','tests/catalog-launch.cjs','tests/curation-regression.cjs',
 'games/orbital-drop/self-test.cjs','games/lanefall/self-test.cjs',
 'games/basket-chaos/self-test.cjs','games/pegworks/test.cjs','games/demolition-yard/test.cjs',
 'games/roof-runner/regression.cjs','games/ashwake/regression.cjs',
 'games/forge-arena/regression.cjs','games/harvest-protocol/regression.cjs',
 'games/outbreak-atlas/regression.cjs','games/numberworks/strategy-ui-regression.cjs',
 'games/bell-diver/collection-upgrades.test.cjs'
];
for(const suite of suites){
 const result=spawnSync(process.execPath,[suite],{cwd:root,stdio:'inherit',env:process.env,timeout:60000});
 if(result.error)console.error(result.error.message);
 if(result.status!==0)process.exit(result.status||1);
}
console.log('PASS collection expansion: '+suites.length+' behavioural regression suites');
