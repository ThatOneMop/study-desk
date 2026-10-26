import assert from 'node:assert/strict';
import {policeNotice,DAY_NOTICE,HEAT_NOTICE,CURFEW_NOTICE,DAY_SUSPICION,HEAT_SUSPICION,CURFEW_SUSPICION} from '../dist/police-notice.mjs';
assert.deepEqual(policeNotice(0,false),{range:DAY_NOTICE,suspicion:DAY_SUSPICION});
assert.deepEqual(policeNotice(39,false),{range:11,suspicion:24});
assert.deepEqual(policeNotice(40,false),{range:HEAT_NOTICE,suspicion:HEAT_SUSPICION});
assert.deepEqual(policeNotice(10,true),{range:CURFEW_NOTICE,suspicion:CURFEW_SUSPICION});
assert.deepEqual(policeNotice(80,true),{range:45,suspicion:HEAT_SUSPICION});
assert.equal(CURFEW_NOTICE,45);assert.equal(CURFEW_SUSPICION,48);assert.ok(HEAT_SUSPICION>CURFEW_SUSPICION);
console.log('PASS: curfew notice is 45 m, and suspicion takes the higher of heat and curfew.');
