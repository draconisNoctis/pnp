import { Character, Weapon } from '../character';

export abstract class ValueByWeapon {
    abstract getAttackValue(character : Character, weapon: Weapon) : number;
    abstract getDefenseValue(character : Character, weapon: Weapon) : number;
    abstract getDamageValue(character : Character, weapon: Weapon) : number;
}

export class ValueByWeaponImpl extends ValueByWeapon {
    
    protected getBase(character : Character, weapon : Weapon) {
        return character.getAttributeValue(weapon.attribute)
            + character.getAbilityValue(weapon.ability)
            + character.getTalentValue(weapon.talent, weapon.name)
    }
    
    getAttackValue(character : Character, weapon : Weapon) : number {
        return this.getBase(character, weapon) + weapon.attack;
    }
    
    getDefenseValue(character : Character, weapon : Weapon) : number {
        return this.getBase(character, weapon) + weapon.defense;
    }
    
    getDamageValue(character : Character, weapon : Weapon) : number {
        return weapon.damage;
    }
}
