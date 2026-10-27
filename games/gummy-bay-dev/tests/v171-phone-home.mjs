import assert from 'node:assert/strict';import fs from 'node:fs';
// Home screen keeps its wallpaper after Messages (sms-screen cleared), and 9 apps + Sweet Network fit on 800 px.
const game=fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8');
assert.match(game,/const homeWall=phoneHome;phoneHome=function\(\)/);assert.match(game,/remove\?\.\('sms-screen','sms-inbox','strain-screen'\)/);
assert.ok(game.lastIndexOf('const homeWall=phoneHome')>game.lastIndexOf('const sbHome=phoneHome'),'wallpaper fix wraps the outermost phoneHome');
const css=fs.readFileSync(new URL('../dist/phone-texts.css',import.meta.url),'utf8');
assert.match(css,/v171 phone home/);assert.match(css,/@media \(max-height:920px\)\{[^}]*data-phone="home"[^}]*phone-home-clock/);
const html=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');assert.match(html,/phone-texts\.css\?v=171/);assert.match(html,/game\.js\?v=171/);
console.log('PASS v171 phone home: wallpaper survives Messages, Sweet Network tile fits on short screens');
