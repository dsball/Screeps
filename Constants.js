/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('Constants');
 * mod.thing == 'a thing'; // true
 */

/**
 */
var Constants = {
    tasks: {
        BUILD: 'build',
        HARVEST: 'harvest',
        REPAIR: 'repair',
        HEAL: 'heal',
        IDLE: 'idle',
        UPGRADE: 'upgrade',
        DELIVER: 'deliver',
    }

}

module.exports = Constants