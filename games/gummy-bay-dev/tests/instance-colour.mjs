import assert from 'node:assert/strict';
import fs from 'node:fs';
// r180 multiplies vertex colours with instanceColor. A material that asks for
// vertex colours on a geometry without a colour attribute renders pure black,
// which is how the v125 townsfolk and skyline turned into dark silhouettes.
const dir=new URL('../dist/',import.meta.url);
const offenders=[];
for(const name of fs.readdirSync(dir)){
 if(!/\.(mjs|js)$/.test(name))continue;
 const source=fs.readFileSync(new URL(name,dir),'utf8');
 if(/vertexColors\s*:\s*true/.test(source)&&!/setAttribute\(\s*['"]color['"]/.test(source))offenders.push(name);
}
assert.deepEqual(offenders,[],'vertexColors needs a colour attribute: '+offenders.join(', '));
console.log('PASS: every vertex-coloured material in Gummy Bay has a colour attribute; instanced layers tint with instanceColor alone.');
