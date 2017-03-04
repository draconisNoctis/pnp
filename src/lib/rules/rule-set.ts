import { DifficultyByWounds, DifficultyByWoundsImpl } from './difficulty';
import { Character, Weapon } from '../character';
import { Constructor } from '../interfaces/helper';
import { WoundsByDamage, WoundsByDamageDirect } from './wounds';
import { ValueByWeapon, ValueByWeaponImpl } from './weapon';

export abstract class RuleSet implements DifficultyByWounds, WoundsByDamage, ValueByWeapon {
    protected static instance : RuleSet;
    protected static implementation : Constructor<RuleSet>;
    
    static setImplementation(implementation : Constructor<RuleSet>) {
        if(this.instance) {
            this.instance = null;
        }
        this.implementation = implementation;
    }
    static getInstance() : RuleSet {
        if(!this.instance) {
            this.instance = new this.implementation();
        }
        return this.instance;
    }
    
    abstract getDifficultyByWounds(character : Character) : number;
    abstract getWoundsByDamage(character : Character, damage : number) : number;
    
    abstract getAttackValue(character : Character, weapon : Weapon) : number;
    abstract getDefenseValue(character : Character, weapon : Weapon) : number;
    abstract getDamageValue(character : Character, weapon : Weapon) : number;
    
    abstract getThreshold(difficulties : number[]) : number;
}

export class RuleSetImpl extends RuleSet {
    difficultyByWoundsRule : DifficultyByWounds = new DifficultyByWoundsImpl();
    woundsByDamage : WoundsByDamage = new WoundsByDamageDirect();
    valueByWeapon : ValueByWeapon = new ValueByWeaponImpl();
    
    getDifficultyByWounds(character : Character) : number {
        return this.difficultyByWoundsRule.getDifficultyByWounds(character)
    }
    
    getWoundsByDamage(character : Character, damage : number) : number {
        return this.woundsByDamage.getWoundsByDamage(character, damage);
    }
    
    getThreshold(difficulties : number[]) : number {
        return difficulties.reduce((t, c) => t + c, 10);
    }
    
    getAttackValue(character : Character, weapon : Weapon) : number {
        return this.valueByWeapon.getAttackValue(character, weapon);
    }
    
    getDefenseValue(character : Character, weapon : Weapon) : number {
        return this.valueByWeapon.getDefenseValue(character, weapon);
    }
    
    getDamageValue(character : Character, weapon : Weapon) : number {
        return this.valueByWeapon.getDamageValue(character, weapon);
    }
}


RuleSet.setImplementation(RuleSetImpl);
