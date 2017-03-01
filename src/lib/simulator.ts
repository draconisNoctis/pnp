import { Attack } from './simulator/attack';
import { Defense } from './simulator/defense';
import { Character } from './character';

export class Simulator {
    
}

export interface IAttackResult {
    status: 'miss'|'defense'|'hit'
    damage?: number;
    attackDifficulty: number;
    defenseDifficulty?: number;
    damageDifficulty?: number;
    attackSuccess: number;
    defenseSuccess?: number;
}

export class AttackSimulator {
    
    constructor(protected attacker : Character, protected defender : Character) {
        
    }
    
    simulate(attack : Attack, defense : Defense) : IAttackResult {
        let result : Partial<IAttackResult> = {};
        
        attack.attack(this.attacker, this.defender, result);
        
        if(result.attackSuccess >= 0) {
            defense.defense(this.attacker, this.defender, result);
            
            if(0 <= result.attackSuccess - result.defenseSuccess) {
                result.status = 'hit';
                attack.damage(this.attacker, this.defender, result);
            } else {
                result.status = 'defense';
            }
        } else {
            result.status = 'miss';
        }
        
        
        return result as IAttackResult;
    }
}
