import { Simulator, ISimulatorResult } from './lib/simulator';
import { Character } from './lib/character';
import { NormalAttack, ImpactHitAttack, FeintAttack, HammerBlowAttack, AimedStabAttack } from './lib/simulator/attack';
import { NormalDefense, NoneDefense } from './lib/simulator/defense';


const rawDwarf = require('../../characters/dwarf-warrior.json');

const attacker = Character.fromJSON(rawDwarf);
const defender = Character.fromJSON(rawDwarf);

const attack = new NormalAttack();
const defense = new NormalDefense();




let battleSim = new Simulator(attacker, defender, attack, defense, attack, defense);

stats('normal attack', battleSim.simulate(1000));

for(let i of [ 1, 2, 3, 4, 5, 6, 7 ]) {
    battleSim.setAttackerAttack(new ImpactHitAttack(i));
    
    stats(`impact hit ${i}`, battleSim.simulate(1000));
}

for(let i of [ 1, 2, 3, 4, 5, 6, 7 ]) {
    battleSim.setAttackerAttack(new FeintAttack(i));
    
    stats(`feint ${i}`, battleSim.simulate(1000));
}

battleSim.setAttackerAttack(new AimedStabAttack());

stats('aimed stab attack', battleSim.simulate(1000));

battleSim
    .setAttackerAttack(new HammerBlowAttack())
    .setAttackerDefense(new NoneDefense());


stats('hammer blow attack', battleSim.simulate(1000));


function stats(text: string, result : ISimulatorResult) {
    console.log(text, result.stats.result.attackerWin.percent, result.stats.averageRounds, result.stats.attacker.damage.average);
}
