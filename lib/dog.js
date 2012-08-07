
var request = require('request'),
  DogEvents = require('./dogEvents.js'),
  inspector = require('./inspector.js');

function Dog(options){
  this.url = options.url;
  this.interval = options.interval || 5000;
  this.html = options.html || '';

  this.dogEvents = new DogEvents();
  this.selectors = [];

  this.start();
};

module.exports = Dog;

Dog.prototype = {

  start: function(){
    var self = this;

    this.timer = setInterval(function(){
      makeRequest.call(self);
    }, this.interval);
  },

  wait: function(){
    clearInterval(this.timer);
  },

  on: function(name, selector, callback){
   
    if (typeof selector == 'string') {
      this.dogEvents.add(name, selector, callback);

      var content = inspector.getContent(this.html, selector);
      this.selectors.push({
        selector: selector,
        lastResult: content
      });
    }
    else {
      callback = selector;
      this.dogEvents.add(name, callback);
    }

    return this;
  },

  off: function(name, selector){

    this.dogEvents.remove(name, selector);

    for (var i=0; i<this.selectors.length; i++){
      if (this.selectors[i].selector === selector){
        this.selectors.splice(i, 1);
        break;
      }
    }

    return this;
  }
};

function makeRequest(){
  var self = this;

  request(self.url, function (error, response, body) {

    self.dogEvents.emit('look', body);

    if (!error) {
      resolveChanges.call(self, body);
      self.html = body;
    }
    else {
      self.dogEvents.emit('error', error);
    }

  });
}

function resolveChanges(newHtml){
  if (newHtml != this.html) {
    
    this.dogEvents.emit('change', {
      now: newHtml,
      before: this.html
    });

    var selectorsUpdated = [];
    for(var i=0; i < this.selectors.length; i++) {
      var selector = this.selectors[i];

      var elements = inspector.getContent(newHtml, selector.selector);
      var lastElements = selector.lastResult;

      var elementsHasChanged = false;
      if (elements.length != lastElements.length){
        elementsHasChanged = true;
      }
      else {
        for(var j=0; j<elements.length; j++){
          if(elements[j] != lastElements[j]){
            elementsHasChanged = true;
            break;
          }
        }
      }

      if (elementsHasChanged){
        selector.result = elements;
        selector.lastResult = lastElements;
        selectorsUpdated.push(selector);
      }
    }

    if (selectorsUpdated.length > 0)
      this.dogEvents.emit('change', selectorsUpdated);
  }
}