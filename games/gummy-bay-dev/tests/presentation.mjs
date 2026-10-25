import assert from 'node:assert/strict';
import {stationStatus} from '../dist/presentation.mjs';
const s={raw:[4],gummies:[3],packs:[8],wrappers:2,packStation:true,deals:[{qty:5}]};
const original=JSON.stringify(s);assert.equal(stationStatus(s).packaging,'Ready · 2 packs possible');assert.equal(stationStatus(s).delivery,'3 available · 5 reserved');assert.equal(JSON.stringify(s),original);
assert.equal(stationStatus({...s,wrappers:0}).packaging,'Missing wrappers');assert.equal(stationStatus({...s,packStation:false}).packaging,'Equipment not purchased');assert.equal(stationStatus({...s,gummies:[]}).packaging,'Waiting for gummies');
console.log('PASS: truthful production status and read-only inventory projection.');
