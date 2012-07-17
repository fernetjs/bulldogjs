
var events = require('events');

function DogEvents(){
	this.eventEmitter = new events.EventEmitter();
}

module.exports = DogEvents;

DogEvents.prototype = {

	add: function(name, selector, callback){

		var evName = getEventName.call(this, name, selector);

    if (!callback)
      callback = selector;

    this.eventEmitter.addListener(evName, callback);
  },

  remove: function(name, selector){
		var evName = getEventName.call(this, name, selector);
    this.eventEmitter.removeAllListeners(evName);
  },

  emit: function(name, selectors){

  	if (!Array.isArray(selectors)) {
  		var content = selectors;
  		this.eventEmitter.emit(name, content);
  	}
  	else{
      
      for (var i=0; i<selectors.length; i++) {
        var s = selectors[i];
        this.eventEmitter.emit('change|' + s.selector, {
        	after: s.result, 
        	before: s.lastResult
        });
      }
  	}
  }
};

function getEventName(name, selector){

	switch(name){
		case 'look':
		case 'sniff':
			return 'look';
			break;

		case 'error':
		case 'poop':
			return 'error';
			break;

		case 'change':
		case 'bark':
			if (typeof selector == 'string') {
				return 'change' + '|' + selector;
			}
			else return 'change';
			break;
	}

	throw new Error('Event name ' + name + ' not supported');
}