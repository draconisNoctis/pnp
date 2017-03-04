import { Dice } from './dice';

export class Roll {
    constructor(protected quantity : number,
                protected difficulty : number,
                protected dice : Dice = Dice.D20) {
    }
    
    roll() : number {
        let critical = 0,
            success = 0,
            rolls = [];
        
        for(let i = 0; i < this.quantity; ++i) {
            let roll = this.dice.roll();
            rolls.push(roll);
            
            if(1 === roll) {
                critical++;
            } else if(20 === roll) {
                success--;
            } else if(roll <= this.difficulty) {
                success++;
            }
        }
        
        if(critical) {
            return Math.max(critical, success + critical);
        } else {
            return success;
        }
    }
}
