import { Character } from '../character';
import { IAttackResult } from '../simulator';
import { Roll } from '../roll';

export abstract class Defense {
    abstract defense(attacker : Character, defender : Character, result : Partial<IAttackResult>) : void
}

export class Defense_ extends Defense {
    constructor(protected options : { weaponIndex?: number} = {}) {
        super();
    }
    
    defense(attacker : Character, defender : Character, result : Partial<IAttackResult>) : void {
        result.defenseDifficulty = 10 - defender.getWoundDifficulty();
        result.defenseSuccess = new Roll(
            defender.getMeleeWeapons()[this.options.weaponIndex || 0].getDefense(),
            result.defenseDifficulty
        ).roll();
    }
}

export class NormalDefense extends Defense_ {}
