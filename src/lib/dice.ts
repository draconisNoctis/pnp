export class Dice {
    static D20 = new Dice(20);
    
    constructor(public max : number) {}
    
    roll() : number {
        return Math.floor(Math.random() * this.max) + 1
    }
}
