var Rooms = require('Rooms')
var Const = require('Constants')
var utils = require('utils')
/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('CreepActions');
 * mod.thing == 'a thing'; // true
 */

var getSourceList = function(room){
    
}

var CreepActions = {
    
    
    idle: function(creep){
        var IdleFlag = _.filter(creep.room.find(FIND_FLAGS), (flag) => flag.name == 'Idle')[0]
        creep.moveTo(IdleFlag)
    },
    
    
    /** Requests a token from the current room
     *  Returns:
     *      success: token for nearest available source
     *      failure: null
     * @param {creep} creep - creep requesting a token
     */

    
    // Returns token to owner from creep memory
    // 
    selectSource: function(creep){
        
    },
    
    cleanFloor: function(creep, logging = false){
        var resource = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES)
        if(resource){
            if(logging){console.log('no dropped resources')}
        }
        else{
            var result = creep.moveTo(resource)
            if(logging){
                console.log(utils.parseError(result))
            }
        }
    },
    
    // Attempts to gather energy, 
    //  returns 
    //    success: structure gathered from
    //    failure: null
    withdrawEnergy: function(creep, level){
        var dest;
        var availEnergyFilter = function(structure){
            return (
                structure.structureType == STRUCTURE_CONTAINER ||
                structure.structureType == STRUCTURE_STORAGE
                ) && structure.store[RESOURCE_ENERGY] > 0
        }
        if(creep.carry.energy < level){
            dest = creep.pos.findClosestByPath(FIND_STRUCTURES, {  filter: availEnergyFilter });
            if(dest){
                if(creep.withdraw(dest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(dest);
                }
            }
        }
        return dest;
    },
    
    // Attempts to gather energy from stores 
    //  returns 
    //    success: structure deposited to
    //    failure: null
    depositEnergy: function(creep){
        var dest;
        var lowEnergyFilter = function(structure){
            return (
                structure.structureType == STRUCTURE_CONTAINER ||
                structure.structureType == STRUCTURE_STORAGE
                ) && _.sum(structure.store) < structure.storeCapacity;
        }
        
        if(creep.carry.energy < level){
            dest = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: lowEnergyFilter });
            if(dest){
                if(creep.transfer(dest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(dest);
                }
            }
        }
        return dest;
    },
    
    depositResource: function(creep, type){
        var containers = Rooms.findStorage(creep.room )
        containers.sort(containers, function(a,b){
            a
        })
        
        switch(type){
            case RESOURCE_ENERGY:
                depositEnergy(creep);
                break;
            default:
                break;
        }
    },
    
    /** harvest from the source indicated by creep.memory.token
      */
    harvestEnergy: function(creep){
        try{
            console.log(creep.memory.token.ID)
            var source = creep.memory.token.ID;
            if(source){
                var source = Game.getObjectById(source);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0])
                }
            }
            else{
                return null;
            }
        }
        catch(err)
        {
            throw new Error(err + '/nin: ' + harvestEnergy)
        }
    },
    
    upgradeRoom: function(creep){
        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('harvesting');
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('upgrading');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
    },
    
    repairStructures: function(creep){
        var structures = creep.room.find(FIND_STRUCTURES)
        CreepActions.idle(creep);
    },
    
    buildStructures: function(creep){
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if(targets.length) {
            if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
            return true;
        }
        else{
            return false;
        }
    },
}

module.exports = CreepActions;