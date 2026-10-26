import assert from 'node:assert/strict';
import fs from 'node:fs';
const game=fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8');
assert.match(game,/Drag to look · aim at an object and press E · Esc for menu/);
assert.doesNotMatch(game,/\$\('hint'\)\.textContent=''/);
assert.match(game,/role==='seller'\?'Stockroom packs':'Walks the workshop'/);
assert.match(game,/role==='seller'\?'Carried packs':'Background timer'/);
console.log('PASS: control hint stays visible, and a seller stock menu names packs rather than the workshop route.');
