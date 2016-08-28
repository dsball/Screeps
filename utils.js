var utils = {}
//returns id of closest hostile if one exists
utils.closestHostile = (tower) => {tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)};

//returns id of closest damaged structure if one exists
utils.closestDamagedStructure = (tower) => {tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax})};

utils.checkEnergy = function(){
    for(var name in Game.rooms) {
        return Game.rooms[name].energyAvailable;
    }
};

//Test if there is room for a creep next to the object
utils.getAccessPoints = function(room, pos){
    var accessPoints = [];
    for(var i = -1 ; i <= 1 ; i++){
        for(var j = -1 ; j <= 1 ; j++){
            var tile = room.lookForAt('terrain', pos.x + i, pos.y + j)
            if(tile != 'wall'){
                accessPoints.push();
            }
        }
    }
    return accessPoints;
}

utils.parseError = function(err){
    switch(err){
        case OK: return 'OK'
        case ERR_NOT_OWNER: return 'not owner';
        case ERR_NO_PATH: return "no path found";
        case ERR_NAME_EXISTS: return "name is taken";
        case ERR_BUSY: return "busy";
        case ERR_NOT_FOUND: return "not found";
        case ERR_NOT_ENOUGH_ENERGY: return "not enough energy";
        case ERR_NOT_ENOUGH_RESOURCES: return "not enough resources";
        case ERR_INVALID_TARGET:return  "invalid target";
        case ERR_FULL: return "full";
        case ERR_NOT_IN_RANGE: return "not in range";
        case ERR_INVALID_ARGS: return "invalid args";
        case ERR_TIRED: return "tired";
        case ERR_NO_BODYPART:return  "no bodypart";
        case ERR_NOT_ENOUGH_EXTENSIONS: return "not enough extensions";
        case ERR_RCL_NOT_ENOUGH: return "RCL not enough";
        case ERR_GCL_NOT_ENOUGH: return "GCL not enough";
        default: return 'undefined error'
    }
}

utils.logStatus = function(){
    
}


module.exports = utils; 

