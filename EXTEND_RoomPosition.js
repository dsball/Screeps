/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('EXTEND_RoomPosition');
 * mod.thing == 'a thing'; // true
 */
 
 /** Tests if terrain at the position is walkable by a creep.
 */
RoomPosition.prototype.isWalkable = function(){
    var objs = this.look()
    for(var i = 0 ; i < objs.length ; i++){
        var object = objs[i];
        var name = null;
        switch(object.type){
            case 'terrain':
                name = object.terrain;
                break;
            case 'structure':
                name = object.structureType;
                break;
            case 'source': 
                name = 'source'
                break;
            default: 
        }
        return(!_.includes(OBSTACLE_OBJECT_TYPES, name ));
    }
    return false;
};
