import { Character } from '../character';

export abstract class WoundsByDamage {
    abstract getWoundsByDamage(character : Character, damage : number) : number;
}

export class WoundsByDamageDirect extends WoundsByDamage {
    
    getWoundsByDamage(character : Character, damage : number) : number {
        return damage;
    }
}

export class WoundsByDamageThreshold extends WoundsByDamage {
    
    getWoundsByDamage(character : Character, damage : number) : number {
        return Math.floor(damage / character.getAttributeValue('physique'));
    }
}
