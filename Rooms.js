var utils = require('utils')


/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('Rooms');
 * mod.thing == 'a thing'; // true
 */
var Rooms = {
    
    /** TODO: 
     *  creates or updates a room map at room.memory.map = []
     *  each index contains customized information on that location:
     *      danger: a danger level associated with the tile
     */
    updateRoomMap: function(room){
        enemyStructs = room.find(FIND_HOSTILE_STRUCTURES);
        
    },
    
    //this is in the wrong place
    memoryCleanup: function(){
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                
                
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    },
    
    /**
     * Reclaims" "stale" tokens held by dead creeps
     * @param {room} room - the room to be checked
     * for stale tokens. 
     */
    
    getAvailableSources: function(room){
        var sourceList = []
        _.forEach(room.memory.sources, function(source, key){
            if(source.current < source.total){
                sourceList.push(Game.getObjectById(key))
            }
        })
        return sourceList
    },
    
    initializeRoomStatus: function(room)
    {
        room.memory.sources = {}
        var sources = room.find(FIND_SOURCES);
        for(var i in sources){
            var source = sources[i]
            room.memory.sources[source.id] = {free: 0 , access_points: utils.getAccessPoints(room, source.pos)}
        }
        room.memory.initialized = true;
    },
    
    updateRoomStatus: function(room){
        _.forEach(room.sources, function(sourceInfo, ID){
            for(var point in sourceInfo.access_points){
                
            }
        })
    },
    
    
    /** Returns token to source with ID
     * 
     */
    
    
    findStorage: function(room){
        var targets = room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                            structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_STORAGE
                            ) && _.sum(container.store) < structure.storeCapacity;
                }
        });
        return targets
    },
    
    /** a test
     */
    test: function(){
        
    },
    
    findLowEnergyStructures: function(room){
        var targets = room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_STORAGE ||
                            structure.structureType == STRUCTURE_TOWER 
                            ) && structure.energy < structure.energyCapacity;
                }
        });
        return targets
    }
}

module.exports = Rooms