var utils = require('utils')
var CreepActions = require('CreepActions')
var Rooms = require('Rooms')
var Const = require('Constants')

/**
 * Template model
 * @constructor
 * @param {string} role - creep role
 * @param {string} model - creep model
 * @param {int} limit - room target population
 * @param {associative array} a_rat - associative array containing ratios for body parts
 * @param {int}  a_pri - spawning priority
 * @param {array} a_fill - array of filler parts if room is left in build
 */
var Model = function( 
    role = 'default', 
    model = 'basic', 
    limit = 0,
    a_rat = { move: 3, carry: 4, work: 2 },        
    a_pri = 3,        
    a_fill = [TOUGH],
    a_defaultBody = [MOVE, MOVE, CARRY, CARRY, WORK]
    ){
    this.ratios = a_rat;
    this.priority = a_pri;
    this.filler = a_fill;
    this.memoryFields = {role: role, model: model, task: 'idle'};
    this.limit = limit;
    this.defaultBody = a_defaultBody;
};


var roles = {}

roles.upgrader = {
    models: {
        basic: new Model('upgrader', 'basic', 2, { move: 3, carry: 4, work: 2 }, 1, [MOVE,TOUGH]),
    },
    /** @param {Creep} creep **/
    run: function(creep){CreepActions.upgradeRoom(creep)},
};

roles.builder =  {
    models: {
        basic: new Model('builder', 'basic', 2, { move: 3, carry: 4, work: 2 }, 1, [MOVE,TOUGH]),
    },
    /** @param {Creep} creep **/
    run: function(creep) {  
        //Verify Task
        switch(creep.memory.task){
            case Const.tasks.BUILD: 
                if(creep.carry.energy == 0){ creep.memory.task = Const.tasks.HARVEST }
                break;
            case Const.tasks.HARVEST:
                if(_.sum(creep.carry) == creep.carryCapacity){
                    creep.memory.task = Const.tasks.BUILD;
                }
                break;
            default:
                creep.memory.task = Const.tasks.BUILD;
                break;
        }
        
        //Execute Task
        switch(creep.memory.task){
            case Const.tasks.BUILD:
                if(!CreepActions.buildStructures(creep)){
                creep.memory.task = 'idle';
                CreepActions.idle(creep);
            }
                break;
            case Const.tasks.HARVEST:
                CreepActions.withdrawEnergy(creep, creep.carryCapacity);
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
                break;
            default:
                break;
        }
    }
};

roles.harvester = {
    models: {
        basic: new Model('harvester', 'basic', 2, { move: 3, carry: 2, work: 4 }, 0, [MOVE,TOUGH]),
    },
    
    /** @param {Creep} creep **/
    run: function(creep, roleLock = true) {
        //CreepActions.requestToken( creep );
        try{
            switch(creep.memory.task){
                case Const.tasks.DELIVER:
                    if(creep.carry.energy == 0){
                        creep.memory.task = Const.tasks.HARVEST;
                    }
                    break;
                case  Const.tasks.HARVEST:
                    if(_.sum(creep.carry) == creep.carryCapacity){
                        creep.memory.task = Const.tasks.DELIVER;
                    }
                    break;
                default:
                    if(roleLock){
                        creep.memory.task = Const.tasks.HARVEST;
                    }
            }
            
            
            switch(creep.memory.task){
                case Const.tasks.DELIVER:
                    if(creep.memory.token != null){
                        CreepActions.returnToken(creep);
                    }
                    
                    var container = Rooms.findLowEnergyStructures(creep.room)[0]   //finds nearest container capable of storing energy
                    if(container) {
                        var result = creep.transfer(container, RESOURCE_ENERGY)
                        if(result == ERR_NOT_IN_RANGE) {
                            creep.moveTo(container);
                        }
                    }
                    else{
                        CreepActions.idle(creep);
                    }
                    break;
                case  Const.tasks.HARVEST:
                    //CreepActions.harvestEnergy(creep)
                    var source = creep.pos.findClosestByPath(Rooms.getAvailableSources(creep.room))
                    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source)
                    }
                    break;
                default:
            }
            
        }
        catch(err){
            console.log('harvester.run.' + err)
        }
    }
};

roles.worker = {
    models: {
        basic: new Model('worker', 'basic', 1, { move: 3, carry: 4, work: 2 }, 3, [MOVE,TOUGH]),
    },
    
    /** Collects dropped resources and puts them in storage
     * @Param {cree} creep - the creep to do the work
     */
    run: function(creep){
        switch(creep.memory.task){
            case Const.tasks.CLEAN:
                if( _.sum(creep.carry) == creep.carryCapacity){
                    creep.memory.task = Const.tasks.DELIVER;
                }
                break;
            case Const.tasks.DELIVER:
                CreepActions.depositResource(creep,RESOURCE_ENERGY)
                break;
            default:
                creep.memory.task = Const.tasks.CLEAN;  
                break;
        }
        //Execute Task
        switch(creep.memory.task){
            case Const.tasks.CLEAN:
                CreepActions.cleanFloor(creep);
            default:
                creep.memory.task = Const.tasks.CLEAN;  
                break;
        }
    }
};


module.exports = roles;