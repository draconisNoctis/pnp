
import { AttackSimulator } from './lib/simulator';
import { Character } from './lib/character';
import { NormalAttack } from './lib/simulator/attack';
import { NormalDefense } from './lib/simulator/defense';


const rawDwarf = require('../characters/dwarf-warrior.json');

const attacker = Character.fromJSON(rawDwarf);
const defender = Character.fromJSON(rawDwarf);

const attack = new NormalAttack();
const defense = new NormalDefense();

defender['raw'].wounds = 4;

const attackSimulator = new AttackSimulator(attacker, defender);

let result = {
    'miss': 0,
    'defense': 0,
    'hit': 0,
    'damage': 0
};
// console.log(attackSimulator.simulate(attack, defense));

for(let i = 0; i < 10000; i++) {
    let res = attackSimulator.simulate(attack, defense);
    
    switch(res.status) {
        case 'hit':
            if(!(res.damage in result)) {
                result[res.damage] = 0;
            }
            result[res.damage]++;
            if(res.damage) {
                result.damage++;
            }
        case 'miss':
        case 'defense':
            result[res.status]++;
            break;
        default:
            
    }
}

console.log(result);
