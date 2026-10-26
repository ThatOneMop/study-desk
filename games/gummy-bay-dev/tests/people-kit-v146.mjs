import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from '../dist/vendor/three.module.min.js';
import {PEOPLE_HAIR_STYLES,PEOPLE_HATS,PEOPLE_BEARDS,PEOPLE_EYEWEAR,PEOPLE_SKINS,PEOPLE_OUTFITS,PEOPLE_TOP_STYLES,PEOPLE_UNIFORMS,PEOPLE_SHOE_STYLES,PEOPLE_FACE_COLS,PEOPLE_FACE_STYLES,PEOPLE_HEAD_SCALE,PEOPLE_HEIGHT,PEOPLE_BUILD,PERSON_MESH_PARTS,PERSON_SLOT,PEOPLE_ROUND_GEOMETRY,NAMED_LOOKS,
 personLook,namedLook,namedLookKey,faceCell,personPartEnabled,personTriangles,hatOf,hairOf,proceduralJoints,createJointSet,breathe,breatheJoints,scaleJointsAbout,writePerson,createPeopleMeshes,flushPeopleMeshes,WALK_ARM_SWING} from '../dist/people-kit.mjs';
import {createStreetCrowd,STREET_NAMED} from '../dist/street-crowd.mjs';
import {createSquadCast} from '../dist/squad-cast.mjs';
import {CARDS} from '../dist/story-acts.mjs';

