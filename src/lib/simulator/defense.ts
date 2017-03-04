import { Character } from '../character';
import { IAttackResult } from '../simulator';
import { Roll } from '../roll';
import { RuleSet } from '../rules/rule-set';
import { Attack } from './attack';

export abstract class Defense {
    abstract defense(attack : Attack, attacker : Character, defender : Character, result : Partial<IAttackResult>) : void;
    
    abstract getAttackOptions(attacker : Character, defender : Character) : { difficulties: number[], modification: number };
    abstract getDefenseOptions(attacker : Character, defender : Character) : { difficulties: number[], modification: number };
    abstract getDamageOptions(attacker : Character, defender : Character) : { difficulties: number[], modification: number };
}

export class Defense_ extends Defense {
    get ruleSet() : RuleSet {
        return RuleSet.getInstance();
    }
    
    constructor(protected options : { weaponIndex?: number} = {}) {
        super();
    }
    
    private getDefenseDifficulties(attacker : Character, defender : Character) : number[] {
        return [
            this.ruleSet.getDifficultyByWounds(defender)
        ]
    }
    
    private getDefenseModification(attacker : Character, defender : Character) : number {
        return 0;
    }
    
    getAttackOptions(attacker : Character, defender : Character) : { difficulties : number[]; modification : number } {
        return {
            difficulties: [],
            modification: 0
        };
    }
    
    getDefenseOptions(attacker : Character, defender : Character) : { difficulties : number[]; modification : number } {
        return {
            difficulties: this.getDefenseDifficulties(attacker, defender),
            modification: this.getDefenseModification(attacker, defender)
        };
    }
    
    getDamageOptions(attacker : Character, defender : Character) : { difficulties : number[]; modification : number } {
        return {
            difficulties: [],
            modification: 0
        };
    }
    
    defense(attack: Attack, attacker : Character, defender : Character, result : Partial<IAttackResult>) : void {
        let defenderOptions = this.getDefenseOptions(attacker, defender),
            attackerOptions = attack.getDefenseOptions(attacker, defender);
        result.defense = {
            difficulty: this.ruleSet.getThreshold([
                ...defenderOptions.difficulties,
                ...attackerOptions.difficulties
            ]),
            modification: defenderOptions.modification + attackerOptions.modification,
        };
    
        result.defense.value = this.ruleSet.getDefenseValue(attacker, attacker.getMeleeWeapons()[this.options.weaponIndex || 0]) + result.defense.modification;
        result.defense.result = new Roll(result.defense.value, result.defense.difficulty).roll();
    }

// defense(attacker : Character, defender : Character, result : Partial<IAttackResult>) : void {
    //     result.defenseDifficulty = 10 - defender.getWoundDifficulty();
    //     result.defenseValue = defender.getMeleeWeapons()[this.options.weaponIndex || 0].getDefense() + (result.defenseMod || 0);
    //     result.defenseSuccess = new Roll(
    //         result.defenseValue,
    //         result.defenseDifficulty
    //     ).roll();
    // }
}

export class NormalDefense extends Defense_ {}


export class NoneDefense extends Defense_ {
    
    defense(attack : Attack, attacker : Character, defender : Character, result : Partial<IAttackResult>) : void {
        result.defense = {
            difficulty: null,
            modification: null,
            value: 0,
            result: 0
        }
    }
}
