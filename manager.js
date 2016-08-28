var roles = require('roles');
var utils = require('utils');
var CreepFactory = require('CreepFactory');
var Rooms = require('Rooms')




/**
 *  MANAGER CLASS
 * 
 * 
 * 
 */

var manager = {}

manager.towers = {
    run: function(room){
        
    }
}

manager.creeps = {
    run: function(room){
        try{
            for(var name in Game.creeps) {
                var creep = Game.creeps[name];
                roles[creep.memory.role].run(creep);
            }
        }
        catch(err){
            throw new Error( 'manager.creeps.run:\n' + err)
        }
        
    },
    
    maintainLevels: function(room, logging=false){
        var energyLimit =  room.energyCapacityAvailable;
       Rooms.memoryCleanup();
        var assemblyList = [];
        var role;
        var model;
        
        for(var roleName in roles){
            for(var modelName in roles[roleName].models){
                role = roles[roleName];
                model = role.models[modelName];
                var creepList = _.filter(room.find(FIND_MY_CREEPS), function(creep){
                    return (creep.memory.role == roleName && creep.memory.model == modelName);
                })
                if(creepList.length < model.limit){
                    assemblyList.push({role: roleName, model: modelName, priority: model.priority})
                }
            }
        }
        
        if(assemblyList.length > 0){
            assemblyList.sort(function(a,b){return (a.priority - b.priority)})
            var role = roles[assemblyList[0].role]
            var model = role.models[assemblyList[0].model]
            var result = CreepFactory.checkResult(CreepFactory.createCreep(room, role, model, energyLimit))
            if(logging){console.log(result)}
        }
        
    },
}

module.exports = manager;