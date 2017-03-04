import { IRawCharacter, IRawAttribute, IRawAbility, IRawAttributes, IRawWeapon, IRawAbilities } from './interfaces/raw-character.interface';

export class Character {
    get name() { return this.raw.name; }
    set name(name : string) { this.raw.name = name; }
    
    get className() { return this.raw.className; }
    set className(className : string) { this.raw.className = className; }
    
    get race() { return this.raw.race; }
    set race(race : string) { this.raw.race = race; }
    
    get culture() { return this.raw.culture; }
    set culture(culture : string) { this.raw.culture = culture; }
    
    get description() { return this.raw.description; }
    set description(description : string) { this.raw.description = description; }
    
    static fromJSON(json : IRawCharacter) {
        return new this(JSON.parse(JSON.stringify(json)));
    }
    
    static create() {
        return new this({
            name: null,
            className: null,
            race: null,
            culture: null,
            
            attributes: {
                strength: createAttribute(),
                agility: createAttribute(),
                physique: createAttribute(),
                dexterity: createAttribute(),
                wisdom: createAttribute(),
                intuition: createAttribute(),
                willpower: createAttribute(),
                courage: createAttribute(),
                charisma: createAttribute()
            },
            abilities: {
                melee: createAbility(),
                range: createAbility(),
                physical: createAbility(),
                mental: createAbility(),
                magic: createAbility()
            },
            talents: [],
            
            armor: 0,
            weapons: {
                melee: [],
                range: []
            },
            wounds: 0
        })
    }
    
    private constructor(protected raw : IRawCharacter) {
        
    }
    
    toJSON() : IRawCharacter {
        return this.raw;
    }
    
    getAttributeValue(attribute : keyof IRawAttributes) : number {
        return this.raw.attributes[attribute].value;
    }
    
    getAbilityValue(ability : keyof IRawAbilities) : number {
        return this.raw.abilities[ability].value;
    }
    
    getTalentValue(talent : string, spezialization?: string) : number {
        let t = this.raw.talents.find(({ name }) => talent === name);
        if(!t) {
            return -1;
        }
        let s = spezialization && t.specializations && t.specializations.find(({ name }) => spezialization === name);
        if(!s) {
            return t.value;
        } else {
            return t.value + s.value;
        }
    }
    
    getMeleeWeapons() : Weapon[] {
        return this.raw.weapons.melee.map(raw => new Weapon(raw, this));
    }
    
    getRangeWeapons() : Weapon[] {
        return this.raw.weapons.range.map(raw => new Weapon(raw, this));
    }
    
    getWoundDifficulty() : number {
        if(this.raw.wounds) {
            return this.raw.wounds * 2 - 1;
        }
        return 0;
    }
    
    getWounds() {
        return this.raw.wounds;
    }
    
    setWounds(wounds : number) : this {
        this.raw.wounds = wounds;
        return this;
    }
    
    isAlive() : boolean {
        return this.getWounds() < 5;
    }
    
    clone() {
        return Character.fromJSON(this.toJSON());
    }
    
    getArmor() {
        return this.raw.armor;
    }
}

export class Weapon {
    get name() { return this.raw.name };
    get attribute() { return this.raw.attribute };
    get ability() { return this.raw.ability };
    get talent() { return this.raw.talent };
    
    get attack() { return this.raw.attack }
    get defense() { return this.raw.defense }
    get damage() { return this.raw.damage }
    
    
    constructor(protected raw : IRawWeapon, protected character : Character) {}
    
    getBase() {
        return this.character.getAttributeValue(this.attribute)
            + this.character.getAbilityValue(this.ability)
            + this.character.getTalentValue(this.talent)
    }
    
    getAttack() {
        return this.getBase() + this.raw.attack;
    }
    
    getDefense() {
        return this.getBase() + this.raw.defense;
    }
    
    getDamage(base : number) {
        return base + this.raw.damage;
    }
}

function createAttribute(value = 0) : IRawAttribute {
    return { value }
}

function createAbility(value = 0) : IRawAbility {
    return { value };
}
