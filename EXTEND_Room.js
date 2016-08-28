/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('EXTEND_Room');
 * mod.thing == 'a thing'; // true
 */
Room.prototype.initialize = function(){
    
}

Room.prototype.maintainCreepLevels = function(){
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
        var result = CreepFactory.checkResult(CreepFactory.createCreep(this, role, model, energyLimit))
        if(logging){console.log(result)}
    }
}