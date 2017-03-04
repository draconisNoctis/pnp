import { Roll } from '../roll';
import { IAttackResult } from '../simulator';
import { Character } from '../character';
import { RuleSet } from '../rules/rule-set';
import { Defense } from './defense';

export abstract class Attack {
    abstract attack(defense: Defense, attacker : Character, defender : Character, result : Partial<IAttackResult>) : void;
    abstract damage(defense: Defense, attacker : Character, defender : Character, result : Partial<IAttackResult>) : void;
    
    abstract preventDefense() : boolean;
    abstract getAttackOptions(attacker : Character, defender : Character) : { difficulties: number[], modification: number };
    abstract getDefenseOptions(attacker : Character, defender : Character) : { difficulties: number[], modification: number };
    abstract getDamageOptions(attacker : Character, defender : Character) : { difficulties: number[], modification: number };
}

export abstract class Attack_ extends Attack {
    get ruleSet() : RuleSet {
        return RuleSet.getInstance();
    }
    
    preventDefense() : boolean {
        return false;
    }
    
    constructor(protected amount : number, protected options : { weaponIndex?: number} = {}) {
        super();
        if(0 > amount) {
            throw new Error(`amount must be >= 0, ${amount} given`);
        }
    }
    
    protected getAttackDifficulties(attacker : Character, defender : Character) : number[] {
        return [
            -this.amount,
            this.ruleSet.getDifficultyByWounds(attacker)
        ];
    }
    
    protected getAttackModification(attacker : Character, defender : Character) : number {
        return 0;
    }
    
    getAttackOptions(attacker : Character, defender : Character) : { difficulties : number[]; modification : number } {
        return {
            difficulties: this.getAttackDifficulties(attacker, defender),
            modification: this.getAttackModification(attacker, defender)
        }
    }
    
    getDefenseOptions(attacker : Character, defender : Character) : { difficulties : number[]; modification : number } {
        return {
            difficulties: [],
            modification: 0
        };
    }
    
    getDamageOptions(attacker : Character, defender : Character) : { difficulties : number[]; modification : number } {
        return {
            difficulties: [
                -defender.getArmor()
            ],
            modification: 0
        };
    }
    
    
    attack(defense : Defense, attacker : Character, defender : Character, result : Partial<IAttackResult>) : void {
        let attackerOptions = this.getAttackOptions(attacker, defender),
            defenderOptions = defense.getAttackOptions(attacker, defender);
        result.attack = {
            difficulty: this.ruleSet.getThreshold([
                ...attackerOptions.difficulties,
                ...defenderOptions.difficulties
            ]),
            modification: attackerOptions.modification + defenderOptions.modification,
        };
        
        result.attack.value = this.ruleSet.getAttackValue(attacker, attacker.getMeleeWeapons()[this.options.weaponIndex || 0]) + result.attack.modification;
        result.attack.result = new Roll(result.attack.value, result.attack.difficulty).roll();
    }
    
    damage(defense : Defense, attacker : Character, defender : Character, result : Partial<IAttackResult>) : void {
        let attackerOptions = this.getDamageOptions(attacker, defender),
            defenderOptions = defense.getDamageOptions(attacker, defender);
        result.damage = {
            difficulty: this.ruleSet.getThreshold([
                ...attackerOptions.difficulties,
                ...defenderOptions.difficulties
            ]),
            modification: attackerOptions.modification + defenderOptions.modification,
        };
        
        result.damage.value = this.ruleSet.getDamageValue(attacker, attacker.getMeleeWeapons()[this.options.weaponIndex || 0]) + result.damage.modification;
        result.damage.result = new Roll(result.damage.value, result.damage.difficulty).roll();
    }
}

export class NormalAttack extends Attack_ {
    
    constructor(options? : { weaponIndex?: number}) {
        super(0, options);
    }
}

export class ImpactHitAttack extends Attack_ {
    
    getDamageOptions(attacker : Character, defender : Character) : { difficulties : number[]; modification : number } {
        let options = super.getDamageOptions(attacker, defender);
        
        options.modification += this.amount;
        
        return options;
    }
}

export class FeintAttack extends Attack_ {
    
    getDefenseOptions(attacker : Character, defender : Character) : { difficulties : number[]; modification : number } {
        let options = super.getDefenseOptions(attacker, defender);
        
        options.modification -= this.amount;
        
        return options;
    }
}

export class HammerBlowAttack extends Attack_ {
    
    constructor(options? : { weaponIndex? : number }) {
        super(3, options);
    }
    
    preventDefense() : boolean {
        return true;
    }
    
    protected getAttackModification(attacker : Character, defender : Character) : number {
        return Math.ceil(this.ruleSet.getAttackValue(attacker, attacker.getMeleeWeapons()[this.options.weaponIndex || 0]) / 2);
    }
    
    
    getDamageOptions(attacker : Character, defender : Character) : { difficulties : number[]; modification : number } {
        let options = super.getDamageOptions(attacker, defender);
        
        options.modification += this.getAttackModification(attacker, defender);
        
        return options;
    }
}

export class AimedStabAttack extends Attack_ {
    
    constructor(options? : { weaponIndex? : number }) {
        super(0, options);
    }
    
    
    protected getAttackDifficulties(attacker : Character, defender : Character) : number[] {
        let difficulties = super.getAttackDifficulties(attacker, defender);
        difficulties.push(-defender.getArmor());
        return difficulties;
    }
    
    
    getDamageOptions(attacker : Character, defender : Character) : { difficulties : number[]; modification : number } {
        let options = super.getDamageOptions(attacker, defender);
        options.difficulties.push(defender.getArmor());
        return options;
    }
}

