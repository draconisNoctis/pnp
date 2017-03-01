import { Dice } from './dice';

export class Roll {
    constructor(protected quantity : number,
                protected difficulty : number,
                protected dice : Dice = Dice.D20) {
    }
    
    roll() : number {
        let critical = 0,
            success = 0;
        
        for(let i = 0; i < this.quantity; ++i) {
            let roll = this.dice.roll();
            
            switch(roll) {
                case 1:
                    critical++;
                    break;
                case 20:
                    success--;
                    break;
                default:
                    if(roll <= this.difficulty) {
                        success++;
                    } else {
                        success--;
                    }
            }
        }
        
        if(critical) {
            return Math.min(critical, success + success);
        } else {
            return success;
        }
    }
}
