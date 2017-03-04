import { Attack } from './simulator/attack';
import { Defense } from './simulator/defense';
import { Character } from './character';

export interface ISimulatorResult {
    stats: {
        attacker: {
            damage: {
                average: number;
                median: number;
            }
        };
        defender: {
            damage: {
                average: number;
                median: number;
            }
        };
        result: {
            draw : {
                percent : number;
                total : number;
            };
            attackerWin : {
                percent : number;
                total : number;
            };
            defenderWin : {
                percent : number;
                total : number;
            };
        };
        averageRounds: number;
        medianRounds: number;
        total: number;
    };
    battles: IBattleResult[];
}

export class Simulator {
    constructor(protected attacker : Character,
                protected defender : Character,
                protected attackerAttack : Attack,
                protected attackerDefense : Defense,
                protected defenderAttack : Attack,
                protected defenderDefense : Defense) {
        
    }
    
    setAttackerAttack(attack : Attack) : this {
        this.attackerAttack = attack;
        return this;
    }
    
    setAttackerDefense(defense : Defense) : this {
        this.attackerDefense = defense;
        return this;
    }
    
    simulate(count : number): ISimulatorResult {
        let result : Partial<ISimulatorResult> = {
            stats: {
                attacker: {
                    damage: {
                        average: 0,
                        median: 0
                    }
                },
                defender: {
                    damage: {
                        average: 0,
                        median: 0
                    }
                },
                result: {
                    draw: {
                        percent: 0,
                        total: 0
                    },
                    attackerWin: {
                        percent: 0,
                        total: 0
                    },
                    defenderWin: {
                        percent: 0,
                        total: 0
                    }
                },
                averageRounds: 0,
                medianRounds: 0,
                total: count
            },
            battles: []
        };
        
        for(let i = 0; i < count; ++i) {
            let battleSim = new BattleSimulator(
                this.attacker.clone(),
                this.defender.clone(),
                this.attackerAttack,
                this.attackerDefense,
                this.defenderAttack,
                this.defenderDefense
            );
            
            result.battles.push(battleSim.simulate());
        }
        
        for(let battle of result.battles) {
            switch(battle.winner) {
                case 'draw':
                    result.stats.result.draw.total++;
                    break;
                case 'attacker':
                    result.stats.result.attackerWin.total++;
                    break;
                case 'defender':
                    result.stats.result.defenderWin.total++;
                    break;
            }
            
            result.stats.result.draw.percent = result.stats.result.draw.total / result.battles.length * 100;
            result.stats.result.attackerWin.percent = result.stats.result.attackerWin.total / result.battles.length * 100;
            result.stats.result.defenderWin.percent = result.stats.result.defenderWin.total / result.battles.length * 100;
            
            let battleRounds = result.battles.map(battle => battle.rounds.length);
            
            result.stats.medianRounds = median(battleRounds);
            result.stats.averageRounds = avg(battleRounds);
            
            let attackerDamage : number[] = [],
                defenderDamage : number[] = [];
            
            for(let battle of result.battles) {
                for(let round of battle.rounds) {
                    if(null != round.attacker.damage) {
                        attackerDamage.push(round.attacker.damage.result);
                    }
                    if(round.defender && null != round.defender.damage) {
                        defenderDamage.push(round.defender.damage.result);
                    }
                }
            }
            
            result.stats.attacker.damage.average = avg(attackerDamage);
            result.stats.attacker.damage.median = median(attackerDamage);
            
            result.stats.defender.damage.average = avg(defenderDamage);
            result.stats.defender.damage.median = median(defenderDamage);
        }
        
        return result as ISimulatorResult;
    }
}

export interface IRound {
    attacker: IAttackResult;
    defender?: IAttackResult;
}

export interface IBattleResult {
    winner: 'attacker'|'defender'|'draw';
    rounds: IRound[];
}

export class BattleSimulator {
    constructor(protected attacker : Character,
                protected defender : Character,
                protected attackerAttack : Attack,
                protected attackerDefense : Defense,
                protected defenderAttack : Attack,
                protected defenderDefense : Defense) {
        
    }
    
    simulate() : IBattleResult {
        let result : Partial<IBattleResult> = {
            rounds: []
        };
        
        let attackerSim = new AttackSimulator(this.attacker, this.defender),
            defenderSim = new AttackSimulator(this.defender, this.attacker);
        
        while(this.attacker.isAlive() && this.defender.isAlive()) {
            let round : IRound = {
                attacker: attackerSim.simulate(this.attackerAttack, this.defenderDefense)
            };
            // console.log('attacker', 'attack', round.attacker.attack);
            // console.log('defender', 'defense', round.attacker.defense);
            // console.log('attacker', 'damage', round.attacker.damage);
            
            if(round.attacker.status === 'hit') {
                this.defender.setWounds(this.defender.getWounds() + round.attacker.damage.result);
            }
            
            if(this.defender.isAlive()) {
                round.defender = defenderSim.simulate(this.defenderAttack, this.attackerDefense);
    
    
                // console.log('  >>  ', 'defender', 'attack', round.defender.attack);
                // console.log('  >>  ', 'attacker', 'defense', round.defender.defense);
                // console.log('  >>  ', 'defender', 'damage', round.defender.damage);
                
                if(round.defender.status === 'hit') {
                    this.attacker.setWounds(this.attacker.getWounds() + round.defender.damage.result);
                }
            }
            
            result.rounds.push(round);
        }
        
        result.winner = this.attacker.isAlive() ? 'attacker' : 'defender';
        
        return result as IBattleResult;
    }
}

export interface IAttackResult {
    status : 'miss'|'defense'|'hit';
    attack?: {
        difficulty?: number;
        modification?: number;
        value?: number;
        result?: number;
    };
    defense?: {
        difficulty?: number;
        modification?: number;
        value?: number;
        result?: number;
    };
    damage?: {
        difficulty?: number;
        modification?: number;
        value?: number;
        result?: number;
    }
}

export class AttackSimulator {
    
    constructor(protected attacker : Character, protected defender : Character) {
        
    }
    
    simulate(attack : Attack, defense : Defense) : IAttackResult {
        let result : Partial<IAttackResult> = {};
        
        attack.attack(defense, this.attacker, this.defender, result);
        
        if(result.attack.result >= 0) {
            defense.defense(attack, this.attacker, this.defender, result);
            
            if(0 <= result.attack.result - result.defense.result) {
                result.status = 'hit';
                attack.damage(defense, this.attacker, this.defender, result);
            } else {
                result.status = 'defense';
            }
        } else {
            result.status = 'miss';
        }
        
        
        return result as IAttackResult;
    }
}

function avg(arr : number[]) : number {
    return arr.reduce((t, c) => t + c, 0) / arr.length;
}

function median(arr : number[]) : number {
    arr.sort();
    return arr[arr.length/2|0];
}
