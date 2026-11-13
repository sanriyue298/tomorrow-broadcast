'use strict';
const assert=require('node:assert/strict');
const {Expedition,MODULES,SECTORS,RELICS}=require('../docs/ember/engine.js');
let checks=0;function test(name,fn){fn();checks++;console.log('PASS '+name);}
test('all starter chassis launch with legal supply and stable power',()=>{for(const type of ['balanced','bulwark','scavenger']){const e=new Expedition(1,type);assert(e.modules.some(m=>m.type==='core'));assert(e.modules.every(m=>m.hp===e.maxHP(m)));assert(e.stats().eff===1);assert(e.launch());}});
test('construction, movement, upgrade, refunds, and locked core',()=>{const e=new Expedition(1);const before=e.scrap,m=e.add('gun',0,0);assert.equal(e.scrap,before-MODULES.gun.cost);assert(!e.add('gun',0,0));assert(!e.add('gun',-1,0));assert(!e.add('gun',1.5,0));assert(e.move(m.id,0,1));assert(!e.move(m.id,3,1));assert(e.upgrade(m.id));assert.equal(m.level,2);assert.equal(m.hp,e.maxHP(m));assert(e.sell(m.id));assert(!e.sell(e.at(3,1).id));assert(!e.move(e.at(3,1).id,0,0));});
test('supply traverses conveyors but not empty cells or other equipment',()=>{const e=new Expedition(1);const m=e.add('missile',6,2,true);assert(!e.connected(m));e.add('belt',5,2,true);assert(e.connected(m));e.sell(e.at(5,2).id);assert(!e.connected(m));assert(e.connected(e.add('drone',0,0,true)));});
test('power overload, weight fuel cost, and passive shield',()=>{const e=new Expedition(1),before=e.stats().burn;e.add('shield',0,0,true);e.add('missile',0,1,true);e.add('missile',0,2,true);assert(e.stats().eff<1);assert(e.stats().burn>before);e.add('reactor',1,0,true);assert(e.stats().eff===1);e.launch();assert.equal(e.shield,160);const core=e.modules.find(m=>m.type==='core'),hp=core.hp;e.damageModule(core,100);assert.equal(core.hp,hp);assert.equal(e.shield,60);});
test('skills consume resources and enforce cooldowns',()=>{const e=new Expedition(1);e.launch();e.spawnEnemy('scout');const ammo=e.ammo;assert(e.skill('salvo'));assert.equal(e.ammo,ammo-16);assert(!e.skill('salvo'));const fuel=e.fuel;assert(e.skill('shield'));assert.equal(e.fuel,fuel-9);assert(e.shield>=210);e.modules[0].hp-=200;const scrap=e.scrap;assert(e.skill('repair'));assert.equal(e.scrap,scrap-22);assert(!e.skill('repair'));});
test('fuel and core failures are terminal',()=>{const e=new Expedition(1);e.launch();e.modules=e.modules.filter(m=>m.type!=='fuel');e.fuel=.00001;e.tick(.1);assert.equal(e.phase,'lost');const f=new Expedition(1);f.launch();f.damageModule(f.at(3,1),10000);assert.equal(f.phase,'lost');});
test('ammo destruction damages its neighbours',()=>{const e=new Expedition(1);e.launch();const ammo=e.at(4,1),gun=e.at(4,0),hp=gun.hp;e.damageModule(ammo,10000);assert.equal(gun.hp,hp-50);assert(!e.connected(gun));});
test('encounters pause time and every option resolves once',()=>{for(const choice of ['salvage','rescue','leave']){const e=new Expedition(1);e.launch();e.elapsed=31;e.tick(.1);assert.equal(e.phase,'event');const t=e.elapsed;e.tick(.1);assert.equal(e.elapsed,t);assert(e.encounter(choice));assert.equal(e.phase,'travel');assert(!e.encounter(choice));assert(e.eventDone);}});
test('field upgrades, checkpoints and final victory',()=>{const e=new Expedition(10);for(let i=0;i<5;i++){e.phase='travel';e.checkpoint();if(i<4){assert.equal(e.phase,'reward');assert.equal(e.choice.length,3);const k=e.choice[0];assert(e.chooseRelic(k));assert(e.has(k));assert.equal(e.phase,'build');assert.equal(e.sector,i+1);}}assert.equal(e.phase,'won');});
test('save round-trip resumes deterministic combat across viewport changes',()=>{const e=new Expedition(994);e.launch();for(let i=0;i<250;i++)e.tick(.05);const saved=e.serialize(),f=Expedition.restore(saved);assert(f);for(let i=0;i<250;i++){e.tick(.04);f.tick(.04);}assert.equal(e.serialize(),f.serialize());for(const bad of ['{}','null','bad',saved.replace('"sector":0','"sector":99'),saved.replace('"fuel":','"fuel":-100,"bad":')])assert.equal(Expedition.restore(bad),null);});
test('final boss is mandatory and appears once',()=>{const e=new Expedition(1);e.sector=4;e.launch();e.elapsed=18;e.tick(.1);assert.equal(e.enemies.filter(m=>m.kind==='boss').length,1);e.elapsed=90;e.tick(.1);assert.equal(e.phase,'travel');e.elapsed=156;e.tick(.1);assert.equal(e.phase,'lost');});
test('gun range prevents firing at off-screen targets',()=>{const e=new Expedition(1);e.launch();const target=e.spawnEnemy('scout');target.x=1270;target.y=200;e.tick(.01);assert.equal(e.shots.filter(s=>s.friendly).length,0);target.x=850;e.tick(.01);assert(e.shots.some(s=>s.friendly));});
test('priority target and area salvo preserve tactical choice',()=>{const e=new Expedition(1);e.launch();const a=e.spawnEnemy('scout'),b=e.spawnEnemy('tank');a.x=100;a.y=100;b.x=950;b.y=450;e.targetId=b.id;const hp=a.hp;assert(e.skill('salvo'));assert.equal(a.hp,hp);assert(b.hp<b.max);});
test('malformed saves are rejected without breaking the title screen',()=>{const e=new Expedition(1);for(const change of [s=>s.shield=null,s=>s.enemies=[null],s=>s.enemies=[{kind:'unknown'}],s=>s.shots=[{}],s=>{s.phase='reward';s.choice=['unknown'];}]){const s=JSON.parse(e.serialize());change(s);assert.equal(Expedition.restore(JSON.stringify(s)),null);}});
// Simulate real inputs and purchases, with no hidden healing or resource grants.
const results=[];
for(let seed=1;seed<=30;seed++){
 const e=new Expedition(seed,seed%2?'scavenger':'bulwark');let guard=0;
 while(!['won','lost'].includes(e.phase)&&guard++<25000){
  if(e.phase==='build'){
   if(!e.modules.some(m=>m.type==='drill'))e.add('drill',2,2);
   const plans=[['reactor',3,2],['missile',5,2],['belt',4,2],['armor',6,2],['armor',6,0],['shield',1,1],['drone',1,0],['fuel',2,0]];
   for(const[type,x,y]of plans)if(!e.at(x,y))e.add(type,x,y);
   e.dockRepair();while(e.fuel<120&&e.scrap>=20)e.buyFuel();
   if(e.sector>0){const w=e.modules.filter(m=>MODULES[m.type].kind==='weapon');for(const m of w)if(m.level<3)e.upgrade(m.id);}
   if(!e.launch()){results.push({seed,phase:'blocked',sector:e.sector});break;}
  }else if(e.phase==='event')e.encounter('rescue');
  else if(e.phase==='reward')e.chooseRelic(e.choice.includes('barrels')?'barrels':e.choice.includes('light')?'light':e.choice[0]);
  else {const core=e.modules.find(m=>m.type==='core');const damaged=e.modules.some(m=>m.hp<e.maxHP(m)*.6);if(damaged)e.skill('repair');if(e.enemies.some(en=>en.windup>0&&['boss','bomber'].includes(en.kind)))e.skill('shield');if(e.enemies.length>=3||e.enemies.some(en=>en.kind==='boss'))e.skill('salvo');e.tick(.05);}
 }
 if(!results.some(r=>r.seed===seed))results.push({seed,phase:e.phase,sector:e.sector+1,kills:e.kills,fuel:Math.ceil(e.fuel)});
 assert(e.modules.every(m=>Number.isFinite(m.hp))&&Number.isFinite(e.scrap)&&e.scrap>=0&&e.fuel>=0);
}
const won=results.filter(r=>r.phase==='won').length;assert(won>0,'a legal upgraded ship must be able to win');console.log(JSON.stringify({checks,simulations:results,wins:won},null,2));
