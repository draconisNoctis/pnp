import { Roll } from '../roll';
import { IAttackResult } from '../simulator';
import { Character } from '../character';

export abstract class Attack {
    abstract attack(attacker : Character, defender : Character, result : Partial<IAttackResult>) : void;
    abstract damage(attacker : Character, defender : Character, result : Partial<IAttackResult>) : void;
}

export abstract class Attack_ extends Attack {
    constructor(protected difficulty : number, protected options : { weaponIndex?: number} = {}) {
        super();
    }
    
    
    attack(attacker : Character, defender : Character, result : Partial<IAttackResult>) : void {
        result.attackDifficulty = 10 - this.difficulty - attacker.getWoundDifficulty();
        result.attackSuccess =  new Roll(
            attacker.getMeleeWeapons()[this.options.weaponIndex || 0].getAttack(),
            result.attackDifficulty
        ).roll();
        
    }
    
    damage(attacker : Character, defender : Character, result : Partial<IAttackResult>) : number {
        result.damageDifficulty = 10 - attacker.getWoundDifficulty();
        result.damage = Math.max(0, new Roll(
            attacker.getMeleeWeapons()[this.options.weaponIndex || 0].getDamage(
                result.attackSuccess - Math.max(0, result.defenseSuccess)
            ),
            result.damageDifficulty
        ).roll());
    }
}

export class NormalAttack extends Attack_ {
    
    constructor() {
        super(0);
    }
}
