/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('CreepFactory');
 * mod.thing == 'a thing'; // true
 */
 
var CreepFactory = {
    parts: {
        MOVE: MOVE,
        WORK: WORK,
        CARRY: CARRY,
        ATTACK: ATTACK,
        RANGED_ATTACK: RANGED_ATTACK,
        HEAL: HEAL,
        TOUGH: TOUGH
    },

    costs: {
        move: 50,
        work: 100,
        carry: 50,
        attack: 80,
        ranged_attack: 150,
        heal: 200,
        tough: 10
    },

    getBodyCost: function(body)
    {
        var cost = 0;
        for(var index in body){
            cost += this.costs[body[index]]
        }
        return cost;
    },
    
    
    generateBody: function(energyLimit, ratios, fillerParts, defaultBody){
        
        const PARTMAX=50
        var minRat = Infinity;
        var minPart;
        // determine normalizer := smallest value in ratios
        _.forEach(ratios, function(ratio, part){
            if(ratio < minRat){
                minRat = ratio
                minPart = part
            }
        })
        //Create new associative array of adjusted ratios
        var adjustedRatios = {};
        for(var part in ratios){
            adjustedRatios[part] = ratios[part]/minRat;
        }
  
        // determine maximum value for key normalizer
        // and energy cost for minimum configuration
        var baseParts = 0;
        var baseEnergy = 0;
        for(var name in adjustedRatios){
            baseParts += adjustedRatios[name];
            baseEnergy += this.costs[name]*adjustedRatios[name];
        }
        var maxMultiplier = PARTMAX/baseParts;
        var multiplier = Math.floor(Math.min(maxMultiplier, energyLimit/baseEnergy));
        if(!multiplier){
            return defaultBody
        }
        //build body based off of normalizer
        var body = []
        for(var name in adjustedRatios){
            for(var i = 0 ; i < adjustedRatios[name]*multiplier ; i++){
                body.push(name);
            }
        }

        //if parts remain, use filler part(s) to reach PARTMAX
        if(fillerParts){
            var energyCost = 0;
            for(var index in body){
                energyCost += this.costs[body[index]];
            }
            
            if(fillerParts)
            {
                var fill;
                    while(fill === true){
                        fill = false;
                        for(var i = 0 ; i < fillerParts.length ; i++){
                            var newEnergyCost = energyCost + this.costs[fillerParts[i]];
                            if( newEnergyCost <= energyLimit ){
                                body.push(fillerParts[i]);
                                energyCost = newEnergyCost;
                                fill = true;
                            }
                        }
                    }
                }
        }
        
        return body;
    },
    
    createCreep: function(room, role, model, energyLimit){
        // Generate Body
        var body = CreepFactory.generateBody(energyLimit, model.ratios, model.filler, model.defaultBody);
        
        //Get list of room spawners
        var spawners = room.find(FIND_MY_SPAWNS);
        
        //attempt to spawn from any available spawner in the room
        for(var spawner in spawners){
            var newName = spawners[spawner].createCreep(body, undefined, model.memoryFields);
            if(newName >= 0){
                break;
            }
        }
        return newName;
    },
    
    checkResult: function(result){
        var resultString = 'Error: ';
        switch(result){
            case ERR_NOT_OWNER:
                return resultString + 'Not Spawn Owner.';
                
            case ERR_NAME_EXISTS:
                return resultString + 'Duplicate Creep name.';
            
            case ERR_BUSY:
                return resultString + 'Spawn Busy.';
            
            case ERR_NOT_ENOUGH_ENERGY:
                return resultString + 'Not Enough Energy.';
            
            case ERR_INVALID_ARGS:
                return resultString + 'Malformed Body.';
            
            case ERR_RCL_NOT_ENOUGH:
                return resultString + 'Controller Too Low.';
            default:
                return 'Spawned new creep: ' + result;
        }
        
    }
    
}

module.exports = CreepFactory;