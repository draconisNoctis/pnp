import { DifficultyByWounds, DifficultyByWoundsImpl } from './difficulty';
import { Character } from '../character';
import { Constructor } from '../interfaces/helper';

export abstract class RuleSet implements DifficultyByWounds {
    protected static instance : RuleSet;
    protected static implementation : Constructor<RuleSet> = RuleSetImpl;
    
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
}

export class RuleSetImpl extends RuleSet {
    difficultyByWoundsRule : DifficultyByWounds = new DifficultyByWoundsImpl();
    
    getDifficultyByWounds(character : Character) : number {
        return this.difficultyByWoundsRule.getDifficultyByWounds(character)
    }
}
