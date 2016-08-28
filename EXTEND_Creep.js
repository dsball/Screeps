Creep.prototype.report = function(){
    this.say(this.test_carryPercent().toFixed(1) + '%')
}

Creep.prototype.test_carryPercent = function(){
    return (100*(_.sum(this.carry)/this.carryCapacity)) 
}

Creep.prototype.test_energyPercent = function(){
    return (100*(this.carry.energy/this.carryCapacity))  
}

/** Creep moves toward <structure>
 *  When in range, transfers <amount> of <resource> to <structure>
 *  @param {structure} creep - structure to deliver to
 *  @param {resource} resource - resource to deliver. Defaults to RESOURCE_ENERGY
 *  @param {int} amount - amount to deliver. Defaults to all.
 */
Creep.prototype.deliver = function(structure, resource, amount){
    
}

Creep.prototype.findNearestPath = function(){
    
}


Creep.prototype.idle = function(){
    
}