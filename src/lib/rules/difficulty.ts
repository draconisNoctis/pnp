import { Character } from '../character';

export abstract class DifficultyByWounds {
    
    abstract getDifficultyByWounds(character : Character) : number;
}

export class DifficultyByWoundsImpl extends DifficultyByWounds {
    
    getDifficultyByWounds(character : Character) : number {
        if(0 === character.getWounds()) {
            return 0;
        }
        return -(character.getWounds() * 2 - 1)
    }
}