// Variety: 8+ hair styles, hats, beards, eyewear, skins, outfits, uniforms, shoes, body shapes.
assert.ok(PEOPLE_HAIR_STYLES.length>=8,'at least eight hair styles');
assert.ok(PEOPLE_HATS.filter(h=>h!=='none').length>=4&&PEOPLE_BEARDS.filter(b=>b!=='none').length>=3&&PEOPLE_EYEWEAR.length===3);
assert.ok(PEOPLE_SKINS.length>=10&&PEOPLE_OUTFITS.length>=10&&PEOPLE_TOP_STYLES.length>=7&&PEOPLE_UNIFORMS.length>=3&&PEOPLE_SHOE_STYLES.length>=3);
const looks=Array.from({length:240},(_,id)=>personLook(id,'townsfolk'));
const seen=key=>new Set(looks.map(l=>l[key]));
for(const style of PEOPLE_HAIR_STYLES)assert.ok(looks.some(l=>l.hairStyle===style),'crowd uses hair style '+style);
for(const hat of ['none','cap','beanie','bucket','flatcap'])assert.ok(looks.some(l=>l.hat===hat),'crowd wears '+hat);
for(const beard of PEOPLE_BEARDS)assert.ok(looks.some(l=>l.beard===beard),'crowd has beard '+beard);
for(const eyewear of [0,1,2])assert.ok(looks.some(l=>l.eyewear===eyewear));
assert.ok(seen('skin').size>=10&&seen('topStyle').size>=7&&seen('faceStyle').size===PEOPLE_FACE_STYLES&&seen('shoeStyle').size===3);
assert.ok(looks.every(l=>l.height>=PEOPLE_HEIGHT[0]&&l.height<=PEOPLE_HEIGHT[1]&&l.build>=PEOPLE_BUILD[0]&&l.build<=PEOPLE_BUILD[1]));
assert.ok(seen('height').size>=8&&seen('build').size>=6,'heights and builds vary');
// Uniforms by role.
const cop=personLook(4,'police'),seller=personLook(4,'seller'),dealer=personLook(4,'dealer'),worker=personLook(4,'worker');
assert.equal(cop.topStyle,'uniform');assert.equal(hatOf(cop),'police');assert.equal(seller.topStyle,'apron');assert.equal(dealer.topStyle,'track');assert.equal(worker.topStyle,'jacket');
const part=name=>[...PERSON_MESH_PARTS.box,...PERSON_MESH_PARTS.round].find(p=>p.name===name);
assert.ok(personPartEnabled(part('badge'),cop)&&personPartEnabled(part('band'),cop)&&personPartEnabled(part('brim'),cop));
assert.ok(personPartEnabled(part('bib'),seller)&&personPartEnabled(part('strapL'),seller),'shopkeepers wear an apron');
assert.ok(personPartEnabled(part('stripeL'),dealer)&&personPartEnabled(part('stripeR'),dealer),'dealers wear striped track jackets');
assert.ok(personPartEnabled(part('stripeL'),worker),'workers carry hi-vis stripes');
// Each hair style changes the silhouette; legacy 'cap' still means short hair under a cap.
const hairSig=look=>['hairTop','hairBack','hairExtra','earL'].map(n=>personPartEnabled(part(n),look)?1:0).join('');
assert.ok(new Set(PEOPLE_HAIR_STYLES.map(h=>hairSig({...personLook(1),hairStyle:h,hat:'none',hoodUp:false}))).size>=5);
assert.equal(hatOf({hairStyle:'cap'}),'cap');assert.equal(hairOf({hairStyle:'cap'}),'short');
assert.equal(personPartEnabled(part('hairTop'),{...personLook(1),hairStyle:'short',hat:'beanie',hoodUp:false}),false,'hats replace the top hair');
// Faces: 8 moods x 3 eyewear x 3 states; old glasses flags still map.
assert.equal(PEOPLE_FACE_COLS,24);
assert.equal(faceCell({faceStyle:3,eyewear:2},'talk'),2*24+3+16);assert.equal(faceCell({faceStyle:1,glasses:true}),9);assert.equal(faceCell({faceStyle:99}),7);
// Named characters match their cutscene cards.
const hex=c=>parseInt(c.slice(1),16);
const card=(id,attr)=>{const m=CARDS[id].art.match(/fill="(#[0-9a-f]{6})"/g)||[];return m.map(x=>hex(x.slice(6,13)));};
const marge=namedLook('Marge'),larry=namedLook('Lemon Larry'),hank=namedLook('hank hardtack'),gramps=namedLook('Gramps Gus');
assert.equal(marge.hairStyle,'bun');assert.equal(marge.eyewear,1);assert.equal(marge.top,0xe0b13a);assert.ok(card('marge').includes(marge.hair));
assert.equal(larry.skin,0xf6e05a);assert.equal(larry.cap,0x6fb52c);assert.ok(Math.abs(larry.hatYaw)>1,'sideways cap');assert.equal(larry.faceStyle,3);assert.equal(larry.top,0x3c4a24);
assert.equal(hank.cap,0x1d2a4a);assert.equal(hank.band,0xf2c230);assert.equal(hank.beard,'moustache');assert.equal(hank.beardColor,0x6b4a2e);assert.equal(hank.top,0x8a8f96);assert.equal(hank.role,'police');
assert.equal(gramps.hairStyle,'combover');assert.equal(gramps.beard,'full');assert.equal(gramps.beardColor,0xf4f1ea);assert.equal(gramps.top,0xb84a3a);
for(const id of ['marge','larry','hank','gramps'])assert.ok(card(id).some(c=>[marge,larry,hank,gramps].some(l=>l.skin===c)),id+' skin matches the card');
for(const name of ['Benny Boardwalk · Old Town dealer','Mo Marmalade','Cleo Caramel','Dex Dimple','Jules','Benji','Nina','Oz','Frankie','Tilly','Mayor Prudence Plum'])assert.ok(namedLookKey(name),name+' has a look');
assert.equal(namedLookKey('Hank · Tents & equipment'),'hank ·','the hardware shopkeeper is not the inspector');
assert.equal(namedLookKey('Ozzy'),null);assert.ok(Number.isFinite(namedLook('Dex Dimple').scarf),'Dex wears a scarf');
assert.ok(Object.keys(NAMED_LOOKS).length>=16);
// Animation: fuller walk swing, knee lift, idle breathing.
assert.ok(WALK_ARM_SWING>=.55);
const joints=createJointSet(),root=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Vector3();
proceduralJoints(joints,root,{swing:1});const handFwd=new THREE.Vector3(0,-.3,0).applyMatrix4(joints.foreL).z;
proceduralJoints(joints,root,{swing:-1});const handBack=new THREE.Vector3(0,-.3,0).applyMatrix4(joints.foreL).z;
assert.ok(Math.abs(handFwd-handBack)>.4,'hands travel more than 40 cm through a stride');
proceduralJoints(joints,root,{breath:1});p.setFromMatrixPosition(joints.chest);proceduralJoints(joints,root,{breath:-1});q.setFromMatrixPosition(joints.chest);
assert.ok(p.y-q.y>.008&&p.y-q.y<.03,'breathing lifts the chest a centimetre or so');
assert.ok(Math.abs(breathe(0,1)-breathe(0,2))>.1&&Math.abs(breathe(2,1))<=1);
const c0=joints.chest.clone();breatheJoints(joints,1);assert.ok(!joints.chest.equals(c0));
proceduralJoints(joints,root,{});p.setFromMatrixPosition(joints.head);scaleJointsAbout(joints,0,0,0,1.1);q.setFromMatrixPosition(joints.head);assert.ok(Math.abs(q.y/p.y-1.1)<1e-6);
// Cost: shared geometry, triangle budget, trimmed draws, and the black-NPC guard.
assert.equal(PEOPLE_ROUND_GEOMETRY.index.count/3,48);
assert.ok(personTriangles(false)<=1500&&personTriangles(true)<personTriangles(false));
const scene=new THREE.Scene(),meshes=createPeopleMeshes(THREE,scene,6,'Kit test');
assert.equal(meshes.round.geometry.index,PEOPLE_ROUND_GEOMETRY.index,'body batches share one index buffer');
assert.equal(meshes.round.geometry.getAttribute('position'),PEOPLE_ROUND_GEOMETRY.getAttribute('position'));
for(const m of [meshes.box,meshes.round])assert.equal(m.material.vertexColors,false);
assert.ok(meshes.box.instanceColor&&meshes.round.instanceColor,'instance colours allocated before the first frame');
proceduralJoints(joints,root,{});writePerson(meshes,0,joints,gramps,{});writePerson(meshes,1,joints,larry,{});flushPeopleMeshes(meshes,true,2);
assert.equal(meshes.round.count,2*PERSON_MESH_PARTS.round.length);assert.equal(meshes.face.count,2);
const m=new THREE.Matrix4(),s=new THREE.Vector3();
meshes.round.getMatrixAt(PERSON_SLOT.head,m);m.decompose(p,new THREE.Quaternion(),s);assert.ok(Math.abs(s.x-.29*PEOPLE_HEAD_SCALE)<1e-3,'big-head style');
meshes.round.getMatrixAt(PERSON_SLOT.beard,m);m.decompose(p,new THREE.Quaternion(),s);assert.ok(s.x>.2,'Gramps has his beard');
meshes.round.getMatrixAt(PERSON_MESH_PARTS.round.length+PERSON_SLOT.beard,m);m.decompose(p,new THREE.Quaternion(),s);assert.equal(s.x,0,'Larry is clean shaven');
const taper=meshes.round.geometry.getAttribute('aTaper');assert.equal(taper.itemSize,2);assert.ok(taper.getX(PERSON_SLOT.torso)<1,'torsos taper to the waist');
flushPeopleMeshes(meshes,true,0);assert.equal(meshes.round.visible,false);
const kit=fs.readFileSync(new URL('../dist/people-kit.mjs',import.meta.url),'utf8');assert.ok(!/vertexColors\s*:\s*true/.test(kit));
// Crowd: still four draw calls, named story people placed, Gramps waits for the ending.
const crowd=createStreetCrowd({THREE,scene:new THREE.Scene(),capacity:32,time:720});
assert.equal(crowd.drawCalls,4);assert.equal(crowd.named.length,STREET_NAMED.length);
const camera=new THREE.PerspectiveCamera();camera.position.set(0,1.6,76);
crowd.update({dt:0,now:1,time:720,camera,active:true,namedVisible:()=>false});
assert.equal(crowd.named.find(n=>n.key==='gramps').visible,false);assert.equal(crowd.named.find(n=>n.key==='marge').visible,true);
crowd.update({dt:0,now:1,time:720,camera,active:true,namedVisible:key=>key==='gramps'});assert.equal(crowd.named.find(n=>n.key==='gramps').visible,true);
const anchor=new THREE.Group();anchor.position.set(5,0,5);const scene2=new THREE.Scene();scene2.add(anchor);
assert.ok(crowd.follow('Cleo Caramel · Strip dealer',anchor));assert.equal(crowd.follow('Cleo again',anchor),crowd.followers[0],'following is idempotent');
crowd.update({dt:0,now:1,time:720,camera,active:true});assert.equal(crowd.followers[0].visible,true);assert.equal(crowd.followers[0].look.hairStyle,'afro');
anchor.visible=false;crowd.update({dt:0,now:1,time:720,camera,active:true});assert.equal(crowd.followers[0].visible,false);
// Squad: Inspector Hank leads, only live officers are drawn.
const squad=createSquadCast({THREE,scene:new THREE.Scene(),capacity:10});
squad.update({officers:[{x:0,z:0,angle:0,mode:'patrol'},{x:2,z:0,angle:0,mode:'patrol'}],now:1});
assert.equal(squad.meshes.round.count,2*PERSON_MESH_PARTS.round.length,'two officers, two bodies drawn');
squad.meshes.round.getMatrixAt(PERSON_SLOT.mustache,m);m.decompose(p,new THREE.Quaternion(),s);assert.ok(s.x>.15,'Hank has his big moustache');
console.log('PASS: v146 people kit — '+PEOPLE_HAIR_STYLES.length+' hair styles, '+(PEOPLE_HATS.length-1)+' hats, '+(PEOPLE_BEARDS.length-1)+' beards, 3 eyewear, '+PEOPLE_SKINS.length+' skins, '+PEOPLE_OUTFITS.length+' outfits, uniforms, heights/builds, '+PEOPLE_FACE_STYLES+' face moods; named looks match the cards; fuller walk and breathing; '+personTriangles(false)+' tris a person, trimmed draws, shared buffers and the vertexColors guard.');
