export interface IRawCharacter {
    name: string;
    className: string;
    race: string;
    culture: string;
    description?: string;
    
    attributes: IRawAttributes;
    abilities: IRawAbilities;
    talents: IRawTalent[];
    
    armor: number;
    weapons: {
        melee: IRawWeapon[];
        range: IRawWeapon[];
    };
    wounds: number;
}

export interface IRawAttributes {
    strength: IRawAttribute;
    agility: IRawAttribute;
    physique: IRawAttribute;
    dexterity: IRawAttribute;
    wisdom: IRawAttribute;
    intuition: IRawAttribute;
    willpower: IRawAttribute;
    courage: IRawAttribute;
    charisma: IRawAttribute;
}

export interface IRawAttribute {
    value: number;
}

export interface IRawAbilities {
    melee: IRawAbility;
    range: IRawAbility;
    physical: IRawAbility;
    mental: IRawAbility;
    magic: IRawAbility;
}

export interface IRawAbility {
    value: number;
}

export interface IRawTalent {
    name: string;
    value: number;
    abilities: (keyof IRawAbilities)[];
    spezializations?: IRawSpezialization[];
}

export interface IRawSpezialization {
    name: string;
    value: number;
}

export interface IRawWeapon {
    name: string;
    talent: string;
    ability: 'melee'|'range';
    attribute: keyof IRawAttributes;
    
    attack: number;
    defense: number;
    damage: number;
}
