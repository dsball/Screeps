var manager = require('manager');
var Rooms = require('Rooms');
require('EXTEND_RoomPosition')
require('EXTEND_Creep')
require('EXTEND_Room')

//////////////////
//   HELPERS    //
//////////////////

const TEST = 'test'
var runRoom = function(room){
    manager.creeps.maintainLevels(room);
    manager.creeps.run(room);
    manager.towers.run(room);
}

var periodicUpdate = function(period){
    if(!Memory.tickCount){
        Memory.tickCount = period
        console.log(period + ' ticks')
    }
    Memory.tickCount--;
}

//////////////////
//     MAIN     //
//////////////////

module.exports.loop = function(){
    
    _.forEach(Game.creeps, function(creep){
        //creep.report();
    })
    
    periodicUpdate(50);
    _.forEach(Game.rooms, function(room){
        if(!room.memory.initialized){
            Rooms.initializeRoomStatus(room);            
        }
        else{
            Rooms.updateRoomStatus(room)
        }
        runRoom(room);
    });
}